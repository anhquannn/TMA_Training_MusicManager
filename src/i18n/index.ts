/**
 * Internationalization (i18n) Configuration
 * Supports Vietnamese and English languages
 */

// Import translations
import viTranslations from './locales/vi.json';
import enTranslations from './locales/en.json';

const resources = {
  vi: {
    translation: viTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Simple i18n implementation without external dependencies
class SimpleI18n {
  private currentLanguage: string = 'vi';
  private translations: Record<string, any> = resources;

  constructor() {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    this.currentLanguage = this.translations[browserLang] ? browserLang : 'vi';
    
    // Load from localStorage if available
    const savedLang = localStorage.getItem('language');
    if (savedLang && this.translations[savedLang]) {
      this.currentLanguage = savedLang;
    }
  }

  t(key: string, options?: Record<string, any>): string {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage]?.translation;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Simple interpolation
    if (options) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, key) => options[key] || match);
    }
    
    return value;
  }

  changeLanguage(lng: string): Promise<void> {
    if (this.translations[lng]) {
      this.currentLanguage = lng;
      localStorage.setItem('language', lng);
      
      // Update HTML lang attribute
      document.documentElement.lang = lng;
      
      // Trigger language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lng }));
    }
    return Promise.resolve();
  }

  get language(): string {
    return this.currentLanguage;
  }

  getAvailableLanguages(): string[] {
    return Object.keys(this.translations);
  }
}

const i18n = new SimpleI18n();
export default i18n;
