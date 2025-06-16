import { AgentsApi, Configuration } from '@nestbox-ai/instances';
import { Injectable } from '@nestjs/common';

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
      
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to fetch agents from nestbox-ai:', error);
      throw new Error('Failed to fetch agents');
    }
  }
} 