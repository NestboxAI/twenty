// nestbox: v1.7.0 upgrade patch
// nestbox: added workspace signup command module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceSignupCommand } from 'src/commands/workspace-signup.command';
import { ApiKeyModule } from 'src/engine/core-modules/api-key/api-key.module';
import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { WorkspaceDomainsModule } from 'src/engine/core-modules/domain/workspace-domains/workspace-domains.module';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WorkspaceEntity]),
    AuthModule,
    ApiKeyModule,
    WorkspaceModule,
    WorkspaceDomainsModule,
  ],
  providers: [WorkspaceSignupCommand],
})
export class WorkspaceSignupCommandModule {}
