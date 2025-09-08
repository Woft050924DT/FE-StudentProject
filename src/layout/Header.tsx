import React from "react";
import { AuthService } from "../services/AuthService";
import type { User } from "../models/dto/user.interface";

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const user = AuthService.getStoredUser();
    setCurrentUser(user);

    const onStorage = () => {
      setCurrentUser(AuthService.getStoredUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const displayName = React.useMemo(() => {
    if (!currentUser) return "";
    return (
      currentUser.fullName ||
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
      currentUser.email ||
      "Người dùng"
    );
  }, [currentUser]);

  const handleLogout = () => {
    AuthService.logout();
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <header className="h-14 border-b border-transparent bg-gradient-to-r from-indigo-600 to-blue-500 px-4 flex items-center justify-between text-white">
      <div className="text-lg font-semibold">Quản lý tiến độ đồ án</div>
      <div className="text-sm">
        {currentUser ? (
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <span>
                Xin chào, <span className="font-semibold">{displayName}</span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 opacity-90"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-md shadow-lg ring-1 ring-black/5 overflow-hidden">
              <button
                onClick={goToProfile}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <span className="opacity-90">Sinh viên • 2025</span>
        )}
      </div>
    </header>
  );
};

export default Header;
