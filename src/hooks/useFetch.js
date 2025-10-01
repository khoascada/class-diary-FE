// hooks/useFetchService.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetchService = (serviceFn, deps = [], initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

  // Thêm useRef để lưu serviceFn
  const serviceFnRef = useRef(serviceFn);

  useEffect(() => {
    serviceFnRef.current = serviceFn;
  }, [serviceFn]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceFnRef.current(); // Dùng ref
      if (!cancelledRef.current) {
        setData(result);
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
  }, []); // Bỏ serviceFn khỏi deps

  useEffect(() => {
    cancelledRef.current = false;
    fetchData();

    return () => {
      cancelledRef.current = true;
    };
  }, [...deps]); // Chỉ re-fetch khi deps thay đổi

  const refetch = useCallback(() => {
    cancelledRef.current = false;
    fetchData();
  }, [fetchData]);

  return { data: data ?? initialValue, loading, error, refetch };
};
