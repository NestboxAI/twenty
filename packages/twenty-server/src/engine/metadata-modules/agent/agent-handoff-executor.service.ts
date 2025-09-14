import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { generateText } from 'ai';
import { Repository } from 'typeorm';

import { AiModelRegistryService } from 'src/engine/core-modules/ai/services/ai-model-registry.service';
import { AGENT_HANDOFF_PROMPT_TEMPLATE } from 'src/engine/metadata-modules/agent/constants/agent-handoff-prompt.const';

import { AgentHandoffService } from './agent-handoff.service';
import { AgentEntity } from './agent.entity';
import { AgentException, AgentExceptionCode } from './agent.exception';
import { McpToolRegistryService } from './services/mcp-tool-registry.service';

export type HandoffRequest = {
  fromAgentId: string;
  toAgentId: string;
  workspaceId: string;
  reason: string;
  context?: string;
};

@Injectable()
export class AgentHandoffExecutorService {
  private readonly logger = new Logger(AgentHandoffExecutorService.name);

  constructor(
    @InjectRepository(AgentEntity, 'core')
    private readonly agentRepository: Repository<AgentEntity>,
    private readonly agentHandoffService: AgentHandoffService,
    private readonly aiModelRegistryService: AiModelRegistryService,
    private readonly mcpToolRegistryService: McpToolRegistryService,
  ) {}

  async executeHandoff(handoffRequest: HandoffRequest) {
    try {
      const { fromAgentId, toAgentId, workspaceId } = handoffRequest;
      
      this.logger.log(`🔄 HANDOFF INITIATED: ${fromAgentId} → ${toAgentId} in workspace ${workspaceId}`);
      this.logger.log(`Handoff reason: ${handoffRequest.reason}`);

      const canHandoff = await this.agentHandoffService.canHandoffTo({
        fromAgentId,
        toAgentId,
        workspaceId,
      });

      if (!canHandoff) {
        throw new AgentException(
          `Agent ${fromAgentId} is not allowed to hand off to agent ${toAgentId}`,
          AgentExceptionCode.AGENT_EXECUTION_FAILED,
        );
      }

      const targetAgent = await this.agentRepository.findOne({
        where: { id: toAgentId, workspaceId },
      });

      if (!targetAgent) {
        this.logger.error(`❌ HANDOFF FAILED: Target agent ${toAgentId} not found`);
        throw new AgentException(
          `Target agent ${toAgentId} not found`,
          AgentExceptionCode.AGENT_NOT_FOUND,
        );
      }

      this.logger.log(`✅ HANDOFF TARGET FOUND: ${targetAgent.name} (${targetAgent.id}) with model ${targetAgent.modelId}`);

      const registeredModel = this.aiModelRegistryService.getModel(
        targetAgent.modelId,
      );

      if (!registeredModel) {
        throw new AgentException(
          `Model ${targetAgent.modelId} not found in registry`,
          AgentExceptionCode.AGENT_EXECUTION_FAILED,
        );
      }

      // Generate MCP tools for the target agent if configured
      this.logger.log(`🔧 GENERATING MCP TOOLS for handoff target: ${targetAgent.name}`);
      const mcpTools = await this.generateMcpToolsForAgent(targetAgent);

      const aiRequestConfig = {
        system: targetAgent.prompt,
        prompt: this.createHandoffPrompt(handoffRequest),
        model: registeredModel.model,
        tools: mcpTools,
        maxSteps: 5,
      };

      this.logger.log(`🚀 EXECUTING HANDOFF: Running ${targetAgent.name} with model ${registeredModel.model} and ${Object.keys(mcpTools).length} MCP tools`);
      
      const textResponse = await generateText(aiRequestConfig);

      this.logger.log(`✅ HANDOFF COMPLETED: ${targetAgent.name} executed successfully`);
      return textResponse.text;
    } catch (error) {
      this.logger.error(
        `Handoff execution failed: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        newAgentId: handoffRequest.toAgentId,
        newAgentName: 'Unknown',
        error: error.message,
      };
    }
  }

  private createHandoffPrompt(handoffRequest: HandoffRequest): string {
    const { reason, context } = handoffRequest;

    return AGENT_HANDOFF_PROMPT_TEMPLATE.replace('{reason}', reason).replace(
      '{context}',
      context || 'No additional context provided',
    );
  }

  private async generateMcpToolsForAgent(agent: AgentEntity) {
    // Check if agent has MCP tools configured
    if (!agent.mcpTools || !(agent.mcpTools as any).selected || !Array.isArray((agent.mcpTools as any).selected)) {
      this.logger.log(`Agent ${agent.id} has no MCP tools configured`);
      return {};
    }

    const selectedMcpServers = (agent.mcpTools as any).selected as string[];
    
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
      return {};
    }
  }
}
