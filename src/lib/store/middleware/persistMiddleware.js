import { storage } from '../../utils/storage';

// Middleware to persist specific state slices
// lưu state vào local để khi tắt trình duyệt vẫn còn
const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // List of actions that should trigger persistence
  const persistActions = [
    // Auth actions
    'auth/loginUser/fulfilled',
    'auth/updateProfile/fulfilled',
    'auth/initializeAuth',

    // UI preferences
    'ui/setTheme',
    'ui/toggleSidebar',
    'user/updatePreferences',
  ];

  if (persistActions.some((actionType) => action.type === actionType)) {
    const state = store.getState();

    try {
      // Persist auth state
      if (action.type.startsWith('auth/')) {
        const { user, isAuthenticated } = state.auth;
        if (isAuthenticated && user) {
          storage.setLocal('user', user);
          storage.setLocal('isAuthenticated', isAuthenticated);
        }
      }

      // Persist UI preferences
      if (action.type.startsWith('ui/')) {
        storage.setLocal('uiPreferences', {
          theme: state.ui.theme,
          sidebarOpen: state.ui.sidebarOpen,
        });
      }

      // Persist user preferences
      if (action.type.startsWith('user/updatePreferences')) {
        storage.setLocal('userPreferences', state.user.preferences);
      }
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }

  return result;
};

export default persistMiddleware;
