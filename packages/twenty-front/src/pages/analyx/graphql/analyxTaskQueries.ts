import { gql } from '@apollo/client';

export const CREATE_ANALYX_TASK = gql`
  mutation CreateAnalyxTask($input: CreateAnalyxTaskInput!) {
    createAnalyxTask(input: $input) {
      id
      name
      prompt
      status
      input
      result
      errorMessage
      fileId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ANALYX_TASKS = gql`
  query GetAnalyxTasks {
    analyxTasks {
      id
      name
      prompt
      status
      input
      result
      errorMessage
      fileId
      createdAt
      updatedAt
    }
  }
`;

export const STOP_ANALYX_TASK = gql`
  mutation StopAnalyxTask($id: UUID!) {
    stopAnalyxTask(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const ARCHIVE_ANALYX_TASK = gql`
  mutation ArchiveAnalyxTask($id: UUID!) {
    archiveAnalyxTask(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const REMOVE_ANALYX_TASK = gql`
  mutation RemoveAnalyxTask($id: UUID!) {
    removeAnalyxTask(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const GET_ANALYX_TASK = gql`
  query GetAnalyxTask($id: UUID!) {
    analyxTask(id: $id) {
      id
      name
      prompt
      status
      input
      result
      errorMessage
      fileId
      createdAt
      updatedAt
    }
  }
`;
