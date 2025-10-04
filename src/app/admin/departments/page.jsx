'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import { ChevronRight, ChevronDown, Edit2, Trash2, Search, Building2, Plus } from 'lucide-react';
import { PlusOutlined } from '@ant-design/icons';
import CustomButton from '@/components/antd/button/CustomButton';
import { useFetchService } from '@/hooks/useFetch';
import departmentService from '@/services/departmentService';
import ModalAddDepartment from './ModalAddDepartment';
import ModalEditDepartment from './ModalEditDepartment';
import { Table } from 'antd';
import ModalAddMemberToDepartment from './ModalAddMemberToDepartment';
export default function DepartmentsPage() {
  const { modal, message } = App.useApp();

  const { data: departments = [], refetch: reFetchDepartments } = useFetchService(
    departmentService.getListDepartment,
    [],
    []
  );

  const [selectedIdDepartment, setSelectedIdDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [expandedDepts, setExpandedDepts] = useState({});
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Mock users data - TODO: Replace with API
  const users = [
    { id: 1, name: 'Nguyễn Văn An', email: 'nva@school.edu.vn', department: 1, role: 1 },
    { id: 2, name: 'Trần Thị Bích', email: 'ttb@school.edu.vn', department: 2, role: 3 },
  ];

  const getDepartmentById = (id) => departments.find((d) => d.id === id);
  const getUsersByDepartment = (deptId) => users.filter((u) => u.department === deptId);

  const toggleDepartment = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const handleDeleteDepartment = () => {
    if (!selectedIdDepartment) return;

    modal.confirm({
      title: 'Xác nhận xóa',
      content: (
        <div>
          Bạn có chắc chắn muốn xóa phòng ban <strong>{selectedIdDepartment.name}</strong> không?
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await departmentService.deleteDepartment(selectedIdDepartment.id);
          message.success('Xóa phòng ban thành công');
          reFetchDepartments();
          setSelectedIdDepartment(null);
        } catch (err) {
          console.error('Error when delete department', err);
          message.error('Xóa phòng ban thất bại');
        }
      },
    });
  };

  const handleEditDepartment = () => {
    setShowEditDeptModal(true);
  };

  const DepartmentTree = ({ deptId, level = 0 }) => {
    const dept = getDepartmentById(deptId);
    if (!dept) return null;

    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts[deptId];
    const isSelected = selectedIdDepartment === deptId;

    return (
      <div>
        <div
          className={`flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100 ${
            isSelected ? 'border-l-4 border-blue-500 bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedIdDepartment(dept?.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDepartment(deptId);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {!hasChildren && <span className="w-4"></span>}
          <Building2 size={16} className="text-blue-600" />
          <span className="text-sm font-medium">{dept.name}</span>
        </div>
        {hasChildren &&
          isExpanded &&
          dept.children.map((childId) => (
            <DepartmentTree key={childId} deptId={childId} level={level + 1} />
          ))}
      </div>
    );
  };

  const usersTable = useMemo(() => {
    if (!selectedDepartment) return [];

    const users = selectedDepartment.account_roles;
    return users?.map((user, index) => {
      return { ...user, key: index };
    });
  }, [selectedDepartment]);

  const columns = [
    {
      title: 'STT',
      key: 'STT',
      width: '5%',
      align: 'center',
      render: (text, _, index) => index + 1,
    },

    {
      title: 'Tên',
      dataIndex: 'user_name',
      key: 'user_name',
      width: '20%',
      render: (text) => <span className="font-medium">{text ? text : '-'}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      render: (text) => <span className="text-gray-500">{text ? text : '-'}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: '15%',
      render: (text) => <span className="text-gray-500">{text ? text : '-'}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (text) => <span className="text-gray-500">{text ? text : '-'}</span>,
    },
  ];

  const fetchInfoDepartment = async () => {
    try {
      const response = await departmentService.getInfoDepartment(selectedIdDepartment);
      setSelectedDepartment(response);
    } catch (err) {
      console.error('error when fetch info department', err);
    }
  };

  useEffect(() => {
    if (!selectedIdDepartment) return;

    fetchInfoDepartment();
  }, [selectedIdDepartment]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      {/* Department List */}
      <div className="">
        <div className="mb-4 flex items-center justify-between">
          <CustomButton color="add" icon={<PlusOutlined />} onClick={() => setShowDeptModal(true)}>
            Tạo Phòng ban
          </CustomButton>
        </div>
        <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-md shadow-sm">
          {departments
            .filter((d) => !d.parent)
            .map((dept) => (
              <DepartmentTree key={dept.id} deptId={dept.id} />
            ))}
        </div>
      </div>

      {/* Department Detail */}
      <div>
        {selectedIdDepartment ? (
          <div className="flex flex-col gap-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDepartment.name}</h3>

                <p className="mt-1 text-sm text-gray-600">
                  <span>Mô tả: {selectedDepartment.description}</span>
                  {selectedDepartment.parent && (
                    <span className="ml-1">- Thuộc: {selectedDepartment.parent.name}</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-600">Mã: {selectedDepartment.code}</p>
              </div>
              <div className="flex gap-2">
                <CustomButton variant="text" color="edit" onClick={handleEditDepartment}>
                  <Edit2 size={16} />
                </CustomButton>
                <CustomButton variant="text" color="delete" onClick={handleDeleteDepartment}>
                  <Trash2 size={16} />
                </CustomButton>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <h4 className="mb-3 font-semibold text-gray-800">Nhân Viên Thuộc Phòng Ban</h4>
                <CustomButton color="add" onClick={() => setShowAddMember(true)}>
                  <Plus size={14} />
                </CustomButton>
              </div>
              <Table
                dataSource={usersTable}
                columns={columns}
                rowKey="key"
                pagination={false}
                locale={{ emptyText: 'Chưa có nhân viên' }}
                className="overflow-y-auto rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Building2 size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Chọn một phòng ban để xem chi tiết</p>
          </div>
        )}
      </div>

      <ModalAddDepartment
        visible={showDeptModal}
        departments={departments}
        setVisible={setShowDeptModal}
        fetchDepartment={reFetchDepartments}
      />
      <ModalEditDepartment
        visible={showEditDeptModal}
        departmentInit={selectedDepartment}
        setVisible={setShowEditDeptModal}
        fetchDepartment={reFetchDepartments}
        refetchSelectedDepartment={fetchInfoDepartment}
      />
      <ModalAddMemberToDepartment
        visible={showAddMember}
        departments={departments}
        setVisible={setShowAddMember}
        fetchDepartment={reFetchDepartments}
      />
    </div>
  );
}
