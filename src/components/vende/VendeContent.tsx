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
import { vendeContent } from "@/lib/vende-content";
import type { GoogleReview } from "@/lib/googlePlaces";

/* ─────────────────────────────────────────────────────────────────────
   Landing de Google Ads /vende-tu-casa. Misma paleta que /vender
   (hero #14120C · piedra #D9D3C7/#E6E1D6 · tinta #1C1913), pero SIN
   fugas: nada de menú ni enlaces a otras páginas. Un objetivo único:
   el formulario, que vive en el propio hero.
   ───────────────────────────────────────────────────────────────────── */

const { googleReviews } = siteConfig;

const TEAM_PHOTOS = ["/images/agents/ariadna.jpg", "/images/agents/sofia.jpg", "/images/agents/xavier.jpg"];
const TEAM_NAMES = ["Ariadna Garcia", "Sofía Pascual", "Xavier Capdevila"];

/* Logos reales de los canales (public/images/portales). Se pintan en tinta
   (filter brightness(0) + opacidad) para no romper la paleta monocroma.
   La altura se ajusta a mano para igualar el peso visual de cada marca. */
const CHANNEL_LOGOS = [
  { src: "/images/portales/idealista.svg", alt: "Idealista", h: 24 },
  { src: "/images/portales/fotocasa.svg", alt: "Fotocasa", h: 20 },
  { src: "/images/portales/habitaclia.svg", alt: "habitaclia", h: 22 },
  { src: "/images/portales/pisos.svg", alt: "pisos.com", h: 20 },
  // LuxuryEstate es una placa negra con letras caladas en blanco: sin filtro,
  // ya es monocromo (el brightness(0) se comería el calado).
  { src: "/images/portales/jamesedition.svg", alt: "JamesEdition", h: 17 },
  { src: "/images/portales/luxuryestate.svg", alt: "LuxuryEstate", h: 20, raw: true },
  { src: "/images/portales/properstar.svg", alt: "Properstar", h: 20 },
  { src: "/images/portales/instagram.svg", alt: "Instagram", h: 21 },
  { src: "/images/portales/tiktok.svg", alt: "TikTok", h: 21 },
  { src: "/images/portales/facebook.svg", alt: "Facebook", h: 21 },
];

const INCLUDE_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M7.5 3.75h6.69a2 2 0 0 1 1.42.59l4.55 4.55a2 2 0 0 1 0 2.82l-6.69 6.69a2 2 0 0 1-2.82 0l-4.55-4.55a2 2 0 0 1-.59-1.42V5.75a2 2 0 0 1 2-2Z" /><circle cx="9.5" cy="7.5" r="1.1" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8a1 1 0 0 1 .83-.45h6.94a1 1 0 0 1 .83.45L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" /><circle cx="12" cy="12.5" r="3.2" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 10.5v3l4 .8L18 18V6L7 9.7l-4 .8Z" /><path d="M7 14.6V17a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 11 17v-1.6" /><path d="M18 9.5a2.5 2.5 0 0 1 0 5" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 5h16l-6.3 7.4v5.1L10.3 20v-7.6L4 5Z" /></svg>,
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

/* La «G» oficial de Google: sello de que la reseña es real, no inventada. */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.14-4.06 1.14-3.13 0-5.78-2.11-6.72-4.95H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC04" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.99-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.99 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

const Check = ({ onDark = false }: { onDark?: boolean }) => (
  <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5 ${onDark ? "bg-[#F2EEE6] text-[#14120C]" : "bg-[#1C1913] text-[#F2EEE6]"}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12.5l4 4 10-10" /></svg>
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

/* ── Componente ────────────────────────────────────────────────────── */

interface Props {
  reviews?: GoogleReview[];
  rating?: number;
  totalReviews?: number;
}

export default function VendeContent({ reviews = [], rating: ratingProp, totalReviews }: Props) {
  const { lang, setLang } = useLanguage();
  const c = vendeContent[lang] ?? vendeContent.es;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El botón flotante desaparece mientras el formulario del hero está a la vista.
  const [atForm, setAtForm] = useState(false);
  useEffect(() => {
    const el = document.getElementById("formulario");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const showCTA = scrolled && !atForm;

  const _gr = googleReviews;
  const gRating = ratingProp ?? _gr.rating;
  const gTotal = totalReviews ?? _gr.total;

  // Reseña abierta en el modal de lectura (null = cerrado).
  const [openReview, setOpenReview] = useState<{ quote: string; name: string; initials: string; tag: string } | null>(null);
  useEffect(() => {
    if (!openReview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenReview(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openReview]);

  // Los nombres llegan de Google tal cual («kevin corfe») → iniciales en mayúscula.
  const titleCase = (s: string) => s.replace(/\p{L}+/gu, (w) => w.charAt(0).toUpperCase() + w.slice(1));
  const testimonialCards = reviews
    .slice(0, 3)
    .map((r) => ({ quote: r.text, name: titleCase(r.author.trim()), initials: r.author.trim().charAt(0).toUpperCase(), tag: c.social.reviewTag }));

  const WRAP = "w-full max-w-[1400px] mx-auto px-6 lg:px-12";

  return (
    <div className="font-dm-sans bg-[#D9D3C7] text-[#1C1913] min-h-screen antialiased selection:bg-[#1C1913]/20">
      {/* ── Cabecera mínima (sin fugas: logo no navegable, teléfono y CTA) ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#EEEAE1]/90 backdrop-blur-md border-b border-[#C7BFB0]" : "bg-gradient-to-b from-[#14120C]/90 to-transparent"}`}>
        <nav className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between gap-4">
          <Wordmark dark={scrolled} />
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-1" role="group" aria-label={c.langLabel}>
              {LANGS.map(({ code, label }) => (
                <button key={code} onClick={() => setLang(code)} aria-pressed={lang === code}
                  className={`text-[12px] font-medium px-1.5 py-1 rounded transition-colors ${
                    lang === code ? (scrolled ? "text-[#1C1913]" : "text-[#F2EEE6]") : (scrolled ? "text-[#9A9384] hover:text-[#1C1913]" : "text-[#B8AE9C] hover:text-[#F2EEE6]")
                  }`}>{label}</button>
              ))}
            </div>
            <a href={`tel:${siteConfig.phone}`} className={`inline-flex items-center gap-2 text-[13px] font-semibold transition-colors ${scrolled ? "text-[#1C1913]" : "text-[#F2EEE6]"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 4h4l1.5 4.5-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2L20 15v4a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" /></svg>
              <span className="hidden md:inline">{siteConfig.phoneDisplay}</span>
            </a>
            <a href="#formulario" className={`hidden sm:inline-flex rounded-full text-[13px] font-semibold px-5 py-2.5 transition-colors duration-300 ${scrolled ? "bg-[#1C1913] text-[#F2EEE6] hover:bg-black" : "bg-[#F2EEE6] text-[#14120C] hover:bg-white"}`}>{c.headerCta}</a>
          </div>
        </nav>
      </header>

      {/* ── HERO con formulario ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14120C]">
        {/* En lg el formulario ocupa la derecha: el encuadre va a tope a la
            derecha de la foto para que las tres caras queden a la izquierda. */}
        <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" className="object-cover object-[68%_50%] lg:object-right" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14120C] via-[#14120C]/80 to-[#14120C]/55" aria-hidden />

        <div className={`relative ${WRAP} pt-28 lg:pt-36 pb-16 lg:pb-24`}>
          <div className="grid lg:grid-cols-[1fr_minmax(0,30rem)] gap-12 lg:gap-16 items-start">
            {/* Columna de mensaje */}
            <AnimateIn direction="up">
              <Eyebrow onDark>{c.hero.eyebrow}</Eyebrow>
              <h1 className="font-dm-serif text-[2.7rem] sm:text-5xl lg:text-[4.2rem] leading-[1.02] tracking-[-0.01em] mt-4 max-w-[20ch] whitespace-pre-line text-[#F2EEE6]">
                {c.hero.titleA}<span className="block text-[#C9C2B6] mt-1">{c.hero.titleB}</span>
              </h1>
              <p className="font-light text-lg leading-relaxed text-[#CBC6BB] mt-6 max-w-xl text-left">{c.hero.sub}</p>

              <ul className="space-y-3.5 mt-8 max-w-xl">
                {c.hero.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check onDark />
                    <span className="text-[15px] leading-relaxed text-[#E4DFD3] text-left">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-10">
                <div className="flex items-baseline gap-2">
                  <span className="font-dm-serif text-4xl text-[#F2EEE6]"><CountUp target={450} prefix="+" /></span>
                  <span className="text-sm text-[#9A9384] max-w-[9rem] leading-tight">{c.hero.ownersLabel}</span>
                </div>
                <span className="hidden sm:block w-px h-10 bg-white/15" aria-hidden />
                <div className="flex items-baseline gap-2">
                  <span className="font-dm-serif text-4xl text-[#F2EEE6]">{gRating}</span>
                  <span className="text-sm text-[#9A9384] leading-tight flex items-center gap-1"><Stars className="scale-90" /> · <CountUp target={gTotal} /> {c.hero.reviewsLabel} {c.hero.inGoogle}</span>
                </div>
              </div>

              {/* Pista de que la página sigue: el hero con formulario parece página completa */}
              <a href="#como" className="group inline-flex items-center gap-3 mt-12 text-[13px] font-medium text-[#B8AE9C] hover:text-[#F2EEE6] transition-colors">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#B8AE9C]/40 group-hover:border-[#F2EEE6]/60 transition-colors animate-bounce">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
                </span>
                {c.hero.scrollHint}
              </a>
            </AnimateIn>

            {/* Columna del formulario */}
            <AnimateIn direction="up" delay={120}>
              <div id="formulario" className="scroll-mt-24">
                <div className="mb-4">
                  <h2 className="font-dm-serif text-2xl text-[#F2EEE6]">{c.hero.formTitle}</h2>
                  <p className="text-sm text-[#B8AE9C] mt-1.5 text-left">{c.hero.formSub}</p>
                </div>
                <LeadForm source="vende-tu-casa" />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Banda de confianza ─────────────────────────────────────── */}
      <div className="bg-[#1C1913] text-[#F7EEE7]">
        <div className={`${WRAP} py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2`}>
          {c.strip.map((phrase, i) => (
            <span key={phrase} className="flex items-center text-[12px] font-semibold uppercase tracking-wide whitespace-nowrap">
              {i > 0 && <span className="mr-3 text-[#F7EEE7]/40">/</span>}
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* ── Qué pasa después del formulario ────────────────────────── */}
      <section id="como" className="bg-[#D9D3C7] scroll-mt-16">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.after.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1] mt-4 text-[#1C1913]">{c.after.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.after.sub}</p>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mt-14">
            {c.after.steps.map((step, i) => (
              <AnimateIn key={step.title} direction="up" delay={i * 90}>
                <div className="bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-8 lg:p-9 h-full">
                  <span className="font-dm-serif text-5xl text-[#C7BFB0]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-dm-serif text-[1.5rem] leading-snug text-[#1C1913] mt-5">{step.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[#5E594F] mt-3 text-left">{step.text}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
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

      {/* ── Qué incluye ────────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.includes.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.includes.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.includes.sub}</p>
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

          {/* Canales de difusión — logos reales, el músculo sin humo */}
          <AnimateIn direction="up" delay={120}>
            <div className="mt-12 pt-8 border-t border-[#C7BFB0]">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#837C6E]">{c.includes.channelsLabel}</p>
              <div className="flex flex-wrap items-center gap-x-9 gap-y-6 mt-7">
                {CHANNEL_LOGOS.map((l) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={l.alt}
                    src={l.src}
                    alt={l.alt}
                    title={l.alt}
                    style={{ height: l.h, ...("raw" in l && l.raw ? {} : { filter: "brightness(0)" }) }}
                    className="w-auto opacity-60 hover:opacity-90 transition-opacity duration-300"
                  />
                ))}
              </div>
              <p className="text-[13px] text-[#857E70] mt-6">{c.includes.channelsNote}</p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Equipo ─────────────────────────────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>{c.team.eyebrow}</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.team.title}</h2>
              <p className="font-light text-lg text-[#5E594F] leading-relaxed mt-5 text-left">{c.team.sub}</p>
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {TEAM_PHOTOS.map((photo, i) => (
              <AnimateIn key={photo} direction="up" delay={i * 90}>
                <figure className="group">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#D9D3C7] ring-1 ring-black/5">
                    <Image src={photo} alt={TEAM_NAMES[i]} width={480} height={600} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <figcaption className="mt-5"><p className="font-dm-serif text-[1.4rem] text-[#1C1913] leading-tight">{TEAM_NAMES[i]}</p></figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reseñas reales ─────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-24`}>
          <AnimateIn direction="up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <Eyebrow>{c.social.eyebrow}</Eyebrow>
                <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1] mt-4 text-[#1C1913]">{c.social.title}</h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-dm-serif text-6xl text-[#1C1913] leading-none">{gRating}</span>
                <div><Stars /><p className="text-xs text-[#857E70] mt-1"><CountUp target={gTotal} /> {c.social.reviewsLabel}</p></div>
              </div>
            </div>
          </AnimateIn>
          {testimonialCards.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {testimonialCards.map((t, i) => (
                <AnimateIn key={`${t.name}-${i}`} direction="up" delay={(i % 3) * 90}>
                  <figure className="flex flex-col h-full bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-7 lg:p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
                    <figcaption className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={t.initials} />
                        <div>
                          <p className="font-medium text-[15px] text-[#1C1913] leading-tight">{t.name}</p>
                          <p className="text-xs text-[#857E70] mt-0.5">{t.tag}</p>
                        </div>
                      </div>
                      <GoogleG className="w-5 h-5 mt-1 shrink-0" />
                    </figcaption>
                    <Stars className="mt-5" />
                    <blockquote className="flex-1 text-[15px] leading-relaxed text-[#33302A] mt-3 line-clamp-6 text-left">“{t.quote}”</blockquote>
                    {t.quote.length > 220 && (
                      <button
                        type="button"
                        onClick={() => setOpenReview(t)}
                        className="self-start text-[13px] font-medium text-[#1C1913] underline underline-offset-4 decoration-[#1C1913]/40 hover:decoration-[#1C1913] transition-colors mt-4"
                      >
                        {c.social.readMore}
                      </button>
                    )}
                  </figure>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Cierre → vuelta al formulario ──────────────────────────── */}
      <section className="bg-[#1C1913]">
        <div className={`${WRAP} py-20 lg:py-28 text-center`}>
          <AnimateIn direction="up">
            <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.05] text-[#F2EEE6] max-w-3xl mx-auto">{c.finalCta.title}</h2>
            <p className="font-light text-lg text-[#B8AE9C] leading-relaxed mt-6 max-w-2xl mx-auto">{c.finalCta.sub}</p>
            <div className="mt-10">
              <a href="#formulario" className="inline-flex rounded-full bg-[#F2EEE6] text-[#14120C] text-base font-semibold px-8 py-4 hover:bg-white transition-colors duration-300">{c.finalCta.button}</a>
            </div>
            <p className="text-sm text-[#857E70] mt-8">{c.finalCta.orLabel}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-3">
              <a href={`tel:${siteConfig.phone}`} className="text-sm font-medium text-[#F2EEE6] underline underline-offset-4 decoration-[#F2EEE6]/40 hover:decoration-[#F2EEE6] transition-colors">{siteConfig.phoneDisplay}</a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Footer mínimo ──────────────────────────────────────────── */}
      <footer className="bg-[#E6E1D6] border-t border-[#C7BFB0]">
        <div className={`${WRAP} py-12`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Wordmark dark />
              <p className="text-xs text-[#9A9384]">{c.footer.tagline}</p>
            </div>
            <nav className="flex items-center gap-7 text-sm text-[#857E70]">
              <Link href="/aviso-legal" className="hover:text-[#1C1913] transition-colors">{c.footer.legal}</Link>
              <Link href="/privacidad" className="hover:text-[#1C1913] transition-colors">{c.footer.privacy}</Link>
              <Link href="/cookies" className="hover:text-[#1C1913] transition-colors">{c.footer.cookies}</Link>
            </nav>
          </div>
          <p className="text-xs text-[#9A9384] mt-8 text-center md:text-left">© {new Date().getFullYear()} The Vila Home</p>
        </div>
      </footer>

      {/* ── Modal de lectura de reseña ─────────────────────────────── */}
      {openReview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#14120C]/75 backdrop-blur-sm" onClick={() => setOpenReview(null)} aria-hidden />
          <div className="relative w-full max-w-xl bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-7 sm:p-9 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={() => setOpenReview(null)}
              aria-label={c.social.close}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#E6E1D6] text-[#1C1913] flex items-center justify-center hover:bg-[#D9D3C7] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="flex items-center gap-3 pr-10">
              <Avatar initials={openReview.initials} />
              <div>
                <p className="font-medium text-[15px] text-[#1C1913] leading-tight">{openReview.name}</p>
                <p className="text-xs text-[#857E70] mt-0.5">{openReview.tag}</p>
              </div>
              <GoogleG className="w-5 h-5 ml-auto shrink-0" />
            </div>
            <Stars className="mt-5" />
            <blockquote className="text-[15px] leading-relaxed text-[#33302A] mt-3 max-h-[55vh] overflow-y-auto text-left">“{openReview.quote}”</blockquote>
          </div>
        </div>
      )}

      {/* ── Botón flotante → sube al formulario ────────────────────── */}
      <a href="#formulario"
        className={`fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 rounded-full bg-[#1C1913] text-[#F2EEE6] text-sm font-semibold px-6 py-3.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] hover:bg-black transition-all duration-300 ${showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 4h16v12H5.2L4 17.2V4Z" /></svg>
        {c.floatingCta}
      </a>
    </div>
  );
}
