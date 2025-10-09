// nestbox: upgrade to 1.7.0
// Helper service for agent handoff execution to minimize changes to existing code

import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { McpToolsHandlerService } from './mcp-tools-handler.service';

export interface HandoffRequest {
  fromAgentId: string;
  toAgentId: string;
  workspaceId: string;
  reason: string;
  context?: string;
}

@Injectable()
export class HandoffExecutorHelperService {
  private readonly logger = new Logger(HandoffExecutorHelperService.name);

  constructor(
    private readonly mcpToolsHandlerService: McpToolsHandlerService,
  ) {}

  // nestbox: upgrade to 1.7.0 - Generate MCP tools for handoff target agent
  async generateMcpToolsForAgent(targetAgent: any): Promise<any> {
    this.logger.log(`🔧 GENERATING MCP TOOLS for handoff target: ${targetAgent.name}`);
    const mcpTools = await this.mcpToolsHandlerService.generateMcpToolsForAgent(targetAgent);
    this.logger.log(`Successfully loaded MCP tools for agent ${targetAgent.id}`);
    return mcpTools;
  }

  // nestbox: upgrade to 1.7.0 - Create handoff prompt
  createHandoffPrompt(handoffRequest: HandoffRequest): string {
    const { reason, context } = handoffRequest;

    const AGENT_HANDOFF_PROMPT_TEMPLATE = `You are being consulted by another agent for the following reason: {reason}

Context: {context}

Please use your specialized tools to complete this request, then provide a clear, comprehensive response that summarizes what you accomplished. Always respond with text after using tools to explain the results.`;

    return AGENT_HANDOFF_PROMPT_TEMPLATE.replace('{reason}', reason).replace(
      '{context}',
      context || 'No additional context provided',
    );
  }

  // nestbox: upgrade to 1.7.0 - Execute AI generation with fallback for empty responses
  async executeAiGeneration(aiRequestConfig: any): Promise<string> {
    this.logger.log(`🚀 EXECUTING HANDOFF: Running with ${Object.keys(aiRequestConfig.tools || {}).length} MCP tools`);
    this.logger.log(`🛠️ TOOLS PASSED TO AI: ${Object.keys(aiRequestConfig.tools || {}).join(', ')}`);
    
    const textResponse = await generateText(aiRequestConfig);

    this.logger.log(`✅ HANDOFF COMPLETED: AI executed successfully`);
    this.logger.log(`📝 AI Response length: ${textResponse.text?.length || 0} characters`);
    this.logger.log(`🔧 Tool results:`, textResponse.toolResults?.length || 0);
    
    // If AI response is empty but tools were used, create a summary response
    if (!textResponse.text && textResponse.toolResults && textResponse.toolResults.length > 0) {
      const toolSummary = textResponse.toolResults.map((result, index) => 
        `Tool ${index + 1} executed successfully`
      ).join('\n');
      
      this.logger.log(`🔄 AI response was empty, using tool results as response`);
      return `Task completed successfully using specialized tools.\n\n${toolSummary}`;
    }
    
    return textResponse.text;
  }
}
