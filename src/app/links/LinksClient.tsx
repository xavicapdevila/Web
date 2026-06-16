"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'
import JobsModal from './JobsModal'
import type { Lang, LinksDoc } from '@/lib/links-content'

const iconStyles: Record<string, { bg: string; color: string }> = {
  ig:      { bg: '#fce4ec', color: '#c2185b' },
  fb:      { bg: '#e3f2fd', color: '#1565c0' },
  tk:      { bg: '#f3e5f5', color: '#6a1b9a' },
  props:   { bg: '#e8f5e9', color: '#2e7d32' },
  sell:    { bg: '#fff8e1', color: '#f57f17' },
  work:    { bg: '#e8eaf6', color: '#283593' },
  contact: { bg: '#fbe9e7', color: '#bf360c' },
  jobs:    { bg: '#f0fdf4', color: '#166534' },
}

// Used when an item references an icon key the web doesn't know yet
// (e.g. a brand-new link created in Ora).
const FALLBACK_STYLE = { bg: '#eceae6', color: '#555' }

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
  jobs: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
}

const FallbackIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ca', label: 'CA' },
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

export default function LinksClient({ data, defaultJobsOpen = false }: { data: LinksDoc; defaultJobsOpen?: boolean }) {
  const [lang, setLang] = useState<Lang>('ca')
  const params = useSearchParams()
  const [jobsOpen, setJobsOpen] = useState(() => defaultJobsOpen || params.get('jobs') === '1')

  useEffect(() => {
    if (GA_ID && window.gtag) {
      window.gtag('event', 'page_view', { page_location: window.location.href, page_title: 'Links' })
    }
    fetch('/api/links-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview' }),
    }).catch(() => {})
  }, [])

  const trackClick = useCallback((label: string, href: string, id: string) => {
    window.gtag?.('event', 'links_click', { link_label: label, link_url: href })
    fetch('/api/links-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'click', key: id }),
    }).catch(() => {})
  }, [])

  const handleJobsClick = useCallback((label: string, id: string) => {
    trackClick(label, '', id)
    setJobsOpen(true)
  }, [trackClick])

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: '/links' });
          `}</Script>
        </>
      )}
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-[480px] px-4 py-10">

        <div className="flex flex-col items-center mb-10">
          <Image src="/logo.svg" alt="The Vila Home" width={180} height={56} />
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#C9B99A] -mt-4">
            Human Real Estate
          </span>
          <div className="flex gap-3 mt-5">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-[10px] tracking-[0.12em] font-medium transition-colors ${
                  lang === code
                    ? 'text-[#C9B99A]'
                    : 'text-neutral-600 hover:text-neutral-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {data.sections.map((group) => {
          const items = group.items.filter((i) => i.active)
          if (items.length === 0) return null

          return (
            <div key={group.id} className="mb-2">
              <p className="text-[10px] tracking-[0.12em] uppercase text-[#C9B99A] mb-2 px-1">
                {group.title[lang]}
              </p>
              {items.map((item) => {
                const style = iconStyles[item.icon] ?? FALLBACK_STYLE
                const glyph = iconSvgs[item.icon] ?? FallbackIcon
                const label = item.label[lang]
                const desc = item.desc[lang]

                if (item.comingSoon) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleJobsClick(label, item.id)}
                      className="flex items-center gap-4 w-full px-4 py-3.5 mb-2.5 rounded-xl border border-[#2a2a2a] bg-[#111111] hover:bg-[#1a1a1a] transition-colors text-left group"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {glyph}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-100 leading-tight">{label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 leading-tight">{desc}</p>
                      </div>
                      <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors flex-shrink-0">
                        <ArrowRight />
                      </span>
                    </button>
                  )
                }

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={() => trackClick(label, item.href, item.id)}
                    className="flex items-center gap-4 w-full px-4 py-3.5 mb-2.5 rounded-xl border border-[#2a2a2a] bg-[#111111] hover:bg-[#1a1a1a] transition-colors no-underline text-inherit group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      {glyph}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-100 leading-tight">{label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-tight">{desc}</p>
                    </div>
                    <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors flex-shrink-0">
                      <ArrowRight />
                    </span>
                  </a>
                )
              })}
            </div>
          )
        })}

        <div className="mt-6 pt-4 border-t border-[#2a2a2a] text-center">
          <a href="https://www.thevilahome.com" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors no-underline">
            thevilahome.com
          </a>
        </div>
      </div>
    </main>

    <JobsModal open={jobsOpen} onClose={() => setJobsOpen(false)} lang={lang} />
    </>
  )
}
