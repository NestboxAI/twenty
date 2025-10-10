// nestbox: added for upgrade to 1.7.0
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestboxAiResolver } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.resolver';
import { NestboxAiService } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.service';
import { NestboxAiAgentController } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.controller';

import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';
import { ApiKeyModule } from 'src/engine/core-modules/api-key/api-key.module';
import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { DataSourceEntity } from 'src/engine/metadata-modules/data-source/data-source.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { WorkflowCommonModule } from 'src/modules/workflow/common/workflow-common.module';
import { WorkflowExecutorModule } from 'src/modules/workflow/workflow-executor/workflow-executor.module';
import { WorkflowRunModule } from 'src/modules/workflow/workflow-runner/workflow-run/workflow-run.module';
import { WorkflowRunnerModule } from 'src/modules/workflow/workflow-runner/workflow-runner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectMetadataEntity, DataSourceEntity]),
    TwentyConfigModule,
    ApiKeyModule,
    WorkflowRunModule,
    WorkflowExecutorModule,
    WorkflowRunnerModule,
    WorkflowCommonModule,
    WorkspaceCacheStorageModule,
    TokenModule,
  ],
  providers: [NestboxAiResolver, NestboxAiService],
  controllers: [NestboxAiAgentController],
  exports: [NestboxAiService],
})
export class AiAgentConfigModule {}
