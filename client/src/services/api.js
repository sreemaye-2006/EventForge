import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout (Render free tier cold starts)
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper: always extract a plain string message from any error shape
export const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  // Axios error with response
  const data = error?.response?.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.msg === 'string') return data.msg;
  }
  // Network error (CORS, offline, Render sleeping)
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return 'Cannot connect to server. Please try again in a moment.';
  }
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. The server may be waking up — please try again.';
  }
  return error?.message || 'An unexpected error occurred';
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Attach a normalised string message to the error for easy consumption
    error.friendlyMessage = extractErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
