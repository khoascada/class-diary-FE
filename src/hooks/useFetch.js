import { useState, useEffect, useCallback } from 'react';
import { apiAxios } from '@/lib/api/index';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dependencies = [], ...fetchOptions } = options;

  // useCallback để dùng cho refetch
  const fetchData = useCallback(async (cancelledRef) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiAxios.get(url, fetchOptions);

      if (!cancelledRef.current) {
        setData(response);
      }
    } catch (err) {
      if (!cancelledRef.current) {
        setError(err);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, [url, JSON.stringify(fetchOptions)]);

  const cancelledRef = { current: false };

  useEffect(() => {
    cancelledRef.current = false;

    async function load() {
      await fetchData(cancelledRef);
    }

    load();

    return () => {
      cancelledRef.current = true; // cleanup khi unmount
    };
  }, [fetchData, ...dependencies]);

  const refetch = () => {
    cancelledRef.current = false;
    fetchData(cancelledRef);
  };

  return { data, loading, error, refetch };
};
