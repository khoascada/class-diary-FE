// app/(admin)/page.js
import React from 'react';


const AdminHomePage = () => {
  return (
<>
 <div className="text-center py-20 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
          Chào mừng đến với Hệ Thống Quản Trị Trung Tâm! 🛠️
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Khu vực này cho phép bạn cấu hình tổ chức, quản lý vai trò và phân quyền.
        </p>
        
        <div className="flex justify-center gap-6 mt-8">
            {/* Thêm các nút điều hướng nhanh */}
            <a href="/admin/departments" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                Quản Lý Phòng Ban
            </a>
            <a href="/admin/roles" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                Thiết Lập Vai Trò
            </a>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          Vui lòng sử dụng **thanh Sidebar bên trái** để điều hướng đến các chức năng quản lý chi tiết.
        </p>
      </div></>
     

  );
};

export default AdminHomePage;