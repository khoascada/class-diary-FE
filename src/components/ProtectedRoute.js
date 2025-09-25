import { useAuth } from '../lib/providers/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Spin, Result } from 'antd';

export const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  guestOnly = false,
  fallback = null 
}) => {
  const { isAuthenticated, user, isInitializing, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    // Guest only routes
    if (guestOnly && isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    // Protected routes
    if (!guestOnly && !isAuthenticated) {
      const returnUrl = router.asPath;
      sessionStorage.setItem('returnUrl', returnUrl);
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Admin only routes
    if (adminOnly && isAuthenticated && !hasPermission()) {
      router.replace('/dashboard');
      return;
    }
  }, [isAuthenticated, user, isInitializing, adminOnly, guestOnly, router]);

  // Loading state
  if (isInitializing) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Guest only + authenticated user
  if (guestOnly && isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Protected route + unauthenticated user
  if (!guestOnly && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="403"
          title="Authentication Required"
          subTitle="Please login to access this page"
        />
      </div>
    );
  }

  // Admin route + non-admin user
  if (adminOnly && isAuthenticated && !hasPermission()) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="403"
          title="Access Denied"
          subTitle="You don't have permission to access this page"
        />
      </div>
    );
  }

  return children;
};