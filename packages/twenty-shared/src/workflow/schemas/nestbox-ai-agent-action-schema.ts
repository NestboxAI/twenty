import { z } from 'zod';
import { baseWorkflowActionSchema } from './base-workflow-action-schema';
import { workflowNestboxAiAgentActionSettingsSchema } from './nestbox-ai-agent-action-settings-schema';

export const workflowNestboxAiAgentActionSchema =
  baseWorkflowActionSchema.extend({
    type: z.literal('NESTBOX_AI_AGENT'),
    settings: workflowNestboxAiAgentActionSettingsSchema,
  });
