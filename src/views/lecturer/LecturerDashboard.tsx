import React from "react";
import { ClipboardList, Users, FileText, CheckSquare } from "lucide-react";

const LecturerDashboard: React.FC = () => {
  const stats = [
    {
      title: "Tổng số đề tài",
      value: "156",
      icon: FileText,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Đề tài chờ duyệt",
      value: "23",
      icon: ClipboardList,
      color: "bg-yellow-500",
      change: "+5%"
    },
    {
      title: "Sinh viên đăng ký",
      value: "89",
      icon: Users,
      color: "bg-green-500",
      change: "+8%"
    },
    {
      title: "Đề tài đã duyệt",
      value: "133",
      icon: CheckSquare,
      color: "bg-purple-500",
      change: "+15%"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Sinh viên Nguyễn Văn A đăng ký đề tài mới",
      time: "2 giờ trước",
      type: "registration"
    },
    {
      id: 2,
      title: "Đề tài 'Hệ thống quản lý sinh viên' đã được duyệt",
      time: "4 giờ trước",
      type: "approval"
    },
    {
      id: 3,
      title: "Hội đồng phản biện đã được phân công",
      time: "1 ngày trước",
      type: "assignment"
    },
    {
      id: 4,
      title: "Báo cáo tiến độ từ sinh viên Trần Thị B",
      time: "2 ngày trước",
      type: "report"
    }
  ];

  return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bàn làm việc</h1>
          <p className="text-gray-600 mt-2">Tổng quan về hoạt động quản lý đề tài đồ án tốt nghiệp</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} so với tháng trước</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default LecturerDashboard;

