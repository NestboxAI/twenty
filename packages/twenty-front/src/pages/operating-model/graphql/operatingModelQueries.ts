import { gql } from '@apollo/client';

// ── Queries ─────────────────────────────────────────────

export const GET_OPERATING_MODEL_FILES = gql`
  query GetOperatingModelFiles($tab: ModelTab) {
    operatingModelFiles(tab: $tab) {
      path
      content
      format
    }
  }
`;

export const GET_OPERATING_MODEL_FILE = gql`
  query GetOperatingModelFile($path: String!) {
    operatingModelFile(path: $path) {
      path
      content
      format
    }
  }
`;

export const GET_OPERATING_MODEL_HISTORY = gql`
  query GetOperatingModelHistory($limit: Int) {
    operatingModelHistory(limit: $limit) {
      id
      timestamp
      user
      summary
      status
      changes {
        file
        action
        before
        after
      }
    }
  }
`;

export const GET_OPERATING_MODEL_STATUS = gql`
  query GetOperatingModelStatus {
    operatingModelStatus {
      status
      lastAppliedCommitSha
      lastAppliedAt
      lastAppliedByUserId
      errorMessage
    }
  }
`;

export const GET_WORKSPACE_COMMANDS = gql`
  query GetWorkspaceCommands {
    workspaceCommands {
      id
      name
      description
      body
      tags
      placeholder
      defaultOutput
      icon
      arguments {
        name
        description
        required
      }
      createdAt
    }
  }
`;

export const GET_OPERATING_MODEL_PUBLIC_KEY = gql`
  query GetOperatingModelPublicKey {
    operatingModelPublicKey
  }
`;

// ── Mutations ───────────────────────────────────────────

export const SAVE_OPERATING_MODEL_FILES = gql`
  mutation SaveOperatingModelFiles(
    $files: [OperatingModelFileInput!]!
    $message: String
  ) {
    operatingModelSaveFiles(files: $files, message: $message) {
      success
      commitSha
      error
    }
  }
`;

export const DELETE_OPERATING_MODEL_FILE = gql`
  mutation DeleteOperatingModelFile($path: String!) {
    operatingModelDeleteFile(path: $path) {
      success
      commitSha
      error
    }
  }
`;

export const APPLY_OPERATING_MODEL = gql`
  mutation ApplyOperatingModel {
    operatingModelApply {
      success
      commitSha
      nestboxAgentId
      error
    }
  }
`;

export const ROLLBACK_OPERATING_MODEL = gql`
  mutation RollbackOperatingModel($sha: String!) {
    operatingModelRollback(sha: $sha) {
      success
      commitSha
      nestboxAgentId
      error
    }
  }
`;

export const CONNECT_REMOTE = gql`
  mutation ConnectRemote($remoteUrl: String!) {
    operatingModelConnectRemote(remoteUrl: $remoteUrl) {
      success
      publicKey
      error
    }
  }
`;

export const PUSH_TO_REMOTE = gql`
  mutation PushToRemote($force: Boolean) {
    operatingModelPushToRemote(force: $force) {
      success
      error
    }
  }
`;

export const PULL_FROM_REMOTE = gql`
  mutation PullFromRemote($force: Boolean) {
    operatingModelPullFromRemote(force: $force) {
      success
      error
    }
  }
`;

export const SET_SYNC_ENABLED = gql`
  mutation SetSyncEnabled($enabled: Boolean!) {
    operatingModelSetSyncEnabled(enabled: $enabled)
  }
`;
