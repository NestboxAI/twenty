import { tokenPairState } from '@/auth/states/tokenPairState';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import { css, Global, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  IconArchive,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconFile,
  IconFileText,
  IconLoader,
  IconPlayerStop,
  IconSparkles,
  IconX,
  useIcons,
} from 'twenty-ui/display';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import {
  StyledIconButton,
  StyledStatusBadge,
  StyledStatusIcon,
} from '../AnalyxSharedStyles';
import { type Task } from '../AnalyxTypes';
import { formatTaskDateTime, getEntityIcon, getTypeIcon } from '../AnalyxUtils';
import { LazyMarkdownRenderer } from '@/ai/components/LazyMarkdownRenderer';
import { ResearchLogTimeline } from './ResearchLogTimeline';
import { TrustAccuracyTab } from './TrustAccuracyTab';

const DrawerOverlay = styled.div<{ isOpen: boolean }>`
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  left: 0;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 0.3s ease;
  z-index: 1000;
`;

const DrawerContainer = styled.div<{ isOpen: boolean }>`
  width: 600px;
  height: 100%;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
  font-family: 'Inter', sans-serif;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-out;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.border.color.medium};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DrawerHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  font-size: 15px;
  font-weight: 600;
  gap: 6px;
  margin: 0;
`;

const DrawerContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 16px;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const PROMPT_LINE_HEIGHT = 1.4;
const PROMPT_MAX_LINES = 8;

const PromptBubbleText = styled.div<{ $collapsed: boolean }>`
  overflow: hidden;
  white-space: pre-wrap;
  ${({ $collapsed }) =>
    $collapsed
      ? `display: -webkit-box; -webkit-line-clamp: ${PROMPT_MAX_LINES}; -webkit-box-orient: vertical;`
      : ''}
`;

const PromptToggle = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  padding: 0;

  &:hover {
    color: white;
  }
`;

const ChatContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const ChatMessages = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 16px;
`;

const MessageBubble = styled.div<{ role: 'user' | 'ai' }>`
  max-width: 85%;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${({ role }) =>
    role === 'user' ? '#007AFF' : '#E9E9EB'};
  color: ${({ role }) => (role === 'user' ? '#FFFFFF' : '#1C1C1E')};
  padding: 10px 14px;
  border-radius: ${({ role }) =>
    role === 'user'
      ? '18px 18px 4px 18px'
      : '18px 18px 18px 4px'};
  font-size: 14px;
  line-height: 1.5;
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  background: #E9E9EB;
  border-radius: 18px 18px 18px 4px;
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  align-items: center;
`;

const typingDotKeyframes = `
  @keyframes typingDot {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }
`;

const TypingDot = styled.span<{ $delay: number }>`
  background: #8E8E93;
  border-radius: 50%;
  display: inline-block;
  height: 7px;
  width: 7px;
  animation: typingDot 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const OutputBubbleText = styled.div<{ $collapsed: boolean }>`
  overflow: hidden;
  word-break: break-word;
  ${({ $collapsed }) =>
    $collapsed
      ? 'display: -webkit-box; -webkit-line-clamp: 12; -webkit-box-orient: vertical;'
      : ''}

  .markdown-section {
    margin: 0;
  }
`;

const OutputToggle = styled.button`
  background: none;
  border: none;
  color: #636366;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  padding: 0;

  &:hover {
    color: #1C1C1E;
  }
`;

const ChatInputArea = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background.primary};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const SendButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.font.color.primary};
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.background.primary};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  transition: transform 0.1s;
  width: 32px;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CHAT_LINE_HEIGHT = 24;
const CHAT_PADDING_Y = 1;
const CHAT_COLLAPSED = CHAT_LINE_HEIGHT + CHAT_PADDING_Y * 2;
const CHAT_EXPANDED = CHAT_LINE_HEIGHT * 2 + CHAT_PADDING_Y * 2;

const ChatInput = styled.textarea`
  flex: 1;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.font.color.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 7px;
  padding: ${CHAT_PADDING_Y}px 14px;
  font-size: 13px;
  line-height: ${CHAT_LINE_HEIGHT}px;
  resize: none;
  height: ${CHAT_COLLAPSED}px;
  max-height: 120px;
  overflow: hidden;
  outline: none;
  font-family: inherit;
  transition:
    height 0.2s ease,
    border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const TaskNameText = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DrawerTabBar = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 0;
  padding: 0 16px;
`;

const DrawerTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.color.blue : 'transparent')};
  color: ${({ active, theme }) =>
    active ? theme.color.blue : theme.font.color.tertiary};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  margin-bottom: -1px;
  padding: 10px 16px;
  transition: color 0.15s;

  &:hover {
    color: ${({ active, theme }) =>
      active ? theme.color.blue : theme.font.color.secondary};
  }
`;

const VersionDropdownWrapper = styled.div`
  position: relative;
`;

const VersionButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 6px;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 4px;
  padding: 4px 8px;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const VersionMenu = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  width: 360px;
  z-index: 10;
`;

const VersionMenuItem = styled.div<{ isLatest: boolean }>`
  align-items: center;
  background: ${({ isLatest, theme }) =>
    isLatest ? theme.background.transparent.lighter : 'transparent'};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  gap: 8px;
  padding: 7px 10px;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.light};
  }
`;

const StyledStopButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 6px;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.font.color.danger};
    color: ${({ theme }) => theme.font.color.danger};
  }
`;

export const TaskDetailDrawer = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onStopTask,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onStopTask: (taskId: string) => void;
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeDrawerTab, setActiveDrawerTab] = useState<
    'report' | 'research' | 'trust'
  >('report');
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [promptOverflows, setPromptOverflows] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [outputOverflows, setOutputOverflows] = useState(false);
  const outputBubbleRef = useRef<HTMLDivElement>(null);
  const promptBubbleRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();
  const { getIcon } = useIcons();
  const { enqueueDialog } = useDialogManager();
  const tokenPair = useRecoilValue(tokenPairState);

  // Reset tab and prompt collapse when task changes
  useEffect(() => {
    setActiveDrawerTab('report');
    setPromptExpanded(false);
    setOutputExpanded(false);
  }, [task?.id]);

  // Detect if prompt text overflows the 8-line clamp
  useEffect(() => {
    const el = promptBubbleRef.current;
    if (!el) return;
    setPromptOverflows(el.scrollHeight > el.clientHeight);
  }, [task?.prompt]);

  // Detect if output text overflows the 12-line clamp
  useEffect(() => {
    const el = outputBubbleRef.current;
    if (!el) return;
    setOutputOverflows(el.scrollHeight > el.clientHeight);
  }, [task?.output]);

  // Scroll to bottom of chat when messages or status change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.messages, task?.status, task?.output]);

  // Close version dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        versionMenuRef.current &&
        !versionMenuRef.current.contains(event.target as Node)
      ) {
        setVersionMenuOpen(false);
      }
    };
    if (versionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [versionMenuOpen]);

  if (!task) return null;

  const resizeChatInput = () => {
    const el = chatInputRef.current;
    if (!el) return;
    el.style.height = `${CHAT_EXPANDED}px`;
    const needed = Math.max(CHAT_EXPANDED, el.scrollHeight);
    el.style.height = `${Math.min(needed, 120)}px`;
    el.style.overflow = needed > 120 ? 'auto' : 'hidden';
  };

  const handleChatFocus = () => {
    const el = chatInputRef.current;
    if (!el) return;
    const needed = Math.max(CHAT_EXPANDED, el.scrollHeight);
    el.style.height = `${Math.min(needed, 120)}px`;
  };

  const handleChatBlur = () => {
    const el = chatInputRef.current;
    if (!el || el.value.trim()) return;
    el.style.height = `${CHAT_COLLAPSED}px`;
    el.style.overflow = 'hidden';
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      role: 'user' as const,
      content: chatInput,
      timestamp: Date.now(),
    };

    const updatedTask = {
      ...task,
      messages: [...(task.messages || []), newMessage],
    };

    onUpdateTask(updatedTask);
    setChatInput('');
    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${CHAT_COLLAPSED}px`;
      chatInputRef.current.style.overflow = 'hidden';
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai' as const,
        content: `I'm processing your request regarding "${task.name}". How else can I assist you with this task?`,
        timestamp: Date.now(),
      };
      onUpdateTask({
        ...updatedTask,
        messages: [...updatedTask.messages, aiResponse],
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownload = async (version?: number) => {
    const vSuffix = version ? `_v${version}` : '';
    const safeName = task.name.replace(/\s+/g, '_');

    // Download from the backend endpoint using the stored file
    if (task.fileId) {
      try {
        const token =
          tokenPair?.accessOrWorkspaceAgnosticToken?.token ?? '';
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/analyx/download/${task.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        const ext = task.fileId?.split('.').pop() ?? 'pdf';

        link.download = `Analyx_Report_${safeName}${vSuffix}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return;
      } catch (error) {
        console.error('Failed to download file from server', error);
      }
    }

    // Fallback: decode base64 content from outputFiles
    const outputFiles = task.outputFiles ?? [];
    const file =
      outputFiles.find(
        (f) => f.content && /\.(pdf|docx?|xlsx?)$/i.test(f.path),
      ) ?? outputFiles.find((f) => f.content);

    if (!file?.content) {
      console.warn('No downloadable file found', {
        fileId: task.fileId,
        outputFiles,
      });

      return;
    }

    try {
      const byteCharacters = atob(file.content);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArray], {
        type: file.mimeType ?? 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      const ext = file.path.split('.').pop() ?? 'bin';

      link.download = `Analyx_Report_${safeName}${vSuffix}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file from content', error);
    }
  };

  const versions = task.documentVersions || [];
  const latestVersion =
    versions.length > 0 ? versions[versions.length - 1] : null;
  const TypeIcon = getTypeIcon(task.type);
  const hasScores =
    task.f1Score !== undefined && task.factCheckScore !== undefined;

  return (
    <>
      <Global
        styles={css`
          ${typingDotKeyframes}
          @media print {
            body * {
              visibility: hidden;
            }
            #task-detail-drawer-content,
            #task-detail-drawer-content * {
              visibility: visible;
            }
            #task-detail-drawer-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              transform: none !important;
              height: auto !important;
              overflow: visible !important;
            }
            .drawer-close-button,
            .drawer-export-button,
            .drawer-overlay {
              display: none !important;
            }
          }
        `}
      />
      <DrawerOverlay
        isOpen={isOpen}
        onClick={onClose}
        className="drawer-overlay"
      >
        <DrawerContainer
          isOpen={isOpen}
          onClick={(e) => e.stopPropagation()}
          id="task-detail-drawer-content"
        >
          <DrawerHeader>
            <DrawerTitle>
              <TypeIcon size={18} color={theme.color.blue} />
              Report Details
            </DrawerTitle>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {versions.length > 0 && (
                <VersionDropdownWrapper ref={versionMenuRef}>
                  <div
                    style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}
                  >
                    <VersionButton
                      onClick={() => handleDownload(latestVersion?.version)}
                      className="drawer-export-button"
                      title="Download latest version"
                      style={{
                        borderRadius: '6px 0 0 6px',
                        borderRight: 'none',
                        padding: '4px 8px',
                      }}
                    >
                      <IconDownload size={14} />
                    </VersionButton>
                    <VersionButton
                      onClick={() => setVersionMenuOpen((prev) => !prev)}
                      title="Document versions"
                      style={{ borderRadius: '0 6px 6px 0' }}
                    >
                      v{latestVersion?.version}
                      <IconChevronDown size={12} />
                    </VersionButton>
                  </div>
                  {versionMenuOpen && (
                    <VersionMenu>
                      {[...versions].reverse().map((ver) => (
                        <VersionMenuItem
                          key={ver.version}
                          isLatest={ver.version === latestVersion?.version}
                          onClick={() => {
                            handleDownload(ver.version);
                            setVersionMenuOpen(false);
                          }}
                        >
                          <span style={{ fontWeight: 600, flexShrink: 0 }}>
                            v{ver.version}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: theme.font.color.secondary,
                            }}
                          >
                            {ver.summary}
                          </span>
                          <span
                            style={{
                              flexShrink: 0,
                              color: theme.font.color.tertiary,
                            }}
                          >
                            {formatTaskDateTime(ver.date)}
                          </span>
                          <IconFileText
                            size={13}
                            color={theme.font.color.tertiary}
                            style={{ flexShrink: 0 }}
                          />
                        </VersionMenuItem>
                      ))}
                    </VersionMenu>
                  )}
                </VersionDropdownWrapper>
              )}
              {versions.length === 0 && (
                <StyledIconButton
                  onClick={() => handleDownload()}
                  className="drawer-export-button"
                  title="Download report"
                >
                  <IconDownload size={18} />
                </StyledIconButton>
              )}
              <StyledIconButton
                onClick={onClose}
                className="drawer-close-button"
              >
                <IconX size={18} />
              </StyledIconButton>
            </div>
          </DrawerHeader>

          <DrawerTabBar>
            <DrawerTab
              active={activeDrawerTab === 'report'}
              onClick={() => setActiveDrawerTab('report')}
            >
              Report
            </DrawerTab>
            <DrawerTab
              active={activeDrawerTab === 'research'}
              onClick={() => setActiveDrawerTab('research')}
            >
              Research
            </DrawerTab>
            {hasScores && (
              <DrawerTab
                active={activeDrawerTab === 'trust'}
                onClick={() => setActiveDrawerTab('trust')}
              >
                Trust Score
              </DrawerTab>
            )}
          </DrawerTabBar>

          {activeDrawerTab === 'research' ? (
            <ResearchLogTimeline
              events={task.statusEvents || []}
              taskDate={task.date}
              agentCount={task.agentCount}
              tokenUsage={task.tokenUsage}
            />
          ) : activeDrawerTab === 'trust' && hasScores ? (
            <TrustAccuracyTab
              f1Score={task.f1Score!}
              factCheckScore={task.factCheckScore!}
              agentCount={task.agentCount}
            />
          ) : (
            <DrawerContent>
              {/* Header: name + status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <TaskNameText title={task.name}>{task.name}</TaskNameText>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <StyledStatusBadge status={task.status}>
                    <StyledStatusIcon status={task.status}>
                      {task.status === 'Working' && (
                        <IconLoader size={16} />
                      )}
                      {task.status === 'Ready' && <IconCheck size={10} />}
                      {task.status === 'Verified' && <IconCheck size={10} />}
                      {task.status === 'Reviewed' && <IconCheck size={10} />}
                      {task.status === 'Archived' && <IconArchive size={16} />}
                      {task.status === 'Stopped' && (
                        <IconPlayerStop size={12} />
                      )}
                    </StyledStatusIcon>
                    {task.status}
                  </StyledStatusBadge>
                  {task.status === 'Working' && (
                    <StyledStopButton
                      title="Stop task"
                      onClick={() => {
                        enqueueDialog({
                          title: 'Stop task',
                          message:
                            'Are you sure you want to stop this task? This cannot be undone.',
                          buttons: [
                            {
                              title: 'Cancel',
                              variant: 'secondary',
                            },
                            {
                              title: 'Stop',
                              variant: 'secondary',
                              accent: 'danger',
                              role: 'confirm',
                              onClick: () => onStopTask(task.id),
                            },
                          ],
                        });
                      }}
                    >
                      <IconPlayerStop size={12} />
                      Stop
                    </StyledStopButton>
                  )}
                </div>
              </div>

              {/* Meta: type, date, context — single compact line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                  color: theme.font.color.tertiary,
                }}
              >
                <span
                  style={{ fontWeight: 500, color: theme.font.color.secondary }}
                >
                  {task.contextType || 'General'}
                </span>
                <span>{'·'}</span>
                <span>{formatTaskDateTime(task.date)}</span>
                {task.entities && task.entities.length > 0 && (
                  <>
                    <span>{'·'}</span>
                    {task.entities.map((entity, idx) => {
                      const EntityIcon = entity.objectIcon
                        ? getIcon(entity.objectIcon)
                        : getEntityIcon(entity.objectName || entity.name);
                      return (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <EntityIcon
                            size={12}
                            color={theme.font.color.tertiary}
                          />
                          {entity.objectName &&
                            entity.objectName !== entity.name && (
                              <span>{entity.objectName}:</span>
                            )}
                          <span style={{ color: theme.font.color.secondary }}>
                            {entity.name}
                          </span>
                          {idx < task.entities.length - 1 && (
                            <span style={{ marginLeft: '2px' }}>{','}</span>
                          )}
                        </span>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Attachments Section */}
              {task.attachments && task.attachments.length > 0 && (
                <DetailSection>
                  <SectionLabel>Attachments</SectionLabel>
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    {task.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: `1px solid ${theme.border.color.medium}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      >
                        <IconFile
                          size={16}
                          color={theme.font.color.secondary}
                        />
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span style={{ fontWeight: 500 }}>{file.name}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: theme.font.color.tertiary,
                            }}
                          >
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* Chat Interface */}
              <DetailSection style={{ flex: 1, minHeight: 0 }}>
                <SectionLabel
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconSparkles size={14} color={theme.color.purple} />
                  Ask AI about this task
                </SectionLabel>
                <ChatContainer>
                  <ChatMessages>
                    <MessageBubble role="user">
                      <PromptBubbleText
                        ref={promptBubbleRef}
                        $collapsed={!promptExpanded}
                      >
                        {task.prompt}
                      </PromptBubbleText>
                      {(promptOverflows || promptExpanded) && (
                        <PromptToggle
                          onClick={() => setPromptExpanded((prev) => !prev)}
                        >
                          {promptExpanded ? 'Show less' : 'Show more'}
                        </PromptToggle>
                      )}
                    </MessageBubble>
                    {task.status === 'Working' && (
                      <TypingIndicator>
                        <TypingDot $delay={0} />
                        <TypingDot $delay={0.2} />
                        <TypingDot $delay={0.4} />
                      </TypingIndicator>
                    )}
                    {task.output && task.status !== 'Working' && (
                      <MessageBubble role="ai">
                        <OutputBubbleText
                          ref={outputBubbleRef}
                          $collapsed={!outputExpanded}
                        >
                          <LazyMarkdownRenderer text={task.output} />
                        </OutputBubbleText>
                        {(outputOverflows || outputExpanded) && (
                          <OutputToggle
                            onClick={() =>
                              setOutputExpanded((prev) => !prev)
                            }
                          >
                            {outputExpanded ? 'Show less' : 'Show more'}
                          </OutputToggle>
                        )}
                      </MessageBubble>
                    )}
                    {task.messages?.map((msg, idx) => (
                      <MessageBubble key={idx} role={msg.role}>
                        {msg.role === 'ai' ? (
                          <LazyMarkdownRenderer text={msg.content} />
                        ) : (
                          msg.content
                        )}
                      </MessageBubble>
                    ))}
                    <div ref={messagesEndRef} />
                  </ChatMessages>
                  <ChatInputArea>
                    <ChatInput
                      ref={chatInputRef}
                      placeholder="Ask a question or request changes..."
                      value={chatInput}
                      onChange={(e) => {
                        setChatInput(e.target.value);
                        resizeChatInput();
                      }}
                      onFocus={handleChatFocus}
                      onBlur={handleChatBlur}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        handleKeyDown(e);
                      }}
                      rows={1}
                    />
                    <SendButton onClick={handleSendMessage}>
                      <IconArrowRight size={18} stroke={3} />
                    </SendButton>
                  </ChatInputArea>
                </ChatContainer>
              </DetailSection>
            </DrawerContent>
          )}
        </DrawerContainer>
      </DrawerOverlay>
    </>
  );
};
