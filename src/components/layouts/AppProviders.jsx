"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "antd";
import { App } from "antd";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import AppHeader from "@/components/layouts/header/AppHeader";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { notificationService } from "@/lib/utils/notificationService";

// Tạo component con để sử dụng useApp
function NotificationSetup({ children }) {
  const { message } = App.useApp();

  useEffect(() => {
    notificationService.setMessageApi(message);
  }, [message]);

  return children;
}

export default function AppProviders({ children }) {
  const pathname = usePathname();

  const content =
    pathname === "/login" || pathname === "/admin" ? (
      children
    ) : (
      <div className="flex flex-col min-h-screen">
        {/* Header cố định ở trên cùng */}
        <header className="sticky top-0 z-50">
          <AppHeader />
        </header>

        {/* Main content có thể cuộn */}
        <main className="flex-1 overflow-y-auto">
          <div className="my-4 mx-16 min-h-[calc(100vh-8rem)]">{children}</div>
        </main>

        {/* Footer */}
        <footer className="mt-8 py-4 text-gray-600 text-center text-sm shadow-md w-full flex justify-between px-8">
          <span>Hi im your</span>
          <span>Design by: Khoa</span>
        </footer>
      </div>
    );

  return (
    <Provider store={store}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#b22222",
              fontFamily: "Inter, sans-serif",
              borderRadius: 8,
              colorTextBase: "#171717",
              colorBgBase: "#fff",
            },
          }}
        >
          <App component={false}>
            <NotificationSetup>{content}</NotificationSetup>
         </App>
        </ConfigProvider>
      </AuthProvider>
    </Provider>
  );
}
