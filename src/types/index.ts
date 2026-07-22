import type { ElementType } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  path: string;
  badge?: number;
}
