/**
 * Captura y lectura de atribución de marketing (cliente).
 *
 * Guarda de dónde viene el visitante (utm_*, fbclid, gclid, referrer, landing)
 * en una cookie de primer contacto, para poder decir con exactitud qué anuncio
 * / campaña trajo cada lead. Además lee las cookies que planta el Meta Pixel
 * (`_fbp`, `_fbc`) para poder hacer matching en la Conversions API server-side.
 *
 * Todo es best-effort y protegido para SSR (no toca `document` en servidor).
 */

const ATTR_COOKIE = "tvh_attr";
const ATTR_DAYS = 90;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string; // TikTok, por si se usa más adelante
  landing?: string; // primera URL de aterrizaje
  referrer?: string; // referente externo
  ts?: string; // ISO del primer contacto
}

/** Cookies de matching que planta el navegador (Meta Pixel). */
export interface ClickIds {
  fbp?: string;
  fbc?: string;
}

const UTM_KEYS: (keyof Attribution)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

/** RGPD: los identificadores de click (fbclid/gclid/…) solo con consentimiento de marketing. */
function hasMarketingConsent(): boolean {
  const raw = readCookie("tvh_consent");
  if (!raw) return false;
  try {
    return (JSON.parse(raw) as { marketing?: boolean })?.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Se llama al cargar la landing. Si la URL trae parámetros de campaña y no hay
 * atribución previa, la persiste (modelo de PRIMER contacto: la campaña que te
 * descubrió es la que se lleva el mérito del lead). Idempotente.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  // Ya hay atribución guardada → primer contacto, no la pisamos.
  if (readCookie(ATTR_COOKIE)) return;

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {};

  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) attr[k] = v.slice(0, 200);
  }
  // Identificadores de click: son rastreo publicitario → solo con consentimiento.
  if (hasMarketingConsent()) {
    const fbclid = params.get("fbclid");
    const gclid = params.get("gclid");
    const ttclid = params.get("ttclid");
    if (fbclid) attr.fbclid = fbclid.slice(0, 300);
    if (gclid) attr.gclid = gclid.slice(0, 300);
    if (ttclid) attr.ttclid = ttclid.slice(0, 300);
  }

  const hasCampaign =
    UTM_KEYS.some((k) => attr[k]) || attr.fbclid || attr.gclid || attr.ttclid;

  // Sin señales de campaña: no ensuciamos la cookie (tráfico orgánico/directo).
  // Aun así guardamos referrer+landing para dar algo de contexto.
  const referrer =
    typeof document !== "undefined" && document.referrer
      ? document.referrer.slice(0, 300)
      : undefined;

  if (!hasCampaign && !referrer) return;

  attr.landing = window.location.pathname.slice(0, 200);
  if (referrer) attr.referrer = referrer;
  attr.ts = new Date().toISOString();

  try {
    writeCookie(ATTR_COOKIE, JSON.stringify(attr), ATTR_DAYS);
  } catch {
    // cookie demasiado grande o bloqueada — ignorar
  }
}

/** Lee la atribución guardada (para adjuntarla al lead al enviar el form). */
export function getAttribution(): Attribution {
  const raw = readCookie(ATTR_COOKIE);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}

/**
 * Lee las cookies de matching del Meta Pixel. `_fbc` puede no existir aún; si
 * hay fbclid en la atribución, el servidor lo reconstruirá.
 */
export function getClickIds(): ClickIds {
  // RGPD: sin consentimiento de marketing no se leen las cookies del Pixel.
  if (!hasMarketingConsent()) return {};
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
}
