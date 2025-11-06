// nestbox: v1.7.0 upgrade patch
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource, Repository } from 'typeorm';

import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AgentHandoffEntity } from 'src/engine/metadata-modules/agent/agent-handoff.entity';
import { AgentHandoffService } from 'src/engine/metadata-modules/agent/agent-handoff.service';
import { AgentService } from 'src/engine/metadata-modules/agent/agent.service';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';

interface AiSetupOptions {
  agentName?: string;
  agentLabel?: string;
  agentDescription?: string;
  agentPrompt?: string;
  customAgentName?: string;
  customAgentLabel?: string;
  customAgentDescription?: string;
  customAgentPrompt?: string;
}

@Command({
  name: 'ai:setup',
  description:
    'Setup AI functionality for workspace (enables AI feature flag, creates default agent, custom tools agent, and handoff relationship)',
})
@Injectable()
export class AiSetupCommand extends CommandRunner {
  private readonly logger = new Logger(AiSetupCommand.name);
  private workspaceRepository: Repository<WorkspaceEntity>;
  private roleRepository: Repository<RoleEntity>;
  private agentHandoffRepository: Repository<AgentHandoffEntity>;

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly agentService: AgentService,
    private readonly agentHandoffService: AgentHandoffService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super();
    this.workspaceRepository = this.dataSource.getRepository(WorkspaceEntity);
    this.roleRepository = this.dataSource.getRepository(RoleEntity);
    this.agentHandoffRepository =
      this.dataSource.getRepository(AgentHandoffEntity);
  }

  @Option({
    flags: '--agent-name [agentName]',
    description: 'Agent name (default: nestbox-agent)',
    required: false,
  })
  parseAgentName(value: string): string {
    return value || 'nestbox-agent';
  }

  @Option({
    flags: '--agent-label [agentLabel]',
    description: 'Agent display label (default: Nestbox Agent)',
    required: false,
  })
  parseAgentLabel(value: string): string {
    return value || 'Nestbox Agent';
  }

  @Option({
    flags: '--agent-description [agentDescription]',
    description:
      'Agent description (default: Your helpful AI assistant for workspace tasks and insights)',
    required: false,
  })
  parseAgentDescription(value: string): string {
    return (
      value || 'Your helpful AI assistant for workspace tasks and insights'
    );
  }

  @Option({
    flags: '--agent-prompt [agentPrompt]',
    description:
      'Agent system prompt (default: standard helpful assistant prompt)',
    required: false,
  })
  parseAgentPrompt(value: string): string {
    return (
      value ||
      'You are a helpful AI assistant for this workspace. You can help users with their tasks, provide insights about their data, answer questions, and guide them through workflows. Always be concise, clear, and helpful in your responses.'
    );
  }

  @Option({
    flags: '--custom-agent-name [customAgentName]',
    description: 'Custom agent name (default: custom-tools-agent)',
    required: false,
  })
  parseCustomAgentName(value: string): string {
    return value || 'custom-tools-agent';
  }

  @Option({
    flags: '--custom-agent-label [customAgentLabel]',
    description: 'Custom agent display label (default: Custom Tools Agent)',
    required: false,
  })
  parseCustomAgentLabel(value: string): string {
    return value || 'Custom Tools Agent';
  }

  @Option({
    flags: '--custom-agent-description [customAgentDescription]',
    description:
      'Custom agent description (default: Custom AI agent with tool capabilities for advanced tasks)',
    required: false,
  })
  parseCustomAgentDescription(value: string): string {
    return value || 'Custom AI agent with tool capabilities for advanced tasks';
  }

  @Option({
    flags: '--custom-agent-prompt [customAgentPrompt]',
    description:
      'Custom agent system prompt (default: specialized tools prompt)',
    required: false,
  })
  parseCustomAgentPrompt(value: string): string {
    return (
      value ||
      'You are a specialized AI assistant with access to custom tools and capabilities. You can perform advanced tasks, execute workflows, and use various tools to help users accomplish complex objectives. Always be precise, thorough, and leverage your tools effectively.'
    );
  }

  async run(passedParams: string[], options: AiSetupOptions): Promise<void> {
    try {
      this.logger.log('Starting AI setup process...');

      // Find the first workspace (assuming fresh database with single workspace)
      const workspace = await this.workspaceRepository.findOne({
        where: {},
        order: { createdAt: 'ASC' },
      });

      if (!workspace) {
        throw new Error(
          'No workspace found. Please create a workspace first using workspace:signup command.',
        );
      }

      this.logger.log(
        `Found workspace: ${workspace.displayName} (${workspace.id})`,
      );

      // Check if AI is already enabled
      const isAiEnabled = await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_AI_ENABLED,
        workspace.id,
      );

      // if (isAiEnabled && workspace.defaultAgentId) {
        if (isAiEnabled) {
        // Check if custom agent and handoff already exist
        // const existingHandoffs = await this.agentHandoffRepository.find({
        //   where: {
        //     // fromAgentId: workspace.defaultAgentId,
        //     workspaceId: workspace.id,
        //   },
        //   relations: ['toAgent'],
        // });

        // if (existingHandoffs.length > 0) {
        //   this.logger.log('='.repeat(60));
        //   this.logger.log('AI ALREADY SETUP WITH HANDOFF');
        //   this.logger.log('='.repeat(60));
        //   this.logger.log(
        //     `AI is already enabled for workspace "${workspace.displayName}"`,
        //   );
        //   // this.logger.log(`Default agent ID: ${workspace.defaultAgentId}`);
        //   this.logger.log(`Existing handoffs: ${existingHandoffs.length}`);
        //   existingHandoffs.forEach((handoff, index) => {
        //     this.logger.log(
        //       `  ${index + 1}. → ${handoff.toAgent.name} (${handoff.toAgent.id})`,
        //     );
        //   });
        //   this.logger.log(
        //     'Skipping AI setup. AI functionality with handoffs is already configured.',
        //   );
        //   this.logger.log('='.repeat(60));

        //   return;
        // } else {
        //   this.logger.log('='.repeat(60));
        //   this.logger.log('AI PARTIALLY SETUP - ADDING HANDOFF');
        //   this.logger.log('='.repeat(60));
        //   this.logger.log(
        //     `AI is enabled but no handoffs found. Adding custom agent and handoff...`,
        //   );
        //   this.logger.log('='.repeat(60));
        // }
      }

      const setupStart = performance.now();

      let defaultAgent: { id: string };
      let isPartialSetup = false;

      // Check if we're doing a partial setup (AI enabled but no handoffs)
      // if (isAiEnabled && workspace.defaultAgentId) {
      if (isAiEnabled) {
        // Use existing default agent
        // defaultAgent = { id: workspace.defaultAgentId };
        isPartialSetup = true;
        // this.logger.log(
          // `✅ Using existing default agent: ${workspace.defaultAgentId}`,
        // );
      } else {
        // Step 1: Enable AI feature flag
        await this.enableAiFeatureFlag(workspace.id);

        // Step 2: Get admin role for the agent
        const role = await this.getRole(workspace.id);

        // Step 3: Create Nestbox agent (default agent)
        defaultAgent = await this.createAgent(workspace.id, role?.id, options);

        // Step 4: Set as default agent
        // await this.setDefaultAgent(workspace.id, defaultAgent.id);
      }

      // Step 5: Get admin role for custom agent (needed for both full and partial setup)
      const role = await this.getRole(workspace.id);

      // Step 6: Create custom agent with tools capability
      // const customAgent = await this.createCustomAgent(
      //   workspace.id,
      //   role?.id,
      //   options,
      // );

      // Step 7: Create handoff relationship from default agent to custom agent
      // const handoff = await this.createAgentHandoff(
      //   workspace.id,
      //   defaultAgent.id,
      //   customAgent.id,
      // );
      // const handoff = await this.createAgentHandoff(
      //   workspace.id,
      //   // defaultAgent.id,
      //   customAgent.id,
      // );

      const setupEnd = performance.now();

      this.logger.log('='.repeat(60));
      this.logger.log(
        isPartialSetup ? 'AI HANDOFF SETUP SUCCESSFUL' : 'AI SETUP SUCCESSFUL',
      );
      this.logger.log('='.repeat(60));
      this.logger.log(
        `Setup completed in ${Math.round(setupEnd - setupStart)}ms`,
      );
      this.logger.log('');
      this.logger.log('WORKSPACE DETAILS');
      this.logger.log('='.repeat(60));
      this.logger.log(`Workspace ID: ${workspace.id}`);
      this.logger.log(`Workspace Name: ${workspace.displayName}`);
      this.logger.log(`AI Feature Enabled: ✅`);
      this.logger.log('');
      this.logger.log('DEFAULT AGENT DETAILS');
      this.logger.log('='.repeat(60));
      // this.logger.log(`Agent ID: ${defaultAgent.id}`);
      if (!isPartialSetup) {
        this.logger.log(`Agent Name: ${options.agentName || 'nestbox-agent'}`);
        this.logger.log(
          `Agent Label: ${options.agentLabel || 'Nestbox Agent'}`,
        );
        this.logger.log(
          `Agent Description: ${options.agentDescription || 'Your helpful AI assistant for workspace tasks and insights'}`,
        );
      } else {
      }
      this.logger.log(`Role: ${role?.label || 'No role assigned'}`);
      this.logger.log('');
      this.logger.log('CUSTOM AGENT DETAILS');
      this.logger.log('='.repeat(60));
      // this.logger.log(`Agent ID: ${customAgent.id}`);
      this.logger.log(
        `Agent Name: ${options.customAgentName || 'custom-tools-agent'}`,
      );
      this.logger.log(
        `Agent Label: ${options.customAgentLabel || 'Custom Tools Agent'}`,
      );
      this.logger.log(
        `Agent Description: ${options.customAgentDescription || 'Custom AI agent with tool capabilities for advanced tasks'}`,
      );
      // this.logger.log(`Handoff ID: ${handoff.id}`);
      this.logger.log('');
      this.logger.log('='.repeat(60));
    } catch (error) {
      this.logger.error('Failed to setup AI:', error.message);
      throw error;
    }
  }

  private async enableAiFeatureFlag(workspaceId: string): Promise<void> {
    try {
      await this.featureFlagService.enableFeatureFlags(
        [FeatureFlagKey.IS_AI_ENABLED],
        workspaceId,
      );
      this.logger.log(
        `✅ AI feature flag enabled for workspace ${workspaceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to enable AI feature flag for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }

  private async getRole(workspaceId: string): Promise<RoleEntity | null> {
    try {
      // Look for Admin role that can be assigned to agents
      const role = await this.roleRepository.findOne({
        where: {
          workspaceId,
          label: 'Admin',
        },
      });

      if (!role) {
        this.logger.warn(
          `Admin role not found for workspace ${workspaceId}, agent will be created without role`,
        );
        return null;
      }

      this.logger.log(`✅ Found Admin role for agent: ${role.label}`);

      return role;
    } catch (error) {
      this.logger.error(
        `Failed to get member role for workspace ${workspaceId}:`,
        error.message,
      );

      return null;
    }
  }

  private async createAgent(
    workspaceId: string,
    roleId: string | undefined,
    options: AiSetupOptions,
  ): Promise<{ id: string }> {
    try {
      const agent = await this.agentService.createOneAgent(
        {
          label: options.agentLabel || 'Nestbox Agent',
          name: options.agentName || 'nestbox-agent',
          description:
            options.agentDescription ||
            'Your helpful AI assistant for workspace tasks and insights',
          prompt:
            options.agentPrompt ||
            'You are a helpful AI assistant for this workspace. You can help users with their tasks, provide insights about their data, answer questions, and guide them through workflows. Always be concise, clear, and helpful in your responses. Handoff to a specialized agent when advanced tools or capabilities are needed.',
          modelId: 'auto',
          isCustom: true,
          // ...(roleId && { roleId }),
        },
        workspaceId,
      );

      this.logger.log(`✅ Agent created with ID: ${agent.id}`);

      return agent;
    } catch (error) {
      this.logger.error(
        `Failed to create agent for workspace ${workspaceId}:`,
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
      // await this.workspaceRepository.update(workspaceId, {
      //   defaultAgentId: agentId,
      // });

      this.logger.log(`✅ Default agent set for workspace: ${agentId}`);
    } catch (error) {
      this.logger.error(
        `Failed to set default agent for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }

  private async createCustomAgent(
    workspaceId: string,
    roleId: string | undefined,
    options: AiSetupOptions,
  ): Promise<{ id: string }> {
    try {
      const customAgent = await this.agentService.createOneAgent(
        {
          label: options.customAgentLabel || 'Custom Tools Agent',
          name: options.customAgentName || 'custom-tools-agent',
          description:
            options.customAgentDescription ||
            'Custom AI agent with tool capabilities for advanced tasks',
          prompt:
            options.customAgentPrompt ||
            'You are a specialized AI assistant with access to custom tools and capabilities. You can perform advanced tasks, execute workflows, and use various tools to help users accomplish complex objectives. Always be precise, thorough, and leverage your tools effectively.',
          modelId: 'auto',
          isCustom: true, // This is the key difference - allows tools
          ...(roleId && { roleId }),
        },
        workspaceId,
      );

      this.logger.log(`✅ Custom agent created with ID: ${customAgent.id}`);

      return customAgent;
    } catch (error) {
      this.logger.error(
        `Failed to create custom agent for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }

  private async createAgentHandoff(
    workspaceId: string,
    fromAgentId: string,
    toAgentId: string,
  ): Promise<AgentHandoffEntity> {
    try {
      const handoff = await this.agentHandoffService.createHandoff({
        fromAgentId,
        toAgentId,
        workspaceId,
        description:
          'Handoff from default agent to custom tools agent for advanced tasks requiring tool capabilities',
      });

      this.logger.log(
        `✅ Agent handoff created: ${fromAgentId} → ${toAgentId}`,
      );

      return handoff;
    } catch (error) {
      this.logger.error(
        `Failed to create agent handoff for workspace ${workspaceId}:`,
        error.message,
      );
      throw error;
    }
  }
}
