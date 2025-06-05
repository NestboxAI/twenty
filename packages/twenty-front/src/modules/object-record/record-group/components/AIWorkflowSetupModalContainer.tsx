import { AIWorkflowSetupDrawer } from '@/object-record/record-group/components/AIWorkflowSetupModal';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useSetRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentStateV2';

export type AIWorkflowSetupModalContainerProps = {
  recordGroupId: string;
};

export const AIWorkflowSetupModalContainer = ({ 
  recordGroupId 
}: AIWorkflowSetupModalContainerProps) => {
  const modalId = `ai-workflow-setup-${recordGroupId}`;
  
  const isModalOpened = useRecoilComponentValueV2(
    isModalOpenedComponentState,
    modalId,
  );

  const setIsModalOpened = useSetRecoilComponentStateV2(
    isModalOpenedComponentState,
    modalId,
  );

  const handleClose = () => {
    setIsModalOpened(false);
  };

  return (
    <AIWorkflowSetupDrawer 
      isOpen={isModalOpened} 
      onClose={handleClose}
    />
  );
}; 