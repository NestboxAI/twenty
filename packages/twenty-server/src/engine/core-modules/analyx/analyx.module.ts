import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyxController } from 'src/engine/core-modules/analyx/analyx.controller';
import { AnalyxTaskEntity } from 'src/engine/core-modules/analyx/entities/analyx-task.entity';
import { AnalyxTaskResolver } from 'src/engine/core-modules/analyx/resolvers/analyx-task.resolver';
import { AnalyxTaskService } from 'src/engine/core-modules/analyx/services/analyx-task.service';
import { ApiKeyModule } from 'src/engine/core-modules/api-key/api-key.module';
import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { FileModule } from 'src/engine/core-modules/file/file.module';
import { OperatingModelModule } from 'src/engine/core-modules/operating-model/operating-model.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyxTaskEntity]),
    ApiKeyModule,
    TokenModule,
    FileModule,
    OperatingModelModule,
    WorkspaceCacheStorageModule,
  ],
  providers: [AnalyxTaskService, AnalyxTaskResolver],
  controllers: [AnalyxController],
  exports: [AnalyxTaskService],
})
export class AnalyxModule {}
