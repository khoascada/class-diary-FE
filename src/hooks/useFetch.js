import { useState, useEffect } from 'react';
import { apiAxios } from '@/lib/api/index';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dependencies = [], ...fetchOptions } = options;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiAxios.get(url, fetchOptions);

        
        if (!cancelled) {
          setData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, ...dependencies]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-run the effect
  };

  return { data, loading, error, refetch };
};