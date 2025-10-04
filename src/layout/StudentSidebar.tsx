import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, User, Users, BookOpen, FileCheck } from "lucide-react";

interface StudentSidebarProps {
  collapsed?: boolean;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: User, label: "Thông tin sinh viên", href: "/student/info" },
    { icon: BookOpen, label: "Đăng ký đề tài đồ án tốt nghiệp", href: "/student/register-topic" },
    { icon: Users, label: "Xem giảng viên phản biện và hội đồng", href: "/student/reviewers" },
    { icon: FileCheck, label: "Kết quả bảo vệ", href: "/student/defense-result" },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} hidden md:block bg-white border-r border-gray-200 p-4 transition-all duration-300`}>
      {/* Search */}
      {!collapsed && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default StudentSidebar;
