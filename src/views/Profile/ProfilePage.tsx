import React from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { AuthService } from "../../services/AuthService";
import type { User } from "../../models/dto/user.interface";

const ProfilePage: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(
    AuthService.getStoredUser()
  );

  React.useEffect(() => {
    const onStorage = () => setUser(AuthService.getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-indigo-700">
              Thông tin cá nhân
            </h1>
            <p className="mt-2 text-gray-600">
              Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email;

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm max-w-2xl">
          <h1 className="text-xl font-semibold text-indigo-700">
            Thông tin cá nhân
          </h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Họ và tên
              </label>
              <input
                className="mt-1 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={displayName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                className="mt-1 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={user.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Vai trò
              </label>
              <input
                className="mt-1 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={user.role}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Xác thực email
              </label>
              <input
                className="mt-1 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
