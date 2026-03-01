import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterRequest, User } from '@/models/User';
import { apiClient } from '@/services/api-client';

type RegisterResponse = User | { message: string };

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed. Please try again.'));
    }
  },

  async verifyToken(): Promise<User> {
    try {
      return await apiClient.get<User>('/auth/verify');
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Token verification failed.'));
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      return await apiClient.post<RegisterResponse>('/auth/register', data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed. Please try again.'));
    }
  },
};
