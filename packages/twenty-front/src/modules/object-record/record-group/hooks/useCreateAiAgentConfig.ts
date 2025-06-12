import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useMutation } from '@apollo/client';
import {
  CREATE_AI_AGENT_CONFIG,
  CreateAiAgentConfigInput,
  CreateAiAgentConfigResponse
} from '../services/aiAgentWorkflowService';

export const useCreateAiAgentConfig = () => {
  const { enqueueSnackBar } = useSnackBar();

  const [createAiAgentConfigMutation, { loading, error, data }] = useMutation<
    { createAiAgentConfig: CreateAiAgentConfigResponse },
    { input: CreateAiAgentConfigInput }
  >(CREATE_AI_AGENT_CONFIG, {
    onCompleted: (data) => {
      if (data?.createAiAgentConfig?.id) {
        enqueueSnackBar('AI workflow configuration saved successfully!', {
          variant: SnackBarVariant.Success,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      enqueueSnackBar(`Failed to save AI workflow configuration: ${error.message}`, {
        variant: SnackBarVariant.Error,
        duration: 5000,
      });
    },
  });

  const createAiAgentConfig = async (input: CreateAiAgentConfigInput) => {
    try {
      const result = await createAiAgentConfigMutation({
        variables: { input },
      });
      return result.data?.createAiAgentConfig;
    } catch (err) {
      // Error is already handled by onError callback
      throw err;
    }
  };

  return {
    createAiAgentConfig,
    loading,
    error,
    data,
  };
}; 