import { NextRequest, NextResponse } from 'next/server'
import {
  getLinksContent,
  saveLinksContent,
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

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const doc = await getLinksContent()
  return NextResponse.json(doc, { headers: { 'Cache-Control': 'no-store' } })
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
