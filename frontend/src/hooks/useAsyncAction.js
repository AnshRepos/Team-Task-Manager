import { useCallback, useState } from 'react';

export const useAsyncAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (action) => {
    setIsLoading(true);
    setError(null);

    try {
      return await action();
    } catch (actionError) {
      setError(actionError.message || 'Something went wrong');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { error, isLoading, run };
};
