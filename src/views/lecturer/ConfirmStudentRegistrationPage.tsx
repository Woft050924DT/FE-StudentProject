import React, { useState, useEffect, useCallback } from 'react';
import { topicService, type StudentRegistrationDetail } from '../../services/TopicService';
import toast from 'react-hot-toast';
import { Check, X, Eye } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const ConfirmStudentRegistrationPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<StudentRegistrationDetail[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<StudentRegistrationDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistrationDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

  const fetchRegistrations = useCallback(async () => {
    console.log("=== FETCH STUDENT REGISTRATIONS START ===");
    console.log("API: GET /thesis/student-registrations");
    
    setLoading(true);
    try {
      const data = await topicService.getStudentRegistrations();
      console.log("Registrations loaded:", data);
      setRegistrations(data || []);
      setFilteredRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Không thể tải danh sách đăng ký');
      setRegistrations([]);
      setFilteredRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Filter registrations
  useEffect(() => {
    let filtered = registrations;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filter by search term (student name or ID)
    if (searchTerm) {
      filtered = filtered.filter(r =>
        (r.student?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (r.student?.studentId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRegistrations(filtered);
  }, [registrations, statusFilter, searchTerm]);

  const handleOpenConfirmModal = (registration: StudentRegistrationDetail, action: 'approve' | 'reject') => {
    setSelectedRegistration(registration);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedRegistration(null);
    setConfirmAction(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedRegistration || !confirmAction) return;

    console.log("=== APPROVE/REJECT REGISTRATION ===");
    console.log("Registration ID:", selectedRegistration.id);
    console.log("Action:", confirmAction);

    setProcessingId(selectedRegistration.id);
    try {
      const response = await topicService.approveRegistration({
        registrationId: selectedRegistration.id,
        isApproved: confirmAction === 'approve'
      });
      
      toast.success(response.message || `Đã ${confirmAction === 'approve' ? 'phê duyệt' : 'từ chối'} đăng ký`);
      handleCloseConfirmModal();
      fetchRegistrations();
    } catch (error: unknown) {
      console.error('Error processing registration:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetail = (registration: StudentRegistrationDetail) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // Defensive programming: ensure registrations is always an array
  const safeRegistrations = Array.isArray(registrations) ? registrations : [];
  const pendingCount = safeRegistrations.filter(r => r.status === 'pending').length;
  const approvedCount = safeRegistrations.filter(r => r.status === 'approved').length;
  const rejectedCount = safeRegistrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Xác nhận đăng ký đề tài</h1>
          <p className="mt-2 text-gray-600">Quản lý và phê duyệt đăng ký đề tài của sinh viên</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Tổng đăng ký</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{safeRegistrations.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-yellow-700">Chờ duyệt</div>
            <div className="mt-2 text-3xl font-bold text-yellow-900">{pendingCount}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-green-700">Đã duyệt</div>
            <div className="mt-2 text-3xl font-bold text-green-900">{approvedCount}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-red-700">Từ chối</div>
            <div className="mt-2 text-3xl font-bold text-red-900">{rejectedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm sinh viên
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên hoặc mã sinh viên..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* DataGrid Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách đăng ký ({filteredRegistrations.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Không tìm thấy đăng ký nào</p>
              <p className="text-sm mt-2">Thử điều chỉnh bộ lọc của bạn</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã SV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên sinh viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SĐT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đề tài
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đợt KL
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
                  {filteredRegistrations.map((registration, index) => (
                    <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.student?.studentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.student?.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.student?.classId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.student?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.student?.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={registration.topic?.title || 'Không có thông tin'}>
                          {registration.topic?.title || 'Không có thông tin'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.topic?.thesisRound?.roundName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(registration)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {registration.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOpenConfirmModal(registration, 'approve')}
                                disabled={processingId === registration.id}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                title="Phê duyệt"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleOpenConfirmModal(registration, 'reject')}
                                disabled={processingId === registration.id}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Từ chối"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết đăng ký</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Student Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Thông tin sinh viên</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mã sinh viên</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.student?.studentId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tên sinh viên</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.student?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Lớp</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.student?.classId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.student?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.student?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Topic Info */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Thông tin đề tài</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tên đề tài</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedRegistration.topic?.title || 'Không có thông tin'}</p>
                    </div>
                    {selectedRegistration.topic?.thesisRound && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Đợt khóa luận</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRegistration.topic.thesisRound.roundName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedRegistration.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghi chú từ sinh viên</h3>
                    <p className="text-sm text-gray-700">{selectedRegistration.notes}</p>
                  </div>
                )}

                {/* Registration Info */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ngày đăng ký</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedRegistration.registeredAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                      <p className="mt-1">{getStatusBadge(selectedRegistration.status)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                {selectedRegistration.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenConfirmModal(selectedRegistration, 'reject');
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenConfirmModal(selectedRegistration, 'approve');
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Phê duyệt
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && selectedRegistration && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {confirmAction === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn có chắc chắn muốn {confirmAction === 'approve' ? 'phê duyệt' : 'từ chối'} đăng ký của sinh viên{' '}
                  <span className="font-semibold">{selectedRegistration.student?.fullName || 'N/A'}</span> cho đề tài{' '}
                  <span className="font-semibold">{selectedRegistration.topic?.title || 'N/A'}</span>?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseConfirmModal}
                    disabled={processingId === selectedRegistration.id}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={processingId === selectedRegistration.id}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 flex items-center ${
                      confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {processingId === selectedRegistration.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      confirmAction === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmStudentRegistrationPage;

