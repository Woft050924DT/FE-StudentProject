import React, { useEffect, useMemo, useState } from 'react';

type Reviewer = {
  stt: number;
  ten: string;
  maGV: string;
  tenGV: string;
  email: string;
  sdt: string;
  henLich?: string; // yyyy-MM-dd
  
};

type CouncilMember = {
  stt: number;
  maGV: string;
  tenGV: string;
  maBoMon: string;
  nhiemVu: 'Chủ tịch hội đồng' | 'Thư ký' | 'Ủy viên';
};

const toInputDate = (d: Date) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

const useServerOrClientToday = () => {
  const [date, setDate] = useState<string>(() => toInputDate(new Date()));
  useEffect(() => {
    fetch('/api/server-date')
      .then(r => r.ok ? r.json() as Promise<{ date: string }> : Promise.reject())
      .then(({ date }) => setDate(toInputDate(new Date(date))))
      .catch(() => {});
  }, []);
  return date;
};

export const ReviewForm: React.FC = () => {
  const today = useServerOrClientToday();

  const [reviewers, setReviewers] = useState<Reviewer[]>([
    { stt: 1, ten: 'Giáo viên phản biện 1', maGV: 'huentt', tenGV: 'Nguyễn Thị Thanh Huệ', email: '', sdt: '', henLich: today },
    { stt: 2, ten: 'Giáo viên phản biện 2', maGV: 'dongnh', tenGV: 'Nguyễn Hữu Đông', email: 'dongnh@gmail.com', sdt: '0362335462', henLich: today },
  ]);

  const [council, setCouncil] = useState<CouncilMember[]>([
    { stt: 1, maGV: '1221', tenGV: 'Nguyễn Hữu Đông 1221', maBoMon: 'CNPM', nhiemVu: 'Chủ tịch hội đồng' },
    { stt: 2, maGV: 'quyentv', tenGV: 'Nguyễn Văn Quyết', maBoMon: 'CNPM', nhiemVu: 'Thư ký' },
    { stt: 3, maGV: '1240', tenGV: 'Cô Huệ', maBoMon: 'CNPM', nhiemVu: 'Thư ký' },
    { stt: 4, maGV: 'dongnh', tenGV: 'Nguyễn Hữu Đồng', maBoMon: 'CNPM', nhiemVu: 'Ủy viên' },
    
  ]);

  const titleHoiDong = useMemo(() => `Hội đồng 2 - P512 - 12:00 ${toInputDate(new Date('2023-05-25'))}`, []);

  const changeNhiemVu = (idx: number, val: CouncilMember['nhiemVu']) => {
    setCouncil(prev => prev.map((m, i) => i === idx ? { ...m, nhiemVu: val } : m));
  };

  const changeHenLich = (idx: number, val: string) => {
    setReviewers(prev => prev.map((r, i) => i === idx ? { ...r, henLich: val } : r));
  };

  return (
    <div className="p-4 space-y-6">
      <div className="border rounded">
        <div className="px-3 py-2 font-semibold bg-gray-100">Danh sách giáo viên phản biện</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2 w-16">STT</th>
              <th className="px-3 py-2">Giáo viên phản biện</th>
              <th className="px-3 py-2">Mã giảng viên</th>
              <th className="px-3 py-2">Tên giảng viên</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Số điện thoại</th>
              <th className="px-3 py-2">Hẹn lịch phản biện</th>
              <th className="px-3 py-2 w-20">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {reviewers.map((r, i) => (
              <tr key={r.stt} className={i % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}>
                <td className="px-3 py-2">{r.stt}</td>
                <td className="px-3 py-2">{r.ten}</td>
                <td className="px-3 py-2">{r.maGV}</td>
                <td className="px-3 py-2">{r.tenGV}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.sdt}</td>
                <td className="px-3 py-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={r.henLich || ''}
                    onChange={e => changeHenLich(i, e.target.value)}
                  />
                </td>
                <td className="px-3 py-2">
                  <button className="p-1 hover:text-blue-600" title="Xem">
                    👁
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border rounded">
        <div className="px-3 py-2 font-semibold bg-gray-100">{titleHoiDong}</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2 w-16">STT</th>
              <th className="px-3 py-2">Mã giảng viên</th>
              <th className="px-3 py-2">Tên giảng viên</th>
              <th className="px-3 py-2">Mã Bộ môn</th>
              <th className="px-3 py-2">Nhiệm vụ</th>
            </tr>
          </thead>
          <tbody>
            {council.map((m, i) => (
              <tr key={m.stt} className="bg-white">
                <td className="px-3 py-2">{m.stt}</td>
                <td className="px-3 py-2">{m.maGV}</td>
                <td className="px-3 py-2">{m.tenGV}</td>
                <td className="px-3 py-2">{m.maBoMon}</td>
                <td className="px-3 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={m.nhiemVu}
                    onChange={e => changeNhiemVu(i, e.target.value as CouncilMember['nhiemVu'])}
                  >
                    <option>Chủ tịch hội đồng</option>
                    <option>Thư ký</option>
                    <option>Ủy viên</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewForm;