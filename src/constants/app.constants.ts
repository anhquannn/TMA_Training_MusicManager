export const APP_CONFIG = {
  NAME: 'Music Manager',
  VERSION: '1.0.0',
  DESCRIPTION: 'Quản lý và thưởng thức âm nhạc của bạn',
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['audio/mpeg', 'audio/mp3', 'video/mp4'],
  ALLOWED_EXTENSIONS: ['.mp3', '.mp4'],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 100,
} as const;

export const MUSIC_GENRES = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Country',
  'Electronic',
  'Jazz',
  'Classical',
  'Folk',
  'Blues',
  'Reggae',
  'Punk',
  'Metal',
  'Alternative',
  'Indie',
  'Ballad',
  'V-Pop',
  'K-Pop',
  'Bolero',
  'Trữ tình',
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
} as const;

export const TOAST_CONFIG = {
  POSITION: 'top-right' as const,
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true,
} as const;
