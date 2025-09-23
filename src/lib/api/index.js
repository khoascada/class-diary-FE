import axios from 'axios'
import { notification } from "antd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API;

// Notification global config
notification.config({
  placement: "topRight",
  top: 64,
  duration: 3,
});

// Create axios instance
export const apiAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false; // tránh gọi refresh api nhiều lần
let failedQueue = []; // danh sách request đang chờ refresh

// retry lại các request đang chờ
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add auth token dynamically
apiAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors with auto refresh
apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { status, data } = error.response || {};
    
    // Handle 401 - Token expired
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiAxios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        // No refresh token, logout immediately
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Call refresh token API
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Save new tokens
        sessionStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update authorization header for original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        return apiAxios(originalRequest);
        
      } catch (refreshError) {
        // Refresh token expired or invalid
        processQueue(refreshError, null);
        handleLogout();
        
        notification.error({
          message: "Session Expired",
          description: "Your session has expired. Please login again.",
        });
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error status codes
    switch (status) {      
      case 403:
        notification.error({
          message: "Access Denied",
          description: "You don't have permission to perform this action.",
        });
        break;
        
      case 404:
        notification.error({
          message: "Resource Not Found",
          description: data?.message || "The requested resource was not found.",
        });
        break;
        
      case 422:
        notification.error({
          message: "Validation Error",
          description: data?.message || "Please check your input data.",
        });
        break;
        
      case 500:
        notification.error({
          message: "Server Error",
          description: "Something went wrong on our end. Please try again later.",
        });
        break;
        
      default:
        if (status !== 401) { // Don't show error for 401 as it's handled above
          notification.error({
            message: "Error",
            description: data?.message || "An unexpected error occurred.",
          });
        }
    }
    
    return Promise.reject(error.response);
  }
);

// Logout helper function
const handleLogout = () => {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user"); // Clear user data if stored
  // Redirect to login page
  window.location.href = '/login';
};

// Helper functions for common API patterns
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return error;
};

export const createAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Helper for multipart/form-data requests (file uploads)
export const createMultipartConfig = (token) => ({
  headers: {
    'Content-Type': 'multipart/form-data',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Manual token refresh function (optional)
export const refreshTokenManually = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    sessionStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    handleLogout();
    throw error;
  }
};

// Check if tokens are available
export const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return !!accessToken && !!refreshToken;
};