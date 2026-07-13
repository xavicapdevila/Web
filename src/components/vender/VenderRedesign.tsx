"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import LeadFormSteps from "@/components/vender/LeadFormSteps";
import { siteConfig } from "@/lib/config";
import { VENDER_COPY as C } from "@/lib/vender-copy";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /vender — LANDING DE CAPTACIÓN (General Sans).
   Un objetivo: el lead. Poda drástica del copy: quedan las frases-gancho
   de vender-copy.ts (INTOCABLES); los desarrollos largos viven en la
   página de marca. Prueba visual (slider, tour, casas) en vez de texto.
   Formulario multi-paso (LeadFormSteps) con todo el circuito automático
   (Pixel+CAPI dedup, GA4, atribución, autorespuesta, WhatsApp).
   6 bloques: hero → antes/después → tour+difusión → casas → reseña →
   formulario. Compacto en móvil (~6-7 pantallas).
   Animaciones por CSS (.rv) — sin dependencia de JS (CSP bloquea eval
   en dev); Lenis/cursor/parallax solo enriquecen en producción.
   ───────────────────────────────────────────────────────────────────── */

const EY = "text-[11px] font-medium uppercase tracking-[0.32em]";
const GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

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

/* ── Cursor propio (puntero fino) — enhancement ────────────────────── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  /* Oculto hasta el primer mousemove (si no, nace clavado en el centro de
     la pantalla) y también sobre iframes (el documento deja de recibir
     mousemove dentro del Matterport y el punto se quedaba congelado
     encima del tour, negro por el mix-blend-difference). */
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const el = dot.current!;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; setVisible(true); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a,button,[data-cursor]"));
      if (t.tagName === "IFRAME" || t.closest("iframe")) setVisible(false);
    };
    const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; el.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
    addEventListener("mousemove", move); addEventListener("mouseover", over); raf = requestAnimationFrame(loop);
    return () => { removeEventListener("mousemove", move); removeEventListener("mouseover", over); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={dot} aria-hidden className={`pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block mix-blend-difference transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className={`rounded-full bg-white transition-[width,height] duration-300 ease-out ${hovering ? "w-12 h-12" : "w-2.5 h-2.5"}`} />
    </div>
  );
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

/* ── Antes/Después (arrastrar) — captura de puntero (drag fiable con
     ratón y táctil) + pan-y (no secuestra el scroll vertical móvil) ─── */
function BeforeAfter({ before, after, room }: { before: string; after: string; room: string }) {
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
      <span className={`absolute bottom-4 left-4 sm:bottom-5 sm:left-5 ${EY} text-white/90`}>{C.presentacion.labelBefore}</span>
      <span className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 ${EY} text-white`}>{C.presentacion.labelAfter}</span>
      <div className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${pct}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16150F" strokeWidth="1.6" className="w-5 h-5"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

function CompareRooms() {
  const [idx, setIdx] = useState(1); // el salón por defecto
  const pair = C.presentacion.pairs[idx];
  return (
    <div>
      <BeforeAfter before={pair.mal} after={pair.bien} room={pair.room} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {C.presentacion.pairs.map((p, i) => (
            <button key={p.room} type="button" data-cursor onClick={() => setIdx(i)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] sm:text-[13px] tracking-[-0.01em] transition-colors duration-300 ring-1 ${i === idx ? "bg-[#EFEBE1] text-[#16150F] ring-transparent" : "text-[#9A958A] ring-[#3a382f] hover:text-[#EFEBE1]"}`}>
              {p.room}
            </button>
          ))}
        </div>
        <span className="hidden sm:flex items-center gap-2 text-[13px] text-[#9A958A] tracking-[-0.01em]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Arrastra para comparar
        </span>
      </div>
    </div>
  );
}

/* ── Tres casas de noche: hover enciende; en táctil, autociclo ─────── */
const NH_CSS = `
  .nh__l{opacity:0;transition:opacity 850ms cubic-bezier(0.4,0,0.2,1)}
  .nh__t{opacity:0;transform:translateY(14px);transition:opacity 500ms ease,transform 600ms cubic-bezier(0.22,1,0.36,1)}
  @media (hover: hover){
    .nh:has(.nh__z1:hover) .nh__l1{opacity:1}
    .nh:has(.nh__z2:hover) .nh__l2{opacity:1}
    .nh:has(.nh__z3:hover) .nh__l3{opacity:1}
    .nh:has(.nh__z1:hover) .nh__t1{opacity:1;transform:none}
    .nh:has(.nh__z2:hover) .nh__t2{opacity:1;transform:none}
    .nh:has(.nh__z3:hover) .nh__t3{opacity:1;transform:none}
  }
  @media (hover: none) and (prefers-reduced-motion: no-preference){
    .nh__l1,.nh__t1{animation-delay:0s}
    .nh__l2,.nh__t2{animation-delay:4.5s}
    .nh__l3,.nh__t3{animation-delay:9s}
    .nh__l1,.nh__l2,.nh__l3{animation-name:nh-luz;animation-duration:13.5s;animation-iteration-count:infinite}
    .nh__t1,.nh__t2,.nh__t3{animation-name:nh-txt;animation-duration:13.5s;animation-iteration-count:infinite}
  }
  @media (hover: none){ .nh-hint{display:none} }
  @keyframes nh-luz{0%{opacity:0}5%{opacity:1}28%{opacity:1}33%{opacity:0}100%{opacity:0}}
  @keyframes nh-txt{0%{opacity:0;transform:translateY(10px)}5%{opacity:1;transform:none}28%{opacity:1;transform:none}33%{opacity:0}100%{opacity:0}}
`;

function NightHouses() {
  const [a, b, c] = C.eligen.introLines;
  /* Caption a ancho completo (una sola casa se enciende a la vez):
     legible en móvil, centrada sobre la escena. */
  const T = "nh__t absolute top-[6%] inset-x-0 mx-auto max-w-[34ch] px-4 text-center text-white font-medium leading-[1.22] [text-wrap:balance] text-[15px] sm:text-[19px] lg:text-[23px] tracking-[-0.01em] [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]";
  return (
    <div className="nh relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden rounded-xl lg:rounded-2xl bg-[#0C0B09]">
      <style>{NH_CSS}</style>
      <Image src="/images/vender/casas-off.png" alt="Una calle con tres casas al anochecer" fill sizes="100vw" className="object-cover" />
      <Image src="/images/vender/casas-1.png" alt="" fill sizes="100vw" className="object-cover nh__l nh__l1" />
      <Image src="/images/vender/casas-2.png" alt="" fill sizes="100vw" className="object-cover nh__l nh__l2" />
      <Image src="/images/vender/casas-3.png" alt="" fill sizes="100vw" className="object-cover nh__l nh__l3" />
      <div className={`${T} nh__t1`}>{a}</div>
      <div className={`${T} nh__t2`}>{b}</div>
      <div className={`${T} nh__t3`}>{c}</div>
      <div className="nh__z1 absolute inset-y-0 left-0 w-1/3 cursor-pointer" data-cursor aria-hidden />
      <div className="nh__z2 absolute inset-y-0 left-1/3 w-1/3 cursor-pointer" data-cursor aria-hidden />
      <div className="nh__z3 absolute inset-y-0 left-2/3 w-1/3 cursor-pointer" data-cursor aria-hidden />
    </div>
  );
}

/* ── Tour Matterport con activación al toque (evita scroll-trap) ───── */
function TourFrame() {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-xl lg:rounded-2xl bg-[#0C0B09] shadow-[0_50px_100px_-50px_rgba(22,21,15,0.5)]">
      {/* sandbox SIN allow-top-navigation: en iPhone no hay Fullscreen API y
          el visor de Matterport intenta navegar la página a matterport.com
          (te sacaba de la landing). Así esa navegación queda bloqueada. */}
      <iframe src={C.tour.matterport} title="Tour virtual 3D — The Vila Home" loading="lazy" allow="fullscreen; xr-spatial-tracking" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" className={`absolute inset-0 h-full w-full ${active ? "" : "pointer-events-none"}`} />
      {!active && (
        <button type="button" data-cursor onClick={() => setActive(true)} aria-label="Explorar el tour 3D"
          className="absolute inset-0 flex items-end justify-center pb-5 bg-gradient-to-t from-black/35 to-transparent">
          <span className="rounded-full bg-white/95 text-[#16150F] text-[13px] font-medium px-5 py-2.5 shadow-lg">Toca para explorar</span>
        </button>
      )}
    </div>
  );
}

/* ── Componente ────────────────────────────────────────────────────── */
export default function VenderRedesign() {
  const lenis = useLenis();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    addEventListener("scroll", on, { passive: true }); on();
    return () => removeEventListener("scroll", on);
  }, []);

  const toContact = (e: React.MouseEvent) => {
    const el = document.getElementById("contacto");
    if (!el) return;
    e.preventDefault();
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const rating = String(siteConfig.googleReviews.rating).replace(".", ",");
  const WRAP = "mx-auto w-full max-w-[1600px] px-6 lg:px-12";
  const PAD = "py-14 sm:py-20 lg:py-32";
  const featured = C.resenas.items[0];

  return (
    <div className="font-gs bg-[#F4F2ED] text-[#16150F] antialiased overflow-clip">
      <Cursor />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "180px" }} />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className={`nav-swap fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3.5 bg-[#F4F2ED]/85 backdrop-blur-xl" : "py-6"}`}>
        <nav className={`${WRAP} flex items-center justify-between`}>
          <a href="/" aria-label="The Vila Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="nav-logo h-7 sm:h-8 w-auto transition-all duration-500" style={{ filter: scrolled ? "brightness(0)" : "none" }} />
          </a>
          <a href="#contacto" onClick={toContact} data-cursor className={`nav-cta text-[13px] font-medium tracking-tight rounded-full px-5 py-2.5 transition-all duration-500 ${scrolled ? "bg-[#16150F] text-[#F4F2ED] hover:bg-black" : "bg-white/10 text-[#F4F2ED] ring-1 ring-white/25 backdrop-blur hover:bg-white/20"}`}>{C.nav.cta}</a>
        </nav>
      </header>

      {/* ── 1 · HERO (gancho + CTA + confianza, sin párrafos) ───────── */}
      <section ref={heroRef} className="relative min-h-[92svh] flex flex-col justify-end overflow-hidden bg-[#0C0B09]">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" className="object-cover object-[70%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B09] via-[#0C0B09]/50 to-[#0C0B09]/30" />
        </motion.div>

        <div className={`hero-in relative ${WRAP} pb-12 lg:pb-20 pt-28`}>
          <p className={`${EY} text-[#EFEBE1]/70`}>{C.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-[15ch] text-[#F4F2ED] font-medium tracking-[-0.03em] leading-[0.98] text-[11.5vw] sm:text-[8.5vw] lg:text-[5.6rem]">
            {C.hero.titleLead}
          </h1>
          <p className="mt-4 max-w-[26ch] text-[#EFEBE1]/90 font-normal tracking-[-0.01em] leading-[1.18] text-[5.4vw] sm:text-[3vw] lg:text-[1.8rem]">
            {C.hero.titleSub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contacto" onClick={toContact} data-cursor className="group inline-flex items-center gap-3 rounded-full bg-[#F4F2ED] text-[#16150F] text-[16px] font-medium pl-8 pr-3.5 py-3.5 hover:bg-white transition-colors">
              {C.hero.cta}
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16150F] text-[#F4F2ED] transition-transform duration-500 group-hover:rotate-45">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-9 text-[#EFEBE1]">
            <span className="flex items-baseline gap-2"><span className="text-2xl sm:text-3xl font-medium tracking-tight">+{C.hero.families}</span><span className="text-[13px] sm:text-sm text-[#EFEBE1]/60 max-w-[9rem] leading-tight">{C.hero.statFamilies}</span></span>
            <span className="w-px h-7 bg-white/15" />
            <span className="flex items-center gap-2"><span className="text-2xl sm:text-3xl font-medium tracking-tight">{rating}</span><Stars /><span className="text-[13px] sm:text-sm text-[#EFEBE1]/60">{C.hero.statGoogle}</span></span>
          </div>
        </div>
      </section>

      {/* ── 2 · LA PRUEBA VISUAL (antes/después) ────────────────────── */}
      <section className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} border-t border-white/5`}>
        <div className={WRAP}>
          <h2 className="rv max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">
            {C.presentacion.titleMuted}{" "}
            <span className="text-[#9A958A]">{C.presentacion.titleRest}</span>
          </h2>
        </div>
        <div className="rv-slow mt-8 lg:mt-12 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <CompareRooms />
        </div>
      </section>

      {/* ── 3 · TOUR + DIFUSIÓN ─────────────────────────────────────── */}
      <section className={`relative ${PAD}`}>
        <div className={WRAP}>
          <h2 className="rv max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">{C.tour.title}</h2>
          <div className="rv-slow mt-8 lg:mt-12">
            <TourFrame />
          </div>
          <div className="rv mt-10 lg:mt-14">
            <p className="text-[15px] lg:text-[17px] font-medium text-[#16150F]">{C.movemos.steps[2].lead}</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-5 opacity-70">
              {C.movemos.channels.map((ch) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={ch.alt} src={ch.src} alt={ch.alt} className="h-4 lg:h-5 w-auto object-contain grayscale" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 · POR QUÉ NOSOTROS (casas que se encienden) ───────────── */}
      <section className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD}`}>
        <div className={WRAP}>
          <h2 className="rv max-w-[20ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.4vw] lg:text-[3.6rem] [text-wrap:balance]">
            {C.eligen.title}
          </h2>
          <p className="rv nh-hint mt-4 text-[#9A958A] text-[14px] tracking-[0.02em]">Pasa el cursor por cada casa.</p>
        </div>
        <div className={`rv-slow mt-8 lg:mt-12 ${WRAP}`}>
          <NightHouses />
        </div>
      </section>

      {/* ── 5 · PRUEBA SOCIAL (una reseña, grande) ──────────────────── */}
      <section className={`relative ${PAD}`}>
        <div className={WRAP}>
          <div className="rv flex items-center gap-3">
            <span className="text-4xl lg:text-5xl font-medium tracking-tight">{rating}</span>
            <div><Stars className="w-4 h-4" /><p className="text-[12px] text-[#A7A296] mt-1">{C.resenas.googleLabel}</p></div>
          </div>
          <blockquote className="rv-slow mt-8 lg:mt-12 max-w-4xl">
            <p className="font-medium tracking-[-0.025em] leading-[1.16] text-[6vw] sm:text-[3.8vw] lg:text-[2.6rem] text-[#16150F] [text-wrap:balance]">“{featured.quote}”</p>
            <footer className="mt-5 flex items-center gap-3">
              <Stars />
              <span className="text-[14px] text-[#16150F] font-medium">{featured.name}</span>
              <span className="text-[12px] text-[#A7A296]">{featured.tag}</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── 6 · FORMULARIO (multi-paso) + cierre ────────────────────── */}
      <section id="contacto" className="relative overflow-hidden bg-[#0C0B09] text-[#EFEBE1] scroll-mt-16">
        <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover object-[70%_50%] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B09] via-[#0C0B09]/80 to-[#0C0B09]" aria-hidden />
        <div className={`relative ${WRAP} ${PAD}`}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="rv font-medium tracking-[-0.03em] leading-[1.02] text-[9vw] sm:text-[5.6vw] lg:text-[3.6rem] text-[#F4F2ED] [text-wrap:balance]">{C.cierre.title}</h2>
            <p className="rv mt-3 text-[4.6vw] sm:text-[2.8vw] lg:text-[1.5rem] font-medium tracking-[-0.02em] text-[#9A958A]">{C.cierre.sub}</p>
          </div>
          <div className="rv-slow max-w-xl mx-auto mt-8 lg:mt-12">
            <LeadFormSteps source="vender-preview" submitLabel={C.cierre.submitLabel} />
          </div>
          <div className="rv max-w-2xl mx-auto text-center mt-12 lg:mt-16 pt-8 border-t border-white/10">
            <p className="font-medium tracking-[-0.025em] leading-[1.15] text-[5.4vw] sm:text-[3.2vw] lg:text-[1.9rem] text-[#F4F2ED]">
              {C.cierre.closerLead}
              <span className="block text-[#9A958A] mt-2 text-[0.82em]">{C.cierre.closerSub}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#F4F2ED]">
        <div className={`${WRAP} py-9 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <a href="/" aria-label="The Vila Home — inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="h-6 w-auto" style={{ filter: "brightness(0)" }} />
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
