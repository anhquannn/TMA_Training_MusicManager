import httpService from '../base/http.service';
import { API_ENDPOINTS } from '../../constants/api.constants';
import { 
  CreateSongRequest,
  UpdateSongRequest,
  SongResponse,
  PaginationParams,
  SearchParams 
} from '../../types/api.types';

class SongService {
  async createSong(songData: CreateSongRequest, file: File): Promise<SongResponse> {
    const formData = new FormData();
    formData.append('info', new Blob([JSON.stringify(songData)], { type: 'application/json' }));
    formData.append('file', file);
    
    const response = await httpService.post<SongResponse>(API_ENDPOINTS.SONGS.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result!;
  }

  async updateSong(id: string, data: UpdateSongRequest): Promise<SongResponse> {
    const response = await httpService.put<SongResponse>(API_ENDPOINTS.SONGS.BY_ID(id), data);
    return response.data.result!;
  }

  async deleteSong(id: string): Promise<void> {
    await httpService.delete(API_ENDPOINTS.SONGS.BY_ID(id));
  }

  async getSong(id: string): Promise<SongResponse> {
    const response = await httpService.get<SongResponse>(API_ENDPOINTS.SONGS.BY_ID(id));
    return response.data.result!;
  }

  async searchSongs(params: SearchParams): Promise<SongResponse[]> {
    const response = await httpService.get<SongResponse[]>(API_ENDPOINTS.SONGS.SEARCH, params);
    return response.data.result || [];
  }

  async getSongsPaged(params: PaginationParams): Promise<SongResponse[]> {
    const response = await httpService.get<SongResponse[]>(API_ENDPOINTS.SONGS.PAGE, params);
    return response.data.result || [];
  }

  getPlayUrl(id: string): string {
    return `${httpService.getBaseURL()}${API_ENDPOINTS.SONGS.PLAY(id)}`;
  }

  async playSong(id: string): Promise<string> {
    return this.getPlayUrl(id);
  }
}

export const songService = new SongService();
export default songService;
