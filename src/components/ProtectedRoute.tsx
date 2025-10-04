import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import type { User } from "../models/dto/user.interface";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "moderator" | "user";
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = "/auth/login",
}) => {
  const location = useLocation();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Lấy thông tin người dùng từ localStorage
  const currentUser: User | null = AuthService.getStoredUser();

  if (!currentUser) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Kiểm tra quyền truy cập nếu có yêu cầu role cụ thể
  if (requiredRole) {
    // Kiểm tra xem user có role yêu cầu không
    const hasRequiredRole = currentUser.roles.includes(requiredRole);

    if (!hasRequiredRole) {
      // Người dùng không có quyền truy cập
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600 mb-4">
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên để được cấp quyền.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Quyền hiện tại: <span className="font-medium">{currentUser.roles.join(", ")}</span>
              </p>
              <p className="text-sm text-gray-500">
                Quyền yêu cầu: <span className="font-medium">{requiredRole}</span>
              </p>
            </div>
            <div className="mt-6 space-x-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => AuthService.logout()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
