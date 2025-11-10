import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { type ToolSet } from 'ai';
import { Repository } from 'typeorm';

import { ToolAdapterService } from 'src/engine/core-modules/ai/services/tool-adapter.service';
import { ToolService } from 'src/engine/core-modules/ai/services/tool.service';
import { type ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { WorkflowToolWorkspaceService as WorkflowToolService } from 'src/modules/workflow/workflow-tools/services/workflow-tool.workspace-service';
// nestbox: upgrade to 1.7.0 - Add MCP tools support
import { AgentService } from 'src/engine/metadata-modules/agent/agent.service';
import { McpToolsHandlerService } from './services/mcp-tools-handler.service';

@Injectable()
export class AgentToolGeneratorService {
  private readonly logger = new Logger(AgentToolGeneratorService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly toolAdapterService: ToolAdapterService,
    private readonly toolService: ToolService,
    private readonly workflowToolService: WorkflowToolService,
    private readonly permissionsService: PermissionsService,
    private readonly agentService: AgentService,
    // nestbox: upgrade to 1.7.0 - Add MCP tools handler
    private readonly mcpToolsHandlerService: McpToolsHandlerService,
  ) {}

  async generateToolsForAgent(
    agentId: string,
    workspaceId: string,
    actorContext?: ActorMetadata,
    roleIds?: string[],
  ): Promise<ToolSet> {
    let tools: ToolSet = {};

    try {
      const agent = await this.agentService.findOneAgent(agentId, workspaceId);

      const actionTools = await this.toolAdapterService.getTools();

      tools = { ...actionTools };

      // nestbox: upgrade to 1.7.0 - Generate MCP tools
      const mcpTools = await this.mcpToolsHandlerService.generateMcpToolsForAgent(agent);
      tools = { ...tools, ...mcpTools };

      const roleId = agent.roleId;
      if (!roleId) {
        return tools;
      }

      const role = await this.roleRepository.findOne({
        where: {
          id: roleId,
          workspaceId,
        },
        relations: ['permissionFlags'],
      });

      console.log('🔍 🔍 🔍 Generating tools for agent:', agent.name, 'with role:', role?.label);
      if (!role || !roleIds) {
        return tools;
      }

      const hasWorkflowPermission =
        await this.permissionsService.checkRolesPermissions(
          { intersectionOf: roleIds },
          workspaceId,
          PermissionFlagType.WORKFLOWS,
        );

      if (hasWorkflowPermission) {
        const workflowTools = this.workflowToolService.generateWorkflowTools(
          workspaceId,
          { intersectionOf: roleIds },
        );

        tools = { ...tools, ...workflowTools };
      }

      const databaseTools = await this.toolService.listTools(
        { intersectionOf: roleIds },
        workspaceId,
        actorContext,
      );

      tools = { ...tools, ...databaseTools };

      const roleActionTools = await this.toolAdapterService.getTools(
        { intersectionOf: roleIds },
        workspaceId,
      );

      tools = { ...tools, ...roleActionTools };
    } catch (toolError) {
      this.logger.warn(
        `Failed to generate tools for agent ${agentId}: ${toolError.message}. Proceeding without tools.`,
      );
    }

    return tools;
  }
}
