/**
 * Almacén de leads de captación (/vender) en Vercel Blob.
 *
 * Un único fichero JSON con el histórico de leads y su atribución completa, para
 * poder responder «¿qué campaña / anuncio trajo este encargo?» y montar un
 * dashboard más adelante. Mismo patrón que links-analytics.ts.
 *
 * Producción → Vercel Blob (vender-leads.json)
 * Local dev  → no-op (no hay Blob; el lead igualmente llega por email)
 */

const BLOB_KEY = "vender-leads.json";
const IS_VERCEL = process.env.VERCEL === "1";
const MAX_LEADS = 5000; // tope defensivo; conservamos los más recientes
// RGPD: retención máxima de leads no formalizados (la política de privacidad
// declara 1 año). Al guardar, se purgan los que superen este plazo.
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface StoredLead {
  id: string; // = eventId (permite cruzar con Meta)
  ts: string; // ISO
  lang: string;
  situation: string; // clave (ahora | meses | explorando | en_venta)
  name: string;
  phone: string;
  email: string;
  zone: string;
  message?: string;
  // Atribución
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  landing?: string;
  referrer?: string;
  // Contexto técnico
  ip?: string;
  userAgent?: string;
}

async function readAll(): Promise<StoredLead[]> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
    const res = await fetch(newest.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as StoredLead[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(leads: StoredLead[]): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(leads), {
    access: "public",
    contentType: "application/json",
  });
  // Limpia versiones antiguas del blob (Blob versiona por escritura).
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
    if (sorted.length > 1) {
      await Promise.allSettled(sorted.slice(1).map((b) => del(b.url)));
    }
  } catch {}
}

/** Guarda un lead. Best-effort: si falla, no rompe el flujo (el email ya salió). */
export async function saveLead(lead: StoredLead): Promise<void> {
  if (!IS_VERCEL) return;
  try {
    const leads = await readAll();
    leads.push(lead);
    // Purga por edad (retención RGPD) y recorta por tope defensivo.
    const cutoff = Date.now() - MAX_AGE_MS;
    const fresh = leads.filter((l) => {
      const t = new Date(l.ts).getTime();
      return !Number.isFinite(t) || t >= cutoff;
    });
    const trimmed = fresh.length > MAX_LEADS ? fresh.slice(-MAX_LEADS) : fresh;
    await writeAll(trimmed);
  } catch (err) {
    console.error("[leads-store] save failed", err);
  }
}

/** Devuelve todos los leads (para un futuro dashboard de atribución). */
export async function getLeads(): Promise<StoredLead[]> {
  if (!IS_VERCEL) return [];
  return readAll();
}
