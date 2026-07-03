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

const SUPPORTED: Lang[] = ["es", "ca", "en", "fr"];

/** Cookie explícita (elección previa del usuario), o null si no hay. */
function readLangCookie(): Lang | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)tvh_lang=([^;]+)/);
  const val = match?.[1] as Lang | undefined;
  return val && SUPPORTED.includes(val) ? val : null;
}

/**
 * Idioma inicial cuando el usuario aún no ha elegido: primero `?lang=` de la
 * URL (útil para enlazar anuncios ya en un idioma), y si no, el idioma del
 * navegador/dispositivo. Cae a español si no es ninguno de los soportados.
 */
function detectLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param && SUPPORTED.includes(param as Lang)) return param as Lang;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of candidates) {
    const code = raw?.slice(0, 2).toLowerCase() as Lang;
    if (SUPPORTED.includes(code)) return code;
  }
  return DEFAULT_LANG;
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

  // On mount: respetar la elección previa (cookie); si no la hay, detectar por
  // ?lang= o idioma del navegador y fijarla para que persista.
  useEffect(() => {
    const saved = readLangCookie();
    const initial = saved ?? detectLang();
    setLangState(initial);
    setTranslations(getTranslations(initial));
    if (!saved && initial !== DEFAULT_LANG) {
      document.cookie = `${COOKIE_NAME}=${initial}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    setTranslations(getTranslations(newLang));
    document.cookie = `${COOKIE_NAME}=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
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
    const email = process.env.NEXT_PUBLIC_MYMEMORY_EMAIL ?? "";
    const deParam = email ? `&de=${encodeURIComponent(email)}` : "";
    const promise = fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${target}${deParam}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Validate response: 200 = success, 206 = partial match; anything else = fall back
        const status: number = data?.responseStatus ?? 0;
        if (status !== 200 && status !== 206) {
          pending.current.delete(cacheKey);
          return text;
        }
        const raw: string = data?.responseData?.translatedText ?? "";
        // MyMemory returns warning/error messages as translatedText on soft failures
        if (!raw || raw.startsWith("[MYMEMORY") || raw.startsWith("PLEASE SELECT")) {
          pending.current.delete(cacheKey);
          return text;
        }
        // Decode basic HTML entities the API sometimes adds
        const decoded = raw
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
