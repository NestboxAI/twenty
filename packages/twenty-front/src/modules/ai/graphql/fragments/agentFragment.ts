import { gql } from '@apollo/client';

export const AGENT_FRAGMENT = gql`
  fragment AgentFields on Agent {
    id
    name
    label
    description
    icon
    prompt
    modelId
    responseFormat
    mcpTools
    roleId
    isCustom
    modelConfiguration
    createdAt
    updatedAt
  }
`;
// nestbox: it is part upgrade to 1.7.0 (added mcpTools field)