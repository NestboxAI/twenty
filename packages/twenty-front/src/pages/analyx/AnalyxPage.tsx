import { CREATE_FILE } from '@/file/graphql/mutations/createFile';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { MainContainerLayoutWithCommandMenu } from '@/object-record/components/MainContainerLayoutWithCommandMenu';
import { searchRecordStoreFamilyState } from '@/object-record/record-picker/multiple-record-picker/states/searchRecordStoreComponentFamilyState';
import { singleRecordPickerSearchFilterComponentState } from '@/object-record/record-picker/single-record-picker/states/singleRecordPickerSearchFilterComponentState';
import { type RecordPickerPickableMorphItem } from '@/object-record/record-picker/types/RecordPickerPickableMorphItem';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import { GET_NESTBOX_AGENTS } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/graphql/getNestboxAgents';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilCallback } from 'recoil';
import { IconBrain, IconFolder, useIcons } from 'twenty-ui/display';
import {
  type AnalyxCommand,
  type CustomMcpConnector,
  type NestboxAgent,
  type SelectedContext,
  type StatusEvent,
  type Task,
  type TaskRunStats,
  type TaskStatus,
  type TaskTab,
} from './AnalyxTypes';
import { useWorkspaceCommands } from './hooks/useWorkspaceCommands';
import {
  CONTEXT_TYPE_OPTIONS,
  generateMockScores,
  generateRandomTitle,
  getTaskType,
} from './AnalyxUtils';
import { AnalyxAddCommandForm } from './components/AnalyxAddCommandForm';
import { McpConnectorModal } from './components/McpConnectorModal';
import { AnalyxChipsBar } from './components/AnalyxChipsBar';
import { AnalyxCommandDetailPopup } from './components/AnalyxCommandDetailPopup';
import { AnalyxCommandsBar } from './components/AnalyxCommandsBar';
import {
  AnalyxPromptInput,
  type ContextObjectOption,
} from './components/AnalyxPromptInput';
import { AnalyxTaskList } from './components/AnalyxTaskList';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import {
  ARCHIVE_ANALYX_TASK,
  CREATE_ANALYX_TASK,
  GET_ANALYX_TASKS,
  REMOVE_ANALYX_TASK,
  STOP_ANALYX_TASK,
} from './graphql/analyxTaskQueries';

const StyledContentWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  padding: 60px 40px 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 20px 16px 80px;
  }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledFormArea = styled.div<{ $animating: 'out' | 'in' | null }>`
  align-self: center;
  display: flex;
  flex-direction: column;
  max-width: 1100px;
  width: 100%;
  ${({ $animating }) =>
    $animating === 'out'
      ? `animation: ${fadeOut} 250ms ease-out forwards;`
      : $animating === 'in'
        ? `animation: ${fadeIn} 300ms ease-out forwards;`
        : ''}
`;

const StyledHeader = styled.div`
  align-self: center;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 40px;
  text-align: center;
`;

const StyledPageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.color.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const AnalyxPage = () => {
  const { objectMetadataItems } = useObjectMetadataItems();
  const { getIcon } = useIcons();
  const { closeDropdown } = useCloseDropdown();
  const { enqueueSuccessSnackBar } = useSnackBar();
  const { enqueueDialog } = useDialogManager();

  // Agents
  const { data: agentsData } = useQuery<{ agents: NestboxAgent[] }>(
    GET_NESTBOX_AGENTS,
  );
  const agents = agentsData?.agents ?? [];

  // Analyx tasks from backend
  const { data: tasksData, refetch: refetchTasks } = useQuery<{
    analyxTasks: {
      id: string;
      name: string;
      prompt: string;
      status: string;
      input: Record<string, unknown>;
      result: Record<string, unknown> | null;
      errorMessage: string | null;
      fileId: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
  }>(GET_ANALYX_TASKS);
  const [createAnalyxTask] = useMutation(CREATE_ANALYX_TASK);
  const [stopAnalyxTask] = useMutation(STOP_ANALYX_TASK);
  const [archiveAnalyxTask] = useMutation(ARCHIVE_ANALYX_TASK);
  const [removeAnalyxTask] = useMutation(REMOVE_ANALYX_TASK);

  const apolloClient = useApolloClient();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [shakePrompt, setShakePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    uploaded: number;
    total: number;
  } | null>(null);
  const [contextType, setContextType] = useState<string>(
    CONTEXT_TYPE_OPTIONS[0],
  );
  const [contextObject, setContextObject] = useState<string | null>(null);
  const [selectedContexts, setSelectedContexts] = useState<SelectedContext[]>(
    [],
  );
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customMcpConnectors, setCustomMcpConnectors] = useState<
    CustomMcpConnector[]
  >([]);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [formAnimation, setFormAnimation] = useState<'out' | 'in' | null>(null);
  const [highlightTaskId, setHighlightTaskId] = useState<string | null>(null);

  // Skills state
  const [skills, setSkills] = useState<AnalyxCommand[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<AnalyxCommand | null>(
    null,
  );
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  // Workspace commands from operating model API
  const { commands: workspaceCommands } = useWorkspaceCommands();

  // Map backend status to UI TaskStatus
  const mapBackendStatus = useCallback((status: string): TaskStatus => {
    switch (status) {
      case 'processing':
        return 'Working';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      case 'stopped':
        return 'Stopped';
      case 'archived':
        return 'Archived';
      case 'reviewed':
        return 'Reviewed';
      default:
        return 'Working';
    }
  }, []);

  // Sync backend tasks into local state
  useEffect(() => {
    if (!tasksData?.analyxTasks) return;

    const backendTasks: Task[] = tasksData.analyxTasks.map((t) => {
      const scores = generateMockScores(t.id);
      const result = t.result as Record<string, unknown> | null;

      return {
        id: t.id,
        name: t.name,
        date: t.createdAt,
        type: getTaskType((t.input?.contextType as string) ?? 'document'),
        entities:
          (t.input?.entities as {
            name: string;
            objectName?: string;
            objectIcon?: string;
          }[]) ?? [],
        attachments:
          (t.input?.attachments as {
            name: string;
            type: string;
            size: number;
          }[]) ?? [],
        prompt: t.prompt,
        contextType: null,
        version: 'v1',
        messages: [],
        status: mapBackendStatus(t.status),
        tab:
          t.status === 'archived'
            ? ('Archive' as const)
            : t.status === 'reviewed'
              ? ('Reviewed' as const)
              : ('Tasks' as const),
        fileId: t.fileId,
        output: (result?.output as string) ?? null,
        outputFiles:
          (result?.outputFiles as {
            path: string;
            sizeBytes: number;
            mimeType: string;
            content: string;
          }[]) ?? [],
        f1Score: (result?.f1Score as number) ?? scores.f1,
        factCheckScore: (result?.factCheckScore as number) ?? scores.factCheck,
        runStats: result
          ? ({
              durationMs: result.durationMs
                ? Number(result.durationMs)
                : undefined,
              turns: result.turns as number | undefined,
              totalCostUsd: result.totalCostUsd as number | undefined,
              budgetUsd: result.budgetUsd as number | undefined,
              remainingBudgetUsd: result.remainingBudgetUsd as
                | number
                | undefined,
              cumulativeSessionCostUsd: result.cumulativeSessionCostUsd as
                | number
                | undefined,
            } satisfies TaskRunStats)
          : undefined,
        statusEvents: (result?.statusEvents as StatusEvent[]) ?? [],
        errorMessage: t.errorMessage ?? null,
      };
    });

    setTasks(backendTasks);
  }, [tasksData, mapBackendStatus]);

  // Poll every 5s while any task is processing
  useEffect(() => {
    const hasProcessing = tasks.some((t) => t.status === 'Working');

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      refetchTasks();
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, refetchTasks]);

  // Sync skills from API workspace commands
  useEffect(() => {
    setSkills(workspaceCommands);
  }, [workspaceCommands]);

  const contextObjectOptions: ContextObjectOption[] = objectMetadataItems
    .filter((item) => !item.isSystem && item.isActive)
    .map((item) => ({
      value: item.nameSingular,
      label: item.labelSingular,
      Icon: getIcon(item.icon ?? 'IconFolder') ?? IconFolder,
    }));

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId],
    );
  };

  const handleAddCustomMcp = (connector: CustomMcpConnector) => {
    setCustomMcpConnectors((prev) => [...prev, connector]);
  };

  const handleRemoveCustomMcp = (id: string) => {
    setCustomMcpConnectors((prev) => prev.filter((c) => c.id !== id));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > 40) {
        alert('You can only upload a maximum of 40 files.');
        return;
      }
      for (const file of newFiles) {
        if (file.size > 75 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 75MB allowed.`);
          return;
        }
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset the input value so the same file (or any file) can be
    // selected again on subsequent clicks — without this, the browser
    // skips firing onChange when the value hasn't changed.
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleMorphItemSelected = useRecoilCallback(
    ({ snapshot, set }) =>
      (item?: RecordPickerPickableMorphItem) => {
        if (!item?.recordId) return;

        const searchRecord = snapshot
          .getLoadable(searchRecordStoreFamilyState(item.recordId))
          .getValue();

        set(
          singleRecordPickerSearchFilterComponentState.atomFamily({
            instanceId: 'context-record-picker',
          }),
          '',
        );

        const objectMeta = objectMetadataItems.find(
          (m) => m.nameSingular === contextObject,
        );

        setSelectedContexts((prev) => {
          if (prev.some((c) => c.id === item.recordId)) return prev;
          return [
            ...prev,
            {
              id: item.recordId,
              name: searchRecord?.label ?? 'Unknown',
              objectName: objectMeta?.labelSingular ?? contextObject ?? '',
              objectNameSingular:
                objectMeta?.nameSingular ?? contextObject ?? '',
              objectIcon: objectMeta?.icon ?? 'IconFolder',
            },
          ];
        });

        closeDropdown('context-record-dropdown');
      },
    [objectMetadataItems, contextObject, closeDropdown],
  );

  const handleRemoveContext = (id: string) => {
    setSelectedContexts((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredSkills = skills.filter((skill) => {
    if (!skillSearchQuery) return true;
    const query = skillSearchQuery.toLowerCase();
    return (
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleAddSkill = (name: string, description: string) => {
    const newSkill: AnalyxCommand = {
      id: Date.now().toString(),
      name,
      description,
      tags: [],
      createdAt: new Date().toISOString(),
      isDefault: false,
    };
    setSkills((prev) => [...prev, newSkill]);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.filter((skill) => skill.id !== skillId || skill.isDefault),
    );
  };

  const handleUpdateSkill = (updatedSkill: AnalyxCommand) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill,
      ),
    );
    setSelectedSkill(updatedSkill);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setShakePrompt(true);
      setTimeout(() => setShakePrompt(false), 400);
      return;
    }

    setIsSubmitting(true);

    // Upload files to Twenty storage and collect references
    const attachmentPayloads: {
      name: string;
      type: string;
      size: number;
      fileId: string;
      path: string;
    }[] = [];

    if (files.length > 0) {
      setUploadProgress({ uploaded: 0, total: files.length });

      for (const file of files) {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_FILE,
          variables: { file },
        });
        const result = data?.createFile as
          | { id: string; path: string; size: number }
          | undefined;

        if (result) {
          attachmentPayloads.push({
            name: file.name,
            type: file.type,
            size: file.size,
            fileId: result.id,
            path: result.path,
          });
        }

        setUploadProgress((prev) =>
          prev ? { ...prev, uploaded: prev.uploaded + 1 } : null,
        );
      }

      setUploadProgress(null);
    }

    // Build entities payload
    const entitiesPayload = selectedContexts.map((ctx) => ({
      objectName: ctx.objectName,
      objectNameSingular: ctx.objectNameSingular,
      name: ctx.name,
      objectIcon: ctx.objectIcon,
      id: ctx.id,
    }));

    // Build agentIds payload
    const agentIdsPayload = selectedAgentIds.map((agentId) => ({
      ip: '136.113.51.250',
      apiKey: 'fd60d0b2-466b-41eb-821f-158fc9f56edd',
      agentId,
    }));

    // Start fade-out animation
    setFormAnimation('out');

    try {
      const { data } = await createAnalyxTask({
        variables: {
          input: {
            name: generateRandomTitle(prompt),
            prompt,
            contextType,
            entities: entitiesPayload,
            attachments: attachmentPayloads,
            agentIds: agentIdsPayload,
            customMcp:
              customMcpConnectors.length > 0
                ? customMcpConnectors.map((c) => ({
                    displayName: c.displayName,
                    transport: c.transport,
                    scope: c.scope,
                    description: c.description,
                    config: c.config,
                  }))
                : undefined,
          },
        },
      });

      const newTaskId = data?.createAnalyxTask?.id;

      await refetchTasks();

      if (newTaskId) {
        setHighlightTaskId(newTaskId);
        setTimeout(() => setHighlightTaskId(null), 4000);
      }
    } catch (error) {
      console.error('Failed to create analyx task:', error);
    }

    // Clear form after fade-out completes
    setTimeout(() => {
      setPrompt('');
      setContextType(CONTEXT_TYPE_OPTIONS[0]);
      setContextObject(null);
      setSelectedContexts([]);
      setSelectedAgentIds([]);
      setCustomMcpConnectors([]);
      setFiles([]);
      setIsSubmitting(false);
      setFormAnimation('in');
      setTimeout(() => setFormAnimation(null), 300);
    }, 250);
  };

  const handleStopTask = async (taskId: string) => {
    try {
      await stopAnalyxTask({ variables: { id: taskId } });
      refetchTasks();
    } catch (error) {
      console.error('Failed to stop analyx task:', error);
    }
  };

  const handleRemoveTask = (taskId: string) => {
    enqueueDialog({
      title: 'Discard task',
      message: 'Are you sure you want to discard this task?',
      buttons: [
        {
          title: 'Cancel',
          variant: 'secondary',
        },
        {
          title: 'Discard',
          variant: 'secondary',
          accent: 'danger',
          role: 'confirm',
          onClick: async () => {
            try {
              await removeAnalyxTask({ variables: { id: taskId } });
              refetchTasks();
            } catch (error) {
              console.error('Failed to remove analyx task:', error);
            }
          },
        },
      ],
    });
  };

  const handleMoveTask = async (taskId: string, newTab: TaskTab) => {
    try {
      if (newTab === 'Archive') {
        await archiveAnalyxTask({ variables: { id: taskId } });
      }
      // Optimistic local update while refetch happens
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            let newStatus = task.status;
            if (newTab === 'Reviewed') newStatus = 'Reviewed';
            else if (newTab === 'Archive') newStatus = 'Archived';
            return { ...task, tab: newTab, status: newStatus };
          }
          return task;
        }),
      );
      await refetchTasks();
    } catch (error) {
      console.error('Failed to update analyx task:', error);
    }

    if (newTab === 'Reviewed') {
      enqueueSuccessSnackBar({ message: 'Task marked as reviewed' });
    } else if (newTab === 'Archive') {
      enqueueSuccessSnackBar({ message: 'Task archived' });
    }

    closeDropdown(`task-menu-${taskId}`);
  };

  return (
    <PageContainer>
      <PageHeader title={'Analyx'} Icon={IconBrain} />
      <MainContainerLayoutWithCommandMenu>
        <StyledContentWrapper>
          <StyledHeader>
            <StyledPageTitle>What should we research next?</StyledPageTitle>
          </StyledHeader>

          <StyledFormArea $animating={formAnimation}>
            <AnalyxPromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              shakePrompt={shakePrompt}
              contextType={contextType}
              onContextTypeChange={setContextType}
              files={files}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              contextObjectOptions={contextObjectOptions}
              selectedContexts={selectedContexts}
              contextObject={contextObject}
              onContextObjectChange={setContextObject}
              selectedAgentIds={selectedAgentIds}
              agents={agents}
              onAgentToggle={handleAgentToggle}
              customMcpConnectors={customMcpConnectors}
              onAddCustomMcp={() => setIsMcpModalOpen(true)}
              onMorphItemSelected={handleMorphItemSelected}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              uploadProgress={uploadProgress}
              skills={skills}
            />

            <AnalyxCommandsBar
              skills={filteredSkills}
              searchQuery={skillSearchQuery}
              onSearchChange={setSkillSearchQuery}
              onSkillClick={setSelectedSkill}
              onAddSkillClick={() => setIsAddSkillOpen(true)}
            />

            <AnalyxChipsBar
              selectedContexts={selectedContexts}
              selectedAgentIds={selectedAgentIds}
              files={files}
              agents={agents}
              customMcpConnectors={customMcpConnectors}
              onRemoveContext={handleRemoveContext}
              onRemoveAgent={handleAgentToggle}
              onRemoveFile={handleRemoveFile}
              onRemoveCustomMcp={handleRemoveCustomMcp}
            />
          </StyledFormArea>

          <AnalyxTaskList
            tasks={tasks}
            activeTab={activeTab}
            searchQuery={searchQuery}
            highlightTaskId={highlightTaskId}
            onTabChange={setActiveTab}
            onSearchChange={setSearchQuery}
            onRemoveTask={handleRemoveTask}
            onMoveTask={handleMoveTask}
            onTaskClick={setSelectedTaskId}
          />
        </StyledContentWrapper>
      </MainContainerLayoutWithCommandMenu>

      <TaskDetailDrawer
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        task={tasks.find((t) => t.id === selectedTaskId) || null}
        onUpdateTask={(updatedTask) =>
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          )
        }
        onStopTask={handleStopTask}
      />

      <AnalyxCommandDetailPopup
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onDelete={handleDeleteSkill}
        onUpdate={handleUpdateSkill}
      />

      <AnalyxAddCommandForm
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSave={handleAddSkill}
      />

      <McpConnectorModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
        onSave={handleAddCustomMcp}
      />
    </PageContainer>
  );
};
