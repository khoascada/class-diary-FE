'use client';
import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, CalendarDays, Clock, AlertTriangle } from 'lucide-react';
import { formatters } from '@/lib/utils/format';
import { Tag } from 'antd';
import CustomButton from '@/components/button/CustomButton';
export default function Home() {
  const [time, setTime] = useState(new Date());

  // Cập nhật giờ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: 'Tổng số',
      value: 28,
      bg: 'bg-blue-50',
      icon: <Users className="mr-2 h-5 w-5 text-blue-600" />,
    },
    {
      label: 'Có mặt',
      value: 27,
      bg: 'bg-green-50',
      icon: <UserCheck className="mr-2 h-5 w-5 text-green-600" />,
    },
    {
      label: 'Vắng',
      value: 1,
      bg: 'bg-red-50',
      icon: <UserX className="mr-2 h-5 w-5 text-red-600" />,
    },
  ];
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-8">
      {/* 1 */}
      <div className="grid w-full grid-cols-1 gap-6 2xl:grid-cols-3">
        <div className="2xl:col-span-2">
          <div className="h-full rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex h-full flex-col">
              <h2 className="mb-2 text-2xl font-semibold text-[#1E293B]">Welcome back, Mr.Khoa!</h2>
              <span className="text-gray-500">
                Đây là bản tóm tắt hàng ngày của bạn. Chúc một ngày làm việc hiệu quả!
              </span>
              <div className="mt-auto flex flex-col justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <span>{formatters.formatDateVi(time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>{time.toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="2xl:col-span-1">
          <div className="flex h-full flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-[#1E293B]">Sĩ số</h3>
            {stats.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg p-3 ${item.bg}`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pending class diary */}
      <div className="flex w-full items-center gap-4 rounded-xl border border-orange-200 bg-orange-50 p-6">
        {/* Icon */}
        <div>
          <AlertTriangle className="h-8 w-8 text-orange-500" />
        </div>
        {/* text */}
        <div className="flex flex-col gap-2">
          <span className="mb-1 text-lg font-semibold text-slate-800">Cập nhật sổ đầu bài</span>
          <span>
            Bạn có 1 tiết học chưa chấm điểm vào{' '}
            <span className="font-medium">
              {formatters.formatDateVi('Sep 24 2025 10:28:47 GMT+0700')}
            </span>
          </span>
          <div className="flex gap-2">
            <Tag color="blue">Toán</Tag>
            <Tag color="green">Lớp 10A1</Tag>
          </div>
        </div>

        {/* Mark now */}
        <CustomButton className="ml-auto" color="mark" onClick={() => console.log('ALO')}>
          Chấm ngay
        </CustomButton>
      </div>
    </div>
  );
}
