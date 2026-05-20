import { useCallback, useEffect, useState } from 'react';

export const useAsyncData = (loadData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadData();
      setData(result);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load data');
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, error, isLoading, refetch };
};
