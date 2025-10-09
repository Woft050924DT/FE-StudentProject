// src/services/api.ts
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        console.log("Request interceptor - Token from localStorage:", token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Authorization header set:", `Bearer ${token}`);
        } else {
          console.warn("No token found in localStorage");
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.log("Response interceptor - Error:", error.response?.status, error.response?.data);
        console.log("Request URL:", error.config?.url);
        console.log("Request method:", error.config?.method);
        
        if (error.response?.status === 401) {
          console.log("401 Unauthorized - Token may be invalid or expired");
          console.log("Current token:", localStorage.getItem("access_token"));
          console.log("Request URL that caused 401:", error.config?.url);
          
          // Chỉ redirect nếu không phải là request đăng ký đề tài
          const isRegisterTopicRequest = error.config?.url?.includes('/thesis/register-topic') || 
                                        error.config?.url?.includes('/thesis/available-topics') ||
                                        error.config?.url?.includes('/thesis/my-registrations');
          
          if (!isRegisterTopicRequest) {
            console.log("Redirecting to login - not a topic-related request");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/auth/login";
          } else {
            console.log("401 on topic-related request - not redirecting, just showing error");
          }
        }

        const message = error.response?.data?.message || "Đã có lỗi xảy ra";
        toast.error(message);

        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.get(url);
  }

  post<T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data);
  }

  put<T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data);
  }

  patch<T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data);
  }

  delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete(url);
  }
}

export const apiService = new ApiService();
