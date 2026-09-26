import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.warn('Failed to load user info:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleLogoutEvent = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin' || user?.is_staff || user?.is_superuser;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
