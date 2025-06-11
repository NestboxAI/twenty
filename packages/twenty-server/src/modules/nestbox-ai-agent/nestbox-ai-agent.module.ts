import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { NestboxAiAgentCronCommand } from 'src/modules/nestbox-ai-agent/crons/commands/nestbox-ai-agent-start.command';
import { NestboxAiAgentCronStopCommand } from 'src/modules/nestbox-ai-agent/crons/commands/nestbox-ai-agent-stop.command';
import { NestboxAiAgentCronJob } from 'src/modules/nestbox-ai-agent/crons/jobs/nestbox-ai-agent.cron.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace], 'core'),
  ],
  providers: [
    NestboxAiAgentCronCommand,
    NestboxAiAgentCronStopCommand,
    NestboxAiAgentCronJob,
  ],
  exports: [],
})
export class NestboxAiAgentModule {} 