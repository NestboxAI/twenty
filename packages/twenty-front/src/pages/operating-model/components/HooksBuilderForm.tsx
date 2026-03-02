import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { IconPlus, IconTrash } from 'twenty-ui/display';
import { type HookEntry } from '../OperatingModelTypes';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 16px;
`;

const HookCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  padding: 12px;
`;

const CardHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const HookIndex = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 12px;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  padding: 2px;

  &:hover {
    color: #f44336;
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const FieldGroup = styled.div<{ $flex?: number }>`
  display: flex;
  flex: ${({ $flex }) => $flex ?? 1};
  flex-direction: column;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 3px;
  text-transform: uppercase;
`;

const SelectField = styled.select`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 12px;
  outline: none;
  padding: 5px 8px;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const InputField = styled.input`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 12px;
  outline: none;
  padding: 5px 8px;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const TextareaField = styled.textarea`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  line-height: 1.5;
  outline: none;
  padding: 6px 8px;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const AddButton = styled.button`
  align-items: center;
  align-self: flex-start;
  background: ${({ theme }) => theme.color.blue};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  padding: 6px 12px;

  &:hover {
    opacity: 0.9;
  }
`;

const HOOK_EVENTS = [
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
];

type HooksBuilderFormProps = {
  content: string;
  onContentChange: (content: string) => void;
};

export const HooksBuilderForm = ({
  content,
  onContentChange,
}: HooksBuilderFormProps) => {
  const hooks = useMemo<HookEntry[]>(() => {
    try {
      const obj = JSON.parse(content);
      return Array.isArray(obj.hooks) ? obj.hooks : [];
    } catch {
      return [];
    }
  }, [content]);

  const updateHooks = useCallback(
    (updatedHooks: HookEntry[]) => {
      onContentChange(JSON.stringify({ hooks: updatedHooks }, null, 2));
    },
    [onContentChange],
  );

  const updateHook = useCallback(
    (index: number, field: string, value: string | string[]) => {
      const updated = hooks.map((hook, hookIndex) =>
        hookIndex === index ? { ...hook, [field]: value } : hook,
      );
      updateHooks(updated);
    },
    [hooks, updateHooks],
  );

  const addHook = useCallback(() => {
    updateHooks([
      ...hooks,
      { event: 'PreToolUse', type: 'prompt', prompt: '' },
    ]);
  }, [hooks, updateHooks]);

  const removeHook = useCallback(
    (index: number) => {
      updateHooks(hooks.filter((_, hookIndex) => hookIndex !== index));
    },
    [hooks, updateHooks],
  );

  return (
    <Container>
      {hooks.map((hook, index) => (
        <HookCard key={index}>
          <CardHeader>
            <HookIndex>Hook {index + 1}</HookIndex>
            <RemoveButton onClick={() => removeHook(index)}>
              <IconTrash size={14} />
            </RemoveButton>
          </CardHeader>
          <FieldRow>
            <FieldGroup>
              <FieldLabel>Event</FieldLabel>
              <SelectField
                value={hook.event}
                onChange={(event) =>
                  updateHook(index, 'event', event.target.value)
                }
              >
                {HOOK_EVENTS.map((eventName) => (
                  <option key={eventName} value={eventName}>
                    {eventName}
                  </option>
                ))}
              </SelectField>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Type</FieldLabel>
              <SelectField
                value={hook.type}
                onChange={(event) =>
                  updateHook(
                    index,
                    'type',
                    event.target.value as 'prompt' | 'command',
                  )
                }
              >
                <option value="prompt">prompt</option>
                <option value="command">command</option>
              </SelectField>
            </FieldGroup>
          </FieldRow>
          <FieldRow>
            <FieldGroup>
              <FieldLabel>Tool Matchers (comma-separated)</FieldLabel>
              <InputField
                placeholder="e.g. Write, Edit"
                value={hook.tools?.join(', ') ?? ''}
                onChange={(event) => {
                  const tools = event.target.value
                    .split(',')
                    .map((tool) => tool.trim())
                    .filter(Boolean);
                  updateHook(index, 'tools', tools.length > 0 ? tools : []);
                }}
              />
            </FieldGroup>
          </FieldRow>
          <FieldGroup>
            <FieldLabel>
              {hook.type === 'prompt' ? 'Prompt' : 'Command'}
            </FieldLabel>
            <TextareaField
              rows={3}
              placeholder={
                hook.type === 'prompt'
                  ? 'Enter the prompt text...'
                  : 'Enter the shell command...'
              }
              value={
                hook.type === 'prompt'
                  ? (hook.prompt ?? '')
                  : (hook.command ?? '')
              }
              onChange={(event) =>
                updateHook(
                  index,
                  hook.type === 'prompt' ? 'prompt' : 'command',
                  event.target.value,
                )
              }
            />
          </FieldGroup>
        </HookCard>
      ))}
      <AddButton onClick={addHook}>
        <IconPlus size={12} />
        Add Hook
      </AddButton>
    </Container>
  );
};
