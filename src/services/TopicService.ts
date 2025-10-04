import { apiService } from './ApiService';
import type { Topic, TopicRegistration } from '../models/dto/topic.interface';

export interface AvailableTopicsResponse {
  topics: Topic[];
  total: number;
  page: number;
  limit: number;
}

export interface RegisterTopicRequest {
  topicId: number;
  notes?: string;
}

export interface RegisterTopicResponse {
  registration: TopicRegistration;
  message: string;
}

class TopicService {
  /**
   * Lấy danh sách đề tài có thể đăng ký cho sinh viên
   */
  async getAvailableTopics(page: number = 1, limit: number = 10): Promise<AvailableTopicsResponse> {
    try {
      const response = await apiService.get<AvailableTopicsResponse>(
        `/thesis/student/available-topics?page=${page}&limit=${limit}`
      );
      return response.data;
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

      const response = await apiService.get<AvailableTopicsResponse>(
        `/thesis/student/available-topics?${params.toString()}`
      );
      return response.data;
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
        '/thesis/student/register-topic',
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
      const response = await apiService.get<Topic>(`/thesis/topics/${topicId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topic details:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách đăng ký đề tài của sinh viên hiện tại
   */
  async getMyRegistrations(): Promise<TopicRegistration[]> {
    try {
      const response = await apiService.get<TopicRegistration[]>('/thesis/student/my-registrations');
      return response.data;
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      throw error;
    }
  }
}

export const topicService = new TopicService();
