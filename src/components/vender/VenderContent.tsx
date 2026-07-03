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
