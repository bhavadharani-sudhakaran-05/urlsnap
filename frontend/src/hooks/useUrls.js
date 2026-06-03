import { useState, useCallback } from 'react';
import * as api from '../utils/api';
import toast from 'react-hot-toast';

export function useUrls() {
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: 10, pages: 1
  });
  const [loading, setLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const fetchUrls = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUrls(params);
      setUrls(data.urls);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load links');
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const data = await api.getOverview();
      setOverview(data);
    } catch (err) {
      console.error('Overview error:', err);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const createUrl = async (formData) => {
    const data = await api.createUrl(formData);
    setUrls(prev => [data.url, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    return data.url;
  };

  const updateUrl = async (id, formData) => {
    const data = await api.updateUrl(id, formData);
    setUrls(prev => prev.map(u => u._id === id ? data.url : u));
    return data.url;
  };

  const deleteUrl = async (id) => {
    try {
      await api.deleteUrl(id);
      setUrls(prev => prev.filter(u => u._id !== id && u.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      toast.success('Link deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete link');
      throw err;
    }
  };

  const generateQr = async (id) => {
    const data = await api.generateQr(id);
    setUrls(prev => prev.map(u => u._id === id ? { ...u, qrCode: data.qrCode } : u));
    return data.qrCode;
  };

  const bulkCreate = async (urlsArray) => {
    return await api.bulkCreate(urlsArray);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', { icon: '📋' });
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return {
    urls, pagination, loading, overviewLoading, overview, error,
    fetchUrls, fetchOverview, createUrl, updateUrl,
    deleteUrl, generateQr, bulkCreate, copyToClipboard,
    refreshUrls: fetchUrls
  };
}
