import { baseWorkflowActionSettingsSchema } from '@/workflow/schemas/base-workflow-action-settings-schema';
import { z } from 'zod';
import { baseWorkflowActionSchema } from './base-workflow-action-schema';

export const workflowNestboxAiAgentActionSettingsSchema =
baseWorkflowActionSettingsSchema.extend({
  input: z.object({
    agentId: z.string().optional(),
    params: z.record(z.any(), z.any()).optional(),
    prompt: z.string().optional(),
  }),
});

export const workflowNestboxAiAgentActionSchema =
  baseWorkflowActionSchema.extend({
    type: z.literal('NESTBOX_AI_AGENT'),
    settings: workflowNestboxAiAgentActionSettingsSchema,
  });
