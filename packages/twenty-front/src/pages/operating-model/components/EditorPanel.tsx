import styled from '@emotion/styled';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconArrowBackUp, IconCode, IconEye, IconTable, IconTrash } from 'twenty-ui/display';
import { type FileNode, type ModelTab } from '../OperatingModelTypes';
import { HooksBuilderForm } from './HooksBuilderForm';
import { FilePreview } from './FilePreview';
import { parseFrontmatter } from '../utils/frontmatterParser';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const EditorToolbar = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 8px;
  padding: 8px 16px;
`;

const FilePath = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  flex: 1;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Button group for mode toggles
const ButtonGroup = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 6px;
  display: flex;
  overflow: hidden;
`;

const GroupButton = styled.button<{ $active: boolean }>`
  align-items: center;
  background: ${({ $active, theme }) =>
    $active ? theme.background.transparent.medium : 'transparent'};
  border: none;
  border-right: 1px solid ${({ theme }) => theme.border.color.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.font.color.primary : theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  gap: 4px;
  padding: 4px 10px;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? theme.background.transparent.medium
        : theme.background.transparent.lighter};
  }
`;

const RevertButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  gap: 4px;
  padding: 3px 8px;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const UnsavedDot = styled.span`
  background: ${({ theme }) => theme.color.blue};
  border-radius: 50%;
  display: inline-block;
  height: 6px;
  width: 6px;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const LineGutter = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.border.color.light};
  min-width: 48px;
  overflow: hidden;
  padding: 16px 0;
  user-select: none;
`;

const LineNumber = styled.div<{
  $highlighted: boolean;
  $isFrontmatter: boolean;
}>`
  background: ${({ $highlighted, $isFrontmatter, theme }) =>
    $highlighted
      ? 'rgba(33, 150, 243, 0.15)'
      : $isFrontmatter
        ? 'rgba(255, 152, 0, 0.04)'
        : 'transparent'};
  color: ${({ $highlighted, theme }) =>
    $highlighted ? theme.color.blue : theme.font.color.light};
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: ${({ $highlighted }) => ($highlighted ? 600 : 400)};
  line-height: 1.6;
  padding: 0 8px 0 12px;
  text-align: right;
`;

const EditorArea = styled.textarea`
  background: ${({ theme }) => theme.background.primary};
  border: none;
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  outline: none;
  overflow-y: auto;
  padding: 16px;
  resize: none;
  tab-size: 2;
  white-space: pre-wrap;
`;

const PreviewContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const EmptyState = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 14px;
  gap: 8px;
  justify-content: center;
`;

const RemoveButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.light};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  gap: 4px;
  padding: 3px 8px;

  &:hover {
    border-color: ${({ theme }) => theme.color.red};
    color: ${({ theme }) => theme.color.red};
  }
`;

// Confirm-delete popover
const RemovePopoverAnchor = styled.div`
  position: relative;
`;

const RemovePopover = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  padding: 12px 14px;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  white-space: nowrap;
  z-index: 100;
`;

const PopoverText = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 12px;
  margin-bottom: 10px;
`;

const PopoverActions = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

const PopoverCancel = styled.button`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  font-size: 11px;
  padding: 4px 10px;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const PopoverConfirm = styled.button`
  background: ${({ theme }) => theme.color.red};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;

  &:hover {
    opacity: 0.9;
  }
`;

type EditorPanelProps = {
  file: FileNode | null;
  content: string;
  onContentChange: (content: string) => void;
  hasUnsavedChanges: boolean;
  onRevert: () => void;
  onRemove?: () => void;
  highlightLine?: number | null;
  activeTab?: ModelTab;
  nodes?: FileNode[];
};

export const EditorPanel = ({
  file,
  content,
  onContentChange,
  hasUnsavedChanges,
  onRevert,
  onRemove,
  highlightLine,
  activeTab,
  nodes = [],
}: EditorPanelProps) => {
  const [mode, setMode] = useState<'raw' | 'preview' | 'builder'>('raw');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => content.split('\n').length, [content]);
  const parsed = useMemo(() => parseFrontmatter(content), [content]);

  const handleScroll = useCallback(() => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    if (highlightLine && editorRef.current && mode === 'raw') {
      const lineHeight = 20.8;
      editorRef.current.scrollTop = (highlightLine - 1) * lineHeight;
    }
  }, [highlightLine, mode]);

  // Close popover on outside click
  useEffect(() => {
    if (!showRemoveConfirm) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowRemoveConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showRemoveConfirm]);

  // Reset popover when file changes
  useEffect(() => {
    setShowRemoveConfirm(false);
  }, [file?.id]);

  if (!file) {
    return (
      <Container>
        <EmptyState>
          <IconCode size={32} style={{ opacity: 0.3 }} />
          Select a file from the tree to begin editing
        </EmptyState>
      </Container>
    );
  }

  const isJson = file.format === 'json';
  const isHooksJson = isJson && activeTab === 'hooks';

  return (
    <Container>
      <EditorToolbar>
        <FilePath>{file.path}</FilePath>
        {hasUnsavedChanges && <UnsavedDot />}
        {hasUnsavedChanges && (
          <RevertButton onClick={onRevert}>
            <IconArrowBackUp size={12} />
            Revert
          </RevertButton>
        )}
        <ButtonGroup>
          <GroupButton $active={mode === 'raw'} onClick={() => setMode('raw')}>
            <IconCode size={12} />
            Raw
          </GroupButton>
          <GroupButton
            $active={mode === 'preview'}
            onClick={() => setMode('preview')}
          >
            <IconEye size={12} />
            Preview
          </GroupButton>
          {isHooksJson && (
            <GroupButton
              $active={mode === 'builder'}
              onClick={() => setMode('builder')}
            >
              <IconTable size={12} />
              Builder
            </GroupButton>
          )}
        </ButtonGroup>
        {onRemove && (
          <RemovePopoverAnchor ref={popoverRef}>
            <RemoveButton onClick={() => setShowRemoveConfirm(true)}>
              <IconTrash size={12} />
              Remove
            </RemoveButton>
            {showRemoveConfirm && (
              <RemovePopover>
                <PopoverText>
                  Delete <strong>{file.name}</strong>?
                </PopoverText>
                <PopoverActions>
                  <PopoverCancel onClick={() => setShowRemoveConfirm(false)}>
                    Cancel
                  </PopoverCancel>
                  <PopoverConfirm
                    onClick={() => {
                      setShowRemoveConfirm(false);
                      onRemove();
                    }}
                  >
                    Delete
                  </PopoverConfirm>
                </PopoverActions>
              </RemovePopover>
            )}
          </RemovePopoverAnchor>
        )}
      </EditorToolbar>

      {mode === 'builder' && isHooksJson ? (
        <HooksBuilderForm content={content} onContentChange={onContentChange} />
      ) : mode === 'preview' ? (
        <PreviewContainer>
          <FilePreview
            activeTab={activeTab ?? 'commands'}
            selectedFile={file}
            content={content}
            nodes={nodes}
          />
        </PreviewContainer>
      ) : (
        <EditorWrapper>
          <LineGutter ref={gutterRef}>
            {Array.from({ length: lineCount }, (_, index) => (
              <LineNumber
                key={index}
                $highlighted={highlightLine === index + 1}
                $isFrontmatter={
                  parsed.hasFrontmatter && index <= parsed.frontmatterEndLine
                }
              >
                {index + 1}
              </LineNumber>
            ))}
          </LineGutter>
          <EditorArea
            ref={editorRef}
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
          />
        </EditorWrapper>
      )}
    </Container>
  );
};
