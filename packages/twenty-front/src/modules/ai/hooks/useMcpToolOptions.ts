import { useQuery } from '@apollo/client';
import { SelectOption } from 'twenty-ui/input';
import { GET_MCP_TOOLS } from '../graphql/queries/mcpTools';

export const useMcpToolOptions = () => {
  const { data, loading, error } = useQuery(GET_MCP_TOOLS);

  const mcpToolOptions: SelectOption[] = data?.tools?.map(
    (tool: { label: string; value: string }) => ({
      label: tool.label,
      value: tool.value,
    })
  ) || [];

  return {
    mcpToolOptions,
    isLoading: loading,
    error,
  };
};
