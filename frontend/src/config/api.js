/**
 * API configuration — single source of truth for backend connection.
 * Dev: Vite proxy (/api) OR direct URL via VITE_API_URL
 * Prod: set VITE_API_URL=https://your-api.com/api
 */
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://urlsnap-pydi.onrender.com/api'
  : (import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api');

export const API_ORIGIN = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/\/api$/, '')
  : 'http://localhost:5000';

export const HEALTH_URL = `${API_BASE_URL}/health`;
