import { css, Global, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import {
  IconArchive,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconFile,
  IconFileText,
  IconLoader,
  IconSparkles,
  IconX,
  useIcons,
} from 'twenty-ui/display';
import {
  StyledIconButton,
  StyledStatusBadge,
  StyledStatusIcon,
} from '../AnalyxSharedStyles';
import { type Task } from '../AnalyxTypes';
import { formatTaskDateTime, getEntityIcon, getTypeIcon } from '../AnalyxUtils';
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
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 12px;
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
  gap: 16px;
  overflow-y: auto;
  padding: 16px;
`;

const MessageBubble = styled.div<{ role: 'user' | 'ai' }>`
  max-width: 85%;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${({ role, theme }) =>
    role === 'user' ? theme.color.blue : theme.background.primary};
  color: ${({ role, theme }) =>
    role === 'user' ? 'white' : theme.font.color.primary};
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: ${({ theme }) => theme.boxShadow.light};
  border: ${({ role, theme }) =>
    role === 'ai' ? `1px solid ${theme.border.color.light}` : 'none'};
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

export const TaskDetailDrawer = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeDrawerTab, setActiveDrawerTab] = useState<
    'report' | 'research' | 'trust'
  >('report');
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [promptOverflows, setPromptOverflows] = useState(false);
  const promptBubbleRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();
  const { getIcon } = useIcons();

  // Reset tab and prompt collapse when task changes
  useEffect(() => {
    setActiveDrawerTab('report');
    setPromptExpanded(false);
  }, [task?.id]);

  // Detect if prompt text overflows the 8-line clamp
  useEffect(() => {
    const el = promptBubbleRef.current;
    if (!el) return;
    setPromptOverflows(el.scrollHeight > el.clientHeight);
  }, [task?.prompt]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.messages]);

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

  const handleDownload = (version?: number) => {
    const pdfUrl = '/pdf/report-template.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    const vSuffix = version ? `_v${version}` : '';
    link.download = `Analyx_Report_${task.name.replace(/\s+/g, '_')}${vSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <StyledStatusBadge status={task.status}>
                  <StyledStatusIcon status={task.status}>
                    {task.status === 'Processing' && <IconLoader size={16} />}
                    {task.status === 'Ready' && <IconCheck size={10} />}
                    {task.status === 'Verified' && <IconCheck size={10} />}
                    {task.status === 'Reviewed' && <IconCheck size={10} />}
                    {task.status === 'Archived' && <IconArchive size={16} />}
                  </StyledStatusIcon>
                  {task.status}
                </StyledStatusBadge>
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
                    {task.messages?.map((msg, idx) => (
                      <MessageBubble key={idx} role={msg.role}>
                        {msg.content}
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
