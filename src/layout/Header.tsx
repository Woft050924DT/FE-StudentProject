import React from "react";
import { AuthService } from "../services/AuthService";
import type { User } from "../models/dto/user.interface";

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const user = AuthService.getStoredUser();
    setCurrentUser(user);

    const onStorage = () => {
      setCurrentUser(AuthService.getStoredUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const displayName = React.useMemo(() => {
    if (!currentUser) return "";
    return (
      currentUser.fullName ||
      currentUser.username ||
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
      currentUser.email ||
      "Người dùng"
    );
  }, [currentUser]);

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes("admin")) return "Quản trị viên";
    if (roles.includes("lecturer") || roles.includes("teacher")) return "Giảng viên";
    if (roles.includes("moderator")) return "Điều hành viên";
    if (roles.includes("student")) return "Sinh viên";
    if (roles.includes("user")) return "Người dùng";
    return roles.join(", ");
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes("admin")) return "bg-red-100 text-red-800";
    if (roles.includes("lecturer") || roles.includes("teacher")) return "bg-green-100 text-green-800";
    if (roles.includes("student")) return "bg-blue-100 text-blue-800";
    if (roles.includes("moderator")) return "bg-yellow-100 text-yellow-800";
    if (roles.includes("user")) return "bg-gray-100 text-gray-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsDropdownOpen(false);
  };

  const goToProfile = () => {
    window.location.href = "/profile";
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="h-16 border-b border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-6 flex items-center justify-between text-white">
      <div className="text-xl font-bold">CỘNG THÔNG TIN SỐ HÓA KHOA CÔNG NGHỆ THÔNG TIN</div>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            {/* Icons */}
            <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <span className="text-sm font-bold">AB</span>
            </button>
            
            <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">8</span>
            </button>
            
            <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">4</span>
            </button>

            {/* User info */}
            <div className="relative user-dropdown">
              <div 
                className="flex items-center gap-3 cursor-pointer select-none hover:bg-white hover:bg-opacity-10 rounded-md px-2 py-1 transition-colors"
                onClick={toggleDropdown}
              >
                <span className="text-sm">Xin chào, {displayName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-4 h-4 opacity-90 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{displayName}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getRoleColor(currentUser.roles)}`}>
                      {getRoleDisplayName(currentUser.roles)}
                    </div>
                  </div>
                  <button
                    onClick={goToProfile}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Add button */}
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              + Thêm
            </button>
          </>
        ) : (
          <span className="opacity-90">Sinh viên • 2025</span>
        )}
      </div>
    </header>
  );
};

export default Header;
