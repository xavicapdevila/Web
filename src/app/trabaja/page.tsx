import type { Metadata } from 'next'
import LinksClient from '../links/LinksClient'
import { getLinksContent } from '@/lib/links-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Treballa amb nosaltres — The Vila Home',
  description: "Uneix-te a l'equip de The Vila Home. Envia'ns el teu CV i et contactem.",
  robots: { index: false },
}

export default async function TrabajaPage() {
  const data = await getLinksContent()
  return <LinksClient data={data} defaultJobsOpen />
}
