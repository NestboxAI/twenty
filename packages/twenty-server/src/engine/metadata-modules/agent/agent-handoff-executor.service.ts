import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AiModelRegistryService } from 'src/engine/core-modules/ai/services/ai-model-registry.service';

import { ProviderOptions } from '@ai-sdk/provider-utils';
import {
  generateText,
  LanguageModel,
  ModelMessage,
  StopCondition,
  streamText,
  ToolSet,
  UIDataTypes,
  UIMessage,
  UITools,
} from 'ai';
import { McpToolRegistryService } from 'src/engine/metadata-modules/agent/services/mcp-tool-registry.service';
import { Repository } from 'typeorm';

import { AgentHandoffService } from './agent-handoff.service';
import { AgentEntity } from './agent.entity';
import { AgentException, AgentExceptionCode } from './agent.exception';
// nestbox: upgrade to 1.7.0 - Add handoff helper
import { AgentToolGeneratorService } from 'src/engine/metadata-modules/agent/agent-tool-generator.service';
import { HandoffExecutorHelperService } from './services/handoff-executor-helper.service';

export type HandoffRequest = {
  fromAgentId: string;
  toAgentId: string;
  workspaceId: string;
  reason?: string;
  context?: string;
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  isStreaming?: boolean;
};

export interface AgentExecutionContext {
  prepareAIRequestConfig: (params: {
    system: string;
    agent: AgentEntity | null;
    messages: UIMessage<unknown, UIDataTypes, UITools>[];
    excludeHandoffTools?: boolean; // Prevent infinite recursion
  }) => Promise<{
    system: string;
    tools: ToolSet;
    model: LanguageModel;
    messages: ModelMessage[];
    stopWhen?: StopCondition<ToolSet>;
    providerOptions?: ProviderOptions;
  }>;
}

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

  async executeHandoff(
    handoffRequest: HandoffRequest,
    executionContext: AgentExecutionContext,
  ) {
    try {
      const {
        fromAgentId,
        toAgentId,
        workspaceId,
        messages,
        isStreaming = false,
      } = handoffRequest;

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

      // this.logger.log(`✅ HANDOFF TARGET FOUND: ${targetAgent.name} (${targetAgent.id}) with model ${targetAgent.modelId}`);

      // const registeredModel = this.aiModelRegistryService.getModel(
      //   targetAgent.modelId,
      // );

      // if (!registeredModel) {
      //   throw new AgentException(
      //     `Model ${targetAgent.modelId} not found in registry`,
      //     AgentExceptionCode.AGENT_EXECUTION_FAILED,
      //   );
      // }

      // // nestbox: upgrade to 1.7.0 - Generate MCP tools for the target agent if configured
      // const mcpTools = await this.handoffExecutorHelperService.generateMcpToolsForAgent(targetAgent);

      // const aiRequestConfig = {
      //   system: targetAgent.prompt,
      //   prompt: this.handoffExecutorHelperService.createHandoffPrompt(handoffRequest),
      //   model: registeredModel.model,
      //   tools: mcpTools,
      //   maxSteps: 5,
      // };

      // // nestbox: upgrade to 1.7.0 - Execute AI generation with fallback
      // return await this.handoffExecutorHelperService.executeAiGeneration(aiRequestConfig);
      // Prepare AI request config using the execution context
      const aiRequestConfig = await executionContext.prepareAIRequestConfig({
        system: targetAgent.prompt,
        agent: targetAgent,
        messages,
        excludeHandoffTools: true, // Prevent infinite recursion
      });

      if (isStreaming) {
        // Return stream for streaming contexts
        const stream = streamText(aiRequestConfig);

        this.logger.log(`Started streaming handoff to agent ${toAgentId}`);

        return stream;
      } else {
        // Use generateText for non-streaming contexts (workflows)
        const textResponse = await generateText(aiRequestConfig);

        this.logger.log(
          `Successfully executed handoff to agent ${toAgentId} with response length: ${textResponse.text.length}`,
        );

        return {
          success: true,
          message: `Successfully executed handoff to agent ${targetAgent.name}`,
          result: {
            response: textResponse.text,
            targetAgentName: targetAgent.name,
          },
        };
      }
    } catch (error) {
      this.logger.error(
        `Handoff execution failed: ${error.message}`,
        error.stack,
      );

      const { isStreaming = false, toAgentId } = handoffRequest;

      if (isStreaming) {
        throw error; // Let streaming context handle the error
      }

      return {
        success: false,
        newAgentId: handoffRequest.toAgentId,
        newAgentName: 'Unknown',
        message: `Failed to execute handoff to agent ${toAgentId}`,
        error: error.message,
      };
    }
  }

  // nestbox: upgrade to 1.7.0 - Methods moved to HandoffExecutorHelperService
}
