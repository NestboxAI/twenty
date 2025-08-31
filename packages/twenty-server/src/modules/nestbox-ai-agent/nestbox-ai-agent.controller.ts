import {
  All,
  Body,
  Controller,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';

import { StepStatus } from 'twenty-shared/workflow';

import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { WorkflowRunWorkspaceService } from 'src/modules/workflow/workflow-runner/workflow-run/workflow-run.workspace-service';
import { WorkflowRunnerWorkspaceService } from 'src/modules/workflow/workflow-runner/workspace-services/workflow-runner.workspace-service';

@Controller('nestbox-ai-agent')
export class NestboxAiAgentController {
  private readonly logger = new Logger(NestboxAiAgentController.name);

  constructor(
    private readonly workflowRunWorkspaceService: WorkflowRunWorkspaceService,
    private readonly workflowRunnerWorkspaceService: WorkflowRunnerWorkspaceService,
  ) {}

  @All('callback')
  @UseGuards(JwtAuthGuard, WorkspaceAuthGuard)
  async handleCallback(
    @Body() body: any,
    @Query('workflowRunId') workflowRunId: string,
    @Query('workspaceId') workspaceId: string,
    @Query('stepId') stepId: string,
  ) {
    this.logger.log(
      `Nestbox AI Agent callback payload: ${JSON.stringify(body)}`,
    );

    const eventType = body?.eventType || body?.type;
    const isError = eventType === 'QUERY_FAILED';

    await this.workflowRunWorkspaceService.updateWorkflowRunStepInfo({
      stepId,
      workflowRunId,
      workspaceId,
      stepInfo: {
        status: isError ? StepStatus.FAILED : StepStatus.SUCCESS,
        result: body?.data || {},
        error: isError ? body : undefined,
      },
    });

    await this.workflowRunnerWorkspaceService.resume({
      workspaceId,
      workflowRunId,
      lastExecutedStepId: stepId,
    });

    return { received: true };
  }
}
