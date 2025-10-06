import React from "react";

const StudentProposal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đề xuất đề tài</h1>
          <p className="mt-2 text-gray-600">
            Điền thông tin đề xuất đề tài để gửi cho giảng viên phê duyệt.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">
            Trang này đang được phát triển. Bạn có thể quay lại và thử lại sau.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProposal;
