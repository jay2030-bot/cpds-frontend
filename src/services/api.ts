import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
const TOKEN_STORAGE_KEY = 'cpds_token';

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15_000 });

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * A 401 here means the token is missing/expired/the account was deactivated
 * (the backend re-checks isActive on every request — see JwtStrategy.validate).
 * Either way, the local session is stale, so clear it and bounce to /login.
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && getStoredToken()) {
      setStoredToken(null);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please check your connection and try again.';
    if (!error.response) return 'Could not reach the server. Please check your connection and try again.';
  }
  return fallback;
}
