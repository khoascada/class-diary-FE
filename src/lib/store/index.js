import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import uiSlice from './slices/uiSlice'
import { socketManager } from '../socket'
import { getDefaultMiddleware } from './middleware'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    ui: uiSlice,
  },
  middleware: getDefaultMiddleware,
  devTools: process.env.NODE_ENV !== 'production',
});

// Initialize auth state from storage on app start
// chạy cái này để khi reload sẽ lấy user và authen từ local -> store
const initializeApp = () => {
  console.log("Chạy init App")
  store.dispatch({ type: 'auth/initializeAuth' });
  store.dispatch({ type: 'user/initializeUIPreferences' });


  if (socketManager) {
        try {
          socketManager.connect();
          console.log('🔌 Socket connected after login');
        } catch (error) {
          console.error('Failed to connect socket:', error);
        }
      }
};

// Call on app startup
if (typeof window !== 'undefined') {
  initializeApp();
}