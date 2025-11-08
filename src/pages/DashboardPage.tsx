import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, User, Music, Home } from 'lucide-react';
import { api, AuthTokenManager } from '../services/apiService';
import i18n from '../i18n';
import SongList from '../components/songs/SongList';
import SongForm from '../components/songs/SongForm';
import { Song } from '../interfaces/song.interface';
import { LocalStorageManager } from '../utils/app_storage';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSongForm, setShowSongForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const currentUser = LocalStorageManager.getUser();

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { token: AuthTokenManager.getAccessToken() });
      toast.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AuthTokenManager.clearTokens();
      LocalStorageManager.clearAllData();
      navigate('/login');
    }
  };

  const handleAddSong = () => {
    setEditingSong(undefined);
    setShowSongForm(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowSongForm(true);
  };

  const handleFormSuccess = () => {
    setShowSongForm(false);
    setEditingSong(undefined);
    setRefreshKey(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowSongForm(false);
    setEditingSong(undefined);
  };

  if (!AuthTokenManager.getAccessToken()) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Music className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{i18n.t('dashboard.greeting')}, {currentUser?.Fullname || i18n.t('common.user')}!</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span>{i18n.t('dashboard.greeting')}, {currentUser?.Fullname || i18n.t('common.user')}</span>
              </div>
              <button
                onClick={() => i18n.changeLanguage(currentLanguage === 'vi' ? 'en' : 'vi')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                title="Switch language"
              >
                {currentLanguage === 'vi' ? 'EN' : 'VI'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {i18n.t('auth.logout.button')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {i18n.t('dashboard.welcome')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {i18n.t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <SongList
            key={refreshKey}
            onEditSong={handleEditSong}
            onAddSong={handleAddSong}
          />
        </div>
      </main>

      {showSongForm && (
        <SongForm
          song={editingSong}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default DashboardPage;
