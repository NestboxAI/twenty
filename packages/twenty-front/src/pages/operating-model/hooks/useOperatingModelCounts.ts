import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { type ModelTab } from '../OperatingModelTypes';
import { GET_OPERATING_MODEL_FILES } from '../graphql/operatingModelQueries';

const CONTENT_TABS = ['COMMANDS', 'SKILLS', 'AGENTS', 'HOOKS'] as const;
const TAB_MAP: Record<(typeof CONTENT_TABS)[number], ModelTab> = {
  COMMANDS: 'commands',
  SKILLS: 'skills',
  AGENTS: 'agents',
  HOOKS: 'hooks',
};

export function useOperatingModelCounts() {
  const commandsResult = useQuery(GET_OPERATING_MODEL_FILES, {
    variables: { tab: 'COMMANDS' },
    fetchPolicy: 'cache-and-network',
  });
  const skillsResult = useQuery(GET_OPERATING_MODEL_FILES, {
    variables: { tab: 'SKILLS' },
    fetchPolicy: 'cache-and-network',
  });
  const agentsResult = useQuery(GET_OPERATING_MODEL_FILES, {
    variables: { tab: 'AGENTS' },
    fetchPolicy: 'cache-and-network',
  });
  const hooksResult = useQuery(GET_OPERATING_MODEL_FILES, {
    variables: { tab: 'HOOKS' },
    fetchPolicy: 'cache-and-network',
  });

  const results = useMemo(
    () => [commandsResult, skillsResult, agentsResult, hooksResult],
    [commandsResult, skillsResult, agentsResult, hooksResult],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    CONTENT_TABS.forEach((backendTab, i) => {
      const files = results[i].data?.operatingModelFiles as
        | { path: string }[]
        | undefined;
      c[TAB_MAP[backendTab]] = files?.length ?? 0;
    });
    return c;
  }, [results]);

  const loading = results.some((r) => r.loading);

  return { counts, loading };
}
