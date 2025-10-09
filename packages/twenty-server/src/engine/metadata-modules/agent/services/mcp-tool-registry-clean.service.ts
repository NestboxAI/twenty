// nestbox: upgrade to 1.7.0
// Clean MCP tool registry service with minimal logging and no hardcoded configs

import { Injectable, Logger } from '@nestjs/common';
import { type ToolSet } from 'ai';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { z } from 'zod';

export interface McpServerConfig {
  id: string;
  url: string;
  name: string;
  version: string;
  description: string;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverId: string;
  serverConfig: McpServerConfig;
}

@Injectable()
export class McpToolRegistryCleanService {
  private readonly logger = new Logger(McpToolRegistryCleanService.name);
  private mcpToolsCache: Map<string, McpTool[]> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_TOOL_NAME_LENGTH = 64; // OpenAI's maximum function name length

  constructor(private readonly twentyConfigService: TwentyConfigService) {}

  async getMcpToolsForServerIds(serverIds: string[]): Promise<ToolSet> {
    this.logger.log(
      `Fetching MCP tools for server IDs: ${serverIds.join(', ')}`,
    );

    const allTools: ToolSet = {};

    for (const serverId of serverIds) {
      try {
        const tools = await this.getMcpToolsForServer(serverId);

        // Convert MCP tools to AI ToolSet format
        for (const tool of tools) {
          const sanitizedToolName = tool.name
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

          if (sanitizedToolName !== tool.name) {
            this.logger.log(
              `Sanitized tool name: "${tool.name}" → "${sanitizedToolName}"`,
            );
          }

          const toolKey = this.generateSafeToolName(serverId, sanitizedToolName);

          const executeFunction = async (args: any, options: any) => {
            try {
              const result = await this.executeMcpTool(tool, args);
              return result;
            } catch (error) {
              this.logger.error(`Tool execute error: ${toolKey} failed:`, error);
              throw error;
            }
          };

          const zodParameters = this.convertMcpSchemaToZod(tool.inputSchema);

          allTools[toolKey] = {
            description: tool.description,
            inputSchema: zodParameters,
            execute: executeFunction,
          };
        }

        this.logger.log(
          `Successfully loaded ${tools.length} tools from server ${serverId}`,
        );
      } catch (error) {
        this.logger.error(`Failed to load tools from MCP server ${serverId}:`, error);
      }
    }

    this.logger.log(`Total MCP tools loaded: ${Object.keys(allTools).length}`);
    this.logger.log(`🎯 FINAL TOOL KEYS: ${Object.keys(allTools).join(', ')}`);

    return allTools;
  }

  private async getMcpToolsForServer(serverId: string): Promise<McpTool[]> {
    // nestbox: upgrade to 1.7.0 - Create dynamic server config instead of hardcoded
    const serverConfig: McpServerConfig = {
      id: serverId,
      url: '',
      name: `mcp-server-${serverId.substring(0, 8)}`,
      version: '1.0.0',
      description: `MCP Server ${serverId}`,
    };

    // Check cache first
    const cached = this.mcpToolsCache.get(serverId);
    const lastFetch = this.lastFetchTime.get(serverId) || 0;
    const now = Date.now();

    if (cached && (now - lastFetch) < this.CACHE_TTL) {
      this.logger.log(`✅ Using cached MCP tools for server ${serverId} (${cached.length} tools)`);
      return cached;
    }

    const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
    const secretKey = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_API_KEY');
    const url = `${basePath}/agents/${serverId}/mcp`;

    this.logger.log(`🔄 CACHE MISS: Fetching MCP tools from server: (${url})`);

    try {
      const tools = await this.fetchToolsFromMcpServer(url, secretKey, serverConfig, serverId);

      // Cache the results
      this.mcpToolsCache.set(serverId, tools);
      this.lastFetchTime.set(serverId, now);
      this.logger.log(`💾 CACHED: Stored ${tools.length} tools for server ${serverId}`);

      return tools;
    } catch (error) {
      this.logger.error(`Failed to fetch tools from MCP server ${serverId}:`, error);
      throw error;
    }
  }

  private generateSafeToolName(serverId: string, toolName: string): string {
    const prefix = serverId.substring(0, 8);
    const baseName = `${prefix}_${toolName}`;
    
    if (baseName.length <= this.MAX_TOOL_NAME_LENGTH) {
      return baseName;
    }
    
    const maxToolNameLength = this.MAX_TOOL_NAME_LENGTH - prefix.length - 1;
    const truncatedToolName = toolName.substring(0, maxToolNameLength);
    return `${prefix}_${truncatedToolName}`;
  }

  private async fetchToolsFromMcpServer(
    url: string,
    secretKey: string,
    serverConfig: McpServerConfig,
    serverId: string,
  ): Promise<McpTool[]> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      }),
    });

    if (!response.ok) {
      this.logger.error(
        `📥 MCP TOOL RESPONSE STATUS: ${response.status} ${response.statusText}`,
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    this.logger.log(
      `📥 MCP SERVER TOOLS LIST RESPONSE:`,
      JSON.stringify(data, null, 2),
    );
    
    if (data.error) {
      throw new Error(`MCP server error: ${data.error.message}`);
    }

    const tools = data.result?.tools || [];
    
    const mappedTools = tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      serverId,
      serverConfig,
    }));

    this.logger.log(
      `📋 DETAILED TOOL SCHEMA:`,
      JSON.stringify(mappedTools, null, 2),
    );

    this.logger.log(`Fetched ${tools.length} tools from MCP server ${url}`);
    
    return mappedTools;
  }

  private async executeMcpTool(tool: McpTool, params: any): Promise<any> {
    this.logger.log(
      `🚀 EXECUTING MCP TOOL: ${tool.name} on server ${tool.serverId}`,
    );
    this.logger.log(`📋 Tool parameters:`, JSON.stringify(params, null, 2));

    const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
    const secretKey = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_API_KEY');
    const url = `${basePath}/agents/${tool.serverId}/mcp`;

    this.logger.log(`📍 Using remote MCP URL: ${url}`);
    this.logger.log(
      `🔑 Using API key (first 10 chars): ${secretKey?.substring(0, 10)}...`,
    );

    // Validate and convert parameters
    const validatedParams = this.validateAndConvertParams(tool, params);

    const requestBody = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: tool.name,
        arguments: validatedParams,
      },
    };

    this.logger.log(
      `📤 MCP TOOL REQUEST: ${url}`,
      JSON.stringify(requestBody, null, 2),
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    this.logger.log(
      `📥 MCP TOOL RESPONSE STATUS: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    this.logger.log(
      `📥 MCP TOOL FULL RESPONSE:`,
      JSON.stringify(data, null, 2),
    );
    
    if (data.error) {
      throw new Error(`MCP tool error: ${data.error.message}`);
    }

    this.logger.log(
      `✅ MCP TOOL SUCCESS: ${tool.name} executed successfully`,
    );
    this.logger.log(`📊 Tool result:`, JSON.stringify(data.result, null, 2));

    return data.result;
  }

  private validateAndConvertParams(tool: McpTool, params: any): any {
    const validatedParams = { ...params };

    // Handle special conversions for specific tools
    if (tool.name === 'staging-website-data-extraction' && params.crawl) {
      if (params.crawl === 'true' || params.crawl === true || params.crawl === '1') {
        validatedParams.crawl = '1';
        this.logger.log(`🔄 CONVERTED CRAWL: "${params.crawl}" → 1`);
      } else if (params.crawl === 'false' || params.crawl === false || params.crawl === '0') {
        validatedParams.crawl = '0';
        this.logger.log(`🔄 CONVERTED CRAWL: "${params.crawl}" → 0`);
      } else if (typeof params.crawl === 'string' && /^\d+$/.test(params.crawl)) {
        const crawlNum = parseInt(params.crawl, 10);
        validatedParams.crawl = params.crawl;
        this.logger.log(
          `🔄 CONVERTED CRAWL: "${params.crawl}" → ${crawlNum}`,
        );
      }
    }

    // Convert simple schema to JSON Schema format if needed
    if (params.output_schema_json && typeof params.output_schema_json === 'string') {
      try {
        const parsed = JSON.parse(params.output_schema_json);
        if (parsed && typeof parsed === 'object' && !parsed.type) {
          const jsonSchema = {
            type: 'object',
            properties: Object.keys(parsed).reduce((acc, key) => {
              const value = parsed[key];
              acc[key] = { type: value === 'integer' ? 'integer' : 'string' };
              return acc;
            }, {} as any),
          };
          validatedParams.output_schema_json = JSON.stringify(jsonSchema);
          this.logger.log(
            `🔄 CONVERTED SCHEMA: Converted simple schema to JSON Schema format`,
          );
          this.logger.log(`📋 Original:`, params.output_schema_json);
          this.logger.log(`📋 Converted:`, validatedParams.output_schema_json);
        }
      } catch (e) {
        // Keep original if parsing fails
      }
    }

    return validatedParams;
  }

  private convertMcpSchemaToZod(schema: any): z.ZodSchema {
    if (!schema || typeof schema !== 'object') {
      return z.object({});
    }

    const zodFields: Record<string, z.ZodTypeAny> = {};

    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties as Record<string, any>)) {
        let zodType: z.ZodTypeAny;

        switch (prop.type) {
          case 'string':
            zodType = z.string();
            if (prop.minLength) zodType = (zodType as z.ZodString).min(prop.minLength);
            if (prop.maxLength) zodType = (zodType as z.ZodString).max(prop.maxLength);
            break;
          case 'number':
          case 'integer':
            zodType = z.number();
            break;
          case 'boolean':
            zodType = z.boolean();
            break;
          case 'array':
            zodType = z.array(z.any());
            break;
          default:
            zodType = z.any();
        }

        if (prop.description) {
          zodType = zodType.describe(prop.description);
        }

        if (prop.default !== undefined) {
          zodType = zodType.default(prop.default);
        }

        const isRequired = schema.required && schema.required.includes(key);
        if (!isRequired) {
          zodType = zodType.optional();
        }

        zodFields[key] = zodType;
      }
    }

    return z.object(zodFields);
  }
}
