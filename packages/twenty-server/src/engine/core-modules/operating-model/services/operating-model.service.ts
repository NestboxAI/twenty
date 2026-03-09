import { Injectable, Logger } from '@nestjs/common';

import * as path from 'path';

import matter from 'gray-matter';

import {
  OperatingModelApplyResultDto,
  OperatingModelFileDto,
  OperatingModelSaveResultDto,
  OperatingModelVersionDto,
  WorkspaceAgentStatusDto,
  WorkspaceCommandDto,
} from 'src/engine/core-modules/operating-model/dtos/operating-model-file.dto';
import { ModelTab } from 'src/engine/core-modules/operating-model/enums/model-tab.enum';
import { BoilerplateService } from 'src/engine/core-modules/operating-model/services/boilerplate.service';
import { DeployService } from 'src/engine/core-modules/operating-model/services/deploy.service';
import { FileValidationService } from 'src/engine/core-modules/operating-model/services/file-validation.service';
import { GitService } from 'src/engine/core-modules/operating-model/services/git.service';
import { SshKeyService } from 'src/engine/core-modules/operating-model/services/ssh-key.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const TAB_SUBDIR_MAP: Record<ModelTab, string> = {
  [ModelTab.COMMANDS]: 'claude-plugin/commands',
  [ModelTab.SKILLS]: 'claude-plugin/skills',
  [ModelTab.AGENTS]: 'claude-plugin/agents',
  [ModelTab.HOOKS]: 'claude-plugin/hooks',
};

interface ConfigJson {
  status: string;
  pluginName?: string;
  lastAppliedCommitSha?: string;
  lastAppliedAt?: string;
  lastAppliedByUserId?: string;
  errorMessage?: string;
  nestboxAgentId?: string;
}

@Injectable()
export class OperatingModelService {
  private readonly logger = new Logger(OperatingModelService.name);

  constructor(
    private readonly gitService: GitService,
    private readonly fileValidationService: FileValidationService,
    private readonly boilerplateService: BoilerplateService,
    private readonly deployService: DeployService,
    private readonly sshKeyService: SshKeyService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  private getRepoPath(): string {
    return this.twentyConfigService.get(
      'OPERATING_MODEL_REPO_PATH',
    ) as string;
  }

  private getWorkspacePath(workspaceId: string): string {
    return path.join(this.getRepoPath(), workspaceId);
  }

  private getPluginPath(workspaceId: string): string {
    return path.join(workspaceId, 'claude-plugin');
  }

  private async readConfig(workspaceId: string): Promise<ConfigJson> {
    const repoPath = this.getRepoPath();
    const configPath = path.join(workspaceId, '.config.json');
    const content = await this.gitService.readFile(repoPath, configPath);

    if (!content) {
      return { status: 'initializing' };
    }

    try {
      return JSON.parse(content);
    } catch {
      return { status: 'initializing' };
    }
  }

  private async writeConfig(
    workspaceId: string,
    config: ConfigJson,
  ): Promise<void> {
    const repoPath = this.getRepoPath();
    const configPath = path.join(workspaceId, '.config.json');

    await this.gitService.writeFiles(repoPath, [
      { path: configPath, content: JSON.stringify(config, null, 2) },
    ]);
  }

  async initializeWorkspace(
    workspaceId: string,
    workspaceName: string,
  ): Promise<void> {
    const repoPath = this.getRepoPath();

    await this.gitService.ensureRepo(repoPath);

    const existing = await this.gitService.readFile(
      repoPath,
      path.join(workspaceId, '.config.json'),
    );

    if (existing) {
      return; // Already initialized
    }

    await this.boilerplateService.scaffold(workspaceId, repoPath, workspaceName);
    await this.gitService.commit(
      repoPath,
      `Initial boilerplate for ${workspaceName}`,
    );

    this.logger.log(`Initialized workspace ${workspaceId} (${workspaceName})`);
  }

  async getFiles(
    workspaceId: string,
    tab?: ModelTab,
    workspaceName?: string,
  ): Promise<OperatingModelFileDto[]> {
    const repoPath = this.getRepoPath();

    await this.gitService.ensureRepo(repoPath);

    // Lazy init: scaffold if workspace folder doesn't exist
    const configExists = await this.gitService.readFile(
      repoPath,
      path.join(workspaceId, '.config.json'),
    );

    if (!configExists) {
      await this.initializeWorkspace(
        workspaceId,
        workspaceName || workspaceId,
      );
    }

    const subdir = tab
      ? path.join(workspaceId, TAB_SUBDIR_MAP[tab])
      : this.getPluginPath(workspaceId);

    const files = await this.gitService.listFiles(repoPath, subdir);

    // Strip workspace prefix from paths, return relative to claude-plugin/
    const pluginPrefix = this.getPluginPath(workspaceId) + '/';

    return files
      .filter((f) => !f.path.endsWith('.config.json'))
      .map((f) => {
        const relativePath = f.path.startsWith(pluginPrefix)
          ? f.path.slice(pluginPrefix.length)
          : f.path;
        const ext = path.extname(f.path).replace('.', '');

        return {
          path: relativePath,
          content: f.content,
          format: ext || undefined,
        };
      });
  }

  async getFile(
    workspaceId: string,
    filePath: string,
  ): Promise<OperatingModelFileDto | null> {
    const repoPath = this.getRepoPath();
    const fullPath = path.join(
      this.getPluginPath(workspaceId),
      filePath,
    );
    const content = await this.gitService.readFile(repoPath, fullPath);

    if (content === null) {
      return null;
    }

    const ext = path.extname(filePath).replace('.', '');

    return { path: filePath, content, format: ext || undefined };
  }

  async saveFiles(
    workspaceId: string,
    files: { path: string; content: string }[],
    message?: string,
    userId?: string,
  ): Promise<OperatingModelSaveResultDto> {
    const repoPath = this.getRepoPath();

    // Validate files before writing
    const errors = this.fileValidationService.validateFiles(files);
    const criticalErrors = errors.filter((e) => e.severity === 'error');

    if (criticalErrors.length > 0) {
      return {
        success: false,
        error: criticalErrors.map((e) => `${e.path}: ${e.message}`).join('; '),
      };
    }

    // Map paths to workspace plugin directory
    const mappedFiles = files.map((f) => ({
      path: path.join(this.getPluginPath(workspaceId), f.path),
      content: f.content,
    }));

    await this.gitService.writeFiles(repoPath, mappedFiles);

    const commitMessage =
      message ?? this.generateCommitMessage(files);
    const commitSha = await this.gitService.commit(
      repoPath,
      commitMessage,
      userId,
    );

    return { success: true, commitSha };
  }

  async deleteFile(
    workspaceId: string,
    filePath: string,
  ): Promise<OperatingModelSaveResultDto> {
    const repoPath = this.getRepoPath();
    const fullPath = path.join(
      this.getPluginPath(workspaceId),
      filePath,
    );

    await this.gitService.deleteFile(repoPath, fullPath);

    const commitSha = await this.gitService.commit(
      repoPath,
      `Delete ${filePath}`,
    );

    return { success: true, commitSha };
  }

  async getHistory(
    workspaceId: string,
    limit = 50,
  ): Promise<OperatingModelVersionDto[]> {
    const repoPath = this.getRepoPath();
    const config = await this.readConfig(workspaceId);
    const entries = await this.gitService.log(repoPath, workspaceId, limit);

    return entries.map((entry) => ({
      id: entry.sha.substring(0, 7),
      timestamp: entry.date,
      user: entry.author,
      summary: entry.message,
      status:
        config.lastAppliedCommitSha &&
        entry.sha.startsWith(config.lastAppliedCommitSha)
          ? 'Applied'
          : 'Saved',
      changes: [],
    }));
  }

  async getVersion(
    workspaceId: string,
    commitSha: string,
  ): Promise<OperatingModelVersionDto | null> {
    const repoPath = this.getRepoPath();
    const config = await this.readConfig(workspaceId);

    const entries = await this.gitService.log(repoPath, undefined, 1);
    const showResult = await this.gitService.show(
      repoPath,
      commitSha,
      workspaceId,
    );

    const entry = entries.find((e) => e.sha.startsWith(commitSha));

    const pluginPrefix = this.getPluginPath(workspaceId) + '/';

    return {
      id: commitSha.substring(0, 7),
      timestamp: entry?.date ?? new Date().toISOString(),
      user: entry?.author ?? 'Unknown',
      summary: entry?.message ?? '',
      status:
        config.lastAppliedCommitSha &&
        commitSha.startsWith(config.lastAppliedCommitSha)
          ? 'Applied'
          : 'Saved',
      changes: showResult.files.map((f) => ({
        file: f.path.startsWith(pluginPrefix)
          ? f.path.slice(pluginPrefix.length)
          : f.path,
        action: f.action,
        before: f.before ?? undefined,
        after: f.after ?? undefined,
      })),
    };
  }

  async getStatus(workspaceId: string): Promise<WorkspaceAgentStatusDto> {
    const config = await this.readConfig(workspaceId);

    return {
      status: config.status,
      lastAppliedCommitSha: config.lastAppliedCommitSha,
      lastAppliedAt: config.lastAppliedAt,
      lastAppliedByUserId: config.lastAppliedByUserId,
      nestboxAgentId: config.nestboxAgentId,
      errorMessage: config.errorMessage,
    };
  }

  async getWorkspaceCommands(
    workspaceId: string,
  ): Promise<WorkspaceCommandDto[]> {
    const repoPath = this.getRepoPath();
    const commandsDir = path.join(workspaceId, 'claude-plugin', 'commands');
    const files = await this.gitService.listFiles(repoPath, commandsDir);
    const commands: WorkspaceCommandDto[] = [];

    for (const file of files) {
      if (!file.path.endsWith('.md')) continue;

      try {
        const { data: frontmatter, content: body } = matter(file.content);

        if (!frontmatter.name) {
          this.logger.warn(
            `Skipping command file without name: ${file.path}`,
          );
          continue;
        }

        // Try to get creation date from git log
        let createdAt: string | undefined;

        try {
          const log = await this.gitService.log(repoPath, file.path, 1);

          if (log.length > 0) {
            createdAt = log[log.length - 1].date;
          }
        } catch {
          // Fall back to no date
        }

        const args = (frontmatter.arguments ?? []).map(
          (arg: { name: string; description?: string; required?: boolean }) => ({
            name: arg.name,
            description: arg.description,
            required: arg.required ?? false,
          }),
        );

        // Convert kebab-case name to Title Case for display
        const displayName = (frontmatter.name as string)
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        commands.push({
          id: `om-${frontmatter.name}`,
          name: displayName,
          description: frontmatter.description,
          body: body.trim(),
          tags: frontmatter.tags,
          placeholder: frontmatter.placeholder,
          defaultOutput: frontmatter.defaultOutput,
          icon: frontmatter.icon,
          arguments: args.length > 0 ? args : undefined,
          createdAt,
        });
      } catch (error) {
        this.logger.warn(
          `Failed to parse command file ${file.path}: ${error}`,
        );
      }
    }

    return commands.sort((a, b) => a.name.localeCompare(b.name));
  }

  // ── Epic 4: Apply & Rollback ────────────────────────────

  async apply(
    workspaceId: string,
    userId?: string,
  ): Promise<OperatingModelApplyResultDto> {
    const repoPath = this.getRepoPath();
    const workspacePath = this.getWorkspacePath(workspaceId);

    try {
      // Write deploying status
      const config = await this.readConfig(workspaceId);

      await this.writeConfig(workspaceId, {
        ...config,
        status: 'deploying',
        errorMessage: undefined,
      });

      // Tag current HEAD
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const log = await this.gitService.log(repoPath, undefined, 1);
      const headSha = log[0]?.sha;

      if (headSha) {
        await this.gitService.tag(
          repoPath,
          `applied-${workspaceId.substring(0, 8)}-${timestamp}`,
          headSha,
        );
      }

      // Deploy
      const result = await this.deployService.deploy(
        workspacePath,
        config.nestboxAgentId,
      );

      if (!result.success) {
        await this.writeConfig(workspaceId, {
          ...config,
          status: 'error',
          errorMessage: result.error,
        });
        await this.gitService.commit(repoPath, `Apply failed: ${result.error}`);

        return { success: false, error: result.error };
      }

      // Update config with success (spread existing to preserve pluginName etc.)
      await this.writeConfig(workspaceId, {
        ...config,
        status: 'ready',
        lastAppliedCommitSha: headSha,
        lastAppliedAt: new Date().toISOString(),
        lastAppliedByUserId: userId,
        nestboxAgentId: result.agentId,
        errorMessage: undefined,
      });
      await this.gitService.commit(repoPath, `Applied workspace ${workspaceId}`);

      // Auto-sync to GitHub if enabled
      await this.autoSyncIfEnabled(repoPath);

      return {
        success: true,
        commitSha: headSha,
        nestboxAgentId: result.agentId,
      };
    } catch (error) {
      const message = (error as Error).message;

      this.logger.error(`Apply failed for ${workspaceId}: ${message}`);

      return { success: false, error: message };
    }
  }

  async rollback(
    workspaceId: string,
    commitSha: string,
    userId?: string,
  ): Promise<OperatingModelApplyResultDto> {
    const repoPath = this.getRepoPath();

    // Restore workspace folder to state at commit
    await this.gitService.checkoutPathAtCommit(
      repoPath,
      commitSha,
      workspaceId,
    );
    await this.gitService.commit(
      repoPath,
      `Rollback to ${commitSha.substring(0, 7)}`,
      userId,
    );

    // Re-deploy
    return this.apply(workspaceId, userId);
  }

  // ── Epic 6: GitHub Sync ────────────────────────────────

  async connectRemote(
    remoteUrl: string,
  ): Promise<{ publicKey: string }> {
    const repoPath = this.getRepoPath();

    // Ensure SSH keypair
    const publicKey = await this.sshKeyService.ensureKeypair(repoPath);

    // Set remote
    await this.gitService.addRemote(repoPath, remoteUrl);

    // Write .remote.json
    const remoteConfig = {
      remoteUrl,
      defaultBranch: 'main',
      syncEnabled: false,
      lastSyncAt: null,
      lastSyncStatus: 'never',
      lastSyncError: null,
    };

    await this.gitService.writeFiles(repoPath, [
      {
        path: '.remote.json',
        content: JSON.stringify(remoteConfig, null, 2),
      },
    ]);
    await this.gitService.commit(repoPath, `Connected remote: ${remoteUrl}`);

    return { publicKey };
  }

  async getPublicKey(): Promise<string> {
    const repoPath = this.getRepoPath();

    return this.sshKeyService.ensureKeypair(repoPath);
  }

  async pushToRemote(force = false): Promise<{ success: boolean; error?: string }> {
    const repoPath = this.getRepoPath();

    try {
      const remoteConfig = await this.readRemoteConfig();

      if (!remoteConfig) {
        return { success: false, error: 'No remote configured' };
      }

      const sshCommand = this.sshKeyService.getSshCommand(repoPath);

      await this.gitService.pushToRemote(
        repoPath,
        remoteConfig.defaultBranch,
        sshCommand,
        force,
      );

      await this.updateRemoteConfig({
        lastSyncAt: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastSyncError: null,
      });

      return { success: true };
    } catch (error) {
      const message = (error as Error).message;

      await this.updateRemoteConfig({
        lastSyncStatus: 'failed',
        lastSyncError: message,
      });

      return { success: false, error: message };
    }
  }

  async pullFromRemote(force = false): Promise<{ success: boolean; error?: string }> {
    const repoPath = this.getRepoPath();

    try {
      const remoteConfig = await this.readRemoteConfig();

      if (!remoteConfig) {
        return { success: false, error: 'No remote configured' };
      }

      const sshCommand = this.sshKeyService.getSshCommand(repoPath);

      await this.gitService.pullFromRemote(
        repoPath,
        remoteConfig.defaultBranch,
        sshCommand,
        force,
      );

      await this.updateRemoteConfig({
        lastSyncAt: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastSyncError: null,
      });

      return { success: true };
    } catch (error) {
      const message = (error as Error).message;

      await this.updateRemoteConfig({
        lastSyncStatus: 'failed',
        lastSyncError: message,
      });

      return { success: false, error: message };
    }
  }

  async setSyncEnabled(enabled: boolean): Promise<void> {
    await this.updateRemoteConfig({ syncEnabled: enabled });
  }

  private async readRemoteConfig(): Promise<Record<string, any> | null> {
    const repoPath = this.getRepoPath();
    const content = await this.gitService.readFile(repoPath, '.remote.json');

    if (!content) return null;

    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private async updateRemoteConfig(
    updates: Record<string, unknown>,
  ): Promise<void> {
    const existing = await this.readRemoteConfig();

    if (!existing) return;

    const updated = { ...existing, ...updates };
    const repoPath = this.getRepoPath();

    await this.gitService.writeFiles(repoPath, [
      { path: '.remote.json', content: JSON.stringify(updated, null, 2) },
    ]);
  }

  private async autoSyncIfEnabled(repoPath: string): Promise<void> {
    const remoteConfig = await this.readRemoteConfig();

    if (!remoteConfig?.syncEnabled) return;

    try {
      const sshCommand = this.sshKeyService.getSshCommand(repoPath);

      await this.gitService.pushToRemote(
        repoPath,
        remoteConfig.defaultBranch,
        sshCommand,
      );

      await this.updateRemoteConfig({
        lastSyncAt: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastSyncError: null,
      });
    } catch (error) {
      this.logger.warn(
        `Auto-sync failed: ${(error as Error).message}`,
      );

      await this.updateRemoteConfig({
        lastSyncStatus: 'failed',
        lastSyncError: (error as Error).message,
      });
    }
  }

  private generateCommitMessage(
    files: { path: string; content: string }[],
  ): string {
    if (files.length === 1) {
      return `Update ${files[0].path}`;
    }

    return `Update ${files.length} files`;
  }
}
