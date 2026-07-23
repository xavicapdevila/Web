/**
 * Server-side link analytics tracker.
 * Production  → Vercel Blob  (carpeta links-analytics/, nombre con sufijo aleatorio)
 * Local dev   → no-op (GA4 is the source of truth locally)
 *
 * Por qué la carpeta + sufijo aleatorio: el blob es `access: "public"`, así que
 * su URL es accesible por cualquiera que la conozca. Con una clave FIJA
 * (`links-analytics.json`) la URL era adivinable — el hostname del store ya es
 * público porque las imágenes del blog salen de ahí —, de modo que las
 * analíticas se leían saltándose el Bearer de /api/links-analytics. El sufijo
 * aleatorio hace la URL impredecible (el lector la localiza con `list()`), que
 * es la única protección real para un blob público.
 *
 * Efecto colateral bueno: un `put` a clave fija sin `allowOverwrite` fallaba en
 * la 2ª escritura (@vercel/blob v2) y congelaba los contadores. Al crear un
 * blob nuevo por escritura, eso desaparece.
 */

const NEW_PREFIX = 'links-analytics/'      // carpeta → los nombres con sufijo casan en list({ prefix })
const LEGACY_KEY = 'links-analytics.json'  // JSON público antiguo (URL adivinable) — se extingue al migrar
const IS_VERCEL = process.env.VERCEL === '1'

/** Tope de claves de clic distintas: el endpoint de track es público, así que
 *  sin esto alguien podría inyectar claves sin límite y engordar el blob. */
const MAX_CLICK_KEYS = 200

export type AnalyticsData = {
  pageviews: Record<string, number>                      // "YYYY-MM" → count
  clicks: Record<string, Record<string, number>>         // iconKey   → "YYYY-MM" → count
}

const EMPTY: AnalyticsData = { pageviews: {}, clicks: {} }

function monthKey(): string {
  return new Date().toISOString().slice(0, 7) // "YYYY-MM"
}

type BlobEntry = { url: string; pathname: string; uploadedAt: Date }

function newest(blobs: BlobEntry[]): BlobEntry | undefined {
  if (blobs.length === 0) return undefined
  return [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )[0]
}

async function fetchJson(url: string): Promise<AnalyticsData> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return EMPTY
  return (await res.json()) as AnalyticsData
}

async function readBlob(): Promise<AnalyticsData> {
  try {
    const { list } = await import('@vercel/blob')
    // 1) Store nuevo (nombres con sufijo aleatorio).
    const pick = newest((await list({ prefix: NEW_PREFIX })).blobs)
    if (pick) return await fetchJson(pick.url)
    // 2) Fallback al JSON antiguo mientras no haya habido ninguna escritura tras
    //    el deploy: así no se pierde continuidad. En la 1ª escritura el store
    //    nuevo queda sembrado con estos datos y el antiguo se borra (writeBlob).
    const legacy = (await list({ prefix: LEGACY_KEY })).blobs.find(b => b.pathname === LEGACY_KEY)
    if (legacy) return await fetchJson(legacy.url)
    return EMPTY
  } catch {
    return EMPTY
  }
}

async function writeBlob(data: AnalyticsData): Promise<void> {
  const { put, list, del } = await import('@vercel/blob')
  await put(`${NEW_PREFIX}data.json`, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true, // URL impredecible + evita el conflicto de sobrescritura
  })
  // Podar: cada escritura crea un blob nuevo; conservar solo el más reciente.
  try {
    const stale = (await list({ prefix: NEW_PREFIX })).blobs
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(1)
    if (stale.length) await Promise.allSettled(stale.map(b => del(b.url)))
  } catch {}
  // Migración única: eliminar el JSON público antiguo (URL adivinable) una vez
  // el store nuevo ya tiene los datos. Best-effort.
  try {
    const legacy = (await list({ prefix: LEGACY_KEY })).blobs.filter(b => b.pathname === LEGACY_KEY)
    if (legacy.length) await Promise.allSettled(legacy.map(b => del(b.url)))
  } catch {}
}

export async function trackPageView(): Promise<void> {
  if (!IS_VERCEL) return
  try {
    const data = await readBlob()
    const mk = monthKey()
    data.pageviews[mk] = (data.pageviews[mk] ?? 0) + 1
    await writeBlob(data)
  } catch {}
}

export async function trackClick(iconKey: string): Promise<void> {
  if (!IS_VERCEL) return
  try {
    const data = await readBlob()
    // No crear claves nuevas por encima del tope (anti-abuso; el endpoint es público).
    if (!data.clicks[iconKey] && Object.keys(data.clicks).length >= MAX_CLICK_KEYS) return
    const mk = monthKey()
    if (!data.clicks[iconKey]) data.clicks[iconKey] = {}
    data.clicks[iconKey][mk] = (data.clicks[iconKey][mk] ?? 0) + 1
    await writeBlob(data)
  } catch {}
}

export async function getAnalytics(): Promise<AnalyticsData> {
  if (!IS_VERCEL) return EMPTY
  return readBlob()
}
