import {
  type WorkflowAction,
  WorkflowActionType,
  type WorkflowNestboxAiAgentAction,
} from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action.type';

export const isWorkflowNestboxAiAgentAction = (
  action: WorkflowAction,
): action is WorkflowNestboxAiAgentAction => {
  return action.type === WorkflowActionType.NESTBOX_AI_AGENT;
};
