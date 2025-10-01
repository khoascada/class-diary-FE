'use client';
import { useEffect } from 'react';
import { ConfigProvider, App } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import AppHeader from '@/components/layouts/header/AppHeader';
import { AuthProvider, useAuth } from '@/lib/providers/AuthProvider';
import { notificationService } from '@/lib/utils/notificationService';

// Tạo component con để sử dụng useApp (message API của Antd)
function NotificationSetup({ children }) {
  const { message } = App.useApp();

  useEffect(() => {
    notificationService.setMessageApi(message);
  }, [message]);

  return children;
}

// Component con để check route từ useAuth
function LayoutWrapper({ children }) {
  const { isLoginRoute, isAdminRoute } = useAuth();
  if (isLoginRoute) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header cố định ở trên cùng */}
      <header className="sticky top-0 z-50">
        <AppHeader />
      </header>

      {/* Main content có thể cuộn */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-16 my-4 min-h-[calc(100vh-8rem)]">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-8 flex w-full justify-between px-8 py-4 text-center text-sm text-gray-600 shadow-md">
        <span>Hi im your</span>
        <span>Design by: Khoa</span>
      </footer>
    </div>
  );
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: 8,
              colorTextBase: '#171717',
              colorBgBase: '#fff',
            },
          }}
        >
          <App component={false}>
            <NotificationSetup>
              <LayoutWrapper>{children}</LayoutWrapper>
            </NotificationSetup>
          </App>
        </ConfigProvider>
      </AuthProvider>
    </Provider>
  );
}
