// nestbox: it is part upgrade to 1.7.0
import { gql } from '@apollo/client';

export const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      name
      description
      type
      createdAt
      updatedAt
    }
  }
`; 