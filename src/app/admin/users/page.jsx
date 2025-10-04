'use client';

import React, { useState } from 'react';
import { List, Space, Typography, Tag, Empty, Card, Checkbox } from 'antd';
import { Search, Users, Shield, Save, UserCircle, Mail, Building2, Award } from 'lucide-react';
import { SaveOutlined } from '@ant-design/icons';
import CustomButton from '@/components/antd/button/CustomButton';
import { useFetchService } from '@/hooks/useFetch';
import departmentService from '@/services/departmentService';
import roleService from '@/services/roleService';
import CustomTag from '@/components/antd/tag/CustomTag';
export default function UsersPage() {
  const { data: departments = [], refetch: reFetchDepartments } = useFetchService(
    departmentService.getListDepartment,
    [],
    []
  );

  // const { data: roles = [] } = useFetchService(roleService.getListRoles, [], []);
  // Mock data - Roles
  const [roles] = useState([
    { id: 1, name: 'Hiệu Trưởng', description: 'Quản lý toàn trường' },
    { id: 2, name: 'Phó Hiệu Trưởng', description: 'Hỗ trợ điều hành' },
    { id: 3, name: 'Trưởng Khối', description: 'Quản lý khối/tổ chuyên môn' },
    { id: 4, name: 'Giáo Viên Chủ Nhiệm', description: 'Phụ trách lớp học' },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học' },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUser, setSearchUser] = useState('');

  // Mock users - TODO: Replace with API
  const [users] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nva@school.edu.vn',
      role_department: [
        {
          role: 1,
          department: 1,
        },
        {
          role: 2,
          department: 3,
        },
      ],
      avatar: null,
      phone: '0123456789',
      status: 'active',
    },
    {
      id: 2,
      name: 'Trần Thị Bích',
      email: 'ttb@school.edu.vn',
      role_department: [
        {
          role: 2,
          department: 2,
        },
      ],
      avatar: null,
      phone: '0987654321',
      status: 'active',
    },
    {
      id: 3,
      name: 'Lê Văn Cường',
      email: 'lvc@school.edu.vn',
      role_department: [
        {
          role: 3,
          department: 2,
        },
      ],
      avatar: null,
      phone: '0912345678',
      status: 'active',
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      email: 'ptd@school.edu.vn',
      role_department: [
        {
          role: 4,
          department: 3,
        },
      ],
      avatar: null,
      phone: '0345678901',
      status: 'inactive',
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      email: 'hve@school.edu.vn',
      role_department: [
        {
          role: 5,
          department: 3,
        },
      ],
      avatar: null,
      phone: '0567890123',
      status: 'active',
    },
  ]);

  const getDepartmentById = (id) => departments.find((d) => d.id === id);
  const getRoleById = (id) => roles.find((r) => r.id === id);

  // Mock permissions for preview
  const rolePermissions = {
    1: [
      { id: 'CAN_CREATE_SDB', name: 'Tạo Sổ Đầu Bài' },
      { id: 'CAN_EDIT_ALL_SDB', name: 'Sửa Tất Cả SĐB' },
      { id: 'CAN_DELETE_SDB', name: 'Xóa Sổ Đầu Bài' },
      { id: 'CAN_MANAGE_USERS', name: 'Quản Lý Người Dùng' },
    ],
    2: [
      { id: 'CAN_CREATE_SDB', name: 'Tạo Sổ Đầu Bài' },
      { id: 'CAN_EDIT_OWN_SDB', name: 'Sửa SĐB Của Mình' },
      { id: 'CAN_VIEW_ALL_SDB', name: 'Xem Tất Cả SĐB' },
    ],
    3: [
      { id: 'CAN_CREATE_SDB', name: 'Tạo Sổ Đầu Bài' },
      { id: 'CAN_EDIT_OWN_SDB', name: 'Sửa SĐB Của Mình' },
    ],
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gán vai trò và phòng ban cho người dùng trong hệ thống
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* User List */}
          <div className="col-span-2 max-h-[700px] overflow-y-auto rounded-lg bg-white shadow">
            <h2 className="p-4 text-lg font-semibold text-gray-900">Danh Sách Người Dùng</h2>
            <div className="relative sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
              <Search size={16} className="absolute top-6.5 left-7 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                className="w-full rounded-lg py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
            <div className="">
              <List
                dataSource={users.filter(
                  (u) =>
                    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchUser.toLowerCase())
                )}
                locale={{
                  emptyText: (
                    <div className="p-8 text-center text-gray-500">
                      <Search size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Không tìm thấy người dùng</p>
                    </div>
                  ),
                }}
                renderItem={(user) => (
                  <List.Item
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`cursor-pointer transition-colors hover:bg-gray-100 ${
                      selectedUser?.id === user.id ? 'border-l-4 border-blue-500 bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex w-full items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-gray-900">{user.name}</p>
                        </div>
                        <p className="truncate text-sm text-gray-600">{user.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {user.role_department.map((rd, index) => (
                            <div key={index} className="flex flex-wrap">
                              <CustomTag color="blue">
                                {getDepartmentById(rd.department)?.name}
                              </CustomTag>
                              <CustomTag color="orange">{getRoleById(rd.role)?.name}</CustomTag>
                              {index !== user.role_department.length - 1 ? '|' : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>

          {/* User Detail & Role Assignment */}
          <div className="col-span-3 h-full">
            {selectedUser ? (
              <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                {/* User Info Card */}
                <div className="border-b border-[#B6BABD] pb-2">
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
                      {getInitials(selectedUser.name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail size={14} />
                              <span className="text-sm">{selectedUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <UserCircle size={14} />
                              <span className="text-sm">{selectedUser.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Form */}
                <div className="">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Phân Quyền</h3>
                    <CustomButton color="save" icon={<SaveOutlined />}>
                      Lưu Thay Đổi
                    </CustomButton>
                  </div>

                  <div className="space-y-6">
                    {/* Department Selection */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Phòng Ban
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        value={selectedUser.department}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            department: parseInt(e.target.value),
                          })
                        }
                      >
                        <option value="">Chọn phòng ban</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Vai Trò
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        value={selectedUser.role}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, role: parseInt(e.target.value) })
                        }
                      >
                        <option value="">Chọn vai trò</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name} - {role.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions Preview */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Quyền Hạn Của Vai Trò
                  </h3>
                  {rolePermissions[selectedUser.role] ? (
                    <div className="grid grid-cols-2 gap-3">
                      {rolePermissions[selectedUser.role].map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3"
                        >
                          <Shield size={16} className="flex-shrink-0 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{perm.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                      <Shield size={40} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Chọn vai trò để xem quyền hạn</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[600px] items-center justify-center rounded-lg bg-white shadow">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Users size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Chọn một người dùng</h3>
                  <p className="mt-2 text-gray-600">
                    Chọn người dùng từ danh sách bên trái để phân quyền
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
