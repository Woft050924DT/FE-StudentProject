import type { User } from "./user.interface";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  user?: User;
  message?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
