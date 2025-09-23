import { Injectable, Logger } from '@nestjs/common';

import { Configuration as Config, QueryApi } from '@nestbox-ai/agents';
import { resolveInput } from 'twenty-shared/utils';

import { type WorkflowAction } from 'src/modules/workflow/workflow-executor/interfaces/workflow-action.interface';

import { ApiKeyService } from 'src/engine/core-modules/api-key/api-key.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import {
  WorkflowStepExecutorException,
  WorkflowStepExecutorExceptionCode,
} from 'src/modules/workflow/workflow-executor/exceptions/workflow-step-executor.exception';
import { type WorkflowActionInput } from 'src/modules/workflow/workflow-executor/types/workflow-action-input';
import { type WorkflowActionOutput } from 'src/modules/workflow/workflow-executor/types/workflow-action-output.type';

import { isWorkflowNestboxAiAgentAction } from './guards/is-workflow-nestbox-ai-agent-action.guard';

@Injectable()
export class NestboxAiAgentWorkflowAction implements WorkflowAction {
  private readonly logger = new Logger('NestboxAiAgentWorkflowAction');

  constructor(
    private readonly twentyConfigService: TwentyConfigService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async execute({
    currentStepId,
    steps,
    context,
    workflowRunId,
    workspaceId,
  }: WorkflowActionInput): Promise<WorkflowActionOutput> {
    const step = steps.find((s) => s.id === currentStepId);

    if (!step) {
      throw new WorkflowStepExecutorException(
        'Step not found',
        WorkflowStepExecutorExceptionCode.STEP_NOT_FOUND,
      );
    }

    if (!isWorkflowNestboxAiAgentAction(step)) {
      throw new WorkflowStepExecutorException(
        'Step is not a Nestbox AI Agent action',
        WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE,
      );
    }

    const { agentId, params } = resolveInput(step.settings.input, context) as {
      agentId?: string;
      params?: Record<string, any>;
    };

    if (!agentId) {
      return { error: 'Agent ID is required' };
    }

    try {
      const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
      const apiKey = this.twentyConfigService.get(
        'NESTBOX_AI_INSTANCE_API_KEY',
      );
      const callbackUrl = `${this.twentyConfigService.get('SERVER_URL')}/nestbox-ai-agent/callback?workflowRunId=${workflowRunId}&workspaceId=${workspaceId}&stepId=${currentStepId}`;
      // const callbackUrl = `https://ajouu-2607-fea8-501-e900-8cd3-80f9-b485-dbe1.a.free.pinggy.link/nestbox-ai-agent/callback?workflowRunId=${workflowRunId}&workspaceId=${workspaceId}&stepId=${currentStepId}`;

      this.logger.log('basePath', basePath);
      this.logger.log('apiKey', apiKey);
      this.logger.log('callbackUrl', callbackUrl);

      const config = new Config({
        basePath,
        baseOptions: {
          headers: {
            Authorization: apiKey,
          },
        },
      });

      const apiKeys = await this.apiKeyService.findByWorkspaceId(workspaceId);

      const latestApiKey = apiKeys.find(
        (key) => !key.revokedAt && key.expiresAt > new Date(),
      );

      let apiKeyToken = null;

      if (latestApiKey) {
        apiKeyToken = await this.apiKeyService.generateApiKeyToken(
          workspaceId,
          latestApiKey.id,
          latestApiKey.expiresAt,
        );
      }

      const queryApi = new QueryApi(config);

      await queryApi.agentOperationsQueryControllerCreateQuery(agentId, {
        params: params || {},
        adHocCallback: {
          url: callbackUrl,
          eventTypes: ['QUERY_COMPLETED', 'QUERY_FAILED'],
          headers: {
            Authorization: `Bearer ${apiKeyToken?.token}`,
          },
        },
      });

      this.logger.log('basePath', basePath);
      this.logger.log('apiKey', apiKey);
      this.logger.log('callbackUrl', callbackUrl);

      return { pendingEvent: true };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Nestbox AI Agent execution failed',
      };
    }
  }
}
