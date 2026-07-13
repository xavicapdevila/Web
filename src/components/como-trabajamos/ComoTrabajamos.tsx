"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import LeadFormSteps from "@/components/vender/LeadFormSteps";
import { siteConfig } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { COMO_COPY, type ComoCopy } from "@/lib/como-trabajamos-copy";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /como-trabajamos — EL MÉTODO, EN 5 CAPÍTULOS.
   Landing de persuasión para propietarios: enseña la producción completa
   (fotografía, vídeo, plano 3D, tour Matterport, difusión) como un
   dossier editorial. Copy en como-trabajamos-copy.ts (fuente única).
   Estructura: hero tipográfico + tira de fotos inclinada → índice
   interactivo → 5 capítulos con prueba real (slider, reel, plano con
   barrido, tour, logos) → habitual/nuestro → reseñas → formulario.
   Mismo lenguaje visual que el rediseño de /vender (General Sans,
   crema/tinta, grano, Lenis, cursor). Animaciones clave por CSS
   (.rv + scroll-timeline) — sin dependencia de JS (CSP bloquea eval en
   dev); Lenis/cursor/observer solo enriquecen en producción.
   ───────────────────────────────────────────────────────────────────── */

const EY = "text-[11px] font-medium uppercase tracking-[0.32em]";
const GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const WRAP = "mx-auto w-full max-w-[1600px] px-6 lg:px-12 xl:px-24";
const PAD = "py-16 sm:py-24 lg:py-36";

const STRIP = [
  "/images/vender/vista-2.jpg",
  "/images/vender/salon-bien-2.jpg",
  "/images/vender/entrada-2.jpg",
  "/images/vender/terraza-bien-2.jpg",
  "/images/vender/jardin-2.jpg",
  "/images/vender/comedor-bien-2.jpg",
  "/images/vender/porche-bien-2.jpg",
];

/* ── Scroll suave (Lenis) — enhancement ────────────────────────────── */
function useLenis() {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    ref.current = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); ref.current = null; };
  }, []);
  return ref;
}

function Stars({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 de 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#E8B04B]`}><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" /></svg>
      ))}
    </span>
  );
}

/* ── Tira de fotos en marquesina (hero) ────────────────────────────── */
function FilmStrip() {
  const imgs = [...STRIP, ...STRIP];
  return (
    <div aria-hidden className="relative -mx-8 rotate-[-2.5deg]">
      <div className="flex w-max gap-3 sm:gap-4 animate-[marquee-scroll_52s_linear_infinite] motion-reduce:animate-none">
        {imgs.map((src, i) => (
          <div key={i} className="relative w-[220px] sm:w-[300px] lg:w-[360px] aspect-[4/3] shrink-0 overflow-hidden rounded-lg lg:rounded-xl">
            {/* priority en las primeras: la tira está above-the-fold */}
            <Image src={src} alt="" fill sizes="360px" priority={i < 2} className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Cabecera de capítulo: numeral gigante hueco + titular + cuerpo ── */
function ChapterHead({ n, kicker, title, body, dark }: { n: string; kicker: string; title: string; body: readonly string[]; dark: boolean }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-6 sm:-top-12 right-0 font-medium leading-[0.75] tracking-[-0.04em] text-[34vw] sm:text-[24vw] lg:text-[15rem]"
        style={{ WebkitTextStroke: dark ? "1.5px rgba(239,235,225,0.13)" : "1.5px rgba(22,21,15,0.11)", color: "transparent" }}
      >
        {n}
      </span>
      <p className={`rv relative ${EY} ${dark ? "text-[#9A958A]" : "text-[#A7A296]"}`}>{kicker}</p>
      <h2 className="rv relative mt-4 max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">{title}</h2>
      <div className="rv relative mt-6 max-w-xl space-y-4">
        {body.map((p) => (
          <p key={p} className={`text-left text-[15px] lg:text-[17px] leading-relaxed ${dark ? "text-[#B7B2A6]" : "text-[#5c584e]"}`}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/* ── Antes/Después (arrastrar) — captura de puntero + pan-y ────────── */
function BeforeAfter({ before, after, room, c }: { before: string; after: string; room: string; c: ComoCopy }) {
  const [pct, setPct] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const set = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPct(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const stop = () => { dragging.current = false; };
  return (
    <div
      ref={ref} data-cursor
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); }}
      onPointerMove={(e) => { if (dragging.current) set(e.clientX); }}
      onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}
      style={{ touchAction: "pan-y" }}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden select-none cursor-ew-resize bg-[#0C0B09] rounded-xl lg:rounded-2xl">
      <Image src={after} alt={`${room}, presentada por The Vila Home`} fill sizes="100vw" draggable={false} onDragStart={(e) => e.preventDefault()} className="object-cover" />
      <Image src={before} alt={`${room}, sin cuidar`} fill sizes="100vw" draggable={false} onDragStart={(e) => e.preventDefault()} className="object-cover" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
      <span className={`absolute bottom-4 left-4 sm:bottom-5 sm:left-5 ${EY} text-white/90`}>{c.foto.labelBefore}</span>
      <span className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 ${EY} text-white`}>{c.foto.labelAfter}</span>
      <div className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${pct}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16150F" strokeWidth="1.6" className="w-5 h-5"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

function CompareRooms({ c }: { c: ComoCopy }) {
  const [idx, setIdx] = useState(1); // el salón por defecto
  const pair = c.foto.pairs[idx];
  return (
    <div>
      <BeforeAfter before={pair.mal} after={pair.bien} room={pair.room} c={c} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {c.foto.pairs.map((p, i) => (
            <button key={p.room} type="button" data-cursor onClick={() => setIdx(i)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] sm:text-[13px] tracking-[-0.01em] transition-colors duration-300 ring-1 ${i === idx ? "bg-[#EFEBE1] text-[#16150F] ring-transparent" : "text-[#9A958A] ring-[#3a382f] hover:text-[#EFEBE1]"}`}>
              {p.room}
            </button>
          ))}
        </div>
        <span className="hidden sm:flex items-center gap-2 text-[13px] text-[#9A958A] tracking-[-0.01em]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {c.foto.hint}
        </span>
      </div>
    </div>
  );
}

/* ── Reel vertical en marco de móvil (toca para reproducir) ────────── */
function PhoneReel({ c }: { c: ComoCopy }) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) { el.muted = false; void el.play().catch(() => {}); }
    else el.pause();
  };
  return (
    <div className="relative mx-auto w-[min(74vw,330px)] text-center">
      <div data-cursor className="relative aspect-[9/16] overflow-hidden rounded-[2.4rem] bg-[#0C0B09] ring-1 ring-[#16150F]/15 shadow-[0_70px_140px_-60px_rgba(22,21,15,0.65)]">
        <video
          ref={v} src={c.video.src} poster={c.video.poster} preload="none" loop playsInline
          onClick={toggle} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!playing && (
          <button type="button" onClick={toggle} aria-label={c.video.playCta} className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 text-[#16150F] shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 translate-x-0.5"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
            </span>
          </button>
        )}
      </div>
      <p className="mt-4 text-[12px] text-[#8A8578]">{c.video.note}</p>
    </div>
  );
}

/* ── Plano 3D: tarjeta que envuelve el plano recortado (sin letterbox ni
     barrido). Halo suave detrás para dar profundidad sobre el fondo oscuro. */
function PlanoView({ c }: { c: ComoCopy }) {
  return (
    <figure className="relative mx-auto max-w-3xl">
      <div aria-hidden className="pointer-events-none absolute -inset-8 sm:-inset-14 rounded-[3rem] bg-[radial-gradient(60%_55%_at_50%_42%,rgba(239,235,225,0.12),transparent_72%)]" />
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FCFBF8] to-[#EDE9DF] p-3 sm:p-5 ring-1 ring-white/10 shadow-[0_70px_130px_-55px_rgba(0,0,0,0.8)]">
        <Image
          src={c.plano.img}
          alt="Plano 3D de distribución de una vivienda de The Vila Home"
          width={1641}
          height={1619}
          sizes="(min-width:1024px) 720px, 92vw"
          className="w-full h-auto rounded-lg"
        />
      </div>
      <figcaption className="mt-4 text-center text-[12px] text-[#9A958A]">{c.plano.note}</figcaption>
    </figure>
  );
}

/* ── Tour Matterport con activación al toque (evita scroll-trap) ───── */
function TourFrame({ c }: { c: ComoCopy }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-xl lg:rounded-2xl bg-[#0C0B09] shadow-[0_50px_100px_-50px_rgba(22,21,15,0.5)]">
      {/* sandbox SIN allow-top-navigation: en iPhone no hay Fullscreen API y
          el visor de Matterport intenta navegar la página a matterport.com
          (te sacaba de la landing). Así esa navegación queda bloqueada y
          sus enlaces externos se abren en pestaña nueva como mucho. */}
      <iframe src={c.tour.matterport} title="Tour virtual 3D — The Vila Home" loading="lazy" allow="fullscreen; xr-spatial-tracking" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" className={`absolute inset-0 h-full w-full ${active ? "" : "pointer-events-none"}`} />
      {!active && (
        <button type="button" data-cursor onClick={() => setActive(true)} aria-label="Explorar el tour 3D"
          className="absolute inset-0 flex items-end justify-center pb-5 bg-gradient-to-t from-black/35 to-transparent">
          <span className="rounded-full bg-white/95 text-[#16150F] text-[13px] font-medium px-5 py-2.5 shadow-lg">{c.tour.activate}</span>
        </button>
      )}
    </div>
  );
}

/* ── Carrusel de reseñas: una cada vez, autoavance, recorte a 3 líneas
     con «Leer más» si es larga. Texto normal (sin negrita). ─────────── */
function ReviewsCarousel({ c }: { c: ComoCopy }) {
  const items = c.resenas.items;
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  // ¿la reseña actual se corta a 3 líneas? (se mide con el recorte aplicado)
  useEffect(() => {
    setExpanded(false);
    const el = pRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => setTruncated(el.scrollHeight - el.clientHeight > 4));
    return () => cancelAnimationFrame(id);
  }, [idx]);

  // Autoavance; en pausa mientras se lee una reseña expandida.
  useEffect(() => {
    if (expanded) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [expanded, items.length]);

  const go = (n: number) => setIdx((n + items.length) % items.length);
  const r = items[idx];

  return (
    <div>
      <blockquote className="min-h-[10rem] sm:min-h-[8.5rem]">
        <p ref={pRef} className={`tracking-[-0.01em] leading-relaxed text-[18px] sm:text-[20px] lg:text-[24px] text-[#16150F] ${expanded ? "" : "line-clamp-3"}`}>
          “{r.quote}”
        </p>
        {truncated && (
          <button type="button" onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-[14px] text-[#8A8578] underline underline-offset-4 hover:text-[#16150F] transition-colors">
            {expanded ? c.resenas.readLess : c.resenas.readMore}
          </button>
        )}
        <footer className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars />
          <span className="text-[14px] font-medium text-[#16150F]">{r.name}</span>
          <span className="text-[12px] text-[#A7A296]">{r.tag}</span>
        </footer>
      </blockquote>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} type="button" aria-label={`Reseña ${i + 1}`} onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-[#16150F]" : "w-1.5 bg-[#16150F]/25 hover:bg-[#16150F]/45"}`} />
          ))}
        </div>
        <span className="ml-auto flex gap-2">
          <button type="button" aria-label="Reseña anterior" onClick={() => go(idx - 1)}
            className="flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-[#16150F]/15 hover:bg-[#16150F] hover:text-[#F4F2ED] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Reseña siguiente" onClick={() => go(idx + 1)}
            className="flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-[#16150F]/15 hover:bg-[#16150F] hover:text-[#F4F2ED] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </span>
      </div>
    </div>
  );
}

/* ── Componente ────────────────────────────────────────────────────── */
export default function ComoTrabajamos({ lang = "es" }: { lang?: Lang }) {
  const C = COMO_COPY[lang];
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 40);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => removeEventListener("scroll", on);
  }, []);

  /* Capítulo activo para el raíl lateral — enhancement */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    C.indice.chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  // Decimal según idioma: "4,9" en es/ca/fr, "4.9" en en.
  const rating = siteConfig.googleReviews.rating.toLocaleString(lang);

  return (
    <div className="font-gs bg-[#0C0B09] text-[#EFEBE1] antialiased overflow-clip">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "180px" }} />

      {/* ── Raíl de capítulos (desktop) ─────────────────────────────── */}
      <div className={`fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:block mix-blend-difference transition-opacity duration-700 ${pastHero ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col gap-4">
          {C.indice.chapters.map((ch) => (
            <a key={ch.id} href={`#${ch.id}`} onClick={goTo(ch.id)} aria-label={ch.label}
              className={`flex items-center gap-2.5 text-white transition-opacity duration-300 ${active === ch.id ? "opacity-100" : "opacity-35 hover:opacity-70"}`}>
              <span className={`h-px bg-white transition-all duration-300 ${active === ch.id ? "w-7" : "w-3"}`} />
              <span className="text-[10px] tracking-[0.3em]">{ch.n}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className={`nav-swap fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3.5 bg-[#F4F2ED]/85 backdrop-blur-xl" : "py-6"}`}>
        <nav className={`${WRAP} flex items-center justify-between`}>
          {/* En pestaña nueva: la landing es de captación, no queremos que
              pierdan el hilo si van a curiosear la web general. */}
          <a href="/" target="_blank" rel="noopener" aria-label="The Vila Home (se abre en una pestaña nueva)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="nav-logo h-9 sm:h-11 w-auto transition-all duration-500" style={{ filter: scrolled ? "brightness(0)" : "none" }} />
          </a>
          <a href="#contacto" onClick={goTo("contacto")} data-cursor className={`nav-cta text-[13px] font-medium tracking-tight rounded-full px-5 py-2.5 transition-all duration-500 ${scrolled ? "bg-[#16150F] text-[#F4F2ED] hover:bg-black" : "bg-white/10 text-[#F4F2ED] ring-1 ring-white/25 backdrop-blur hover:bg-white/20"}`}>{C.nav.cta}</a>
        </nav>
      </header>

      {/* ── HERO tipográfico + tira de fotos inclinada ──────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#0C0B09] pt-32 sm:pt-36">
        <div className={`${WRAP} relative`}>
          <p className={`hero-in ${EY} text-[#9A958A]`}>{C.hero.eyebrow}</p>
          <h1 className="hero-in mt-5 max-w-[13ch] font-medium tracking-[-0.03em] leading-[0.98] text-[#F4F2ED] text-[12vw] sm:text-[9vw] lg:text-[6.8rem]" style={{ animationDelay: "0.08s" }}>
            {C.hero.titleLead}
          </h1>
          <p className="hero-in mt-5 max-w-[30ch] text-[#9A958A] font-normal tracking-[-0.01em] leading-[1.2] text-[5.2vw] sm:text-[3vw] lg:text-[1.7rem]" style={{ animationDelay: "0.16s" }}>
            {C.hero.titleSub}
          </p>
          <div className="hero-in mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "0.24s" }}>
            <a href="#contacto" onClick={goTo("contacto")} data-cursor className="group inline-flex items-center gap-3 rounded-full bg-[#F4F2ED] text-[#16150F] text-[16px] font-medium pl-8 pr-3.5 py-3.5 hover:bg-white transition-colors">
              {C.hero.cta}
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16150F] text-[#F4F2ED] transition-transform duration-500 group-hover:rotate-45">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
            <span className="flex items-center gap-2 text-[#EFEBE1]">
              <span className="text-xl sm:text-2xl font-medium tracking-tight">{rating}</span>
              <Stars />
              <span className="text-[13px] text-[#9A958A]">{C.hero.inGoogle}</span>
            </span>
          </div>
        </div>
        {/* text-center va en el contenedor: .font-gs p{text-align:inherit}
            (globals) pisa la utilidad text-center puesta en el propio <p> */}
        <div className="relative mt-14 pb-10 sm:pb-14 text-center">
          <FilmStrip />
          <p className={`hero-in mt-8 ${EY} text-[#9A958A]`} style={{ animationDelay: "0.4s" }}>{C.hero.scrollHint} ↓</p>
        </div>
      </section>

      {/* ── ÍNDICE interactivo ──────────────────────────────────────── */}
      <section className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} border-t border-white/5`}>
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#9A958A]`}>{C.indice.eyebrow}</p>
          <h2 className="rv mt-4 max-w-[26ch] font-medium tracking-[-0.03em] leading-[1.05] text-[7.6vw] sm:text-[4.6vw] lg:text-[3rem] [text-wrap:balance]">{C.indice.title}</h2>
          <div className="rv-slow mt-10 lg:mt-14 border-b border-white/10">
            {C.indice.chapters.map((ch) => (
              <a key={ch.id} href={`#${ch.id}`} onClick={goTo(ch.id)} data-cursor
                className="group grid grid-cols-[2.5rem_1fr_auto] lg:grid-cols-[4rem_1fr_auto_auto] items-center gap-x-3 lg:gap-x-10 border-t border-white/10 py-5 lg:py-7 px-2 sm:px-4 transition-colors duration-300 hover:bg-[#EFEBE1] hover:text-[#16150F]">
                <span className="text-[12px] tracking-[0.25em] text-[#9A958A] transition-colors group-hover:text-[#16150F]/55">{ch.n}</span>
                <span className="min-w-0">
                  <span className="block font-medium tracking-[-0.03em] leading-[1.05] text-[7.5vw] sm:text-[4.6vw] lg:text-[3.2rem]">{ch.label}</span>
                  <span className="block mt-1.5 text-[13px] lg:text-[14px] text-[#9A958A] transition-colors group-hover:text-[#16150F]/55">{ch.sub}</span>
                </span>
                <span className="relative hidden lg:block w-40 h-24 overflow-hidden rounded-md opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                  <Image src={ch.preview} alt="" fill sizes="200px" className="object-cover" />
                </span>
                <span className="flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full ring-1 ring-white/20 transition-all duration-500 group-hover:ring-[#16150F]/25 group-hover:rotate-45">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Puente editorial ────────────────────────────────────────── */}
      <section className={`bg-[#F4F2ED] text-[#16150F] ${PAD}`}>
        <div className={WRAP}>
          <div className="mx-auto max-w-4xl text-center">
            {C.intro.lines.map((l) => (
              <p key={l} className="rv text-[#8A8578] font-medium tracking-[-0.02em] leading-[1.25] text-[5.6vw] sm:text-[3.2vw] lg:text-[2rem]">{l}</p>
            ))}
            <p className="rv mt-6 font-medium tracking-[-0.025em] leading-[1.12] text-[7.4vw] sm:text-[4.4vw] lg:text-[2.9rem] [text-wrap:balance]">{C.intro.strong}</p>
          </div>
        </div>
      </section>

      {/* ── 01 · FOTOGRAFÍA ─────────────────────────────────────────── */}
      <section id="fotografia" className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} scroll-mt-16 overflow-hidden`}>
        <div className={WRAP}>
          <ChapterHead n={C.foto.n} kicker={C.foto.kicker} title={C.foto.title} body={C.foto.body} dark />
        </div>
        <div className="rv-slow mt-10 lg:mt-14 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <CompareRooms c={C} />
        </div>
      </section>

      {/* ── 02 · VÍDEO ──────────────────────────────────────────────── */}
      <section id="video" className={`relative bg-[#F4F2ED] text-[#16150F] ${PAD} scroll-mt-16 overflow-hidden`}>
        <div className={`${WRAP} grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center`}>
          <ChapterHead n={C.video.n} kicker={C.video.kicker} title={C.video.title} body={C.video.body} dark={false} />
          <div className="rv-slow">
            <PhoneReel c={C} />
          </div>
        </div>
      </section>

      {/* ── 03 · PLANO 3D ───────────────────────────────────────────── */}
      <section id="plano" className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} scroll-mt-16 overflow-hidden`}>
        <div className={WRAP}>
          <ChapterHead n={C.plano.n} kicker={C.plano.kicker} title={C.plano.title} body={C.plano.body} dark />
          <div className="rv-slow mt-10 lg:mt-14">
            <PlanoView c={C} />
          </div>
        </div>
      </section>

      {/* ── 04 · TOUR VIRTUAL ───────────────────────────────────────── */}
      <section id="tour" className={`relative bg-[#F4F2ED] text-[#16150F] ${PAD} scroll-mt-16 overflow-hidden`}>
        <div className={WRAP}>
          <ChapterHead n={C.tour.n} kicker={C.tour.kicker} title={C.tour.title} body={C.tour.body} dark={false} />
          <div className="rv-slow mt-10 lg:mt-14">
            <TourFrame c={C} />
            <p className="mt-4 text-[13px] text-[#8A8578]">{C.tour.note}</p>
          </div>
        </div>
      </section>

      {/* ── 05 · DIFUSIÓN ───────────────────────────────────────────── */}
      <section id="difusion" className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} scroll-mt-16 overflow-hidden`}>
        <div className={WRAP}>
          <ChapterHead n={C.difusion.n} kicker={C.difusion.kicker} title={C.difusion.title} body={C.difusion.body} dark />
        </div>
        <div className="rv-slow mt-12 lg:mt-16 overflow-hidden">
          <div className="flex w-max items-center gap-14 lg:gap-20 animate-[marquee-scroll_32s_linear_infinite] motion-reduce:animate-none">
            {[...C.difusion.channels, ...C.difusion.channels].map((ch, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              // brightness-0 invert: blanquea CUALQUIER logo (los hay negros y
              // blancos, p.ej. fotocasa; con solo `invert` el blanco salía negro).
              <img key={`${ch.alt}-${i}`} src={ch.src} alt={i < C.difusion.channels.length ? ch.alt : ""} className="h-5 lg:h-6 w-auto shrink-0 object-contain brightness-0 invert opacity-70" />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESPUÉS DEL ANUNCIO (coda compacta, no es un sexto paso) ── */}
      <section className="relative bg-[#0C0B09] text-[#EFEBE1] py-14 sm:py-20 lg:py-28 border-t border-white/5">
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#9A958A]`}>{C.coda.eyebrow}</p>
          <h2 className="rv mt-4 max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">{C.coda.title}</h2>
          <div className="rv-slow mt-10 lg:mt-14 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {C.coda.items.map((it) => (
              <div key={it.t} className="border-t border-white/10 pt-5">
                <h3 className="text-[19px] lg:text-[22px] font-medium tracking-[-0.02em]">{it.t}</h3>
                <p className="mt-2.5 text-left text-[14px] lg:text-[15px] leading-relaxed text-[#B7B2A6]">{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LO HABITUAL / LO NUESTRO ────────────────────────────────── */}
      <section className={`relative bg-[#F4F2ED] text-[#16150F] ${PAD}`}>
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#A7A296]`}>{C.diferencia.eyebrow}</p>
          <h2 className="rv mt-4 max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">
            <span className="text-[#A7A296]">{C.diferencia.titleMuted}</span> {C.diferencia.titleRest}
          </h2>
          <div className="rv-slow mt-10 lg:mt-14">
            <div className="hidden lg:grid grid-cols-2 gap-x-12 pb-3">
              <span className={`${EY} text-[#A7A296]`}>{C.diferencia.colHabitual}</span>
              <span className={`${EY} text-[#16150F]`}>{C.diferencia.colNuestro}</span>
            </div>
            {C.diferencia.rows.map((r) => (
              <div key={r.nuestro} className="grid lg:grid-cols-2 gap-x-12 gap-y-2.5 border-t border-[#16150F]/10 py-5 lg:py-6">
                <div className="flex items-start gap-3 text-[#A7A296]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-1 shrink-0"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                  <span className="text-[15px] lg:text-[17px] leading-snug">{r.habitual}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-1 shrink-0"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="text-[16px] lg:text-[19px] font-medium tracking-[-0.01em] leading-snug">{r.nuestro}</span>
                </div>
              </div>
            ))}
            <p className="border-t border-[#16150F]/10 pt-8 mt-1 max-w-2xl text-left text-[15px] lg:text-[17px] leading-relaxed text-[#5c584e]">{C.diferencia.outro}</p>
          </div>
        </div>
      </section>

      {/* ── RESEÑAS ─────────────────────────────────────────────────── */}
      <section className={`relative bg-[#F4F2ED] text-[#16150F] border-t border-[#16150F]/10 ${PAD}`}>
        <div className={WRAP}>
          <div className="rv flex items-center gap-3">
            <span className="text-4xl lg:text-5xl font-medium tracking-tight">{rating}</span>
            <div><Stars className="w-4 h-4" /><p className="text-[12px] text-[#A7A296] mt-1">{C.resenas.googleLabel}</p></div>
          </div>
          <div className="rv-slow mt-10 lg:mt-14 max-w-3xl">
            <ReviewsCarousel c={C} />
          </div>
        </div>
      </section>

      {/* ── CIERRE + FORMULARIO ─────────────────────────────────────── */}
      <section id="contacto" className="relative overflow-hidden bg-[#0C0B09] text-[#EFEBE1] scroll-mt-16">
        <Image src="/images/vender/vista-2.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B09] via-[#0C0B09]/80 to-[#0C0B09]" aria-hidden />
        <div className={`relative ${WRAP} ${PAD}`}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="rv font-medium tracking-[-0.03em] leading-[1.02] text-[9vw] sm:text-[5.6vw] lg:text-[3.6rem] text-[#F4F2ED] [text-wrap:balance]">{C.cierre.title}</h2>
            <p className="rv mt-3 text-[5.4vw] sm:text-[3vw] lg:text-[1.7rem] font-medium tracking-[-0.02em] text-[#9A958A]">{C.cierre.sub}</p>
            <p className="rv mt-6 mx-auto max-w-[52ch] text-center text-[15px] lg:text-[17px] leading-relaxed text-[#B7B2A6] [text-wrap:balance]">{C.cierre.body}</p>
          </div>
          <div className="rv-slow max-w-xl mx-auto mt-8 lg:mt-12">
            <LeadFormSteps source="como-trabajamos" submitLabel={C.cierre.submitLabel} askPrice />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#F4F2ED]">
        <div className={`${WRAP} py-9 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <a href="/" target="_blank" rel="noopener" aria-label="The Vila Home — inicio (se abre en una pestaña nueva)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="h-8 sm:h-9 w-auto" style={{ filter: "brightness(0)" }} />
          </a>
          <nav className="flex items-center gap-6 text-[13px] text-[#7d786c]">
            <a href="/aviso-legal" className="hover:text-[#16150F] transition-colors">{C.footer.legal}</a>
            <a href="/privacidad" className="hover:text-[#16150F] transition-colors">{C.footer.privacy}</a>
            <a href="/cookies" className="hover:text-[#16150F] transition-colors">{C.footer.cookies}</a>
          </nav>
          <p className="text-[12px] text-[#A7A296]">© {new Date().getFullYear()} The Vila Home</p>
        </div>
      </footer>
    </div>
  );
}
