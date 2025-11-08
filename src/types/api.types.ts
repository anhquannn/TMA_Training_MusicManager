export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

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

export interface UpdateProfileRequest {
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongRequest {
  name: string;
  artist: string;
  genre: string;
  fileUrl?: string;
}

export interface UpdateSongRequest {
  name?: string;
  artist?: string;
  genre?: string;
  fileUrl?: string;
}

export interface SongResponse {
  id: string;
  name: string;
  artist: string;
  genre: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface SearchParams {
  keyword?: string;
}
