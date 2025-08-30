import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
import { resolveInput } from 'twenty-shared/utils';

import { type WorkflowAction } from 'src/modules/workflow/workflow-executor/interfaces/workflow-action.interface';

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

  constructor(private readonly twentyConfigService: TwentyConfigService) {}

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
      // const callbackUrl = `http://qqolu-72-255-40-107.a.free.pinggy.link/nestbox-ai-agent/callback?workflowRunId=${workflowRunId}&workspaceId=${workspaceId}&stepId=${currentStepId}`;

      this.logger.log('basePath', basePath);
      this.logger.log('apiKey', apiKey);
      this.logger.log('callbackUrl', callbackUrl);

      this.logger.log('API Data', `${basePath}/agents/${agentId}/chat`, {
        Data: {
          params: params || {},
          messages: [
            {
              id: Date.now(),
              role: 'user',
              content: prompt ?? '',
            },
          ],
          adHocCallback: {
            url: callbackUrl,
            eventTypes: ['QUERY_COMPLETED', 'QUERY_FAILED'],
          },
        },
        Header: {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        },
      });

      await axios.post(
        `${basePath}/agents/${agentId}/chat`,
        {
          params: params || {},
          messages: [
            {
              id: Date.now(),
              role: 'user',
              content: prompt ?? '',
            },
          ],
          adHocCallback: {
            url: callbackUrl,
            eventTypes: ['QUERY_COMPLETED', 'QUERY_FAILED'],
          },
        },
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

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
