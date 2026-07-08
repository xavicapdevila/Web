/**
 * Disparo de eventos de conversión en el navegador — Meta Pixel (fbq) + GA4 (gtag).
 *
 * Best-effort y silencioso: cada plataforma solo recibe el evento si su script
 * está cargado, y eso solo ocurre si el visitante consintió marketing (Pixel) o
 * analítica (GA4). Por eso basta con comprobar que `fbq` / `gtag` existan: si no
 * hay consentimiento, no existen y no se envía nada. No hace nada en SSR.
 *
 * El evento `Lead` de los formularios NO pasa por aquí: ese se deduplica con la
 * Conversions API (server-side) usando un `eventId` compartido y se dispara en
 * LeadForm. Este helper es para señales de navegador sin envío server-side
 * (clic en teléfono/WhatsApp/email, uso del valorador…).
 */

type Params = Record<string, string | number | undefined>;

function fbqTrack(name: string, params?: Params, opts?: { eventID?: string }): void {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (w.fbq) w.fbq("track", name, params ?? {}, opts);
  } catch {}
}

function gaEvent(name: string, params?: Params): void {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.("event", name, params ?? {});
  } catch {}
}

/**
 * Clic en un canal de contacto directo (tel / WhatsApp / email) en /contacto.
 * Evento estándar de Meta `Contact` + su equivalente en GA4. Es una señal de
 * intención alta (sirve para públicos y retargeting), no una conversión de lead.
 */
export function trackContact(method: "phone" | "whatsapp" | "email"): void {
  fbqTrack("Contact", { content_category: method });
  gaEvent("contact", { method });
}
