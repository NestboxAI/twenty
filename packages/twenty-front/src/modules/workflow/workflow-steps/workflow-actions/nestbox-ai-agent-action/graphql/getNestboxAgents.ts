import { gql } from '@apollo/client';

export const GET_NESTBOX_AGENTS = gql`
  query GetNestboxAgents {
    agents {
      id
      name
      description
      type
      createdAt
      updatedAt
      inputSchema
      parameters
      additionalParameters
    }
  }
`;
