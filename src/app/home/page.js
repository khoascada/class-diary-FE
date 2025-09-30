"use client";
import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, CalendarDays, Clock, AlertTriangle } from "lucide-react";
import { formatters } from "@/lib/utils/format";
import {  Tag } from "antd";
import CustomButton from "@/components/button/CustomButton";
export default function Home() {
  const [time, setTime] = useState(new Date());

  // Cập nhật giờ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Tổng số",
      value: 28,
      bg: "bg-blue-50",
      icon: <Users className="w-5 h-5 text-blue-600 mr-2" />,
    },
    {
      label: "Có mặt",
      value: 27,
      bg: "bg-green-50",
      icon: <UserCheck className="w-5 h-5 text-green-600 mr-2" />,
    },
    {
      label: "Vắng",
      value: 1,
      bg: "bg-red-50",
      icon: <UserX className="w-5 h-5 text-red-600 mr-2" />,
    },
  ];
  return (
    <div className="flex flex-col items-center gap-8 max-w-[1400px] w-full mx-auto">
      {/* 1 */}
      <div className="w-full grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <div className="2xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-slate-100">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl text-[#1E293B] font-semibold mb-2">Welcome back, Mr.Khoa!</h2>
              <span className="text-gray-500">
                Đây là bản tóm tắt hàng ngày của bạn. Chúc một ngày làm việc hiệu quả!
              </span>
              <div className="mt-auto flex flex-col sm:flex-row justify-between gap-4 mt-auto">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span>{formatters.formatDateVi(time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{time.toLocaleTimeString("vi-VN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="2xl:col-span-1">
          <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm p-6 h-full border border-slate-100">
            <h3 className="text-xl text-[#1E293B] font-semibold mb-2">Sĩ số</h3>
            {stats.map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${item.bg}`}>
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
      <div className="w-full flex items-center bg-orange-50 border border-orange-200 rounded-xl p-6  gap-4">
        {/* Icon */}
        <div>
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        </div>
        {/* text */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-slate-800 mb-1">Cập nhật sổ đầu bài</span>
          <span>
            Bạn có 1 tiết học chưa chấm điểm vào{" "}
            <span className="font-medium">{formatters.formatDateVi("Sep 24 2025 10:28:47 GMT+0700")}</span>
          </span>
          <div className="flex gap-2">
            <Tag color="blue">Toán</Tag>
            <Tag color="green">Lớp 10A1</Tag>
          </div>
        </div>

        {/* Mark now */}
        <CustomButton className="ml-auto" color="mark"  onClick={() => console.log("ALO")}>Chấm ngay</CustomButton>
      </div>
    </div>
  );
}
