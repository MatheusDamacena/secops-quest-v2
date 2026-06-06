import { useState, useCallback } from 'react';
import { t as translate } from '../data/i18n';

const STORAGE_KEY = 'secops-quest-lang';

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'pt'; } catch { return 'pt'; }
  });

  const setLang = useCallback((code) => {
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    setLangState(code);
  }, []);

  const t = useCallback((key) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}
