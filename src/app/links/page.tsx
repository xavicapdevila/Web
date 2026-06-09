import type { Metadata } from 'next'
import LinksClient from './LinksClient'

export const metadata: Metadata = {
  title: 'The Vila Home · Links',
  description: 'Inmobiliaria humana en la costa catalana. Garraf · Baix Penedès.',
  openGraph: {
    title: 'The Vila Home',
    description: 'Inmobiliaria humana en la costa catalana.',
    url: 'https://www.thevilahome.com/links',
  },
}

export default function LinksPage() {
  return <LinksClient />
}
