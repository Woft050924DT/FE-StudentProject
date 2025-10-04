import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface TopicSearchFormProps {
  onSearch: (searchData: SearchFormData) => void;
}

interface SearchFormData {
  topicCode: string;
  topicName: string;
  batchNames: string[];
  academicYear: string;
}

const TopicSearchForm: React.FC<TopicSearchFormProps> = ({ onSearch }) => {
  const [formData, setFormData] = useState<SearchFormData>({
    topicCode: '',
    topicName: '',
    batchNames: ['Đợt 1', 'Đợt 3'],
    academicYear: 'Tất cả'
  });

  const availableBatches = ['Đợt 1', 'Đợt 2', 'Đợt 3', 'Đợt 4'];
  const academicYears = ['Tất cả', '2023-2024', '2024-2025', '2025-2026'];

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBatchToggle = (batch: string) => {
    setFormData(prev => ({
      ...prev,
      batchNames: prev.batchNames.includes(batch)
        ? prev.batchNames.filter(b => b !== batch)
        : [...prev.batchNames, batch]
    }));
  };

  const removeBatch = (batch: string) => {
    setFormData(prev => ({
      ...prev,
      batchNames: prev.batchNames.filter(b => b !== batch)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tìm kiếm</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mã đề tài */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã đề tài
            </label>
            <input
              type="text"
              value={formData.topicCode}
              onChange={(e) => handleInputChange('topicCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mã đề tài"
            />
          </div>

          {/* Tên đề tài */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đề tài
            </label>
            <input
              type="text"
              value={formData.topicName}
              onChange={(e) => handleInputChange('topicName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên đề tài"
            />
          </div>

          {/* Tên đợt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đợt
            </label>
            <div className="relative">
              <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-md min-h-[38px]">
                {formData.batchNames.map((batch) => (
                  <span
                    key={batch}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {batch}
                    <button
                      type="button"
                      onClick={() => removeBatch(batch)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-1 space-y-1">
                {availableBatches.map((batch) => (
                  <label key={batch} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.batchNames.includes(batch)}
                      onChange={() => handleBatchToggle(batch)}
                      className="mr-2"
                    />
                    {batch}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Năm học áp dụng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm học áp dụng
            </label>
            <select
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Search className="h-4 w-4" />
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicSearchForm;

