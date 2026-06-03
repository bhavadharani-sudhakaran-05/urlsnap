import api from './axios';

export const createUrl = (data) => api.post('/url/create', data);
export const getAllUrls = () => api.get('/url/all');
export const getUrlById = (id) => api.get(`/url/${id}`);
export const updateUrl = (id, data) => api.put(`/url/${id}`, data);
export const deleteUrl = (id) => api.delete(`/url/${id}`);
export const bulkUploadCsv = (csv) => api.post('/url/bulk', { csv });
