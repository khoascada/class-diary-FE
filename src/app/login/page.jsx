"use client";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    window.location.href="/"
  };

  return (
    <div className="flex  w-full min-h-screen ">
      <div
        className="flex-[7] relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login.jpg')" }}
      >
        {/* Overlay màu nhẹ để chữ nổi bật */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Text ở giữa */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
          <h1 className="text-5xl font-semibold text-white mb-4">
            Chào mừng đến với
          </h1>
          <h2 className="text-3xl font-semibold text-white ">
            Phần mềm quản lý trường học
          </h2>
          <p className="mt-6 text-white/90 text-lg max-w-lg">
            Theo dõi sổ đầu bài, quản lý lớp học, và thời khóa biểu một cách
            trực quan và dễ dàng.
          </p>
        </div>
      </div>

      <div className="flex-[5] shadow-lg rounded-xl p-8 flex flex-col justify-center items-center ">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 ">
          Phần mềm quản lý trường học
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
          <div className="flex flex-col">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              className="border border-gray-300 rounded-sm px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 "
              required
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="border border-gray-300 rounded-sm px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-1 rounded-sm hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}
