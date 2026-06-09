/**
 * Server-side link analytics tracker.
 * Production  → Vercel Blob  (links-analytics.json)
 * Local dev   → no-op (GA4 is the source of truth locally)
 */

const BLOB_KEY = 'links-analytics.json'
const IS_VERCEL = process.env.VERCEL === '1'

export type AnalyticsData = {
  pageviews: Record<string, number>                      // "YYYY-MM" → count
  clicks: Record<string, Record<string, number>>         // iconKey   → "YYYY-MM" → count
}

const EMPTY: AnalyticsData = { pageviews: {}, clicks: {} }

function monthKey(): string {
  return new Date().toISOString().slice(0, 7) // "YYYY-MM"
}

async function readBlob(): Promise<AnalyticsData> {
  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return EMPTY
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    const res = await fetch(newest.url, { cache: 'no-store' })
    if (!res.ok) return EMPTY
    return (await res.json()) as AnalyticsData
  } catch {
    return EMPTY
  }
}

async function writeBlob(data: AnalyticsData): Promise<void> {
  const { put, list, del } = await import('@vercel/blob')
  await put(BLOB_KEY, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
  })
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    if (sorted.length > 1) {
      await Promise.allSettled(sorted.slice(1).map(b => del(b.url)))
    }
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
