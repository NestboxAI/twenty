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
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from 'react';
import {
  IconArrowUp,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconPaperclip,
  IconPlus,
  type IconComponent,
} from 'twenty-ui/display';
import { MenuItem } from 'twenty-ui/navigation';
import { StyledIconButton } from '../AnalyxSharedStyles';
import {
  type AnalyxCommand,
  type NestboxAgent,
  type SelectedContext,
} from '../AnalyxTypes';
import { CONTEXT_TYPE_OPTIONS, getTaskType, getTypeIcon } from '../AnalyxUtils';
import { useSlashCommandAutocomplete } from '../hooks/useSlashCommandAutocomplete';
import { SlashCommandPopup } from './SlashCommandPopup';

const MIRROR_STYLE_PROPERTIES = [
  'boxSizing',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'letterSpacing',
  'lineHeight',
  'overflowWrap',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'textIndent',
  'textTransform',
  'wordBreak',
  'wordSpacing',
] as const;

// Measures the pixel position of the caret in a textarea using a mirror div
const getCaretCoordinates = (
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } => {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(element);

  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflow = 'hidden';
  mirror.style.width = `${element.offsetWidth}px`;

  for (const prop of MIRROR_STYLE_PROPERTIES) {
    (mirror.style as unknown as Record<string, string>)[prop] =
      computed.getPropertyValue(
        prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
      );
  }

  mirror.appendChild(
    document.createTextNode(element.value.substring(0, position)),
  );

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const height =
    marker.offsetHeight ||
    parseInt(computed.lineHeight) ||
    parseInt(computed.fontSize) * 1.2;

  const coordinates = {
    top: marker.offsetTop,
    left: marker.offsetLeft,
    height,
  };

  document.body.removeChild(mirror);

  return coordinates;
};

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

const StyledTextareaWrapper = styled.div`
  position: relative;
`;

const StyledCommandChip = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.tertiary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 4px;
  color: ${({ theme }) => theme.color.blue};
  display: inline-flex;
  font-family: 'Fira Code', 'Roboto Mono', 'SF Mono', monospace;
  font-size: 13px;
  gap: 6px;
  margin: 12px 0 0 20px;
  padding: 2px 8px;
  width: fit-content;
`;

const StyledChipDismiss = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  justify-content: center;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.font.color.primary};
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

const spinRing = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const subtlePulse = keyframes`
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
`;

const StyledGoButtonWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpinnerRing = styled.div`
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: ${({ theme }) => theme.color.blue};
  animation: ${spinRing} 0.8s linear infinite;
  pointer-events: none;
`;

const StyledGoButton = styled.button<{ $submitting?: boolean }>`
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
  transition:
    transform 0.1s,
    opacity 0.15s ease;
  animation: ${({ $submitting }) =>
    $submitting ? `${subtlePulse} 1.4s ease-in-out infinite` : 'none'};

  &:disabled {
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const StyledUploadProgress = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 13px;
  white-space: nowrap;
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
  isSubmitting: boolean;
  uploadProgress: { uploaded: number; total: number } | null;
  skills: AnalyxCommand[];
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
  isSubmitting,
  uploadProgress,
  skills,
}: AnalyxPromptInputProps) => {
  const { closeDropdown } = useCloseDropdown();
  const ContextTypeIcon = getTypeIcon(getTaskType(contextType));

  const {
    isOpen: isSlashOpen,
    filteredCommands,
    selectedIndex,
    handleKeyDown: handleSlashKeyDown,
    selectCommand,
    activeCommand,
    activePlaceholder,
  } = useSlashCommandAutocomplete({
    skills,
    prompt,
    onPromptChange,
    onContextTypeChange,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const textareaValue = activeCommand
    ? prompt.slice(activeCommand.length + 1)
    : prompt;

  useEffect(() => {
    if (!isSlashOpen || !textareaRef.current) return;
    const pos = getCaretCoordinates(
      textareaRef.current,
      textareaRef.current.value.length,
    );
    setPopupPosition({
      top: pos.top + pos.height + 4,
      left: pos.left,
    });
  }, [prompt, isSlashOpen]);

  const unselectedAgents = agents.filter(
    (a) => !selectedAgentIds.includes(a.id),
  );

  return (
    <StyledInputSection>
      {activeCommand && (
        <StyledCommandChip>
          {activeCommand}
          <StyledChipDismiss
            onMouseDown={(e) => {
              e.preventDefault();
              onPromptChange(textareaValue);
            }}
          >
            &times;
          </StyledChipDismiss>
        </StyledCommandChip>
      )}
      <StyledTextareaWrapper>
        <StyledPromptInput
          ref={textareaRef}
          $shake={shakePrompt}
          placeholder={
            activePlaceholder ??
            "e.g. 'Analyze Q4 revenue by segment' — or type / for commands"
          }
          value={textareaValue}
          onChange={(e) => {
            if (activeCommand) {
              onPromptChange(activeCommand + ' ' + e.target.value);
            } else {
              onPromptChange(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (
              activeCommand &&
              e.key === 'Backspace' &&
              textareaRef.current?.selectionStart === 0 &&
              textareaRef.current?.selectionEnd === 0
            ) {
              e.preventDefault();
              onPromptChange(textareaValue);
              return;
            }
            handleSlashKeyDown(e);
          }}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
        />
        {isSlashOpen && (
          <SlashCommandPopup
            commands={filteredCommands}
            selectedIndex={selectedIndex}
            onSelect={selectCommand}
            top={popupPosition.top}
            left={popupPosition.left}
          />
        )}
      </StyledTextareaWrapper>

      <StyledFooter>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <StyledIconButton onClick={() => fileInputRef.current?.click()}>
          <IconPaperclip size={16} /> Attach
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

          {uploadProgress && (
            <StyledUploadProgress>
              Uploading files ({uploadProgress.uploaded}/{uploadProgress.total}
              )...
            </StyledUploadProgress>
          )}
          <StyledGoButtonWrapper>
            {(isSubmitting || !!uploadProgress) && <StyledSpinnerRing />}
            <StyledGoButton
              $submitting={isSubmitting || !!uploadProgress}
              onClick={onSubmit}
              disabled={isSubmitting || !!uploadProgress}
            >
              <IconArrowUp size={18} stroke={3} />
            </StyledGoButton>
          </StyledGoButtonWrapper>
        </div>
      </StyledFooter>
    </StyledInputSection>
  );
};
