import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  getStoredAuthToken,
  getStoredRefreshToken,
  removeAuthToken,
  removeRefreshToken,
  storeAuthToken,
  storeRefreshToken,
  areCookiesEnabled,
} from "@/utils/common/authToken";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { baseUrl } from "@/global_config";
import {
  ApiConfiguration,
  RequestConfig,
} from "@/interface/Axios/axios.interface";
import qs from "qs";

/** Interface for API client methods */
export interface IApiClient {
  post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse>;
  patch<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse>;
  put<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse>;
  get<
    TResponse,
    TQueryParams = Record<string, string | number | boolean | undefined>,
  >(
    path: string,
    queryParam?: TQueryParams,
    config?: RequestConfig,
  ): Promise<TResponse>;
  delete<
    TResponse,
    TQueryParams = Record<string, string | number | boolean | undefined>,
  >(
    path: string,
    queryParam?: TQueryParams,
    config?: RequestConfig,
  ): Promise<TResponse>;
}

/** Response type for refresh token API */
interface RefreshTokenResponse {
  token: string;
  refresh_token?: string; // Optional, as server may rotate refresh tokens
}

/** Error response type for API errors */
interface ErrorResponse {
  message?: string;
  code?: number; // Custom error code (e.g., 4004 for invalid token)
}

/** API client with secure token handling and refresh logic */
class ApiClient implements IApiClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private maxRetryAttempts: number = 2; // Limit retry attempts

  constructor(apiConfiguration?: ApiConfiguration) {
    this.client = this.createAxiosClient(apiConfiguration);
    this.setupInterceptors();
  }

  /** Creates an Axios instance with default configuration */
  private createAxiosClient(
    apiConfiguration?: ApiConfiguration,
  ): AxiosInstance {
    return axios.create({
      baseURL: baseUrl,
      responseType: "json",
      paramsSerializer: {
        serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
      },
      headers: {
        "Content-Type": "application/json",
      },
      ...apiConfiguration,
    });
  }

  /** Sets up request and response interceptors */
  private setupInterceptors(): void {
    // Request interceptor: Add auth token to headers
    this.client.interceptors.request.use(
      (config) => {
        if (!areCookiesEnabled()) {
          console.warn("Cookies are disabled. Token may be stored in-memory.");
        }
        const token = getStoredAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor: Handle 401 errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
          _retryCount?: number;
        };

        // Handle 401 or custom 4004 (invalid token) errors
        if (
          (error.response?.status === StatusCode.Unauthorized ||
            error.response?.data?.code === 4004) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          // Prevent infinite refresh loops
          if (originalRequest._retryCount > this.maxRetryAttempts) {
            this.logoutUser("Maximum retry attempts reached");
            return Promise.reject(new Error("Maximum retry attempts reached"));
          }

          // Queue requests during refresh
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = getStoredRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const { token: newAccessToken, refresh_token: newRefreshToken } =
              await this.refreshAccessToken(refreshToken);
            await storeAuthToken({ token: newAccessToken });
            if (newRefreshToken) {
              await storeRefreshToken({ refresh_token: newRefreshToken });
            }

            // Update default headers
            this.client.defaults.headers.common["Authorization"] =
              `Bearer ${newAccessToken}`;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Notify queued requests
            this.onRefreshSuccess(newAccessToken);

            return this.client(originalRequest);
          } catch (refreshError) {
            this.logoutUser("Failed to refresh token");
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshSubscribers = []; // Clear subscribers to prevent leaks
          }
        }

        // Handle 403 (Forbidden) errors
        if (error.response?.status === StatusCode.Forbidden) {
          this.logoutUser("Access forbidden");
        }

        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        handleError(error);
        return Promise.reject(new Error(errorMessage));
      },
    );
  }

  /** Refreshes access token using refresh token */
  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${baseUrl}/api/Auth/refresh/token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.data.token) {
        throw new Error("Invalid refresh token response");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to refresh access token");
    }
  }

  /** Notifies subscribers with new token */
  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /** Logs out user and clears auth storage */
  private logoutUser(message: string = "Session expired"): void {
    removeAuthToken();
    removeRefreshToken();
    toast.error(message);
    redirect("/");
  }

  /** GET request with query parameters */
  async get<
    TResponse,
    TQueryParams = Record<string, string | number | boolean | undefined>,
  >(
    path: string,
    queryParam?: TQueryParams,
    config?: RequestConfig,
  ): Promise<TResponse> {
    const queryString = queryParam
      ? `${path}?${qs.stringify(queryParam, { arrayFormat: "repeat" })}`
      : path;
    const response = await this.client.get<TResponse>(queryString, config);
    return response.data;
  }

  /** POST request with payload */
  async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(path, payload, config);
    return response.data;
  }

  /** DELETE request with query parameters */
  async delete<
    TResponse,
    TQueryParams = Record<string, string | number | boolean | undefined>,
  >(
    path: string,
    queryParam?: TQueryParams,
    config?: RequestConfig,
  ): Promise<TResponse> {
    const queryString = queryParam
      ? `${path}?${qs.stringify(queryParam, { arrayFormat: "repeat" })}`
      : path;
    const response = await this.client.delete<TResponse>(queryString, config);
    return response.data;
  }

  /** PATCH request with payload */
  async patch<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(path, payload, config);
    return response.data;
  }

  /** PUT request with payload */
  async put<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(path, payload, config);
    return response.data;
  }
}

/** Enum for common HTTP status codes */
export enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404,
  NetworkError = 503,
  RequestFailed = 400,
  NoData = 204,
  NameAlreadyExists = 409,
}

/** Handles Axios errors with user-friendly messages */
export function handleError(error: AxiosError<ErrorResponse>): void {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred";

  if (!status) {
    toast.error("Network error. Please check your connection.");
    return;
  }

  switch (status) {
    case StatusCode.InternalServerError:
      toast.error("Server error. Please try again later.");
      break;
    case StatusCode.Forbidden:
      toast.error("Access denied. Please contact support.");
      break;
    case StatusCode.Unauthorized:
      toast.error("Session expired. Please log in again.");
      break;
    case StatusCode.TooManyRequests:
      toast.error("Too many requests. Please wait and try again.");
      break;
    case StatusCode.NotFound:
      toast.error("Resource not found.");
      break;
    case StatusCode.NoData:
      toast.error("No data available.");
      break;
    case StatusCode.NameAlreadyExists:
      toast.error("Name already exists.");
      break;
    default:
      toast.error(message);
      break;
  }
}

export const apiClient = new ApiClient();
