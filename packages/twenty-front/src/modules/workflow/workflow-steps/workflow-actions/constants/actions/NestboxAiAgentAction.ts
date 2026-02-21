import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const NESTBOX_AI_AGENT_ACTION: {
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'NESTBOX_AI_AGENT'>;
  icon: string;
} = {
  defaultLabel: 'Nestbox AI Agent',
  type: 'NESTBOX_AI_AGENT',
  icon: 'IconBrain',
};
