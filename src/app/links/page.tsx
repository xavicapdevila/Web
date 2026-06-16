import type { Metadata } from 'next'
import LinksClient from './LinksClient'
import { getLinksContent } from '@/lib/links-content'

// Content is edited remotely from Ora and stored in Blob; render fresh so
// edits show up immediately.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The Vila Home · Links',
  description: 'Inmobiliaria humana en la costa catalana. Garraf · Baix Penedès.',
  openGraph: {
    title: 'The Vila Home',
    description: 'Inmobiliaria humana en la costa catalana.',
    url: 'https://www.thevilahome.com/links',
  },
}

export default async function LinksPage() {
  const data = await getLinksContent()
  return <LinksClient data={data} />
}
