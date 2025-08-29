import { Body, Controller, Logger, All, Query } from '@nestjs/common';

import { StepStatus } from 'twenty-shared/workflow';

import { WorkflowExecutorWorkspaceService } from 'src/modules/workflow/workflow-executor/workspace-services/workflow-executor.workspace-service';
import { WorkflowRunWorkspaceService } from 'src/modules/workflow/workflow-runner/workflow-run/workflow-run.workspace-service';

@Controller('nestbox-ai-agent')
export class NestboxAiAgentController {
  private readonly logger = new Logger(NestboxAiAgentController.name);

  constructor(
    private readonly workflowRunWorkspaceService: WorkflowRunWorkspaceService,
    private readonly workflowExecutorWorkspaceService: WorkflowExecutorWorkspaceService,
  ) {}

  @All('callback')
  async handleCallback(
    @Body() body: any,
    @Query('workflowRunId') workflowRunId: string,
    @Query('workspaceId') workspaceId: string,
    @Query('stepId') stepId: string,
  ) {
    this.logger.log(`Nestbox AI Agent callback payload: ${JSON.stringify(body)}`);

    const eventType = body?.eventType || body?.type;
    const isError = eventType === 'QUERY_FAILED';

    await this.workflowRunWorkspaceService.updateWorkflowRunStepInfo({
      stepId,
      workflowRunId,
      workspaceId,
      stepInfo: {
        status: isError ? StepStatus.FAILED : StepStatus.SUCCESS,
        result: isError ? undefined : body,
        error: isError ? body : undefined,
      },
    });

    const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
      workflowRunId,
      workspaceId,
    });
    const step = workflowRun.state.flow.steps.find((s) => s.id === stepId);
    const nextStepIds = step?.nextStepIds ?? [];

    if (nextStepIds.length > 0) {
      await this.workflowExecutorWorkspaceService.executeFromSteps({
        stepIds: nextStepIds,
        workflowRunId,
        workspaceId,
      });
    } else {
      await this.workflowExecutorWorkspaceService.executeFromSteps({
        stepIds: [],
        workflowRunId,
        workspaceId,
      });
    }

    return { received: true };
  }
}
