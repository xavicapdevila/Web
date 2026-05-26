"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Lang, TKey, Translations } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

const COOKIE_NAME = "tvh_lang";
const DEFAULT_LANG: Lang = "es";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey) => string;
  translate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => key,
  translate: async (text) => text,
});

function readLangCookie(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const match = document.cookie.match(/(?:^|;\s*)tvh_lang=([^;]+)/);
  const val = match?.[1] as Lang | undefined;
  return val && ["es", "ca", "en", "fr"].includes(val) ? val : DEFAULT_LANG;
}

// Map our lang codes to MyMemory language codes
const MYMEMORY_LANG: Record<Lang, string> = {
  es: "es",
  ca: "ca",
  en: "en",
  fr: "fr",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [translations, setTranslations] = useState<Translations>(getTranslations(DEFAULT_LANG));

  // Translation cache: "lang:text" → translated string
  const cache = useRef<Map<string, string>>(new Map());
  // Pending promises to avoid duplicate simultaneous requests
  const pending = useRef<Map<string, Promise<string>>>(new Map());

  // On mount, read from cookie
  useEffect(() => {
    const saved = readLangCookie();
    setLangState(saved);
    setTranslations(getTranslations(saved));
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    setTranslations(getTranslations(newLang));
    document.cookie = `${COOKIE_NAME}=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, []);

  const t = useCallback((key: TKey): string => translations[key], [translations]);

  /**
   * Translate arbitrary text (ES → current lang) using MyMemory free API.
   * Results are cached in memory for the session lifetime.
   */
  const translate = useCallback(async (text: string): Promise<string> => {
    if (lang === "es" || !text.trim()) return text;

    const cacheKey = `${lang}:${text}`;

    // Already translated
    if (cache.current.has(cacheKey)) return cache.current.get(cacheKey)!;

    // In-flight — reuse the same promise
    if (pending.current.has(cacheKey)) return pending.current.get(cacheKey)!;

    const target = MYMEMORY_LANG[lang];
    const promise = fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${target}`
    )
      .then((res) => res.json())
      .then((data) => {
        const result: string = data?.responseData?.translatedText ?? text;
        // MyMemory sometimes returns HTML entities — decode them
        const decoded = result
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        cache.current.set(cacheKey, decoded);
        pending.current.delete(cacheKey);
        return decoded;
      })
      .catch(() => {
        pending.current.delete(cacheKey);
        return text; // fallback to original
      });

    pending.current.set(cacheKey, promise);
    return promise;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Hook that auto-translates a Spanish string to the current language.
 * Shows the original text immediately, then swaps to the translation once ready.
 */
export function useAutoTranslate(text: string): string {
  const { lang, translate } = useLanguage();
  const [result, setResult] = useState(text);

  useEffect(() => {
    if (lang === "es") {
      setResult(text);
      return;
    }
    let cancelled = false;
    translate(text).then((translated) => {
      if (!cancelled) setResult(translated);
    });
    return () => { cancelled = true; };
  }, [text, lang, translate]);

  return result;
}

/**
 * Hook that auto-translates an array of Spanish strings to the current language.
 * Each string is translated independently and cached separately.
 */
export function useAutoTranslateMulti(texts: string[]): string[] {
  const { lang, translate } = useLanguage();
  const [results, setResults] = useState<string[]>(texts);

  useEffect(() => {
    if (lang === "es") {
      setResults(texts);
      return;
    }
    let cancelled = false;
    Promise.all(texts.map((t) => translate(t))).then((translated) => {
      if (!cancelled) setResults(translated);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, translate, texts.join("||")]);

  return results;
}
