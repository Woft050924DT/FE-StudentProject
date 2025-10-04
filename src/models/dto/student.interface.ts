export interface Student {
  id: string;
  studentId: string; // Mã sinh viên
  fullName: string; // Tên sinh viên
  dateOfBirth: string; // Ngày sinh
  phoneNumber: string; // Số điện thoại
  cvFile?: File | string; // CV giới thiệu
  status: string; // Tên trạng thái
  classId: string; // Mã lớp
  gender: 'Nam' | 'Nữ'; // Giới tính
  email: string; // Email
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFormData {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  cvFile?: File;
  status: string;
  classId: string;
  gender: 'Nam' | 'Nữ';
  email: string;
}
