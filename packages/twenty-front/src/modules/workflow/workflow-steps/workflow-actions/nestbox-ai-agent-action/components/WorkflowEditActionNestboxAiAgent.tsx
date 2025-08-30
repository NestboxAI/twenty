import { useNestboxAiAgentOutputSchema } from '@/ai/hooks/useNestboxAiAgentOutputSchema';
import { FormTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormTextFieldInput';
import { Select } from '@/ui/input/components/Select';
import { type WorkflowNestboxAiAgentAction } from '@/workflow/types/Workflow';
import { WorkflowStepBody } from '@/workflow/workflow-steps/components/WorkflowStepBody';
import { WorkflowStepHeader } from '@/workflow/workflow-steps/components/WorkflowStepHeader';
import { useWorkflowActionHeader } from '@/workflow/workflow-steps/workflow-actions/hooks/useWorkflowActionHeader';
import { WorkflowOutputSchemaBuilder } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/components/WorkflowOutputSchemaBuilder';
import { WorkflowVariablePicker } from '@/workflow/workflow-variables/components/WorkflowVariablePicker';
import type { BaseOutputSchema } from '@/workflow/workflow-variables/types/StepOutputSchema';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { useIcons } from 'twenty-ui/display';
import { type SelectOption } from 'twenty-ui/input';
import { RightDrawerSkeletonLoader } from '~/loading/components/RightDrawerSkeletonLoader';
import { GET_NESTBOX_AGENTS } from '../graphql/getNestboxAgents';

type NestboxAgentParameter = {
  name: string;
  machineAgentId: string;
  description?: string;
};

type NestboxAgent = {
  id: string;
  name: string;
  description?: string;
  type?: string | null;
  additionalParameters?: NestboxAgentParameter[];
};

type GetNestboxAgentsResult = {
  agents: NestboxAgent[];
};

export const WorkflowEditActionNestboxAiAgent = ({
  action,
  actionOptions,
}: {
  action: WorkflowNestboxAiAgentAction;
  actionOptions:
    | { readonly: true }
    | {
        readonly?: false;
        onActionUpdate: (action: WorkflowNestboxAiAgentAction) => void;
      };
}) => {
  const { getIcon } = useIcons();
  const { headerTitle, headerIcon, headerIconColor, headerType } =
    useWorkflowActionHeader({
      action,
      defaultTitle: 'Nestbox AI Agent',
    });

  const { handleOutputSchemaChange, outputFields } =
    useNestboxAiAgentOutputSchema(
      action.settings.outputSchema as BaseOutputSchema,
      actionOptions.readonly === true
        ? undefined
        : actionOptions.onActionUpdate,
      action,
      actionOptions.readonly,
    );

  const { data: agentsData, loading: agentsLoading } =
    useQuery<GetNestboxAgentsResult>(GET_NESTBOX_AGENTS);

  const agentOptions = useMemo(() => {
    const agents: NestboxAgent[] = agentsData?.agents ?? [];
    return agents.reduce<SelectOption<string>[]>(
      (acc: SelectOption<string>[], agent: NestboxAgent) => {
        acc.push({
          label: agent.name,
          value: agent.id,
          Icon: agent.type ? getIcon('IconBrain') : undefined,
        });
        return acc;
      },
      [
        {
          label: `No Agent`,
          value: '',
        },
      ],
    );
  }, [agentsData, getIcon]);

  const selectedAgent = useMemo(
    () =>
      agentOptions.find(
        (opt: SelectOption<string>) =>
          opt.value === action.settings.input.agentId,
      ),
    [agentOptions, action.settings.input.agentId],
  );

  const selectedAgentData = useMemo(
    () =>
      agentsData?.agents?.find(
        (a: NestboxAgent) => a.id === selectedAgent?.value,
      ),
    [agentsData, selectedAgent],
  );

  const handleFieldChange = (field: 'agentId' | 'prompt', value: string) => {
    if (actionOptions.readonly === true) return;
    const input = { ...action.settings.input, [field]: value };
    if (field === 'agentId') {
      input.params = {};
    }
    actionOptions.onActionUpdate?.({
      ...action,
      settings: {
        ...action.settings,
        input,
      },
    });
  };

  const handleParamChange = (name: string, value: string) => {
    if (actionOptions.readonly === true) return;
    actionOptions.onActionUpdate?.({
      ...action,
      settings: {
        ...action.settings,
        input: {
          ...action.settings.input,
          params: {
            ...(action.settings.input.params || {}),
            [name]: value,
          },
        },
      },
    });
  };

  if (agentsLoading) {
    return <RightDrawerSkeletonLoader />;
  }

  const noAgentsAvailable = agentOptions.length === 0;

  return (
    <>
      <WorkflowStepHeader
        onTitleChange={(newName: string) => {
          if (actionOptions.readonly === true) return;
          actionOptions.onActionUpdate?.({ ...action, name: newName });
        }}
        Icon={getIcon(headerIcon)}
        iconColor={headerIconColor}
        initialTitle={headerTitle}
        headerType={headerType}
        disabled={actionOptions.readonly}
      />
      <WorkflowStepBody>
        <div>
          <Select
            dropdownId="select-nestbox-agent"
            label={`Select Agent`}
            options={agentOptions}
            value={action.settings.input.agentId || ''}
            onChange={(value) => handleFieldChange('agentId', value)}
            disabled={actionOptions.readonly || noAgentsAvailable}
          />
        </div>

        {selectedAgentData?.additionalParameters?.map(
          (param: NestboxAgentParameter) => (
            <FormTextFieldInput
              multiline
              VariablePicker={WorkflowVariablePicker}
              key={param.name}
              label={param.name}
              hint={param.description}
              defaultValue={
                action.settings.input.params?.[param.name] as string
              }
              onChange={(value) => handleParamChange(param.name, value)}
              readonly={actionOptions.readonly}
            />
          ),
        )}

        <WorkflowOutputSchemaBuilder
          fields={outputFields}
          onChange={handleOutputSchemaChange}
          readonly={actionOptions.readonly}
        />
      </WorkflowStepBody>
    </>
  );
};
