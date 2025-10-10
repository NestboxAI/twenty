import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const AI_ACTIONS: Array<{
  label: string;
  type: Extract<WorkflowActionType, 'AI_AGENT' | 'NESTBOX_AI_AGENT'>;
  icon: string;
}> = [
  {
    label: 'AI Agent',
    type: 'AI_AGENT',
    icon: 'IconBrain',
  },
  {
    label: 'Nestbox AI Agent',
    type: 'NESTBOX_AI_AGENT',
    icon: 'IconBrain',
  }  
];
