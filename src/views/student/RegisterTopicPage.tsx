import React, { useState, useEffect, useCallback } from 'react';
import type { Topic, SearchFilters } from '../../models/dto/topic.interface';
import { topicService } from '../../services/TopicService';
import toast from 'react-hot-toast';
import RegisterTopicModal from './modal/RegisterTopicModal';

const RegisterTopicPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    teacherName: '',
    topicName: ''
  });
  const [loading, setLoading] = useState(false);
  const [registeringTopicId, setRegisteringTopicId] = useState<number | null>(null);
  const [totalTopics, setTotalTopics] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDebug, setShowDebug] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const fetchTopics = useCallback(async () => {
    console.log("=== FETCH TOPICS START ===");
    console.log("API URL: http://localhost:3000/thesis/available-topics");
    console.log("Page:", currentPage, "Limit:", itemsPerPage);
    console.log("Token:", localStorage.getItem("access_token") ? "✅ Present" : "❌ Missing");
    
    setLoading(true);
    try {
      const response = await topicService.getAvailableTopics(currentPage, itemsPerPage);
      
      console.log("=== API RESPONSE ===");
      console.log("Full response:", response);
      console.log("Topics count:", response.topics?.length || 0);
      console.log("Total available:", response.total || 0);
      console.log("Topics data:", response.topics);
      
      setTopics(response.topics || []);
      setTotalTopics(response.total || 0);
      
      console.log("✅ Topics loaded successfully");
      console.log("=== FETCH TOPICS END ===");
    } catch (error: unknown) {
      console.error("=== FETCH TOPICS ERROR ===");
      console.error('Error details:', error);
      const err = error as { response?: { status?: number; data?: unknown } };
      console.error('Error response:', err?.response);
      console.error('Error status:', err?.response?.status);
      console.error('Error data:', err?.response?.data);
      
      toast.error('Không thể tải danh sách đề tài. Kiểm tra Console để xem chi tiết.');
      setTopics([]);
      setTotalTopics(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    console.log("=== REGISTER TOPIC PAGE MOUNTED ===");
    console.log("Token:", localStorage.getItem("access_token"));
    console.log("User:", localStorage.getItem("user"));
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ No token found - user not authenticated");
      toast.error("Bạn cần đăng nhập để truy cập trang này");
    } else {
      console.log("✅ Token found, length:", token.length);
    }
    
    fetchTopics();
  }, [fetchTopics]);

  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const response = await topicService.searchTopics(
        filters.teacherName || undefined,
        filters.topicName || undefined,
        1,
        itemsPerPage
      );
      setTopics(response.topics || []);
      setTotalTopics(response.total || 0);
    } catch (error) {
      console.error('Error searching topics:', error);
      toast.error('Không thể tìm kiếm đề tài');
      setTopics([]);
      setTotalTopics(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
  };

  const handleConfirmRegister = async (notes?: string) => {
    if (!selectedTopic) return;

    // Validate required fields
    if (!selectedTopic.thesisRoundId || !selectedTopic.instructorId) {
      toast.error('Thiếu thông tin đợt khóa luận hoặc giảng viên. Vui lòng thử lại.');
      console.error("Missing thesisRoundId or instructorId:", selectedTopic);
      return;
    }

    console.log("=== REGISTER TOPIC START ===");
    console.log("Topic to register:", selectedTopic);
    console.log("ThesisRoundId:", selectedTopic.thesisRoundId);
    console.log("InstructorId:", selectedTopic.instructorId);
    console.log("Notes:", notes);
    console.log("Current token:", localStorage.getItem("access_token"));
    
    setRegisteringTopicId(selectedTopic.id);
    try {
      console.log("Calling topicService.registerTopic...");
      const response = await topicService.registerTopic({ 
        thesisRoundId: selectedTopic.thesisRoundId,
        instructorId: selectedTopic.instructorId,
        notes: notes || undefined
      });
      console.log("Register topic response:", response);
      toast.success(response.message || `Đã đăng ký đề tài: ${selectedTopic.title}`);
      handleCloseModal();
      fetchTopics();
    } catch (error: unknown) {
      console.error("=== REGISTER TOPIC ERROR ===");
      console.error('Error registering topic:', error);
      const err = error as { response?: { data?: { message?: string }; status?: number } };
      const errorMessage = err?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký đề tài';
      toast.error(errorMessage);
    } finally {
      setRegisteringTopicId(null);
      console.log("=== REGISTER TOPIC END ===");
    }
  };

  // Lấy thông tin sinh viên từ localStorage
  const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };

  const totalPages = Math.ceil(totalTopics / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Đăng ký đề tài</h1>
            <p className="mt-2 text-gray-600">Tìm kiếm và đăng ký đề tài khóa luận tốt nghiệp</p>
          </div>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            {showDebug ? '🔍 Ẩn Debug' : '🔍 Debug Info'}
          </button>
        </div>

       
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tìm kiếm đề tài</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên giảng viên
              </label>
              <input
                type="text"
                value={filters.teacherName}
                onChange={(e) => setFilters({...filters, teacherName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên giảng viên..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đề tài
              </label>
              <input
                type="text"
                value={filters.topicName}
                onChange={(e) => setFilters({...filters, topicName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên đề tài..."
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tìm kiếm
          </button>
        </div>

        {/* DataGrid Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách đề tài</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách đề tài...</p>
            </div>
          ) : !topics || topics.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Không tìm thấy đề tài nào</p>
              <p className="text-sm mt-2">Thử điều chỉnh bộ lọc tìm kiếm của bạn</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên đề tài
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giảng viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topics.map((topic, index) => (
                      <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="font-medium">{topic.title}</div>
                          {topic.description && (
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {topic.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {topic.teacher.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {topic.teacher.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {topic.teacher.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {topic.teacher.currentStudents}/{topic.teacher.maxStudents}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            topic.status === 'available' 
                              ? 'bg-green-100 text-green-800'
                              : topic.status === 'full'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {topic.status === 'available' ? 'Có thể đăng ký' : 
                             topic.status === 'full' ? 'Đã đầy' : 'Đã đóng'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleOpenModal(topic)}
                            disabled={topic.status !== 'available'}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                              topic.status === 'available'
                                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {topic.status === 'available' ? 'Đăng ký' : 'Không khả dụng'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> đến{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalTopics)}</span> trong tổng số{' '}
                        <span className="font-medium">{totalTopics}</span> đề tài
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal xác nhận đăng ký */}
        <RegisterTopicModal
          isOpen={showModal}
          onClose={handleCloseModal}
          topic={selectedTopic}
          onConfirm={handleConfirmRegister}
          isRegistering={registeringTopicId === selectedTopic?.id}
          getUserInfo={getUserInfo}
        />
      </div>
    </div>
  );
};

export default RegisterTopicPage;
