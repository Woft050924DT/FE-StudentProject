import React, { useState } from "react";
import { 
  Search, 
  ClipboardList, 
  Users, 
  FileText, 
  List,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface LecturerSidebarProps {
  collapsed?: boolean;
}

const LecturerSidebar: React.FC<LecturerSidebarProps> = ({ collapsed = false }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['topic-management', 'thesis-management']));

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: ClipboardList,
      label: 'Bàn làm việc',
      href: '/lecturer/dashboard'
    },
    {
      id: 'recent-access',
      icon: Users,
      label: 'Truy cập gần đây',
      href: '/lecturer/recent-access'
    },
    {
      id: 'topic-management',
      icon: FileText,
      label: 'Quản lý đề tài đồ án tốt nghiệp',
      href: '/lecturer/topic-management',
      children: [
        {
          id: 'manage-council',
          label: 'Quản lý hội đồng',
          href: '/lecturer/manage-council'
        },
        {
          id: 'confirm-student-registration',
          label: 'Giảng viên xác nhận sinh viên đăng ký đề tài',
          href: '/lecturer/confirm-student-registration'
        }
      ]
    },
    {
      id: 'thesis-management',
      icon: Users,
      label: 'Quản lý đồ án tốt nghiệp',
      href: '/lecturer/thesis-management',
      children: [
        {
          id: 'manage-thesis-topics',
          label: 'Quản lý đề tài đồ án tốt nghiệp',
          href: '/lecturer/topic-management'
        },
        {
          id: 'manage-council-thesis',
          label: 'Quản lý hội đồng',
          href: '/lecturer/manage-council'
        },
        {
          id: 'student-reviewer-list',
          label: 'Danh sách sinh viên phản biện và hội đồng',
          href: '/lecturer/student-reviewer-list'
        },
        {
          id: 'evaluate-reports',
          label: 'Giảng viên đánh giá, nhận xét báo cáo',
          href: '/lecturer/evaluate-reports'
        },
        {
          id: 'confirm-registration',
          label: 'Giảng viên xác nhận sinh viên đăng ký đề tài',
          href: '/lecturer/confirm-student-registration'
        }
      ]
    },
    {
      id: 'news-management',
      icon: List,
      label: 'Quản lý danh mục Tin',
      href: '/lecturer/news-management',
      hasDropdown: true
    }
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-100 border-r border-gray-200 transition-all duration-300`}>
      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-green-600" />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="px-2 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.has(item.id);
          const hasChildren = item.children && item.children.length > 0;
          
          return (
            <div key={item.id}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                  item.id === 'thesis-management' && item.children?.[0]?.id === 'manage-thesis-topics'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => hasChildren && !collapsed ? toggleExpanded(item.id) : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {hasChildren && (
                      isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                  </>
                )}
              </div>
              
              {/* Submenu */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <a
                      key={child.id}
                      href={child.href}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        child.id === 'manage-thesis-topics'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default LecturerSidebar;

