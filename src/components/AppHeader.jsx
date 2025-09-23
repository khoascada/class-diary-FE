"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import Image from "next/image";
import ButtonAnt from "./antd/ButtonAnt";
const AppHeader = () => {
  const pathname = usePathname(); // path hiện tại

  const listMenu = [
    {title: 'Trang chủ', path: "/"},
    { title: "Lớp học", path: "/class" },
    { title: "Sổ đầu bài", path: "/class-diary" },
    { title: "Thời khóa biểu", path: "/timetable" },
  ];

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
        <Button onClick={() => window.location.href="/login"}>
          Đăng nhập
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
