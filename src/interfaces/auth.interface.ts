export interface LoginCredentials {
  email: string; 
  password: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface LoginResult {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number; 
}

export interface LoginApiResponse extends ApiResponse<LoginResult> {}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface RegisterResult {
  id: string;
  username: string;
  email: string;
  roles: Set<string>;
}

export interface RegisterApiResponse extends ApiResponse<RegisterResult> {}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  genre?: string;
}

export interface UserProfileApiResponse extends ApiResponse<UserProfile> {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenApiResponse extends ApiResponse<LoginResult> {}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}