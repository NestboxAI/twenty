// nestbox: added for upgrade to 1.7.0
import { Module } from '@nestjs/common';

import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';

import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { NestboxAiResolver } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.resolver';
import { NestboxAiService } from 'src/engine/core-modules/ai-agent-config/nestbox-ai.service';
import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';


@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        TypeORMModule,
      ],
    }),
    TwentyConfigModule,
  ],
  providers: [
    NestboxAiResolver,
    NestboxAiService,
  ],
  exports: [
    NestboxAiService
  ],
})
export class AiAgentConfigModule {} 