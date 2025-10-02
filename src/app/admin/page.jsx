// app/(admin)/page.js
import React from 'react';

const AdminHomePage = () => {
  return (
    <>
      <div className="rounded-lg bg-white py-20 text-center shadow-xl">
        <h2 className="mb-4 text-3xl font-extrabold text-blue-700">
          Chào mừng đến với Hệ Thống Quản Trị Trung Tâm! 🛠️
        </h2>
        <p className="mb-6 text-lg text-gray-600">
          Khu vực này cho phép bạn cấu hình tổ chức, quản lý vai trò và phân quyền.
        </p>

        <div className="mt-8 flex justify-center gap-6">
          {/* Thêm các nút điều hướng nhanh */}
          <a
            href="/admin/departments"
            className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-green-600"
          >
            Quản Lý Phòng Ban
          </a>
          <a
            href="/admin/roles"
            className="rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-purple-600"
          >
            Thiết Lập Vai Trò
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Vui lòng sử dụng **thanh Sidebar bên trái** để điều hướng đến các chức năng quản lý chi
          tiết.
        </p>
      </div>
    </>
  );
};

export default AdminHomePage;
