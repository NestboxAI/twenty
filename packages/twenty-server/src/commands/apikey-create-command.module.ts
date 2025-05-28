import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';

import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { ApiKeyCreateCommand } from './apikey-create.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace], 'core'),
    AuthModule,
    TwentyORMModule,
  ],
  providers: [ApiKeyCreateCommand],
})
export class ApiKeyCreateCommandModule {} 