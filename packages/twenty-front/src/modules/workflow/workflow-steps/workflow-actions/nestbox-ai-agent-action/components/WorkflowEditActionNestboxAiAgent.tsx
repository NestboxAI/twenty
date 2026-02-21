import { FormBooleanFieldInput } from '@/object-record/record-field/ui/form-types/components/FormBooleanFieldInput';
import { FormMultiSelectFieldInput } from '@/object-record/record-field/ui/form-types/components/FormMultiSelectFieldInput';
import { FormNumberFieldInput } from '@/object-record/record-field/ui/form-types/components/FormNumberFieldInput';
import { FormRawJsonFieldInput } from '@/object-record/record-field/ui/form-types/components/FormRawJsonFieldInput';
import { FormTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormTextFieldInput';
import { Select } from '@/ui/input/components/Select';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { type WorkflowNestboxAiAgentAction } from '@/workflow/types/Workflow';
import { WorkflowStepBody } from '@/workflow/workflow-steps/components/WorkflowStepBody';
import { WorkflowStepFooter } from '@/workflow/workflow-steps/components/WorkflowStepFooter';
import { GET_NESTBOX_AGENTS } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/graphql/getNestboxAgents';
import { useNestboxAiAgentOutputSchema } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/hooks/useNestboxAiAgentOutputSchema';
import { WorkflowVariablePicker } from '@/workflow/workflow-variables/components/WorkflowVariablePicker';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useIcons } from 'twenty-ui/display';
import { type SelectOption } from 'twenty-ui/input';
import { RightDrawerSkeletonLoader } from '~/loading/components/RightDrawerSkeletonLoader';

const JSON_RESPONSE_PLACEHOLDER =
  '{\n  Paste expected agent response here to use its keys later in the workflow \n}';

const StyledFullHeightFormRawJsonFieldInput = styled(FormRawJsonFieldInput)`
  flex: 1;
  display: flex;
  flex-direction: column;

  & > div:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;

    & > div {
      flex: 1;
      max-height: none !important;
      height: 100%;

      & > div {
        height: 100%;
      }
    }
  }
`;

type NestboxAgent = {
  id: string;
  name: string;
  description?: string;
  type?: string | null;
  inputSchema?: Record<string, any> | null;
};

type GetNestboxAgentsResult = {
  agents: NestboxAgent[];
};

export const WorkflowEditActionNestboxAiAgent = ({
  action,
  actionOptions,
}: {
  action: WorkflowNestboxAiAgentAction;
  actionOptions: {
    readonly?: boolean;
    onActionUpdate?: (action: WorkflowNestboxAiAgentAction) => void;
  };
}) => {
  const { getIcon } = useIcons();

  const { outputSchema, handleOutputSchemaChange, error } =
    useNestboxAiAgentOutputSchema({
      action,
      onActionUpdate: actionOptions.onActionUpdate,
      readonly: actionOptions.readonly === true,
    });

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

  const renderFormField = (paramName: string, paramSchema: any) => {
    const isRequired =
      selectedAgentData?.inputSchema?.required?.includes(paramName) || false;
    const schemaDefault = paramSchema.default;
    const currentValue = action.settings.input.params?.[paramName];

    // Use schema default if no current value is set
    const computedDefaultValue =
      currentValue !== undefined ? currentValue : schemaDefault;

    const commonProps = {
      key: paramName,
      label: isRequired ? `${paramName} *` : paramName,
      hint: paramSchema.description,
      readonly: actionOptions.readonly,
      VariablePicker: WorkflowVariablePicker,
    };

    switch (paramSchema.type) {
      case 'number':
      case 'integer':
        return (
          <FormNumberFieldInput
            key={commonProps.key}
            label={commonProps.label}
            hint={commonProps.hint}
            readonly={commonProps.readonly}
            VariablePicker={commonProps.VariablePicker}
            defaultValue={computedDefaultValue as number | string | undefined}
            onChange={(value: any) => handleParamChange(paramName, value)}
          />
        );

      case 'boolean':
        return (
          <FormBooleanFieldInput
            key={commonProps.key}
            label={commonProps.label}
            readonly={commonProps.readonly}
            VariablePicker={commonProps.VariablePicker}
            defaultValue={computedDefaultValue as boolean | string | undefined}
            onChange={(value: any) => handleParamChange(paramName, value)}
          />
        );

      case 'array':
        // For arrays of strings, we'll use MultiSelect if enum is provided, otherwise fallback to text
        if (
          isDefined(paramSchema.items?.enum) &&
          paramSchema.items?.enum.length > 0
        ) {
          const options = paramSchema.items.enum.map((value: string) => ({
            label: value,
            value: value,
          }));
          return (
            <FormMultiSelectFieldInput
              key={commonProps.key}
              label={commonProps.label}
              readonly={commonProps.readonly}
              VariablePicker={commonProps.VariablePicker}
              options={options}
              defaultValue={
                computedDefaultValue as string[] | string | undefined
              }
              onChange={(value: any) => handleParamChange(paramName, value)}
            />
          );
        }
        // Fallback to text input for array of strings without enum
        return (
          <FormTextFieldInput
            key={commonProps.key}
            label={commonProps.label}
            hint={`${paramSchema.description || ''} (Enter comma-separated values)`}
            readonly={commonProps.readonly}
            VariablePicker={commonProps.VariablePicker}
            multiline
            defaultValue={
              Array.isArray(computedDefaultValue)
                ? (computedDefaultValue as string[]).join(', ')
                : (computedDefaultValue as string)
            }
            onChange={(value: string) => {
              // Convert comma-separated string to array
              const arrayValue = value
                .split(',')
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
              handleParamChange(paramName, arrayValue as any);
            }}
          />
        );

      case 'string':
      default:
        // Handle string enums as select
        if (isDefined(paramSchema.enum) && paramSchema.enum.length > 0) {
          return (
            <FormTextFieldInput
              key={commonProps.key}
              label={commonProps.label}
              hint={`${paramSchema.description || ''} (Options: ${paramSchema.enum.join(', ')})`}
              readonly={commonProps.readonly}
              VariablePicker={commonProps.VariablePicker}
              multiline={false}
              defaultValue={computedDefaultValue as string}
              onChange={(value: string) => handleParamChange(paramName, value)}
            />
          );
        }

        return (
          <FormTextFieldInput
            key={commonProps.key}
            label={commonProps.label}
            hint={commonProps.hint}
            readonly={commonProps.readonly}
            VariablePicker={commonProps.VariablePicker}
            multiline
            defaultValue={computedDefaultValue as string}
            onChange={(value: string) => handleParamChange(paramName, value)}
          />
        );
    }
  };

  if (agentsLoading) {
    return <RightDrawerSkeletonLoader />;
  }

  const noAgentsAvailable = agentOptions.length === 0;

  return (
    <>
      {/* <SidePanelHeader
        onTitleChange={(newName: string) => {
          if (actionOptions.readonly === true) return;
          actionOptions.onActionUpdate?.({ ...action, name: newName });
        }}
        Icon={getIcon(headerIcon)}
        iconColor={headerIconColor}
        initialTitle={headerTitle}
        headerType={headerType}
        disabled={actionOptions.readonly}
      /> */}
      <WorkflowStepBody>
        <div>
          <Select
            dropdownId="select-nestbox-agent"
            label={`Select Agent`}
            options={agentOptions}
            withSearchInput
            dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
            value={action.settings.input.agentId || ''}
            onChange={(value) => handleFieldChange('agentId', value)}
            disabled={actionOptions.readonly || noAgentsAvailable}
          />
        </div>

        {selectedAgentData?.inputSchema?.properties &&
          Object.entries(selectedAgentData.inputSchema.properties).map(
            ([paramName, paramSchema]: [string, any]) =>
              renderFormField(paramName, paramSchema),
          )}

        <StyledFullHeightFormRawJsonFieldInput
          label={t`Expected Response Body`}
          placeholder={JSON_RESPONSE_PLACEHOLDER}
          defaultValue={outputSchema}
          onChange={handleOutputSchemaChange}
          readonly={actionOptions.readonly}
          error={error}
        />
      </WorkflowStepBody>
      {!actionOptions.readonly && action.id && (
        <WorkflowStepFooter stepId={action.id} />
      )}
    </>
  );
};
