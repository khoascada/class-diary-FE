import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { refreshToken, logoutUser } from "../store/slices/authSlice";
import { socketManager } from "../socket";
import { store } from "../store";
import { Spin } from "antd";

const AuthContext = createContext(null);

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/", // Homepage might be public
];

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings", "/admin", "/chat"];

// Routes only for unauthenticated users (redirect to dashboard if logged in)
const GUEST_ONLY_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

// Admin-only routes
const ADMIN_ROUTES = ["/admin", "/admin/users", "/admin/settings"];

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, accessToken } = useAppSelector((state) => state.auth);

  const [isInitializing, setIsInitializing] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if current route requires authentication
  const isPublicRoute = () => {
    return PUBLIC_ROUTES.some((route) => {
      if (route === "/") return pathname === "/";
      return pathname.startsWith(route);
    });
  };

  const isProtectedRoute = () => {
    return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  };

  const isGuestOnlyRoute = () => {
    return GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
  };

  const isAdminRoute = () => {
    return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  };

  // Check if user has required permissions
  const hasPermission = () => {
    if (isAdminRoute()) {
      return user?.role === "admin" || user?.permissions?.includes("admin");
    }
    return true;
  };

  // Token expiry check utility
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime + 300; // 5 minutes buffer
    } catch {
      return true;
    }
  };

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      console.log("🔐 Initializing authentication...");

      // Initialize auth state from storage
      dispatch({ type: "auth/initializeAuth" });

      // Wait for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      const currentState = store.getState().auth;
      const { isAuthenticated: authState, accessToken: token, refreshToken: refToken } = currentState;
      if (authState && token && refToken) {
        // Check if token needs refresh
        if (isTokenExpired(token)) {
          console.log("⏰ Token expired, refreshing...");

          try {
            await dispatch(refreshToken()).unwrap();
            console.log("✅ Token refreshed successfully");

            // Connect socket after successful refresh
            if (socketManager) {
              socketManager.connect();
            }
          } catch (error) {
            console.error("❌ Token refresh failed:", error);
            await dispatch(logoutUser());
            router.push("/login");
            return;
          }
        } else {
          console.log("✅ Token is valid, run socket");
          // Connect socket if token is valid
          if (socketManager) {
            socketManager.connect();
          }
        }
      }
    } catch (error) {
      console.error("💥 Auth initialization failed:", error);
    } finally {
      setIsInitializing(false);
      setAuthChecked(true);
    }
  };

  // Handle route protection - Kiểm tra quyền truy cập route hiện tại
  const handleRouteProtection = async () => {
  if (isInitializing || !authChecked) return;

  const currentPath = pathname;
  console.log(`🛡️ Checking route protection for: ${currentPath}`);
  // Case 1: Guest-only routes + user is authenticated; nếu user đã login nhưng vào trang login, register,.. -> đá vào trang home
  if (isGuestOnlyRoute() && isAuthenticated) {
    console.log("🔄 Authenticated user accessing guest route, redirecting to dashboard");
    router.replace("/");
    return;
  }

  // Case 2: Protected routes + user not authenticated
  if (isProtectedRoute() && !isAuthenticated) {
    console.log("🚫 Unauthenticated user accessing protected route, redirecting to login");
    router.replace("/login");
    return;
  }

  // Case 3: Admin routes + user is not admin
  if (isAdminRoute() && isAuthenticated && !hasPermission()) {
    console.log("🚫 Non-admin user accessing admin route, redirecting");
    router.replace("/forbidden");
    return;
  }

  // Case 4: All good
  console.log("✅ Route access granted");
};


  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle route protection when auth state or route changes
  useEffect(() => {
    handleRouteProtection();
  }, [isAuthenticated, user, pathname, authChecked, isInitializing]);

  // Listen for route changes
  // useEffect(() => {
  //   const handleRouteChangeStart = (url) => {
  //     console.log(`🔄 Route changing to: ${url}`);
  //   };

  //   const handleRouteChangeComplete = (url) => {
  //     console.log(`✅ Route changed to: ${url}`);
  //     // Re-check protection on route change
  //     setTimeout(handleRouteProtection, 100);
  //   };

  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   router.events.on('routeChangeComplete', handleRouteChangeComplete);

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChangeStart);
  //     router.events.off('routeChangeComplete', handleRouteChangeComplete);
  //   };
  // }, [router.events]);

  // Auto logout when token expires - cứ 1p check token
  
  useEffect(() => {
  if (!isAuthenticated || !accessToken) return;

  const checkTokenExpiry = async () => {
    if (isTokenExpired(accessToken)) {
      console.log("⏰ AccessToken expired, trying to refresh...");

      if (refreshToken) {
        try {
          await dispatch(refreshToken()).unwrap();
          console.log("✅ Token refreshed successfully");
        } catch {
          console.log("❌ Refresh failed, logging out");
          dispatch(logoutUser());
        }
      } else {
        dispatch(logoutUser());
      }
    }
  };

  const interval = setInterval(checkTokenExpiry, 60 * 1000);

  return () => clearInterval(interval);
}, [isAuthenticated, accessToken, refreshToken, dispatch]);


  // Context value - Đưa ra cho component con gọi trong useAuth()
  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    isInitializing,
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logoutUser()),
    refreshToken: () => dispatch(refreshToken()),
    hasPermission,
    isPublicRoute,
    isProtectedRoute,
    isAdminRoute,
  };

  // Loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show loading for protected routes while checking auth
  if (!authChecked && isProtectedRoute()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
