import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "./Header";
import StudentSidebar from "./StudentSidebar";

type StudentLayoutProps = {
  children: React.ReactNode;
};

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentTime = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex relative">
        <StudentSidebar collapsed={sidebarCollapsed} />
        
        {/* Collapse Button - positioned at the center of the sidebar edge */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            sidebarCollapsed ? 'left-2' : 'left-60'
          }`}
          style={{ transform: 'translateY(-50%)' }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
        
        <main className="flex-1 min-w-0 bg-white pb-12">{children}</main>
      </div>
      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-6 py-2 flex justify-between items-center text-sm text-gray-600">
        <div>Nơi làm việc: CÔNG THÔNG TIN SỐ HÓA KHOA CÔNG NGHỆ THÔNG TIN</div>
        <div>{currentTime}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
