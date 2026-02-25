import { SingleRecordPickerMenuItemsWithSearch } from '@/object-record/record-picker/single-record-picker/components/SingleRecordPickerMenuItemsWithSearch';
import { SingleRecordPickerComponentInstanceContext } from '@/object-record/record-picker/single-record-picker/states/contexts/SingleRecordPickerComponentInstanceContext';
import { type RecordPickerPickableMorphItem } from '@/object-record/record-picker/types/RecordPickerPickableMorphItem';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { type ChangeEvent, type RefObject } from 'react';
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconPaperclip,
  IconPlus,
  type IconComponent,
} from 'twenty-ui/display';
import { MenuItem } from 'twenty-ui/navigation';
import { StyledIconButton } from '../AnalyxSharedStyles';
import { type NestboxAgent, type SelectedContext } from '../AnalyxTypes';
import { CONTEXT_TYPE_OPTIONS, getTaskType, getTypeIcon } from '../AnalyxUtils';

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
`;

const StyledInputSection = styled.div`
  align-self: center;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  margin-bottom: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow.light};
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.border.color.medium};
    box-shadow: ${({ theme }) => theme.boxShadow.strong};
  }
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const StyledPromptInput = styled.textarea<{ $shake?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: 20px;
  border: none;
  border-radius: 8px 8px 0 0;
  font-size: 16px;
  resize: none;
  background: transparent;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: inherit;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-break: break-word;
  animation: ${({ $shake }) =>
    $shake ? `${shakeAnimation} 0.4s ease` : 'none'};

  &::placeholder {
    color: ${({ $shake, theme }) =>
      $shake ? theme.color.red : theme.font.color.light};
    transition: color 0.2s ease;
  }

  &:focus {
    outline: none;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 24px;
  border-top: 1px solid transparent;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
  }
`;

const StyledDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 14px;
  font-weight: 500;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledGoButton = styled.button`
  background: ${({ theme }) => theme.font.color.primary};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.background.primary};
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export type ContextObjectOption = {
  value: string;
  label: string;
  Icon: IconComponent;
};

type AnalyxPromptInputProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  shakePrompt: boolean;
  contextType: string;
  onContextTypeChange: (value: string) => void;
  files: File[];
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  contextObjectOptions: ContextObjectOption[];
  selectedContexts: SelectedContext[];
  contextObject: string | null;
  onContextObjectChange: (value: string | null) => void;
  selectedAgentIds: string[];
  agents: NestboxAgent[];
  onAgentToggle: (agentId: string) => void;
  onMorphItemSelected: (item?: RecordPickerPickableMorphItem) => void;
  onSubmit: () => void;
};

export const AnalyxPromptInput = ({
  prompt,
  onPromptChange,
  shakePrompt,
  contextType,
  onContextTypeChange,
  files,
  fileInputRef,
  onFileChange,
  contextObjectOptions,
  selectedContexts,
  contextObject,
  onContextObjectChange,
  selectedAgentIds,
  agents,
  onAgentToggle,
  onMorphItemSelected,
  onSubmit,
}: AnalyxPromptInputProps) => {
  const { closeDropdown } = useCloseDropdown();
  const ContextTypeIcon = getTypeIcon(getTaskType(contextType));
  const unselectedAgents = agents.filter(
    (a) => !selectedAgentIds.includes(a.id),
  );

  return (
    <StyledInputSection>
      <StyledPromptInput
        $shake={shakePrompt}
        placeholder="Example: 'Compare Stripe vs Adyen: TAM, margins, risks, valuation'"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation()}
      />

      <StyledFooter>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <StyledIconButton onClick={() => fileInputRef.current?.click()}>
          <IconPaperclip size={16} /> Attachment
        </StyledIconButton>

        <Dropdown
          dropdownId="context-record-dropdown"
          clickableComponent={
            <StyledDropdownTrigger>
              <IconPlus size={16} /> Context
            </StyledDropdownTrigger>
          }
          dropdownComponents={
            !contextObject ? (
              <DropdownContent widthInPixels={240}>
                <DropdownMenuItemsContainer>
                  {contextObjectOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      text={option.label}
                      LeftIcon={option.Icon}
                      RightIcon={IconChevronRight}
                      onClick={() => {
                        onContextObjectChange(option.value);
                      }}
                    />
                  ))}
                </DropdownMenuItemsContainer>
              </DropdownContent>
            ) : (
              <SingleRecordPickerComponentInstanceContext.Provider
                value={{ instanceId: 'context-record-picker' }}
              >
                <DropdownContent widthInPixels={240}>
                  <MenuItem
                    LeftIcon={IconChevronLeft}
                    text="Back"
                    onClick={() => onContextObjectChange(null)}
                  />
                  <DropdownMenuSeparator />
                  <SingleRecordPickerMenuItemsWithSearch
                    focusId="context-record-picker"
                    objectNameSingulars={[contextObject]}
                    excludedRecordIds={selectedContexts.map((c) => c.id)}
                    onMorphItemSelected={onMorphItemSelected}
                    onCancel={() => onContextObjectChange(null)}
                  />
                </DropdownContent>
              </SingleRecordPickerComponentInstanceContext.Provider>
            )
          }
        />

        <Dropdown
          dropdownId="agents-dropdown"
          clickableComponent={
            <StyledDropdownTrigger>
              <IconPlus size={16} /> Connectors
            </StyledDropdownTrigger>
          }
          dropdownComponents={
            <DropdownContent>
              <DropdownMenuItemsContainer>
                {unselectedAgents.length === 0 ? (
                  <MenuItem text="No agents available" />
                ) : (
                  unselectedAgents.map((agent) => (
                    <MenuItem
                      key={agent.id}
                      LeftIcon={() => <IconCpu size={14} />}
                      text={agent.name}
                      onClick={() => {
                        onAgentToggle(agent.id);
                        closeDropdown('agents-dropdown');
                      }}
                    />
                  ))
                )}
              </DropdownMenuItemsContainer>
            </DropdownContent>
          }
        />

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Dropdown
            dropdownId="context-type-dropdown"
            clickableComponent={
              <StyledDropdownTrigger>
                <ContextTypeIcon size={16} /> {contextType}
              </StyledDropdownTrigger>
            }
            dropdownComponents={
              <DropdownContent widthInPixels={200}>
                <DropdownMenuItemsContainer>
                  {CONTEXT_TYPE_OPTIONS.map((option) => {
                    const OptionIcon = getTypeIcon(getTaskType(option));
                    return (
                      <MenuItem
                        key={option}
                        text={option}
                        LeftIcon={OptionIcon}
                        onClick={() => {
                          onContextTypeChange(option);
                          closeDropdown('context-type-dropdown');
                        }}
                      />
                    );
                  })}
                </DropdownMenuItemsContainer>
              </DropdownContent>
            }
          />

          <StyledGoButton onClick={onSubmit}>
            <IconArrowRight size={18} stroke={3} />
          </StyledGoButton>
        </div>
      </StyledFooter>
    </StyledInputSection>
  );
};
