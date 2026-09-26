import apiClient from '../lib/axios';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
