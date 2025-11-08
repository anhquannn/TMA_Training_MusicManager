import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Play, Pause, Edit, Trash2, Search, Plus, Music } from 'lucide-react';
import { api } from '../../services/apiService';
import { Song, SongPageApiResponse, SongListApiResponse, SongSearchParams, PagedResponse } from '../../interfaces/song.interface';
import i18n from '../../i18n';

interface SongListProps {
  onEditSong?: (song: Song) => void;
  onAddSong?: () => void;
}

const SongList: React.FC<SongListProps> = ({ onEditSong, onAddSong }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    loadSongs();
  }, [currentPage]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchKeyword.trim()) {
        handleSearch();
      } else {
        loadSongs();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchKeyword]);

  const loadSongs = async () => {
    setLoading(true);
    try {
      const response = await api.get<SongPageApiResponse>(`/songs/page?page=${currentPage}&size=${pageSize}`);
      if (response.data.code === 200) {
        const pageData = response.data.result;
        setSongs(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      } else {
        throw new Error(response.data.message || i18n.t('songs.loading'));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || i18n.t('songs.loading');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get<SongListApiResponse>(`/songs/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      if (response.data.code === 200) {
        setSongs(response.data.result);
        // Reset pagination for search results
        setTotalPages(1);
        setTotalElements(response.data.result.length);
      } else {
        throw new Error(response.data.message || i18n.t('common.error'));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || i18n.t('common.error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (song: Song) => {
    try {
      if (currentlyPlaying === song.id) {
        // Pause current song
        if (audioRef) {
          audioRef.pause();
          setCurrentlyPlaying(null);
        }
      } else {
        // Stop previous song if playing
        if (audioRef) {
          audioRef.pause();
        }

        // Play new song using stream endpoint with authentication
        const response = await api.get(`/songs/${song.id}/play`, {
          responseType: 'blob'
        });
        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newAudio = new Audio(audioUrl);
        
        newAudio.onended = () => {
          setCurrentlyPlaying(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        newAudio.onerror = () => {
          toast.error(i18n.t('songs.playFailed'));
          setCurrentlyPlaying(null);
        };

        await newAudio.play();
        setAudioRef(newAudio);
        setCurrentlyPlaying(song.id);
        toast.success(`${i18n.t('songs.nowPlaying')}: ${song.name} - ${song.artist}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || i18n.t('songs.playFailed');
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (song: Song) => {
    if (!window.confirm(`${i18n.t('songs.deleteConfirm')} "${song.name}"?`)) {
      return;
    }

    try {
      const response = await api.delete(`/songs/${song.id}`);
      if (response.data.code === 200) {
        toast.success(response.data.message || i18n.t('songs.deleteSuccess'));
        loadSongs(); // Reload list
      } else {
        throw new Error(response.data.message || i18n.t('songs.deleteFailed'));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || i18n.t('songs.deleteFailed');
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Music className="h-6 w-6 mr-2" />
          {i18n.t('songs.title')}
        </h2>
        <button
          onClick={onAddSong}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          {i18n.t('songs.addSong')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={i18n.t('songs.search')}
          />
        </div>
      </div>

      {/* Songs Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">{i18n.t('songs.loading')}</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-8">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{i18n.t('songs.noSongs')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {i18n.t('songs.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {i18n.t('songs.artist')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {i18n.t('songs.genre')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {i18n.t('songs.createdAt')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {i18n.t('songs.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handlePlay(song)}
                        className="mr-3 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                      >
                        {currentlyPlaying === song.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {song.name}
                        </div>
                        {currentlyPlaying === song.id && (
                          <div className="text-xs text-blue-600">{i18n.t('songs.playing')}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {song.artist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {song.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(song.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditSong?.(song)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(song)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white px-4 py-3 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {i18n.t('songs.previousPage')}
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {i18n.t('songs.nextPage')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {i18n.t('songs.showing')} <span className="font-medium">{currentPage * pageSize + 1}</span> {i18n.t('songs.to')}{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span>{' '}
                {i18n.t('songs.of')} <span className="font-medium">{totalElements}</span> {i18n.t('songs.items')}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {i18n.t('songs.previousPage')}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {i18n.t('songs.nextPage')}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongList;
