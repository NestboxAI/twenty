import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import {
  OperatingModelApplyResultDto,
  OperatingModelFileDto,
  OperatingModelSaveResultDto,
  OperatingModelVersionDto,
  WorkspaceAgentStatusDto,
  WorkspaceCommandDto,
} from 'src/engine/core-modules/operating-model/dtos/operating-model-file.dto';
import {
  GitRemoteConnectResultDto,
  GitSyncResultDto,
} from 'src/engine/core-modules/operating-model/dtos/operating-model-remote.dto';
import { OperatingModelFileInput } from 'src/engine/core-modules/operating-model/dtos/operating-model-file.input';
import { ModelTab } from 'src/engine/core-modules/operating-model/enums/model-tab.enum';
import { OperatingModelService } from 'src/engine/core-modules/operating-model/services/operating-model.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@MetadataResolver(() => OperatingModelFileDto)
@UseGuards(WorkspaceAuthGuard)
export class OperatingModelResolver {
  constructor(
    private readonly operatingModelService: OperatingModelService,
  ) {}

  // ── Queries ─────────────────────────────────────────────

  @Query(() => [OperatingModelFileDto])
  async operatingModelFiles(
    @Args('tab', { type: () => ModelTab, nullable: true })
    tab: ModelTab | undefined,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<OperatingModelFileDto[]> {
    return this.operatingModelService.getFiles(
      workspace.id,
      tab,
      workspace.displayName,
    );
  }

  @Query(() => OperatingModelFileDto, { nullable: true })
  async operatingModelFile(
    @Args('path') filePath: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<OperatingModelFileDto | null> {
    return this.operatingModelService.getFile(workspace.id, filePath);
  }

  @Query(() => [OperatingModelVersionDto])
  async operatingModelHistory(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<OperatingModelVersionDto[]> {
    return this.operatingModelService.getHistory(workspace.id, limit);
  }

  @Query(() => OperatingModelVersionDto, { nullable: true })
  async operatingModelVersion(
    @Args('sha') sha: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<OperatingModelVersionDto | null> {
    return this.operatingModelService.getVersion(workspace.id, sha);
  }

  @Query(() => WorkspaceAgentStatusDto)
  async operatingModelStatus(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<WorkspaceAgentStatusDto> {
    return this.operatingModelService.getStatus(workspace.id);
  }

  @Query(() => [WorkspaceCommandDto])
  async workspaceCommands(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<WorkspaceCommandDto[]> {
    return this.operatingModelService.getWorkspaceCommands(workspace.id);
  }

  // ── Mutations ───────────────────────────────────────────

  @Mutation(() => OperatingModelSaveResultDto)
  async operatingModelSaveFiles(
    @Args('files', { type: () => [OperatingModelFileInput] })
    files: OperatingModelFileInput[],
    @Args('message', { type: () => String, nullable: true }) message: string | undefined,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser({ allowUndefined: true }) user: UserEntity | undefined,
  ): Promise<OperatingModelSaveResultDto> {
    return this.operatingModelService.saveFiles(
      workspace.id,
      files,
      message,
      user?.id,
    );
  }

  @Mutation(() => OperatingModelSaveResultDto)
  async operatingModelDeleteFile(
    @Args('path') filePath: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<OperatingModelSaveResultDto> {
    return this.operatingModelService.deleteFile(workspace.id, filePath);
  }

  // ── Epic 4: Apply & Rollback ──────────────────────────

  @Mutation(() => OperatingModelApplyResultDto)
  async operatingModelApply(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser({ allowUndefined: true }) user: UserEntity | undefined,
  ): Promise<OperatingModelApplyResultDto> {
    return this.operatingModelService.apply(workspace.id, user?.id);
  }

  @Mutation(() => OperatingModelApplyResultDto)
  async operatingModelRollback(
    @Args('sha') sha: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser({ allowUndefined: true }) user: UserEntity | undefined,
  ): Promise<OperatingModelApplyResultDto> {
    return this.operatingModelService.rollback(
      workspace.id,
      sha,
      user?.id,
    );
  }

  // ── Epic 6: GitHub Sync ───────────────────────────────

  @Mutation(() => GitRemoteConnectResultDto)
  async operatingModelConnectRemote(
    @Args('remoteUrl') remoteUrl: string,
  ): Promise<GitRemoteConnectResultDto> {
    const result =
      await this.operatingModelService.connectRemote(remoteUrl);

    return { success: true, publicKey: result.publicKey };
  }

  @Query(() => String, { nullable: true })
  async operatingModelPublicKey(): Promise<string | null> {
    return this.operatingModelService.getPublicKey();
  }

  @Mutation(() => GitSyncResultDto)
  async operatingModelPushToRemote(
    @Args('force', { nullable: true, defaultValue: false }) force: boolean,
  ): Promise<GitSyncResultDto> {
    return this.operatingModelService.pushToRemote(force);
  }

  @Mutation(() => GitSyncResultDto)
  async operatingModelPullFromRemote(
    @Args('force', { nullable: true, defaultValue: false }) force: boolean,
  ): Promise<GitSyncResultDto> {
    return this.operatingModelService.pullFromRemote(force);
  }

  @Mutation(() => Boolean)
  async operatingModelSetSyncEnabled(
    @Args('enabled') enabled: boolean,
  ): Promise<boolean> {
    await this.operatingModelService.setSyncEnabled(enabled);

    return true;
  }
}
