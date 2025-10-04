import React, { useState, useEffect } from "react";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/dto/user.interface";
import { BookOpen, Users, FileCheck, User as UserIcon, Calendar, CheckCircle } from "lucide-react";

const StudentDashboard: React.FC = () => {
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

  const displayName =
    currentUser?.fullName ||
    currentUser?.username ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
    currentUser?.email ||
    "Sinh viên";

  const dashboardItems = [
    {
      icon: BookOpen,
      title: "Đăng ký đề tài đồ án tốt nghiệp",
      description: "Đăng ký đề tài và nộp hồ sơ đồ án tốt nghiệp",
      href: "/student/register-topic",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Xem giảng viên phản biện và hội đồng",
      description: "Xem thông tin giảng viên hướng dẫn, phản biện và hội đồng",
      href: "/student/reviewers",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      icon: FileCheck,
      title: "Kết quả bảo vệ",
      description: "Xem kết quả bảo vệ đồ án tốt nghiệp",
      href: "/student/defense-result",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      icon: UserIcon,
      title: "Thông tin sinh viên",
      description: "Cập nhật thông tin cá nhân",
      href: "/student/info",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Sinh viên
          </h1>
          <p className="text-gray-600">
            Chào mừng, <span className="font-semibold">{displayName}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Đề tài đã đăng ký</p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Giảng viên hướng dẫn</p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Ngày bảo vệ</p>
                <p className="text-xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Trạng thái</p>
                <p className="text-xl font-bold text-gray-900">Đang làm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(item.href)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 ${item.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-5 w-5 ${item.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-xs font-medium text-blue-600 group-hover:text-blue-700">
                      Truy cập
                      <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">Đăng ký đề tài "Hệ thống quản lý đồ án tốt nghiệp"</p>
                <p className="text-xs text-gray-500">2 ngày trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">Cập nhật thông tin cá nhân</p>
                <p className="text-xs text-gray-500">1 tuần trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentDashboard;
