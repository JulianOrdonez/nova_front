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

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  const applySession = useCallback((nextUser: User, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);

    if (nextToken) {
      localStorage.setItem('auth_token', nextToken);
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
      return;
    }

    // Fallback for backends that authenticate with cookie but no token payload.
    localStorage.removeItem('auth_token');
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(mapUser(JSON.parse(storedUser)));
      } catch (err) {
        console.warn('Invalid auth data in localStorage, clearing session', err);
        clearSession();
      }
    }

    setLoading(false);
  }, [clearSession]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'auth_token' && event.key !== 'auth_user') {
        return;
      }

      const nextToken = localStorage.getItem('auth_token');
      const nextUserRaw = localStorage.getItem('auth_user');

      if (!nextToken || !nextUserRaw) {
        setUser(null);
        setToken(null);
        return;
      }

      try {
        setToken(nextToken);
        setUser(mapUser(JSON.parse(nextUserRaw)));
      } catch {
        clearSession();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [clearSession]);

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

      applySession(mappedUser, accessToken ?? null);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [applySession]);

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

      applySession(mappedUser, accessToken ?? null);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, [applySession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo<UseAuthResult>(() => {
    return {
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.roleId === AUTH_ROLE_ADMIN,
      token,
      login,
      register,
      logout,
    };
  }, [user, loading, token, login, register, logout]);

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
