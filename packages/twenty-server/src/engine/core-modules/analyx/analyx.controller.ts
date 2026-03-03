import {
  All,
  Body,
  Controller,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { AnalyxTaskService } from 'src/engine/core-modules/analyx/services/analyx-task.service';

@Controller('analyx')
export class AnalyxController {
  private readonly logger = new Logger(AnalyxController.name);

  constructor(private readonly analyxTaskService: AnalyxTaskService) {}

  @All('callback')
  @UseGuards(JwtAuthGuard, WorkspaceAuthGuard, NoPermissionGuard)
  async handleCallback(
    @Body() body: Record<string, unknown>,
    @Query('taskId') taskId: string,
    @Query('workspaceId') _workspaceId: string,
  ) {
    this.logger.log(
      `Analyx callback for task ${taskId}: ${JSON.stringify(body)}`,
    );

    const eventType = (body?.eventType ?? body?.type) as string | undefined;

    if (eventType === 'QUERY_FAILED') {
      await this.analyxTaskService.handleFailed(
        taskId,
        _workspaceId,
        (body?.data as Record<string, unknown>) ?? {},
      );
    } else {
      await this.analyxTaskService.handleCompleted(
        taskId,
        _workspaceId,
        (body?.data as Record<string, unknown>) ?? {},
      );
    }

    return { received: true };
  }
}
