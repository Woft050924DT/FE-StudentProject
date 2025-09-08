import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-700">
            Tiến độ gần đây
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>• Nộp đề cương tuần 1</li>
            <li>• Hoàn thành thiết kế CSDL</li>
            <li>• Triển khai API xác thực</li>
          </ul>
        </div>
        <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-700">Công việc</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Viết tài liệu</span>
              <span className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">
                Đang làm
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Thiết kế UI</span>
              <span className="text-xs text-white bg-green-600 px-2 py-0.5 rounded">
                Xong
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
