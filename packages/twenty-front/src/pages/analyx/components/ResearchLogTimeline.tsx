import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import {
  IconArrowRight,
  IconCheck,
  IconClockPlay,
  IconCpu,
  IconCurrencyDollar,
  IconFileText,
  IconLoader,
  IconRepeat,
  IconRobot,
  IconX,
} from 'twenty-ui/display';
import { type StatusEvent, type TaskRunStats } from '../AnalyxTypes';
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

const TimelineTag = styled.span`
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

const TimelineErrorBlock = styled.div`
  background: ${({ theme }) => theme.background.danger};
  border-radius: 6px;
  color: ${({ theme }) => theme.font.color.danger};
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
  padding: 6px 10px;
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

const StatsCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 10px;
  margin-bottom: 16px;
`;

const StatsHeader = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  gap: 1px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
`;

const StatCell = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 500;
  text-align: center;
`;

const BreakdownSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  padding: 10px 16px 12px;
`;

const BreakdownTitle = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const BreakdownRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  padding: 4px 0;
`;

const BreakdownName = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  flex: 1;
  font-size: 12px;
  font-weight: 500;
`;

const BreakdownCount = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const BreakdownBar = styled.div`
  border-radius: 2px;
  height: 4px;
  overflow: hidden;
  width: 60px;
`;

const BreakdownBarFill = styled.div<{ width: number; color: string }>`
  background: ${({ color }) => color};
  border-radius: 2px;
  height: 100%;
  transition: width 0.4s ease;
  width: ${({ width }) => width}%;
`;

const BreakdownIconWrapper = styled.div<{ color: string }>`
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

const BREAKDOWN_COLORS = [
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

const formatDurationMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);

  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${minutes}m ${secs}s`;
  }

  return `${totalSeconds}s`;
};

const formatCost = (usd: number): string => {
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(2)}`;

  return `$${usd.toFixed(2)}`;
};

// Map event type+subtype to a readable label
const getEventLabel = (event: StatusEvent): string => {
  const { type, subtype, data } = event;

  const toolName = data?.toolName as string | undefined;
  const agentName = data?.agentName as string | undefined;
  const action = data?.action as string | undefined;
  const message = data?.message as string | undefined;

  switch (type) {
    case 'system':
      return message ?? subtype ?? 'System';
    case 'status_change':
      return message ?? subtype ?? 'Status change';
    case 'thinking':
      return 'Thinking';
    case 'assistant':
      if (subtype === 'thinking') return 'Thinking';
      if (subtype === 'text') return 'Text output';
      return subtype ?? 'Assistant';
    case 'text':
      return 'Text output';
    case 'tool_use':
      return toolName ?? subtype ?? 'Tool call';
    case 'tool_result':
      return `${toolName ?? subtype ?? 'Tool'} result`;
    case 'tool':
      if (subtype === 'use' || subtype === 'call')
        return toolName ?? 'Tool call';
      if (subtype === 'result' || subtype === 'output')
        return `${toolName ?? 'Tool'} result`;
      return toolName ?? subtype ?? 'Tool';
    case 'sub_agent':
      if (agentName) {
        return `Sub-agent: ${agentName} ${action === 'start' ? 'started' : 'completed'}`;
      }
      return subtype ?? 'Sub-agent';
    case 'agent':
      if (subtype === 'start' || subtype === 'spawn')
        return `Agent: ${agentName ?? 'unknown'} started`;
      if (subtype === 'end' || subtype === 'complete')
        return `Agent: ${agentName ?? 'unknown'} completed`;
      return agentName ?? subtype ?? 'Agent';
    case 'error':
      return 'Error';
    case 'result':
      return 'Result';
    default:
      if (subtype && subtype !== type) return `${type}: ${subtype}`;
      return type;
  }
};

// Extract displayable content from the event
const getEventContent = (event: StatusEvent): string | null => {
  if (event.content && event.content.length > 0) {
    return event.content.join('\n');
  }

  const data = event.data;

  if (data) {
    if (typeof data.content === 'string') return data.content;
    if (typeof data.output === 'string') return data.output;
    if (typeof data.input === 'string') return data.input;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.text === 'string') return data.text;
  }

  return null;
};

type EventColorKey =
  | 'system'
  | 'thinking'
  | 'text'
  | 'tool'
  | 'success'
  | 'failure'
  | 'agent'
  | 'error';

const getEventColorKey = (event: StatusEvent): EventColorKey => {
  const { type, subtype, data, error } = event;

  if (error) return 'failure';
  if (type === 'error') return 'failure';

  if (
    type === 'tool_result' ||
    (type === 'tool' && (subtype === 'result' || subtype === 'output'))
  ) {
    if (data?.success === false) return 'failure';
    return 'success';
  }

  if (type === 'tool_use' || type === 'tool') return 'tool';

  if (type === 'thinking' || (type === 'assistant' && subtype === 'thinking')) {
    return 'thinking';
  }

  if (type === 'text' || (type === 'assistant' && subtype === 'text')) {
    return 'text';
  }

  if (type === 'sub_agent' || type === 'agent') return 'agent';
  if (type === 'system' || type === 'status_change' || type === 'result') {
    return 'system';
  }

  return 'text';
};

const isSubAgentStart = (event: StatusEvent): boolean => {
  const action = event.data?.action as string | undefined;

  return (
    (event.type === 'sub_agent' || event.type === 'agent') &&
    (event.subtype === 'start' ||
      event.subtype === 'spawn' ||
      action === 'start')
  );
};

const isSubAgentEnd = (event: StatusEvent): boolean => {
  const action = event.data?.action as string | undefined;

  return (
    (event.type === 'sub_agent' || event.type === 'agent') &&
    (event.subtype === 'end' ||
      event.subtype === 'complete' ||
      action === 'end')
  );
};

// Derive stats from events
type DerivedStats = {
  uniqueSessions: string[];
  eventCountsByType: Record<string, number>;
  toolCallCount: number;
  errorCount: number;
  durationFromEvents: number | null;
};

const deriveStatsFromEvents = (events: StatusEvent[]): DerivedStats => {
  const sessions = new Set<string>();
  const typeCounts: Record<string, number> = {};
  let toolCallCount = 0;
  let errorCount = 0;

  for (const event of events) {
    if (event.sessionId) sessions.add(event.sessionId);
    const key = event.subtype ? `${event.type}:${event.subtype}` : event.type;

    typeCounts[key] = (typeCounts[key] ?? 0) + 1;

    if (
      event.type === 'tool_use' ||
      event.type === 'tool' ||
      (event.type === 'tool' &&
        (event.subtype === 'use' || event.subtype === 'call'))
    ) {
      toolCallCount++;
    }

    if (event.error || event.type === 'error') {
      errorCount++;
    }
  }

  let durationFromEvents: number | null = null;

  if (events.length >= 2) {
    const first = new Date(events[0].timestamp).getTime();
    const last = new Date(events[events.length - 1].timestamp).getTime();

    if (!isNaN(first) && !isNaN(last)) {
      durationFromEvents = last - first;
    }
  }

  return {
    uniqueSessions: Array.from(sessions),
    eventCountsByType: typeCounts,
    toolCallCount,
    errorCount,
    durationFromEvents,
  };
};

export const ResearchLogTimeline = ({
  events,
  taskDate,
  runStats,
  isWorking = false,
}: {
  events: StatusEvent[];
  taskDate: string;
  runStats?: TaskRunStats;
  isWorking?: boolean;
}) => {
  const theme = useTheme();
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
    new Set(),
  );

  const colorMap: Record<EventColorKey, string> = {
    system: theme.color.blue,
    thinking: '#9B59B6',
    text: theme.font.color.primary,
    tool: '#E67E22',
    success: '#4CAF50',
    failure: '#E74C3C',
    agent: theme.font.color.tertiary,
    error: '#E74C3C',
  };

  const getIconColor = (event: StatusEvent): string => {
    return colorMap[getEventColorKey(event)];
  };

  const baseTimestamp = events.length > 0 ? events[0].timestamp : taskDate;

  const derived = useMemo(() => deriveStatsFromEvents(events), [events]);

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
    const colorKey = getEventColorKey(event);

    switch (colorKey) {
      case 'system':
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
      case 'tool':
        return (
          <TimelineIcon color={iconColor}>
            <span style={{ fontSize: 10, lineHeight: 1 }}>{'#'}</span>
          </TimelineIcon>
        );
      case 'success':
        return (
          <TimelineIcon color={iconColor}>
            <IconCheck size={iconSize} color="white" />
          </TimelineIcon>
        );
      case 'failure':
      case 'error':
        return (
          <TimelineIcon color={iconColor}>
            <IconX size={iconSize} color="white" />
          </TimelineIcon>
        );
      case 'agent':
        return (
          <TimelineIcon color={iconColor}>
            <IconArrowRight
              size={iconSize}
              color="white"
              style={{
                transform: isSubAgentEnd(event)
                  ? 'rotate(180deg)'
                  : undefined,
              }}
            />
          </TimelineIcon>
        );
      default:
        return (
          <TimelineIcon color={iconColor}>
            <IconFileText size={iconSize} color="white" />
          </TimelineIcon>
        );
    }
  };

  const renderEntry = (event: StatusEvent, index: number) => {
    const isLast = index === events.length - 1;
    const content = getEventContent(event);
    const isExpanded = expandedEntries.has(index);
    const needsCollapse = content ? shouldCollapse(content) : false;
    const labelColor = getIconColor(event);

    if (isSubAgentStart(event)) {
      subAgentStack.push(
        (event.data?.agentName as string) ?? event.subtype ?? 'agent',
      );
    }
    const isNested =
      subAgentStack.length > 0 &&
      !isSubAgentStart(event) &&
      !isSubAgentEnd(event);

    if (isSubAgentEnd(event)) {
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
            {event.model && <TimelineTag>{event.model}</TimelineTag>}
            {event.sessionId && <TimelineTag>{event.sessionId}</TimelineTag>}
          </TimelineHeader>
          {event.error && (
            <TimelineErrorBlock>{event.error}</TimelineErrorBlock>
          )}
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

  const hasAnyStats =
    runStats ||
    derived.uniqueSessions.length > 0 ||
    derived.toolCallCount > 0;

  const durationMs =
    runStats?.durationMs ?? derived.durationFromEvents ?? undefined;

  // Build session breakdown from events (event count per session)
  const sessionBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const event of events) {
      const sid = event.sessionId ?? 'main';

      counts[sid] = (counts[sid] ?? 0) + 1;
    }

    return Object.entries(counts)
      .map(([sessionId, count]) => ({ sessionId, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  const maxSessionEvents =
    sessionBreakdown.length > 0
      ? Math.max(...sessionBreakdown.map((s) => s.count))
      : 0;

  const renderUsageStats = () => {
    if (!hasAnyStats) return null;

    return (
      <StatsCard>
        <StatsHeader>
          <IconCpu size={12} />
          Run Summary
        </StatsHeader>
        <StatsGrid>
          <StatCell>
            <IconClockPlay size={16} color="#8B5CF6" />
            <StatValue>
              {durationMs !== undefined ? formatDurationMs(durationMs) : '--'}
            </StatValue>
            <StatLabel>Duration</StatLabel>
          </StatCell>
          <StatCell>
            <IconRepeat size={16} color={theme.color.blue} />
            <StatValue>{runStats?.turns ?? events.length}</StatValue>
            <StatLabel>{runStats?.turns !== undefined ? 'Turns' : 'Events'}</StatLabel>
          </StatCell>
          <StatCell>
            <IconCurrencyDollar size={16} color="#10B981" />
            <StatValue>
              {runStats?.totalCostUsd !== undefined
                ? formatCost(runStats.totalCostUsd)
                : '--'}
            </StatValue>
            <StatLabel>Cost</StatLabel>
          </StatCell>
          <StatCell>
            <IconRobot size={16} color="#F59E0B" />
            <StatValue>{derived.uniqueSessions.length || 1}</StatValue>
            <StatLabel>Sessions</StatLabel>
          </StatCell>
        </StatsGrid>

        {/* Budget bar (if budget data available) */}
        {runStats?.budgetUsd !== undefined &&
          runStats.totalCostUsd !== undefined && (
            <BreakdownSection>
              <BreakdownTitle>Budget Usage</BreakdownTitle>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: theme.background.transparent.lighter,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 3,
                      background:
                        runStats.totalCostUsd / runStats.budgetUsd > 0.8
                          ? '#EF4444'
                          : '#10B981',
                      width: `${Math.min(100, (runStats.totalCostUsd / runStats.budgetUsd) * 100)}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: theme.font.color.tertiary,
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatCost(runStats.totalCostUsd)} /{' '}
                  {formatCost(runStats.budgetUsd)}
                </span>
              </div>
            </BreakdownSection>
          )}

        {/* Session breakdown */}
        {sessionBreakdown.length > 1 && (
          <BreakdownSection>
            <BreakdownTitle>Events by Session</BreakdownTitle>
            {sessionBreakdown.map((session, idx) => {
              const barPercent =
                maxSessionEvents > 0
                  ? (session.count / maxSessionEvents) * 100
                  : 0;
              const color = BREAKDOWN_COLORS[idx % BREAKDOWN_COLORS.length];

              return (
                <BreakdownRow key={session.sessionId}>
                  <BreakdownIconWrapper color={color}>
                    <IconRobot size={12} />
                  </BreakdownIconWrapper>
                  <BreakdownName>
                    {session.sessionId.length > 20
                      ? `${session.sessionId.slice(0, 8)}...`
                      : session.sessionId}
                  </BreakdownName>
                  <BreakdownBar>
                    <BreakdownBarFill width={barPercent} color={color} />
                  </BreakdownBar>
                  <BreakdownCount>
                    {session.count} event{session.count !== 1 ? 's' : ''}
                  </BreakdownCount>
                </BreakdownRow>
              );
            })}
          </BreakdownSection>
        )}

      </StatsCard>
    );
  };

  if (events.length === 0) {
    return (
      <TimelineContainer>
        {!isWorking && renderUsageStats()}
        <div
          style={{
            alignItems: 'center',
            color: theme.font.color.tertiary,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 60,
            textAlign: 'center',
          }}
        >
          {isWorking ? (
            <>
              <IconLoader size={24} color={theme.font.color.light} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                Generating report...
              </div>
              <div style={{ fontSize: 12, maxWidth: 260 }}>
                The research log will appear here once the agent starts
                processing.
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13 }}>No research events recorded.</div>
          )}
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
