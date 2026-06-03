import api from './axios';

export const getAnalytics = (id) => api.get(`/analytics/${id}`);
export const getPublicStats = (shortCode) => api.get(`/public/stats/${shortCode}`);
