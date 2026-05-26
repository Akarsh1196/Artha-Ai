import { api } from './api';
import type { User } from '../store/authStore';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends AuthRequest {
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const AuthService = {
  signup: async (data: SignupRequest) => {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    return response.data;
  },
  login: async (data: AuthRequest) => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  }
};
