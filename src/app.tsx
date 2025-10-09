// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import LoginForm from './views/auth/LoginForm';
import RegisterForm from './views/auth/RegisterForm';
import ProfilePage from './views/Profile/ProfilePage';
import ForgotPasswordForm from './views/auth/ForgotPasswordForm';

// Admin Pages
import AdminPage from './views/admin/AdminPage';
import CreateAccountPage from './views/admin/CreateAccountPage';
import ManagePermissionsPage from './views/admin/ManagePermissionsPage';

// Student Pages
import StudentDashboard from './views/student/StudentDashboard';
import StudentInfoPage from './views/student/StudentInfoPage';
import RegisterTopicPage from './views/student/RegisterTopicPage';

// Lecturer Pages
import LecturerDashboard from './views/lecturer/LecturerDashboard';
import TopicManagementPage from './views/lecturer/TopicManagementPage';
import ConfirmStudentRegistrationPage from './views/lecturer/ConfirmStudentRegistrationPage';

// Layout Components
import StudentLayout from './layout/StudentLayout';
import LecturerLayout from './layout/LecturerLayout';
import AdminLayout from './layout/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import RoleRedirect from './components/RoleRedirect';


function App() {
  return (
    <Router>
        <div className="App">
          
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterForm />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordForm />} />

            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/admin/create-account" 
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <CreateAccountPage />
                  </AdminLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/admin/manage-permissions" 
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <ManagePermissionsPage />
                  </AdminLayout>
                </RoleBasedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/student/info" 
              element={
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentInfoPage />
                  </StudentLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/student/register-topic" 
              element={
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <RegisterTopicPage />
                  </StudentLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/student/reviewers" 
              element={
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Xem giảng viên phản biện và hội đồng</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </StudentLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/student/defense-result" 
              element={
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Kết quả bảo vệ</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </StudentLayout>
                </RoleBasedRoute>
              } 
            />

            {/* Lecturer Routes */}
            <Route 
              path="/lecturer/dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <LecturerDashboard />
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/topic-management" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <TopicManagementPage />
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/recent-access" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Truy cập gần đây</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/manage-council" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý hội đồng</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/confirm-student-registration" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <ConfirmStudentRegistrationPage />
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/student-reviewer-list" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Danh sách sinh viên phản biện và hội đồng</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/evaluate-reports" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá, nhận xét báo cáo</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/lecturer/news-management" 
              element={
                <RoleBasedRoute allowedRoles={['lecturer', 'teacher', 'admin']}>
                  <LecturerLayout>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý danh mục Tin</h1>
                        <p className="text-gray-600">Trang này đang được phát triển...</p>
                      </div>
                    </div>
                  </LecturerLayout>
                </RoleBasedRoute>
              } 
            />

            {/* Role-based redirect */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleRedirect />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;