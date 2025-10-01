import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiAxios } from '../../api';
import axios from 'axios';
import { notificationService } from '@/lib/utils/notificationService';
// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/login`,
        credentials
      );
      const { accessToken, refreshToken, user } = response.data;

      // Save tokens to storage
      sessionStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed';

      notificationService.error('Login failed!');

      return rejectWithValue(errMsg);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/logout`, {
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error('Error logout:', error);
    notificationService.error('Logout failed!');
  } finally {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      const { accessToken } = response.data;

      sessionStorage.setItem('accessToken', accessToken);

      return { accessToken };
    } catch (error) {
      return rejectWithValue('Token refresh failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('user');

      if (refreshToken && user) {
        state.isAuthenticated = true;
        state.refreshToken = refreshToken;
        state.user = JSON.parse(user);
      }
      if (accessToken) {
        state.accessToken = accessToken;
      }
    },
    updateTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, () => initialState)
      // Refresh
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshToken.rejected, () => initialState);
  },
});

export const { clearError, initializeAuth, updateTokens } = authSlice.actions;
export default authSlice.reducer;
