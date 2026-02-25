import { css, Global, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import {
  IconArchive,
  IconBrain,
  IconCheck,
  IconFile,
  IconLoader,
  IconPrinter,
  IconSend,
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
import { getEntityIcon } from '../AnalyxUtils';

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
  width: 500px;
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
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
  margin: 0;
`;

const DrawerContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding: 24px;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const PromptBox = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.font.color.primary};
  white-space: pre-wrap;
`;

const ChatContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 400px; // Fixed height for chat area
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
  padding: 12px;
  background: ${({ theme }) => theme.background.primary};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const ChatInput = styled.textarea`
  flex: 1;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.font.color.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { getIcon } = useIcons();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.messages]);

  if (!task) return null;

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

  const handleDownload = () => {
    // URL to the static PDF file
    const pdfUrl = '/pdf/report-template.pdf';

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = pdfUrl;
    // Set a meaningful name for the downloaded file
    link.download = `Analyx_Report_${task.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            /* Hide close button and other non-printable elements inside drawer if needed */
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
              <IconBrain size={20} color={theme.color.blue} />
              Task Details
            </DrawerTitle>
            <div style={{ display: 'flex', gap: '8px' }}>
              <StyledIconButton
                onClick={handleDownload}
                className="drawer-export-button"
              >
                <IconPrinter size={20} />
              </StyledIconButton>
              <StyledIconButton
                onClick={onClose}
                className="drawer-close-button"
              >
                <IconX size={20} />
              </StyledIconButton>
            </div>
          </DrawerHeader>

          <DrawerContent>
            {/* Header / Meta Info */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                {task.name}
              </div>
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

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <SectionLabel>Version</SectionLabel>
                <div>{task.version}</div>
              </div>
              <div>
                <SectionLabel>Type</SectionLabel>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {task.contextType || 'General'}
                </div>
              </div>
              <div>
                <SectionLabel>Date</SectionLabel>
                <div>{task.date}</div>
              </div>
            </div>

            {/* Entities Section */}
            {task.entities && task.entities.length > 0 && (
              <DetailSection>
                <SectionLabel>Context</SectionLabel>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {task.entities.map((entity, idx) => {
                    const EntityIcon = entity.objectIcon
                      ? getIcon(entity.objectIcon)
                      : getEntityIcon(entity.objectName || entity.name);

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          background: theme.background.secondary,
                          borderRadius: '6px',
                          fontSize: '13px',
                          border: `1px solid ${theme.border.color.light}`,
                        }}
                      >
                        <EntityIcon
                          size={14}
                          color={theme.font.color.secondary}
                        />
                        {entity.objectName &&
                          entity.objectName !== entity.name && (
                            <span style={{ color: theme.font.color.tertiary }}>
                              {entity.objectName}:
                            </span>
                          )}
                        <span style={{ fontWeight: 500 }}>{entity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </DetailSection>
            )}

            {/* Prompt Section */}
            <DetailSection>
              <SectionLabel>Original Prompt</SectionLabel>
              <PromptBox>{task.prompt}</PromptBox>
            </DetailSection>

            {/* Attachments Section */}
            {task.attachments && task.attachments.length > 0 && (
              <DetailSection>
                <SectionLabel>Attachments</SectionLabel>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                      <IconFile size={16} color={theme.font.color.secondary} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            <DetailSection style={{ flex: 1 }}>
              <SectionLabel
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconSparkles size={14} color={theme.color.purple} />
                Ask AI about this task
              </SectionLabel>
              <ChatContainer>
                <ChatMessages>
                  {task.messages?.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: theme.font.color.tertiary,
                        marginTop: '40px',
                      }}
                    >
                      <IconSparkles
                        size={32}
                        style={{ marginBottom: '8px', opacity: 0.5 }}
                      />
                      <div>Start a conversation about this task.</div>
                    </div>
                  )}
                  {task.messages?.map((msg, idx) => (
                    <MessageBubble key={idx} role={msg.role}>
                      {msg.content}
                    </MessageBubble>
                  ))}
                  <div ref={messagesEndRef} />
                </ChatMessages>
                <ChatInputArea>
                  <ChatInput
                    placeholder="Ask a question or request changes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      handleKeyDown(e);
                    }}
                    rows={1}
                  />
                  <StyledIconButton
                    onClick={handleSendMessage}
                    style={{
                      background: theme.color.blue,
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                    }}
                  >
                    <IconSend size={16} />
                  </StyledIconButton>
                </ChatInputArea>
              </ChatContainer>
            </DetailSection>
          </DrawerContent>
        </DrawerContainer>
      </DrawerOverlay>
    </>
  );
};
