import { AgentsApi, Configuration } from '@nestbox-ai/instances';
import { Injectable, Logger } from '@nestjs/common';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

export interface Agent {
  id: string;
  name: string;
  description: string;
  sourceCodePath: string;
  entryFunctionName: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  parameters: any[];
  additionalParameters: any[];
}

@Injectable()
export class NestboxAiService {
  private readonly logger = new Logger(NestboxAiService.name);

  constructor(
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  private getAgentsApi() {
    const basePath = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP');
    const apiKey = this.twentyConfigService.get('NESTBOX_AI_INSTANCE_API_KEY');
    
    if (!basePath || !apiKey) {
      throw new Error('Nestbox AI configuration is missing');
    }

    const configuration = new Configuration({
      basePath,
      baseOptions: {
        headers: {
          Authorization: apiKey,
        },
      },
    });

    return new AgentsApi(configuration);
  }

  async getAllAgents(): Promise<Agent[]> {
    try {
      const agentsApi = this.getAgentsApi();
      const response = await agentsApi.agentManagementControllerGetAllAgents();
      const agents = (response as any).data || [];
      // this.logger.log(`Successfully fetched ${agents.length} agents from Nestbox AI`);
      return agents;
    } catch (error) {
      this.logger.error('Failed to fetch agents from nestbox-ai:', error);
      throw new Error('Failed to fetch agents from Nestbox AI');
    }
  }

  async filteredAllAgentsWithParams(): Promise<Agent[]> {
    const agents = await this.getAllAgents();

    const dedupeAgents = (agentsToDedupe: Agent[]) =>
      agentsToDedupe.map((agent) => {
        const dedupe = (items: any[] = []) => {
          const seen = new Set<string>();
          return items.filter((param) => {
            if (param.machineAgentId !== agent.id) return false;
            const key = `${param.name}-${param.machineAgentId}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        };

        return {
          ...agent,
          parameters: dedupe(agent.parameters),
          additionalParameters: dedupe(agent.additionalParameters),
        };
      });

    return dedupeAgents(agents);
  }
}