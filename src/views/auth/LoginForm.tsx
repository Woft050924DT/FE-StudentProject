// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";

import type { LoginDto } from "../../models/dto/auth.types";
import { loginSchema } from "../../utils/validation";
import { AuthController } from "../../controllers/AuthController";
import { alertSuccess, alertError } from "../../utils/alert";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    console.log("=== LOGIN FORM SUBMIT START ===");
    console.log("onSubmit triggered with data:", data);
    setIsLoading(true);
    setCredentialError(null);
    
    try {
      console.log("Calling AuthController.login...");
      const result = await AuthController.login(data.username, data.password);
      console.log("AuthController.login result:", result);
      
      // Kiểm tra token sau khi login
      const savedToken = localStorage.getItem("access_token");
      console.log("Token in localStorage after login:", savedToken);
      
      await alertSuccess("Đăng nhập thành công!");
      
      // Chuyển hướng dựa trên role của user
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("=== LOGIN FORM ERROR ===");
      console.error("Error caught in LoginForm:", err);
      
      const anyErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        anyErr?.response?.data?.message ||
        anyErr?.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng";
      
      console.error("Error message:", message);
      setCredentialError("Tên đăng nhập hoặc mật khẩu không đúng");
      await alertError(message);
    } finally {
      setIsLoading(false);
      console.log("=== LOGIN FORM SUBMIT END ===");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              to="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              tạo tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {credentialError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {credentialError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Tên đăng nhập"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/auth/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Đang đăng nhập..."
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Đăng nhập
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Hoặc</span>
              </div>
            </div>
          </div>

          {/* Tính năng đăng nhập Google hiện không khả dụng */}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
