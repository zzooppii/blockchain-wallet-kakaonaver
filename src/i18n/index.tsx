"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ko from "./ko";
import en from "./en";

type Locale = "ko" | "en";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, string>;

const translations: Record<Locale, Translations> = { ko, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof ko;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "ko",
  setLocale: () => {},
  t: ko as typeof ko,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "ko" || stored === "en") setLocaleState(stored);
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem("locale", next);
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] as typeof ko }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="rounded-full px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
    >
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
