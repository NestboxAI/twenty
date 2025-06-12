import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useMutation } from '@apollo/client';
import {
    AiAgentConfig,
    UPDATE_AI_AGENT_CONFIG,
    UpdateAiAgentConfigInput
} from '../services/aiAgentWorkflowService';

export const useUpdateAiAgentConfig = () => {
  const { enqueueSnackBar } = useSnackBar();

  const [updateAiAgentConfigMutation, { loading, error, data }] = useMutation<
    { updateAiAgentConfig: AiAgentConfig },
    { id: string; input: UpdateAiAgentConfigInput }
  >(UPDATE_AI_AGENT_CONFIG, {
    onCompleted: (data) => {
      if (data?.updateAiAgentConfig?.id) {
        enqueueSnackBar('AI workflow configuration updated successfully!', {
          variant: SnackBarVariant.Success,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      enqueueSnackBar(`Failed to update AI workflow configuration: ${error.message}`, {
        variant: SnackBarVariant.Error,
        duration: 5000,
      });
    },
  });

  const updateAiAgentConfig = async (id: string, input: UpdateAiAgentConfigInput) => {
    try {
      const result = await updateAiAgentConfigMutation({
        variables: { id, input },
      });
      return result.data?.updateAiAgentConfig;
    } catch (err) {
      // Error is already handled by onError callback
      throw err;
    }
  };

  return {
    updateAiAgentConfig,
    loading,
    error,
    data,
  };
}; 