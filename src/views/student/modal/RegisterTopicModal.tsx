import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Topic } from '../../../models/dto/topic.interface';

interface RegisterTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
  onConfirm: (notes?: string) => void;
  isRegistering: boolean;
  getUserInfo: () => Record<string, unknown> | null;
}

const RegisterTopicModal: React.FC<RegisterTopicModalProps> = ({
  isOpen,
  onClose,
  topic,
  onConfirm,
  isRegistering,
  getUserInfo
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen || !topic) return null;

  const userInfo = getUserInfo();

  const handleConfirm = () => {
    onConfirm(notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Xác nhận đăng ký đề tài</h2>
          <button onClick={onClose} disabled={isRegistering} className="text-gray-400 hover:text-gray-500 disabled:opacity-50">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin sinh viên
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sinh viên</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{String(userInfo?.fullName || userInfo?.username || 'N/A')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{String(userInfo?.studentId || userInfo?.username || 'N/A')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{String(userInfo?.email || 'N/A')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{String(userInfo?.phoneNumber || userInfo?.phone || 'N/A')}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Mã lớp</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{String(userInfo?.classId || userInfo?.className || 'N/A')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Thông tin đề tài
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên đề tài</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md font-semibold">{topic.title}</p>
              </div>
              {topic.thesisRound && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Đợt làm khóa luận</label>
                  <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {topic.thesisRound.roundName}
                    </span>
                  </p>
                </div>
              )}
              {topic.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{topic.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Thông tin giảng viên hướng dẫn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên giảng viên</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{topic.teacher.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{topic.teacher.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{topic.teacher.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số sinh viên</label>
                <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded-md">{topic.teacher.currentStudents}/{topic.teacher.maxStudents}</p>
              </div>
            </div>
          </div>

          {/* Ghi chú cho giảng viên */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Ghi chú gửi cho giảng viên (Không bắt buộc)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isRegistering}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              placeholder="Ví dụ: Em có kinh nghiệm về React và Node.js, rất hứng thú với đề tài này..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Bạn có thể gửi lời giới thiệu, kinh nghiệm hoặc lý do muốn làm đề tài này cho giảng viên.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đăng ký. Sau khi đăng ký, bạn cần chờ giảng viên phê duyệt.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isRegistering}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isRegistering}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {isRegistering ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Xác nhận đăng ký
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTopicModal;