import { useState, useCallback, createContext, ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { MOCK_USERS } from '../utils/constants';

const STORAGE_KEY = 'exameye_auth';

function loadPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as User;
    }
  } catch {
    /* ignore corrupt data */
  }
  return null;
}

function buildInitialState(): AuthState {
  const persisted = loadPersistedUser();
  return {
    user: persisted,
    isAuthenticated: persisted !== null,
    isLoading: false,
  };
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(buildInitialState);

  const login = useCallback(async (emailInput: string, passwordInput: string, remember = false) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Match exact or case-insensitive mock user
    let found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    // If not found by exact password match, fallback to matching by email or creating demo session
    if (!found) {
      found = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    // Default fallback to Admin User if anything was entered
    if (!found && cleanEmail.length > 0) {
      found = {
        id: '1',
        name: cleanEmail.split('@')[0].toUpperCase() || 'Admin User',
        email: cleanEmail,
        password: cleanPassword,
        role: 'admin' as const,
      };
    }

    if (!found) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error('Invalid email or password. Please try again.');
    }

    const user: User = { id: found.id, name: found.name, email: found.email, role: found.role };

    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
