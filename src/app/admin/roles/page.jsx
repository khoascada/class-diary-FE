'use client';

import React, { useState } from 'react';
import { List, Space, Typography, Tag, Empty, Row, Col, Card, Checkbox } from 'antd';
import { Shield, Edit2, Trash2, Plus, Save, Users } from 'lucide-react';
import { useFetchService } from '@/hooks/useFetch';
import roleService from '@/services/roleService';
import permissionService from '@/services/permissionService';
import CustomButton from '@/components/antd/button/CustomButton';

const { Title, Text, Paragraph } = Typography;

export default function RolesPage() {
  const { data: rolesAPI = [], refetch: refetchRoles } = useFetchService(
    roleService.getListRoles,
    [],
    []
  );
  const { data: permissions = [], refetch: refetchPermission } = useFetchService(
    permissionService.getListPermission,
    [],
    []
  );

  // Mock data - Roles
  const [roles] = useState([
    { id: 1, name: 'Hiệu Trưởng', description: 'Quản lý toàn trường', users: 2 },
    { id: 2, name: 'Phó Hiệu Trưởng', description: 'Hỗ trợ điều hành', users: 4 },
    { id: 3, name: 'Trưởng Khối', description: 'Quản lý khối/tổ chuyên môn', users: 8 },
    { id: 4, name: 'Giáo Viên Chủ Nhiệm', description: 'Phụ trách lớp học', users: 25 },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học', users: 45 },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học', users: 45 },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học', users: 45 },
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({
    1: ['CAN_CREATE_SDB', 'CAN_EDIT_ALL_SDB', 'CAN_DELETE_SDB'],
    2: ['CAN_CREATE_SDB', 'CAN_EDIT_OWN_SDB'],
  });

  const togglePermission = (roleId, permId) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      return { ...prev, [roleId]: updated };
    });
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="!m-0 flex items-center">
            <Shield size={32} className="mr-3" />
            Quản Lý Vai Trò & Phân Quyền
          </Title>
          <Paragraph className="!mt-2 !mb-0 text-base text-gray-600">
            Quản lý các vai trò và phân quyền cho hệ thống
          </Paragraph>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Role List - Sidebar */}
          <div className="col-span-1 max-h-[700px] overflow-y-auto">
            <Card
              title={
                <Space className="w-full justify-between py-2">
                  <span className="font-semibold">Chức Danh</span>
                  <CustomButton color="add" size="small">
                    <Plus size={16} />
                  </CustomButton>
                </Space>
              }
              className="h-full"
              bodyStyle={{ padding: 0 }}
            >
              <List
                dataSource={roles}
                locale={{
                  emptyText: (
                    <Empty
                      image={<Shield size={64} style={{ opacity: 0.3 }} />}
                      description="Chưa có vai trò nào"
                    />
                  ),
                }}
                renderItem={(role) => {
                  const isSelected = selectedRole?.id === role.id;
                  const permCount = rolePermissions[role.id]?.length || 0;

                  return (
                    <List.Item className="!border-none !p-0">
                      <div
                        onClick={() => setSelectedRole(role)}
                        className={`w-full cursor-pointer border-b p-4 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:bg-gray-100'
                        }`}
                      >
                        <Space direction="vertical" className="w-full" size={6}>
                          <Space className="w-full justify-between">
                            <Space>
                              <Shield size={20} color={isSelected ? '#1890ff' : '#8c8c8c'} />
                              <div className={`font-semibold ${isSelected ? 'text-select' : ''}`}>
                                {role.name}
                              </div>
                            </Space>
                            <Space size={4}>
                              <CustomButton
                                color="edit"
                                variant="text"
                                size="small"
                                icon={<Edit2 size={14} />}
                              />
                              <CustomButton
                                color="delete"
                                variant="text"
                                size="small"
                                icon={<Trash2 size={14} />}
                              />
                            </Space>
                          </Space>

                          <Text type="secondary" className="text-[13px]">
                            {role.description}
                          </Text>

                          <Space size={8}>
                            <Tag color="blue">{permCount} quyền</Tag>
                            <Tag color="green">{role.users} người dùng</Tag>
                          </Space>
                        </Space>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Card>
          </div>

          {/* Permission Management - Main Content */}
          <div className="col-span-2">
            {selectedRole ? (
              <Card
                title={
                  <Text strong className="text-base">
                    Phân Quyền Chi Tiết
                  </Text>
                }
                bodyStyle={{ padding: 4 }}
                className="h-full"
              >
                {permissions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((perm) => {
                      const isAssigned = rolePermissions[selectedRole.id]?.includes(perm.name);

                      return (
                        <div key={perm.id} className={`p-3 transition-colors`}>
                          <Space align="start" className="w-full" size="small">
                            <Checkbox
                              checked={isAssigned}
                              onChange={() => togglePermission(selectedRole.id, perm.name)}
                            />
                            <div className="flex-1">
                              <Text className="mb-1 block">{perm.description}</Text>
                            </div>
                          </Space>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty description="Không có quyền nào" />
                )}
              </Card>
            ) : (
              <Empty
                image={<Shield size={80} style={{ opacity: 0.3 }} />}
                description={
                  <Space direction="vertical" size={8}>
                    <Text strong className="text-lg">
                      Chọn một vai trò
                    </Text>
                    <Text type="secondary">Chọn vai trò từ danh sách bên trái để phân quyền</Text>
                  </Space>
                }
                className="flex h-full flex-col justify-center"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
