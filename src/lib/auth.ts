import { User } from '@/models/User';

const USER_STORAGE_KEY = 'developer_journal_user';
const TOKEN_STORAGE_KEY = 'developer_journal_token';

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = getToken();
  return user !== null && token !== null;
};

export const saveAuthData = (user: User, token: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const clearAuthData = logout;
