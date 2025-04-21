import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

type Language = 'English' | 'العربية';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'English' || savedLanguage === 'العربية') ? savedLanguage : 'English';
  });

  const direction = language === 'العربية' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language === 'English' ? 'en' : 'ar';
  }, [language, direction]);

  const t = (key: string): string => {
    const languageKey = language === 'English' ? 'en' : 'ar';
    return translations[languageKey][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}