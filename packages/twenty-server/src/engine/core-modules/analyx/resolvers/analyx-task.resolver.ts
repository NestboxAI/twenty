import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { AnalyxTaskEntity } from 'src/engine/core-modules/analyx/entities/analyx-task.entity';
import { CreateAnalyxTaskInput } from 'src/engine/core-modules/analyx/dtos/create-analyx-task.input';
import { AnalyxTaskService } from 'src/engine/core-modules/analyx/services/analyx-task.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@MetadataResolver(() => AnalyxTaskEntity)
@UseGuards(WorkspaceAuthGuard)
export class AnalyxTaskResolver {
  constructor(private readonly analyxTaskService: AnalyxTaskService) {}

  @Query(() => [AnalyxTaskEntity])
  async analyxTasks(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnalyxTaskEntity[]> {
    return this.analyxTaskService.findAllByWorkspaceId(workspace.id);
  }

  @Query(() => AnalyxTaskEntity, { nullable: true })
  async analyxTask(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnalyxTaskEntity | null> {
    return this.analyxTaskService.findById(id, workspace.id);
  }

  @Mutation(() => AnalyxTaskEntity)
  async createAnalyxTask(
    @Args('input') input: CreateAnalyxTaskInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser({ allowUndefined: true }) user: UserEntity | undefined,
  ): Promise<AnalyxTaskEntity> {
    return this.analyxTaskService.createAndDispatch(
      input,
      workspace.id,
      user?.id ?? null,
    );
  }

  @Mutation(() => AnalyxTaskEntity)
  async stopAnalyxTask(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnalyxTaskEntity> {
    return this.analyxTaskService.stopTask(id, workspace.id);
  }

  @Mutation(() => AnalyxTaskEntity)
  async archiveAnalyxTask(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnalyxTaskEntity> {
    return this.analyxTaskService.archiveTask(id, workspace.id);
  }

  @Mutation(() => AnalyxTaskEntity)
  async removeAnalyxTask(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnalyxTaskEntity> {
    return this.analyxTaskService.removeTask(id, workspace.id);
  }
}
