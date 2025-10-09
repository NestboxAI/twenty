import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AiModelRegistryService } from 'src/engine/core-modules/ai/services/ai-model-registry.service';

import { McpToolRegistryService } from 'src/engine/metadata-modules/agent/services/mcp-tool-registry.service';
import { AgentHandoffService } from './agent-handoff.service';
import { AgentToolGeneratorService } from './agent-tool-generator.service';
import { AgentEntity } from './agent.entity';
import { AgentException, AgentExceptionCode } from './agent.exception';
// nestbox: upgrade to 1.7.0 - Add handoff helper
import { HandoffExecutorHelperService } from './services/handoff-executor-helper.service';

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
    @InjectRepository(AgentEntity)
    private readonly agentRepository: Repository<AgentEntity>,
    private readonly agentHandoffService: AgentHandoffService,
    private readonly aiModelRegistryService: AiModelRegistryService,
    private readonly agentToolGeneratorService: AgentToolGeneratorService,
    private readonly mcpToolRegistryService: McpToolRegistryService,
    // nestbox: upgrade to 1.7.0 - Add handoff helper
    private readonly handoffExecutorHelperService: HandoffExecutorHelperService,
  ) {}

  async executeHandoff(handoffRequest: HandoffRequest) {
    try {
      const { fromAgentId, toAgentId, workspaceId } = handoffRequest;

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

      // nestbox: upgrade to 1.7.0 - Generate MCP tools for the target agent if configured
      const mcpTools = await this.handoffExecutorHelperService.generateMcpToolsForAgent(targetAgent);

      const aiRequestConfig = {
        system: targetAgent.prompt,
        prompt: this.handoffExecutorHelperService.createHandoffPrompt(handoffRequest),
        model: registeredModel.model,
        tools: mcpTools,
        maxSteps: 5,
      };

      // nestbox: upgrade to 1.7.0 - Execute AI generation with fallback
      return await this.handoffExecutorHelperService.executeAiGeneration(aiRequestConfig);
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

  // nestbox: upgrade to 1.7.0 - Methods moved to HandoffExecutorHelperService
}
