// nestbox: v1.7.0 upgrade patch
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyCreateCommand } from 'src/commands/apikey-create.command';
import { ApiKeyNotificationService } from 'src/commands/services/api-key-notification.service';
import { ApiKeyModule } from 'src/engine/core-modules/api-key/api-key.module';
import { EmailModule } from 'src/engine/core-modules/email/email.module';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { RoleModule } from 'src/engine/metadata-modules/role/role.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity]),
    ApiKeyModule,
    RoleModule,
    PermissionsModule,
    TwentyORMModule,
    EmailModule,
    FeatureFlagModule,
  ],
  providers: [ApiKeyCreateCommand, ApiKeyNotificationService],
})
export class ApiKeyCreateCommandModule {}
