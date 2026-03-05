import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Readable } from 'stream';

import { Configuration as NestboxConfig, QueryApi } from '@nestbox-ai/agents';
import archiver from 'archiver';
import { FileFolder } from 'twenty-shared/types';
import { Repository } from 'typeorm';

import { CreateAnalyxTaskInput } from 'src/engine/core-modules/analyx/dtos/create-analyx-task.input';
import { AnalyxTaskEntity } from 'src/engine/core-modules/analyx/entities/analyx-task.entity';
import { ApiKeyService } from 'src/engine/core-modules/api-key/services/api-key.service';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';

// ssh -p 443 -R0:localhost:3000 qr@free.pinggy.io
const PINGGY_INSTANCE = 'https://cjcco-66-207-198-10.a.free.pinggy.link';

@Injectable()
export class AnalyxTaskService {
  private readonly logger = new Logger(AnalyxTaskService.name);

  constructor(
    @InjectRepository(AnalyxTaskEntity)
    private readonly analyxTaskRepository: Repository<AnalyxTaskEntity>,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly apiKeyService: ApiKeyService,
    private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  // ── Queries ──────────────────────────────────────────────

  async findAllByWorkspaceId(workspaceId: string): Promise<AnalyxTaskEntity[]> {
    return this.analyxTaskRepository
      .createQueryBuilder('task')
      .where('task.workspaceId = :workspaceId', { workspaceId })
      .andWhere('task.status != :removed', { removed: 'removed' })
      .orderBy('task.createdAt', 'DESC')
      .getMany();
  }

  async findById(
    id: string,
    workspaceId: string,
  ): Promise<AnalyxTaskEntity | null> {
    return this.analyxTaskRepository.findOne({
      where: { id, workspaceId },
    });
  }

  // ── Create & Dispatch ────────────────────────────────────

  async createAndDispatch(
    input: CreateAnalyxTaskInput,
    workspaceId: string,
    userId: string | null,
  ): Promise<AnalyxTaskEntity> {
    this.logger.log(
      `Creating task — contextType: ${input.contextType ?? '(missing)'}`,
    );

    const task = await this.analyxTaskRepository.save({
      name: input.name,
      prompt: input.prompt,
      status: 'processing',
      createdById: userId,
      workspaceId,
      input: {
        contextType: input.contextType ?? null,
        entities: input.entities ?? [],
        attachments: (input.attachments ?? []).map(
          ({ content: _content, ...meta }) => meta,
        ),
        agentIds: input.agentIds ?? [],
      },
    });

    this.dispatchToAgent(task, input, workspaceId).catch((error) => {
      this.logger.error(
        `Dispatch failed for task ${task.id}: ${error.message}`,
      );
      this.analyxTaskRepository.update(task.id, {
        status: 'failed',
        errorMessage: error.message,
      });
    });

    return task;
  }

  // ── Stop Task ──────────────────────────────────────────────

  async stopTask(id: string, workspaceId: string): Promise<AnalyxTaskEntity> {
    const task = await this.analyxTaskRepository.findOne({
      where: { id, workspaceId },
    });

    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    if (task.status !== 'processing') {
      throw new Error(`Task ${id} is not in processing status`);
    }

    await this.analyxTaskRepository.update(
      { id, workspaceId },
      { status: 'stopped', errorMessage: 'Task stopped by user' },
    );

    return this.analyxTaskRepository.findOneOrFail({
      where: { id, workspaceId },
    });
  }

  // ── Archive & Remove ───────────────────────────────────────

  async archiveTask(
    id: string,
    workspaceId: string,
  ): Promise<AnalyxTaskEntity> {
    const task = await this.analyxTaskRepository.findOne({
      where: { id, workspaceId },
    });

    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    await this.analyxTaskRepository.update(
      { id, workspaceId },
      { status: 'archived' },
    );

    return this.analyxTaskRepository.findOneOrFail({
      where: { id, workspaceId },
    });
  }

  async removeTask(id: string, workspaceId: string): Promise<AnalyxTaskEntity> {
    const task = await this.analyxTaskRepository.findOne({
      where: { id, workspaceId },
    });

    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    await this.analyxTaskRepository.update(
      { id, workspaceId },
      { status: 'removed' },
    );

    return this.analyxTaskRepository.findOneOrFail({
      where: { id, workspaceId },
    });
  }

  // ── Callback Handlers ────────────────────────────────────

  async handleCompleted(
    taskId: string,
    workspaceId: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    let fileId: string | null = null;

    const outputFiles =
      (data?.outputFiles as {
        path: string;
        filename?: string;
        content?: string;
        mimeType?: string;
      }[]) ??
      (data?.files as {
        path: string;
        filename?: string;
        content?: string;
        mimeType?: string;
      }[]) ??
      [];

    const filesWithContent = outputFiles.filter((f) => f.content);

    if (filesWithContent.length === 1) {
      const fileToUpload = filesWithContent[0];

      try {
        const buffer = Buffer.from(fileToUpload.content!, 'base64');
        const name =
          fileToUpload.filename ??
          fileToUpload.path?.split('/').pop() ??
          'analyx-output';

        const { files } = await this.fileUploadService.uploadFile({
          file: buffer,
          filename: name,
          mimeType: fileToUpload.mimeType ?? 'application/octet-stream',
          fileFolder: FileFolder.Attachment,
          workspaceId,
        });

        if (files.length > 0) {
          const path = files[0].path;
          const parts = path.split('/');

          fileId = parts[parts.length - 1];
        }
      } catch (error) {
        this.logger.error(`File upload failed for task ${taskId}: ${error}`);
      }
    } else if (filesWithContent.length > 1) {
      try {
        const zipBuffer = await this.zipFiles(filesWithContent);

        const { files } = await this.fileUploadService.uploadFile({
          file: zipBuffer,
          filename: `analyx-output-${taskId.slice(0, 8)}.zip`,
          mimeType: 'application/zip',
          fileFolder: FileFolder.Attachment,
          workspaceId,
        });

        if (files.length > 0) {
          const path = files[0].path;
          const parts = path.split('/');

          fileId = parts[parts.length - 1];
        }
      } catch (error) {
        this.logger.error(
          `Zip file upload failed for task ${taskId}: ${error}`,
        );
      }
    }

    await this.analyxTaskRepository.update(
      { id: taskId, workspaceId },
      { status: 'completed', result: data as Record<string, any>, fileId },
    );
  }

  async handleFailed(
    taskId: string,
    workspaceId: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.analyxTaskRepository.update(
      { id: taskId, workspaceId },
      {
        status: 'failed',
        result: data as Record<string, any>,
        errorMessage: (data?.error as string) ?? JSON.stringify(data),
      },
    );
  }

  async getFileStream(
    taskId: string,
    workspaceId: string,
  ): Promise<Readable | null> {
    const task = await this.analyxTaskRepository.findOne({
      where: { id: taskId, workspaceId },
    });

    if (!task?.fileId) {
      return null;
    }

    return this.fileService.getFileStream(
      'attachment',
      task.fileId,
      workspaceId,
    );
  }

  // ── Private ──────────────────────────────────────────────

  private async dispatchToAgent(
    task: AnalyxTaskEntity,
    input: CreateAnalyxTaskInput,
    workspaceId: string,
  ): Promise<void> {
    const serverUrl =
      process.env.NODE_ENV === 'development'
        ? PINGGY_INSTANCE
        : (this.twentyConfigService.get('SERVER_URL') as string);
    const callbackUrl = `${serverUrl}/analyx/callback?taskId=${task.id}&workspaceId=${workspaceId}`;

    const apiKeyToken = await this.getApiKeyToken(workspaceId);
    const fileAttachments = this.buildFileAttachments(input);
    const enrichedEntities = await this.enrichEntityRecords(
      input.entities ?? [],
      workspaceId,
    );
    const attachments = [...fileAttachments, ...enrichedEntities];
    const mcpConfig = this.buildMcpConfig(input.agentIds ?? []);

    this.logger.log(`Dispatching analyx task ${task.id} to agent`);
    this.logger.log(`Callback URL: ${callbackUrl}`);

    const analyxHost = this.twentyConfigService.get(
      'NESTBOX_AI_ANALYX_HOST',
    ) as string;
    const analyxApiKey = this.twentyConfigService.get(
      'NESTBOX_AI_ANALYX_API_KEY',
    ) as string;

    const config = new NestboxConfig({
      basePath: `${analyxHost}/v1`,
      baseOptions: {
        headers: { Authorization: analyxApiKey },
      },
    });

    const queryApi = new QueryApi(config);

    const params: Record<string, unknown> = {
      prompt: input.prompt,
      max_turns: 30,
      max_budget_usd: 5,
      permission_mode: 'acceptEdits',
      output_format: this.resolveOutputFormat(input.contextType),
      allowed_tools: [
        'WebSearch',
        'WebFetch',
        'Read',
        'Write',
        'Edit',
        'Bash',
        'Glob',
        'Grep',
        'Task',
        'TaskOutput',
      ],
      timeout_seconds: 900,
      terminate_after: true,
      metadata: {
        callbackUrl,
        apiToken: apiKeyToken?.token,
      },
    };

    // Only include attachments when there are actual files
    if (attachments.length > 0) {
      params.attachments = attachments;
    }

    // Only include mcp_config when there are actual servers —
    // an empty { servers: {} } triggers CLI MCP initialization and hangs.
    if (Object.keys(mcpConfig.servers).length > 0) {
      params.mcp_config = mcpConfig;
    }

    const analyxAgentId = this.twentyConfigService.get(
      'NESTBOX_AI_ANALYX_AGENT_ID',
    ) as string;

    await queryApi.agentOperationsQueryControllerCreateQuery(analyxAgentId, {
      params,
      adHocCallback: {
        url: callbackUrl,
        eventTypes: ['QUERY_COMPLETED', 'QUERY_FAILED'],
        headers: {
          Authorization: `Bearer ${apiKeyToken?.token}`,
        },
      },
    });
  }

  private async getApiKeyToken(
    workspaceId: string,
  ): Promise<{ token: string } | undefined> {
    const apiKeys = await this.apiKeyService.findByWorkspaceId(workspaceId);

    const active = apiKeys.find(
      (key) => !key.revokedAt && key.expiresAt > new Date(),
    );

    if (!active) {
      return undefined;
    }

    return this.apiKeyService.generateApiKeyToken(
      workspaceId,
      active.id,
      active.expiresAt,
    );
  }

  private buildFileAttachments(
    input: CreateAnalyxTaskInput,
  ): { filename: string; content: string; mime_type: string }[] {
    const attachments: {
      filename: string;
      content: string;
      mime_type: string;
    }[] = [];

    for (const file of input.attachments ?? []) {
      attachments.push({
        filename: file.name,
        content: file.content,
        mime_type: file.type,
      });
    }

    return attachments;
  }

  private async enrichEntityRecords(
    entities: {
      objectName: string;
      objectNameSingular?: string;
      name?: string;
      id: string;
    }[],
    workspaceId: string,
  ): Promise<{ filename: string; content: string; mime_type: string }[]> {
    if (entities.length === 0) return [];

    const results: { filename: string; content: string; mime_type: string }[] =
      [];
    const systemAuthContext = buildSystemAuthContext(workspaceId);

    for (const entity of entities) {
      const objectName = entity.objectNameSingular ?? entity.objectName ?? '';

      if (!objectName) {
        this.logger.warn(
          `Skipping entity enrichment: no objectNameSingular for ${entity.id}`,
        );
        continue;
      }

      try {
        const record =
          await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
            async () => {
              const repository =
                await this.globalWorkspaceOrmManager.getRepository(
                  workspaceId,
                  objectName,
                  { shouldBypassPermissionChecks: true },
                );

              // Discover 1-level relations from TypeORM metadata
              const relationNames = repository.metadata.relations.map(
                (rel) => rel.propertyName,
              );
              const relations: Record<string, boolean> = {};

              for (const name of relationNames) {
                relations[name] = true;
              }

              return repository.findOne({
                where: { id: entity.id } as any,
                relations,
              });
            },
            systemAuthContext,
          );

        if (record) {
          const payload = JSON.stringify(record);

          results.push({
            filename: `${entity.objectName}-${entity.id}.json`,
            content: Buffer.from(payload).toString('base64'),
            mime_type: 'application/json',
          });
        } else {
          this.logger.warn(
            `Entity not found: ${objectName} ${entity.id}, using stub`,
          );
          const stub = JSON.stringify({
            objectName: entity.objectName,
            id: entity.id,
          });

          results.push({
            filename: `${entity.objectName}-${entity.id}.json`,
            content: Buffer.from(stub).toString('base64'),
            mime_type: 'application/json',
          });
        }
      } catch (error) {
        this.logger.error(
          `Failed to enrich entity ${objectName} ${entity.id}: ${error}`,
        );
        // Fall back to stub on error
        const stub = JSON.stringify({
          objectName: entity.objectName,
          id: entity.id,
        });

        results.push({
          filename: `${entity.objectName}-${entity.id}.json`,
          content: Buffer.from(stub).toString('base64'),
          mime_type: 'application/json',
        });
      }
    }

    return results;
  }

  private zipFiles(
    files: {
      path: string;
      filename?: string;
      content?: string;
      mimeType?: string;
    }[],
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);

      for (const file of files) {
        const name = file.filename ?? file.path?.split('/').pop() ?? 'unknown';
        const buffer = Buffer.from(file.content!, 'base64');

        archive.append(buffer, { name });
      }

      archive.finalize();
    });
  }

  private buildMcpConfig(
    agentIds: { ip: string; apiKey: string; agentId: string }[],
  ): { inputs: unknown[]; servers: Record<string, unknown> } {
    const servers: Record<string, unknown> = {};

    agentIds.forEach((agent, index) => {
      servers[`mcp_agent_${index}`] = {
        type: 'streamable-http',
        url: `http://${agent.ip}/v1/agents/${agent.agentId}/mcp`,
        headers: {
          Authorization: `Bearer ${agent.apiKey}`,
          'Request-Timeout': '60',
        },
      };
    });

    return { inputs: [], servers };
  }

  private resolveOutputFormat(contextType?: string): 'docx' | 'pptx' | 'xlsx' {
    switch (contextType?.toLowerCase().replace(' ', '_')) {
      case 'presentation':
        return 'pptx';
      case 'spreadsheet':
        return 'xlsx';
      default:
        return 'docx';
    }
  }
}
