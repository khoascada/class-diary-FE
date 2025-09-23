"use client";

import { Geist, Geist_Mono } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const content =
    pathname === "/login" ? (
      children
    ) : (
      <div className="flex flex-col min-h-screen">
        {/* Header cố định ở trên cùng */}
        <header className="sticky top-0 z-50">
          <AppHeader />
        </header>

        {/* Main content có thể cuộn */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 my-4 mx-16 min-h-[calc(100vh-8rem)]">{children}</div>
        </main>

        <footer className="mt-8 py-4 text-gray-600 text-center text-sm shadow-md w-full flex justify-between px-8">
          <span>© 2025 Web Sổ Đầu Bài. Tất cả quyền được bảo lưu.</span>
          <span>Design by: Khoa</span>
        </footer>
      </div>
    );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#b22222",
                fontFamily: "Lora, sans-serif",
                borderRadius: 8,
                colorTextBase: "#171717",
                colorBgBase: "#fff",
              },
            }}
          >
            {content}
          </ConfigProvider>
        </Provider>
      </body>
    </html>
  );
}
