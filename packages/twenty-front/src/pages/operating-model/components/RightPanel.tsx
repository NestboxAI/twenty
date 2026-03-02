import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import {
  IconAlertTriangle,
  IconChevronRight,
  IconCircleX,
  IconFileCheck,
} from 'twenty-ui/display';
import {
  type FileNode,
  type ModelTab,
  type RightPanelTab,
  type ValidationItem,
  type VersionChange,
} from '../OperatingModelTypes';
import { REFERENCE_DATA, type FieldReference } from '../utils/referenceData';
import { VERSION_STUBS } from '../stubs/versionStubs';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const TabBar = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
`;

const CollapseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  margin-left: auto;
  padding: 6px 8px;

  &:hover {
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.color.blue : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? theme.color.blue : theme.font.color.tertiary};
  cursor: pointer;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  padding: 8px 12px;

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.color.blue : theme.font.color.secondary};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

const ValidationRow = styled.div`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 8px;
  padding: 6px 4px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const ValidationMessage = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
`;

const ValidationFile = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-family: 'Fira Code', monospace;
  font-size: 10px;
`;

const ValidationCount = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  font-size: 11px;
  gap: 4px;
  margin-bottom: 8px;
`;

const EmptyState = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.light};
  display: flex;
  flex: 1;
  font-size: 12px;
  justify-content: center;
  padding: 32px;
  text-align: center;
`;

const ReferenceSection = styled.div`
  margin-bottom: 16px;
`;

const ReferenceTitle = styled.h4`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 6px;
`;

const ReferenceSummary = styled.p`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 12px;
  line-height: 1.5;
  margin: 0 0 12px;
`;

const FieldCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 8px 10px;
`;

const FieldName = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  margin-bottom: 3px;
`;

const RequiredBadge = styled.span`
  background: rgba(244, 67, 54, 0.1);
  border-radius: 3px;
  color: #f44336;
  font-family: inherit;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 4px;
`;

const OptionalBadge = styled.span`
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: 3px;
  color: ${({ theme }) => theme.font.color.tertiary};
  font-family: inherit;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 4px;
`;

const FieldDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 11px;
  line-height: 1.4;
`;

const FieldExample = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  margin-top: 3px;
`;

const HintsSection = styled.div`
  margin-top: 12px;
`;

const HintItem = styled.li`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 2px;
`;

// Effective model summary (shown at top of Validation tab)
const ModelSummaryBox = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  margin-bottom: 12px;
  padding: 10px;
`;

const ModelSummaryTitle = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const ModelSummaryRow = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  font-size: 11px;
  gap: 8px;
  padding: 1px 0;
`;

const ModelSummaryLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  min-width: 70px;
`;

// History tab styles
const HistoryItem = styled.div<{ $expanded: boolean }>`
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 8px;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.border.color.medium};
  }
`;

const HistoryHeader = styled.div`
  padding: 8px 10px;
`;

const HistoryTimestamp = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  margin-bottom: 2px;
`;

const HistorySummary = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 12px;
  line-height: 1.4;
`;

const HistoryUser = styled.div`
  color: ${({ theme }) => theme.font.color.light};
  font-size: 10px;
  margin-top: 2px;
`;

const HistoryDiff = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  padding: 8px 10px;
`;

const DiffEntry = styled.div`
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DiffFile = styled.div`
  align-items: center;
  display: flex;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  gap: 6px;
  margin-bottom: 4px;
`;

const DiffActionBadge = styled.span<{ $action: string }>`
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  text-transform: uppercase;

  ${({ $action }) => {
    switch ($action) {
      case 'added':
        return 'background: rgba(76, 175, 80, 0.15); color: #4CAF50;';
      case 'modified':
        return 'background: rgba(33, 150, 243, 0.15); color: #2196F3;';
      case 'deleted':
        return 'background: rgba(244, 67, 54, 0.15); color: #F44336;';
      default:
        return '';
    }
  }}
`;

const DiffContent = styled.pre`
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.secondary};
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  line-height: 1.5;
  margin: 0;
  overflow-x: auto;
  padding: 6px 8px;
  white-space: pre-wrap;
`;

const countFiles = (nodeList: FileNode[]): number => {
  let count = 0;
  for (const node of nodeList) {
    if (node.type === 'file') count++;
    if (node.children) count += countFiles(node.children);
  }
  return count;
};

type RightPanelProps = {
  activeTab: ModelTab;
  selectedFile: FileNode | null;
  validationItems: ValidationItem[];
  nodes: FileNode[];
  onValidationClick?: (file: string, line?: number) => void;
  onCollapse?: () => void;
};

export const RightPanel = ({
  activeTab,
  selectedFile,
  validationItems,
  nodes,
  onValidationClick,
  onCollapse,
}: RightPanelProps) => {
  const [tab, setTab] = useState<RightPanelTab>('validation');
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  const reference = REFERENCE_DATA[activeTab];
  const errorCount = validationItems.filter(
    (item) => item.severity === 'error',
  ).length;
  const warningCount = validationItems.filter(
    (item) => item.severity === 'warning',
  ).length;

  const fileCount = useMemo(() => countFiles(nodes), [nodes]);

  // Filter history versions by selected file
  const fileVersions = useMemo(() => {
    if (!selectedFile) return VERSION_STUBS;
    return VERSION_STUBS.filter((version) =>
      version.changes.some((change) =>
        selectedFile.path.endsWith(change.file),
      ),
    );
  }, [selectedFile]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container>
      <TabBar>
        <Tab
          $active={tab === 'validation'}
          onClick={() => setTab('validation')}
        >
          Validation
          {validationItems.length > 0 && ` (${validationItems.length})`}
        </Tab>
        <Tab
          $active={tab === 'reference'}
          onClick={() => setTab('reference')}
        >
          Reference
        </Tab>
        <Tab $active={tab === 'history'} onClick={() => setTab('history')}>
          History
        </Tab>
        <CollapseButton onClick={onCollapse}>
          <IconChevronRight size={14} />
        </CollapseButton>
      </TabBar>
      <Content>
        {tab === 'validation' && (
          <>
            {validationItems.length > 0 && (
              <ModelSummaryBox>
                <ModelSummaryTitle>Effective Model</ModelSummaryTitle>
                <ModelSummaryRow>
                  <ModelSummaryLabel>Files</ModelSummaryLabel>
                  {fileCount}
                </ModelSummaryRow>
              </ModelSummaryBox>
            )}
            {validationItems.length === 0 ? (
              <EmptyState>
                <IconFileCheck size={20} style={{ marginBottom: 4 }} />
                No issues found
              </EmptyState>
            ) : (
              <>
                <ValidationCount>
                  {errorCount > 0 && `${errorCount} error${errorCount !== 1 ? 's' : ''}`}
                  {errorCount > 0 && warningCount > 0 && ', '}
                  {warningCount > 0 && `${warningCount} warning${warningCount !== 1 ? 's' : ''}`}
                </ValidationCount>
                {validationItems.map((item, index) => (
                  <ValidationRow
                    key={index}
                    onClick={() =>
                      onValidationClick?.(item.file, item.line)
                    }
                  >
                    {item.severity === 'error' ? (
                      <IconCircleX size={14} color="#F44336" />
                    ) : (
                      <IconAlertTriangle size={14} color="#FF9800" />
                    )}
                    <div>
                      <ValidationMessage>{item.message}</ValidationMessage>
                      <br />
                      <ValidationFile>
                        {item.file}
                        {item.line ? `:${item.line}` : ''}
                      </ValidationFile>
                    </div>
                  </ValidationRow>
                ))}
              </>
            )}
          </>
        )}
        {tab === 'reference' && (
          <ReferenceSection>
            <ReferenceTitle>{reference.title}</ReferenceTitle>
            <ReferenceSummary>{reference.summary}</ReferenceSummary>

            {reference.fields.map((field: FieldReference) => (
              <FieldCard key={field.name}>
                <FieldName>
                  {field.name}
                  {field.required ? (
                    <RequiredBadge>required</RequiredBadge>
                  ) : (
                    <OptionalBadge>optional</OptionalBadge>
                  )}
                </FieldName>
                <FieldDescription>{field.description}</FieldDescription>
                <FieldExample>e.g. {field.example}</FieldExample>
              </FieldCard>
            ))}

            <HintsSection>
              <ReferenceTitle>Format Hints</ReferenceTitle>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {reference.formatHints.map((hint, index) => (
                  <HintItem key={index}>{hint}</HintItem>
                ))}
              </ul>
            </HintsSection>
          </ReferenceSection>
        )}
        {tab === 'history' && (
          <>
            {fileVersions.length === 0 ? (
              <EmptyState>No history for this file</EmptyState>
            ) : (
              fileVersions.map((version) => {
                const isExpanded = expandedVersion === version.id;
                return (
                  <HistoryItem
                    key={version.id}
                    $expanded={isExpanded}
                    onClick={() =>
                      setExpandedVersion(isExpanded ? null : version.id)
                    }
                  >
                    <HistoryHeader>
                      <HistoryTimestamp>
                        {formatDate(version.timestamp)}
                      </HistoryTimestamp>
                      <HistorySummary>{version.summary}</HistorySummary>
                      <HistoryUser>{version.user}</HistoryUser>
                    </HistoryHeader>
                    {isExpanded && (
                      <HistoryDiff>
                        {version.changes.map(
                          (change: VersionChange, index: number) => (
                            <DiffEntry key={index}>
                              <DiffFile>
                                <DiffActionBadge $action={change.action}>
                                  {change.action}
                                </DiffActionBadge>
                                {change.file}
                              </DiffFile>
                              {change.after && (
                                <DiffContent>{change.after}</DiffContent>
                              )}
                            </DiffEntry>
                          ),
                        )}
                      </HistoryDiff>
                    )}
                  </HistoryItem>
                );
              })
            )}
          </>
        )}
      </Content>
    </Container>
  );
};
