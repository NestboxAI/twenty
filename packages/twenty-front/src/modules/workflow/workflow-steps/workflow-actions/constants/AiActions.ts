import { type WorkflowActionType } from '@/workflow/types/Workflow';
import { AI_AGENT_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/AiAgentAction';
import { NESTBOX_AI_AGENT_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/NestboxAiAgentAction';

export const AI_ACTIONS: Array<{
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'AI_AGENT' | 'NESTBOX_AI_AGENT'>;
  icon: string;
}> = [AI_AGENT_ACTION, NESTBOX_AI_AGENT_ACTION];
