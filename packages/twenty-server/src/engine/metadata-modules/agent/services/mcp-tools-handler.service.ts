// nestbox: upgrade to 1.7.0
// New service to handle MCP tools generation with minimal impact on existing code

import { Injectable, Logger } from '@nestjs/common';
import { type ToolSet } from 'ai';
import { McpToolRegistryCleanService } from './mcp-tool-registry-clean.service';

@Injectable()
export class McpToolsHandlerService {
  private readonly logger = new Logger(McpToolsHandlerService.name);

  constructor(
    private readonly mcpToolRegistryCleanService: McpToolRegistryCleanService,
  ) {}

  // nestbox: upgrade to 1.7.0 - Extract MCP tools generation logic
  async generateMcpToolsForAgent(agent: any): Promise<ToolSet> {
    this.logger.log(`🔧 GENERATING MCP TOOLS for agent: ${agent.name || agent.id}`);
    
    // Check if agent has MCP tools configured
    let selectedMcpServers: string[] = [];
    
    // Try different possible structures for mcpTools
    if (agent.mcpTools) {
      if (agent.mcpTools.selected && Array.isArray(agent.mcpTools.selected)) {
        // Expected structure: { selected: ["server1", "server2"] }
        selectedMcpServers = agent.mcpTools.selected;
        this.logger.log(`📋 Using mcpTools.selected structure`);
      } else if (Array.isArray(agent.mcpTools)) {
        // Alternative structure: ["server1", "server2"]
        selectedMcpServers = agent.mcpTools;
        this.logger.log(`📋 Using direct array structure`);
      } else if (typeof agent.mcpTools === 'object') {
        // Try to extract server IDs from any object structure
        const keys = Object.keys(agent.mcpTools);
        if (keys.length > 0) {
          selectedMcpServers = keys;
          this.logger.log(`📋 Using object keys as server IDs`);
        }
      }
    }
    
    if (selectedMcpServers.length === 0) {
      this.logger.log(`Agent ${agent.id} has no MCP tools configured or empty selection`);
      return {};
    }

    this.logger.log(`Agent ${agent.id} has MCP tools configured: ${selectedMcpServers.join(', ')}`);

    try {
      const mcpTools = await this.mcpToolRegistryCleanService.getMcpToolsForServerIds(selectedMcpServers);
      this.logger.log(`✅ Successfully loaded MCP tools for agent ${agent.id}`);
      return mcpTools;
    } catch (error) {
      this.logger.error(`Failed to load MCP tools for agent ${agent.id}:`, error);
      // Return empty tools set instead of throwing to not break agent execution
      return {};
    }
  }
}
