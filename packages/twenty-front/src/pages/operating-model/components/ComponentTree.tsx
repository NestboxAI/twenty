import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconFolderPlus,
  IconJson,
  IconPlus,
  IconSearch,
} from 'twenty-ui/display';
import {
  type FileNode,
  type ModelTab,
  type ValidationStatus,
} from '../OperatingModelTypes';

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const TreeToolbar = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
`;

const ToolbarRow = styled.div`
  align-items: center;
  display: flex;
  gap: 6px;
`;

const SearchInput = styled.input`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-size: 12px;
  outline: none;
  padding: 5px 8px;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }

  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
  }
`;

const ToolbarButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.color.blue};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  padding: 5px 6px;

  &:hover {
    opacity: 0.9;
  }
`;

const TreeContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const TreeNode = styled.div<{ $depth: number; $selected: boolean }>`
  align-items: center;
  background: ${({ $selected, theme }) =>
    $selected ? theme.background.transparent.light : 'transparent'};
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 4px;
  padding: 4px 12px 4px ${({ $depth }) => 12 + $depth * 16}px;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const NodeName = styled.span<{ $warn?: boolean }>`
  color: ${({ $warn, theme }) => ($warn ? '#FF9800' : theme.font.color.primary)};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ErrBadge = styled.span`
  background: rgba(244, 67, 54, 0.1);
  border-radius: 3px;
  color: #f44336;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 1px 4px;
  text-transform: uppercase;
`;

const InlineInputRow = styled.div<{ $depth: number }>`
  align-items: center;
  display: flex;
  gap: 4px;
  padding: 3px 12px 3px ${({ $depth }) => 12 + $depth * 16}px;
`;

const InlineInput = styled.input`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.color.blue};
  border-radius: 3px;
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 12px;
  outline: none;
  padding: 3px 6px;
`;

type CreatingState = {
  kind: 'file' | 'folder';
  parentId: string | null;
} | null;

const FileIcon = ({ format }: { format?: string }) => {
  if (format === 'json') return <IconJson size={14} />;
  if (format === 'md') return <IconFileText size={14} />;
  return <IconFile size={14} />;
};

type ComponentTreeProps = {
  nodes: FileNode[];
  activeTab: ModelTab;
  selectedFileId: string | null;
  fileStatuses?: Map<string, ValidationStatus>;
  onSelectFile: (node: FileNode) => void;
  onCreateFile?: (name: string, parentId: string | null) => void;
  onCreateFolder?: (name: string, parentId: string | null) => void;
};

export const ComponentTree = ({
  nodes,
  activeTab,
  selectedFileId,
  fileStatuses,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
}: ComponentTreeProps) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(nodes.map((n) => n.id)),
  );
  const [creating, setCreating] = useState<CreatingState>(null);
  const [newName, setNewName] = useState('');
  const inlineInputRef = useRef<HTMLInputElement>(null);

  // Auto-expand all directory nodes when tree data loads
  useEffect(() => {
    if (nodes.length > 0) {
      const allDirIds = new Set<string>();
      const collectDirs = (nodeList: FileNode[]) => {
        for (const node of nodeList) {
          if (node.type === 'directory') {
            allDirIds.add(node.id);
            if (node.children) collectDirs(node.children);
          }
        }
      };
      collectDirs(nodes);
      setExpanded(allDirIds);
    }
  }, [nodes]);

  useEffect(() => {
    if (creating && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [creating]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const matchesSearch = (node: FileNode): boolean => {
    if (!search) return true;
    const lower = search.toLowerCase();
    if (node.name.toLowerCase().includes(lower)) return true;
    if (node.content?.toLowerCase().includes(lower)) return true;
    if (node.children?.some(matchesSearch)) return true;
    return false;
  };

  // Find the selected directory context for creating new items
  const getSelectedParentId = (): string | null => {
    if (!selectedFileId) return null;
    const findNode = (nodeList: FileNode[]): FileNode | null => {
      for (const node of nodeList) {
        if (node.id === selectedFileId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const selected = findNode(nodes);
    if (!selected) return null;
    if (selected.type === 'directory') return selected.id;
    // Find parent directory
    const findParent = (nodeList: FileNode[], targetId: string): string | null => {
      for (const node of nodeList) {
        if (node.children?.some((c) => c.id === targetId)) return node.id;
        if (node.children) {
          const found = findParent(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    return findParent(nodes, selected.id);
  };

  const startCreate = (kind: 'file' | 'folder') => {
    const parentId = getSelectedParentId();
    if (parentId) {
      setExpanded((prev) => new Set([...prev, parentId]));
    }
    setCreating({ kind, parentId });
    setNewName('');
  };

  const confirmCreate = () => {
    if (!creating || !newName.trim()) {
      setCreating(null);
      return;
    }
    const name = newName.trim();
    if (creating.kind === 'file') {
      const fileName = name.includes('.') ? name : `${name}.md`;
      onCreateFile?.(fileName, creating.parentId);
    } else {
      onCreateFolder?.(name, creating.parentId);
    }
    setCreating(null);
    setNewName('');
  };

  const cancelCreate = () => {
    setCreating(null);
    setNewName('');
  };

  const renderInlineInput = (depth: number) => {
    if (!creating) return null;
    return (
      <InlineInputRow $depth={depth}>
        {creating.kind === 'folder' ? (
          <IconFolder size={14} />
        ) : (
          <IconFile size={14} />
        )}
        <InlineInput
          ref={inlineInputRef}
          placeholder={
            creating.kind === 'folder'
              ? 'folder-name'
              : 'file name'
          }
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmCreate();
            if (e.key === 'Escape') cancelCreate();
          }}
          onBlur={confirmCreate}
        />
      </InlineInputRow>
    );
  };

  const sortNodes = (nodeList: FileNode[]): FileNode[] =>
    [...nodeList].sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });

  const renderNode = (node: FileNode, depth: number) => {
    if (!matchesSearch(node)) return null;

    const isDir = node.type === 'directory';
    const isExpanded = expanded.has(node.id);
    const status = fileStatuses?.get(node.id);
    const isWarn = status === 'warning' || status === 'invalid';

    return (
      <div key={node.id}>
        <TreeNode
          $depth={depth}
          $selected={selectedFileId === node.id}
          onClick={() => {
            if (isDir) {
              toggleExpand(node.id);
            } else {
              onSelectFile(node);
            }
          }}
        >
          {isDir ? (
            isExpanded ? (
              <IconChevronDown size={12} />
            ) : (
              <IconChevronRight size={12} />
            )
          ) : (
            <span style={{ width: 12 }} />
          )}
          {isDir ? (
            isExpanded ? (
              <IconFolderOpen size={14} />
            ) : (
              <IconFolder size={14} />
            )
          ) : (
            <FileIcon format={node.format} />
          )}
          <NodeName $warn={isWarn}>{node.name}</NodeName>
          {status === 'invalid' && <ErrBadge>Err</ErrBadge>}
        </TreeNode>
        {isDir && isExpanded && (
          <>
            {sortNodes(node.children ?? []).map((c) => renderNode(c, depth + 1))}
            {creating && creating.parentId === node.id && renderInlineInput(depth + 1)}
          </>
        )}
      </div>
    );
  };

  return (
    <TreeContainer>
      <TreeToolbar>
        <ToolbarRow>
          <IconSearch size={14} />
          <SearchInput
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ToolbarButton onClick={() => startCreate('file')} title="New file">
            <IconPlus size={12} />
          </ToolbarButton>
          <ToolbarButton onClick={() => startCreate('folder')} title="New folder">
            <IconFolderPlus size={12} />
          </ToolbarButton>
        </ToolbarRow>
      </TreeToolbar>
      <TreeContent>
        {sortNodes(nodes).map((node) => renderNode(node, 0))}
        {creating && creating.parentId === null && renderInlineInput(0)}
      </TreeContent>
    </TreeContainer>
  );
};
