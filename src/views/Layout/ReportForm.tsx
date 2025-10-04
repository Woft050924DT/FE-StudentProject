import React, { useState } from 'react';

const ReportForm = () => {
  return (
    
        <main className="flex-1 p-3">
          <div className="text-sm text-gray-600 mb-3">Trang chủ › Báo cáo đồ án tốt nghiệp</div>

          {/* Top info */}
          <div className="border rounded mb-3">
            <div className="grid grid-cols-12 gap-6 p-2 text-sm">
              <label className="ml-7 col-span-2 text-gray-600"><b>Tên giảng viên</b></label>
              <input className="ml-9 col-span-4 border rounded px-2 py-1" defaultValue="Nguyễn Đình Chiến" />
            </div>  
            <div className='grid-cols-12 gap-6 p-2 text-sm'>
              <label className="ml-7 col-span-2 text-gray-600">Tên đề tài</label>
              <input className="ml-9  col-span-4 border rounded px-2 py-1" defaultValue="Đề tài tốt nghiệp ..." />
            </div>
            <div className="flex gap-4 p-2">
              <button className="px-3 py-1 border rounded bg-blue-500 hover:bg-blue-200 text-sm text-white-600">Quy trình hướng dẫn</button>
              
            </div>
            <div className='flex gap-2 p-2'>
              <label>Bản báo cáo cuối</label>
              <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm">Chọn tệp</button>
              <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm">Lưu tệp</button>
            </div>
          </div>

          {/* Form */}
          <div className="border rounded">
            <div className="bg-gray-100 px-3 py-2 font-semibold text-sm">Báo cáo đồ án tốt nghiệp</div>

            <div className="p-3 space-y-3 text-sm">
              <div className="grid grid-cols-12 gap-2 items-center">
                <label className="col-span-2 text-gray-600">Tuần</label>
                <input type="number" className="col-span-2 border rounded px-2 py-1" defaultValue={13} />
                <label className="col-span-2 text-gray-600">Ngày nộp</label>
                <input type="date" className="col-span-3 border rounded px-2 py-1" defaultValue="2023-02-20" />
              </div>

              <div className="grid grid-cols-12 gap-2">
                <label className="col-span-2 text-gray-600">Công việc</label>
                <input className="col-span-10 border rounded px-2 py-1" defaultValue="Xây dựng Website" />
              </div>

              <div className="grid grid-cols-12 gap-2">
                <label className="col-span-2 text-gray-600">Nội dung cần thực hiện</label>
                <input className="col-span-10 border rounded px-2 py-1" defaultValue="Xây dựng các chức năng..." />
              </div>

              <div className="grid grid-cols-12 gap-2">
                <label className="col-span-2 text-gray-600">Kết quả</label>
                <input className="col-span-10 border rounded px-2 py-1" defaultValue="Trang quản trị - Hoàn thành..." />
              </div>

              <div className="grid grid-cols-12 gap-2">
                <label className="col-span-2 text-gray-600">Nội dung báo cáo</label>
                <textarea rows={12} className="col-span-10 border rounded px-2 py-2 font-mono" defaultValue="(Dẫn trích) - Theo Trung tâm" />
              </div>

              <div className="grid grid-cols-12 gap-2">
                <label className="col-span-2 text-gray-600">Link báo cáo</label>
                <input className="col-span-6 border rounded px-2 py-1" placeholder="https://..." />
              </div>

              <div className="flex justify-end">
                <button className="px-3 py-1.5 bg-sky-600 text-white rounded hover:bg-sky-700">Lưu lại</button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-3 border rounded">
            <div className="flex justify-between items-center px-3 py-2 bg-gray-50">
              <div className="text-sm font-semibold">Danh sách báo cáo tuần</div>
              <button className="px-2 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200">Kết xuất ▾</button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 w-16 text-center">STT</th>
                    <th className="border px-2 py-1">Tuần</th>
                    <th className="border px-2 py-1">Nội dung thực hiện</th>
                    <th className="border px-2 py-1 w-40">Đường dẫn</th>
                    <th className="border px-2 py-1 w-40">Nhận xét</th>
                    <th className="border px-2 py-1 w-28 text-center">Điểm báo cáo tuần</th>
                    <th className="border px-2 py-1 w-16 text-center">Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {[13, 12, 11, 10].map((w, i) => (
                    <tr key={w} className="odd:bg-white even:bg-gray-50">
                      <td className="border px-2 py-1 text-center">{i + 1}</td>
                      <td className="border px-2 py-1">{`Tuần ${w}`}</td>
                      <td className="border px-2 py-1">{w === 13 ? '(Dẫn trích) - Theo Trung tâm' : ''}</td>
                      <td className="border px-2 py-1 text-blue-600 underline"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1 text-center"></td>
                      <td className="border px-2 py-1 text-center">
                        <button className="text-sky-600 hover:underline text-xs">Sửa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
     
  );
}

export default ReportForm;