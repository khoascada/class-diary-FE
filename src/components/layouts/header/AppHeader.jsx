"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/lib/store/slices/authSlice";
import UserInfoModal from "./UserInfoModal";
const AppHeader = () => {
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const listMenu = [
    { title: "Trang chủ", path: "/" },
    { title: "A", path: "/A" },
    { title: "B", path: "/B" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  console.log('isUserModalOpen', isUserModalOpen)
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <>
      <header className="flex items-center justify-between h-16 px-6 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}

        {/* Menu giữa */}
        <nav className="flex-1 flex justify-center items-center">
          <ul className="flex gap-8">
            {listMenu.map((menu) => {
              const isActive = pathname === menu.path;
              return (
                <li key={menu.path}>
                  <Link
                    href={menu.path}
                    className={`
                px-2 py-1 rounded-md transition-colors
                ${isActive ? "text-texthead font-semibold underline" : "hover:text-texthead"}
              `}
                  >
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Tên user */}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{userInfo?.user_name}</span>

            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>

            {/* Dropdown arrow */}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{userInfo?.user_name}</p>
                <p className="text-sm text-gray-500">khoa.nguyen@gmail.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:!bg-gray-100 flex items-center gap-3 transition-colors cursor-pointer"
                  onClick={handleUserInfo}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
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
