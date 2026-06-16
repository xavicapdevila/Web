/**
 * Server-side store for the editable /links content.
 * Lives in Vercel Blob (links-content.json) — same pattern as links-analytics.ts.
 * Edited remotely from Ora (app.thevilahome.com) via the Bearer-protected
 * /api/links route; rendered by the public /links page.
 *
 * If the blob is missing or unreachable (or no token in local dev), callers
 * fall back to DEFAULT_CONTENT so /links never breaks.
 */

const BLOB_KEY = 'links-content.json'

export type Lang = 'ca' | 'es' | 'en' | 'fr'
export const LANGS: Lang[] = ['ca', 'es', 'en', 'fr']

export type Translated = Record<Lang, string>

export type LinkItem = {
  id: string
  icon: string
  href: string
  external: boolean
  comingSoon: boolean
  active: boolean
  label: Translated
  desc: Translated
}

export type LinkSection = {
  id: string
  title: Translated
  items: LinkItem[]
}

export type LinksDoc = {
  sections: LinkSection[]
}

/**
 * Seed = the content that used to live hardcoded in LinksClient.tsx.
 * Item ids match the legacy icon keys so historical click analytics
 * (keyed by icon) keep lining up after the migration.
 */
export const DEFAULT_CONTENT: LinksDoc = {
  sections: [
    {
      id: 'find-us',
      title: { ca: "Troba'ns", es: 'Encuéntranos', en: 'Find us', fr: 'Retrouvez-nous' },
      items: [
        {
          id: 'ig', icon: 'ig', href: 'https://www.instagram.com/thevilahome',
          external: true, comingSoon: false, active: true,
          label: { ca: 'Instagram', es: 'Instagram', en: 'Instagram', fr: 'Instagram' },
          desc: {
            ca: 'El dia a dia, sense filtres', es: 'El día a día, sin filtros',
            en: 'Day to day, no filters', fr: 'Le quotidien, sans filtres',
          },
        },
        {
          id: 'fb', icon: 'fb', href: 'https://www.facebook.com/profile.php?id=100093001283637',
          external: true, comingSoon: false, active: true,
          label: { ca: 'Facebook', es: 'Facebook', en: 'Facebook', fr: 'Facebook' },
          desc: {
            ca: 'Per als que encara esteu per aquí', es: 'Para los que aún están por aquí',
            en: 'For those still around', fr: 'Pour ceux qui sont encore là',
          },
        },
        {
          id: 'tk', icon: 'tk', href: 'https://www.tiktok.com/@thevilahome',
          external: true, comingSoon: false, active: true,
          label: { ca: 'TikTok', es: 'TikTok', en: 'TikTok', fr: 'TikTok' },
          desc: {
            ca: 'Cases, persones i alguna sorpresa', es: 'Casas, personas y alguna sorpresa',
            en: 'Homes, people and some surprises', fr: 'Maisons, personnes et surprises',
          },
        },
      ],
    },
    {
      id: 'what-we-do',
      title: { ca: 'El que fem', es: 'Lo que hacemos', en: 'What we do', fr: 'Ce que nous faisons' },
      items: [
        {
          id: 'props', icon: 'props', href: '/propiedades',
          external: false, comingSoon: false, active: true,
          label: { ca: 'Propietats', es: 'Propiedades', en: 'Properties', fr: 'Propriétés' },
          desc: {
            ca: 'Cases de veritat, per a persones de veritat', es: 'Casas de verdad, para personas de verdad',
            en: 'Real homes, for real people', fr: 'Vraies maisons, pour de vraies personnes',
          },
        },
        {
          id: 'sell', icon: 'sell', href: '/valoracion',
          external: false, comingSoon: false, active: true,
          label: { ca: 'Vull vendre casa meva', es: 'Quiero vender mi casa', en: 'I want to sell', fr: 'Je veux vendre' },
          desc: {
            ca: 'Et diem el que val. Sense embuts.', es: 'Te decimos lo que vale. Sin rodeos.',
            en: "We tell you what it's worth. No nonsense.", fr: 'On vous dit ce que ça vaut. Sans détour.',
          },
        },
        {
          id: 'work', icon: 'work', href: '/quienes-somos',
          external: false, comingSoon: false, active: true,
          label: { ca: 'Com som', es: 'Cómo somos', en: 'Who we are', fr: 'Qui sommes-nous' },
          desc: {
            ca: 'Per què fem les coses diferent', es: 'Por qué hacemos esto diferente',
            en: 'Why we do things differently', fr: 'Pourquoi nous faisons les choses autrement',
          },
        },
        {
          id: 'contact', icon: 'contact', href: '/contacto',
          external: false, comingSoon: false, active: true,
          label: { ca: 'Parlem', es: 'Hablamos', en: "Let's talk", fr: 'Parlons' },
          desc: {
            ca: 'Sense compromís. De veritat.', es: 'Sin compromiso. En serio.',
            en: 'No commitment. Seriously.', fr: 'Sans engagement. Vraiment.',
          },
        },
        {
          id: 'jobs', icon: 'jobs', href: '',
          external: false, comingSoon: true, active: true,
          label: { ca: 'Treballa amb nosaltres', es: 'Trabaja con nosotros', en: 'Work with us', fr: 'Travailler avec nous' },
          desc: {
            ca: 'Potser ets tu qui busquem', es: 'Quizás eres tú quien buscamos',
            en: "Maybe you're who we're looking for", fr: 'Peut-être êtes-vous qui nous cherchons',
          },
        },
      ],
    },
  ],
}

async function readBlob(): Promise<LinksDoc | null> {
  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return null
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    const res = await fetch(newest.url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as LinksDoc
  } catch {
    return null
  }
}

/**
 * Returns the current /links content, falling back to DEFAULT_CONTENT when the
 * blob is missing or unreachable. Safe to call from server components.
 */
export async function getLinksContent(): Promise<LinksDoc> {
  const doc = await readBlob()
  if (!doc || !Array.isArray(doc.sections)) return DEFAULT_CONTENT
  return doc
}

/**
 * Persists the full content document and prunes older blob versions.
 * Requires BLOB_READ_WRITE_TOKEN (present in prod and in .env.local).
 */
export async function saveLinksContent(doc: LinksDoc): Promise<void> {
  const { put, list, del } = await import('@vercel/blob')
  await put(BLOB_KEY, JSON.stringify(doc), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0, // content changes on edit — keep reads fresh
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
