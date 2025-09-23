import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import uiSlice from './slices/uiSlice'

// Middleware for persisting auth state
const authPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  // Save auth state to storage when it changes
  if (action.type.startsWith('auth/')) {
    const { isAuthenticated, user } = store.getState().auth
    if (isAuthenticated && user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }

  return result
}

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authPersistMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})
