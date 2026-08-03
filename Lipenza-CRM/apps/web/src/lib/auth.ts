'use client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'ANALYST';
  avatar?: string;
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('lipenza_user');
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('lipenza_token', token);
  localStorage.setItem('lipenza_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('lipenza_token');
  localStorage.removeItem('lipenza_user');
}

export function isAuthenticated() {
  return !!localStorage.getItem('lipenza_token');
}
