import { apiService } from "./ApiService";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "../models/dto/auth.types";
import type { User } from "../models/dto/user.interface";

export class AuthService {
  static async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      console.log("=== LOGIN DEBUG START ===");
      console.log("Sending credentials:", credentials);
      
      const response = await apiService.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      console.log("=== LOGIN RESPONSE ===");
      console.log("Full response object:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Response data keys:", Object.keys(response.data));

      // Kiểm tra các tên token có thể có
      const token = response.data.access_token || 
                    response.data.token || 
                    response.data.accessToken ||
                    (response.data as any).access_token;

      console.log("Extracted token:", token);
      console.log("Token type:", typeof token);
      console.log("Token length:", token ? token.length : 0);

      if (token) {
        localStorage.setItem("access_token", token);
        console.log("✅ Token saved to localStorage successfully");
        console.log("Token value:", token);
        
        const user = response.data.user || (response.data as any).user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          console.log("✅ User saved to localStorage:", user);
        } else {
          console.log("⚠️ No user data in response");
        }
      } else {
        console.error("❌ No token found in response!");
        console.error("Available keys:", Object.keys(response.data));
        console.error("Full response data:", response.data);
        console.error("Checking individual fields:");
        console.error("- access_token:", response.data.access_token);
        console.error("- token:", response.data.token);
        console.error("- accessToken:", response.data.accessToken);
      }

      console.log("=== LOGIN DEBUG END ===");
      return response.data;
    } catch (error) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", (error as any)?.message);
      console.error("Error response:", (error as any)?.response);
      console.error("Error response data:", (error as any)?.response?.data);
      throw error;
    }
  }

  static async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  }

  static async forgotPassword(data: ForgotPasswordDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  }

  static async resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/reset-password",
      data
    );
    return response.data;
  }

  static async changePassword(data: ChangePasswordDto): Promise<AuthResponse> {
    const response = await apiService.patch<AuthResponse>(
      "/auth/change-password",
      data
    );
    return response.data;
  }

  static async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await apiService.get<AuthResponse>(
      `/auth/verify-email?token=${token}`
    );
    return response.data;
  }

  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/resend-verification",
      { email }
    );
    return response.data;
  }

  static async getProfile(): Promise<User> {
    const response = await apiService.get<User>("/auth/profile");
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>("/auth/me");
    return response.data;
  }

  static async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
  }

  static async handleGoogleCallback(credential: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/google/login", {
      credential,
    });

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }

    return response.data;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem("access_token");
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  static hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user ? user.roles.includes(role) : false;
  }

  static isAdmin(): boolean {
    return this.hasRole("admin");
  }

  static isModerator(): boolean {
    return this.hasRole("moderator");
  }

  static isTeacher(): boolean {
    return this.hasRole("teacher");
  }

  static isLecturer(): boolean {
    return this.hasRole("lecturer");
  }
}
