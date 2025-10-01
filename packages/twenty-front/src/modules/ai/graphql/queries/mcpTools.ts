import { gql } from '@apollo/client';

export const GET_MCP_TOOLS = gql`
  query GetMcpTools {
    tools {
      label
      value
    }
  }
`;
