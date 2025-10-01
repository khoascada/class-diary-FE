"use client"
import React, { useMemo, useState } from 'react';
import { App } from 'antd';
import {
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Search,
  Users,
  Shield,
  Building2,
  Save,
  LogOut,
} from 'lucide-react';
const UsersAdmin = () => {
      const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
    const getDepartmentById = (id) => departments.find((d) => d.id === id);
       const [users] = useState([
          {
            id: 1,
            name: 'Nguyễn Văn An',
            email: 'nva@school.edu.vn',
            department: 1,
            role: 1,
          },
          {
            id: 2,
            name: 'Trần Thị Bích',
            email: 'ttb@school.edu.vn',
            department: 2,
            role: 3,
          },
          {
            id: 3,
            name: 'Lê Văn Cường',
            email: 'lvc@school.edu.vn',
            department: 2,
            role: 4,
          },
          {
            id: 4,
            name: 'Phạm Thị Dung',
            email: 'ptd@school.edu.vn',
            department: 5,
            role: 5,
          },
          {
            id: 5,
            name: 'Hoàng Văn Em',
            email: 'hve@school.edu.vn',
            department: 3,
            role: 4,
          },
          {
            id: 6,
            name: 'Hoàng Văn Em 2',
            email: 'hve@school.edu.vn',
            department: 9,
            role: 5,
          },
          {
            id: 7,
            name: 'Hoàng Văn Em 3',
            email: 'hve@school.edu.vn',
            department: 9,
            role: 5,
          },
          {
            id: 8,
            name: 'Hoàng Văn Em 4',
            email: 'hve@school.edu.vn',
            department: 9,
            role: 5,
          },
        ]);
    return (
        <div className="grid grid-cols-2 gap-6">
      {/* User Selection */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Danh Sách Người Dùng</h2>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              className="w-full rounded-lg border py-2 pr-4 pl-10 text-sm"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-96 divide-y overflow-y-auto rounded-lg border">
          {users
            .filter(
              (u) =>
                u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                u.email.toLowerCase().includes(searchUser.toLowerCase())
            )
            .map((user) => (
              <div
                key={user.id}
                className={`cursor-pointer p-3 hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
   
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
             
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Role Assignment Panel */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Gán Vai Trò</h2>

        {selectedUser ? (
          <div>
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-gray-600">Người dùng:</p>
              <p className="text-lg font-semibold text-gray-900">{selectedUser.name}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phòng Ban Hiện Tại
                </label>
                <div className="rounded-lg border bg-gray-50 p-3">
                  <p className="text-sm font-medium">
                    {getDepartmentById(selectedUser.department)?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getDepartmentById(selectedUser.department)?.description}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Vai Trò Chính
                </label>
                <select
                  className="w-full rounded-lg border p-3 text-sm"
                  value={selectedUser.role} // ✅ React quản lý state
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                  <Save size={18} /> Lưu Thay Đổi
                </button>
              </div>

              {/* Show assigned permissions preview */}
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Quyền Của Vai Trò Này:</h3>
                <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-3">
                  {rolePermissions[selectedUser.role]?.map((permId) => {
                    const perm = systemPermissions.find((p) => p.id === permId);
                    return (
                      <div
                        key={permId}
                        className="flex items-center gap-2 py-1 text-xs text-gray-700"
                      >
                        <Shield size={12} className="text-green-600" />
                        <span>{perm?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Chọn một người dùng để gán vai trò</p>
          </div>
        )}
      </div>
    </div>
    )
}

export default UsersAdmin