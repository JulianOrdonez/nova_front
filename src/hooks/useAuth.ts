'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LoginCredentials, RegisterCredentials, UseAuthResult, User } from '@/types';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';

const AUTH_ROLE_ADMIN = 1;

const AuthContext = createContext<UseAuthResult | null>(null);

function mapUser(raw: any): User {
  const rawRoleId = raw?.role_id ?? raw?.roleId ?? null;
  const parsedRoleId =
    typeof rawRoleId === 'number'
      ? rawRoleId
      : rawRoleId === null || rawRoleId === undefined || rawRoleId === ''
        ? null
        : Number(rawRoleId);
  const finalRoleId: number = Number.isFinite(parsedRoleId)
    ? (parsedRoleId as number)
    : raw?.role === 'admin'
      ? AUTH_ROLE_ADMIN
      : 0;

  return {
    id: String(raw?.id ?? ''),
    email: String(raw?.email ?? ''),
    name: String(raw?.name ?? ''),
    roleId: finalRoleId,
    role: finalRoleId === AUTH_ROLE_ADMIN ? 'admin' : 'user',
    createdAt: String(raw?.created_at ?? raw?.createdAt ?? ''),
    updatedAt: String(raw?.updated_at ?? raw?.updatedAt ?? raw?.created_at ?? ''),
  };
}

export function getAuthHeaders(): Record<string, string> {
  return API_DEFAULT_HEADERS;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.authLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...API_DEFAULT_HEADERS,
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.detail || errorData?.error || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      const userData = data.user || data;
      const mappedUser = mapUser(userData);
      const accessToken = data.access_token || data.token;

      setUser(mappedUser);
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('auth_token', accessToken);
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.authRegister, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...API_DEFAULT_HEADERS,
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role_id: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.detail || errorData?.error || `Register failed: ${response.status}`);
      }

      const data = await response.json();
      const userData = data.user || data;
      const mappedUser = mapUser(userData);
      const accessToken = data.access_token || data.token;

      setUser(mappedUser);
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('auth_token', accessToken);
      }
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  }, []);

  const value = useMemo<UseAuthResult>(() => {
    return {
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.roleId === AUTH_ROLE_ADMIN,
      login,
      register,
      logout,
    };
  }, [user, loading, login, register, logout]);

  const provider = React.createElement(AuthContext.Provider, { value }, children);
  return provider;
};

export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
