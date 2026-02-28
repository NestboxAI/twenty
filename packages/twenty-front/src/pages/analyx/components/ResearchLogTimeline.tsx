import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import {
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconLoader,
  IconX,
} from 'twenty-ui/display';
import { type StatusEvent } from '../AnalyxTypes';
import { formatRelativeTimestamp } from '../AnalyxUtils';

const TimelineContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 16px;
`;

const TimelineEntry = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimelineGutter = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 20px;
`;

const TimelineIcon = styled.div<{ color: string }>`
  align-items: center;
  background: ${({ color }) => color};
  border-radius: 50%;
  color: white;
  display: flex;
  flex-shrink: 0;
  height: 18px;
  justify-content: center;
  width: 18px;
`;

const TimelineConnector = styled.div`
  background: ${({ theme }) => theme.border.color.medium};
  flex: 1;
  min-height: 12px;
  width: 2px;
`;

const TimelineBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 8px;
  padding-left: 12px;
`;

const TimelineHeader = styled.div`
  align-items: center;
  display: flex;
  font-size: 12px;
  gap: 8px;
`;

const TimelineTimestamp = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-family: monospace;
  font-size: 11px;
  flex-shrink: 0;
`;

const TimelineLabel = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 600;
`;

const TimelineAgentTag = styled.span`
  background: ${({ theme }) => theme.background.transparent.lighter};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  padding: 1px 5px;
`;

const TimelineContentBlock = styled.div<{ collapsed: boolean }>`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
  max-height: ${({ collapsed }) => (collapsed ? '54px' : 'none')};
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.blue};
  cursor: pointer;
  font-size: 11px;
  margin-top: 2px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const SubAgentIndent = styled.div`
  padding-left: 20px;
`;

const CONTENT_LINE_THRESHOLD = 3;
const CONTENT_CHAR_THRESHOLD = 120;

const shouldCollapse = (text: string): boolean => {
  const lines = text.split('\n').length;
  return lines > CONTENT_LINE_THRESHOLD || text.length > CONTENT_CHAR_THRESHOLD;
};

type EventColors = {
  status_change: string;
  thinking: string;
  text: string;
  tool_use: string;
  tool_result_success: string;
  tool_result_failure: string;
  sub_agent: string;
};

const getEventLabel = (event: StatusEvent): string => {
  switch (event.type) {
    case 'status_change':
      return event.message;
    case 'thinking':
      return 'Thinking';
    case 'text':
      return 'Text output';
    case 'tool_use':
      return event.toolName;
    case 'tool_result':
      return `${event.toolName} result`;
    case 'sub_agent':
      return `Sub-agent: ${event.agentName} ${event.action === 'start' ? 'started' : 'completed'}`;
  }
};

const getEventContent = (event: StatusEvent): string | null => {
  switch (event.type) {
    case 'thinking':
      return event.content;
    case 'text':
      return event.content;
    case 'tool_use':
      return event.input;
    case 'tool_result':
      return event.output;
    default:
      return null;
  }
};

const getEventAgent = (event: StatusEvent): string | undefined => {
  if (event.type === 'sub_agent') return event.parentAgent;
  return event.agent;
};

export const ResearchLogTimeline = ({
  events,
  taskDate,
}: {
  events: StatusEvent[];
  taskDate: string;
}) => {
  const theme = useTheme();
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
    new Set(),
  );

  const colors: EventColors = {
    status_change: theme.color.blue,
    thinking: '#9B59B6',
    text: theme.font.color.primary,
    tool_use: '#E67E22',
    tool_result_success: '#4CAF50',
    tool_result_failure: '#E74C3C',
    sub_agent: theme.font.color.tertiary,
  };

  const getIconColor = (event: StatusEvent): string => {
    if (event.type === 'tool_result') {
      return event.success === false
        ? colors.tool_result_failure
        : colors.tool_result_success;
    }
    return (
      colors[
        event.type as keyof Omit<
          EventColors,
          'tool_result_success' | 'tool_result_failure'
        >
      ] || colors.text
    );
  };

  const baseTimestamp = events.length > 0 ? events[0].timestamp : taskDate;

  const toggleExpanded = (index: number) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Track sub-agent nesting for indentation
  const subAgentStack: string[] = [];

  const renderIcon = (event: StatusEvent) => {
    const iconColor = getIconColor(event);
    const iconSize = 10;

    switch (event.type) {
      case 'status_change':
        return (
          <TimelineIcon color={iconColor}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'white',
              }}
            />
          </TimelineIcon>
        );
      case 'thinking':
        return (
          <TimelineIcon color={iconColor}>
            <IconLoader size={iconSize} color="white" />
          </TimelineIcon>
        );
      case 'text':
        return (
          <TimelineIcon color={iconColor}>
            <IconFileText size={iconSize} color="white" />
          </TimelineIcon>
        );
      case 'tool_use':
        return (
          <TimelineIcon color={iconColor}>
            <span style={{ fontSize: 10, lineHeight: 1 }}>{'#'}</span>
          </TimelineIcon>
        );
      case 'tool_result':
        return (
          <TimelineIcon color={iconColor}>
            {event.success === false ? (
              <IconX size={iconSize} color="white" />
            ) : (
              <IconCheck size={iconSize} color="white" />
            )}
          </TimelineIcon>
        );
      case 'sub_agent':
        return (
          <TimelineIcon color={iconColor}>
            <IconArrowRight
              size={iconSize}
              color="white"
              style={{
                transform:
                  event.action === 'end' ? 'rotate(180deg)' : undefined,
              }}
            />
          </TimelineIcon>
        );
    }
  };

  const renderEntry = (event: StatusEvent, index: number) => {
    const isLast = index === events.length - 1;
    const content = getEventContent(event);
    const agent = getEventAgent(event);
    const isExpanded = expandedEntries.has(index);
    const needsCollapse = content ? shouldCollapse(content) : false;
    const labelColor = getIconColor(event);

    // Track sub-agent nesting
    if (event.type === 'sub_agent' && event.action === 'start') {
      subAgentStack.push(event.agentName);
    }
    const isNested = subAgentStack.length > 0 && event.type !== 'sub_agent';
    if (event.type === 'sub_agent' && event.action === 'end') {
      subAgentStack.pop();
    }

    const entryContent = (
      <TimelineEntry key={index}>
        <TimelineGutter>
          {renderIcon(event)}
          {!isLast && <TimelineConnector />}
        </TimelineGutter>
        <TimelineBody>
          <TimelineHeader>
            <TimelineTimestamp>
              {formatRelativeTimestamp(event.timestamp, baseTimestamp)}
            </TimelineTimestamp>
            <TimelineLabel color={labelColor}>
              {getEventLabel(event)}
            </TimelineLabel>
            {agent && <TimelineAgentTag>{agent}</TimelineAgentTag>}
          </TimelineHeader>
          {content && (
            <>
              <TimelineContentBlock collapsed={needsCollapse && !isExpanded}>
                {content}
              </TimelineContentBlock>
              {needsCollapse && (
                <ShowMoreButton onClick={() => toggleExpanded(index)}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </ShowMoreButton>
              )}
            </>
          )}
        </TimelineBody>
      </TimelineEntry>
    );

    if (isNested) {
      return <SubAgentIndent key={index}>{entryContent}</SubAgentIndent>;
    }

    return entryContent;
  };

  if (events.length === 0) {
    return (
      <TimelineContainer>
        <div
          style={{
            color: theme.font.color.tertiary,
            fontSize: 13,
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          No research events recorded.
        </div>
      </TimelineContainer>
    );
  }

  return <TimelineContainer>{events.map(renderEntry)}</TimelineContainer>;
};
