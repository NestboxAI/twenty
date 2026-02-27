import { TextInput } from '@/ui/input/components/TextInput';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useToggleDropdown } from '@/ui/layout/dropdown/hooks/useToggleDropdown';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  IconArchive,
  IconCheck,
  IconDotsVertical,
  IconLoader,
  IconSearch,
  IconX,
  useIcons,
} from 'twenty-ui/display';
import { MenuItem } from 'twenty-ui/navigation';
import {
  StyledSpinningWrapper,
  StyledStatusBadge,
  StyledStatusIcon,
} from '../AnalyxSharedStyles';
import { type Task, type TaskTab } from '../AnalyxTypes';
import {
  formatTaskDateShort,
  getEntityIcon,
  getTypeIcon,
  getTypeName,
} from '../AnalyxUtils';

const StyledTabsContainer = styled.div`
  align-items: center;
  align-self: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const StyledTabs = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 16px;
  }
`;

const StyledTab = styled.button<{ active: boolean }>`
  padding: 12px 0;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.color.blue : 'transparent')};
  color: ${({ active, theme }) =>
    active ? theme.color.blue : theme.font.color.tertiary};
  font-weight: ${({ active }) => (active ? 600 : 500)};
  cursor: pointer;
  font-size: 14px;
  margin-bottom: -1px;

  &:hover {
    color: ${({ active, theme }) =>
      active ? theme.color.blue : theme.font.color.secondary};
  }
`;

const StyledTaskList = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;

  @media (max-width: 768px) {
    min-width: 100%;
    max-height: none;
    overflow-y: visible;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background.secondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border.color.medium};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.border.color.strong};
    }
  }
`;

const StyledSearchTextInput = styled(TextInput)`
  input {
    background-color: ${({ theme }) => theme.background.primary};
  }
`;

const StyledTaskRow = styled.div<{ isLast: boolean }>`
  display: grid;
  grid-template-columns: minmax(120px, 1fr) 100px 120px 220px 100px 60px;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
  background: ${({ theme }) => theme.background.primary};
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${theme.border.color.light}`};
  transition: background 0.2s;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    position: relative;
    padding-right: 50px;

    & > :nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      width: 100%;
      margin-bottom: 4px;
    }

    & > :nth-child(2) {
      font-size: 12px;
      color: ${({ theme }) => theme.font.color.tertiary};
      order: 4;
    }

    & > :nth-child(3) {
      order: 2;
    }

    & > :nth-child(4) {
      order: 3;
      flex-wrap: wrap;
    }

    & > :nth-child(5) {
      position: absolute;
      top: 16px;
      right: 48px;
    }

    & > :nth-child(6) {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .remove-button {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};

    .remove-button {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const StyledRemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.background.transparent.medium};
    color: ${({ theme }) => theme.font.color.danger};
  }
`;

const StyledMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 1;
  pointer-events: auto;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.background.transparent.medium};
  }
`;

const StyledCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.font.color.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    white-space: normal;
    overflow: visible;
    margin-bottom: 4px;
  }
`;

const StyledDateCell = styled(StyledCell)`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledIconWrapper = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
`;

type AnalyxTaskListProps = {
  tasks: Task[];
  activeTab: string;
  searchQuery: string;
  onTabChange: (tab: string) => void;
  onSearchChange: (query: string) => void;
  onRemoveTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newTab: TaskTab) => void;
  onTaskClick: (taskId: string) => void;
};

export const AnalyxTaskList = ({
  tasks,
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
  onRemoveTask,
  onMoveTask,
  onTaskClick,
}: AnalyxTaskListProps) => {
  const theme = useTheme();
  const { getIcon } = useIcons();
  const { toggleDropdown } = useToggleDropdown();

  const filteredTasks = tasks
    .filter((task) => task.tab === activeTab)
    .filter((task) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        task.name.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query) ||
        task.entities.some(
          (entity) =>
            entity.name.toLowerCase().includes(query) ||
            (entity.objectName &&
              entity.objectName.toLowerCase().includes(query)),
        ) ||
        task.status.toLowerCase().includes(query)
      );
    });

  return (
    <>
      <StyledTabsContainer>
        <StyledTabs>
          {['Tasks', 'Reviewed', 'Archive'].map((tab) => (
            <StyledTab
              key={tab}
              active={activeTab === tab}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </StyledTab>
          ))}
        </StyledTabs>

        <StyledSearchTextInput
          placeholder="Search..."
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={(e) => e.stopPropagation()}
          LeftIcon={IconSearch}
          width={240}
        />
      </StyledTabsContainer>

      <StyledTaskList>
        {filteredTasks.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: theme.font.color.tertiary,
              fontSize: '14px',
            }}
          >
            {searchQuery
              ? `No tasks found matching "${searchQuery}"`
              : 'No tasks available'}
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const TypeIcon = getTypeIcon(task.type);
            return (
              <StyledTaskRow
                key={task.id}
                isLast={index === filteredTasks.length - 1}
                onClick={() => onTaskClick(task.id)}
              >
                <StyledCell style={{ fontWeight: 500 }}>{task.name}</StyledCell>
                <StyledDateCell>{formatTaskDateShort(task.date)}</StyledDateCell>

                <StyledCell>
                  <StyledIconWrapper>
                    <TypeIcon size={16} />
                  </StyledIconWrapper>
                  {getTypeName(task.type)}
                </StyledCell>

                <StyledCell>
                  {task.entities.map((entity, idx) => {
                    const EntityIcon =
                      (entity.objectIcon
                        ? (getIcon(entity.objectIcon) ?? null)
                        : null) ??
                      getEntityIcon(entity.objectName || entity.name);
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginRight: 8,
                          color: theme.font.color.secondary,
                        }}
                      >
                        <EntityIcon size={16} />
                        {entity.objectName &&
                          entity.objectName !== entity.name && (
                            <span style={{ marginRight: 4 }}>
                              {entity.objectName}:
                            </span>
                          )}
                        <span>{entity.name}</span>
                      </div>
                    );
                  })}
                </StyledCell>

                <div style={{ justifySelf: 'end' }}>
                  <StyledStatusBadge status={task.status}>
                    <StyledStatusIcon status={task.status}>
                      {task.status === 'Processing' && (
                        <StyledSpinningWrapper>
                          <IconLoader size={16} />
                        </StyledSpinningWrapper>
                      )}
                      {task.status === 'Verified' && (
                        <IconCheck size={10} stroke={4} />
                      )}
                      {task.status === 'Reviewed' && (
                        <IconCheck size={10} stroke={4} />
                      )}
                      {task.status === 'Archived' && (
                        <IconArchive size={16} stroke={2} />
                      )}
                      {task.status === 'Ready' && (
                        <IconCheck size={10} stroke={4} />
                      )}
                    </StyledStatusIcon>
                    {task.status}
                  </StyledStatusBadge>
                </div>

                {task.status !== 'Processing' && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      justifySelf: 'end',
                    }}
                  >
                    <Dropdown
                      dropdownId={`task-menu-${task.id}`}
                      disableClickForClickableComponent={true}
                      clickableComponent={
                        <StyledMenuButton
                          className="menu-button"
                          title="Move task"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown({
                              dropdownComponentInstanceIdFromProps: `task-menu-${task.id}`,
                            });
                          }}
                        >
                          <IconDotsVertical size={16} />
                        </StyledMenuButton>
                      }
                      dropdownComponents={
                        <DropdownContent widthInPixels={160}>
                          <DropdownMenuItemsContainer>
                            {activeTab !== 'Reviewed' && (
                              <MenuItem
                                text="Mark as Reviewed"
                                onClick={() => onMoveTask(task.id, 'Reviewed')}
                              />
                            )}
                            {activeTab !== 'Archive' && (
                              <MenuItem
                                text="Archive"
                                onClick={() => onMoveTask(task.id, 'Archive')}
                              />
                            )}
                          </DropdownMenuItemsContainer>
                        </DropdownContent>
                      }
                    />

                    <StyledRemoveButton
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTask(task.id);
                      }}
                      title="Remove task"
                    >
                      <IconX size={16} />
                    </StyledRemoveButton>
                  </div>
                )}
              </StyledTaskRow>
            );
          })
        )}
      </StyledTaskList>
    </>
  );
};
