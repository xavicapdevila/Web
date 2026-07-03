/**
 * Meta Conversions API (server-side).
 *
 * Envía el evento `Lead` directamente desde nuestro servidor a Meta, en paralelo
 * al Pixel del navegador. Ambos comparten el mismo `eventId`, así Meta
 * deduplica y no cuenta el lead dos veces.
 *
 * Por qué importa: el Pixel de navegador pierde entre un 20 % y un 40 % de las
 * conversiones (iOS/ITP, bloqueadores, cookies rechazadas). El envío server-side
 * recupera esas conversiones, así que el algoritmo de Meta aprende mejor a quién
 * enseñar el anuncio y baja el coste por lead. Es la ventaja que casi ninguna
 * agencia pequeña tiene montada.
 *
 * Requiere en el entorno:
 *   NEXT_PUBLIC_META_PIXEL_ID   → ID del pixel (también lo usa el navegador)
 *   META_CAPI_ACCESS_TOKEN      → token de la Conversions API (Events Manager)
 *   META_TEST_EVENT_CODE        → (opcional) para depurar en «Test events»
 */

import { createHash } from "crypto";

const GRAPH_VERSION = "v21.0";

export interface LeadEventInput {
  eventId: string;
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  /** Datos de campaña / contexto para custom_data. */
  custom?: Record<string, string | number | undefined>;
}

/** SHA-256 en minúsculas y sin espacios, como exige Meta para PII. */
function hash(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

/** Normaliza teléfono a solo dígitos con prefijo de país (default España). */
function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  // Número nacional español de 9 dígitos sin prefijo → anteponer 34.
  if (digits.length === 9) digits = `34${digits}`;
  return digits;
}

/** Construye `_fbc` a partir de fbclid si el navegador no lo dejó en cookie. */
function deriveFbc(fbc: string | undefined, fbclid: string | undefined): string | undefined {
  if (fbc) return fbc;
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

/**
 * Envía el evento Lead a Meta. Best-effort: nunca lanza — si falla, lo registra
 * y devuelve false, para no romper el alta del lead.
 */
export async function sendMetaLeadEvent(input: LeadEventInput): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;

  // Sin credenciales configuradas: no-op silencioso (p. ej. en local).
  if (!pixelId || !token) return false;

  const phone = normalizePhone(input.phone);
  const fbc = deriveFbc(input.fbc, input.fbclid);

  const userData: Record<string, unknown> = {
    em: hash(input.email) ? [hash(input.email)] : undefined,
    ph: phone ? [hash(phone)] : undefined,
    fn: hash(input.firstName) ? [hash(input.firstName)] : undefined,
    ln: hash(input.lastName) ? [hash(input.lastName)] : undefined,
    client_ip_address: input.clientIp,
    client_user_agent: input.userAgent,
    fbp: input.fbp,
    fbc,
  };
  // Limpia claves vacías (Meta rechaza arrays/valores nulos).
  for (const k of Object.keys(userData)) {
    if (userData[k] === undefined || userData[k] === null) delete userData[k];
  }

  const customData: Record<string, unknown> = {};
  if (input.custom) {
    for (const [k, v] of Object.entries(input.custom)) {
      if (v !== undefined && v !== "") customData[k] = v;
    }
  }

  // El token va en el body, no en la query string: las URLs acaban en logs
  // (Vercel, proxies) y el body de un POST https no.
  const payload: Record<string, unknown> = {
    access_token: token,
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[meta-capi] non-ok", res.status, text.slice(0, 500));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[meta-capi] fetch failed", err);
    return false;
  }
}
