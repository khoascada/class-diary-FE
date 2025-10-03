'use client';
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
import CustomButton from '@/components/antd/button/CustomButton';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useFetchService } from '@/hooks/useFetch';
import ModalAddDepartment from './departments/ModalAddDepartment';
import departmentService from '@/services/departmentService';
import ModalEditDepartment from './departments/ModalEditDepartment';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/lib/store/slices/authSlice';
import roleService from '@/services/roleService';
const AdminDashboard = () => {
  // get api department
  const { data: departments, refetch: reFetchDepartments } = useFetchService(
    departmentService.getListDepartment,
    [],
    []
  );
  // get api role
  const { data: rolesAPI, refetch: refetchRoles } = useFetchService(
    roleService.getListRoles,
    [],
    []
  );

  const dispatch = useDispatch();
  const { modal, message } = App.useApp();
  const [activeSection, setActiveSection] = useState('organization');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [searchDept, setSearchDept] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);

  // Mock data - Roles
  const [roles] = useState([
    { id: 1, name: 'Hiệu Trưởng', description: 'Quản lý toàn trường' },
    { id: 2, name: 'Phó Hiệu Trưởng', description: 'Hỗ trợ điều hành' },
    { id: 3, name: 'Trưởng Khối', description: 'Quản lý khối/tổ chuyên môn' },
    { id: 4, name: 'Giáo Viên Chủ Nhiệm', description: 'Phụ trách lớp học' },
    { id: 5, name: 'Giáo Viên Bộ Môn', description: 'Giảng dạy môn học' },
  ]);

  // Mock data - System Permissions
  const systemPermissions = [
    { id: 'CAN_CREATE_SDB', name: 'Tạo Sổ Đầu Bài', category: 'Sổ Đầu Bài' },
    {
      id: 'CAN_EDIT_OWN_SDB',
      name: 'Sửa SĐB Của Mình',
      category: 'Sổ Đầu Bài',
    },
    { id: 'CAN_EDIT_ALL_SDB', name: 'Sửa Tất Cả SĐB', category: 'Sổ Đầu Bài' },
    { id: 'CAN_DELETE_SDB', name: 'Xóa Sổ Đầu Bài', category: 'Sổ Đầu Bài' },
    { id: 'CAN_VIEW_ALL_SDB', name: 'Xem Tất Cả SĐB', category: 'Sổ Đầu Bài' },
    {
      id: 'CAN_MANAGE_USERS',
      name: 'Quản Lý Người Dùng',
      category: 'Hệ Thống',
    },
    {
      id: 'CAN_MANAGE_DEPARTMENTS',
      name: 'Quản Lý Phòng Ban',
      category: 'Hệ Thống',
    },
    { id: 'CAN_MANAGE_ROLES', name: 'Quản Lý Vai Trò', category: 'Hệ Thống' },
    { id: 'CAN_ASSIGN_PERMISSIONS', name: 'Phân Quyền', category: 'Hệ Thống' },
    { id: 'CAN_VIEW_REPORTS', name: 'Xem Báo Cáo', category: 'Báo Cáo' },
    { id: 'CAN_EXPORT_DATA', name: 'Xuất Dữ Liệu', category: 'Báo Cáo' },
    {
      id: 'CAN_APPROVE_SDB',
      name: 'Phê Duyệt Sổ Đầu Bài',
      category: 'Quy Trình',
    },
  ];

  // Mock data - Role Permissions
  const [rolePermissions, setRolePermissions] = useState({
    1: [
      'CAN_CREATE_SDB',
      'CAN_EDIT_ALL_SDB',
      'CAN_DELETE_SDB',
      'CAN_VIEW_ALL_SDB',
      'CAN_MANAGE_USERS',
      'CAN_MANAGE_DEPARTMENTS',
      'CAN_MANAGE_ROLES',
      'CAN_ASSIGN_PERMISSIONS',
      'CAN_VIEW_REPORTS',
      'CAN_EXPORT_DATA',
      'CAN_APPROVE_SDB',
    ],
    2: [
      'CAN_CREATE_SDB',
      'CAN_EDIT_ALL_SDB',
      'CAN_VIEW_ALL_SDB',
      'CAN_VIEW_REPORTS',
      'CAN_EXPORT_DATA',
      'CAN_APPROVE_SDB',
    ],
    3: [
      'CAN_CREATE_SDB',
      'CAN_EDIT_OWN_SDB',
      'CAN_VIEW_ALL_SDB',
      'CAN_VIEW_REPORTS',
      'CAN_APPROVE_SDB',
    ],
    4: ['CAN_CREATE_SDB', 'CAN_EDIT_OWN_SDB', 'CAN_VIEW_ALL_SDB'],
    5: ['CAN_CREATE_SDB', 'CAN_EDIT_OWN_SDB'],
  });

  // Mock data - Users
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

  const getDepartmentById = (id) => departments.find((d) => d.id === id);
  const getRoleById = (id) => roles.find((r) => r.id === id);
  const getUsersByDepartment = (deptId) => users.filter((u) => u.department === deptId);

  const toggleDepartment = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId], // nếu chưa có sẽ thêm key mới vào obj
    }));
  };

  const togglePermission = (roleId, permId) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      return { ...prev, [roleId]: updated };
    });
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment?.id) return;

    modal.confirm({
      title: 'Xác nhận xóa',
      content: (
        <div>
          Bạn có chắc chắn muốn xóa phòng ban <strong>{selectedDepartment.name}</strong> không?
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await departmentService.deleteDepartment(selectedDepartment.id);
          message.success('Xóa phòng ban thành công');
          reFetchDepartments();
          setSelectedDepartment(null);
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
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const DepartmentTree = ({ deptId, level = 0 }) => {
    const dept = getDepartmentById(deptId);
    if (!dept) return null;

    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts[deptId];
    const isSelected = selectedDepartment?.id === deptId;

    return (
      <div>
        <div
          className={`flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100 ${
            isSelected ? 'border-l-4 border-blue-500 bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedDepartment(dept)}
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
  const renderOrganizationManagement = () => (
    <div className="grid grid-cols-2 gap-6">
      {/* Department Management */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Quản Lý Phòng Ban</h2>
          <div className="flex gap-2">
            <CustomButton
              color="add"
              icon={<PlusOutlined />}
              onClick={() => setShowDeptModal(true)}
            >
              Tạo Phòng ban
            </CustomButton>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng ban..."
              className="w-full rounded-lg border py-2 pr-4 pl-10 text-sm"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-lg border p-2">
          {departments
            .filter((d) => !d.parent)
            .map((dept) => (
              <DepartmentTree key={dept.id} deptId={dept.id} />
            ))}
        </div>
      </div>

      {/* Department Detail */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Chi Tiết Phòng Ban</h2>

        {selectedDepartment ? (
          <div className="flex flex-col gap-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDepartment.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{selectedDepartment.description}</p>
                {selectedDepartment.parent && (
                  <p className="mt-2 text-xs text-gray-500">
                    Thuộc: {selectedDepartment?.parent?.name}
                  </p>
                )}
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
              <h4 className="mb-3 font-semibold text-gray-800">Nhân Viên Thuộc Phòng Ban</h4>
              <div className="max-h-80 divide-y overflow-y-auto rounded-lg border">
                {getUsersByDepartment(selectedDepartment.id).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                      {getRoleById(user.role)?.name}
                    </span>
                  </div>
                ))}
                {getUsersByDepartment(selectedDepartment.id).length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">Chưa có nhân viên</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Building2 size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Chọn một phòng ban để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPermissionManagement = () => {
    const grouped = systemPermissions.reduce((acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {});

    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Phân quyền cho vai trò</h2>

        {/* Role Management */}
        <div className="mb-6 rounded-lg p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Quản lý vai trò</h2>
            <CustomButton color="add" icon={<PlusOutlined />}>
              <span>Tạo Vai Trò</span>
            </CustomButton>
          </div>

          <div className="max-h-96 divide-y overflow-y-auto rounded-lg border">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`cursor-pointer p-3 hover:bg-gray-50 ${
                  selectedRole?.id === role.id ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{role.name}</p>
                    <p className="mt-1 text-xs text-gray-600">{role.description}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {rolePermissions[role.id]?.length || 0} quyền
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
        {selectedRole ? (
          <div>
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
          <div className="py-12 text-center text-gray-500">
            <Shield size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Chọn một vai trò từ phần Quản Lý Tổ chức để phân quyền</p>
          </div>
        )}
      </div>
    );
  };

  const renderUserRoleAssignment = () => (
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
                        {getDepartmentById(user.department)?.name}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {getRoleById(user.role)?.name}
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
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex w-64 flex-col bg-gray-900 text-white">
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-xs text-gray-400">Quản Lý Sổ Đầu Bài</p>
        </div>

        <nav className="flex flex-1 flex-col space-y-2 p-4">
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left ${
              activeSection === 'organization' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('organization')}
          >
            <Building2 size={20} />
            <span>Quản Lý Tổ Chức</span>
          </button>
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left ${
              activeSection === 'permissions' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('permissions')}
          >
            <Shield size={20} />
            <span>Phân Quyền</span>
          </button>
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left ${
              activeSection === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('users')}
          >
            <Users size={20} />
            <span>Gán Vai Trò</span>
          </button>
          <button
            className={`mt-auto flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left`}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeSection === 'organization' && renderOrganizationManagement()}
          {activeSection === 'permissions' && renderPermissionManagement()}
          {activeSection === 'users' && renderUserRoleAssignment()}
        </div>
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
      />
    </div>
  );
};

export default AdminDashboard;
