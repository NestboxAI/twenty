import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { useGetAiAgentConfig } from '@/object-record/record-group/hooks/useGetAiAgentConfig';
import { Select } from '@/ui/input/components/Select';
import { TextArea } from '@/ui/input/components/TextArea';
import { TextInputV2 } from '@/ui/input/components/TextInputV2';
import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { RightDrawerFooter } from '@/ui/layout/right-drawer/components/RightDrawerFooter';
import { useListenRightDrawerClose } from '@/ui/layout/right-drawer/hooks/useListenRightDrawerClose';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { H1Title, H1TitleFontColor } from 'twenty-ui/display';
import { Button, Toggle } from 'twenty-ui/input';
import { THEME_COMMON } from 'twenty-ui/theme';
import { useIsMobile } from 'twenty-ui/utilities';

import { useCreateAiAgentConfig } from '@/object-record/record-group/hooks/useCreateAiAgentConfig';
import { useDeleteAiAgentConfig } from '@/object-record/record-group/hooks/useDeleteAiAgentConfig';
import { useUpdateAiAgentConfig } from '@/object-record/record-group/hooks/useUpdateAiAgentConfig';

const RIGHT_DRAWER_ANIMATION_VARIANTS = {
  normal: {
    x: '0%',
    width: THEME_COMMON.rightDrawerWidth,
    height: '100%',
    bottom: '0',
    top: '0',
  },
  closed: {
    x: '100%',
    width: THEME_COMMON.rightDrawerWidth,
    height: '100%',
    bottom: '0',
    top: 'auto',
  },
  fullScreen: {
    x: '0%',
    width: '100%',
    height: '100%',
    bottom: '0',
    top: '0',
  },
};

const StyledRightDrawer = styled(motion.div)`
  background: ${({ theme }) => theme.background.primary};
  border-left: 1px solid ${({ theme }) => theme.border.color.medium};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  font-family: ${({ theme }) => theme.font.family};
  height: 100%;
  overflow: hidden;
  padding: 0;
  position: fixed;
  right: 0%;
  top: 0%;
  z-index: ${RootStackingContextZIndices.RootModal};
  display: flex;
  flex-direction: column;
`;

const StyledDrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(6)};
  height: 100%;
  overflow-y: auto;
`;

const StyledTitle = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledFormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledDescription = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.xs};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledToggleField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledToggleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledToggleStatus = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.xs};
`;

export type AIWorkflowSetupDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  objectMetadataId?: string;
  viewGroupId?: string;
  viewId?: string;
  fieldMetadataId?: string;
};

export const AIWorkflowSetupDrawer = ({ 
  isOpen, 
  onClose, 
  workspaceId, 
  objectMetadataId, 
  viewGroupId, 
  viewId,
  fieldMetadataId 
}: AIWorkflowSetupDrawerProps) => {
  const isMobile = useIsMobile();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { createAiAgentConfig, loading: isCreating } = useCreateAiAgentConfig();
  const { updateAiAgentConfig, loading: isUpdating } = useUpdateAiAgentConfig();
  const { deleteAiAgentConfig, loading: isDeleting } = useDeleteAiAgentConfig();
  
  const isSubmitting = isCreating || isUpdating || isDeleting;
  
  // Fetch existing AI agent config for this context
  const { aiAgentConfig, loading: isLoadingConfig, error: configError, refetch } = useGetAiAgentConfig({
    objectMetadataId,
    fieldMetadataId,
    viewGroupId,
    viewId,
  });

  const [agentSelection, setAgentSelection] = useState('AI Agent Alpha');
  const [wipLimit, setWipLimit] = useState('1');
  const [additionalInput, setAdditionalInput] = useState('');
  const [workflowEnabled, setWorkflowEnabled] = useState(true);
  const [errors, setErrors] = useState<{
    wipLimit?: string;
    additionalInput?: string;
  }>({});

  const agentOptions = [
    { value: 'AI Agent Alpha', label: 'AI Agent Alpha' },
    { value: 'AI Agent Beta', label: 'AI Agent Beta' },
    { value: 'AI Agent Gamma', label: 'AI Agent Gamma' },
  ];

  const targetVariant = isMobile ? 'fullScreen' : 'normal';

  // Populate form with existing data when config is loaded
  useEffect(() => {
    if (aiAgentConfig && isOpen) {
      setAgentSelection(aiAgentConfig.agent || 'AI Agent Alpha');
      setWipLimit(aiAgentConfig.wipLimit?.toString() || '3');
      setAdditionalInput(aiAgentConfig.additionalInput || '');
      setWorkflowEnabled(aiAgentConfig.status === 'ENABLED');
      setErrors({});
    } else if (isOpen && !isLoadingConfig && !aiAgentConfig) {
      // Reset to defaults when no config is found
      setAgentSelection('AI Agent Alpha');
      setWipLimit('1');
      setAdditionalInput('');
      setWorkflowEnabled(true);
      setErrors({});
    }
  }, [aiAgentConfig, isOpen, isLoadingConfig]);

  const validateWipLimit = (value: string): string | undefined => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      return 'WIP Limit must be 1 or greater';
    }
    return undefined;
  };

  const validateAdditionalInput = (value: string): string | undefined => {
    if (value.length > 5000) {
      return 'Additional Input must not exceed 5000 characters';
    }
    return undefined;
  };

  const handleWipLimitChange = (value: string) => {
    setWipLimit(value);
    const error = validateWipLimit(value);
    setErrors(prev => ({ ...prev, wipLimit: error }));
  };

  const handleAdditionalInputChange = (value: string) => {
    setAdditionalInput(value);
    const error = validateAdditionalInput(value);
    setErrors(prev => ({ ...prev, additionalInput: error }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (!aiAgentConfig?.id) {
      return;
    }

    try {
      await deleteAiAgentConfig(aiAgentConfig.id);
      
      // Refetch to get the latest data (should show no config now)
      if (refetch) {
        await refetch();
      }
      
      // Clear form inputs after successful delete
      setAgentSelection('AI Agent Alpha');
      setWipLimit('1');
      setAdditionalInput('');
      setWorkflowEnabled(true);
      setErrors({});
      
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to delete AI agent config:', error);
    }
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const wipLimitError = validateWipLimit(wipLimit);
    const additionalInputError = validateAdditionalInput(additionalInput);
    
    if (wipLimitError || additionalInputError) {
      setErrors({
        wipLimit: wipLimitError,
        additionalInput: additionalInputError,
      });
      return;
    }

    // Check required fields
    if (!workspaceId || !objectMetadataId || !viewGroupId || !viewId || !fieldMetadataId) {
      console.error('Missing required fields for AI agent config creation');
      return;
    }

    try {
      if (aiAgentConfig?.id) {
        // Update existing configuration
        const updateInput = {
          objectMetadataId,
          viewId,
          fieldMetadataId,
          viewGroupId,
          agent: agentSelection,
          wipLimit: parseInt(wipLimit, 10),
          additionalInput,
          status: workflowEnabled ? ('ENABLED' as const) : ('DISABLED' as const),
        };

        await updateAiAgentConfig(aiAgentConfig.id, updateInput);
      } else {
        // Create new configuration
        const createInput = {
          workspaceId,
          agent: agentSelection,
          fieldMetadataId,
          objectMetadataId,
          wipLimit: parseInt(wipLimit, 10),
          additionalInput,
          viewGroupId,
          viewId,
          status: workflowEnabled ? ('ENABLED' as const) : ('DISABLED' as const),
        };

        await createAiAgentConfig(createInput);
      }
      
      // Refetch to get the latest data
      if (refetch) {
        await refetch();
      }
      
      // Clear form inputs after successful save
      setAgentSelection('AI Agent Alpha');
      setWipLimit('1');
      setAdditionalInput('');
      setWorkflowEnabled(true);
      setErrors({});
      
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to save AI agent config:', error);
    }
  };

  useListenRightDrawerClose(onClose);

  useListenClickOutside({
    refs: [drawerRef],
    callback: (event) => {
      // Check if the click is within a dropdown by looking for data-select-disable
      const target = event.target as HTMLElement;
      let currentElement = target;
      while (currentElement) {
        if (currentElement.hasAttribute('data-select-disable')) {
          return; // Don't close if clicking within a dropdown
        }
        currentElement = currentElement.parentElement as HTMLElement;
      }
      onClose();
    },
    listenerId: 'AI_WORKFLOW_SETUP_DRAWER_LISTENER_ID',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <StyledRightDrawer
          ref={drawerRef}
          data-testid="ai-workflow-setup-drawer"
          animate={targetVariant}
          initial="closed"
          exit="closed"
          variants={RIGHT_DRAWER_ANIMATION_VARIANTS}
          transition={{ duration: 0.2 }}
        >
          <StyledDrawerContent>
            <StyledTitle>
              <H1Title 
                title={aiAgentConfig?.id ? t`Edit Workflow Configuration` : t`Configure Workflow`} 
                fontColor={H1TitleFontColor.Primary} 
              />
              <StyledDescription>
                {aiAgentConfig?.id 
                  ? t`Update the settings for your automated workflow execution.`
                  : t`Adjust the settings for your automated workflow execution.`
                }
              </StyledDescription>
            </StyledTitle>

            <StyledFormField>
              <StyledLabel>{t`Agent Selection`}</StyledLabel>
              <Select
                value={agentSelection}
                onChange={(value: string) => setAgentSelection(value)}
                options={agentOptions}
                dropdownId="ai-workflow-agent-select"
                fullWidth
              />
              <StyledDescription>
                {t`Select an agent to execute the workflow.`}
              </StyledDescription>
            </StyledFormField>

            <StyledFormField>
              <StyledLabel>{t`WIP Limit`}</StyledLabel>
              <TextInputV2
                value={wipLimit}
                onChange={handleWipLimitChange}
                type="number"
                fullWidth
                error={errors.wipLimit}
              />
              <StyledDescription>
                {t`Number of elements to process per batch (minimum 1, e.g., every minute).`}
              </StyledDescription>
            </StyledFormField>

            <StyledFormField>
              <StyledLabel>{t`Additional Input`}</StyledLabel>
              <TextArea
                value={additionalInput}
                onChange={handleAdditionalInputChange}
                placeholder={t`Provide any additional input content for the agent...`}
                minRows={8}
                maxRows={8}
              />
              <StyledDescription>
                {t`Optional: additional content to pass to the triggered agent. ${additionalInput.length}/5000 characters`}
              </StyledDescription>
              {errors.additionalInput && (
                <StyledDescription style={{ color: 'red' }}>
                  {errors.additionalInput}
                </StyledDescription>
              )}
            </StyledFormField>

            <StyledToggleField>
              <StyledToggleInfo>
                <StyledLabel>{t`Workflow Status`}</StyledLabel>
                <StyledToggleStatus>
                  {workflowEnabled ? t`Enabled (Workflow is active)` : t`Disabled (Workflow is inactive)`}
                </StyledToggleStatus>
              </StyledToggleInfo>
              <Toggle
                value={workflowEnabled}
                onChange={setWorkflowEnabled}
              />
            </StyledToggleField>
          </StyledDrawerContent>

          <RightDrawerFooter
            actions={[
              <Button
                key="cancel"
                variant="secondary"
                accent="default"
                title={t`Cancel`}
                onClick={handleCancel}
              />,
              ...(aiAgentConfig?.id ? [
                <Button
                  key="delete"
                  variant="secondary"
                  accent="danger"
                  title={t`Delete Workflow`}
                  onClick={handleDelete}
                  disabled={isSubmitting || isLoadingConfig}
                />
              ] : []),
              <Button
                key="save"
                variant="primary"
                accent="blue"
                title={aiAgentConfig?.id ? t`Update Workflow` : t`Save Workflow`}
                onClick={handleSave}
                disabled={isSubmitting || isLoadingConfig}
              />,
            ]}
          />
        </StyledRightDrawer>
      )}
    </AnimatePresence>
  );
}; 