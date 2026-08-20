import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { T } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('hs_lang') || 'kn');

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem('hs_lang', l);
  }, []);

  const t = useCallback((key) => T[lang][key] ?? T.kn[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
