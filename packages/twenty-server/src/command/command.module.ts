import { Module } from '@nestjs/common';

import { AppModule } from 'src/app.module';
import { ApiKeyCreateCommandModule } from 'src/commands/apikey-create-command.module';
import { WorkspaceSignupCommandModule } from 'src/commands/workspace-signup-command.module';
import { DatabaseCommandModule } from 'src/database/commands/database-command.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { WorkspaceCleanerModule } from 'src/engine/workspace-manager/workspace-cleaner/workspace-cleaner.module';
import { MessagingMessageCleanerModule } from 'src/modules/messaging/message-cleaner/messaging-message-cleaner.module';

@Module({
  imports: [
    AppModule,
    DatabaseCommandModule,
    MessagingMessageCleanerModule,
    ObjectMetadataModule,
    FieldMetadataModule,
    WorkspaceCleanerModule,
    // nestbox: added workspace signup command module
    WorkspaceSignupCommandModule,
    // nestbox: api key creation command module
    ApiKeyCreateCommandModule,
  ],
})
export class CommandModule {}
