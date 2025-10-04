import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  ArrowLeft, Search, Edit, Save, X } from "lucide-react";

interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  roles: string[];
  createdAt: string;
}

const ManagePermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);

  // Dữ liệu mẫu
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        email: "student1@example.com",
        username: "student1",
        fullName: "Nguyễn Văn A",
        roles: ["student"],
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        email: "teacher1@example.com",
        username: "teacher1",
        fullName: "Thầy Nguyễn Văn B",
        roles: ["teacher"],
        createdAt: "2024-01-10"
      },
      {
        id: 3,
        email: "admin1@example.com",
        username: "admin1",
        fullName: "Admin Nguyễn Văn C",
        roles: ["admin"],
        createdAt: "2024-01-05"
      }
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes("admin")) return "Quản trị viên";
    if (roles.includes("teacher")) return "Giảng viên";
    if (roles.includes("student")) return "Sinh viên";
    return roles.join(", ");
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes("admin")) return "bg-red-100 text-red-800 border-red-200";
    if (roles.includes("teacher")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (roles.includes("student")) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleEditRoles = (user: User) => {
    setEditingUser(user.id);
    setEditingRoles([...user.roles]);
  };

  const handleSaveRoles = async (userId: number) => {
    try {
      // Gọi API cập nhật roles
      console.log("Cập nhật roles cho user:", userId, editingRoles);
      
      // Cập nhật local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, roles: editingRoles } : user
      ));
      
      setEditingUser(null);
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Có lỗi xảy ra khi cập nhật quyền!");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditingRoles([]);
  };

  const toggleRole = (role: string) => {
    if (editingRoles.includes(role)) {
      setEditingRoles(editingRoles.filter(r => r !== role));
    } else {
      setEditingRoles([...editingRoles, role]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý phân quyền
          </h1>
          <p className="text-gray-600">
            Quản lý và phân quyền cho các tài khoản trong hệ thống
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo email, tên đăng nhập hoặc họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {['admin', 'teacher', 'student'].map(role => (
                              <label key={role} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={editingRoles.includes(role)}
                                  onChange={() => toggleRole(role)}
                                  className="mr-1"
                                />
                                <span className="text-sm">
                                  {role === 'admin' ? 'Quản trị' : 
                                   role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.roles)}`}>
                          {getRoleDisplayName(user.roles)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUser === user.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveRoles(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRoles(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy người dùng nào
          </div>
        )}
      </div>
  );
};

export default ManagePermissionsPage;
