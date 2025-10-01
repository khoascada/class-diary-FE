'use client';

import React, { useState } from 'react';
import { Shield, Edit2, Trash2 } from 'lucide-react';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import CustomButton from '@/components/button/CustomButton';
import { useFetchService } from '@/hooks/useFetch';
import roleService from '@/services/roleService';

export default function RolesPage() {
  const { data: rolesAPI = [], refetch: refetchRoles } = useFetchService(
    roleService.getListRoles,
    [],
    []
  );

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
    { id: 'CAN_VIEW_REPORTS', name: 'Xem Báo Cáo', category: 'Báo Cáo' },
    { id: 'CAN_EXPORT_DATA', name: 'Xuất Dữ Liệu', category: 'Báo Cáo' },
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
    <div className="space-y-6">
      {/* Role List */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Quản lý vai trò</h2>
          <CustomButton color="add" icon={<PlusOutlined />}>
            Tạo Vai Trò
          </CustomButton>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{role.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{role.description}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {rolePermissions[role.id]?.length || 0} quyền
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="rounded p-1 text-blue-600 hover:bg-blue-50">
                    <Edit2 size={14} />
                  </button>
                  <button className="rounded p-1 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Assignment */}
      {selectedRole ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Đang phân quyền cho vai trò:</p>
            <p className="text-lg font-semibold text-gray-900">{selectedRole.name}</p>
            <p className="mt-1 text-sm text-gray-600">{selectedRole.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* System Permissions List */}
            <div>
              <h3 className="mb-3 font-semibold text-gray-800">Danh Sách Quyền Hệ Thống</h3>
              <div className="max-h-96 overflow-y-auto rounded-lg border p-4">
                {Object.entries(grouped).map(([category, perms]) => (
                  <div key={category} className="mb-4">
                    <h4 className="mb-2 rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700">
                      {category}
                    </h4>
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700"
                      >
                        <Shield size={14} className="text-gray-400" />
                        <span>{perm.name}</span>
                        <span className="text-xs text-gray-400">({perm.id})</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Permissions */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Quyền Đã Gán</h3>
                <CustomButton color="save" icon={<SaveOutlined />}>
                  Lưu
                </CustomButton>
              </div>
              <div className="max-h-96 overflow-y-auto rounded-lg border p-4">
                {Object.entries(grouped).map(([category, perms]) => (
                  <div key={category} className="mb-4">
                    <h4 className="mb-2 rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700">
                      {category}
                    </h4>
                    {perms.map((perm) => {
                      const isAssigned = rolePermissions[selectedRole.id]?.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => togglePermission(selectedRole.id, perm.id)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">{perm.name}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="py-12 text-center text-gray-500">
            <Shield size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Chọn một vai trò để phân quyền</p>
          </div>
        </div>
      )}
    </div>
  );
}