import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { type VersionEntry } from '../OperatingModelTypes';
import { GET_OPERATING_MODEL_HISTORY } from '../graphql/operatingModelQueries';

export function useOperatingModelHistory(limit = 50) {
  const { data, loading, error, refetch } = useQuery(
    GET_OPERATING_MODEL_HISTORY,
    {
      variables: { limit },
      fetchPolicy: 'cache-and-network',
    },
  );

  const versions = useMemo<VersionEntry[]>(() => {
    return (data?.operatingModelHistory as VersionEntry[] | undefined) ?? [];
  }, [data]);

  return { versions, loading, error, refetch };
}
