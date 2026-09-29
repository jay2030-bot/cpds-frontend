import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getStoredToken, setStoredToken } from '../services/api';
import { login as loginRequest } from '../services/auth.service';
import { AuthUser } from '../types/auth';

const USER_STORAGE_KEY = 'cpds_user';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Session persistence is deliberately simple for this academic-scope project:
 * the JWT and a copy of the user profile are kept in localStorage, so a page
 * refresh doesn't lose the session. There's no refresh-token flow — when the
 * JWT expires, the api.ts 401 interceptor sends the user back to /login.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        setStoredToken(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<AuthUser> {
    const { accessToken, user: loggedInUser } = await loginRequest(email, password);
    setStoredToken(accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    setStoredToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
