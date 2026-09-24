import { create } from 'zustand';
import api from '../services/api';

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    role: typeof user.role === 'string' ? user.role.toUpperCase() : user.role,
  };
};

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data || {};
      if (token) localStorage.setItem('token', token);
      set({ user: normalizeUser(user), token: token || null, isAuthenticated: !!token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data || {};
      if (token) localStorage.setItem('token', token);
      set({ user: normalizeUser(user), token: token || null, isAuthenticated: !!token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user || response.data.data || response.data;
      set({ user: normalizeUser(user), isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

export default useAuthStore;
