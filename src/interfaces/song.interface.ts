import { ApiResponse } from './auth.interface';

export interface Song {
  id: string;
  name: string;
  artist: string;
  genre: string;
  fileUrl: string;
  createdAt: string; 
  updatedAt?: string; 
}

export interface CreateSongRequest {
  name: string;
  genre: string;
  artist: string;
  fileUrl?: string;
}

export interface UpdateSongRequest {
  name?: string;
  artist?: string;
  genre?: string;
  fileUrl?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number; 
  size: number;
  totalElements: number; 
  totalPages: number; 
  first: boolean;
  last: boolean;
  hasNext: boolean; 
  hasPrevious: boolean;
}

export interface SongApiResponse extends ApiResponse<Song> {}
export interface SongListApiResponse extends ApiResponse<Song[]> {}
export interface SongPageApiResponse extends ApiResponse<PagedResponse<Song>> {}

export interface SongSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}
