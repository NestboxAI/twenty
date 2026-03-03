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
import { useMutation, useQuery } from '@apollo/client';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilCallback } from 'recoil';
import { IconBrain, IconFolder, useIcons } from 'twenty-ui/display';
import { DEFAULT_COMMANDS } from './AnalyxDefaultCommands';
import {
  ARCHIVE_ANALYX_TASK,
  CREATE_ANALYX_TASK,
  GET_ANALYX_TASKS,
  REMOVE_ANALYX_TASK,
  STOP_ANALYX_TASK,
} from './graphql/analyxTaskQueries';
import {
  type AnalyxCommand,
  type NestboxAgent,
  type SelectedContext,
  type StatusEvent,
  type Task,
  type TaskStatus,
  type TaskTab,
  type TokenUsage,
} from './AnalyxTypes';
import {
  CONTEXT_TYPE_OPTIONS,
  generateMockScores,
  generateMockStatusEvents,
  generateMockTokenUsage,
  generateRandomTitle,
} from './AnalyxUtils';
import { AnalyxAddCommandForm } from './components/AnalyxAddCommandForm';
import { AnalyxChipsBar } from './components/AnalyxChipsBar';
import {
  AnalyxPromptInput,
  type ContextObjectOption,
} from './components/AnalyxPromptInput';
import { AnalyxCommandDetailPopup } from './components/AnalyxCommandDetailPopup';
import { AnalyxCommandsBar } from './components/AnalyxCommandsBar';
import { AnalyxTaskList } from './components/AnalyxTaskList';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';

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

  // Form state
  const [prompt, setPrompt] = useState('');
  const [shakePrompt, setShakePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [formAnimation, setFormAnimation] = useState<'out' | 'in' | null>(null);
  const [highlightTaskId, setHighlightTaskId] = useState<string | null>(null);

  // Skills state
  const [skills, setSkills] = useState<AnalyxCommand[]>([]);
  const [skillsInitialized, setSkillsInitialized] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<AnalyxCommand | null>(
    null,
  );
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  // Map backend status to UI TaskStatus
  const mapBackendStatus = useCallback((status: string): TaskStatus => {
    switch (status) {
      case 'processing':
        return 'Working';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Ready';
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
        type: 'task' as const,
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
        agentCount: (result?.agentCount as number) ?? scores.agents,
        tokenUsage:
          (result?.tokenUsage as TokenUsage) ??
          generateMockTokenUsage(t.id, scores.agents),
        statusEvents:
          (result?.statusEvents as StatusEvent[]) ??
          generateMockStatusEvents(t.id, t.prompt),
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

  // Load skills from localStorage on mount, merging with latest DEFAULT_COMMANDS
  useEffect(() => {
    const stored = localStorage.getItem('analyx-skills');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalyxCommand[];
        const defaultSkillMap = new Map(DEFAULT_COMMANDS.map((s) => [s.id, s]));
        const storedIds = new Set(parsed.map((s) => s.id));

        // For default skills, always use the latest from code.
        // For user-edited or custom skills, keep the stored version.
        const merged = parsed.map((s) =>
          s.isDefault && defaultSkillMap.has(s.id)
            ? defaultSkillMap.get(s.id)!
            : s,
        );

        // Add any new default skills that weren't in localStorage yet
        for (const ds of DEFAULT_COMMANDS) {
          if (!storedIds.has(ds.id)) {
            merged.push(ds);
          }
        }

        setSkills(merged);
      } catch (e) {
        console.error('Failed to parse stored skills:', e);
        setSkills(DEFAULT_COMMANDS);
      }
    } else {
      setSkills(DEFAULT_COMMANDS);
    }
    setSkillsInitialized(true);
  }, []);

  // Save skills to localStorage whenever they change
  useEffect(() => {
    if (!skillsInitialized) return;
    try {
      localStorage.setItem('analyx-skills', JSON.stringify(skills));
    } catch (e) {
      console.error('Failed to save skills to localStorage:', e);
    }
  }, [skills]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > 40) {
        alert('You can only upload a maximum of 40 files.');
        return;
      }
      for (const file of newFiles) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 10MB allowed.`);
          return;
        }
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
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

    // Convert File objects to base64 for the mutation
    const attachmentPayloads = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        return {
          name: file.name,
          type: file.type,
          size: file.size,
          content: base64,
        };
      }),
    );

    // Build entities payload
    const entitiesPayload = selectedContexts.map((ctx) => ({
      objectName: ctx.objectName,
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
            name: generateRandomTitle(prompt, contextType || 'task'),
            prompt,
            contextType,
            entities: entitiesPayload,
            attachments: attachmentPayloads,
            agentIds: agentIdsPayload,
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
              onMorphItemSelected={handleMorphItemSelected}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
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
              onRemoveContext={handleRemoveContext}
              onRemoveAgent={handleAgentToggle}
              onRemoveFile={handleRemoveFile}
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
    </PageContainer>
  );
};
