// nestbox: added for upgrade to 1.7.0
import { Injectable, Logger } from '@nestjs/common';

import { AgentsApi, Configuration } from '@nestbox-ai/instances';

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
  inputSchema: Record<string, any> | null;
}

@Injectable()
export class NestboxAiService {
  private readonly logger = new Logger(NestboxAiService.name);

  constructor(private readonly twentyConfigService: TwentyConfigService) {}

  private getAgentsApi() {
    const basePath = this.twentyConfigService.get(
      'NESTBOX_AI_INSTANCE_IP',
    ) as string;
    const apiKey = this.twentyConfigService.get(
      'NESTBOX_AI_INSTANCE_API_KEY',
    ) as string;

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

      return agents;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.message ?? String(error);

      this.logger.warn(
        `Could not fetch agents from Nestbox AI` +
          (status ? ` (HTTP ${status})` : '') +
          `: ${message}`,
      );

      return [];
    }
  }

  async filteredAllAgentsWithParams(): Promise<Agent[]> {
    return this.getAllAgents();
  }
}
