import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { type ToolSet } from 'ai';
import { Repository } from 'typeorm';
import { z } from 'zod';

import { ToolAdapterService } from 'src/engine/core-modules/ai/services/tool-adapter.service';
import { ToolService } from 'src/engine/core-modules/ai/services/tool.service';
import { AgentHandoffExecutorService } from 'src/engine/metadata-modules/agent/agent-handoff-executor.service';
import { AgentHandoffService } from 'src/engine/metadata-modules/agent/agent-handoff.service';
import { AgentService } from 'src/engine/metadata-modules/agent/agent.service';
import { AGENT_HANDOFF_DESCRIPTION_TEMPLATE } from 'src/engine/metadata-modules/agent/constants/agent-handoff-description.const';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { camelCase } from 'src/utils/camel-case';
import { McpToolRegistryService } from './services/mcp-tool-registry.service';

@Injectable()
export class AgentToolService {
  private readonly logger = new Logger(AgentToolService.name);

  constructor(
    private readonly agentService: AgentService,
    private readonly agentHandoffService: AgentHandoffService,
    private readonly agentHandoffExecutorService: AgentHandoffExecutorService,
    @InjectRepository(RoleEntity, 'core')
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly toolService: ToolService,
    private readonly toolAdapterService: ToolAdapterService,
    private readonly mcpToolRegistryService: McpToolRegistryService,
  ) {}

  async generateToolsForAgent(
    agentId: string,
    workspaceId: string,
  ): Promise<ToolSet> {
    this.logger.log(`Generating tools for agent ${agentId} in workspace ${workspaceId}`);
    
    const agent = await this.agentService.findOneAgent(agentId, workspaceId);

    // Generate handoff tools
    const handoffTools = await this.generateHandoffTools(agentId, workspaceId);
    this.logger.log(`Generated ${Object.keys(handoffTools).length} handoff tools`);

    // Generate MCP tools if configured
    const mcpTools = await this.generateMcpTools(agent);
    this.logger.log(`Generated ${Object.keys(mcpTools).length} MCP tools`);

    if (!agent.roleId) {
      const actionTools = await this.toolAdapterService.getTools();
      this.logger.log(`Generated ${Object.keys(actionTools).length} action tools (no role)`);

      const allTools = { ...actionTools, ...handoffTools, ...mcpTools };
      this.logger.log(`Total tools generated: ${Object.keys(allTools).length}`);
      return allTools;
    }

    const role = await this.roleRepository.findOne({
      where: {
        id: agent.roleId,
        workspaceId,
      },
    });

    if (!role) {
      this.logger.warn(`Role ${agent.roleId} not found for agent ${agentId}`);
      const allTools = { ...handoffTools, ...mcpTools };
      this.logger.log(`Total tools generated (no role): ${Object.keys(allTools).length}`);
      return allTools;
    }

    const actionTools = await this.toolAdapterService.getTools(
      role.id,
      workspaceId,
    );
    this.logger.log(`Generated ${Object.keys(actionTools).length} action tools`);

    const databaseTools = await this.toolService.listTools(
      role.id,
      workspaceId,
    );
    this.logger.log(`Generated ${Object.keys(databaseTools).length} database tools`);

    const allTools = { ...databaseTools, ...actionTools, ...handoffTools, ...mcpTools };
    this.logger.log(`Total tools generated: ${Object.keys(allTools).length}`);
    return allTools;
  }

  private async generateHandoffTools(
    agentId: string,
    workspaceId: string,
  ): Promise<ToolSet> {
    const handoffs = await this.agentHandoffService.getAgentHandoffs({
      fromAgentId: agentId,
      workspaceId,
    });

    const handoffTools = handoffs.reduce<ToolSet>((tools, handoff) => {
      const toolName = `handoff_to_${camelCase(handoff.toAgent.name)}`;

      const handoffSchema = z.object({
        toolDescription: z
          .string()
          .describe(
            "A clear, human-readable status message describing the handoff being made. This will be shown to the user while the handoff is being processed, so phrase it as a present-tense status update (e.g., 'Transferring you to the sales agent for pricing information').",
          ),
        input: z.object({
          reason: z
            .string()
            .describe(
              'Brief explanation of why this handoff is needed (e.g., "User needs pricing information", "User requires technical support", "User wants to discuss billing")',
            ),
          context: z
            .string()
            .optional()
            .describe(
              'Any relevant context or information to pass to the receiving agent (e.g., user preferences, previous conversation details, specific requirements)',
            ),
        }),
      });

      tools[toolName] = {
        description:
          handoff.description ||
          handoff.toAgent.description ||
          AGENT_HANDOFF_DESCRIPTION_TEMPLATE.replace(
            '{agentName}',
            handoff.toAgent.name,
          ),
        parameters: handoffSchema,
        execute: async ({ input: { reason, context } }) => {
          const result = await this.agentHandoffExecutorService.executeHandoff({
            fromAgentId: agentId,
            toAgentId: handoff.toAgent.id,
            workspaceId,
            reason,
            context,
          });

          return result;
        },
      };

      return tools;
    }, {});

    return handoffTools;
  }

  private async generateMcpTools(agent: any): Promise<ToolSet> {
    // Check if agent has MCP tools configured
    if (!agent.mcpTools || !agent.mcpTools.selected || !Array.isArray(agent.mcpTools.selected)) {
      this.logger.log(`Agent ${agent.id} has no MCP tools configured`);
      return {};
    }

    const selectedMcpServers = agent.mcpTools.selected as string[];
    
    if (selectedMcpServers.length === 0) {
      this.logger.log(`Agent ${agent.id} has empty MCP tools selection`);
      return {};
    }

    this.logger.log(`Agent ${agent.id} has MCP tools configured: ${selectedMcpServers.join(', ')}`);

    try {
      const mcpTools = await this.mcpToolRegistryService.getMcpToolsForServerIds(selectedMcpServers);
      this.logger.log(`Successfully loaded MCP tools for agent ${agent.id}`);
      return mcpTools;
    } catch (error) {
      this.logger.error(`Failed to load MCP tools for agent ${agent.id}:`, error);
      // Return empty tools set instead of throwing to not break agent execution
      return {};
    }
  }
}
