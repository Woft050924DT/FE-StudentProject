// src/services/auth.service.ts
import { apiService } from './ApiService';
import type { 
  AuthResponse, 
  LoginDto, 
  RegisterDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  ChangePasswordDto,
} from '../models/dto/auth.types';
import type {User} from '../models/dto/user.interface';

export class AuthService {
  static async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  }

  static async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  static async forgotPassword(data: ForgotPasswordDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/forgot-password', data);
    return response.data;
  }

  static async resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/reset-password', data);
    return response.data;
  }

  static async changePassword(data: ChangePasswordDto): Promise<AuthResponse> {
    const response = await apiService.patch<AuthResponse>('/auth/change-password', data);
    return response.data;
  }

  static async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await apiService.get<AuthResponse>(`/auth/verify-email?token=${token}`);
    return response.data;
  }

  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/resend-verification', { email });
    return response.data;
  }

  
  static async getProfile(): Promise<User> {
    const response = await apiService.get<User>('/auth/profile');
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  }

  static async handleGoogleCallback(credential: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/google/login', {
      credential
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response.data;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}