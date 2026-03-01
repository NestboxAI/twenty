import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClockPlay,
  IconCpu,
  IconFileText,
  IconLoader,
  IconRobot,
  IconX,
} from 'twenty-ui/display';
import { type StatusEvent, type TokenUsage } from '../AnalyxTypes';
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

const UsageStatsCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 10px;
  margin-bottom: 16px;
`;

const UsageStatsHeader = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  font-size: 10px;
  font-weight: 600;
  gap: 5px;
  letter-spacing: 0.6px;
  padding: 12px 16px 0;
  text-transform: uppercase;
`;

const UsageStatsGrid = styled.div`
  display: grid;
  gap: 1px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
`;

const UsageStatCell = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
`;

const UsageStatValue = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

const UsageStatLabel = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 500;
  text-align: center;
`;

const AgentBreakdownSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  padding: 10px 16px 12px;
`;

const AgentBreakdownTitle = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const AgentRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  padding: 4px 0;
`;

const AgentName = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  flex: 1;
  font-size: 12px;
  font-weight: 500;
`;

const AgentTokens = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const AgentBar = styled.div`
  border-radius: 2px;
  height: 4px;
  overflow: hidden;
  width: 60px;
`;

const AgentBarFill = styled.div<{ width: number; color: string }>`
  background: ${({ color }) => color};
  border-radius: 2px;
  height: 100%;
  transition: width 0.4s ease;
  width: ${({ width }) => width}%;
`;

const AgentIconWrapper = styled.div<{ color: string }>`
  align-items: center;
  background: ${({ color }) => color}18;
  border-radius: 4px;
  color: ${({ color }) => color};
  display: flex;
  flex-shrink: 0;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

const formatTokenCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toLocaleString();
};

const formatDuration = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }
  return `${seconds}s`;
};

const AGENT_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#EC4899',
];

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
  agentCount,
  tokenUsage,
}: {
  events: StatusEvent[];
  taskDate: string;
  agentCount?: number;
  tokenUsage?: TokenUsage;
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

  const maxAgentTokens = tokenUsage
    ? Math.max(
        ...tokenUsage.agentBreakdown.map((a) => a.inputTokens + a.outputTokens),
      )
    : 0;

  const renderUsageStats = () => {
    if (!tokenUsage) return null;

    return (
      <UsageStatsCard>
        <UsageStatsHeader>
          <IconCpu size={12} />
          Agent & Token Usage
        </UsageStatsHeader>
        <UsageStatsGrid>
          <UsageStatCell>
            <IconRobot size={16} color={theme.color.blue} />
            <UsageStatValue>{agentCount ?? 0}</UsageStatValue>
            <UsageStatLabel>Agents</UsageStatLabel>
          </UsageStatCell>
          <UsageStatCell>
            <IconBolt size={16} color="#F59E0B" />
            <UsageStatValue>
              {formatTokenCount(tokenUsage.totalTokens)}
            </UsageStatValue>
            <UsageStatLabel>Total Tokens</UsageStatLabel>
          </UsageStatCell>
          <UsageStatCell>
            <IconClockPlay size={16} color="#8B5CF6" />
            <UsageStatValue>
              {formatDuration(tokenUsage.durationSeconds)}
            </UsageStatValue>
            <UsageStatLabel>Duration</UsageStatLabel>
          </UsageStatCell>
          <UsageStatCell>
            <IconCpu size={16} color="#10B981" />
            <UsageStatValue>
              {formatTokenCount(tokenUsage.outputTokens)}
            </UsageStatValue>
            <UsageStatLabel>Output</UsageStatLabel>
          </UsageStatCell>
        </UsageStatsGrid>
        <AgentBreakdownSection>
          <AgentBreakdownTitle>Token Breakdown by Agent</AgentBreakdownTitle>
          {tokenUsage.agentBreakdown.map((agent, idx) => {
            const agentTotal = agent.inputTokens + agent.outputTokens;
            const barPercent =
              maxAgentTokens > 0 ? (agentTotal / maxAgentTokens) * 100 : 0;
            const color = AGENT_COLORS[idx % AGENT_COLORS.length];
            return (
              <AgentRow key={idx}>
                <AgentIconWrapper color={color}>
                  <IconRobot size={12} />
                </AgentIconWrapper>
                <AgentName>{agent.agentName}</AgentName>
                <AgentBar>
                  <AgentBarFill width={barPercent} color={color} />
                </AgentBar>
                <AgentTokens>{formatTokenCount(agentTotal)}</AgentTokens>
              </AgentRow>
            );
          })}
        </AgentBreakdownSection>
      </UsageStatsCard>
    );
  };

  if (events.length === 0) {
    return (
      <TimelineContainer>
        {renderUsageStats()}
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

  return (
    <TimelineContainer>
      {renderUsageStats()}
      {events.map(renderEntry)}
    </TimelineContainer>
  );
};
