import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/use-auth-store";
import { endpoints } from "./apis";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// -------------------------------------
// Axios Instance
// -------------------------------------

export const axiosInstance = axios.create({
  withCredentials: true,
});

// -------------------------------------
// Request Interceptor
// -------------------------------------

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// -------------------------------------
// Token Refresh State
// -------------------------------------

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const req of failedQueue) {
    if (error) {
      req.reject(error);
    } else {
      req.resolve(token!);
    }
  }
  failedQueue = [];
};

const isAuthUrl = (url?: string) =>
  url?.includes("/auth/login") ||
  url?.includes("/auth/signup") ||
  url?.includes(endpoints.REFRESH_TOKEN_API);

/** Attempt a single refresh call. Returns the new access token or throws. */
const attemptRefresh = async (): Promise<string> => {
  const { data } = await axios.post(
    endpoints.REFRESH_TOKEN_API,
    {},
    { withCredentials: true }
  );
  const newToken = data?.data?.accessToken;
  if (!newToken) throw new Error("Invalid refresh response");
  return newToken;
};

// -------------------------------------
// Response Interceptor
// -------------------------------------

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    // Guard: no config or exempt URL or not 401 or already retried
    if (
      !config ||
      isAuthUrl(config.url) ||
      error.response?.status !== 401 ||
      config._retry
    ) {
      return Promise.reject(error);
    }

    // Queue if refresh in progress
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        config.headers.set("Authorization", `Bearer ${token}`);
        return axiosInstance(config);
      });
    }

    // Attempt token refresh (with one retry for transient failures)
    config._retry = true;
    isRefreshing = true;

    try {
      let newToken: string;
      try {
        newToken = await attemptRefresh();
      } catch {
        // Single retry after a short delay (covers Render cold starts / network blips)
        await new Promise((r) => setTimeout(r, 2000));
        newToken = await attemptRefresh();
      }

      useAuthStore.getState().setAccessToken(newToken);

      processQueue(null, newToken);

      config.headers.set("Authorization", `Bearer ${newToken}`);
      return axiosInstance(config);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().setAccessToken(null);

      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// -------------------------------------
// API Connector
// -------------------------------------

export const apiConnector = (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  bodyData?: unknown,
  headers?: Record<string, string>,
  params?: Record<string, unknown>
) =>
  axiosInstance({
    method,
    url,
    data: bodyData ?? undefined,
    headers: headers ?? undefined,
    params: params ?? undefined,
  });
