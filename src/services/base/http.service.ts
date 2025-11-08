import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../../constants/api.constants';

export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

class HttpService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized(): Promise<void> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (refreshToken) {
      try {
        const response = await this.post<any>('/auth/refresh', { refreshToken });
        if (response.data.result) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.result.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.result.refreshToken);
          return;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    
    this.clearAuthData();
    window.location.href = '/login';
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  async get<T>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.get(url, { params });
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.put(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.delete(url);
  }

  getBaseURL(): string {
    return API_CONFIG.BASE_URL;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
}

export const httpService = new HttpService();
export default httpService;
