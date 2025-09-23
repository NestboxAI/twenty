/**
 * Test script to verify MCP tool integration
 * This script demonstrates how MCP tools are loaded and integrated into the agent system
 */

import { Logger } from '@nestjs/common';
import { MCP_SERVER_CONFIGS } from '../constants/mcp-server-configs.const';
import { McpToolRegistryService } from '../services/mcp-tool-registry.service';

const logger = new Logger('McpIntegrationTest');

async function testMcpIntegration() {
  logger.log('=== Testing MCP Tool Integration ===');
  
  // Test 1: Verify MCP server configs
  logger.log('\n1. Testing MCP Server Configurations:');
  logger.log(`Available MCP servers: ${Object.keys(MCP_SERVER_CONFIGS).join(', ')}`);
  
  const demoMcpConfig = MCP_SERVER_CONFIGS['demo-mcp-1'];
  if (demoMcpConfig) {
    logger.log(`MCP Config:`, {
      id: demoMcpConfig.id,
      name: demoMcpConfig.name,
      url: demoMcpConfig.url.substring(0, 100) + '...',
      version: demoMcpConfig.version,
    });
  }
  
  // Test 2: Test MCP tool registry service
  logger.log('\n2. Testing MCP Tool Registry Service:');
  
  try {
    // Note: This would normally be injected via DI
    // For testing purposes, we'll mock the TwentyConfigService
    const mockConfigService = {
      get: (key: string) => {
        // Return mock values for testing
        switch (key) {
          case 'NESTBOX_AI_INSTANCE_IP':
            return 'http://localhost:3000';
          case 'NESTBOX_AI_INSTANCE_API_KEY':
            return 'mock-api-key';
          default:
            return undefined;
        }
      }
    };
    
    const mcpToolRegistry = new McpToolRegistryService(mockConfigService as any);
    
    // Test fetching tools for demo-mcp-1
    const tools = await mcpToolRegistry.getMcpToolsForServerIds(['demo-mcp-1']);
    
    logger.log(`Successfully fetched MCP tools: ${Object.keys(tools).length} tools`);
    
    for (const [toolName, tool] of Object.entries(tools)) {
      logger.log(`- Tool: ${toolName}`);
      logger.log(`  Description: ${tool.description}`);
    }
    
  } catch (error) {
    logger.error('Failed to fetch MCP tools:', error.message);
    logger.log('This is expected if the MCP server is not running or not accessible');
  }
  
  // Test 3: Test agent mcpTools configuration format
  logger.log('\n3. Testing Agent McpTools Configuration:');
  
  const exampleAgentMcpTools = {
    selected: ['demo-mcp-1']
  };
  
  logger.log('Example agent.mcpTools configuration:', exampleAgentMcpTools);
  
  // Simulate the filtering logic
  const selectedServers = exampleAgentMcpTools.selected;
  logger.log(`Agent would load tools from servers: ${selectedServers.join(', ')}`);
  
  logger.log('\n=== MCP Integration Test Completed ===');
}

// Export for testing purposes
export { testMcpIntegration };

// Run if called directly
if (require.main === module) {
  testMcpIntegration().catch(console.error);
}
