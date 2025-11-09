/**
 * API Client with JWT Authentication
 * Automatically attaches tokens to all requests
 */

import axios from "axios";

export const extractApiData = <T = any>(payload: any): T => {
  if (payload && typeof payload === "object" && payload !== null) {
    if ("pagination" in payload && "data" in payload) {
      return payload as T;
    }

    if ("data" in payload) {
      return payload.data as T;
    }
  }

  return payload as T;
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post("/api/auth/refresh", {
            refreshToken,
          });

          const tokens = extractApiData(response.data) as {
            accessToken?: string;
            refreshToken?: string;
          };
          const { accessToken, refreshToken: newRefreshToken } = tokens;

          if (!accessToken || !newRefreshToken) {
            throw new Error("Invalid refresh token response");
          }

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions for auth
export const authHelpers = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return !!token && token !== "undefined";
  },
};

export default apiClient;
