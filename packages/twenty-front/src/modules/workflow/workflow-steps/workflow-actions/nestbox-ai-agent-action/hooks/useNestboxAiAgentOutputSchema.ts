import { type WorkflowNestboxAiAgentAction } from '@/workflow/types/Workflow';
import { parseAndValidateVariableFriendlyStringifiedJson } from '@/workflow/utils/parseAndValidateVariableFriendlyStringifiedJson';
import { convertOutputSchemaToJson } from '@/workflow/workflow-steps/workflow-actions/http-request-action/utils/convertOutputSchemaToJson';
import { getNestboxAiAgentOutputSchema } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/utils/getNestboxAiAgentOutputSchema';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { type BaseOutputSchemaV2 } from 'twenty-shared/workflow';

type UseNestboxAiAgentOutputSchemaProps = {
  action: WorkflowNestboxAiAgentAction;
  onActionUpdate?: (action: WorkflowNestboxAiAgentAction) => void;
  readonly?: boolean;
};

export const useNestboxAiAgentOutputSchema = ({
  action,
  onActionUpdate,
  readonly,
}: UseNestboxAiAgentOutputSchemaProps) => {
  const [outputSchema, setOutputSchema] = useState<string | null>(
    Object.keys(action.settings.outputSchema).length
      ? JSON.stringify(
          convertOutputSchemaToJson(
            action.settings.outputSchema as BaseOutputSchemaV2,
          ),
          null,
          2,
        )
      : null,
  );

  const [error, setError] = useState<string | undefined>();

  const handleOutputSchemaChange = (value: string | null) => {
    if (readonly === true) {
      return;
    }

    setOutputSchema(value);

    const parsingResult = parseAndValidateVariableFriendlyStringifiedJson(
      isNonEmptyString(value) ? value : '{}',
    );

    if (!parsingResult.isValid) {
      setError(parsingResult.error);
      return;
    }

    setError(undefined);
    onActionUpdate?.({
      ...action,
      settings: {
        ...action.settings,
        outputSchema: getNestboxAiAgentOutputSchema(parsingResult.data),
      },
    });
  };

  return {
    outputSchema,
    handleOutputSchemaChange,
    error,
  };
};
