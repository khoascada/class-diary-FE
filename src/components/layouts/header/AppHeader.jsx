'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectRoleDep } from '@/lib/store/slices/authSlice';
import UserInfoModal from './UserInfoModal';
import { useAuth } from '@/lib/providers/AuthProvider';
import { Select } from 'antd';
const AppHeader = () => {
  const pathname = usePathname();
  const { isAdminRoute } = useAuth();
  const userInfo = useSelector((state) => state.auth.user);
  const {  department_roles,department_role_select} = userInfo;
  const idRole = department_role_select?.id
  const dispatch = useDispatch();
  const listMenu = [
    { title: 'Trang chủ', path: '/home' },
    { title: 'A', path: '/A' },
    { title: 'B', path: '/B' },
  ];
  const adminMenu = [
    { title: 'Phòng ban', path: '/admin/departments' },
    { title: 'Vai trò', path: '/admin/roles' },
    // { title: 'Người dùng', path: '/admin/users' },
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedDepRoleId, setSelectedRoleId] = useState(null);
  const dropdownRef = useRef(null);

  // Function xử lý thông tin user
  const handleUserInfo = () => {
    setIsDropdownOpen(false);
    setIsUserModalOpen(true);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex gap-4 h-16 items-center justify-between bg-white px-6 shadow-md">
        {/* Menu giữa */}
        <nav className="flex flex-1 items-center justify-center">
          <ul className="flex gap-8">
            {(isAdminRoute ? adminMenu : listMenu).map((menu) => {
              const isActive = pathname === menu.path;
              return (
                <li key={menu.path}>
                  <Link
                    href={menu.path}
                    className={`rounded-md px-2 py-1 transition-colors ${isActive ? 'text-texthead font-semibold underline' : 'hover:text-texthead'} `}
                  >
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Select
          value={idRole}
          onChange={(value) => dispatch(selectRoleDep({ id: value }))}
          options={department_roles?.map((depRole) => ({
            value: depRole.id,
            label: (
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold text-gray-800">{depRole.role_name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{depRole.department_name}</span>
              </div>
            ),
          }))}
          className="min-w-[250px]"
        />

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Tên user */}
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {userInfo?.user_name}
            </span>

            {/* Avatar */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <span className="text-sm font-semibold text-white">JD</span>
              </div>
              <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
            </div>

            {/* Dropdown arrow */}
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {/* User Info Section */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{userInfo?.user_name}</p>
                <p className="text-sm text-gray-500">khoa.nguyen@gmail.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:!bg-gray-100"
                  onClick={handleUserInfo}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông tin cá nhân
                </button>

                <hr className="my-1 border-gray-100" />

                <button
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Modal info user */}
      <UserInfoModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
    </>
  );
};

export default AppHeader;
