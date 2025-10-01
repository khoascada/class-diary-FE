// ===================================================================
// lib/store/middleware/errorMiddleware.js - Error Handling Middleware
// ===================================================================
import { addNotification } from '../slices/uiSlice';

const errorMiddleware = (store) => (next) => (action) => {
  // Handle rejected async thunk actions
  if (action.type.endsWith('/rejected')) {
    const error = action.payload || action.error;

    // Don't show error notifications for certain actions
    const silentErrors = ['auth/refreshToken/rejected', 'user/checkOnlineStatus/rejected'];

    if (!silentErrors.includes(action.type)) {
      store.dispatch(
        addNotification({
          type: 'error',
          message: error?.message || 'An unexpected error occurred',
          duration: 5000,
        })
      );
    }

    // Log error for debugging
    console.error('❌ Action Error:', {
      action: action.type,
      error: error,
      timestamp: new Date().toISOString(),
    });

    // Send to error tracking service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(new Error(error?.message || 'Redux Action Error'), {
        tags: {
          action: action.type,
          component: 'redux-middleware',
        },
        extra: {
          payload: action.payload,
          error: error,
        },
      });
    }
  }

  return next(action);
};

export default errorMiddleware;
