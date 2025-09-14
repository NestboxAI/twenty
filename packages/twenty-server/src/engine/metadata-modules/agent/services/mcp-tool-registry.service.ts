import { Injectable, Logger } from '@nestjs/common';

import { type ToolSet } from 'ai';
import { z } from 'zod';

import {
    MCP_SERVER_CONFIGS,
    type McpServerConfig,
    type McpServerId,
} from '../constants/mcp-server-configs.const';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverId: string;
  serverConfig: McpServerConfig;
  endpoint?: string; // For demo tools that call direct endpoints
}

@Injectable()
export class McpToolRegistryService {
  private readonly logger = new Logger(McpToolRegistryService.name);
  private mcpToolsCache: Map<string, McpTool[]> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getMcpToolsForServerIds(serverIds: string[]): Promise<ToolSet> {
    this.logger.log(`Fetching MCP tools for server IDs: ${serverIds.join(', ')}`);
    
    const allTools: ToolSet = {};
    
    for (const serverId of serverIds) {
      try {
        const tools = await this.getMcpToolsForServer(serverId);
        
        // Convert MCP tools to AI ToolSet format
        for (const tool of tools) {
          // Sanitize tool name to match OpenAI pattern ^[a-zA-Z0-9_-]+$
          const sanitizedToolName = tool.name
            .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace invalid chars with underscore
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
          
          const toolKey = `${serverId}_${sanitizedToolName}`;
          
          if (tool.name !== sanitizedToolName) {
            this.logger.log(`Sanitized tool name: "${tool.name}" → "${sanitizedToolName}"`);
          }
          
          allTools[toolKey] = {
            description: tool.description,
            parameters: this.convertMcpSchemaToZod(tool.inputSchema),
            execute: async (params: any) => {
              return await this.executeMcpTool(tool, params);
            },
          };
        }
        
        this.logger.log(`Successfully loaded ${tools.length} tools from server ${serverId}`);
      } catch (error) {
        this.logger.error(`Failed to load tools from MCP server ${serverId}:`, error);
        // Continue with other servers even if one fails
      }
    }
    
    this.logger.log(`Total MCP tools loaded: ${Object.keys(allTools).length}`);
    return allTools;
  }

  private async getMcpToolsForServer(serverId: string): Promise<McpTool[]> {
    const serverConfig = MCP_SERVER_CONFIGS[serverId as McpServerId];
    
    if (!serverConfig) {
      throw new Error(`MCP server configuration not found for ID: ${serverId}`);
    }

    // Check cache first
    const cached = this.mcpToolsCache.get(serverId);
    const lastFetch = this.lastFetchTime.get(serverId) || 0;
    const now = Date.now();

    if (cached && (now - lastFetch) < this.CACHE_TTL) {
      this.logger.log(`Using cached MCP tools for server ${serverId}`);
      return cached;
    }

    this.logger.log(`Fetching MCP tools from server: ${serverConfig.name} (${serverConfig.url})`);

    try {
      // Fetch tools from MCP server
      const tools = await this.fetchToolsFromMcpServer(serverConfig);
      
      // Cache the results
      this.mcpToolsCache.set(serverId, tools);
      this.lastFetchTime.set(serverId, now);
      
      return tools;
    } catch (error) {
      this.logger.error(`Failed to fetch tools from MCP server ${serverId}:`, error);
      
      // Return cached version if available, even if expired
      if (cached) {
        this.logger.warn(`Using expired cache for MCP server ${serverId}`);
        return cached;
      }
      
      throw error;
    }
  }

//   private async fetchToolsFromMcpServer(serverConfig: McpServerConfig): Promise<McpTool[]> {
//     try {
//       // Try POST first (standard MCP protocol)
//       let response = await fetch(serverConfig.url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           id: 1,
//           method: 'tools/list',
//           params: {},
//         }),
//       });

//       // If POST fails with 405, try GET (for SSE endpoints)
//       if (response.status === 405) {
//         this.logger.log(`POST not allowed, trying GET for ${serverConfig.name}`);
//         response = await fetch(serverConfig.url, {
//           method: 'GET',
//           headers: {
//             'Accept': 'application/json',
//           },
//         });
//       }

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(`MCP server error: ${data.error.message}`);
//       }

//       const tools: McpTool[] = (data.result?.tools || []).map((tool: any) => ({
//         name: tool.name,
//         description: tool.description || `Tool: ${tool.name}`,
//         inputSchema: tool.inputSchema || { type: 'object', properties: {}, required: [] },
//         serverId: serverConfig.id,
//         serverConfig,
//       }));

//       this.logger.log(`Fetched ${tools.length} tools from MCP server ${serverConfig.name}`);
//       return tools;
//     } catch (error) {
//       this.logger.error(`Error fetching from MCP server ${serverConfig.url}:`, error);
//       throw new Error(`Failed to fetch tools from MCP server: ${error.message}`);
//     }
//   }
private async fetchToolsFromMcpServer(serverConfig: McpServerConfig): Promise<McpTool[]> {
    try {
      // Special handling for demo SSE endpoint with embedded config
      if (serverConfig.url.includes('sse?config=')) {
        return this.parseToolsFromDemoUrl(serverConfig);
      }

      // Try POST first (standard MCP protocol)
      let response = await fetch(serverConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        }),
      });

      // If POST fails with 405, try GET (for SSE endpoints)
      if (response.status === 405) {
        this.logger.log(`POST not allowed, trying GET for ${serverConfig.name}`);
        response = await fetch(serverConfig.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`MCP server error: ${data.error.message}`);
      }

      const tools: McpTool[] = (data.result?.tools || []).map((tool: any) => ({
        name: tool.name,
        description: tool.description || `Tool: ${tool.name}`,
        inputSchema: tool.inputSchema || { type: 'object', properties: {}, required: [] },
        serverId: serverConfig.id,
        serverConfig,
      }));

      this.logger.log(`Fetched ${tools.length} tools from MCP server ${serverConfig.name}`);
      return tools;
    } catch (error: any) {
      this.logger.error(`Error fetching from MCP server ${serverConfig.url}:`, error);
      throw new Error(`Failed to fetch tools from MCP server: ${error.message}`);
    }
  }

  private parseToolsFromDemoUrl(serverConfig: McpServerConfig): McpTool[] {
    try {
      // Extract config parameter from URL
      const url = new URL(serverConfig.url);
      const configParam = url.searchParams.get('config');
      
      if (!configParam) {
        throw new Error('No config parameter found in demo URL');
      }

      // Decode base64 config
      const configJson = Buffer.from(configParam, 'base64').toString('utf-8');
      const config = JSON.parse(configJson);
      
      this.logger.log(`Parsed config from demo URL: ${JSON.stringify(config.serverInfo)}`);

      const tools: McpTool[] = (config.tools || []).map((tool: any) => ({
        name: tool.name,
        description: tool.description || `Tool: ${tool.name}`,
        inputSchema: tool.inputSchema || { type: 'object', properties: {}, required: [] },
        serverId: serverConfig.id,
        serverConfig,
        endpoint: tool.endpoint, // Store the endpoint for execution
      }));

      this.logger.log(`Parsed ${tools.length} tools from demo URL config`);
      return tools;
    } catch (error: any) {
      this.logger.error(`Error parsing demo URL config:`, error);
      throw new Error(`Failed to parse demo URL config: ${error.message}`);
    }
  }
  

  private async executeMcpTool(tool: McpTool, params: any): Promise<any> {
    this.logger.log(`Executing MCP tool: ${tool.name} on server ${tool.serverId}`);
    this.logger.debug(`Tool parameters:`, params);

    try {
      // Handle demo tools with direct endpoints
      if (tool.endpoint) {
        return await this.executeDirectEndpointTool(tool, params);
      }

      // Standard MCP tool execution
      const response = await fetch(tool.serverConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: tool.name,
            arguments: params,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`MCP tool execution error: ${data.error.message}`);
      }

      this.logger.log(`Successfully executed MCP tool: ${tool.name}`);
      this.logger.debug(`Tool result:`, data.result);
      
      return data.result;
    } catch (error) {
      this.logger.error(`Failed to execute MCP tool ${tool.name}:`, error);
      throw new Error(`MCP tool execution failed: ${error.message}`);
    }
  }

  private async executeDirectEndpointTool(tool: McpTool, params: any): Promise<any> {
    try {
      // Replace template variables in endpoint URL
      let endpointUrl = tool.endpoint!;
      
      // Replace {{param}} with actual values
      for (const [key, value] of Object.entries(params)) {
        endpointUrl = endpointUrl.replace(`{{${key}}}`, String(value));
      }

      this.logger.log(`Calling direct endpoint: ${endpointUrl}`);

      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Twenty-MCP-Client/1.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      this.logger.log(`✅ MCP TOOL SUCCESS: ${tool.name} (${tool.serverId}) returned data from ${endpointUrl}`);
      this.logger.log(`🌤️  Weather data retrieved successfully for the user`);
      this.logger.debug(`Tool result:`, data);
      
      return {
        success: true,
        data,
        message: `Successfully retrieved data from ${tool.name}`,
        source: 'mcp_tool',
        toolName: tool.name,
        serverId: tool.serverId,
        endpoint: endpointUrl,
      };
    } catch (error) {
      this.logger.error(`Failed to execute direct endpoint tool ${tool.name}:`, error);
      throw new Error(`Direct endpoint tool execution failed: ${error.message}`);
    }
  }

  private convertMcpSchemaToZod(schema: any): z.ZodType<any> {
    // Convert JSON Schema to Zod schema
    // This is a simplified conversion - you might want to enhance this
    // to handle more complex schema types
    
    if (!schema || schema.type !== 'object') {
      return z.object({});
    }

    const zodObject: Record<string, z.ZodType<any>> = {};
    const properties = schema.properties || {};
    const required = schema.required || [];

    for (const [key, prop] of Object.entries(properties)) {
      const propSchema = prop as any;
      let zodType: z.ZodType<any>;

      switch (propSchema.type) {
        case 'string':
          zodType = z.string();
          if (propSchema.description) {
            zodType = zodType.describe(propSchema.description);
          }
          break;
        case 'number':
          zodType = z.number();
          if (propSchema.description) {
            zodType = zodType.describe(propSchema.description);
          }
          break;
        case 'boolean':
          zodType = z.boolean();
          if (propSchema.description) {
            zodType = zodType.describe(propSchema.description);
          }
          break;
        case 'array':
          zodType = z.array(z.any());
          if (propSchema.description) {
            zodType = zodType.describe(propSchema.description);
          }
          break;
        default:
          zodType = z.any();
          if (propSchema.description) {
            zodType = zodType.describe(propSchema.description);
          }
      }

      // Make optional if not in required array
      if (!required.includes(key)) {
        zodType = zodType.optional();
      }

      zodObject[key] = zodType;
    }

    return z.object(zodObject);
  }

  // Clear cache for a specific server or all servers
  clearCache(serverId?: string): void {
    if (serverId) {
      this.mcpToolsCache.delete(serverId);
      this.lastFetchTime.delete(serverId);
      this.logger.log(`Cleared MCP tools cache for server: ${serverId}`);
    } else {
      this.mcpToolsCache.clear();
      this.lastFetchTime.clear();
      this.logger.log('Cleared all MCP tools cache');
    }
  }
}
