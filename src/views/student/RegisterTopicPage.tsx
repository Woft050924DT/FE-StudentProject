import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Topic, SearchFilters } from "../../models/dto/topic.interface";
import { topicService } from "../../services/TopicService";
import toast from "react-hot-toast";

const RegisterTopicPage: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    teacherName: "",
    topicName: "",
  });
  const [loading, setLoading] = useState(false);
  const [totalTopics, setTotalTopics] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await topicService.getAvailableTopics(
        currentPage,
        itemsPerPage
      );
      setTopics(response.topics);
      setTotalTopics(response.total);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Không thể tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
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
      setTopics(response.topics);
      setTotalTopics(response.total);
    } catch (error) {
      console.error("Error searching topics:", error);
      toast.error("Không thể tìm kiếm đề tài");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTopic = async (topic: Topic) => {
    try {
      await topicService.registerTopic({ topicId: topic.id });
      toast.success(`Đã đăng ký đề tài: ${topic.title}`);
      // Refresh the topics list to update status
      fetchTopics();
    } catch (error) {
      console.error("Error registering topic:", error);
      toast.error("Có lỗi xảy ra khi đăng ký đề tài");
    }
  };

  const totalPages = Math.ceil(totalTopics / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đăng ký đề tài</h1>
          <p className="mt-2 text-gray-600">
            Tìm kiếm và đăng ký đề tài khóa luận tốt nghiệp
          </p>
        </div>


        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tìm kiếm đề tài
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên giảng viên
              </label>
              <input
                type="text"
                value={filters.teacherName}
                onChange={(e) =>
                  setFilters({ ...filters, teacherName: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, topicName: e.target.value })
                }
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

        {/* Topics List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách đề tài
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        STT
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Tên đề tài
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Tên GV
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        SĐT
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Mô tả
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Số SV
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                        Tác vụ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topics.map((topic, index) => (
                      <tr key={topic.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                          {topic.title}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {topic.teacher.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {topic.teacher.email}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {topic.teacher.phone || "—"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate">
                          {topic.description || "Không có mô tả"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {topic.teacher.currentStudents}/
                          {topic.teacher.maxStudents}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleRegisterTopic(topic)}
                            disabled={topic.status !== "available"}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              topic.status === "available"
                                ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {topic.status === "available"
                              ? "Đăng ký"
                              : "Không thể"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - luôn hiển thị, đặt dưới thông báo để tránh dính chữ */}
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col gap-3">
                <div className="text-sm text-gray-700 text-center">
                  {totalTopics > 0 ? (
                    <>
                      Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                      {Math.min(currentPage * itemsPerPage, totalTopics)} trong
                      tổng số {totalTopics} đề tài
                    </>
                  ) : (
                    "Không có đề tài nào để hiển thị"
                  )}
                </div>
                <div className="flex justify-center space-x-2">
                  {/* Lùi đôi */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || totalPages === 0}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1 || totalPages === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    ««
                  </button>

                  {/* Lùi */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || totalPages === 0}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1 || totalPages === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    «
                  </button>

                  {/* Trang hiện tại */}
                  <span className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white">
                    {totalPages === 0 ? 0 : currentPage}
                  </span>

                  {/* Tiến */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages || totalPages === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    »
                  </button>

                  {/* Tiến đôi */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages || totalPages === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    »»
                  </button>
                </div>

                {/* Proposal button aligned right under pagination */}
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate("/student/proposal")}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Đề xuất đề tài
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterTopicPage;
