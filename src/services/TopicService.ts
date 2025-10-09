import { apiService } from './ApiService';
import type { Topic, TopicRegistration } from '../models/dto/topic.interface';

// Backend response structure
interface BackendTopicResponse {
  success: boolean;
  data: BackendTopic[];
}

interface BackendTopic {
  id: number;
  topicCode: string;
  topicTitle: string;
  topicDescription: string | null;
  objectives: string | null;
  studentRequirements: string | null;
  technologiesUsed: string | null;
  topicReferences: string | null;
  instructor: {
    id: number;
    instructorCode: string;
    fullName: string;
    email: string;
    phone: string;
  };
  thesisRound?: {
    id: number;
    roundName: string;
  };
}

// Frontend response structure
export interface AvailableTopicsResponse {
  topics: Topic[];
  total: number;
  page: number;
  limit: number;
}

export interface RegisterTopicRequest {
  thesisRoundId: number;
  instructorId: number;
  notes?: string;
}

export interface RegisterTopicResponse {
  registration: TopicRegistration;
  message: string;
}

export interface ApproveRegistrationRequest {
  registrationId: number;
  isApproved: boolean;
  notes?: string;
}

export interface ApproveRegistrationResponse {
  message: string;
  registration: TopicRegistration;
}

export interface StudentRegistrationDetail extends TopicRegistration {
  student: {
    id: string;
    studentId: string;
    fullName: string;
    email: string;
    phone: string;
    classId: string;
  };
  topic: {
    id: number;
    title: string;
    thesisRound?: {
      id: number;
      roundName: string;
    };
  };
  instructor: {
    id: number;
    fullName: string;
    email: string;
  };
}

class TopicService {
  /**
   * Lấy danh sách đề tài có thể đăng ký cho sinh viên
   */
  async getAvailableTopics(page: number = 1, limit: number = 10): Promise<AvailableTopicsResponse> {
    try {
      const response = await apiService.get<BackendTopicResponse>(
        `/thesis/available-topics?page=${page}&limit=${limit}`
      );
      
      console.log("=== BACKEND RESPONSE ===");
      console.log("Raw response:", response.data);
      
      // Map backend structure to frontend structure
      const backendData = response.data;
      const topics: Topic[] = Array.isArray(backendData.data) 
        ? backendData.data.map((item: BackendTopic) => ({
            id: item.id,
            title: item.topicTitle,
            description: item.topicDescription || undefined,
            status: 'available' as const, // Backend chưa có field này, default là available
            teacher: {
              id: item.instructor.id,
              name: item.instructor.fullName,
              email: item.instructor.email,
              phone: item.instructor.phone,
              maxStudents: 5, // Giá trị mặc định, cần backend cung cấp
              currentStudents: 0 // Giá trị mặc định, cần backend cung cấp
            },
            createdAt: new Date().toISOString(), // Backend chưa có
            updatedAt: new Date().toISOString(), // Backend chưa có
            thesisRoundId: item.thesisRound?.id, // ID đợt khóa luận
            instructorId: item.instructor.id, // ID giảng viên
            thesisRound: item.thesisRound // Thông tin đợt khóa luận
          }))
        : [];
      
      console.log("=== MAPPED TOPICS ===");
      console.log("Mapped topics:", topics);
      
      return {
        topics: topics,
        total: topics.length, // Backend chưa có total, dùng length
        page: page,
        limit: limit,
      };
    } catch (error) {
      console.error('Error fetching available topics:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm đề tài theo bộ lọc
   */
  async searchTopics(
    teacherName?: string,
    topicName?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AvailableTopicsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (teacherName) params.append('teacherName', teacherName);
      if (topicName) params.append('topicName', topicName);

      const response = await apiService.get<BackendTopicResponse>(
        `/thesis/available-topics?${params.toString()}`
      );
      
      // Map backend structure to frontend structure
      const backendData = response.data;
      const topics: Topic[] = Array.isArray(backendData.data) 
        ? backendData.data.map((item: BackendTopic) => ({
            id: item.id,
            title: item.topicTitle,
            description: item.topicDescription || undefined,
            status: 'available' as const,
            teacher: {
              id: item.instructor.id,
              name: item.instructor.fullName,
              email: item.instructor.email,
              phone: item.instructor.phone,
              maxStudents: 5,
              currentStudents: 0
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            thesisRoundId: item.thesisRound?.id, // ID đợt khóa luận
            instructorId: item.instructor.id, // ID giảng viên
            thesisRound: item.thesisRound // Thông tin đợt khóa luận
          }))
        : [];
      
      return {
        topics: topics,
        total: topics.length,
        page: page,
        limit: limit,
      };
    } catch (error) {
      console.error('Error searching topics:', error);
      throw error;
    }
  }

  /**
   * Đăng ký đề tài
   */
  async registerTopic(data: RegisterTopicRequest): Promise<RegisterTopicResponse> {
    try {
      const response = await apiService.post<RegisterTopicResponse>(
        '/thesis/register-topic',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error registering topic:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết đề tài
   */
  async getTopicById(topicId: number): Promise<Topic> {
    try {
      const response = await apiService.get<Topic>(`/thesis/proposed-topics/${topicId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topic details:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả đề tài (proposed topics)
   */
  async getAllProposedTopics(): Promise<Topic[]> {
    try {
      const response = await apiService.get<Topic[]>('/thesis/proposed-topics');
      return response.data;
    } catch (error) {
      console.error('Error fetching proposed topics:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách đăng ký đề tài của sinh viên hiện tại
   */
  async getMyRegistrations(): Promise<TopicRegistration[]> {
    try {
      const response = await apiService.get<TopicRegistration[]>('/thesis/my-registrations');
      return response.data;
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách sinh viên đã đăng ký đề tài (cho giảng viên)
   */
  async getStudentRegistrations(): Promise<StudentRegistrationDetail[]> {
    try {
      const response = await apiService.get<StudentRegistrationDetail[] | { data: StudentRegistrationDetail[] }>('/thesis/student-registrations');
      console.log("=== GET STUDENT REGISTRATIONS ===");
      console.log("Raw response:", response.data);
      console.log("Response type:", typeof response.data);
      console.log("Is array:", Array.isArray(response.data));
      
      // Backend có thể trả về { data: [...] } hoặc trực tiếp [...]
      let registrations: StudentRegistrationDetail[] = [];
      
      if (Array.isArray(response.data)) {
        registrations = response.data;
        console.log("✅ Response is direct array");
      } else if (response.data && Array.isArray(response.data.data)) {
        registrations = response.data.data;
        console.log("✅ Response has nested data array");
      } else if (response.data && typeof response.data === 'object') {
        // Nếu là object, thử tìm array trong các properties
        console.log("⚠️ Response is object, searching for array...");
        console.log("Object keys:", Object.keys(response.data));
        const possibleArrays = Object.values(response.data).find(val => Array.isArray(val));
        if (possibleArrays) {
          registrations = possibleArrays as StudentRegistrationDetail[];
          console.log("✅ Found array in object properties");
        }
      }
      
      console.log("=== MAPPED REGISTRATIONS ===");
      console.log("Total count:", registrations.length);
      
      // Log chi tiết từng registration để debug
      registrations.forEach((reg, index) => {
        console.log(`Registration ${index + 1}:`, {
          id: reg.id,
          studentName: reg.student?.fullName,
          studentId: reg.student?.studentId,
          topicTitle: reg.topic?.title,
          instructorName: reg.instructor?.fullName,
          status: reg.status
        });
      });
      
      return registrations;
    } catch (error) {
      console.error('❌ Error fetching student registrations:', error);
      return []; // Trả về empty array thay vì throw để tránh crash
    }
  }

  /**
   * Phê duyệt hoặc từ chối đăng ký đề tài
   */
  async approveRegistration(data: ApproveRegistrationRequest): Promise<ApproveRegistrationResponse> {
    try {
      const response = await apiService.post<ApproveRegistrationResponse>(
        '/thesis/approve-registration',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error approving/rejecting registration:', error);
      throw error;
    }
  }
}

export const topicService = new TopicService();
