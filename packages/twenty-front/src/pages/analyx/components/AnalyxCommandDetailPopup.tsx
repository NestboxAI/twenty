import { AdvancedTextEditor } from '@/advanced-text-editor/components/AdvancedTextEditor';
import { useAdvancedTextEditor } from '@/advanced-text-editor/hooks/useAdvancedTextEditor';
import styled from '@emotion/styled';
import { type Editor } from '@tiptap/react';
import { t } from '@lingui/core/macro';
import { useCallback, useRef } from 'react';
import { IconCheck, IconTrash, IconX } from 'twenty-ui/display';
import { StyledIconButton } from '../AnalyxSharedStyles';
import { type AnalyxCommand } from '../AnalyxTypes';

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
  max-height: 70vh;
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
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
  padding: 20px;
`;

type AnalyxCommandDetailPopupProps = {
  skill: AnalyxCommand | null;
  onClose: () => void;
  onDelete: (skillId: string) => void;
  onUpdate: (updatedSkill: AnalyxCommand) => void;
};

const AnalyxCommandDetailPopupEditor = ({
  skill,
  draftRef,
}: {
  skill: AnalyxCommand;
  draftRef: React.MutableRefObject<string | null>;
}) => {
  const handleEditorUpdate = useCallback(
    (editor: Editor) => {
      draftRef.current = editor.getHTML();
    },
    [draftRef],
  );

  const editor = useAdvancedTextEditor(
    {
      placeholder: t`Edit skill description...`,
      readonly: false,
      defaultValue: skill.description,
      onUpdate: handleEditorUpdate,
      contentType: 'markdown',
      enableSlashCommand: true,
    },
    [skill.id],
  );

  if (!editor) return null;

  return (
    <AdvancedTextEditor
      readonly={false}
      editor={editor}
      minHeight={120}
      maxWidth={520}
    />
  );
};

export const AnalyxCommandDetailPopup = ({
  skill,
  onClose,
  onDelete,
  onUpdate,
}: AnalyxCommandDetailPopupProps) => {
  const draftRef = useRef<string | null>(null);

  if (!skill) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(skill.id);
    onClose();
  };

  const handleSave = () => {
    if (draftRef.current !== null) {
      onUpdate({ ...skill, description: draftRef.current });
    }
    onClose();
  };

  const handleDiscard = () => {
    onClose();
  };

  return (
    <StyledOverlay onClick={handleOverlayClick}>
      <StyledCard>
        <StyledHeader>
          <StyledTitle>{skill.name}</StyledTitle>
          <StyledIconButton onClick={handleSave} style={{ color: '#4CAF50' }}>
            <IconCheck size={16} />
          </StyledIconButton>
          {!skill.isDefault && (
            <StyledIconButton onClick={handleDelete}>
              <IconTrash size={16} />
            </StyledIconButton>
          )}
          <StyledIconButton onClick={handleDiscard}>
            <IconX size={16} />
          </StyledIconButton>
        </StyledHeader>
        <StyledBody>
          <AnalyxCommandDetailPopupEditor skill={skill} draftRef={draftRef} />
        </StyledBody>
      </StyledCard>
    </StyledOverlay>
  );
};
