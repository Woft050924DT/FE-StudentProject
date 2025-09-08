import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:block bg-gradient-to-b from-white to-indigo-50 border-r border-indigo-100 p-4">
      <nav className="space-y-2">
        <a className="block px-3 py-2 rounded hover:bg-indigo-100/80 text-gray-700 font-medium" href="#">Dashboard</a>
        <a className="block px-3 py-2 rounded hover:bg-indigo-100/80 text-gray-700" href="#">Đồ án của tôi</a>
        <a className="block px-3 py-2 rounded hover:bg-indigo-100/80 text-gray-700" href="#">Nhóm</a>
        <a className="block px-3 py-2 rounded hover:bg-indigo-100/80 text-gray-700" href="#">Giảng viên</a>
        <a className="block px-3 py-2 rounded hover:bg-indigo-100/80 text-gray-700" href="#">Cài đặt</a>
      </nav>
    </aside>
  );
};

export default Sidebar;


