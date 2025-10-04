export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  maxStudents: number;
  currentStudents: number;
}

export interface Topic {
  id: number;
  title: string;
  teacher: Teacher;
  description?: string;
  status: 'available' | 'full' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface TopicRegistration {
  id: number;
  topicId: number;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  notes?: string;
}

export interface SearchFilters {
  teacherName: string;
  topicName: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

