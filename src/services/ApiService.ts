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
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
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
