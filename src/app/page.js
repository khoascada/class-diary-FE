"use client";
import React from "react";


export default function Home() {
  const sections = [
    {
      title: "Giới thiệu",
      content:
        "Trang web này giúp quản lý sổ đầu bài, theo dõi lớp học, và thời khóa biểu trực quan, tiện lợi, hỗ trợ giáo viên và học sinh.",
      bg: "bg-blue-50",
    },
    {
      title: "Tính năng chính",
      content:
        "1. Xem sổ đầu bài từng lớp.\n2. Quản lý thời khóa biểu.\n3. Theo dõi tiến độ học tập của học sinh.\n4. Báo cáo dữ liệu theo thời gian thực.",
      bg: "bg-green-50",
    },
    {
      title: "Hướng dẫn sử dụng",
      content:
        "Chọn lớp học từ menu, xem sổ đầu bài, đánh dấu điểm danh, ghi chú và xuất báo cáo. Hệ thống hỗ trợ responsive trên mọi thiết bị.",
      bg: "bg-yellow-50",
    },
  ];

  // Tạo nhiều phần tử để trang dài
  const dummyContent = Array.from({ length: 30 }, (_, i) => {
    const section = sections[i % sections.length];
    return (
      <div
        key={i}
        className={`${section.bg} p-8 my-6 rounded-xl shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-2xl w-full max-w-3xl`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {section.title} #{i + 1}{" "}

        </h2>
        <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mb-12 text-5xl font-extrabold text-gray-800 text-center max-w-3xl animate-bounce">
        🎓 Chào mừng đến với Web Sổ Đầu Bài
      </h1>

      <p className="mb-12 text-gray-600 text-center max-w-3xl text-lg leading-relaxed">
        Hệ thống quản lý sổ đầu bài trực tuyến giúp giáo viên dễ dàng theo dõi
        tiến trình học tập của học sinh, quản lý lớp học, thời khóa biểu, và
        xuất báo cáo một cách nhanh chóng.
      </p>

      {dummyContent}

      
    </div>
  );
}
