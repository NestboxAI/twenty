import { Module } from '@nestjs/common';

import { ApiKeyModule } from 'src/engine/core-modules/api-key/api-key.module';
import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';

import { NestboxAiAgentWorkflowAction } from './nestbox-ai-agent.workflow-action';

@Module({
  imports: [TwentyConfigModule, ApiKeyModule],
  providers: [NestboxAiAgentWorkflowAction],
  exports: [NestboxAiAgentWorkflowAction],
})
export class NestboxAiAgentActionModule {}
