'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/lib/store/slices/authSlice';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ user_name: user, password }));
  };

  return (
    <div className="flex min-h-screen w-full">
      <div
        className="relative flex-[7] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login.jpg')" }}
      >
        {/* Overlay màu nhẹ để chữ nổi bật */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Text ở giữa */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <h1 className="mb-4 text-5xl font-semibold text-white">Chào mừng đến với</h1>
          <h2 className="text-3xl font-semibold text-white">Phần mềm Test</h2>
          <p className="mt-6 max-w-lg text-lg text-white/90">Theo dõi You.</p>
        </div>
      </div>

      <div className="flex flex-[5] flex-col items-center justify-center rounded-xl p-8 shadow-lg">
        <h1 className="text-primary mb-6 text-center text-3xl font-bold">Phần mềm Project Init</h1>
        <form onSubmit={handleSubmit} className="flex w-[400px] flex-col gap-4">
          <div className="flex flex-col">
            <input
              type="user"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nhập tài khoản"
              className="rounded-sm border border-gray-300 px-4 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="rounded-sm border border-gray-300 px-4 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 cursor-pointer rounded-sm bg-blue-600 py-1 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}
