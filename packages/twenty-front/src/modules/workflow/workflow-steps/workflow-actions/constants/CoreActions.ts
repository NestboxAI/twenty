import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const CORE_ACTIONS: Array<{
  label: string;
  type: Extract<WorkflowActionType, 'CODE' | 'SEND_EMAIL' | 'HTTP_REQUEST' | 'NESTBOX_AI_AGENT'>;
  icon: string;
}> = [
  {
    label: 'Send Email',
    type: 'SEND_EMAIL',
    icon: 'IconSend',
  },
  {
    label: 'Code',
    type: 'CODE',
    icon: 'IconCode',
  },
  {
    label: 'HTTP Request',
    type: 'HTTP_REQUEST',
    icon: 'IconWorld',
  },
  {
    label: 'Nestbox AI Agent',
    type: 'NESTBOX_AI_AGENT',
    icon: 'IconBrain',
  }
];
