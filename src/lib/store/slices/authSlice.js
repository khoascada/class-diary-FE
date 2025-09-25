import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiAxios } from "../../api";

// Async thunks
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await apiAxios.post('/auth/login', credentials)
//       const { accessToken, refreshToken, user } = response.data

//       // Save tokens to storage
//       sessionStorage.setItem('accessToken', accessToken)
//       localStorage.setItem('refreshToken', refreshToken)

//       return { user, accessToken, refreshToken }
//     } catch (error) {
//       return rejectWithValue(error.data?.message || 'Login failed')
//     }
//   }
// )
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    // Fake delay để giả lập call API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fake dữ liệu user
    const fakeUser = {
      id: 1,
      name: "Nguyễn Phúc Đăng Khoa",
      email: credentials.email,
      role: credentials.email === "admin@example.com" ? "admin" : "user",
    };

    const fakeAccessToken = "fakeAccessToken123";
    const fakeRefreshToken = "fakeRefreshToken456";

    // Lưu token vào storage như thật
    sessionStorage.setItem("accessToken", fakeAccessToken);
    localStorage.setItem("refreshToken", fakeRefreshToken);

    return { user: fakeUser, accessToken: fakeAccessToken, refreshToken: fakeRefreshToken };
  } catch (error) {
    return rejectWithValue("Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    // await apiAxios.post("/auth/logout");
  } catch (error) {
    // Continue logout even if API fails
  } finally {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  }
});

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await apiAxios.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    sessionStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return rejectWithValue("Token refresh failed");
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const user = localStorage.getItem("user");

      if (accessToken && refreshToken && user) {
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = JSON.parse(user);
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
