// nestbox: it is part upgrade to 1.7.0
import { type OutputSchemaField } from '@/ai/constants/OutputFieldTypeOptions';
import { WorkflowNestboxAiAgentAction } from '@/workflow/types/Workflow';
import { type BaseOutputSchemaDeprecated } from '@/workflow/workflow-variables/types/BaseOutputSchemaV2';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useDebouncedCallback } from 'use-debounce';
import { v4 } from 'uuid';
import { getFieldIcon } from '../utils/getFieldIcon';

export const useNestboxAiAgentOutputSchema = (
  outputSchema?: BaseOutputSchemaDeprecated,
  onActionUpdate?: (action: WorkflowNestboxAiAgentAction) => void,
  action?: WorkflowNestboxAiAgentAction,
  readonly?: boolean,
) => {
  const [outputFields, setOutputFields] = useState<OutputSchemaField[]>(
    Object.entries(outputSchema || {}).map(([name, field]) => ({
      id: v4(),
      name,
      type: field.type,
    })),
  );

  const debouncedSave = useDebouncedCallback(
    async (fields: OutputSchemaField[]) => {
      if (readonly === true) {
        return;
      }

      const newOutputSchema = fields.reduce<BaseOutputSchemaDeprecated>(
        (schema, field) => {
          if (isDefined(field.name)) {
            (schema as Record<string, any>)[field.name] = {
              isLeaf: true,
              type: field.type,
              value: null,
              icon: getFieldIcon(field.type),
              label: field.name,
              description: field.description,
            };
          }
          return schema;
        },
        {},
      );

      if (isDefined(onActionUpdate) && isDefined(action)) {
        onActionUpdate({
          ...action,
          settings: {
            ...action.settings,
            outputSchema: newOutputSchema,
          },
        });
      }
    },
    500,
  );

  const handleOutputSchemaChange = async (fields: OutputSchemaField[]) => {
    setOutputFields(fields);
    await debouncedSave(fields);
  };

  return {
    handleOutputSchemaChange,
    outputFields,
  };
};
