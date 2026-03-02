import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { MainContainerLayoutWithCommandMenu } from '@/object-record/components/MainContainerLayoutWithCommandMenu';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import styled from '@emotion/styled';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IconPlayerPlay, IconSitemap } from 'twenty-ui/display';
import {
  type FileNode,
  type ModelTab,
  type ValidationItem,
  type ValidationStatus,
} from './OperatingModelTypes';
import { ComponentTree } from './components/ComponentTree';
import { EditorPanel } from './components/EditorPanel';
import { RightPanel } from './components/RightPanel';
import { OverviewPanel } from './components/OverviewPanel';
import { ThreePanelLayout } from './components/ThreePanelLayout';
import { AGENT_STUBS } from './stubs/agentStubs';
import { COMMAND_STUBS } from './stubs/commandStubs';
import { HOOK_STUBS } from './stubs/hookStubs';
import { SKILL_STUBS } from './stubs/skillStubs';
import {
  createBareFile,
  createBareFolder,
  findFirstFileInTree,
} from './utils/itemTemplates';
import { validateFileContent } from './utils/validateContent';

const StyledContent = styled.div`
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
  gap: 0;
  padding: 0 16px;
`;

const TabSpacer = styled.div`
  flex: 1;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  align-items: center;
  background: ${({ $primary, theme }) =>
    $primary ? theme.color.blue : theme.background.secondary};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.color.blue : theme.border.color.medium};
  border-radius: 6px;
  color: ${({ $primary, theme }) =>
    $primary ? 'white' : theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  margin-left: 8px;
  padding: 5px 12px;

  &:hover {
    opacity: 0.9;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.color.blue : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? theme.color.blue : theme.font.color.tertiary};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  margin-bottom: -1px;
  padding: 10px 20px;
  transition: color 0.15s;

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.color.blue : theme.font.color.secondary};
  }
`;

const TAB_CONFIG: { key: ModelTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'commands', label: 'Control' },
  { key: 'skills', label: 'Skills' },
  { key: 'agents', label: 'Automation' },
  { key: 'hooks', label: 'Process Flows' },
];

const findFile = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFile(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const STUBS_BY_TAB: Record<ModelTab, FileNode[]> = {
  overview: [],
  commands: COMMAND_STUBS,
  skills: SKILL_STUBS,
  agents: AGENT_STUBS,
  hooks: HOOK_STUBS,
};

export const OperatingModelPage = () => {
  const { enqueueSuccessSnackBar, enqueueInfoSnackBar } = useSnackBar();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  // Core state
  const [activeTab, setActiveTab] = useState<ModelTab>('overview');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Map<string, string>>(
    () => new Map(),
  );
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([]);
  const [fileStatuses, setFileStatuses] = useState<
    Map<string, ValidationStatus>
  >(() => new Map());
  const [highlightLine, setHighlightLine] = useState<number | null>(null);

  // Full mutable tree per tab, lazily initialized from stubs
  const [tabTrees, setTabTrees] = useState<Map<ModelTab, FileNode[]>>(
    () => new Map(),
  );

  // Panel state
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Get or initialize tree for active tab
  const nodesForTab = useMemo<FileNode[]>(() => {
    return tabTrees.get(activeTab) ?? STUBS_BY_TAB[activeTab];
  }, [activeTab, tabTrees]);

  // Ensure the tab tree is mutable (deep-clone stubs on first mutation)
  const getMutableTree = useCallback(
    (tab: ModelTab, trees: Map<ModelTab, FileNode[]>): FileNode[] => {
      const existing = trees.get(tab);
      if (existing) return existing;
      return JSON.parse(JSON.stringify(STUBS_BY_TAB[tab])) as FileNode[];
    },
    [],
  );

  // Auto-select first file when none is selected
  useEffect(() => {
    if (!selectedFileId) {
      const first = findFirstFileInTree(nodesForTab);
      if (first) {
        setSelectedFileId(first.id);
      }
    }
  }, [nodesForTab, selectedFileId]);

  const selectedFile = useMemo(
    () => (selectedFileId ? findFile(nodesForTab, selectedFileId) : null),
    [selectedFileId, nodesForTab],
  );

  const currentContent = useMemo(() => {
    if (!selectedFile) return '';
    return editedContent.get(selectedFile.id) ?? selectedFile.content ?? '';
  }, [selectedFile, editedContent]);

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedFile) return false;
    const edited = editedContent.get(selectedFile.id);
    if (edited === undefined) return false;
    return edited !== (selectedFile.content ?? '');
  }, [selectedFile, editedContent]);

  // Compute file counts per tab for the overview
  const tabCounts = useMemo(() => {
    const countFiles = (nodes: FileNode[]): number =>
      nodes.reduce((sum, node) => {
        if (node.type === 'file') return sum + 1;
        return sum + (node.children ? countFiles(node.children) : 0);
      }, 0);

    const tabs: ModelTab[] = ['commands', 'skills', 'agents', 'hooks'];
    const counts: Record<string, number> = {};
    for (const tab of tabs) {
      const tree = tabTrees.get(tab) ?? STUBS_BY_TAB[tab];
      counts[tab] = countFiles(tree);
    }
    return counts;
  }, [tabTrees]);

  // Validate only the selected file (on selection or content change)
  useEffect(() => {
    if (!selectedFile) {
      setValidationItems([]);
      return;
    }
    const items = validateFileContent(selectedFile, currentContent, activeTab);
    setValidationItems(items);

    const status: ValidationStatus = items.some(
      (i) => i.severity === 'error',
    )
      ? 'invalid'
      : items.length > 0
        ? 'warning'
        : 'ok';

    setFileStatuses((prev) => {
      if (prev.get(selectedFile.id) === status) return prev;
      const next = new Map(prev);
      next.set(selectedFile.id, status);
      return next;
    });
  }, [selectedFile, currentContent, activeTab]);

  // Handlers
  const handleContentChange = (content: string) => {
    if (!selectedFile) return;
    setEditedContent((prev) => {
      const next = new Map(prev);
      next.set(selectedFile.id, content);
      return next;
    });
  };

  const handleSelectFile = (node: FileNode) => {
    if (node.type === 'file') {
      setSelectedFileId(node.id);
      setHighlightLine(null);
    }
  };

  const handleRevert = useCallback(() => {
    if (!selectedFile) return;
    setEditedContent((prev) => {
      const next = new Map(prev);
      next.delete(selectedFile.id);
      return next;
    });
    enqueueInfoSnackBar({ message: 'Reverted to saved content' });
  }, [selectedFile, enqueueInfoSnackBar]);

  const handleValidationClick = useCallback(
    (file: string, line?: number) => {
      const findByPath = (nodeList: FileNode[]): FileNode | null => {
        for (const node of nodeList) {
          if (node.path === file) return node;
          if (node.children) {
            const found = findByPath(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const targetFile = findByPath(nodesForTab);
      if (targetFile) {
        setSelectedFileId(targetFile.id);
        setHighlightLine(line ?? null);
      }
    },
    [nodesForTab],
  );

  const handleApply = useCallback(() => {
    enqueueSuccessSnackBar({ message: 'Model applied successfully' });
  }, [enqueueSuccessSnackBar]);

  // Insert a node into the tree at a given parent
  const insertNode = useCallback(
    (newNode: FileNode, parentId: string | null) => {
      setTabTrees((prev) => {
        const next = new Map(prev);
        const tree = getMutableTree(activeTab, prev);
        if (parentId) {
          const insertIntoParent = (nodeList: FileNode[]): FileNode[] =>
            nodeList.map((n) => {
              if (n.id === parentId) {
                return { ...n, children: [...(n.children ?? []), newNode] };
              }
              if (n.children) {
                return { ...n, children: insertIntoParent(n.children) };
              }
              return n;
            });
          next.set(activeTab, insertIntoParent(tree));
        } else {
          next.set(activeTab, [...tree, newNode]);
        }
        return next;
      });
    },
    [activeTab, getMutableTree],
  );

  // Find parent path from parentId
  const getParentPath = useCallback(
    (parentId: string | null): string | null => {
      if (!parentId) return null;
      const node = findFile(nodesForTab, parentId);
      return node?.path ?? null;
    },
    [nodesForTab],
  );

  // Inline create: file
  const handleCreateFile = useCallback(
    (name: string, parentId: string | null) => {
      const parentPath = getParentPath(parentId);
      const newNode = createBareFile(name, parentPath);
      insertNode(newNode, parentId);
      setSelectedFileId(newNode.id);
      enqueueSuccessSnackBar({ message: `Created ${name}` });
    },
    [getParentPath, insertNode, enqueueSuccessSnackBar],
  );

  // Inline create: folder
  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null) => {
      const parentPath = getParentPath(parentId);
      const newNode = createBareFolder(name, parentPath);
      insertNode(newNode, parentId);
      enqueueSuccessSnackBar({ message: `Created folder ${name}` });
    },
    [getParentPath, insertNode, enqueueSuccessSnackBar],
  );

  // Remove selected file from tree
  const handleRemoveFile = useCallback(() => {
    if (!selectedFile) return;
    const removedName = selectedFile.name;
    setTabTrees((prev) => {
      const next = new Map(prev);
      const tree = getMutableTree(activeTab, prev);
      const removeFromList = (nodeList: FileNode[]): FileNode[] =>
        nodeList
          .filter((n) => n.id !== selectedFile.id)
          .map((n) =>
            n.children
              ? { ...n, children: removeFromList(n.children) }
              : n,
          );
      next.set(activeTab, removeFromList(tree));
      return next;
    });
    setSelectedFileId(null);
    setEditedContent((prev) => {
      const next = new Map(prev);
      next.delete(selectedFile.id);
      return next;
    });
    enqueueInfoSnackBar({ message: `Removed ${removedName}` });
  }, [selectedFile, activeTab, getMutableTree, enqueueInfoSnackBar]);

  return (
    <PageContainer>
      <PageHeader title="Operating Model" Icon={IconSitemap} />
      <MainContainerLayoutWithCommandMenu>
        <StyledContent>
          <TabBar>
            {TAB_CONFIG.map((tab) => (
              <TabButton
                key={tab.key}
                $active={activeTab === tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedFileId(null);
                  setFileStatuses(new Map());
                }}
              >
                {tab.label}
              </TabButton>
            ))}
            <TabSpacer />
            <ActionButton $primary onClick={handleApply}>
              <IconPlayerPlay size={14} />
              Apply
            </ActionButton>
          </TabBar>
          {activeTab === 'overview' ? (
            <OverviewPanel
              workspaceName={currentWorkspace?.displayName ?? 'Workspace'}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setSelectedFileId(null);
                setFileStatuses(new Map());
              }}
              tabCounts={tabCounts}
            />
          ) : (
            <ThreePanelLayout
              rightOpen={rightPanelOpen}
              onToggleRight={() => setRightPanelOpen((prev) => !prev)}
              leftPanel={
                <ComponentTree
                  nodes={nodesForTab}
                  activeTab={activeTab}
                  selectedFileId={selectedFileId}
                  fileStatuses={fileStatuses}
                  onSelectFile={handleSelectFile}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                />
              }
              mainPanel={
                <EditorPanel
                  file={selectedFile}
                  content={currentContent}
                  onContentChange={handleContentChange}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onRevert={handleRevert}
                  onRemove={handleRemoveFile}
                  highlightLine={highlightLine}
                  activeTab={activeTab}
                  nodes={nodesForTab}
                />
              }
              rightPanel={
                <RightPanel
                  activeTab={activeTab}
                  selectedFile={selectedFile}
                  validationItems={validationItems}
                  nodes={nodesForTab}
                  onValidationClick={handleValidationClick}
                  onCollapse={() => setRightPanelOpen(false)}
                />
              }
            />
          )}
        </StyledContent>
      </MainContainerLayoutWithCommandMenu>
    </PageContainer>
  );
};
