import { Module } from '@nestjs/common';

import { NestboxAiAgentController } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.controller';
import { NestboxAiResolver } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.resolver';
import { NestboxAiService } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.service';
import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { WorkflowRunModule } from 'src/modules/workflow/workflow-runner/workflow-run/workflow-run.module';
import { WorkflowRunnerModule } from 'src/modules/workflow/workflow-runner/workflow-runner.module';

@Module({
  imports: [
    TokenModule,
    TwentyConfigModule,
    WorkflowRunModule,
    WorkflowRunnerModule,
    WorkspaceCacheStorageModule,
  ],
  providers: [NestboxAiService, NestboxAiResolver],
  exports: [NestboxAiService],
  controllers: [NestboxAiAgentController],
})
export class AiAgentConfigModule {}
