import { z } from 'zod';
import { baseWorkflowActionSchema } from './base-workflow-action-schema';
import { baseWorkflowActionSettingsSchema } from './base-workflow-action-settings-schema';

export const workflowNestboxAiAgentActionSettingsSchema =
  baseWorkflowActionSettingsSchema.extend({
    input: z.object({
      agentId: z.string().optional(),
      params: z.record(z.string(), z.any()).optional(),
    }),
  });

export const workflowNestboxAiAgentActionSchema =
  baseWorkflowActionSchema.extend({
    type: z.literal('NESTBOX_AI_AGENT'),
    settings: workflowNestboxAiAgentActionSettingsSchema,
  });
