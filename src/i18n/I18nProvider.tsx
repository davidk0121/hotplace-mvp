"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./locales";

const LOCALE_STORAGE_KEY = "hotplace_mvp_locale_v1";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** 현재 언어의 번역 사전. 사용 예: t.nav.myPlaces */
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  t: dictionaries[defaultLocale],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // SSR과 첫 클라이언트 렌더는 항상 defaultLocale로 일치시키고,
  // mount 후에 localStorage에 저장된 언어로 전환한다 (hydration 불일치 방지).
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && isLocale(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: dictionaries[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
