import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { type FileNode, type ModelTab } from '../OperatingModelTypes';
import { GET_OPERATING_MODEL_FILES } from '../graphql/operatingModelQueries';

type FlatFile = {
  path: string;
  content: string;
  format?: string;
};

/**
 * Build a FileNode tree from a flat list of {path, content, format} objects.
 * Paths are relative to `claude-plugin/` (e.g. "commands/go.md").
 */
function buildTree(files: FlatFile[]): FileNode[] {
  const root: FileNode[] = [];
  const dirMap = new Map<string, FileNode>();

  // Sort so parents are created before children
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sorted) {
    const parts = file.path.split('/');
    const fileName = parts[parts.length - 1];

    // Ensure all ancestor directories exist
    for (let i = 1; i < parts.length; i++) {
      const dirPath = parts.slice(0, i).join('/');

      if (!dirMap.has(dirPath)) {
        const dirNode: FileNode = {
          id: `dir-${dirPath}`,
          name: parts[i - 1],
          path: dirPath,
          type: 'directory',
          children: [],
        };
        dirMap.set(dirPath, dirNode);

        // Attach to parent dir or root
        if (i > 1) {
          const parentPath = parts.slice(0, i - 1).join('/');
          const parent = dirMap.get(parentPath);

          if (parent) {
            parent.children = parent.children ?? [];
            parent.children.push(dirNode);
          }
        } else {
          root.push(dirNode);
        }
      }
    }

    // Create file node
    const ext = fileName.includes('.')
      ? (fileName.split('.').pop() as 'md' | 'json' | undefined)
      : undefined;
    const fileNode: FileNode = {
      id: `file-${file.path}`,
      name: fileName,
      path: file.path,
      type: 'file',
      format: ext === 'md' || ext === 'json' ? ext : undefined,
      content: file.content,
    };

    // Attach to parent dir or root
    if (parts.length > 1) {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = dirMap.get(parentPath);

      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(fileNode);
      }
    } else {
      root.push(fileNode);
    }
  }

  return root;
}

/** Map frontend ModelTab to the backend ModelTab enum value */
function toBackendTab(
  tab: ModelTab,
): 'COMMANDS' | 'SKILLS' | 'AGENTS' | 'HOOKS' | null {
  switch (tab) {
    case 'commands':
      return 'COMMANDS';
    case 'skills':
      return 'SKILLS';
    case 'agents':
      return 'AGENTS';
    case 'hooks':
      return 'HOOKS';
    default:
      return null;
  }
}

export function useOperatingModelFiles(tab: ModelTab) {
  const backendTab = toBackendTab(tab);

  const { data, loading, error, refetch } = useQuery(
    GET_OPERATING_MODEL_FILES,
    {
      variables: { tab: backendTab },
      skip: !backendTab,
      fetchPolicy: 'cache-and-network',
    },
  );

  const tree = useMemo<FileNode[]>(() => {
    const files = data?.operatingModelFiles as FlatFile[] | undefined;

    if (!files || files.length === 0) return [];

    return buildTree(files);
  }, [data]);

  return { tree, loading, error, refetch };
}
