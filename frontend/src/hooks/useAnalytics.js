import { useState, useCallback } from 'react';
import * as api from '../utils/api';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [globalAnalytics, setGlobalAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (urlId, period = '30') => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalytics(urlId, period);
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGlobalAnalytics = useCallback(async (period = '30') => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGlobalAnalytics(period);
      setGlobalAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analytics, globalAnalytics, loading, error,
    fetchAnalytics, fetchGlobalAnalytics
  };
}
