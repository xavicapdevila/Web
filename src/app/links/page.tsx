import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'The Vila Home · Links',
  description: 'Inmobiliaria humana en la costa catalana. Garraf · Baix Penedès.',
  openGraph: {
    title: 'The Vila Home',
    description: 'Inmobiliaria humana en la costa catalana.',
    url: 'https://www.thevilahome.com/links',
  },
}

const links = [
  {
    section: 'Encuéntranos',
    items: [
      {
        label: 'Instagram',
        desc: 'El día a día, sin filtros',
        href: 'https://www.instagram.com/thevilahome',
        external: true,
        icon: 'ig',
      },
      {
        label: 'Facebook',
        desc: 'Para los que aún están por aquí',
        href: 'https://www.facebook.com/profile.php?id=100093001283637',
        external: true,
        icon: 'fb',
      },
      {
        label: 'TikTok',
        desc: 'Casas, personas y alguna sorpresa',
        href: 'https://www.tiktok.com/@thevilahome',
        external: true,
        icon: 'tk',
      },
    ],
  },
  {
    section: 'Lo que hacemos',
    items: [
      {
        label: 'Propiedades',
        desc: 'Casas de verdad, para personas de verdad',
        href: '/propiedades',
        external: false,
        icon: 'props',
      },
      {
        label: 'Quiero vender mi casa',
        desc: 'Te decimos lo que vale. Sin rodeos.',
        href: '/valoracion',
        external: false,
        icon: 'sell',
      },
      {
        label: 'Cómo somos',
        desc: 'Por qué hacemos esto diferente',
        href: '/quienes-somos',
        external: false,
        icon: 'work',
      },
      {
        label: 'Hablamos',
        desc: 'Sin compromiso. En serio.',
        href: '/contacto',
        external: false,
        icon: 'contact',
      },
    ],
  },
]

const iconStyles: Record<string, { bg: string; color: string }> = {
  ig:      { bg: '#fce4ec', color: '#c2185b' },
  fb:      { bg: '#e3f2fd', color: '#1565c0' },
  tk:      { bg: '#f3e5f5', color: '#6a1b9a' },
  props:   { bg: '#e8f5e9', color: '#2e7d32' },
  sell:    { bg: '#fff8e1', color: '#f57f17' },
  work:    { bg: '#e8eaf6', color: '#283593' },
  contact: { bg: '#fbe9e7', color: '#bf360c' },
}

const iconSvgs: Record<string, React.ReactNode> = {
  ig: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  ),
  fb: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  tk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    </svg>
  ),
  props: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  sell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <line x1="12" y1="17" x2="12" y2="13"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  ),
  work: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
}

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)


export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="mx-auto max-w-[480px] px-4 py-10">

        <div className="flex flex-col items-center mb-10">
          <Image src="/logo.svg" alt="The Vila Home" width={180} height={56} />
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#C9B99A] -mt-4">
            Human Real Estate
          </span>
        </div>

        {links.map((group) => (
          <div key={group.section} className="mb-2">
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#C9B99A] mb-2 px-1">
              {group.section}
            </p>
            {group.items.map((item) => {
              const style = iconStyles[item.icon]
              return (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-4 w-full px-4 py-3.5 mb-2.5 rounded-xl border border-[#2a2a2a] bg-[#111111] hover:bg-[#1a1a1a] transition-colors no-underline text-inherit group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {iconSvgs[item.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-100 leading-tight">{item.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                  <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors flex-shrink-0">
                    <ArrowRight />
                  </span>
                </a>
              )
            })}
          </div>
        ))}

        <div className="mt-6 pt-4 border-t border-[#2a2a2a] text-center">
          <a href="https://www.thevilahome.com" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors no-underline">thevilahome.com</a>
        </div>
      </div>
    </main>
  )
}
