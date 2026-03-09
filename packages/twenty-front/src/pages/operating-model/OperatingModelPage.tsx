import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
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
import { useOperatingModelCounts } from './hooks/useOperatingModelCounts';
import { useOperatingModelFiles } from './hooks/useOperatingModelFiles';
import { useOperatingModelHistory } from './hooks/useOperatingModelHistory';
import { useOperatingModelMutations } from './hooks/useOperatingModelMutations';
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

export const OperatingModelPage = () => {
  const {
    enqueueSuccessSnackBar,
    enqueueInfoSnackBar,
    enqueueErrorSnackBar,
  } = useSnackBar();
  const { enqueueDialog } = useDialogManager();
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

  // Full mutable tree per tab, populated from API
  const [tabTrees, setTabTrees] = useState<Map<ModelTab, FileNode[]>>(
    () => new Map(),
  );

  // Panel state
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // ── API hooks ──────────────────────────────────────────
  const { tree: apiTree, loading: filesLoading, refetch: refetchFiles } =
    useOperatingModelFiles(activeTab);
  const { versions, refetch: refetchHistory } = useOperatingModelHistory();
  const {
    saveFiles,
    deleteFile: deleteFileApi,
    apply,
    loading: mutationLoading,
  } = useOperatingModelMutations();

  // Sync API tree into tabTrees when API data arrives
  useEffect(() => {
    if (activeTab !== 'overview') {
      setTabTrees((prev) => {
        const next = new Map(prev);
        next.set(activeTab, apiTree);
        return next;
      });
    }
  }, [apiTree, activeTab]);

  // Get tree for active tab (empty array if not yet loaded)
  const nodesForTab = useMemo<FileNode[]>(() => {
    return tabTrees.get(activeTab) ?? [];
  }, [activeTab, tabTrees]);

  // Get the current tree for a tab (returns existing or empty)
  const getMutableTree = useCallback(
    (_tab: ModelTab, trees: Map<ModelTab, FileNode[]>): FileNode[] => {
      return trees.get(_tab) ?? [];
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

  // Fetch file counts per tab independently (works even on overview tab)
  const { counts: tabCounts } = useOperatingModelCounts();

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

  // Save all edited files to backend
  const handleSave = useCallback(async () => {
    if (editedContent.size === 0) return;
    const files: { path: string; content: string }[] = [];
    const findPath = (nodes: FileNode[], id: string): string | null => {
      for (const n of nodes) {
        if (n.id === id) return n.path;
        if (n.children) {
          const p = findPath(n.children, id);
          if (p) return p;
        }
      }
      return null;
    };
    for (const [fileId, content] of editedContent.entries()) {
      const path = findPath(nodesForTab, fileId);
      if (path) files.push({ path, content });
    }
    if (files.length === 0) return;
    try {
      const result = await saveFiles(files);
      if (result?.success) {
        setEditedContent(new Map());
        refetchFiles();
        refetchHistory();
        enqueueSuccessSnackBar({ message: 'Files saved' });
      } else {
        enqueueErrorSnackBar({ message: result?.error ?? 'Save failed' });
      }
    } catch (e) {
      enqueueErrorSnackBar({ message: 'Save failed' });
    }
  }, [editedContent, nodesForTab, saveFiles, refetchFiles, refetchHistory, enqueueSuccessSnackBar, enqueueErrorSnackBar]);

  const handleApply = useCallback(() => {
    enqueueDialog({
      title: 'Apply Operating Model',
      message:
        'This will deploy the current model to your workspace agent. Continue?',
      buttons: [
        { title: 'Cancel' },
        {
          title: 'Apply',
          variant: 'primary',
          onClick: async () => {
            try {
              // Save any pending edits first
              if (editedContent.size > 0) {
                await handleSave();
              }
              const result = await apply();
              if (result?.success) {
                refetchHistory();
                enqueueSuccessSnackBar({ message: 'Model applied successfully' });
              } else {
                enqueueErrorSnackBar({
                  message: result?.error ?? 'Apply failed',
                });
              }
            } catch {
              enqueueErrorSnackBar({ message: 'Apply failed' });
            }
          },
        },
      ],
    });
  }, [enqueueDialog, editedContent, handleSave, apply, refetchHistory, enqueueSuccessSnackBar, enqueueErrorSnackBar]);

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

  // Remove selected file from tree (and delete via API)
  const handleRemoveFile = useCallback(async () => {
    if (!selectedFile) return;
    const removedName = selectedFile.name;
    // Delete from backend
    try {
      await deleteFileApi(selectedFile.path);
    } catch {
      // Continue with local removal even if API fails
    }
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
    refetchHistory();
    enqueueInfoSnackBar({ message: `Removed ${removedName}` });
  }, [selectedFile, activeTab, getMutableTree, deleteFileApi, refetchHistory, enqueueInfoSnackBar]);

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
            {editedContent.size > 0 && (
              <ActionButton onClick={handleSave} disabled={mutationLoading.saving}>
                {mutationLoading.saving ? 'Saving...' : 'Save'}
              </ActionButton>
            )}
            <ActionButton
              $primary
              onClick={handleApply}
              disabled={mutationLoading.applying}
            >
              <IconPlayerPlay size={14} />
              {mutationLoading.applying ? 'Applying...' : 'Apply'}
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
                  versions={versions}
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
