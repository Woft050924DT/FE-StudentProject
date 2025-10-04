import React from "react";
import { Search, UserPlus, Shield, BarChart3, Settings } from "lucide-react";

interface AdminSidebarProps {
  collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const menuItems = [
    { icon: UserPlus, label: "Tạo tài khoản mới", href: "/admin/create-account" },
    { icon: Shield, label: "Phân quyền tài khoản", href: "/admin/manage-permissions" },
    { icon: BarChart3, label: "Thống kê hệ thống", href: "/admin/statistics" },
    { icon: Settings, label: "Cài đặt hệ thống", href: "/admin/settings" },
  ];

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
          return (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
