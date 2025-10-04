import React, { useState, useEffect } from "react";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/dto/user.interface";
import {
  User as UserIcon,
  Shield,
  Mail,
  Calendar,
  LogOut,
  Users,
} from "lucide-react";

const AdminPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = AuthService.getStoredUser();
        if (!user || !AuthService.isAuthenticated()) {
          navigate("/auth/login");
          return;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        navigate("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes("admin")) return "Quản trị viên";
    if (roles.includes("moderator")) return "Điều hành viên";
    if (roles.includes("user")) return "Người dùng";
    return roles.join(", ");
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes("admin"))
      return "bg-red-100 text-red-800 border-red-200";
    if (roles.includes("moderator"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (roles.includes("user"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const displayName =
    currentUser.fullName ||
    currentUser.username ||
    [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
    currentUser.email ||
    "Người dùng";

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trang Quản Trị
          </h1>
          <p className="text-gray-600">
            Chào mừng bạn đến với hệ thống quản lý
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(
                      currentUser.roles
                    )}`}
                  >
                    {getRoleDisplayName(currentUser.roles)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium text-gray-900">
                  {currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Không xác định"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium text-gray-900">
                  {currentUser.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium text-gray-900 text-xs">
                  {currentUser.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Functions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tạo tài khoản mới
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Tạo tài khoản mới cho sinh viên, giảng viên và quản trị viên
            </p>
            <button 
              onClick={() => navigate('/admin/create-account')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo tài khoản
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Phân quyền tài khoản
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Quản lý và phân quyền cho các tài khoản trong hệ thống
            </p>
            <button 
              onClick={() => navigate('/admin/manage-permissions')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Quản lý quyền
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Người dùng online</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Hoạt động hôm nay</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Cảnh báo</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminPage;
