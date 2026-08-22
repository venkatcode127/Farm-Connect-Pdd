import React, { createContext, useContext, useState, useCallback } from 'react';
import translations, { LANGUAGES, CROP_TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('farmconnect_language') || 'en';
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('farmconnect_language', lang);
    document.documentElement.lang = lang;
  }, []);

  // Translation function: t('key', 'Fallback') returns translated string
  const t = useCallback((key, fallback) => {
    const entry = translations[key];
    if (!entry) return fallback || key;
    return entry[language] || entry['en'] || fallback || key;
  }, [language]);

  // Translate crop name
  const getCropName = useCallback((crop) => {
    if (!crop) return '';
    const rawName = typeof crop === 'string' ? crop : crop.name;
    const item = CROP_TRANSLATIONS[rawName];
    if (item) {
      return item[language] || item['en'] || rawName;
    }
    // Also check commodity object language properties
    if (typeof crop === 'object') {
      if (language === 'hi' && crop.nameHi) return crop.nameHi;
      if (language === 'te' && crop.nameTe) return crop.nameTe;
      if (language === 'ta' && crop.nameTa) return crop.nameTa;
      if (language === 'kn' && crop.nameKn) return crop.nameKn;
      return crop.name;
    }
    return rawName;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCropName, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
