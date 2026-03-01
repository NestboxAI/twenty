import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { MainContainerLayoutWithCommandMenu } from '@/object-record/components/MainContainerLayoutWithCommandMenu';
import { searchRecordStoreFamilyState } from '@/object-record/record-picker/multiple-record-picker/states/searchRecordStoreComponentFamilyState';
import { singleRecordPickerSearchFilterComponentState } from '@/object-record/record-picker/single-record-picker/states/singleRecordPickerSearchFilterComponentState';
import { type RecordPickerPickableMorphItem } from '@/object-record/record-picker/types/RecordPickerPickableMorphItem';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import { GET_NESTBOX_AGENTS } from '@/workflow/workflow-steps/workflow-actions/nestbox-ai-agent-action/graphql/getNestboxAgents';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilCallback } from 'recoil';
import { IconBrain, IconFolder, useIcons } from 'twenty-ui/display';
import { DEFAULT_SKILLS } from './AnalyxDefaultSkills';
import {
  type AnalyxSkill,
  type NestboxAgent,
  type SelectedContext,
  type Task,
  type TaskTab,
} from './AnalyxTypes';
import {
  CONTEXT_TYPE_OPTIONS,
  generateMockScores,
  generateMockStatusEvents,
  generateMockTokenUsage,
  generateRandomTitle,
  getTaskType,
} from './AnalyxUtils';
import { AnalyxAddSkillForm } from './components/AnalyxAddSkillForm';
import { AnalyxChipsBar } from './components/AnalyxChipsBar';
import {
  AnalyxPromptInput,
  type ContextObjectOption,
} from './components/AnalyxPromptInput';
import { AnalyxSkillDetailPopup } from './components/AnalyxSkillDetailPopup';
import { AnalyxSkillsBar } from './components/AnalyxSkillsBar';
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
  @media (max-width: 768px) {
    padding: 20px 16px 80px;
  }
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

  // Agents
  const { data: agentsData } = useQuery<{ agents: NestboxAgent[] }>(
    GET_NESTBOX_AGENTS,
  );
  const agents = agentsData?.agents ?? [];

  // Form state
  const [prompt, setPrompt] = useState('');
  const [shakePrompt, setShakePrompt] = useState(false);
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [searchQuery, setSearchQuery] = useState('');

  // Skills state
  const [skills, setSkills] = useState<AnalyxSkill[]>([]);
  const [skillsInitialized, setSkillsInitialized] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<AnalyxSkill | null>(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('analyx-tasks');
    if (stored) {
      try {
        const parsedTasks = JSON.parse(stored);
        // Migrate old tasks: default missing fields
        const migratedTasks = parsedTasks.map((task: Task) => {
          const scores = generateMockScores(task.id);
          return {
            ...task,
            tab: task.tab || 'Tasks',
            documentVersions:
              task.documentVersions ||
              (() => {
                const base = new Date(task.date).getTime() || Date.now();
                return [
                  {
                    version: 1,
                    date: new Date(base - 47 * 60000).toISOString(),
                    summary: 'Initial draft',
                  },
                  {
                    version: 2,
                    date: new Date(base - 18 * 60000).toISOString(),
                    summary: 'Added sources & data tables',
                  },
                  {
                    version: 3,
                    date: new Date(base).toISOString(),
                    summary: 'Final review & formatting',
                  },
                ];
              })(),
            f1Score: task.f1Score ?? scores.f1,
            factCheckScore: task.factCheckScore ?? scores.factCheck,
            agentCount: task.agentCount ?? scores.agents,
            tokenUsage:
              task.tokenUsage ||
              generateMockTokenUsage(
                task.id,
                task.agentCount ?? scores.agents,
              ),
            statusEvents:
              task.statusEvents ||
              generateMockStatusEvents(task.id, task.prompt || ''),
          };
        });
        setTasks(migratedTasks);
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('analyx-tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
    }
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load skills from localStorage on mount, merging with latest DEFAULT_SKILLS
  useEffect(() => {
    const stored = localStorage.getItem('analyx-skills');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalyxSkill[];
        const defaultSkillMap = new Map(DEFAULT_SKILLS.map((s) => [s.id, s]));
        const storedIds = new Set(parsed.map((s) => s.id));

        // For default skills, always use the latest from code.
        // For user-edited or custom skills, keep the stored version.
        const merged = parsed.map((s) =>
          s.isDefault && defaultSkillMap.has(s.id)
            ? defaultSkillMap.get(s.id)!
            : s,
        );

        // Add any new default skills that weren't in localStorage yet
        for (const ds of DEFAULT_SKILLS) {
          if (!storedIds.has(ds.id)) {
            merged.push(ds);
          }
        }

        setSkills(merged);
      } catch (e) {
        console.error('Failed to parse stored skills:', e);
        setSkills(DEFAULT_SKILLS);
      }
    } else {
      setSkills(DEFAULT_SKILLS);
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
    const newSkill: AnalyxSkill = {
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

  const handleUpdateSkill = (updatedSkill: AnalyxSkill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill,
      ),
    );
    setSelectedSkill(updatedSkill);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setShakePrompt(true);
      setTimeout(() => setShakePrompt(false), 400);
      return;
    }

    const taskId = Date.now().toString();
    const now = new Date();
    const isoDate = now.toISOString();
    const scores = generateMockScores(taskId);

    const newTask: Task = {
      id: taskId,
      name: generateRandomTitle(prompt, contextType || 'task'),
      date: isoDate,
      type: getTaskType(contextType || 'task'),
      entities: selectedContexts.map((ctx) => ({
        name: ctx.name,
        objectName: ctx.objectName,
        objectIcon: ctx.objectIcon,
      })),
      status: 'Processing',
      tab: 'Tasks',
      attachments: files.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      })),
      prompt: prompt,
      contextType: contextType,
      version: 'v1',
      messages: [],
      documentVersions: [
        {
          version: 1,
          date: new Date(now.getTime() - 47 * 60000).toISOString(),
          summary: 'Initial draft',
        },
        {
          version: 2,
          date: new Date(now.getTime() - 18 * 60000).toISOString(),
          summary: 'Added sources & data tables',
        },
        {
          version: 3,
          date: isoDate,
          summary: 'Final review & formatting',
        },
      ],
      f1Score: scores.f1,
      factCheckScore: scores.factCheck,
      agentCount: scores.agents,
      tokenUsage: generateMockTokenUsage(taskId, scores.agents),
      statusEvents: generateMockStatusEvents(taskId, prompt),
    };

    setTasks((prev) => [newTask, ...prev]);

    setTimeout(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === newTask.id ? { ...task, status: 'Ready' } : task,
        ),
      );
    }, 10000);

    setPrompt('');
    setContextType(CONTEXT_TYPE_OPTIONS[0]);
    setContextObject(null);
    setSelectedContexts([]);
    setSelectedAgentIds([]);
    setFiles([]);
  };

  const handleRemoveTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to discard this task?')) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  const handleMoveTask = (taskId: string, newTab: TaskTab) => {
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
            skills={skills}
          />

          <AnalyxSkillsBar
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

          <AnalyxTaskList
            tasks={tasks}
            activeTab={activeTab}
            searchQuery={searchQuery}
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
      />

      <AnalyxSkillDetailPopup
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onDelete={handleDeleteSkill}
        onUpdate={handleUpdateSkill}
      />

      <AnalyxAddSkillForm
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSave={handleAddSkill}
      />
    </PageContainer>
  );
};
