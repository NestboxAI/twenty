import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Readable } from 'stream';

import { Configuration as NestboxConfig, QueryApi } from '@nestbox-ai/agents';
import { FileFolder } from 'twenty-shared/types';
import { Repository } from 'typeorm';

import { CreateAnalyxTaskInput } from 'src/engine/core-modules/analyx/dtos/create-analyx-task.input';
import { AnalyxTaskEntity } from 'src/engine/core-modules/analyx/entities/analyx-task.entity';
import { ApiKeyService } from 'src/engine/core-modules/api-key/services/api-key.service';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

// Hard-coded for demo
const NESTBOX_HOST = 'http://34.122.76.126/v1';
const NESTBOX_API_KEY = '254c24df-a208-4f94-b734-1ee42732275e';
const NESTBOX_AGENT_ID = 'b2831949-06ec-4411-b87e-116efabb295a';
// ssh -p 443 -R0:localhost:3000 qr@free.pinggy.io
const PINGGY_INSTANCE = 'https://kivvm-66-207-198-10.a.free.pinggy.link';

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
    const task = await this.analyxTaskRepository.save({
      name: input.name,
      prompt: input.prompt,
      status: 'processing',
      createdById: userId,
      workspaceId,
      input: {
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

    // Prefer a PDF/document file with content; fall back to the first with content
    const fileToUpload =
      outputFiles.find(
        (f) => f.content && /\.(pdf|docx?|xlsx?)$/i.test(f.path ?? ''),
      ) ?? outputFiles.find((f) => f.content);

    if (fileToUpload?.content) {
      try {
        const buffer = Buffer.from(fileToUpload.content, 'base64');
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
    const attachments = this.buildAttachments(input);
    const mcpConfig = this.buildMcpConfig(input.agentIds ?? []);

    this.logger.log(`Dispatching analyx task ${task.id} to agent`);
    this.logger.log(`Callback URL: ${callbackUrl}`);

    const config = new NestboxConfig({
      basePath: NESTBOX_HOST,
      baseOptions: {
        headers: { Authorization: NESTBOX_API_KEY },
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

    await queryApi.agentOperationsQueryControllerCreateQuery(NESTBOX_AGENT_ID, {
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

  private buildAttachments(
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

    for (const entity of input.entities ?? []) {
      const payload = JSON.stringify(entity);

      attachments.push({
        filename: `${entity.objectName}-${entity.id}.json`,
        content: Buffer.from(payload).toString('base64'),
        mime_type: 'application/json',
      });
    }

    return attachments;
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

  private resolveOutputFormat(
    contextType?: string,
  ): 'docx' | 'pptx' | 'xlsx' {
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
