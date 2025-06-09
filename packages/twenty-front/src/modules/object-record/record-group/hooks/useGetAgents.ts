import { AgentsApi, Configuration } from '@nestbox-ai/instances';
import { useEffect, useState } from 'react';

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSelectOption {
  value: string;
  label: string;
}

export const useGetAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentOptions, setAgentOptions] = useState<AgentSelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const configuration = new Configuration({
          basePath: process.env.REACT_APP_NESTBOX_AI_INSTANCE_IP,
          baseOptions: {
            headers: {
              Authorization: process.env.REACT_APP_NESTBOX_AI_INSTANCE_API_KEY,
            },
          },
        });

        const agentsApi = new AgentsApi(configuration);
        const response = await agentsApi.agentManagementControllerGetAllAgents();
        
        // Handle the response properly - since the API returns void but may contain data in practice
        // We'll cast the response to any to access potential data or fallback to empty array
        const fetchedAgents: Agent[] = (response as any)?.data || [];
        setAgents(fetchedAgents);

        // Transform agents into select options format
        const options = fetchedAgents.map((agent: Agent) => ({
          value: agent.id,
          label: agent.name,
        }));
        setAgentOptions(options);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to fetch agents');
        // Fallback to empty array
        setAgents([]);
        setAgentOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return {
    agents,
    agentOptions,
    loading,
    error,
  };
}; 