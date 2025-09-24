import { Injectable, Logger } from '@nestjs/common';

import { type ToolSet } from 'ai';
import { z } from 'zod';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
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

  constructor(
    private readonly twentyConfigService: TwentyConfigService,
  ) {}


  private readonly logger = new Logger(McpToolRegistryService.name);
  private mcpToolsCache: Map<string, McpTool[]> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_TOOL_NAME_LENGTH = 64; // OpenAI's maximum function name length

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
          
          const toolKey = this.generateSafeToolName(serverId, sanitizedToolName);
          
          if (!toolKey) {
            this.logger.error(`Unable to generate safe tool name for: "${tool.name}" with server ID: "${serverId}"`);
            continue; // Skip this tool
          }
          
          if (tool.name !== sanitizedToolName) {
            this.logger.log(`Sanitized tool name: "${tool.name}" → "${sanitizedToolName}"`);
          }
          
          this.logger.log(`🔧 REGISTERING TOOL: "${toolKey}" (original: "${tool.name}", length: ${toolKey.length})`);
          
          const executeFunction = async (args: any, options: any) => {
            this.logger.log(`🔥 TOOL EXECUTE CALLED: ${toolKey}`);
            this.logger.log(`📋 Args:`, JSON.stringify(args, null, 2));
            this.logger.log(`⚙️ Options:`, JSON.stringify(options, null, 2));
            try {
              const result = await this.executeMcpTool(tool, args);
              this.logger.log(`🎉 TOOL EXECUTE SUCCESS: ${toolKey} returned:`, JSON.stringify(result, null, 2));
              return result;
            } catch (error) {
              this.logger.error(`💥 TOOL EXECUTE ERROR: ${toolKey} failed:`, error);
              throw error;
            }
          };

          const zodParameters = this.convertMcpSchemaToZod(tool.inputSchema);
          this.logger.log(`🔄 CONVERTED ZOD SCHEMA for ${toolKey}:`, zodParameters);
          
          allTools[toolKey] = {
            description: tool.description,
            parameters: zodParameters,
            execute: executeFunction,
          };
          
          // Verify the execute function is set correctly
          this.logger.log(`🔍 VERIFY EXECUTE FUNCTION: ${typeof allTools[toolKey].execute} for ${toolKey}`);
          
          // Test removed - execute function is working correctly
        }
        
        this.logger.log(`Successfully loaded ${tools.length} tools from server ${serverId}`);
      } catch (error) {
        this.logger.error(`Failed to load tools from MCP server ${serverId}:`, error);
        // Continue with other servers even if one fails
      }
    }
    
    this.logger.log(`Total MCP tools loaded: ${Object.keys(allTools).length}`);
    this.logger.log(`🎯 FINAL TOOL KEYS: ${Object.keys(allTools).join(', ')}`);
    return allTools;
  }

  private async getMcpToolsForServer(serverId: string): Promise<McpTool[]> {
    console.log("🚀 ~ McpToolRegistryService ~ getMcpToolsForServer ~ serverId:", serverId)
    const serverConfig = MCP_SERVER_CONFIGS[serverId as McpServerId];
    
    // if (!serverConfig) {
    //   throw new Error(`MCP server configuration not found for ID: ${serverId}`);
    // }

    // // Check cache first
    // const cached = this.mcpToolsCache.get(serverId);
    // const lastFetch = this.lastFetchTime.get(serverId) || 0;
    const now = Date.now();

    // if (cached && (now - lastFetch) < this.CACHE_TTL) {
    //   this.logger.log(`Using cached MCP tools for server ${serverId}`);
    //   return cached;
    // }
    const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
    const secretKey = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_API_KEY');
    const url = `${basePath}/agents/${serverId}/mcp`

    this.logger.log(`Fetching MCP tools from server: (${url})`);

    try {
      // Fetch tools from MCP server
      const tools = await this.fetchToolsFromMcpServer(url, secretKey, serverConfig, serverId);
      
      // Cache the results
      this.mcpToolsCache.set(serverId, tools);
      this.lastFetchTime.set(serverId, now);
      
      return tools;
    } catch (error) {
      this.logger.error(`Failed to fetch tools from MCP server ${serverId}:`, error);
      
      // Return cached version if available, even if expired
      // if (cached) {
      //   this.logger.warn(`Using expired cache for MCP server ${serverId}`);
      //   return cached;
      // }
      
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
private async fetchToolsFromMcpServer(url: string, secretKey: string, serverConfig: McpServerConfig, serverId: string): Promise<McpTool[]> {
    try {
      // Special handling for demo SSE endpoint with embedded config
      // if (serverConfig.url.includes('sse?config=')) {
      //   return this.parseToolsFromDemoUrl(serverConfig);
      // }

      // Try POST first (standard MCP protocol)
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        }),
      });
      console.log("🚀 ~ McpToolRegistryService ~ fetchToolsFromMcpServer ~ response:", response)

      // If POST fails with 405, try GET (for SSE endpoints)
      if (response.status === 405) {
        this.logger.log(`POST not allowed, trying GET for ${url}`);
        // response = await fetch(serverConfig.url, {
        //   method: 'GET',
        //   headers: {
        //     'Accept': 'application/json',
        //   },
        // });
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
        serverId: serverId,
        serverConfig: serverConfig,
      }));
      console.log("🚀 ~ McpToolRegistryService ~ fetchToolsFromMcpServer ~ tools:", tools);
      this.logger.log(`📋 DETAILED TOOL SCHEMA:`, JSON.stringify(tools, null, 2));

      this.logger.log(`Fetched ${tools.length} tools from MCP server ${url}`);
      return tools;
    } catch (error: any) {
      this.logger.error(`Error fetching from MCP server ${url}:`, error);
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
    this.logger.log(`🚀 EXECUTING MCP TOOL: ${tool.name} on server ${tool.serverId}`);
    this.logger.log(`📋 Tool parameters:`, JSON.stringify(params, null, 2));

    try {
      // Validate and convert schema parameters if needed
      const validatedParams = this.validateAndConvertSchemaParams(params);
      
      // Handle demo tools with direct endpoints
      if (tool.endpoint) {
        return await this.executeDirectEndpointTool(tool, validatedParams);
      }

      // For remote MCP tools, construct the URL dynamically
      let toolUrl: string;
      if (tool.serverConfig?.url) {
        // Use serverConfig URL if available (for local MCP servers)
        toolUrl = tool.serverConfig.url;
        this.logger.log(`📍 Using serverConfig URL: ${toolUrl}`);
      } else {
        // Construct URL for remote MCP tools
        const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
        toolUrl = `${basePath}/agents/${tool.serverId}/mcp`;
        this.logger.log(`📍 Using remote MCP URL: ${toolUrl}`);
      }

      const secretKey = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_API_KEY');
      this.logger.log(`🔑 Using API key (first 10 chars): ${secretKey?.substring(0, 10)}...`);

      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: tool.name,
          arguments: validatedParams,
        },
      };

      this.logger.log(`📤 MCP TOOL REQUEST: ${toolUrl}`, JSON.stringify(requestBody, null, 2));

      // Standard MCP tool execution
      const response = await fetch(toolUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
          'Request-Timeout': '60'
        },
        body: JSON.stringify(requestBody),
      });
      
      this.logger.log(`📥 MCP TOOL RESPONSE STATUS: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`MCP tool execution error: ${data.error.message}`);
      }

      this.logger.log(`✅ MCP TOOL SUCCESS: ${tool.name} executed successfully`);
      this.logger.log(`📊 Tool result:`, JSON.stringify(data.result, null, 2));
      
      return data.result;
    } catch (error) {
      this.logger.error(`❌ MCP TOOL FAILED: ${tool.name} execution failed:`, error);
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

  private validateAndConvertSchemaParams(params: any): any {
    const validatedParams = { ...params };
    
    // Check for output_schema_json parameter that needs conversion
    if (params.output_schema_json && typeof params.output_schema_json === 'string') {
      try {
        // Try to parse as JSON first - if it's a simple object like {"title":"string"}
        const parsed = JSON.parse(params.output_schema_json);
        
        // Check if it's in the simplified format (e.g., {"title": "string", "description": "string"})
        if (typeof parsed === 'object' && !parsed.type && !parsed.properties) {
          // Convert simple format to proper JSON Schema
          const properties: Record<string, any> = {};
          for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'string') {
              if (value === 'array') {
                properties[key] = { 
                  type: 'array',
                  items: { type: 'string' } // Default array item type
                };
              } else if (value === 'object') {
                properties[key] = { 
                  type: 'object',
                  properties: {} // Default empty object
                };
              } else {
                properties[key] = { type: value };
              }
            }
          }
          
          validatedParams.output_schema_json = JSON.stringify({
            type: 'object',
            properties: properties,
          });
        } else {
          // Already in proper JSON Schema format - keep as string
          validatedParams.output_schema_json = params.output_schema_json;
        }
      } catch (error) {
        this.logger.warn(`⚠️ Failed to parse output_schema_json, keeping as string:`, error.message);
        // Keep original if parsing fails
      }
    }
    
    return validatedParams;
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
          // Handle array items schema
          if (propSchema.items) {
            if (propSchema.items.type === 'string') {
              zodType = z.array(z.string());
            } else if (propSchema.items.type === 'number') {
              zodType = z.array(z.number());
            } else if (propSchema.items.type === 'boolean') {
              zodType = z.array(z.boolean());
            } else if (propSchema.items.type === 'object') {
              zodType = z.array(z.object({}));
            } else {
              zodType = z.array(z.any());
            }
          } else {
            zodType = z.array(z.any());
          }
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

  /**
   * Generates a safe tool name that complies with OpenAI's 64-character limit
   * @param serverId The MCP server ID
   * @param toolName The sanitized tool name
   * @returns A safe tool name or null if it cannot be generated within limits
   */
  private generateSafeToolName(serverId: string, toolName: string): string | null {
    // Create a short server ID prefix to keep tool names under 64 chars
    // Take first 8 chars of serverId to create a shorter prefix
    const shortServerId = serverId.length > 8 ? serverId.substring(0, 8) : serverId;
    
    // Calculate max tool name length: MAX_LENGTH - prefix length - underscore = available chars
    const maxToolNameLength = this.MAX_TOOL_NAME_LENGTH - shortServerId.length - 1;
    
    if (maxToolNameLength <= 0) {
      this.logger.error(`Server ID too long to generate safe tool name: ${serverId}`);
      return null;
    }
    
    const truncatedToolName = toolName.length > maxToolNameLength 
      ? toolName.substring(0, maxToolNameLength)
      : toolName;
    
    const finalToolKey = `${shortServerId}_${truncatedToolName}`;
    
    // Final validation
    if (finalToolKey.length > this.MAX_TOOL_NAME_LENGTH) {
      this.logger.error(`Generated tool key still too long: ${finalToolKey} (${finalToolKey.length} chars)`);
      return null;
    }
    
    if (toolName !== truncatedToolName) {
      this.logger.log(`Truncated tool name for length: "${toolName}" → "${truncatedToolName}"`);
    }
    
    return finalToolKey;
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
