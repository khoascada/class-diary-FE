"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/lib/store/slices/authSlice";
const AppHeader = () => {
  const pathname = usePathname(); // path hiện tại
  // const router = useRouter()
  const dispatch = useDispatch();
  const listMenu = [
    {title: 'Trang chủ', path: "/"},
    { title: "A", path: "/A" },
    { title: "B", path: "/B" },
  ];

  const handleLogout =  () => {
    dispatch(logoutUser())
  }
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Image 
        src="/next.svg"
        alt="Logo"
        width={100}
        height={50}
        />
      </div>

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
                    ${isActive ? 'text-texthead font-semibold underline' : ' hover:text-texthead'}
                  `}
                >
                  {menu.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Đăng nhập */}
      <div>
        <Button onClick={handleLogout}>
      Đăng xuất
    </Button>
      </div>
    </header>
  );
};

export default AppHeader;
