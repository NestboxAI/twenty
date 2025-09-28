import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AgentService } from 'src/engine/metadata-modules/agent/agent.service';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';

@Injectable()
export class WorkspaceAiSetupService {
  private readonly logger = new Logger(WorkspaceAiSetupService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly agentService: AgentService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(RoleEntity, 'core')
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * Sets up AI functionality for a new workspace
   * 1. Enables IS_AI_ENABLED feature flag
   * 2. Creates a default "Nestbox agent"
   * 3. Sets the agent as the workspace's default agent
   */
  async setupAiForWorkspace(workspaceId: string): Promise<void> {
    const setupStart = performance.now();
    
    try {
      this.logger.log(`Setting up AI for workspace ${workspaceId}`);

      // Step 1: Enable AI feature flag
      await this.enableAiFeatureFlag(workspaceId);

      // Step 2: Get admin role for the agent
      const adminRole = await this.getAdminRole(workspaceId);

      // Step 3: Create Nestbox agent
      const agent = await this.createNestboxAgent(workspaceId, adminRole?.id);

      // Step 4: Set as default agent
      await this.setDefaultAgent(workspaceId, agent.id);

      const setupEnd = performance.now();
      this.logger.log(
        `AI setup completed for workspace ${workspaceId} in ${setupEnd - setupStart}ms`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to setup AI for workspace ${workspaceId}:`,
        error.stack,
      );
      // Don't throw error to avoid breaking workspace creation
      // The workspace should still be created even if AI setup fails
    }
  }

  private async enableAiFeatureFlag(workspaceId: string): Promise<void> {
    try {
      await this.featureFlagService.enableFeatureFlags(
        [FeatureFlagKey.IS_AI_ENABLED],
        workspaceId,
      );
      this.logger.log(
        `AI feature flag enabled for workspace ${workspaceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to enable AI feature flag for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }

  private async getAdminRole(workspaceId: string): Promise<RoleEntity | null> {
    try {
      const adminRole = await this.roleRepository.findOne({
        where: {
          workspaceId,
          // Typically admin role is created with a standard ID, but we'll find by label if needed
          label: 'Admin',
        },
      });

      if (!adminRole) {
        // Try to find any role for this workspace as fallback
        const anyRole = await this.roleRepository.findOne({
          where: { workspaceId },
        });
        
        if (anyRole) {
          this.logger.warn(
            `Admin role not found for workspace ${workspaceId}, using role ${anyRole.label}`,
          );
          return anyRole;
        }

        this.logger.warn(
          `No roles found for workspace ${workspaceId}, agent will be created without role`,
        );
        return null;
      }

      return adminRole;
    } catch (error) {
      this.logger.error(
        `Failed to get admin role for workspace ${workspaceId}:`,
        error.message,
      );
      return null;
    }
  }

  private async createNestboxAgent(
    workspaceId: string,
    roleId?: string,
  ): Promise<{ id: string }> {
    try {
      const agent = await this.agentService.createOneAgent(
        {
          label: 'Nestbox Agent',
          name: 'nestbox-agent',
          description: 'Your helpful AI assistant for workspace tasks and insights',
          prompt:
            'You are a helpful AI assistant for this workspace. You can help users with their tasks, provide insights about their data, answer questions, and guide them through workflows. Always be concise, clear, and helpful in your responses.',
          modelId: 'auto',
          isCustom: false,
          ...(roleId && { roleId }),
        },
        workspaceId,
      );

      this.logger.log(
        `Nestbox agent created for workspace ${workspaceId} with ID ${agent.id}`,
      );

      return agent;
    } catch (error) {
      this.logger.error(
        `Failed to create Nestbox agent for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }

  private async setDefaultAgent(
    workspaceId: string,
    agentId: string,
  ): Promise<void> {
    try {
      await this.workspaceRepository.update(workspaceId, {
        defaultAgentId: agentId,
      });

      this.logger.log(
        `Default agent set for workspace ${workspaceId}: ${agentId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to set default agent for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }
}
