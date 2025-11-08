import { api, AuthTokenManager } from '../apiService';
import { 
  LoginCredentials,
  RegisterRequest, 
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  LoginApiResponse,
  RegisterApiResponse,
  ApiResponse
} from '../../interfaces/auth.interface';
import { LocalStorageManager } from '../../utils/app_storage';

class AuthService {
  async login(credentials: LoginCredentials): Promise<boolean> {
    const response = await api.post<LoginApiResponse>('/auth/login', credentials);
    if (response.data.code === 200 && response.data.result.accessToken) {
      AuthTokenManager.setAccessToken(response.data.result.accessToken);
      if (response.data.result.refreshToken) {
        AuthTokenManager.setRefreshToken(response.data.result.refreshToken);
      }
      return true;
    }
    return false;
  }

  async register(userData: RegisterRequest): Promise<boolean> {
    const response = await api.post<RegisterApiResponse>('/auth/register', userData);
    return response.data.code === 200;
  }

  async logout(): Promise<void> {
    const token = AuthTokenManager.getAccessToken();
    if (token) {
      try {
        await api.post('/auth/logout', { token });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    AuthTokenManager.clearTokens();
    LocalStorageManager.clearAllData();
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = AuthTokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<LoginApiResponse>('/auth/refresh', { refreshToken });
    if (response.data.code === 200 && response.data.result.accessToken) {
      AuthTokenManager.setAccessToken(response.data.result.accessToken);
      if (response.data.result.refreshToken) {
        AuthTokenManager.setRefreshToken(response.data.result.refreshToken);
      }
      return true;
    }
    return false;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<boolean> {
    const response = await api.post<ApiResponse>('/auth/forgot-password', data);
    return response.data.code === 200;
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<boolean> {
    const response = await api.post<ApiResponse>('/auth/verify-otp', data);
    return response.data.code === 200;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<boolean> {
    const response = await api.post<ApiResponse>('/auth/reset-password', data);
    return response.data.code === 200;
  }

  async updateProfile(id: string, data: { username?: string; genre?: string }): Promise<boolean> {
    const response = await api.put<ApiResponse>(`/auth/profile/${id}`, data);
    return response.data.code === 200;
  }

  isAuthenticated(): boolean {
    return !!AuthTokenManager.getAccessToken();
  }

  getCurrentUser() {
    return LocalStorageManager.getUser();
  }
}

export const authService = new AuthService();
export default authService;
