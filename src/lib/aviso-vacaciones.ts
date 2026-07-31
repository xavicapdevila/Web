/**
 * Aviso de vacaciones configurable desde Ora (Reglas → Web) o el /admin.
 * Vive en Vercel Blob (aviso-vacaciones.json) — mismo patrón que
 * links-content.ts pero sin histórico: es un documento de tres campos y
 * re-guardarlo cuesta un clic, así que no hay nada irrecuperable.
 *
 * Los TEXTOS de la barra también nacen aquí (textosAviso): la API los sirve ya
 * montados en los 4 idiomas y tanto la barra pública como la vista previa de
 * Ora enseñan lo mismo sin copiar plantillas.
 */

const BLOB_KEY = 'aviso-vacaciones.json'

export type AvisoVacaciones = {
  activo: boolean
  /** Inicio y fin en hora de Madrid, "YYYY-MM-DDTHH:mm" (o null = sin límite). */
  desde: string | null
  hasta: string | null
}

export type TextosAviso = { es: string; ca: string; en: string; fr: string }

export const AVISO_DEFAULT: AvisoVacaciones = { activo: false, desde: null, hasta: null }

const RE_FECHA_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export function normalizaFechaHora(v: unknown): string | null {
  return typeof v === 'string' && RE_FECHA_HORA.test(v) ? v : null
}

/** Ahora en Madrid como "YYYY-MM-DDTHH:mm" — comparable con desde/hasta. */
export function ahoraMadrid(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date()).replace(' ', 'T')
}

/**
 * Los 4 textos de la barra para un fin dado: la fecha de vuelta que se enseña
 * es el DÍA de `hasta` (la hora solo decide cuándo se retira la barra).
 */
export function textosAviso(hasta: string | null): TextosAviso {
  if (!hasta) {
    return {
      es: "Estamos de vacaciones.",
      ca: "Estem de vacances.",
      en: "We are on holiday.",
      fr: "Nous sommes en vacances.",
    }
  }
  const dia = new Date(`${hasta.slice(0, 10)}T12:00:00Z`)
  const f = (locale: string) =>
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" }).format(dia)
  return {
    es: `Estamos de vacaciones. Volvemos el ${f("es-ES")}.`,
    ca: `Estem de vacances. Tornem el ${f("ca-ES")}.`,
    en: `We are on holiday. Back on ${f("en-GB")}.`,
    fr: `Nous sommes en vacances. De retour le ${f("fr-FR")}.`,
  }
}

/** Configuración cruda tal y como se guardó, para los paneles de admin. */
export async function getAvisoVacaciones(): Promise<AvisoVacaciones> {
  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return AVISO_DEFAULT
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    const res = await fetch(newest.url, { cache: 'no-store' })
    if (!res.ok) return AVISO_DEFAULT
    const doc = (await res.json()) as Partial<AvisoVacaciones> & { vuelta?: unknown }
    // Formato viejo ({vuelta: "YYYY-MM-DD"}): el día de vuelta era el fin.
    const legacy = typeof doc.vuelta === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(doc.vuelta)
      ? `${doc.vuelta}T00:00`
      : null
    return {
      activo: Boolean(doc.activo),
      desde: normalizaFechaHora(doc.desde),
      hasta: normalizaFechaHora(doc.hasta) ?? legacy,
    }
  } catch {
    return AVISO_DEFAULT
  }
}

/**
 * El aviso tal y como debe verse en la web pública: solo dentro de la ventana
 * [desde, hasta) en hora de Madrid, con los textos ya montados.
 */
export async function getAvisoPublico(): Promise<{ activo: boolean; textos: TextosAviso | null }> {
  const aviso = await getAvisoVacaciones()
  const ahora = ahoraMadrid()
  const visible =
    aviso.activo &&
    (!aviso.desde || aviso.desde <= ahora) &&
    (!aviso.hasta || ahora < aviso.hasta)
  if (!visible) return { activo: false, textos: null }
  return { activo: true, textos: textosAviso(aviso.hasta) }
}

export async function saveAvisoVacaciones(aviso: AvisoVacaciones): Promise<void> {
  const { put } = await import('@vercel/blob')
  await put(BLOB_KEY, JSON.stringify(aviso), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}
