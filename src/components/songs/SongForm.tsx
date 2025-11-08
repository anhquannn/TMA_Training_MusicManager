import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, Music, User, Tag, X } from 'lucide-react';
import { api } from '../../services/apiService';
import { CreateSongRequest, UpdateSongRequest, Song, SongApiResponse } from '../../interfaces/song.interface';
import { MUSIC_GENRES, FILE_UPLOAD } from '../../constants/app.constants';

interface SongFormProps {
  song?: Song;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SongForm: React.FC<SongFormProps> = ({ song, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateSongRequest>({
    name: '',
    artist: '',
    genre: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        name: song.name,
        artist: song.artist,
        genre: song.genre,
      });
      setIsEdit(true);
    }
  }, [song]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
        toast.error('Chỉ hỗ trợ file MP3 và MP4');
        return;
      }

      // Validate file size
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        toast.error('File không được vượt quá 50MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên bài hát');
      return false;
    }
    if (!formData.artist.trim()) {
      toast.error('Vui lòng nhập tên nghệ sĩ');
      return false;
    }
    if (!formData.genre.trim()) {
      toast.error('Vui lòng chọn thể loại');
      return false;
    }
    if (!isEdit && !selectedFile) {
      toast.error('Vui lòng chọn file nhạc');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isEdit && song) {
        // Update existing song
        const updateData: UpdateSongRequest = {
          name: formData.name,
          artist: formData.artist,
          genre: formData.genre,
        };
        const response = await api.put<SongApiResponse>(`/songs/${song.id}`, updateData);
        if (response.data.code === 200) {
          toast.success(response.data.message || 'Cập nhật bài hát thành công');
        } else {
          throw new Error(response.data.message || 'Cập nhật thất bại');
        }
      } else {
        // Create new song
        if (!selectedFile) {
          toast.error('Vui lòng chọn file nhạc');
          return;
        }
        // Create FormData for multipart upload
        const uploadData = new FormData();
        // Try sending JSON as plain string first (some Spring configs prefer this)
        uploadData.append('info', JSON.stringify(formData));
        uploadData.append('file', selectedFile);

        console.log('🚀 About to send POST /songs');
        console.log('📦 FormData contents:', {
          info: JSON.stringify(formData),
          file: selectedFile.name,
          fileSize: selectedFile.size
        });

        // Try with explicit headers to help Spring parse multipart
        const response = await api.post<SongApiResponse>('/songs', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.code === 200) {
          toast.success(response.data.message || 'Thêm bài hát thành công');
        } else {
          throw new Error(response.data.message || 'Thêm bài hát thất bại');
        }
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 
        (isEdit ? 'Cập nhật bài hát thất bại' : 'Thêm bài hát thất bại');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const genres = MUSIC_GENRES;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Music className="h-5 w-5 mr-2" />
            {isEdit ? 'Cập nhật bài hát' : 'Thêm bài hát mới'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên bài hát *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Music className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nhập tên bài hát"
              />
            </div>
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
              Nghệ sĩ *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="artist"
                name="artist"
                type="text"
                required
                value={formData.artist}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nhập tên nghệ sĩ"
              />
            </div>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Thể loại *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="genre"
                name="genre"
                required
                value={formData.genre}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn thể loại</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                File nhạc * (MP3, MP4 - tối đa 50MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Chọn file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".mp3,.mp4,audio/mpeg,video/mp4"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">hoặc kéo thả</p>
                  </div>
                  <p className="text-xs text-gray-500">MP3, MP4 tối đa 50MB</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Đã chọn: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm bài hát')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongForm;
