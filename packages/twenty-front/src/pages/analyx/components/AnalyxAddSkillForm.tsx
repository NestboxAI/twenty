import { TextInput } from '@/ui/input/components/TextInput';
import styled from '@emotion/styled';
import { useState } from 'react';
import { IconX } from 'twenty-ui/display';
import { StyledIconButton } from '../AnalyxSharedStyles';

const StyledOverlay = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.transparent.medium};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const StyledCard = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  display: flex;
  flex-direction: column;
  max-width: 560px;
  width: 90%;
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 12px;
  padding: 16px 20px;
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledTextarea = styled.textarea`
  background: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  box-sizing: border-box;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  min-height: 160px;
  padding: 10px 12px;
  resize: vertical;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    outline: none;
  }
`;

const StyledFooter = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 20px;
`;

const StyledCancelButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;

  &:hover {
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledSaveButton = styled.button<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.background.transparent.medium : theme.font.color.primary};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme, disabled }) =>
    disabled ? theme.font.color.tertiary : theme.background.primary};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 500;
  padding: 8px 20px;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
  }
`;

type AnalyxAddSkillFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
};

export const AnalyxAddSkillForm = ({
  isOpen,
  onClose,
  onSave,
}: AnalyxAddSkillFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const canSave = name.trim().length > 0 && description.trim().length > 0;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <StyledOverlay onClick={handleOverlayClick}>
      <StyledCard>
        <StyledHeader>
          <StyledTitle>Add Skill</StyledTitle>
          <StyledIconButton onClick={onClose}>
            <IconX size={16} />
          </StyledIconButton>
        </StyledHeader>

        <StyledBody>
          <StyledFieldGroup>
            <StyledLabel>Skill Name</StyledLabel>
            <TextInput
              value={name}
              onChange={setName}
              placeholder="e.g., Variance Analysis"
              fullWidth
              sizeVariant="sm"
            />
          </StyledFieldGroup>

          <StyledFieldGroup>
            <StyledLabel>Description</StyledLabel>
            <StyledTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this skill does, including the prompt template or instructions..."
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
            />
          </StyledFieldGroup>
        </StyledBody>

        <StyledFooter>
          <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
          <StyledSaveButton disabled={!canSave} onClick={handleSave}>
            Save
          </StyledSaveButton>
        </StyledFooter>
      </StyledCard>
    </StyledOverlay>
  );
};
