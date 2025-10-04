import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loginUser, logoutUser, refreshToken } from '../slices/authSlice';
import { clearAllData } from '../slices/uiSlice';
import { ROLE } from '@/lib/constants';

// Create listener middleware instance
export const authListenerMiddleware = createListenerMiddleware();

// lắng nghe các action được dispatch và thực thi side-effect (code ngoài reducer)
// khi action đó xảy ra.

// Listen for successful login
authListenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  // function đc gọi khi action xảy ra (ở đây là login thành công)
  effect: async (action, listenerApi) => {
    const { user, accessToken, refreshToken } = action.payload;

    // Auto-refresh token before expiry (15 minutes before expiry)
    const tokenExpiry = parseJWT(accessToken)?.exp;
    if (tokenExpiry) {
      const refreshTime = tokenExpiry * 1000 - Date.now() - 15 * 60 * 1000;
      if (refreshTime > 0) {
        setTimeout(() => {
          listenerApi.dispatch(refreshToken());
        }, refreshTime);
      }
    }
    // Redirect based on user role or return URL
    const hasAdminRole = user.department_roles?.some((role) => role.role_name === ROLE.ADMIN);
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      window.location.href = returnUrl;
    } else {
      const defaultRoute = hasAdminRole ? '/admin/departments' : '/home';
      window.location.href = defaultRoute;
    }
  },
});

// Listen for logout
authListenerMiddleware.startListening({
  actionCreator: logoutUser.fulfilled,
  effect: async (action, listenerApi) => {
    console.log('👋 User logged out');

    // Clear all app data
    listenerApi.dispatch(clearAllData());

    // Clear browser storage
    try {
      sessionStorage.clear();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }

    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  },
});

// Listen for token refresh success
authListenerMiddleware.startListening({
  actionCreator: refreshToken.fulfilled,
  effect: async (action, listenerApi) => {
    const { accessToken } = action.payload;
    console.log('🔄 Token refreshed successfully');

    // Schedule next refresh
    const tokenExpiry = parseJWT(accessToken)?.exp;
    if (tokenExpiry) {
      const refreshTime = tokenExpiry * 1000 - Date.now() - 15 * 60 * 1000;
      if (refreshTime > 0) {
        setTimeout(() => {
          listenerApi.dispatch(refreshToken());
        }, refreshTime);
      }
    }
  },
});

// Listen for auth errors
authListenerMiddleware.startListening({
  actionCreator: loginUser.rejected,
  effect: async (action, listenerApi) => {
    const error = action.payload;
    console.error('❌ Login failed:', error);

    // Track failed login attempts
    const attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0') + 1;
    sessionStorage.setItem('loginAttempts', attempts.toString());

    // Block login after 5 failed attempts
    if (attempts >= 5) {
      listenerApi.dispatch({
        type: 'auth/blockLogin',
        payload: { blockedUntil: Date.now() + 15 * 60 * 1000 }, // 15 minutes
      });
    }

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'login_failed', {
        error_message: error,
        attempts: attempts,
      });
    }
  },
});

// Utility function to parse JWT
const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};
