import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

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
};

export const AIWorkflowSetupDrawer = ({ isOpen, onClose }: AIWorkflowSetupDrawerProps) => {
  const isMobile = useIsMobile();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [agentSelection, setAgentSelection] = useState('AI Agent Alpha');
  const [wipLimit, setWipLimit] = useState('3');
  const [additionalInput, setAdditionalInput] = useState('');
  const [workflowEnabled, setWorkflowEnabled] = useState(true);

  const agentOptions = [
    { value: 'AI Agent Alpha', label: 'AI Agent Alpha' },
    { value: 'AI Agent Beta', label: 'AI Agent Beta' },
    { value: 'AI Agent Gamma', label: 'AI Agent Gamma' },
  ];

  const targetVariant = isMobile ? 'fullScreen' : 'normal';

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving workflow configuration:', {
      agentSelection,
      wipLimit,
      additionalInput,
      workflowEnabled,
    });
    onClose();
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
              <H1Title title={t`Configure Workflow`} fontColor={H1TitleFontColor.Primary} />
              <StyledDescription>
                {t`Adjust the settings for your automated workflow execution.`}
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
                onChange={setWipLimit}
                type="number"
                fullWidth
              />
              <StyledDescription>
                {t`Number of elements to process per batch (e.g., every minute).`}
              </StyledDescription>
            </StyledFormField>

            <StyledFormField>
              <StyledLabel>{t`Additional Input`}</StyledLabel>
              <TextArea
                value={additionalInput}
                onChange={setAdditionalInput}
                placeholder={t`Provide any additional input content for the agent...`}
                minRows={8}
                maxRows={8}
              />
              <StyledDescription>
                {t`Optional: additional content to pass to the triggered agent.`}
              </StyledDescription>
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
              <Button
                key="save"
                variant="primary"
                accent="blue"
                title={t`Save Workflow`}
                onClick={handleSave}
              />,
            ]}
          />
        </StyledRightDrawer>
      )}
    </AnimatePresence>
  );
}; 