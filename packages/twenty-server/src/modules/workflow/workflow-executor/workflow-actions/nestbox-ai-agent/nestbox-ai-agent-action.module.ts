import { Module } from '@nestjs/common';

import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';
import { NestboxAiAgentWorkflowAction } from './nestbox-ai-agent.workflow-action';

@Module({
  imports: [TwentyConfigModule],
  providers: [NestboxAiAgentWorkflowAction],
  exports: [NestboxAiAgentWorkflowAction],
})
export class NestboxAiAgentActionModule {}
