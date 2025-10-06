// nestbox: v1.7.0 upgrade patch
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AgentModule } from 'src/engine/metadata-modules/agent/agent.module';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';

import { AiSetupCommand } from './ai-setup.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, RoleEntity]),
    FeatureFlagModule,
    AgentModule,
  ],
  providers: [AiSetupCommand],
})
export class AiSetupCommandModule {}
