import { NextRequest, NextResponse } from 'next/server'
import {
  getLinksContent,
  saveLinksContent,
  listLinksHistory,
  getLinksVersion,
  LANGS,
  type LinksDoc,
  type Translated,
} from '@/lib/links-content'

/**
 * Bearer-protected CRUD for the /links content document.
 * Only Ora (server-side, holding LINKS_ADMIN_SECRET) is meant to call this.
 *   GET → full document (for the editor)
 *   PUT → replace the whole document
 */

function authorized(req: NextRequest): boolean {
  const secret = process.env.LINKS_ADMIN_SECRET
  if (!secret) return false // refuse writes/reads until the secret is configured
  return req.headers.get('Authorization') === `Bearer ${secret}`
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

function translated(v: unknown): Translated {
  const o = v && typeof v === 'object' ? (v as Record<string, unknown>) : {}
  return { ca: str(o.ca), es: str(o.es), en: str(o.en), fr: str(o.fr) }
}

/**
 * URL por idioma: opcional y PARCIAL — solo se guardan los idiomas con valor,
 * y si no queda ninguno se omite el campo. Así un item sin overrides no arrastra
 * cuatro cadenas vacías por el documento.
 */
function hrefByLang(v: unknown): Partial<Translated> | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const out: Partial<Translated> = {}
  for (const l of LANGS) {
    const s = str(o[l]).trim()
    if (s) out[l] = s
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** Coerce arbitrary input into a clean LinksDoc (fills langs, generates ids). */
function normalizeDoc(body: unknown): LinksDoc | null {
  if (!body || typeof body !== 'object') return null
  const sections = (body as { sections?: unknown }).sections
  if (!Array.isArray(sections)) return null
  return {
    sections: sections.map((s) => {
      const sec = (s ?? {}) as Record<string, unknown>
      const items = Array.isArray(sec.items) ? sec.items : []
      return {
        id: str(sec.id) || crypto.randomUUID(),
        title: translated(sec.title),
        items: items.map((it) => {
          const item = (it ?? {}) as Record<string, unknown>
          return {
            id: str(item.id) || crypto.randomUUID(),
            icon: str(item.icon) || 'props',
            href: str(item.href),
            hrefByLang: hrefByLang(item.hrefByLang),
            external: Boolean(item.external),
            comingSoon: Boolean(item.comingSoon),
            active: item.active === undefined ? true : Boolean(item.active),
            label: translated(item.label),
            desc: translated(item.desc),
          }
        }),
      }
    }),
  }
}

/**
 *   GET                  → documento vivo
 *   GET ?historial=1     → versiones archivadas (fecha + url), recientes primero
 *   GET ?version=<url>   → contenido de una versión archivada
 * Para restaurar: leer la versión y volver a mandarla por PUT.
 */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const noStore = { 'Cache-Control': 'no-store' }

  if (req.nextUrl.searchParams.get('historial') === '1') {
    return NextResponse.json({ versiones: await listLinksHistory() }, { headers: noStore })
  }

  const version = req.nextUrl.searchParams.get('version')
  if (version) {
    // Solo URLs del propio Blob: sin esto, esta ruta autenticada haría de
    // proxy hacia cualquier host que le pidieran (SSRF).
    if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(version)) {
      return NextResponse.json({ error: 'Invalid version url' }, { status: 400 })
    }
    const doc = await getLinksVersion(version)
    if (!doc) return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    return NextResponse.json(doc, { headers: noStore })
  }

  const doc = await getLinksContent()
  return NextResponse.json(doc, { headers: noStore })
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const doc = normalizeDoc(body)
  if (!doc) {
    return NextResponse.json({ error: 'Invalid document shape' }, { status: 400 })
  }
  try {
    await saveLinksContent(doc)
  } catch {
    return NextResponse.json({ error: 'Failed to persist' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
