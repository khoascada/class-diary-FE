'use client';

import React, { useState } from 'react';
import { Shield, Edit2, Trash2, Plus } from 'lucide-react';
import { SaveOutlined } from '@ant-design/icons';
import CustomButton from '@/components/button/CustomButton';
import { useFetchService } from '@/hooks/useFetch';
import roleService from '@/services/roleService';

export default function RolesPage() {
  const { data: rolesAPI = [], refetch: refetchRoles } = useFetchService(
    roleService.getListRoles,
    [],
    []
  );
  // Mock data - Roles
  const [roles] = useState([
    { id: 1, name: 'Hiệu Trưởng', description: 'Quản lý toàn trường' },
    { id: 2, name: 'Phó Hiệu Trưởng', description: 'Hỗ trợ điều hành' },
    { id: 3, name: 'Trưởng Khối', description: 'Quản lý khối/tổ chuyên môn' },
    { id: 4, name: 'Giáo Viên Chủ Nhiệm', description: 'Phụ trách lớp học' },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học' },
  ]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({
    1: ['CAN_CREATE_SDB', 'CAN_EDIT_ALL_SDB', 'CAN_DELETE_SDB'],
    2: ['CAN_CREATE_SDB', 'CAN_EDIT_OWN_SDB'],
  });

  // Mock permissions
  const systemPermissions = [
    { id: 'CAN_CREATE_SDB', name: 'Tạo Sổ Đầu Bài', category: 'Sổ Đầu Bài' },
    { id: 'CAN_EDIT_OWN_SDB', name: 'Sửa SĐB Của Mình', category: 'Sổ Đầu Bài' },
    { id: 'CAN_EDIT_ALL_SDB', name: 'Sửa Tất Cả SĐB', category: 'Sổ Đầu Bài' },
    { id: 'CAN_DELETE_SDB', name: 'Xóa Sổ Đầu Bài', category: 'Sổ Đầu Bài' },
    { id: 'CAN_VIEW_ALL_SDB', name: 'Xem Tất Cả SĐB', category: 'Sổ Đầu Bài' },
    { id: 'CAN_MANAGE_USERS', name: 'Quản Lý Người Dùng', category: 'Hệ Thống' },
    { id: 'CAN_MANAGE_DEPARTMENTS', name: 'Quản Lý Phòng Ban', category: 'Hệ Thống' },
    { id: 'CAN_MANAGE_ROLES', name: 'Quản Lý Vai Trò', category: 'Hệ Thống' },
    { id: 'CAN_ASSIGN_PERMISSIONS', name: 'Phân Quyền', category: 'Hệ Thống' },
    { id: 'CAN_VIEW_REPORTS', name: 'Xem Báo Cáo', category: 'Báo Cáo' },
    { id: 'CAN_EXPORT_DATA', name: 'Xuất Dữ Liệu', category: 'Báo Cáo' },
    { id: 'CAN_APPROVE_SDB', name: 'Phê Duyệt Sổ Đầu Bài', category: 'Quy Trình' },
  ];

  const togglePermission = (roleId, permId) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      return { ...prev, [roleId]: updated };
    });
  };

  const grouped = systemPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Vai Trò & Phân Quyền</h1>
          <p className="mt-2 text-gray-600">Quản lý các vai trò và phân quyền cho hệ thống</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Role List - Sidebar */}
          <div className="col-span-4">
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Danh Sách Vai Trò</h2>
                  <CustomButton color="add" size="small">
                    <Plus size={16} />
                  </CustomButton>
                </div>
              </div>

              <div className="divide-y">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                      selectedRole?.id === role.id ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Shield
                            size={18}
                            className={
                              selectedRole?.id === role.id ? 'text-blue-600' : 'text-gray-400'
                            }
                          />
                          <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{role.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {rolePermissions[role.id]?.length || 0} quyền
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <CustomButton color="edit" variant="text">
                          <Edit2 size={14} />
                        </CustomButton>
                        <CustomButton color="delete" variant="text">
                          <Trash2 size={14} />
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                ))}

                {roles.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Shield size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Chưa có vai trò nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Permission Management - Main Content */}
          <div className="col-span-8">
            {selectedRole ? (
              <div className="space-y-6">
                {/* Role Info Card */}
                <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-600 p-3">
                          <Shield size={24} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h2>
                          <p className="mt-1 text-gray-700">{selectedRole.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                          <p className="text-xs text-gray-600">Tổng quyền</p>
                          <p className="text-xl font-bold text-blue-600">
                            {rolePermissions[selectedRole.id]?.length || 0}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                          <p className="text-xs text-gray-600">Người dùng</p>
                          <p className="text-xl font-bold text-green-600">0</p>
                        </div>
                      </div>
                    </div>
                    <CustomButton color="save" icon={<SaveOutlined />}>
                      Lưu Thay Đổi
                    </CustomButton>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(grouped).map(([category, perms]) => (
                    <div key={category} className="rounded-lg bg-white p-6 shadow">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {perms.map((perm) => {
                          const isAssigned = rolePermissions[selectedRole.id]?.includes(perm.id);
                          return (
                            <label
                              key={perm.id}
                              className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() => togglePermission(selectedRole.id, perm.id)}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                                <p className="text-xs text-gray-500">{perm.id}</p>
                              </div>
                              {isAssigned && (
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                  Đã gán
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[600px] items-center justify-center rounded-lg bg-white shadow">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Shield size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Chọn một vai trò</h3>
                  <p className="mt-2 text-gray-600">
                    Chọn vai trò từ danh sách bên trái để phân quyền
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
