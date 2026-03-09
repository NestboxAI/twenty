import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { GET_WORKSPACE_COMMANDS } from '../../operating-model/graphql/operatingModelQueries';
import { type AnalyxCommand } from '../AnalyxTypes';

type WorkspaceCommand = {
  id: string;
  name: string;
  description?: string;
  body?: string;
  tags?: string[];
  placeholder?: string;
  defaultOutput?: string;
  icon?: string;
  createdAt?: string;
};

/**
 * Fetches workspace commands from the operating model API and maps them
 * to AnalyxCommand format for use in the AnalyxPage skills bar.
 */
export function useWorkspaceCommands() {
  const { data, loading, error } = useQuery(GET_WORKSPACE_COMMANDS, {
    fetchPolicy: 'cache-and-network',
  });

  const commands = useMemo<AnalyxCommand[]>(() => {
    const raw = data?.workspaceCommands as WorkspaceCommand[] | undefined;

    if (!raw) return [];

    return raw.map((cmd) => ({
      id: `ws-${cmd.id}`,
      name: cmd.name,
      description: cmd.description ?? cmd.body ?? '',
      tags: cmd.tags ?? [],
      createdAt: cmd.createdAt ?? new Date().toISOString(),
      isDefault: false,
      placeholder: cmd.placeholder,
      defaultOutput: cmd.defaultOutput,
      icon: cmd.icon,
    }));
  }, [data]);

  return { commands, loading, error };
}
