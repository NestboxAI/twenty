import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

import {
  AgentsApi,
  Configuration,
  type CreateMachineAgentDto,
} from '@nestbox-ai/instances';
import archiver from 'archiver';
import axios from 'axios';
import * as yaml from 'js-yaml';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

interface AgentManifest {
  name: string;
  description?: string;
  entry: string;
  inputSchema?: Record<string, unknown>;
  type?: string;
}

interface DeployResult {
  success: boolean;
  agentId?: string;
  error?: string;
}

const EXCLUDE_PATTERNS = ['.git', 'node_modules', '.config.json', '.ssh'];

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);

  constructor(private readonly twentyConfigService: TwentyConfigService) {}

  private ensureV1(url: string): string {
    return url.endsWith('/v1') ? url : `${url.replace(/\/+$/, '')}/v1`;
  }

  private getAgentsApi(): AgentsApi {
    const basePath = this.ensureV1(
      this.twentyConfigService.get('NESTBOX_AI_ANALYX_HOST') as string,
    );
    const apiKey = this.twentyConfigService.get(
      'NESTBOX_AI_ANALYX_API_KEY',
    ) as string;

    const configuration = new Configuration({
      basePath,
      baseOptions: {
        headers: { Authorization: apiKey },
      },
    });

    console.log(
      `AgentsApi configured with basePath: ${basePath}, apiKey: ${apiKey ? '***' : 'MISSING'}`,
    );

    return new AgentsApi(configuration);
  }

  private getBaseUrl(): string {
    return this.ensureV1(
      this.twentyConfigService.get('NESTBOX_AI_ANALYX_HOST') as string,
    );
  }

  private getApiKey(): string {
    return this.twentyConfigService.get('NESTBOX_AI_ANALYX_API_KEY') as string;
  }

  async deploy(
    workspacePath: string,
    existingAgentId?: string,
  ): Promise<DeployResult> {
    try {
      // Read agent manifest
      const manifest = this.readManifest(workspacePath);

      if (!manifest) {
        return {
          success: false,
          error: 'No nestbox-agents.yaml found in agent/ directory',
        };
      }

      // Find or create agent
      let agentId = existingAgentId;

      if (!agentId) {
        agentId = await this.findOrCreateAgent(manifest);
      }

      this.logger.log(
        `Using agent ID: ${agentId || 'No existing agent ID provided, will create new agent'}`,
      );

      if (!agentId) {
        agentId = await this.findOrCreateAgent(manifest);
      }

      // Create zip
      const zipBuffer = await this.createZip(workspacePath);

      // Upload zip + update metadata in a single request
      await this.uploadAndUpdate(agentId, manifest, zipBuffer);

      this.logger.log(
        `Deployed agent ${manifest.name} (${agentId}) successfully`,
      );

      return { success: true, agentId };
    } catch (error) {
      const message = (error as Error).message;

      this.logger.error(`Deploy failed: ${message}`);

      return { success: false, error: message };
    }
  }

  async undeploy(agentId: string): Promise<void> {
    try {
      const agentsApi = this.getAgentsApi();

      await agentsApi.agentManagementControllerDeleteAgent(agentId);

      this.logger.log(`Undeployed agent ${agentId}`);
    } catch (error) {
      this.logger.error(
        `Failed to undeploy agent ${agentId}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  private readManifest(workspacePath: string): AgentManifest | null {
    const manifestPath = path.join(
      workspacePath,
      'agent',
      'nestbox-agents.yaml',
    );

    if (!fs.existsSync(manifestPath)) {
      return null;
    }

    const content = fs.readFileSync(manifestPath, 'utf-8');
    const parsed = yaml.load(content) as { agents?: AgentManifest[] };

    if (!parsed?.agents?.length) {
      return null;
    }

    return parsed.agents[0];
  }

  private async findOrCreateAgent(manifest: AgentManifest): Promise<string> {
    const agentsApi = this.getAgentsApi();

    // Search existing agents by name
    const response = await agentsApi.agentManagementControllerGetAllAgents();
    const agents = (response as any).data || [];

    const existing = agents.find(
      (a: { name?: string }) => a.name === manifest.name,
    );

    if (existing) {
      return existing.id;
    }

    // Create new agent using typed DTO
    const dto: CreateMachineAgentDto = {
      name: manifest.name,
      description: manifest.description,
      entryFunctionName: manifest.entry,
      type: manifest.type || 'REGULAR',
      inputSchema: manifest.inputSchema || {},
    };

    const createResponse =
      await agentsApi.agentManagementControllerCreateNewAgent(dto);

    return (createResponse as any).data?.id;
  }

  private async createZip(workspacePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);

      // Flatten agent/ contents to zip root (index.js, package.json, nestbox-agents.yaml)
      // and include everything else (claude-plugin/, etc.) at root level
      const agentDir = path.join(workspacePath, 'agent');

      if (fs.existsSync(agentDir)) {
        this.addDirectoryToArchive(archive, agentDir, '');
      }

      const entries = fs.readdirSync(workspacePath, { withFileTypes: true });

      for (const entry of entries) {
        if (
          entry.name === 'agent' ||
          EXCLUDE_PATTERNS.includes(entry.name)
        ) {
          continue;
        }

        const fullPath = path.join(workspacePath, entry.name);

        if (entry.isDirectory()) {
          this.addDirectoryToArchive(archive, fullPath, entry.name);
        } else {
          archive.append(fs.createReadStream(fullPath), {
            name: entry.name,
          });
        }
      }

      archive.finalize();
    });
  }

  private addDirectoryToArchive(
    archive: archiver.Archiver,
    dirPath: string,
    prefix: string,
  ): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (EXCLUDE_PATTERNS.includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const archivePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        this.addDirectoryToArchive(archive, fullPath, archivePath);
      } else {
        archive.append(fs.createReadStream(fullPath), {
          name: archivePath,
        });
      }
    }
  }

  private async uploadAndUpdate(
    agentId: string,
    manifest: AgentManifest,
    zipBuffer: Buffer,
  ): Promise<void> {
    const baseUrl = this.getBaseUrl();
    const apiKey = this.getApiKey();

    const FormData = (await import('form-data')).default;
    const form = new FormData();

    // Zip file
    const stream = new Readable();

    stream.push(zipBuffer);
    stream.push(null);

    form.append('file', stream, {
      filename: 'agent.zip',
      contentType: 'application/zip',
    });

    // Agent metadata
    form.append('machineAgentId', agentId);
    form.append('name', manifest.name);
    form.append('entryFunctionName', manifest.entry);
    form.append('isSourceCodeUpdate', 'true');

    if (manifest.description) {
      form.append('description', manifest.description);
    }

    if (manifest.inputSchema) {
      form.append('inputSchema', JSON.stringify(manifest.inputSchema));
    }

    await axios.put(`${baseUrl}/agents/${agentId}`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: apiKey,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }
}
