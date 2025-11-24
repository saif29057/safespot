import { useState, useCallback } from 'react';

const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  return { data, isLoading, error, execute };
};

export default useApi;
