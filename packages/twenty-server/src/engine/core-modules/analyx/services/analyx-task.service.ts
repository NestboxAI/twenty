import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Configuration as NestboxConfig, QueryApi } from '@nestbox-ai/agents';
import { FileFolder } from 'twenty-shared/types';
import { Repository } from 'typeorm';

import { CreateAnalyxTaskInput } from 'src/engine/core-modules/analyx/dtos/create-analyx-task.input';
import { AnalyxTaskEntity } from 'src/engine/core-modules/analyx/entities/analyx-task.entity';
import { ApiKeyService } from 'src/engine/core-modules/api-key/services/api-key.service';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

// Hard-coded for demo
const NESTBOX_HOST = 'http://34.59.50.14/v1';
const NESTBOX_API_KEY = '3e041b0f-f69e-46f5-bb3a-5f56acc839af';
const NESTBOX_AGENT_ID = 'bd81ee44-1e0a-4e54-9457-b2e65afa54d4';

@Injectable()
export class AnalyxTaskService {
  private readonly logger = new Logger(AnalyxTaskService.name);

  constructor(
    @InjectRepository(AnalyxTaskEntity)
    private readonly analyxTaskRepository: Repository<AnalyxTaskEntity>,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly apiKeyService: ApiKeyService,
    private readonly fileUploadService: FileUploadService,
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
        filename: string;
        content: string;
        mimeType: string;
      }[]) ??
      (data?.files as {
        filename: string;
        content: string;
        mimeType: string;
      }[]) ??
      [];

    if (outputFiles.length > 0) {
      try {
        const firstFile = outputFiles[0];
        const buffer = Buffer.from(firstFile.content, 'base64');

        const { files } = await this.fileUploadService.uploadFile({
          file: buffer,
          filename: firstFile.filename ?? 'analyx-output',
          mimeType: firstFile.mimeType ?? 'application/octet-stream',
          fileFolder: FileFolder.Attachment,
          workspaceId,
        });

        if (files.length > 0) {
          fileId = files[0].path;
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

  // ── Private ──────────────────────────────────────────────

  private async dispatchToAgent(
    task: AnalyxTaskEntity,
    input: CreateAnalyxTaskInput,
    workspaceId: string,
  ): Promise<void> {
    // ssh -p 443 -R0:localhost:3000 qr@free.pinggy.io
    const serverUrl =
      'https://zutyy-2607-fea8-501-e900-d891-8fe9-3cef-eb49.a.free.pinggy.link';
    // const serverUrl = this.twentyConfigService.get('SERVER_URL') as string;
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

    await queryApi.agentOperationsQueryControllerCreateQuery(NESTBOX_AGENT_ID, {
      params: {
        prompt: input.prompt,
        attachments,
        mcp_config: mcpConfig,
        metadata: {
          callbackUrl,
          apiToken: apiKeyToken?.token,
        },
      },
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
}
