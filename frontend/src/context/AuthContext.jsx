import React, { createContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    const response = await client.post('/api/v1/auth/login', { email, password });
    const { access_token, refresh_token, user: userData, org: orgData } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    setUser(userData);
    setOrg(orgData);
    setIsAuthenticated(true);
    
    return response.data;
  };

  const register = async (data) => {
    const response = await client.post('/api/v1/auth/register', data);
    const { access_token, refresh_token, user: userData, org: orgData } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    setUser(userData);
    setOrg(orgData);
    setIsAuthenticated(true);
    
    return response.data;
  };

  const logout = useCallback(async () => {
    try {
      await client.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setOrg(null);
      setIsAuthenticated(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await client.get('/api/v1/auth/me');
      setUser(response.data.user);
      setOrg(response.data.org);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Refresh user error:', error);
      localStorage.clear();
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const value = {
    user,
    org,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
