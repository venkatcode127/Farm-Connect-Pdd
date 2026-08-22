import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations, { LANGUAGES, CROP_TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('farmconnect_mobile_lang');
        if (saved) setLanguageState(saved);
      } catch (e) {}
    })();
  }, []);

  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('farmconnect_mobile_lang', lang);
    } catch (e) {}
  }, []);

  // Translation function: t('key', 'fallback')
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
