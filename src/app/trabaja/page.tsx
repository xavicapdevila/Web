import type { Metadata } from 'next'
import LinksClient from '../links/LinksClient'

export const metadata: Metadata = {
  title: 'Treballa amb nosaltres — The Vila Home',
  description: "Uneix-te a l'equip de The Vila Home. Envia'ns el teu CV i et contactem.",
  robots: { index: false },
}

export default function TrabajaPage() {
  return <LinksClient defaultJobsOpen />
}
