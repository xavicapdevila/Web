/**
 * Aviso de vacaciones configurable desde /admin.
 * Vive en Vercel Blob (aviso-vacaciones.json) — mismo patrón que
 * links-content.ts pero sin histórico: es un documento de dos campos y
 * re-guardarlo cuesta un clic, así que no hay nada irrecuperable.
 */

const BLOB_KEY = 'aviso-vacaciones.json'

export type AvisoVacaciones = {
  activo: boolean
  /** Fecha de vuelta (YYYY-MM-DD) o null para un aviso sin fecha. */
  vuelta: string | null
}

export const AVISO_DEFAULT: AvisoVacaciones = { activo: false, vuelta: null }

/** Hoy en Madrid como YYYY-MM-DD (las funciones serverless corren en UTC). */
export function hoyMadrid(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date())
}

/** Configuración cruda tal y como se guardó, para el panel de admin. */
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
    const doc = (await res.json()) as Partial<AvisoVacaciones>
    return {
      activo: Boolean(doc.activo),
      vuelta: typeof doc.vuelta === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(doc.vuelta) ? doc.vuelta : null,
    }
  } catch {
    return AVISO_DEFAULT
  }
}

/**
 * El aviso tal y como debe verse en la web pública: apagado si no está activo
 * o si ya llegó el día de la vuelta (se retira solo esa mañana).
 */
export async function getAvisoPublico(): Promise<AvisoVacaciones> {
  const aviso = await getAvisoVacaciones()
  if (!aviso.activo) return AVISO_DEFAULT
  if (aviso.vuelta && aviso.vuelta <= hoyMadrid()) return AVISO_DEFAULT
  return aviso
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
