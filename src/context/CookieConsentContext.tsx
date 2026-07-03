"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ConsentState {
  v: number;
  essential: true;       // always true
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentCtx {
  /** null = not yet decided (banner should show) */
  consent: ConsentState | null;
  saveConsent: (categories: Pick<ConsentState, "analytics" | "marketing">) => void;
  /** Re-opens the banner/modal so user can change preferences */
  openPreferences: () => void;
  /** Whether the preferences panel is open (used by the banner) */
  preferencesOpen: boolean;
}

// ── Cookie helpers ─────────────────────────────────────────────────────────

const COOKIE_NAME = "tvh_consent";
const COOKIE_DAYS = 365;

function readConsentCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
    if (parsed?.v === 1 && typeof parsed.essential === "boolean") return parsed as ConsentState;
  } catch {
    // malformed — treat as no consent
  }
  return null;
}

function writeConsentCookie(state: ConsentState) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(state)
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

// ── Context ────────────────────────────────────────────────────────────────

const CookieConsentContext = createContext<CookieConsentCtx>({
  consent: null,
  saveConsent: () => {},
  openPreferences: () => {},
  preferencesOpen: false,
});

// ── GA loader ─────────────────────────────────────────────────────────────

function loadGA(id: string) {
  if (document.getElementById("ga-script")) return; // already injected
  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.async = true;
  document.head.appendChild(script);

  const init = document.createElement("script");
  init.id = "ga-init";
  init.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
  `;
  document.head.appendChild(init);
}

// ── Meta Pixel loader ───────────────────────────────────────────────────────

function loadMetaPixel(id: string) {
  if (typeof window === "undefined") return;
  // Ya inicializado (fbq presente): no re-inyectar.
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (w.fbq) return;

  /* eslint-disable */
  // Snippet oficial del Meta Pixel (base code).
  (function (f: any, b: any, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  w.fbq!("init", id);
  w.fbq!("track", "PageView");
}

// ── Provider ───────────────────────────────────────────────────────────────

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const gaLoaded = useRef(false);
  const pixelLoaded = useRef(false);

  // Read cookie on mount
  useEffect(() => {
    setConsent(readConsentCookie());
  }, []);

  // Load GA when analytics consent is granted
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId || gaLoaded.current) return;
    if (consent?.analytics) {
      gaLoaded.current = true;
      loadGA(gaId);
    }
  }, [consent]);

  // Load Meta Pixel when marketing consent is granted
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!pixelId || pixelLoaded.current) return;
    if (consent?.marketing) {
      pixelLoaded.current = true;
      loadMetaPixel(pixelId);
    }
  }, [consent]);

  const saveConsent = useCallback(
    (categories: Pick<ConsentState, "analytics" | "marketing">) => {
      const state: ConsentState = { v: 1, essential: true, ...categories };
      writeConsentCookie(state);
      setConsent(state);
      setPreferencesOpen(false);
    },
    []
  );

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{ consent, saveConsent, openPreferences, preferencesOpen }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
