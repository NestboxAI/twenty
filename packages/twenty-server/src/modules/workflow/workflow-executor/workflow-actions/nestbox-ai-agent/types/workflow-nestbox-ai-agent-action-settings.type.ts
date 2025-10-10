import { type BaseWorkflowActionSettings } from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action-settings.type';

import { type WorkflowNestboxAiAgentActionInput } from './workflow-nestbox-ai-agent-action-input.type';

export type WorkflowNestboxAiAgentActionSettings =
  BaseWorkflowActionSettings & {
    input: WorkflowNestboxAiAgentActionInput;
  };
