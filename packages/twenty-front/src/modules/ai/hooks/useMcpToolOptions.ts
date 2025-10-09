// nestbox: it is part upgrade to 1.7.0
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useQuery } from '@apollo/client';
import { SelectOption } from 'twenty-ui/input';
import { GET_AGENTS } from '../../object-record/record-group/graphql/queries/getAgents';

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const useMcpToolOptions = () => {
  const apolloCoreClient = useApolloCoreClient();
  const { data, loading, error } = useQuery<{ agents: Agent[] }>(GET_AGENTS, {
    client: apolloCoreClient,
  });

  const mcpToolOptions: SelectOption[] = data?.agents?.map(
    (agent: Agent) => ({
      label: agent.name,
      value: agent.id,
    })
  ) || [];

  return {
    mcpToolOptions,
    isLoading: loading,
    error,
  };
};
