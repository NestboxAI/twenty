import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import {
  APPLY_OPERATING_MODEL,
  CONNECT_REMOTE,
  DELETE_OPERATING_MODEL_FILE,
  PULL_FROM_REMOTE,
  PUSH_TO_REMOTE,
  ROLLBACK_OPERATING_MODEL,
  SAVE_OPERATING_MODEL_FILES,
  SET_SYNC_ENABLED,
} from '../graphql/operatingModelQueries';

export function useOperatingModelMutations() {
  const [saveFilesMutation, saveFilesState] = useMutation(
    SAVE_OPERATING_MODEL_FILES,
  );
  const [deleteFileMutation, deleteFileState] = useMutation(
    DELETE_OPERATING_MODEL_FILE,
  );
  const [applyMutation, applyState] = useMutation(APPLY_OPERATING_MODEL);
  const [rollbackMutation, rollbackState] = useMutation(
    ROLLBACK_OPERATING_MODEL,
  );
  const [connectRemoteMutation, connectRemoteState] =
    useMutation(CONNECT_REMOTE);
  const [pushMutation, pushState] = useMutation(PUSH_TO_REMOTE);
  const [pullMutation, pullState] = useMutation(PULL_FROM_REMOTE);
  const [setSyncMutation] = useMutation(SET_SYNC_ENABLED);

  const saveFiles = useCallback(
    async (files: { path: string; content: string }[], message?: string) => {
      const result = await saveFilesMutation({
        variables: { files, message },
      });

      return result.data?.operatingModelSaveFiles;
    },
    [saveFilesMutation],
  );

  const deleteFile = useCallback(
    async (path: string) => {
      const result = await deleteFileMutation({ variables: { path } });

      return result.data?.operatingModelDeleteFile;
    },
    [deleteFileMutation],
  );

  const apply = useCallback(async () => {
    const result = await applyMutation();

    return result.data?.operatingModelApply;
  }, [applyMutation]);

  const rollback = useCallback(
    async (sha: string) => {
      const result = await rollbackMutation({ variables: { sha } });

      return result.data?.operatingModelRollback;
    },
    [rollbackMutation],
  );

  const connectRemote = useCallback(
    async (remoteUrl: string) => {
      const result = await connectRemoteMutation({
        variables: { remoteUrl },
      });

      return result.data?.operatingModelConnectRemote;
    },
    [connectRemoteMutation],
  );

  const pushToRemote = useCallback(
    async (force = false) => {
      const result = await pushMutation({ variables: { force } });

      return result.data?.operatingModelPushToRemote;
    },
    [pushMutation],
  );

  const pullFromRemote = useCallback(
    async (force = false) => {
      const result = await pullMutation({ variables: { force } });

      return result.data?.operatingModelPullFromRemote;
    },
    [pullMutation],
  );

  const setSyncEnabled = useCallback(
    async (enabled: boolean) => {
      await setSyncMutation({ variables: { enabled } });
    },
    [setSyncMutation],
  );

  return {
    saveFiles,
    deleteFile,
    apply,
    rollback,
    connectRemote,
    pushToRemote,
    pullFromRemote,
    setSyncEnabled,
    loading: {
      saving: saveFilesState.loading,
      deleting: deleteFileState.loading,
      applying: applyState.loading,
      rollingBack: rollbackState.loading,
      connectingRemote: connectRemoteState.loading,
      pushing: pushState.loading,
      pulling: pullState.loading,
    },
  };
}
