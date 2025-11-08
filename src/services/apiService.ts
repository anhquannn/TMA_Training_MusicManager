import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api.constants';
import { LocalStorageManager } from '../utils/app_storage';
import authService from './auth/auth.service';

export const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = AuthTokenManager.getAccessToken();
  console.log('🔍 Interceptor - Token:', token ? 'EXISTS' : 'NOT_FOUND');
  console.log('🔍 Interceptor - URL:', config.url);
  if (token) {
    (config.headers = config.headers || {}).Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.log('❌ No token found, skipping Authorization header');
  }
  return config;
});

let isRefreshing = false as boolean;
let refreshPromise: Promise<boolean> | null = null;
const pendingQueue: Array<(token?: string) => void> = [];

function onTokenRefreshed(token: string) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue.length = 0;
}

function addPendingRequest(callback: (token?: string) => void) {
  pendingQueue.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url: string = originalRequest?.url || '';

    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');

    if (status === 401 && !isAuthEndpoint) {
      if (originalRequest._retry) {
        AuthTokenManager.clearTokens();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              console.log('🔄 Attempting to refresh access token...');
              const ok = await authService.refreshToken();
              if (!ok) throw new Error('Refresh token failed');
              const newAccess = AuthTokenManager.getAccessToken();
              if (newAccess) {
                api.defaults.headers.Authorization = `Bearer ${newAccess}`;
                onTokenRefreshed(newAccess);
              }
              return true;
            } finally {
              isRefreshing = false;
            }
          })();
        }

        await refreshPromise;
        return new Promise((resolve) => {
          addPendingRequest((token?: string) => {
            if (token) {
              (originalRequest.headers = originalRequest.headers || {}).Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      } catch (e) {
        console.error('🚫 Refresh token failed, redirecting to login');
        AuthTokenManager.clearTokens();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export class AuthTokenManager {
  static setAccessToken(token: string): void {
    const refresh = LocalStorageManager.getRefreshToken() || '';
    LocalStorageManager.saveAuthTokens({ accessToken: token, refreshToken: refresh });
  }

  static setRefreshToken(token: string): void {
    const access = LocalStorageManager.getAccessToken() || '';
    LocalStorageManager.saveAuthTokens({ accessToken: access, refreshToken: token });
  }

  static getAccessToken(): string | undefined {
    return LocalStorageManager.getAccessToken();
  }

  static getRefreshToken(): string | undefined {
    return LocalStorageManager.getRefreshToken();
  }

  static clearTokens(): void {
    LocalStorageManager.clearAuthTokens();
  }
}

export const ApiConfig = API_CONFIG;
export default authService;
