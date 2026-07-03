# Código completo — Landing /vender (The Vila Home)

Todos los ficheros de la landing de captación de vendedores, para dar contexto a un chat/IA.
Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

---

## `src/app/vender/page.tsx`

```tsx
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import VenderContent from "@/components/vender/VenderContent";
import { getGooglePlaceData } from "@/lib/googlePlaces";

export const metadata: Metadata = {
  title: "Vender tu casa con The Vila Home | Sin suerte, sabiendo cómo",
  description:
    "Vender bien no es suerte, es saber hacerlo. Precio real desde el primer día, un único asesor de principio a fin, reportaje profesional y transparencia total. Solicita tu valoración gratuita.",
  alternates: { canonical: "https://www.thevilahome.com/vender" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.thevilahome.com/vender",
    siteName: "The Vila Home",
    title: "Vender tu casa con The Vila Home | Sin suerte, sabiendo cómo",
    description:
      "Precio real desde el primer día, un único asesor de principio a fin y transparencia total. Valoración gratuita sin compromiso.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Vila Home" }],
  },
};

export default async function VenderPage() {
  // Reseñas reales de Google. Mostramos SOLO las de 5★, pero el total (rating y
  // nº de reseñas) es el real de la ficha de Google.
  const place = await getGooglePlaceData();
  const fiveStarReviews = place.reviews.filter((r) => r.rating === 5).slice(0, 6);

  // /vender es una ruta "standalone" (el layout no la envuelve en
  // LanguageProvider), así que la envolvemos aquí para que el selector de
  // idioma de la landing funcione.
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <VenderContent
          reviews={fiveStarReviews}
          rating={place.rating}
          totalReviews={place.totalReviews}
        />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
```

---

## `src/components/vender/VenderContent.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import CountUp from "@/components/ui/CountUp";
import LeadForm from "@/components/vender/LeadForm";
import { siteConfig } from "@/lib/config";
import { LANGS } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { venderContent } from "@/lib/vender-content";
import type { GoogleReview } from "@/lib/googlePlaces";

/* ─────────────────────────────────────────────────────────────────────
   MONOCROMO + PIEDRA CÁLIDA (sin verde). Estructura tipo Vicio: hero a
   pantalla completa, tipografía enorme, carrusel, movimiento.
   Hero (foto): overlay #14120C · texto #F2EEE6 · piedra #C9C2B6
   Cuerpo: fondos #D9D3C7 / #E6E1D6 · tarjetas #F3F0E8 · borde #C7BFB0
   tinta #1C1913 · sub #5E594F · dim #857E70 · label #837C6E
   ───────────────────────────────────────────────────────────────────── */

const { googleReviews } = siteConfig;

const TEAM_PHOTOS = ["/images/agents/ariadna.jpg", "/images/agents/sofia.jpg", "/images/agents/xavier.jpg"];
const TEAM_NAMES = ["Ariadna Garcia", "Sofía Pascual", "Xavier Capdevila"];

const INCLUDE_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M7.5 3.75h6.69a2 2 0 0 1 1.42.59l4.55 4.55a2 2 0 0 1 0 2.82l-6.69 6.69a2 2 0 0 1-2.82 0l-4.55-4.55a2 2 0 0 1-.59-1.42V5.75a2 2 0 0 1 2-2Z" /><circle cx="9.5" cy="7.5" r="1.1" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8a1 1 0 0 1 .83-.45h6.94a1 1 0 0 1 .83.45L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" /><circle cx="12" cy="12.5" r="3.2" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19V5" /><path d="M4 19h16" /><rect x="7" y="11" width="3" height="5" rx="0.5" /><rect x="12.5" y="8" width="3" height="8" rx="0.5" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6.5 3.5h7.6L18.5 8v12.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M13.5 3.6V8h4.4" /><path d="M8.5 12.5h7M8.5 16h5" /></svg>,
];

/* ── Helpers ───────────────────────────────────────────────────────── */

function Stars({ className = "", starClass = "text-[#FBBC04]" }: { className?: string; starClass?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${starClass}`}><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" /></svg>
      ))}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#E6E1D6] border border-[#C7BFB0] text-[#1C1913] font-dm-serif text-lg shrink-0">{initials}</div>
  );
}

const Check = () => (
  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1C1913] text-[#F2EEE6] shrink-0 mt-0.5">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12.5l4 4 10-10" /></svg>
  </span>
);

function Wordmark({ dark = false }: { dark?: boolean }) {
  // logo.svg es blanco. dark=true → tinta oscura (sobre fondo claro).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="The Vila Home" className="h-9 sm:h-10 w-auto" style={dark ? { filter: "brightness(0)" } : undefined} />;
}

function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase text-left ${onDark ? "text-[#C9C2B6]" : "text-[#8A8172]"}`}>{children}</p>;
}

function CozyHome({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 92" fill="none" className={className} aria-hidden>
      <g stroke="#C9C2B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 46 47 27l25 19" /><path d="M28 43v28h38V43" /><rect x="36" y="52" width="10" height="10" rx="1" /><path d="M54 71V58h8v13" /><path d="M18 71h84" />
      </g>
    </svg>
  );
}

function PropertyCard() {
  return (
    <div className="relative w-[74vw] sm:w-[44vw] lg:w-[27vw] shrink-0 aspect-[4/5] rounded-2xl overflow-hidden border border-[#2A2926] bg-gradient-to-b from-[#211E18] to-[#0E0D0A]">
      <div className="absolute inset-0 flex items-center justify-center opacity-50"><CozyHome className="w-24 h-24" /></div>
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0B0A08] via-[#0B0A08]/70 to-transparent">
        <p className="font-dm-serif text-lg text-[#F2EEE6]">The Vila Home</p>
        <p className="text-[12px] text-[#8B867B] mt-0.5">Foto de tu propiedad</p>
      </div>
    </div>
  );
}

/* Tour virtual 3D (Matterport). Carga al hacer clic.
   ⚠️ XAVI: cambia la URL del iframe por la de vuestro tour real. */
function TourEmbed({ cta }: { cta: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden bg-[#14120C]">
      {open ? (
        <iframe src="https://my.matterport.com/show/?m=SxQL3iGyoDo&play=1&qs=1" title="Tour virtual 3D" loading="lazy" allow="fullscreen; xr-spatial-tracking" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button type="button" onClick={() => setOpen(true)} aria-label={cta} className="group absolute inset-0 flex flex-col items-center justify-center gap-5">
          <span aria-hidden className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(#C9C2B6 1px, transparent 1px), linear-gradient(90deg, #C9C2B6 1px, transparent 1px)", backgroundSize: "44px 44px", transform: "perspective(600px) rotateX(52deg) scale(1.6)", transformOrigin: "center 40%" }} />
          <span className="absolute inset-0 bg-gradient-to-t from-[#14120C] via-transparent to-transparent" aria-hidden />
          <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#F2EEE6] text-[#14120C] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="relative text-[13px] tracking-wide text-[#F2EEE6]/90">{cta}</span>
        </button>
      )}
    </div>
  );
}

/* ── Componente ────────────────────────────────────────────────────── */

interface Props {
  reviews?: GoogleReview[];
  rating?: number;
  totalReviews?: number;
}

export default function VenderContent({ reviews = [], rating: ratingProp, totalReviews }: Props) {
  const { lang, setLang } = useLanguage();
  const c = venderContent[lang] ?? venderContent.es;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [atContact, setAtContact] = useState(false);
  useEffect(() => {
    const el = document.getElementById("contacto");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const showCTA = scrolled && !atContact;

  const [formOpen, setFormOpen] = useState(false);
  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFormOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  const _gr = googleReviews;
  const gRating = ratingProp ?? _gr.rating;
  const gTotal = totalReviews ?? _gr.total;

  const testimonialCards =
    reviews.length > 0
      ? reviews.map((r) => ({ quote: r.text, name: r.author, initials: r.author.trim().charAt(0).toUpperCase(), tag: c.social.reviewTag }))
      : c.social.testimonials;

  const trust = [
    `${gRating} ★ ${c.trust.google} · ${gTotal} ${c.trust.reviews}`,
    c.trust.price, c.trust.advisor, c.trust.report, c.trust.noStrings, c.trust.zones, c.trust.ownersPrefix,
  ];

  const WRAP = "w-full max-w-[1400px] mx-auto px-6 lg:px-12";
  const inlineCTA = (
    <AnimateIn direction="up">
      <div className="mt-14 flex justify-center">
        <Link href="#contacto" className="rounded-full bg-[#1C1913] text-[#F2EEE6] text-base font-semibold px-8 py-4 hover:bg-black transition-colors duration-300">{c.hero.ctaPrimary}</Link>
      </div>
    </AnimateIn>
  );

  return (
    <div className="font-dm-sans bg-[#D9D3C7] text-[#1C1913] min-h-screen antialiased selection:bg-[#1C1913]/20">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#EEEAE1]/90 backdrop-blur-md border-b border-[#C7BFB0]" : "bg-gradient-to-b from-[#14120C]/90 to-transparent"}`}>
        <nav className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between gap-4">
          <Link href="/" aria-label="The Vila Home — inicio"><Wordmark dark={scrolled} /></Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1" role="group" aria-label={c.langLabel}>
              {LANGS.map(({ code, label }) => (
                <button key={code} onClick={() => setLang(code)} aria-pressed={lang === code}
                  className={`text-[12px] font-medium px-1.5 py-1 rounded transition-colors ${
                    lang === code ? (scrolled ? "text-[#1C1913]" : "text-[#F2EEE6]") : (scrolled ? "text-[#9A9384] hover:text-[#1C1913]" : "text-[#B8AE9C] hover:text-[#F2EEE6]")
                  }`}>{label}</button>
              ))}
            </div>
            <Link href="#contacto" className={`hidden sm:inline-flex rounded-full text-[13px] font-semibold px-5 py-2.5 transition-colors duration-300 ${scrolled ? "bg-[#1C1913] text-[#F2EEE6] hover:bg-black" : "bg-[#F2EEE6] text-[#14120C] hover:bg-white"}`}>{c.navCta}</Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#14120C]">
        <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" className="object-cover object-[68%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14120C] via-[#14120C]/75 to-[#14120C]/40" aria-hidden />

        <div className={`relative ${WRAP} pt-24 pb-16`}>
          <AnimateIn direction="up">
            <h1 className="font-dm-serif text-[3rem] sm:text-6xl lg:text-[5rem] leading-[1.0] tracking-[-0.01em] mt-4 max-w-[22ch] whitespace-pre-line text-[#F2EEE6]">
              {c.hero.titleA}<span className="block text-[#C9C2B6] mt-1">{c.hero.titleB}</span>
            </h1>
            <p className="font-light text-lg leading-relaxed text-[#CBC6BB] mt-6 max-w-2xl text-left">{c.hero.sub}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-9">
              <Link href="#contacto" className="rounded-full bg-[#F2EEE6] text-[#14120C] text-base font-semibold px-8 py-4 hover:bg-white transition-colors duration-300">{c.hero.ctaPrimary}</Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-12">
              <div className="flex items-baseline gap-2">
                <span className="font-dm-serif text-4xl text-[#F2EEE6]"><CountUp target={450} prefix="+" /></span>
                <span className="text-sm text-[#9A9384] max-w-[9rem] leading-tight">{c.hero.ownersLabel}</span>
              </div>
              <span className="hidden sm:block w-px h-10 bg-white/15" aria-hidden />
              <div className="flex items-baseline gap-2">
                <span className="font-dm-serif text-4xl text-[#F2EEE6]">{gRating}</span>
                <span className="text-sm text-[#9A9384] leading-tight flex items-center gap-1"><Stars className="scale-90" /> · <CountUp target={gTotal} /> {c.trust.reviews}</span>
              </div>
            </div>
          </AnimateIn>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#B8AE9C] animate-bounce" aria-hidden>
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </div>
      </section>

      {/* ── Marquee (transición) ───────────────────────────────────── */}
      <div className="bg-[#1C1913] text-[#F7EEE7] overflow-hidden py-3">
        <div className="flex items-center w-max hover:[animation-play-state:paused]" style={{ animation: "marquee-scroll 40s linear infinite" }}>
          {[...trust, ...trust].map((phrase, i) => (
            <span key={i} className="flex items-center text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap">
              {phrase}<span className="mx-6 text-[#F7EEE7]/50">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── El método ──────────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.method.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[4rem] leading-[0.98] mt-4 text-[#1C1913]">{c.method.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.method.sub}</p>
            </div>
          </AnimateIn>

          <div className="mt-14 border-t border-[#C7BFB0]">
            {c.method.steps.map((step, i) => (
              <AnimateIn key={step.title} direction="up" delay={i * 40}>
                <div className="group grid md:grid-cols-[6rem_1fr_1fr] gap-x-8 gap-y-3 py-8 lg:py-10 border-b border-[#C7BFB0] hover:bg-[#E6E1D6] transition-colors duration-300 -mx-6 lg:-mx-12 px-6 lg:px-12">
                  <span className="font-dm-serif text-5xl lg:text-6xl text-[#C7BFB0] group-hover:text-[#1C1913] transition-colors">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-dm-serif text-[1.7rem] leading-snug text-[#1C1913]">{step.title}</h3>
                    <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#837C6E] mt-4">{c.method.doLabel}</p>
                    <p className="text-[15px] leading-relaxed text-[#5E594F] mt-1.5 text-left">{step.do_}</p>
                  </div>
                  <div className="md:pt-1">
                    <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#1C1913]">{c.method.youLabel}</p>
                    <p className="text-[15px] leading-relaxed text-[#33302A] mt-1.5 text-left">{step.you}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
          {inlineCTA}
        </div>
      </section>

      {/* ── Cómo mostramos tu casa ─────────────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0] overflow-hidden">
        <div className={`${WRAP} pt-20 lg:pt-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.marketing.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[4rem] leading-[0.98] mt-4 text-[#1C1913]">{c.marketing.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.marketing.sub}</p>
            </div>
          </AnimateIn>
        </div>

        <div className="mt-12 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)" }}>
          <div className="flex gap-4 lg:gap-6 w-max hover:[animation-play-state:paused] px-4" style={{ animation: "marquee-scroll 45s linear infinite" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, i) => <PropertyCard key={i} />)}
          </div>
        </div>

        <div className={`${WRAP} pb-20 lg:pb-28 mt-16 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center`}>
          <AnimateIn direction="up">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {c.marketing.showcase.map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1C1913] text-[#F2EEE6] shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12.5l4 4 10-10" /></svg>
                  </span>
                  <div>
                    <p className="font-medium text-[15px] text-[#1C1913] leading-tight">{s.title}</p>
                    <p className="text-[13px] text-[#857E70] leading-snug mt-1 text-left">{s.text}</p>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 mt-3 pt-6 border-t border-[#C7BFB0]">
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#837C6E]">{c.marketing.channelsLabel}</p>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {c.marketing.channels.map((ch) => (
                    <span key={ch} className="rounded-full border border-[#C7BFB0] bg-[#F3F0E8] text-[13px] text-[#5E594F] px-4 py-1.5">{ch}</span>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={120}>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border border-black/10 bg-[#0E0E0C] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 px-4 h-9 bg-[#151412] border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a36]" /><span className="w-2.5 h-2.5 rounded-full bg-[#3a3a36]" /><span className="w-2.5 h-2.5 rounded-full bg-[#3a3a36]" />
                  <span className="ml-3 flex-1 max-w-[220px] h-4 rounded-full bg-[#26251F] text-[9px] text-[#6F6C64] flex items-center px-3">thevilahome.com</span>
                </div>
                <div className="relative">
                  <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-[#211E18] to-[#0E0D0A] flex items-center justify-center"><CozyHome className="w-28 h-28" /></div>
                </div>
                <div className="p-5 bg-[#0E0E0C]">
                  <p className="font-dm-serif text-[17px] text-[#F2EEE6] leading-snug">{c.marketing.mockCaption}</p>
                  <div className="flex flex-wrap gap-2 mt-4">{c.marketing.tags.map((tag) => <span key={tag} className="text-[11px] text-[#8B867B] border border-white/10 rounded-full px-2.5 py-1">{tag}</span>)}</div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-1 sm:-right-8 w-40 sm:w-48 rounded-[1.8rem] border-[5px] border-[#26251F] bg-[#0E0E0C] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
                <div className="relative h-64 sm:h-80 bg-gradient-to-b from-[#211E18] via-[#14120C] to-[#0B0A08]">
                  <span className="absolute top-2.5 left-3 text-[10px] font-semibold text-white/90">Reels</span>
                  <span className="absolute inset-0 flex items-center justify-center"><span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-lg"><svg viewBox="0 0 24 24" fill="#14120C" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg></span></span>
                  <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3.5 text-white">
                    <span className="flex flex-col items-center"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20Z" /></svg><span className="text-[10px] font-semibold mt-0.5">60&nbsp;mil</span></span>
                    <span className="flex flex-col items-center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 11.5a8.5 8.5 0 0 1-12 7.5L3 20l1-6a8.5 8.5 0 1 1 17-2.5Z" /></svg><span className="text-[10px] font-semibold mt-0.5">700</span></span>
                  </div>
                  <div className="absolute left-3 bottom-3 right-12">
                    <p className="text-[11px] font-semibold text-white leading-tight">@thevilahome</p>
                    <p className="flex items-center gap-1 text-[10px] text-white/80 mt-1"><svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M8 5v14l11-7z" /></svg>60.000 {c.marketing.reelViews}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Tour 3D ────────────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.tour.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[4rem] leading-[0.98] mt-4 text-[#1C1913]">{c.tour.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.tour.sub}</p>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={120}>
            <div className="mt-12 rounded-2xl overflow-hidden border border-[#C7BFB0] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.45)]">
              <TourEmbed cta={c.tour.cta} />
            </div>
            <p className="text-xs text-[#837C6E] mt-4">{c.tour.note}</p>
          </AnimateIn>
          {inlineCTA}
        </div>
      </section>

      {/* ── Qué incluye ────────────────────────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.includes.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.includes.title}</h2>
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {c.includes.items.map((d, i) => (
              <AnimateIn key={d.title} direction="up" delay={(i % 3) * 80}>
                <div className="bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-8 lg:p-9 h-full hover:border-[#1C1913]/40 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)] transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#E6E1D6] text-[#1C1913]">{INCLUDE_ICONS[i]}</div>
                  <h3 className="font-dm-serif text-[1.4rem] leading-snug mt-6 text-[#1C1913]">{d.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[#857E70] mt-3 text-left">{d.text}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipo ─────────────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.team.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.team.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.team.sub}</p>
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {TEAM_PHOTOS.map((photo, i) => (
              <AnimateIn key={photo} direction="up" delay={i * 90}>
                <figure className="group">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#E6E1D6] ring-1 ring-black/5">
                    <Image src={photo} alt={TEAM_NAMES[i]} width={480} height={600} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <figcaption className="mt-5"><p className="font-dm-serif text-[1.4rem] text-[#1C1913] leading-tight">{TEAM_NAMES[i]}</p></figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
          <AnimateIn direction="up" delay={120}>
            <p className="text-center text-[15px] text-[#857E70] mt-12">{c.team.moreText}{" "}
              <Link href="/quienes-somos" className="text-[#1C1913] underline underline-offset-4 decoration-[#1C1913]/40 hover:decoration-[#1C1913] transition-colors">{c.team.moreLink}</Link>
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Honestidad ─────────────────────────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <blockquote className="max-w-4xl">
              <Eyebrow>{c.honesty.eyebrow}</Eyebrow>
              <p className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.05] text-[#1C1913] mt-5">{c.honesty.quote}</p>
            </blockquote>
          </AnimateIn>
          <AnimateIn direction="up" delay={120}>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-6 mt-12 max-w-4xl">
              {c.honesty.points.map((item) => (
                <li key={item} className="flex items-start gap-4"><Check /><p className="text-[15px] leading-relaxed text-[#33302A] text-left">{item}</p></li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      {/* ── Reseñas reales ─────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <Eyebrow>{c.social.eyebrow}</Eyebrow>
                <h2 className="font-dm-serif text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.social.title}</h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-dm-serif text-6xl text-[#1C1913] leading-none">{gRating}</span>
                <div><Stars /><p className="text-xs text-[#857E70] mt-1"><CountUp target={gTotal} /> {c.social.reviewsLabel}</p></div>
              </div>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonialCards.map((t, i) => (
              <AnimateIn key={`${t.name}-${i}`} direction="up" delay={(i % 3) * 90}>
                <figure className="flex flex-col h-full bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
                  <Stars />
                  <blockquote className="font-dm-serif text-[1.3rem] leading-snug text-[#1C1913] mt-5 flex-1 text-left">“{t.quote}”</blockquote>
                  <hr className="border-t border-[#C7BFB0] my-6" />
                  <figcaption className="flex items-center gap-3">
                    <Avatar initials={t.initials} />
                    <div><p className="font-medium text-[#1C1913] leading-tight">{t.name}</p><p className="text-xs text-[#857E70] mt-0.5">{t.tag}</p></div>
                  </figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto / lead form ───────────────────────────────────── */}
      <section id="contacto" className="relative bg-[#E6E1D6] border-t border-[#C7BFB0] scroll-mt-20">
        <div className={`relative ${WRAP} py-20 lg:py-28`}>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-start">
            <div className="lg:pt-6">
              <Eyebrow>{c.contact.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-5xl lg:text-[3.8rem] leading-[1] text-[#1C1913] mt-5">{c.contact.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-6 text-left">{c.contact.sub}</p>
              <ul className="space-y-4 mt-9">
                {c.contact.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#33302A]">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1C1913] text-[#F2EEE6] shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12.5l4 4 10-10" /></svg></span>
                    <span className="text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-8 border-t border-[#C7BFB0]">
                <p className="text-sm text-[#857E70]">{c.contact.otherLabel}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                  <Link href="/valoracion" className="text-sm font-medium text-[#1C1913] underline underline-offset-4 decoration-[#1C1913]/40 hover:decoration-[#1C1913] transition-colors">{c.contact.valoracion}</Link>
                  <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1C1913] underline underline-offset-4 decoration-[#1C1913]/40 hover:decoration-[#1C1913] transition-colors">WhatsApp</a>
                  <a href={`tel:${siteConfig.phone}`} className="text-sm font-medium text-[#1C1913] underline underline-offset-4 decoration-[#1C1913]/40 hover:decoration-[#1C1913] transition-colors">{siteConfig.phoneDisplay}</a>
                </div>
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#E6E1D6] border-t border-[#C7BFB0]">
        <div className={`${WRAP} py-12`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" aria-label="The Vila Home — inicio"><Wordmark dark /></Link>
            <nav className="flex items-center gap-7 text-sm text-[#857E70]">
              <Link href="/aviso-legal" className="hover:text-[#1C1913] transition-colors">{c.footer.legal}</Link>
              <Link href="/privacidad" className="hover:text-[#1C1913] transition-colors">{c.footer.privacy}</Link>
              <Link href="/cookies" className="hover:text-[#1C1913] transition-colors">{c.footer.cookies}</Link>
            </nav>
          </div>
          <p className="text-xs text-[#9A9384] mt-8 text-center md:text-left">© {new Date().getFullYear()} The Vila Home</p>
        </div>
      </footer>

      {/* ── Botón flotante → abre el formulario ────────────────────── */}
      <button type="button" onClick={() => setFormOpen(true)}
        className={`fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 rounded-full bg-[#1C1913] text-[#F2EEE6] text-sm font-semibold px-6 py-3.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] hover:bg-black transition-all duration-300 ${showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 4h16v12H5.2L4 17.2V4Z" /></svg>
        {c.floatingCta}
      </button>

      {/* ── Modal del formulario ───────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#14120C]/75 backdrop-blur-sm" onClick={() => setFormOpen(false)} aria-hidden />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button type="button" onClick={() => setFormOpen(false)} aria-label="Cerrar"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#E6E1D6] text-[#1C1913] flex items-center justify-center hover:bg-[#D9D3C7] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## `src/components/vender/LeadForm.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { venderContent } from "@/lib/vender-content";
import { captureAttribution, getAttribution, getClickIds } from "@/lib/attribution";

type Status = "idle" | "sending" | "ok" | "error";

/** Genera un id único para deduplicar el evento entre Pixel y Conversions API. */
function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LeadForm() {
  const { lang } = useLanguage();
  const c = (venderContent[lang] ?? venderContent.es).form;

  const [situation, setSituation] = useState(c.situations[0].key);
  const [status, setStatus] = useState<Status>("idle");

  // Al montar la landing: persistir de qué campaña/anuncio viene el visitante.
  useEffect(() => {
    captureAttribution();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const eventId = newEventId();
    const attribution = getAttribution();
    const clickIds = getClickIds();

    // Dispara el evento Lead en el Pixel del navegador con el mismo eventId que
    // enviará el servidor por la Conversions API → Meta deduplica.
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      if (w.fbq) {
        w.fbq("track", "Lead", { content_name: "vender", content_category: situation }, { eventID: eventId });
      }
    } catch {}

    const payload = {
      situation,
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      zone: fd.get("zone"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
      lang,
      eventId,
      attribution,
      clickIds,
      sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      const res = await fetch("/api/vender-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border border-[#E6E7E1] rounded-2xl p-10 lg:p-12 text-center">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#E6E1D6] text-[#1C1913]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M5 12.5l4 4 10-10" />
          </svg>
        </div>
        <h3 className="font-dm-serif text-3xl text-[#1A1A18] mt-6">{c.okTitle}</h3>
        <p className="text-[#5A564E] leading-relaxed mt-3 max-w-md mx-auto text-center">{c.okText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E6E7E1] rounded-2xl p-7 sm:p-9 lg:p-10 shadow-[0_30px_70px_-40px_rgba(26,26,24,0.35)]">
      {/* Situación — tipo «lead form» */}
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#A8A294]">
          {c.situationLegend}
        </legend>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {c.situations.map((s) => {
            const active = situation === s.key;
            return (
              <button
                type="button"
                key={s.key}
                onClick={() => setSituation(s.key)}
                aria-pressed={active}
                className={`text-left rounded-xl border p-4 transition-colors duration-200 ${
                  active
                    ? "border-[#1A1A18] bg-[#FAFAF7]"
                    : "border-[#E4E2DB] hover:border-[#1C1913]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-full border ${
                      active ? "border-[#1C1913]" : "border-[#C7BFB0]"
                    }`}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-[#1A1A18]" />}
                  </span>
                  <span className="font-medium text-[15px] text-[#1A1A18]">{s.label}</span>
                </span>
                <span className="block text-[13px] text-[#8A8578] mt-1.5 ml-[26px] text-left">{s.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Campos */}
      <div className="grid sm:grid-cols-2 gap-4 mt-7">
        <Field name="name" label={c.name} placeholder={c.namePh} required autoComplete="name" />
        <Field name="phone" label={c.phone} placeholder={c.phonePh} required type="tel" autoComplete="tel" />
        <div className="sm:col-span-2">
          <Field name="email" label={c.email} placeholder={c.emailPh} required type="email" autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <Field name="zone" label={c.zone} placeholder={c.zonePh} required autoComplete="address-level2" />
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="text-[13px] font-medium text-[#3A382F]">
              {c.message} <span className="text-[#A8A294] font-normal">{c.optional}</span>
            </span>
            <textarea
              name="message"
              rows={3}
              placeholder={c.messagePh}
              className="mt-1.5 w-full rounded-xl border border-[#E6E7E1] bg-white px-4 py-3 text-[15px] text-[#1A1A18] placeholder:text-[#B4AF9F] focus:border-[#1A1A18] focus:outline-none transition-colors resize-none"
            />
          </label>
        </div>
      </div>

      {/* Honeypot (oculto para humanos) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      <div className="mt-7">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full sm:w-auto rounded-full bg-[#1C1913] text-white text-sm font-semibold px-8 py-4 hover:bg-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? c.sending : c.submit}
        </button>
        {status === "error" && (
          <p className="text-sm text-[#B4443A] mt-4" role="alert">
            {c.error}
            <a href="mailto:info@thevilahome.com" className="underline">info@thevilahome.com</a>.
          </p>
        )}
        <p className="text-xs text-[#A8A294] leading-relaxed mt-4">
          {c.consent}
          <a href="/privacidad" className="underline hover:text-[#1A1A18]">{c.consentLink}</a>
          {c.consentAfter}
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  optionalText,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  optionalText?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[#3A382F]">
        {label} {optionalText && <span className="text-[#A8A294] font-normal">{optionalText}</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-[#E6E7E1] bg-white px-4 py-3 text-[15px] text-[#1A1A18] placeholder:text-[#B4AF9F] focus:border-[#1A1A18] focus:outline-none transition-colors"
      />
    </label>
  );
}
```

---

## `src/lib/vender-content.ts`

```tsx
import type { Lang } from "@/lib/i18n";

/* ─────────────────────────────────────────────────────────────────────
   Copy de la landing /vender en los 4 idiomas (ES · CA · EN · FR).
   Se mantiene aquí (fuera de i18n.ts) porque es contenido estructurado
   propio de la landing (arrays, objetos), no claves sueltas de UI.
   Los iconos SVG viven en el componente y se enlazan por índice.
   ───────────────────────────────────────────────────────────────────── */

export interface VenderCopy {
  navCta: string;
  floatingCta: string;
  langLabel: string;

  trust: {
    google: string; // "en Google"
    reviews: string; // "reseñas"
    price: string;
    advisor: string;
    report: string;
    noStrings: string;
    zones: string; // lista de comarcas
    ownersPrefix: string; // "Más de 200 propietarios acompañados desde "
  };

  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string; // resaltado en cursiva/dorado
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    teamLabel: string;
    inGoogle: string; // "en Google"
    ownersLabel: string; // "propietarios acompañados"
    since: string; // "desde"
    reach: string; // "Del Garraf al Baix Empordà, allá donde nos llames"
  };

  antiCliche: {
    eyebrow: string;
    title: string;
    sub: string;
    oldTitle: string;
    ourTitle: string;
    oldWay: string[];
    ourWay: string[];
  };

  method: {
    eyebrow: string;
    title: string;
    sub: string;
    doLabel: string;
    youLabel: string;
    steps: { title: string; do_: string; you: string }[];
  };

  marketing: {
    eyebrow: string;
    title: string;
    sub: string;
    showcase: { title: string; text: string }[];
    channelsLabel: string;
    channels: string[];
    badge: string;
    mockCaption: string;
    tags: string[];
    reelViews: string; // "visualizaciones"
    reelComments: string; // "comentarios"
    reelCaption: string; // texto bajo el reel
  };

  tour: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    note: string;
  };

  includes: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
  };

  team: {
    eyebrow: string;
    title: string;
    sub: string;
    roles: string[]; // Ariadna, Sofía, Xavier
    rolesShort: string[]; // etiqueta corta bajo el retrato del hero
    moreText: string;
    moreLink: string;
  };

  honesty: {
    eyebrow: string;
    quote: string;
    points: string[];
  };

  social: {
    eyebrow: string;
    title: string;
    reviewsLabel: string; // "reseñas en Google"
    reviewTag: string; // etiqueta bajo el nombre en cada reseña real
    testimonials: { quote: string; name: string; initials: string; tag: string }[];
  };

  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    bullets: string[];
    otherLabel: string;
    valoracion: string;
  };

  form: {
    situationLegend: string;
    situations: { key: string; label: string; hint: string }[];
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    email: string;
    emailPh: string;
    zone: string;
    zonePh: string;
    message: string;
    messagePh: string;
    optional: string;
    submit: string;
    sending: string;
    consent: string; // texto antes del enlace
    consentLink: string; // "política de privacidad"
    consentAfter: string; // texto después del enlace
    error: string;
    okTitle: string;
    okText: string;
  };

  footer: {
    legal: string;
    privacy: string;
    cookies: string;
  };
}

const es: VenderCopy = {
  navCta: "Valoración gratuita",
  floatingCta: "¿Cuánto vale tu casa?",
  langLabel: "Idioma",
  trust: {
    google: "en Google",
    reviews: "reseñas",
    price: "Precio real de mercado, no estimaciones para captarte",
    advisor: "Un único asesor, de la valoración a la firma",
    report: "Reportaje profesional incluido",
    noStrings: "Sin exclusivas eternas ni letra pequeña",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… donde nos llames",
    ownersPrefix: "Más de 450 familias acompañadas",
  },
  hero: {
    eyebrow: "Vender con The Vila Home",
    titleA: "Vender tu casa bien\nno es suerte.",
    titleB: "Es saber hacerlo.",
    sub: "No trabajamos con promesas imposibles ni con valoraciones infladas para conseguir una firma. Preferimos explicar las cosas como son, ayudarte a tomar buenas decisiones y acompañarte hasta el día de la escritura.",
    ctaPrimary: "Solicitar valoración gratuita",
    ctaSecondary: "Hablar con un asesor",
    teamLabel: "Tu equipo en The Vila Home",
    inGoogle: "en Google",
    ownersLabel: "familias acompañadas",
    since: "desde",
    reach: "Del Garraf al Baix Empordà, allá donde nos llames",
  },
  antiCliche: {
    eyebrow: "Seamos claros",
    title: "Quizá no somos tu inmobiliaria.",
    sub: "Trabajamos de una manera muy concreta, y lo decimos claro desde el principio: no le encaja a todo el mundo. Pero si buscas esto, somos tu equipo.",
    oldTitle: "La venta de siempre",
    ourTitle: "Cómo lo hacemos nosotros",
    oldWay: [
      "Tu casa en cuarenta portales a la vez, con la primera foto que salga.",
      "El cartel de otras tres agencias colgando del mismo balcón.",
      "Un precio inflado para captarte y, semanas después, «toca bajar».",
      "Un teléfono distinto cada vez que llamas para preguntar.",
      "Visitas de cualquiera, sin filtrar, tú vaciando la casa cada tarde.",
      "Y tú persiguiendo una información que nadie te termina de dar.",
    ],
    ourWay: [
      "Una casa cada vez, trabajada como si fuera la única.",
      "Reportaje profesional y un anuncio escrito a mano, no copiado.",
      "Un precio real desde el primer día, con datos y comparables.",
      "El mismo asesor de principio a fin. Siempre sabes con quién hablas.",
      "Compradores cualificados antes de abrir tu puerta.",
      "Informes claros: en todo momento sabes en qué punto está tu venta.",
    ],
  },
  method: {
    eyebrow: "Cómo trabajamos",
    title: "Así trabajamos, paso a paso",
    sub: "No escondemos el proceso, lo enseñamos. Seis fases, un mismo asesor, y en cada una: lo que hacemos nosotros y lo que ganas tú.",
    doLabel: "Qué hacemos",
    youLabel: "Qué ganas tú",
    steps: [
      {
        title: "Valoración honesta",
        do_: "Estudiamos tu vivienda y los cierres reales de tu zona —no los precios de anuncio— y te damos un rango con datos y comparables encima de la mesa.",
        you: "Sales a mercado con un precio que se sostiene. Ni inflado para captarte, ni bajo para vender rápido a tu costa.",
      },
      {
        title: "Preparación y puesta a punto",
        do_: "Revisamos la documentación (nota simple, cédula, certificado energético) y preparamos la casa para que se enseñe en su mejor versión.",
        you: "Llegas a las visitas con todo en regla y una casa que enamora, no que ahuyenta.",
      },
      {
        title: "Reportaje profesional",
        do_: "Fotografía, plano y —cuando suma— vídeo y tour virtual. Tu casa se presenta como un producto, no como un clasificado más.",
        you: "Destacas entre cientos de anuncios grises. La primera impresión decide si hay visita.",
      },
      {
        title: "Difusión selectiva",
        do_: "Publicamos en los portales y redes que de verdad mueven a tu comprador, con un anuncio cuidado y una campaña pensada.",
        you: "Llega el comprador adecuado, no mil curiosos. Menos ruido y mejores visitas.",
      },
      {
        title: "Filtrado, visitas y negociación",
        do_: "Cualificamos a cada interesado antes de abrir tu puerta, gestionamos las visitas y negociamos cada oferta a tu favor.",
        you: "No pierdes tardes con quien no puede comprar. Y cierras en las mejores condiciones, no solo en las más rápidas.",
      },
      {
        title: "Arras, notaría y entrega",
        do_: "Preparamos las arras, coordinamos con notaría y banca y te acompañamos hasta la entrega de llaves.",
        you: "Llegas a la firma sin sorpresas ni papeles pendientes. De principio a fin, la misma persona.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Cómo mostramos tu casa al mundo",
    sub: "Vender no es publicar y esperar. Es presentar tu casa como un producto y ponerla delante de quien la está buscando de verdad. Esto es lo que hacemos con cada vivienda:",
    showcase: [
      { title: "Fotografía profesional", text: "Con luz, encuadre y edición de verdad. La imagen que decide si hay clic." },
      { title: "Vídeo y tour virtual 360º", text: "Tu casa se recorre desde el sofá. Menos visitas frías, más visitas útiles." },
      { title: "Plano acotado", text: "El comprador entiende la distribución de un vistazo y proyecta su vida dentro." },
      { title: "Home staging y puesta a punto", text: "Preparamos los espacios para que se enseñen en su mejor versión." },
      { title: "Anuncio escrito a mano", text: "Un texto que cuenta la casa, no cuatro datos copiados y pegados." },
      { title: "Fotografía aérea con dron", text: "Cuando el entorno suma —mar, montaña, parcela—, lo enseñamos desde el aire." },
    ],
    channelsLabel: "Y la difundimos donde está tu comprador",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Web propia", "Instagram", "TikTok", "Base de compradores", "Email a interesados"],
    badge: "En exclusiva",
    mockCaption: "Tu casa, contada con cariño",
    tags: ["Foto pro", "Plano", "Tour 360º"],
    reelViews: "visualizaciones",
    reelComments: "comentarios",
    reelCaption: "Y en redes, tu casa se mueve de verdad.",
  },
  tour: {
    eyebrow: "Tecnología",
    title: "Recorre la casa en 3D, como si estuvieras dentro",
    sub: "Cada propiedad con tour virtual navegable y plano en 3D: el comprador la visita entera desde el sofá, a cualquier hora, y llega a la visita ya convencido. Menos visitas frías, más ofertas reales.",
    cta: "Mueve el ratón para explorar",
    note: "Tour de ejemplo — pronto, los de vuestros inmuebles.",
  },
  includes: {
    eyebrow: "Qué incluye",
    title: "Todo lo que ponemos de nuestra parte",
    items: [
      { title: "Precio real, no un cebo", text: "El valor de mercado con datos y comparables. Nunca un precio inflado solo para llevarnos el encargo." },
      { title: "Un asesor, todo el proceso", text: "El mismo interlocutor desde la valoración hasta la firma. Ni call centers, ni explicar tu caso una y otra vez." },
      { title: "Reportaje que vende", text: "Fotografía profesional, plano y vídeo cuando suma. Tu casa presentada como merece, sin coste extra." },
      { title: "Difusión con criterio", text: "En los canales que mueven a tu comprador, con un anuncio cuidado. No spam en cuarenta portales." },
      { title: "Cuentas claras", text: "Informes de visitas e interés real, sin tecnicismos. Sabes qué pasa con tu casa en cada momento." },
      { title: "Papeleo resuelto", text: "Cédula, certificados, notas simples, arras y notaría. Nosotros perseguimos los papeles, tú no." },
    ],
  },
  team: {
    eyebrow: "Quiénes lo hacemos",
    title: "Personas, no un número de expediente",
    sub: "Cuando vendes con nosotros no hablas con un call center. Somos tres, nos conoces por tu nombre y respondemos por tu casa de principio a fin.",
    roles: ["Responsable de equipo · Asesora inmobiliaria", "Asesora inmobiliaria", "Fundador · Dirección & Marketing"],
    rolesShort: ["Responsable de equipo", "Asesora inmobiliaria", "Fundador"],
    moreText: "¿Quieres saber más de nosotros?",
    moreLink: "Conoce al equipo",
  },
  honesty: {
    eyebrow: "Nuestra forma de trabajar",
    quote: "Preferimos perder un encargo antes que prometerte algo que no podemos cumplir.",
    points: [
      "Te decimos el precio real, aunque no sea el que esperabas oír.",
      "Si no somos la mejor opción para tu caso, te lo decimos.",
      "Trabajamos preferentemente en exclusiva —para volcarnos en tu casa—, pero sin atarte a cláusulas eternas.",
      "Informes claros de principio a fin: siempre sabes en qué punto está tu venta.",
    ],
  },
  social: {
    eyebrow: "Lo que dicen los propietarios",
    title: "Vendidas con tranquilidad",
    reviewsLabel: "reseñas en Google",
    reviewTag: "Reseña en Google",
    testimonials: [
      { quote: "Nos dijeron desde el primer día el precio real. Vendimos sin bajar de nuestras expectativas.", name: "Marta R.", initials: "MR", tag: "Vendió su piso en Vilanova" },
      { quote: "Lo que más valoro es que siempre hablé con la misma persona. Nada de explicar tu caso una y otra vez.", name: "Jordi & Anna", initials: "JA", tag: "Vendieron su casa en Cunit" },
      { quote: "Transparencia total con la documentación y en la negociación. Me sentí acompañada hasta la firma.", name: "Carmen P.", initials: "CP", tag: "Vendió su ático en Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Hablemos",
    title: "Cuéntanos tu caso y te decimos cómo te ayudaríamos",
    sub: "Tanto si quieres vender ya como si solo le das vueltas, esto no te compromete a nada. Dejas tus datos, entendemos tu situación y te contamos —con honestidad— qué haríamos con tu casa.",
    bullets: [
      "Respuesta en menos de 24 h laborables.",
      "Un asesor real, no un formulario que se pierde.",
      "Sin compromiso, sin presiones y sin spam.",
    ],
    otherLabel: "¿Prefieres otra vía?",
    valoracion: "Valoración online al instante",
  },
  form: {
    situationLegend: "¿En qué punto estás?",
    situations: [
      { key: "ahora", label: "Quiero vender ahora", hint: "Estoy listo para salir al mercado" },
      { key: "meses", label: "En los próximos meses", hint: "Me lo estoy planteando a corto plazo" },
      { key: "explorando", label: "Solo estoy explorando", hint: "Aún no lo tengo decidido" },
      { key: "en_venta", label: "Ya está a la venta", hint: "Con otra agencia o por mi cuenta" },
    ],
    name: "Nombre",
    namePh: "¿Cómo te llamas?",
    phone: "Teléfono",
    phonePh: "¿Dónde podemos llamarte?",
    email: "Correo electrónico",
    emailPh: "Solo lo utilizaremos para contactar contigo. Nada de publi.",
    zone: "Zona",
    zonePh: "¿Dónde se encuentra la vivienda?",
    message: "Mensaje",
    messagePh: "Cuéntanos un poco sobre tu vivienda o en qué podemos ayudarte.",
    optional: "(opcional)",
    submit: "Quiero que me contactéis",
    sending: "Enviando…",
    consent: "Al enviar aceptas nuestra ",
    consentLink: "política de privacidad",
    consentAfter: ". No compartimos tus datos ni te llenamos el buzón de spam.",
    error: "No se ha podido enviar. Inténtalo de nuevo o escríbenos a ",
    okTitle: "Recibido. Gracias.",
    okText: "Te escribiremos o llamaremos en menos de 24 h laborables. Sin compromiso y sin presiones: solo para entender tu caso y decirte cómo te ayudaríamos.",
  },
  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
};

const ca: VenderCopy = {
  navCta: "Valoració gratuïta",
  floatingCta: "Quant val casa teva?",
  langLabel: "Idioma",
  trust: {
    google: "a Google",
    reviews: "ressenyes",
    price: "Preu real de mercat, no estimacions per captar-te",
    advisor: "Un únic assessor, de la valoració a la firma",
    report: "Reportatge professional inclòs",
    noStrings: "Sense exclusives eternes ni lletra petita",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… on ens cridis",
    ownersPrefix: "Més de 450 famílies acompanyades",
  },
  hero: {
    eyebrow: "Vendre amb The Vila Home",
    titleA: "Vendre bé casa teva\nno és sort.",
    titleB: "És saber-ho fer.",
    sub: "No treballem amb promeses impossibles ni amb valoracions inflades per aconseguir una signatura. Preferim explicar les coses com són, ajudar-te a prendre bones decisions i acompanyar-te fins al dia de l'escriptura.",
    ctaPrimary: "Demanar valoració gratuïta",
    ctaSecondary: "Parlar amb un assessor",
    teamLabel: "El teu equip a The Vila Home",
    inGoogle: "a Google",
    ownersLabel: "famílies acompanyades",
    since: "des del",
    reach: "Del Garraf al Baix Empordà, allà on ens cridis",
  },
  antiCliche: {
    eyebrow: "Parlem clar",
    title: "Potser no som la teva immobiliària.",
    sub: "Treballem d'una manera molt concreta, i ho diem clar des del principi: no li encaixa a tothom. Però si busques això, som el teu equip.",
    oldTitle: "La venda de sempre",
    ourTitle: "Com ho fem nosaltres",
    oldWay: [
      "Casa teva a quaranta portals alhora, amb la primera foto que surti.",
      "El cartell d'altres tres agències penjant del mateix balcó.",
      "Un preu inflat per captar-te i, setmanes després, «toca abaixar».",
      "Un telèfon diferent cada cop que truques per preguntar.",
      "Visites de qualsevol, sense filtrar, tu buidant la casa cada tarda.",
      "I tu perseguint una informació que ningú t'acaba de donar.",
    ],
    ourWay: [
      "Una casa cada cop, treballada com si fos l'única.",
      "Reportatge professional i un anunci escrit a mà, no copiat.",
      "Un preu real des del primer dia, amb dades i comparables.",
      "El mateix assessor de principi a fi. Sempre saps amb qui parles.",
      "Compradors qualificats abans d'obrir la teva porta.",
      "Informes clars: en tot moment saps en quin punt està la teva venda.",
    ],
  },
  method: {
    eyebrow: "Com treballem",
    title: "Així treballem, pas a pas",
    sub: "No amaguem el procés, l'ensenyem. Sis fases, un mateix assessor, i a cada una: el que fem nosaltres i el que hi guanyes tu.",
    doLabel: "Què fem",
    youLabel: "Què hi guanyes",
    steps: [
      {
        title: "Valoració honesta",
        do_: "Estudiem el teu habitatge i els tancaments reals de la teva zona —no els preus d'anunci— i et donem una forquilla amb dades i comparables sobre la taula.",
        you: "Surts al mercat amb un preu que se sosté. Ni inflat per captar-te, ni baix per vendre ràpid a costa teva.",
      },
      {
        title: "Preparació i posada a punt",
        do_: "Revisem la documentació (nota simple, cèdula, certificat energètic) i preparem la casa perquè es mostri en la seva millor versió.",
        you: "Arribes a les visites amb tot en regla i una casa que enamora, no que espanta.",
      },
      {
        title: "Reportatge professional",
        do_: "Fotografia, plànol i —quan suma— vídeo i tour virtual. Casa teva es presenta com un producte, no com un classificat més.",
        you: "Destaques entre centenars d'anuncis grisos. La primera impressió decideix si hi ha visita.",
      },
      {
        title: "Difusió selectiva",
        do_: "Publiquem als portals i xarxes que de debò mouen el teu comprador, amb un anunci cuidat i una campanya pensada.",
        you: "Arriba el comprador adequat, no mil curiosos. Menys soroll i millors visites.",
      },
      {
        title: "Filtratge, visites i negociació",
        do_: "Qualifiquem cada interessat abans d'obrir la teva porta, gestionem les visites i negociem cada oferta a favor teu.",
        you: "No perds tardes amb qui no pot comprar. I tanques en les millors condicions, no només en les més ràpides.",
      },
      {
        title: "Arres, notaria i lliurament",
        do_: "Preparem les arres, coordinem amb notaria i banca i t'acompanyem fins al lliurament de claus.",
        you: "Arribes a la firma sense sorpreses ni papers pendents. De principi a fi, la mateixa persona.",
      },
    ],
  },
  marketing: {
    eyebrow: "Màrqueting",
    title: "Com mostrem casa teva al món",
    sub: "Vendre no és publicar i esperar. És presentar casa teva com un producte i posar-la davant de qui la busca de debò. Això és el que fem amb cada habitatge:",
    showcase: [
      { title: "Fotografia professional", text: "Amb llum, enquadrament i edició de veritat. La imatge que decideix si hi ha clic." },
      { title: "Vídeo i tour virtual 360º", text: "Casa teva es recorre des del sofà. Menys visites fredes, més visites útils." },
      { title: "Plànol acotat", text: "El comprador entén la distribució d'un cop d'ull i projecta la seva vida a dins." },
      { title: "Home staging i posada a punt", text: "Preparem els espais perquè es mostrin en la seva millor versió." },
      { title: "Anunci escrit a mà", text: "Un text que explica la casa, no quatre dades copiades i enganxades." },
      { title: "Fotografia aèria amb dron", text: "Quan l'entorn suma —mar, muntanya, parcel·la—, ho ensenyem des de l'aire." },
    ],
    channelsLabel: "I la difonem on és el teu comprador",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Web pròpia", "Instagram", "TikTok", "Base de compradors", "Email a interessats"],
    badge: "En exclusiva",
    mockCaption: "Casa teva, explicada amb estima",
    tags: ["Foto pro", "Plànol", "Tour 360º"],
    reelViews: "visualitzacions",
    reelComments: "comentaris",
    reelCaption: "I a les xarxes, casa teva es mou de veritat.",
  },
  tour: {
    eyebrow: "Tecnologia",
    title: "Recorre la casa en 3D, com si hi fossis a dins",
    sub: "Cada propietat amb tour virtual navegable i plànol en 3D: el comprador la visita sencera des del sofà, a qualsevol hora, i arriba a la visita ja convençut. Menys visites fredes, més ofertes reals.",
    cta: "Mou el ratolí per explorar",
    note: "Tour d'exemple — aviat, els dels vostres immobles.",
  },
  includes: {
    eyebrow: "Què inclou",
    title: "Tot el que hi posem de la nostra part",
    items: [
      { title: "Preu real, no un esquer", text: "El valor de mercat amb dades i comparables. Mai un preu inflat només per endur-nos l'encàrrec." },
      { title: "Un assessor, tot el procés", text: "El mateix interlocutor des de la valoració fins a la firma. Ni call centers, ni explicar el teu cas un cop i un altre." },
      { title: "Reportatge que ven", text: "Fotografia professional, plànol i vídeo quan suma. Casa teva presentada com es mereix, sense cost extra." },
      { title: "Difusió amb criteri", text: "Als canals que mouen el teu comprador, amb un anunci cuidat. No spam a quaranta portals." },
      { title: "Comptes clars", text: "Informes de visites i interès real, sense tecnicismes. Saps què passa amb casa teva en cada moment." },
      { title: "Paperassa resolta", text: "Cèdula, certificats, notes simples, arres i notaria. Nosaltres perseguim els papers, tu no." },
    ],
  },
  team: {
    eyebrow: "Qui ho fem",
    title: "Persones, no un número d'expedient",
    sub: "Quan vens amb nosaltres no parles amb un call center. Som tres, ens coneixes pel teu nom i responem per casa teva de principi a fi.",
    roles: ["Responsable d'equip · Assessora immobiliària", "Assessora immobiliària", "Fundador · Direcció & Màrqueting"],
    rolesShort: ["Responsable d'equip", "Assessora immobiliària", "Fundador"],
    moreText: "Vols saber-ne més, de nosaltres?",
    moreLink: "Coneix l'equip",
  },
  honesty: {
    eyebrow: "La nostra manera de treballar",
    quote: "Preferim perdre un encàrrec abans que prometre't una cosa que no podem complir.",
    points: [
      "Et diem el preu real, encara que no sigui el que esperaves sentir.",
      "Si no som la millor opció per al teu cas, t'ho diem.",
      "Treballem preferentment en exclusiva —per bolcar-nos en casa teva—, però sense lligar-te a clàusules eternes.",
      "Informes clars de principi a fi: sempre saps en quin punt està la teva venda.",
    ],
  },
  social: {
    eyebrow: "El que diuen els propietaris",
    title: "Venudes amb tranquil·litat",
    reviewsLabel: "ressenyes a Google",
    reviewTag: "Ressenya a Google",
    testimonials: [
      { quote: "Ens van dir des del primer dia el preu real. Vam vendre sense abaixar de les nostres expectatives.", name: "Marta R.", initials: "MR", tag: "Va vendre el seu pis a Vilanova" },
      { quote: "El que més valoro és que sempre vaig parlar amb la mateixa persona. Res d'explicar el teu cas un cop i un altre.", name: "Jordi & Anna", initials: "JA", tag: "Van vendre la casa a Cunit" },
      { quote: "Transparència total amb la documentació i en la negociació. Em vaig sentir acompanyada fins a la firma.", name: "Carmen P.", initials: "CP", tag: "Va vendre el seu àtic a Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Parlem-ne",
    title: "Explica'ns el teu cas i et diem com t'ajudaríem",
    sub: "Tant si vols vendre ja com si només hi dónes voltes, això no et compromet a res. Deixes les teves dades, entenem la teva situació i t'expliquem —amb honestedat— què faríem amb casa teva.",
    bullets: [
      "Resposta en menys de 24 h laborables.",
      "Un assessor real, no un formulari que es perd.",
      "Sense compromís, sense pressions i sense spam.",
    ],
    otherLabel: "Prefereixes una altra via?",
    valoracion: "Valoració online a l'instant",
  },
  form: {
    situationLegend: "En quin punt estàs?",
    situations: [
      { key: "ahora", label: "Vull vendre ara", hint: "Estic a punt per sortir al mercat" },
      { key: "meses", label: "En els pròxims mesos", hint: "M'ho estic plantejant a curt termini" },
      { key: "explorando", label: "Només estic explorant", hint: "Encara no ho tinc decidit" },
      { key: "en_venta", label: "Ja està a la venda", hint: "Amb una altra agència o pel meu compte" },
    ],
    name: "Nom",
    namePh: "Com et dius?",
    phone: "Telèfon",
    phonePh: "On et podem trucar?",
    email: "Correu electrònic",
    emailPh: "Només l'utilitzarem per contactar amb tu. Res de publi.",
    zone: "Zona",
    zonePh: "On es troba l'habitatge?",
    message: "Missatge",
    messagePh: "Explica'ns una mica sobre el teu habitatge o en què et podem ajudar.",
    optional: "(opcional)",
    submit: "Vull que em contacteu",
    sending: "Enviant…",
    consent: "En enviar acceptes la nostra ",
    consentLink: "política de privacitat",
    consentAfter: ". No compartim les teves dades ni t'omplim la bústia de spam.",
    error: "No s'ha pogut enviar. Torna-ho a provar o escriu-nos a ",
    okTitle: "Rebut. Gràcies.",
    okText: "T'escriurem o trucarem en menys de 24 h laborables. Sense compromís i sense pressions: només per entendre el teu cas i dir-te com t'ajudaríem.",
  },
  footer: { legal: "Avís legal", privacy: "Privacitat", cookies: "Cookies" },
};

const en: VenderCopy = {
  navCta: "Free valuation",
  floatingCta: "What's your home worth?",
  langLabel: "Language",
  trust: {
    google: "on Google",
    reviews: "reviews",
    price: "Real market price, not estimates to win your listing",
    advisor: "One advisor, from valuation to signing",
    report: "Professional photo shoot included",
    noStrings: "No endless exclusives, no fine print",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… wherever you call us",
    ownersPrefix: "Over 450 families guided",
  },
  hero: {
    eyebrow: "Selling with The Vila Home",
    titleA: "Selling your home well\nisn't luck.",
    titleB: "It's knowing how.",
    sub: "We don't work with impossible promises or inflated valuations to win a signature. We prefer to explain things as they are, help you make good decisions, and stand by you until the day of the deed.",
    ctaPrimary: "Request a free valuation",
    ctaSecondary: "Talk to an advisor",
    teamLabel: "Your team at The Vila Home",
    inGoogle: "on Google",
    ownersLabel: "families guided",
    since: "since",
    reach: "From the Garraf to the Baix Empordà — wherever you call us",
  },
  antiCliche: {
    eyebrow: "Let's be clear",
    title: "Maybe we're not your agency.",
    sub: "We work in a very particular way, and we say it plainly from the start: it's not for everyone. But if this is what you're looking for, we're your team.",
    oldTitle: "The usual way to sell",
    ourTitle: "How we do it",
    oldWay: [
      "Your home on forty portals at once, with the first photo that comes out.",
      "Three other agencies' signs hanging off the same balcony.",
      "A price inflated to win your listing and, weeks later, “time to drop it”.",
      "A different phone number every time you call to ask.",
      "Viewings for anyone, unfiltered, you clearing the house every afternoon.",
      "And you chasing information no one quite gives you.",
    ],
    ourWay: [
      "One home at a time, handled as if it were the only one.",
      "A professional shoot and a listing written by hand, not copy-pasted.",
      "A real price from day one, with data and comparables.",
      "The same advisor from start to finish. You always know who you're talking to.",
      "Qualified buyers before we open your door.",
      "Clear reports: you always know where your sale stands.",
    ],
  },
  method: {
    eyebrow: "How we work",
    title: "How we work, step by step",
    sub: "We don't hide the process, we show it. Six phases, one advisor, and in each one: what we do and what you gain.",
    doLabel: "What we do",
    youLabel: "What you gain",
    steps: [
      {
        title: "Honest valuation",
        do_: "We study your home and the real closing prices in your area — not listing prices — and give you a range with data and comparables on the table.",
        you: "You go to market with a price that holds up. Not inflated to win you over, not low to sell fast at your expense.",
      },
      {
        title: "Preparation and staging",
        do_: "We review the paperwork (land registry note, occupancy licence, energy certificate) and get the home ready to show at its best.",
        you: "You reach the viewings with everything in order and a home that wins people over, not one that scares them off.",
      },
      {
        title: "Professional shoot",
        do_: "Photography, floor plan and — when it adds value — video and virtual tour. Your home is presented as a product, not just another classified ad.",
        you: "You stand out among hundreds of grey listings. The first impression decides whether there's a viewing.",
      },
      {
        title: "Selective marketing",
        do_: "We publish on the portals and social channels that actually move your buyer, with a polished listing and a thought-out campaign.",
        you: "The right buyer shows up, not a thousand curious clickers. Less noise and better viewings.",
      },
      {
        title: "Screening, viewings and negotiation",
        do_: "We qualify every enquiry before we open your door, manage the viewings and negotiate every offer in your favour.",
        you: "You don't waste afternoons on people who can't buy. And you close on the best terms, not just the fastest.",
      },
      {
        title: "Deposit, notary and handover",
        do_: "We prepare the deposit contract, coordinate with the notary and the bank and stay with you through to the handover of keys.",
        you: "You reach the signing with no surprises and no loose ends. From start to finish, the same person.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "How we show your home to the world",
    sub: "Selling isn't posting and waiting. It's presenting your home as a product and putting it in front of the people actually looking for it. Here's what we do with every home:",
    showcase: [
      { title: "Professional photography", text: "Real light, framing and editing. The image that decides whether there's a click." },
      { title: "Video and 360º virtual tour", text: "Your home is toured from the sofa. Fewer cold viewings, more useful ones." },
      { title: "Measured floor plan", text: "The buyer grasps the layout at a glance and pictures their life inside." },
      { title: "Home staging and prep", text: "We prepare the spaces so they show at their very best." },
      { title: "Listing written by hand", text: "Copy that tells the story of the home, not four facts copied and pasted." },
      { title: "Aerial drone photography", text: "When the surroundings add value — sea, mountains, plot — we show it from the air." },
    ],
    channelsLabel: "And we spread it where your buyer is",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Our website", "Instagram", "TikTok", "Buyer database", "Email to leads"],
    badge: "Exclusive",
    mockCaption: "Your home, told with care",
    tags: ["Pro photo", "Floor plan", "360º tour"],
    reelViews: "views",
    reelComments: "comments",
    reelCaption: "And on social, your home really moves.",
  },
  tour: {
    eyebrow: "Technology",
    title: "Walk through the home in 3D, as if you were inside",
    sub: "Every property with a navigable virtual tour and 3D floor plan: buyers explore it fully from the sofa, any time, and arrive at the viewing already convinced. Fewer cold viewings, more real offers.",
    cta: "Move your mouse to explore",
    note: "Sample tour — your properties' tours coming soon.",
  },
  includes: {
    eyebrow: "What's included",
    title: "Everything we bring to the table",
    items: [
      { title: "A real price, not bait", text: "Market value with data and comparables. Never a price inflated just to win the listing." },
      { title: "One advisor, the whole way", text: "The same person from valuation to signing. No call centres, no explaining your case again and again." },
      { title: "A shoot that sells", text: "Professional photography, floor plan and video when it adds value. Your home presented as it deserves, at no extra cost." },
      { title: "Marketing with judgement", text: "On the channels that move your buyer, with a polished listing. No spamming forty portals." },
      { title: "Clear accounts", text: "Reports on viewings and real interest, no jargon. You know what's happening with your home at every moment." },
      { title: "Paperwork handled", text: "Occupancy licence, certificates, registry notes, deposit and notary. We chase the paperwork, you don't." },
    ],
  },
  team: {
    eyebrow: "Who does it",
    title: "People, not a case number",
    sub: "When you sell with us you don't talk to a call centre. There are three of us, we know you by name and we answer for your home from start to finish.",
    roles: ["Team lead · Real estate advisor", "Real estate advisor", "Founder · Management & Marketing"],
    rolesShort: ["Team lead", "Real estate advisor", "Founder"],
    moreText: "Want to know more about us?",
    moreLink: "Meet the team",
  },
  honesty: {
    eyebrow: "The way we work",
    quote: "We'd rather lose a listing than promise you something we can't deliver.",
    points: [
      "We tell you the real price, even when it's not what you hoped to hear.",
      "If we're not the best option for your case, we'll say so.",
      "We work mainly on an exclusive basis — to give your home our all — but without tying you to endless clauses.",
      "Clear reports from start to finish: you always know where your sale stands.",
    ],
  },
  social: {
    eyebrow: "What owners say",
    title: "Sold with peace of mind",
    reviewsLabel: "reviews on Google",
    reviewTag: "Google review",
    testimonials: [
      { quote: "They told us the real price from day one. We sold without dropping below our expectations.", name: "Marta R.", initials: "MR", tag: "Sold her flat in Vilanova" },
      { quote: "What I value most is that I always spoke to the same person. No explaining your case over and over.", name: "Jordi & Anna", initials: "JA", tag: "Sold their house in Cunit" },
      { quote: "Total transparency with the paperwork and the negotiation. I felt supported all the way to signing.", name: "Carmen P.", initials: "CP", tag: "Sold her penthouse in Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Let's talk",
    title: "Tell us your case and we'll tell you how we'd help",
    sub: "Whether you want to sell now or you're just weighing it up, this commits you to nothing. You leave your details, we understand your situation and we tell you — honestly — what we'd do with your home.",
    bullets: [
      "A reply within 24 working hours.",
      "A real advisor, not a form that gets lost.",
      "No commitment, no pressure and no spam.",
    ],
    otherLabel: "Prefer another way?",
    valoracion: "Instant online valuation",
  },
  form: {
    situationLegend: "Where are you right now?",
    situations: [
      { key: "ahora", label: "I want to sell now", hint: "I'm ready to go to market" },
      { key: "meses", label: "In the coming months", hint: "I'm considering it short-term" },
      { key: "explorando", label: "Just exploring", hint: "I haven't decided yet" },
      { key: "en_venta", label: "It's already listed", hint: "With another agency or on my own" },
    ],
    name: "Name",
    namePh: "What's your name?",
    phone: "Phone",
    phonePh: "Where can we call you?",
    email: "Email",
    emailPh: "We'll only use it to get in touch. No spam.",
    zone: "Area",
    zonePh: "Where's the property located?",
    message: "Message",
    messagePh: "Tell us a bit about your home or how we can help.",
    optional: "(optional)",
    submit: "I'd like you to contact me",
    sending: "Sending…",
    consent: "By submitting you accept our ",
    consentLink: "privacy policy",
    consentAfter: ". We don't share your data or fill your inbox with spam.",
    error: "Couldn't send. Try again or email us at ",
    okTitle: "Received. Thank you.",
    okText: "We'll write or call you within 24 working hours. No commitment and no pressure: just to understand your case and tell you how we'd help.",
  },
  footer: { legal: "Legal notice", privacy: "Privacy", cookies: "Cookies" },
};

const fr: VenderCopy = {
  navCta: "Estimation gratuite",
  floatingCta: "Combien vaut votre maison ?",
  langLabel: "Langue",
  trust: {
    google: "sur Google",
    reviews: "avis",
    price: "Prix réel du marché, pas des estimations pour vous capter",
    advisor: "Un seul conseiller, de l'estimation à la signature",
    report: "Reportage photo professionnel inclus",
    noStrings: "Sans exclusivités éternelles ni petites lignes",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… partout où vous nous appelez",
    ownersPrefix: "Plus de 450 familles accompagnées",
  },
  hero: {
    eyebrow: "Vendre avec The Vila Home",
    titleA: "Bien vendre votre maison,\nce n'est pas de la chance.",
    titleB: "C'est le savoir-faire.",
    sub: "Nous ne travaillons pas avec des promesses impossibles ni des estimations gonflées pour décrocher une signature. Nous préférons expliquer les choses telles qu'elles sont, vous aider à prendre de bonnes décisions et vous accompagner jusqu'au jour de l'acte.",
    ctaPrimary: "Demander une estimation gratuite",
    ctaSecondary: "Parler à un conseiller",
    teamLabel: "Votre équipe chez The Vila Home",
    inGoogle: "sur Google",
    ownersLabel: "familles accompagnées",
    since: "depuis",
    reach: "Du Garraf au Baix Empordà — partout où vous nous appelez",
  },
  antiCliche: {
    eyebrow: "Soyons clairs",
    title: "Nous ne sommes peut-être pas votre agence.",
    sub: "Nous travaillons d'une manière bien précise, et nous le disons clairement dès le départ : ça ne convient pas à tout le monde. Mais si c'est ce que vous cherchez, nous sommes votre équipe.",
    oldTitle: "La vente comme d'habitude",
    ourTitle: "Comment nous le faisons",
    oldWay: [
      "Votre maison sur quarante portails à la fois, avec la première photo venue.",
      "Le panneau de trois autres agences accroché au même balcon.",
      "Un prix gonflé pour vous capter et, des semaines plus tard, « il faut baisser ».",
      "Un numéro différent chaque fois que vous appelez pour demander.",
      "Des visites de n'importe qui, sans filtre, vous vidant la maison chaque après-midi.",
      "Et vous, à courir après une information que personne ne vous donne vraiment.",
    ],
    ourWay: [
      "Une maison à la fois, traitée comme si c'était la seule.",
      "Un reportage professionnel et une annonce écrite à la main, pas copiée.",
      "Un prix réel dès le premier jour, avec données et comparables.",
      "Le même conseiller du début à la fin. Vous savez toujours à qui vous parlez.",
      "Des acheteurs qualifiés avant d'ouvrir votre porte.",
      "Des rapports clairs : vous savez à tout moment où en est votre vente.",
    ],
  },
  method: {
    eyebrow: "Comment nous travaillons",
    title: "Notre façon de faire, étape par étape",
    sub: "Nous ne cachons pas le processus, nous le montrons. Six phases, un seul conseiller, et à chacune : ce que nous faisons et ce que vous y gagnez.",
    doLabel: "Ce que nous faisons",
    youLabel: "Ce que vous y gagnez",
    steps: [
      {
        title: "Estimation honnête",
        do_: "Nous étudions votre bien et les ventes réelles de votre secteur — pas les prix d'annonce — et vous donnons une fourchette avec données et comparables sur la table.",
        you: "Vous arrivez sur le marché avec un prix qui tient. Ni gonflé pour vous capter, ni bas pour vendre vite à vos dépens.",
      },
      {
        title: "Préparation et mise en valeur",
        do_: "Nous vérifions les documents (note simple, certificat d'habitabilité, DPE) et préparons la maison pour qu'elle se montre sous son meilleur jour.",
        you: "Vous abordez les visites avec tout en règle et une maison qui séduit, au lieu de faire fuir.",
      },
      {
        title: "Reportage professionnel",
        do_: "Photographie, plan et — quand cela ajoute de la valeur — vidéo et visite virtuelle. Votre maison est présentée comme un produit, pas comme une petite annonce de plus.",
        you: "Vous vous démarquez parmi des centaines d'annonces grises. La première impression décide s'il y a visite.",
      },
      {
        title: "Diffusion sélective",
        do_: "Nous publions sur les portails et réseaux qui font vraiment bouger votre acheteur, avec une annonce soignée et une campagne réfléchie.",
        you: "Le bon acheteur se présente, pas mille curieux. Moins de bruit et de meilleures visites.",
      },
      {
        title: "Filtrage, visites et négociation",
        do_: "Nous qualifions chaque intéressé avant d'ouvrir votre porte, gérons les visites et négocions chaque offre en votre faveur.",
        you: "Vous ne perdez pas d'après-midis avec ceux qui ne peuvent pas acheter. Et vous concluez aux meilleures conditions, pas seulement les plus rapides.",
      },
      {
        title: "Compromis, notaire et remise",
        do_: "Nous préparons le compromis, coordonnons avec le notaire et la banque et vous accompagnons jusqu'à la remise des clés.",
        you: "Vous arrivez à la signature sans surprises ni papiers en suspens. Du début à la fin, la même personne.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Comment nous montrons votre maison au monde",
    sub: "Vendre, ce n'est pas publier et attendre. C'est présenter votre maison comme un produit et la mettre devant ceux qui la cherchent vraiment. Voici ce que nous faisons pour chaque bien :",
    showcase: [
      { title: "Photographie professionnelle", text: "Vraie lumière, cadrage et retouche. L'image qui décide s'il y a un clic." },
      { title: "Vidéo et visite virtuelle 360º", text: "Votre maison se visite depuis le canapé. Moins de visites froides, plus de visites utiles." },
      { title: "Plan coté", text: "L'acheteur comprend la distribution d'un coup d'œil et s'y projette." },
      { title: "Home staging et mise au point", text: "Nous préparons les espaces pour qu'ils se montrent sous leur meilleur jour." },
      { title: "Annonce écrite à la main", text: "Un texte qui raconte la maison, pas quatre données copiées-collées." },
      { title: "Photographie aérienne par drone", text: "Quand l'environnement ajoute de la valeur — mer, montagne, terrain —, nous le montrons du ciel." },
    ],
    channelsLabel: "Et nous la diffusons là où est votre acheteur",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Site web", "Instagram", "TikTok", "Base d'acheteurs", "Email aux intéressés"],
    badge: "En exclusivité",
    mockCaption: "Votre maison, racontée avec soin",
    tags: ["Photo pro", "Plan", "Visite 360º"],
    reelViews: "vues",
    reelComments: "commentaires",
    reelCaption: "Et sur les réseaux, votre maison bouge vraiment.",
  },
  tour: {
    eyebrow: "Technologie",
    title: "Parcourez la maison en 3D, comme si vous y étiez",
    sub: "Chaque bien avec une visite virtuelle navigable et un plan en 3D : l'acheteur la parcourt entièrement depuis le canapé, à toute heure, et arrive à la visite déjà convaincu. Moins de visites froides, plus d'offres réelles.",
    cta: "Bougez la souris pour explorer",
    note: "Visite d'exemple — bientôt, celles de vos biens.",
  },
  includes: {
    eyebrow: "Ce qui est inclus",
    title: "Tout ce que nous mettons de notre côté",
    items: [
      { title: "Un prix réel, pas un appât", text: "La valeur de marché avec données et comparables. Jamais un prix gonflé juste pour décrocher le mandat." },
      { title: "Un conseiller, tout le parcours", text: "La même personne de l'estimation à la signature. Ni call centers, ni répéter votre cas encore et encore." },
      { title: "Un reportage qui vend", text: "Photographie professionnelle, plan et vidéo quand cela ajoute de la valeur. Votre maison présentée comme elle le mérite, sans coût supplémentaire." },
      { title: "Une diffusion réfléchie", text: "Sur les canaux qui font bouger votre acheteur, avec une annonce soignée. Pas de spam sur quarante portails." },
      { title: "Des comptes clairs", text: "Rapports de visites et d'intérêt réel, sans jargon. Vous savez ce qui se passe avec votre maison à chaque instant." },
      { title: "Paperasse réglée", text: "Certificat d'habitabilité, diagnostics, notes simples, compromis et notaire. C'est nous qui courons après les papiers, pas vous." },
    ],
  },
  team: {
    eyebrow: "Qui le fait",
    title: "Des personnes, pas un numéro de dossier",
    sub: "Quand vous vendez avec nous, vous ne parlez pas à un call center. Nous sommes trois, nous vous connaissons par votre nom et nous répondons de votre maison du début à la fin.",
    roles: ["Responsable d'équipe · Conseillère immobilière", "Conseillère immobilière", "Fondateur · Direction & Marketing"],
    rolesShort: ["Responsable d'équipe", "Conseillère immobilière", "Fondateur"],
    moreText: "Envie d'en savoir plus sur nous ?",
    moreLink: "Rencontrer l'équipe",
  },
  honesty: {
    eyebrow: "Notre façon de travailler",
    quote: "Nous préférons perdre un mandat plutôt que de vous promettre ce que nous ne pouvons pas tenir.",
    points: [
      "Nous vous disons le prix réel, même quand ce n'est pas ce que vous espériez entendre.",
      "Si nous ne sommes pas la meilleure option pour votre cas, nous vous le disons.",
      "Nous travaillons surtout en exclusivité — pour nous investir pleinement dans votre maison —, mais sans vous lier à des clauses éternelles.",
      "Des rapports clairs du début à la fin : vous savez toujours où en est votre vente.",
    ],
  },
  social: {
    eyebrow: "Ce que disent les propriétaires",
    title: "Vendues en toute tranquillité",
    reviewsLabel: "avis sur Google",
    reviewTag: "Avis Google",
    testimonials: [
      { quote: "Ils nous ont dit le prix réel dès le premier jour. Nous avons vendu sans descendre sous nos attentes.", name: "Marta R.", initials: "MR", tag: "A vendu son appartement à Vilanova" },
      { quote: "Ce que j'apprécie le plus, c'est d'avoir toujours parlé à la même personne. Pas besoin de répéter mon cas encore et encore.", name: "Jordi & Anna", initials: "JA", tag: "Ont vendu leur maison à Cunit" },
      { quote: "Transparence totale sur les documents et la négociation. Je me suis sentie accompagnée jusqu'à la signature.", name: "Carmen P.", initials: "CP", tag: "A vendu son attique à Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Parlons-en",
    title: "Racontez-nous votre cas et nous vous dirons comment nous aiderions",
    sub: "Que vous vouliez vendre maintenant ou que vous y réfléchissiez encore, cela ne vous engage à rien. Vous laissez vos coordonnées, nous comprenons votre situation et nous vous disons — en toute honnêteté — ce que nous ferions de votre maison.",
    bullets: [
      "Une réponse en moins de 24 h ouvrées.",
      "Un vrai conseiller, pas un formulaire qui se perd.",
      "Sans engagement, sans pression et sans spam.",
    ],
    otherLabel: "Vous préférez une autre voie ?",
    valoracion: "Estimation en ligne instantanée",
  },
  form: {
    situationLegend: "Où en êtes-vous ?",
    situations: [
      { key: "ahora", label: "Je veux vendre maintenant", hint: "Je suis prêt à aller sur le marché" },
      { key: "meses", label: "Dans les prochains mois", hint: "J'y pense à court terme" },
      { key: "explorando", label: "Je me renseigne seulement", hint: "Je n'ai pas encore décidé" },
      { key: "en_venta", label: "C'est déjà en vente", hint: "Avec une autre agence ou par moi-même" },
    ],
    name: "Nom",
    namePh: "Comment vous appelez-vous ?",
    phone: "Téléphone",
    phonePh: "Où pouvons-nous vous appeler ?",
    email: "E-mail",
    emailPh: "Uniquement pour vous contacter. Aucune pub.",
    zone: "Secteur",
    zonePh: "Où se trouve le bien ?",
    message: "Message",
    messagePh: "Parlez-nous un peu de votre bien ou de ce dont vous avez besoin.",
    optional: "(facultatif)",
    submit: "Je souhaite être contacté",
    sending: "Envoi…",
    consent: "En envoyant, vous acceptez notre ",
    consentLink: "politique de confidentialité",
    consentAfter: ". Nous ne partageons pas vos données et n'inondons pas votre boîte de spam.",
    error: "Envoi impossible. Réessayez ou écrivez-nous à ",
    okTitle: "Bien reçu. Merci.",
    okText: "Nous vous écrirons ou appellerons en moins de 24 h ouvrées. Sans engagement et sans pression : juste pour comprendre votre cas et vous dire comment nous aiderions.",
  },
  footer: { legal: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies" },
};

export const venderContent: Record<Lang, VenderCopy> = { es, ca, en, fr };
```

---

## `src/app/api/vender-lead/route.ts`

```tsx
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import type { Lang } from '@/lib/i18n'
import { saveLead, type StoredLead } from '@/lib/leads-store'
import { buildAutoReplyEmail, buildTeamEmail } from '@/lib/lead-emails'
import { sendMetaLeadEvent } from '@/lib/meta-capi'

const MAX = 2000 // límite defensivo por campo
const TEAM_INBOX = 'info@thevilahome.com'
const FROM = 'The Vila Home <noreply@thevilahome.com>'
const VALID_LANGS: Lang[] = ['es', 'ca', 'en', 'fr']

/** Extrae y sanea un valor de texto de la atribución (viene del cliente). */
function attrStr(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const s = v.trim().slice(0, 300)
  return s || undefined
}

export async function POST(request: Request) {
  // Rate limit: envía email → objetivo de abuso. 5 envíos / hora por IP.
  const ip = clientIp(request)
  const limit = rateLimit(`vender-lead:${ip}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    const name = String(body.name ?? '').trim().slice(0, MAX)
    const phone = String(body.phone ?? '').trim().slice(0, MAX)
    const email = String(body.email ?? '').trim().slice(0, MAX)
    const zone = String(body.zone ?? '').trim().slice(0, MAX)
    const message = String(body.message ?? '').trim().slice(0, MAX)
    const situationKey = String(body.situation ?? '').trim().slice(0, 40)
    const lang: Lang = VALID_LANGS.includes(body.lang) ? body.lang : 'es'
    // Honeypot anti-bots: si viene relleno, fingimos éxito y descartamos.
    const honeypot = String(body.company ?? '').trim()

    if (honeypot) return NextResponse.json({ ok: true })

    if (!name || !phone || !email || !zone) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    // ── Atribución (best-effort; el cliente la aporta desde la cookie) ──────────
    const attribution = (body.attribution ?? {}) as Record<string, unknown>
    const clickIds = (body.clickIds ?? {}) as Record<string, unknown>
    const eventId =
      attrStr(body.eventId) ?? `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const sourceUrl = attrStr(body.sourceUrl)
    const userAgent = request.headers.get('user-agent') ?? undefined

    const lead: StoredLead = {
      id: eventId,
      ts: new Date().toISOString(),
      lang,
      situation: situationKey || 'no_especificada',
      name,
      phone,
      email,
      zone,
      message: message || undefined,
      utm_source: attrStr(attribution.utm_source),
      utm_medium: attrStr(attribution.utm_medium),
      utm_campaign: attrStr(attribution.utm_campaign),
      utm_content: attrStr(attribution.utm_content),
      utm_term: attrStr(attribution.utm_term),
      fbclid: attrStr(attribution.fbclid),
      gclid: attrStr(attribution.gclid),
      landing: attrStr(attribution.landing),
      referrer: attrStr(attribution.referrer),
      ip,
      userAgent,
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const team = buildTeamEmail(lead)
    const auto = buildAutoReplyEmail(name, lang)
    const [firstName, ...rest] = name.split(/\s+/)

    // Todo en paralelo y best-effort: si algo falla, no bloqueamos al usuario.
    // El aviso al equipo es el crítico; si ese falla, devolvemos error.
    const [teamResult] = await Promise.allSettled([
      // 1) Aviso al equipo (crítico)
      resend.emails.send({
        from: FROM,
        to: TEAM_INBOX,
        replyTo: email,
        subject: team.subject,
        html: team.html,
      }),
      // 2) Autorespuesta al vendedor
      resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TEAM_INBOX,
        subject: auto.subject,
        html: auto.html,
      }),
      // 3) Persistir el lead con su atribución
      saveLead(lead),
      // 4) Conversions API server-side (dedup con el Pixel por eventId)
      sendMetaLeadEvent({
        eventId,
        eventSourceUrl: sourceUrl,
        email,
        phone,
        firstName,
        lastName: rest.join(' ') || undefined,
        clientIp: ip !== 'unknown' ? ip : undefined,
        userAgent,
        fbp: attrStr(clickIds.fbp),
        fbc: attrStr(clickIds.fbc),
        fbclid: attrStr(attribution.fbclid),
        custom: {
          content_name: 'vender',
          content_category: lead.situation,
          lead_lang: lang,
          utm_campaign: lead.utm_campaign,
          utm_source: lead.utm_source,
        },
      }),
    ])

    if (teamResult.status === 'rejected') {
      console.error('[vender-lead] team email failed', teamResult.reason)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[vender-lead]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
```

