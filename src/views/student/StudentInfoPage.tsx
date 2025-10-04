import React, { useState, useEffect } from "react";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import type {  StudentFormData } from "../../models/dto/student.interface";
import { Calendar, Upload, Save } from "lucide-react";

const StudentInfoPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu mẫu dựa trên ảnh
  const [studentData, setStudentData] = useState<StudentFormData>({
    studentId: "1011954",
    fullName: "Nguyễn Khắc Tiềm",
    dateOfBirth: "12/12/1999",
    phoneNumber: "0362335462",
    status: "Bộ môn đã duyệt",
    classId: "101197",
    gender: "Nam",
    email: "nguyenkhactiem2k@gmail.com",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = AuthService.getStoredUser();
        if (!user || !AuthService.isAuthenticated()) {
          navigate("/auth/login");
          return;
        }
        // Có thể load dữ liệu sinh viên từ API ở đây
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        navigate("/auth/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (field: keyof StudentFormData, value: string | File) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('cvFile', file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Gọi API để lưu thông tin sinh viên
      console.log("Lưu thông tin sinh viên:", studentData);
      
      // Giả lập delay API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Lưu thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert("Có lỗi xảy ra khi lưu thông tin!");
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thông tin sinh viên
          </h1>
          <p className="text-gray-600">
            Quản lý và cập nhật thông tin cá nhân
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-4">
              {/* Mã sinh viên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã sinh viên
                </label>
                <input
                  type="text"
                  value={studentData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã sinh viên"
                />
              </div>

              {/* Tên sinh viên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sinh viên
                </label>
                <input
                  type="text"
                  value={studentData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sinh viên"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={studentData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* CV giới thiệu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV giới thiệu
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Chọn tệp
                  </label>
                  {studentData.cvFile && (
                    <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">
                      {typeof studentData.cvFile === 'string' ? studentData.cvFile : studentData.cvFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-4">
              {/* Tên trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên trạng thái
                </label>
                <input
                  type="text"
                  value={studentData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập trạng thái"
                />
              </div>

              {/* Mã lớp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã lớp
                </label>
                <input
                  type="text"
                  value={studentData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã lớp"
                />
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={studentData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'Nam' | 'Nữ')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={studentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email"
                />
              </div>
            </div>
          </div>

          {/* Nút lưu */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Đang lưu..." : "+ Lưu thông tin"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default StudentInfoPage;
