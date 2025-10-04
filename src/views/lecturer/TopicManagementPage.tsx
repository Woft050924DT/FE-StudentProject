import React, { useState, useEffect } from "react";
import { Plus, ArrowUp } from "lucide-react";
import TopicSearchForm from "../../components/TopicSearchForm";
import TopicDataTable from "../../components/TopicDataTable";

interface Topic {
  id: number;
  topicCode: string;
  topicName: string;
  batchName: string;
  description: string;
  studentProposed: string;
}

interface SearchFormData {
  topicCode: string;
  topicName: string;
  batchNames: string[];
  academicYear: string;
}

const TopicManagementPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Set<number>>(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Sample data based on the image
    const sampleTopics: Topic[] = [
      {
        id: 1,
        topicCode: "DTTSPC1",
        topicName: "Đề tài test sự phân công",
        batchName: "Đợt 1",
        description: "",
        studentProposed: ""
      },
      {
        id: 2,
        topicCode: "DTDNDLDX1",
        topicName: "Đề tài do Nguyễn Đức Lĩnh đề xuất GIẢNG VIÊN ĐÃ SỬA oksss",
        batchName: "Đợt 1",
        description: "",
        studentProposed: "10119390: Nguyễn Đức Lĩnh"
      },
      {
        id: 3,
        topicCode: "ĐTĐÁTNT1",
        topicName: "Đề tài đồ án tốt nghiệp test",
        batchName: "Đợt 1",
        description: "",
        studentProposed: ""
      }
    ];
    
    setTopics(sampleTopics);
    setFilteredTopics(sampleTopics);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (searchData: SearchFormData) => {
    let filtered = topics;

    if (searchData.topicCode) {
      filtered = filtered.filter(topic =>
        topic.topicCode.toLowerCase().includes(searchData.topicCode.toLowerCase())
      );
    }

    if (searchData.topicName) {
      filtered = filtered.filter(topic =>
        topic.topicName.toLowerCase().includes(searchData.topicName.toLowerCase())
      );
    }

    if (searchData.batchNames.length > 0) {
      filtered = filtered.filter(topic =>
        searchData.batchNames.includes(topic.batchName)
      );
    }

    setFilteredTopics(filtered);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(filteredTopics.map(topic => topic.id));
      setSelectedTopics(allIds);
    } else {
      setSelectedTopics(new Set());
    }
  };

  const handleSelectTopic = (topicId: number, selected: boolean) => {
    const newSelected = new Set(selectedTopics);
    if (selected) {
      newSelected.add(topicId);
    } else {
      newSelected.delete(topicId);
    }
    setSelectedTopics(newSelected);
  };

  const handleEdit = (topic: Topic) => {
    console.log('Edit topic:', topic);
    // Implement edit functionality
  };

  const handleDelete = (topic: Topic) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề tài "${topic.topicName}"?`)) {
      setTopics(prev => prev.filter(t => t.id !== topic.id));
      setFilteredTopics(prev => prev.filter(t => t.id !== topic.id));
      setSelectedTopics(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(topic.id);
        return newSelected;
      });
    }
  };

  const handleAddTopic = () => {
    console.log('Add new topic');
    // Implement add functionality
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="p-6">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="#" className="text-gray-700 hover:text-blue-600">
                Trang chủ
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">Quản lý đề tài</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Search Form */}
        <TopicSearchForm onSearch={handleSearch} />

        {/* Data Table */}
        <TopicDataTable
          topics={filteredTopics}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectAll={handleSelectAll}
          onSelectTopic={handleSelectTopic}
          selectedTopics={selectedTopics}
        />

        {/* Floating Action Buttons */}
        <div className="fixed right-6 bottom-20 space-y-3">
          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
          
          {/* Add topic button */}
          <button
            onClick={handleAddTopic}
            className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
  );
};

export default TopicManagementPage;

