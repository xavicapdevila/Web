"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /vender — «DINOS TU PRECIO».
   Landing de captación para la campaña de Meta cuyo gancho es el precio
   («¿Cuánto quieres por tu casa? — La cifra que tienes en la cabeza. Esa.»).
   Diseño = lenguaje visual de /como-trabajamos (oscuro/editorial, General
   Sans, grano, Lenis, reveals .rv); mensaje = la campaña del precio.
   Conversión = formulario de precio en 3 micro-pasos (precio → dónde/qué/
   cuándo → nombre/móvil) → POST /api/lead-tu-precio con dedup de Meta.
   Copy (4 idiomas) en dinos-precio-copy.ts. Animaciones clave por CSS
   (.rv + scroll-timeline) → robustas sin JS (la CSP bloquea eval en dev);
   Lenis/observers solo enriquecen en producción.
   ───────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { useLanguage } from "@/context/LanguageContext";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { captureAttribution, getAttribution, type Attribution } from "@/lib/attribution";
import { siteConfig } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import {
  DP_COPY,
  DP_LANGS,
  DP_MARQUEE,
  TIMELINE_KEYS,
  WHATSAPP,
  proofPairs,
  reviewItems,
  tourInfo,
} from "@/lib/dinos-precio-copy";

const EY = "text-[11px] font-medium uppercase tracking-[0.32em]";
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const WRAP = "mx-auto w-full max-w-[1600px] px-6 lg:px-12 xl:px-24";
const PAD = "py-16 sm:py-24 lg:py-32";

/* Iniciales en mayúscula (regla global), respetando partículas. */
const MINOR = new Set(["de", "del", "la", "las", "los", "le", "i", "y", "o", "en", "d", "da", "di"]);
function capWords(s: string): string {
  let first = true;
  return s.replace(/\p{L}+/gu, (w) => {
    const isFirst = first;
    first = false;
    if (!isFirst && MINOR.has(w.toLocaleLowerCase("es"))) return w;
    return w.charAt(0).toLocaleUpperCase("es") + w.slice(1);
  });
}

function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function fbqTrack(event: string, data: Record<string, unknown>, opts?: Record<string, unknown>) {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    w.fbq?.("track", event, data, opts);
  } catch {}
}

/* ── Scroll suave (Lenis) — enhancement ────────────────────────────── */
function useLenis() {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    ref.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      ref.current = null;
    };
  }, []);
  return ref;
}

function Stars({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 de 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#E8B04B]`}>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" />
        </svg>
      ))}
    </span>
  );
}

/* Subrayado a mano (pincelada) bajo las palabras marcadas — acento editorial
   de la campaña sin depender del color (verde de marca, sutil). */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      className={`absolute left-0 -bottom-1 -z-10 w-full h-[0.42em] ${className}`}
    >
      <path
        d="M4 12 C 70 4, 150 4, 210 9 S 285 15, 296 7"
        fill="none"
        stroke="#3FB98F"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Contador animado para la banda de cifras. SSR pinta el valor final para
   evitar CLS; en cliente cuenta al entrar en vista. */
function CountUp({ value, dec = 0, prefix = "", suffix = "" }: { value: number; dec?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) => v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const t0 = performance.now();
          const dur = 1000;
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            el.textContent = `${prefix}${fmt(value * (1 - Math.pow(1 - p, 3)))}${suffix}`;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dec]);
  return (
    <span ref={ref}>
      {prefix}
      {fmt(value)}
      {suffix}
    </span>
  );
}

/* ── Antes/Después (arrastrar) ─────────────────────────────────────── */
function BeforeAfter({ before, after, room, hint, labelBefore, labelAfter }: { before: string; after: string; room: string; hint: string; labelBefore: string; labelAfter: string }) {
  const [pct, setPct] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const set = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPct(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const stop = () => {
    dragging.current = false;
  };
  return (
    <div>
      <div
        ref={ref}
        data-cursor
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) set(e.clientX);
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        style={{ touchAction: "pan-y" }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden select-none cursor-ew-resize bg-[#0C0B09] rounded-xl lg:rounded-2xl"
      >
        <Image src={after} alt={`${room}, presentada por The Vila Home`} fill sizes="100vw" draggable={false} onDragStart={(e) => e.preventDefault()} className="object-cover" />
        <Image src={before} alt={`${room}, sin cuidar`} fill sizes="100vw" draggable={false} onDragStart={(e) => e.preventDefault()} className="object-cover" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
        <span className={`absolute bottom-4 left-4 sm:bottom-5 sm:left-5 ${EY} text-white/90`}>{labelBefore}</span>
        <span className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 ${EY} text-white`}>{labelAfter}</span>
        <div className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${pct}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16150F" strokeWidth="1.6" className="w-5 h-5">
              <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[13px] text-[#9A958A]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {hint}
      </p>
    </div>
  );
}

/* ── Tour Matterport con activación al toque (evita scroll-trap) ────── */
function TourFrame({ src, activate }: { src: string; activate: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-xl lg:rounded-2xl bg-[#0C0B09] shadow-[0_50px_100px_-50px_rgba(0,0,0,0.6)]">
      {/* sandbox SIN allow-top-navigation: en iPhone el visor intenta navegar
          a matterport.com y te saca de la landing; así queda bloqueado. */}
      <iframe src={src} title="Tour virtual 3D — The Vila Home" loading="lazy" allow="fullscreen; xr-spatial-tracking" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" className={`absolute inset-0 h-full w-full ${active ? "" : "pointer-events-none"}`} />
      {!active && (
        <button type="button" onClick={() => setActive(true)} aria-label={activate} className="absolute inset-0 flex items-end justify-center pb-5 bg-gradient-to-t from-black/40 to-transparent">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 text-[#16150F] text-[13px] font-medium px-5 py-2.5 shadow-lg">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
            {activate}
          </span>
        </button>
      )}
    </div>
  );
}

/* ── Reseña con recorte a 3 líneas + «Leer más» ────────────────────── */
function Quote({ text, author, tag, more, less }: { text: string; author: string; tag: string; more: string; less: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = pRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, [text]);
  return (
    <div>
      <p ref={pRef} className={`tracking-[-0.01em] leading-relaxed text-[18px] sm:text-[20px] lg:text-[23px] text-[#16150F] ${open ? "" : "line-clamp-4"}`}>
        “{text}”
      </p>
      {overflows && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-2 text-[14px] text-[#8A8578] underline underline-offset-4 hover:text-[#16150F] transition-colors">
          {open ? less : more}
        </button>
      )}
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Stars />
        <span className="text-[14px] font-medium text-[#16150F]">{author}</span>
        <span className="text-[12px] text-[#A7A296]">{tag}</span>
      </p>
    </div>
  );
}

/* ── Componente ────────────────────────────────────────────────────── */
export default function DinosPrecio() {
  const { lang, setLang } = useLanguage();
  const c = DP_COPY[lang];
  const f = c.form;
  const { consent } = useCookieConsent();

  const rating = siteConfig.googleReviews.rating.toLocaleString(lang);
  const reviews = reviewItems(lang);
  const pairs = proofPairs(lang);
  const tour = tourInfo(lang);

  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const muniOtroRef = useRef<HTMLInputElement>(null);
  const tipoOtroRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const nombreId = "dp-nombre";

  /* ── Estado UI ── */
  const [scrolled, setScrolled] = useState(false);
  const [cardVisible, setCardVisible] = useState(true);
  const [roomIdx, setRoomIdx] = useState(1); // el salón por defecto
  const [revIdx, setRevIdx] = useState(0);

  /* ── Estado del formulario ── */
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = éxito
  const [priceRaw, setPriceRaw] = useState("");
  const [muni, setMuni] = useState<number | null>(null);
  const [tipo, setTipo] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [muniOtro, setMuniOtro] = useState("");
  const [tipoOtro, setTipoOtro] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [sending, setSending] = useState(false);
  const [errAt, setErrAt] = useState<{ step: number; msg: string } | null>(null);
  const [okSum, setOkSum] = useState("");
  const [waHref, setWaHref] = useState("");

  const isOtroMuni = muni === f.muni.length - 1;
  const isOtroTipo = tipo === f.tipo.length - 1;

  /* ── Efectos ── */
  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // CTA del header solo cuando la tarjeta del formulario no está a la vista.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setCardVisible(es[0].isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-avance del paso 2 al completar las tres respuestas.
  useEffect(() => {
    if (step !== 2 || muni === null || tipo === null || time === null) return;
    if (isOtroMuni && !muniOtro.trim()) return;
    if (isOtroTipo && !tipoOtro.trim()) return;
    const t = setTimeout(() => toStep(3), 420);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muni, tipo, time, muniOtro, tipoOtro]);

  // Foco al nombre al entrar en el paso 3.
  useEffect(() => {
    if (step !== 3) return;
    const t = setTimeout(() => document.getElementById(nombreId)?.focus(), 360);
    return () => clearTimeout(t);
  }, [step]);

  // ViewContent tras consentir marketing (el Provider ya hizo init+PageView).
  const vcSent = useRef(false);
  useEffect(() => {
    if (!consent?.marketing || vcSent.current) return;
    vcSent.current = true;
    const t = setTimeout(() => fbqTrack("ViewContent", { content_name: "tu_precio", content_category: lang }), 80);
    return () => clearTimeout(t);
  }, [consent, lang]);

  // Autoavance del carrusel de reseñas.
  useEffect(() => {
    const t = setInterval(() => setRevIdx((i) => (i + 1) % reviews.length), 6500);
    return () => clearInterval(t);
  }, [reviews.length]);

  /* ── Navegación de pasos ── */
  function err(s: number, msg: string) {
    setErrAt({ step: s, msg });
    window.setTimeout(() => setErrAt((e) => (e?.msg === msg ? null : e)), 3600);
  }
  function scrollToCard(block: ScrollLogicalPosition = "center") {
    cardRef.current?.scrollIntoView({ block, behavior: "smooth" });
  }
  function toStep(n: 1 | 2 | 3) {
    if (n === 2 && !(Number(priceRaw) > 0)) return err(1, f.e1);
    if (n === 3) {
      if (muni === null || tipo === null || time === null) return err(2, f.e2);
      if (isOtroMuni && !muniOtro.trim()) return err(2, f.eMuniOtro);
      if (isOtroTipo && !tipoOtro.trim()) return err(2, f.eTipoOtro);
    }
    setStep(n);
  }
  function selectOpt(kind: "muni" | "tipo" | "time", i: number) {
    if (kind === "muni") {
      setMuni(i);
      if (i === f.muni.length - 1) requestAnimationFrame(() => muniOtroRef.current?.focus());
    } else if (kind === "tipo") {
      setTipo(i);
      if (i === f.tipo.length - 1) requestAnimationFrame(() => tipoOtroRef.current?.focus());
    } else setTime(i);
  }
  function ctaToForm() {
    if (step === 4) return;
    scrollToCard();
    window.setTimeout(() => priceRef.current?.focus(), 480);
  }

  /* ── Envío ── */
  async function submitLead() {
    if (sending) return;
    const name = capWords(nombre.trim());
    const telDigits = tel.replace(/\D/g, "");
    if (!name) return err(3, f.e3a);
    if (telDigits.length < 9) return err(3, f.e3b);
    if (!rgpd) return err(3, f.e3c);
    if (muni === null || tipo === null || time === null) return err(3, f.e2);

    const eventId = newEventId();
    const timeline = TIMELINE_KEYS[time];
    // Valores canónicos ES para el payload, sea cual sea el idioma de la UI.
    const municipio = isOtroMuni ? capWords(muniOtro.trim()) : DP_COPY.es.form.muni[muni];
    const tipoVal = isOtroTipo ? tipoOtro.trim() : DP_COPY.es.form.tipo[tipo];

    const attribution: Attribution = { ...getAttribution() };
    const params = new URLSearchParams(window.location.search);
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const).forEach((k) => {
      const v = params.get(k);
      if (v) attribution[k] = v.slice(0, 200);
    });
    const fbclid = params.get("fbclid");
    if (fbclid) attribution.fbclid = fbclid.slice(0, 300);
    attribution.landing = window.location.pathname;

    const readCookie = (nm: string) =>
      document.cookie.split("; ").find((x) => x.startsWith(`${nm}=`))?.split("=").slice(1).join("=");
    const clickIds = consent?.marketing ? { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") } : {};

    fbqTrack("Lead", { content_name: "tu_precio", content_category: timeline }, { eventID: eventId });

    setSending(true);
    try {
      const res = await fetch("/api/lead-tu-precio", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          precio_esperado: Number(priceRaw),
          municipio,
          tipo: tipoVal,
          timeline,
          nombre: name,
          telefono: telDigits,
          idioma: lang,
          website: hpRef.current?.value ?? "",
          eventId,
          attribution,
          clickIds,
          sourceUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const pFmt = Number(priceRaw).toLocaleString("es-ES");
      const muniShown = isOtroMuni ? capWords(muniOtro.trim()) : f.muni[muni];
      setOkSum(`${f.sumIn} ${pFmt} € · ${muniShown}`);
      setWaHref(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(f.waMsg(pFmt, muniShown))}`);
      setStep(4);
      scrollToCard();
    } catch {
      err(3, f.eSend);
    } finally {
      setSending(false);
    }
  }

  /* ── Precio: formateado con separador de miles ── */
  const priceDisplay = priceRaw ? Number(priceRaw).toLocaleString("es-ES") : "";
  const onPrice = (v: string) => setPriceRaw(v.replace(/\D/g, "").slice(0, 9));

  /* ── Piezas de render ── */
  const opts = (kind: "muni" | "tipo" | "time", labels: string[], sel: number | null) => (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => selectOpt(kind, i)}
          className={`rounded-full px-4 py-2 text-[13px] sm:text-[14px] tracking-[-0.01em] transition-colors duration-200 ring-1 ${
            sel === i ? "bg-[#16150F] text-[#F4F2ED] ring-transparent" : "bg-transparent text-[#5c584e] ring-[#16150F]/20 hover:ring-[#16150F]/50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
  const errLine = (n: number) =>
    errAt?.step === n ? (
      <p role="alert" className="mt-3 text-[13px] font-medium text-[#b0451e]">
        {errAt.msg}
      </p>
    ) : null;

  const total = siteConfig.googleReviews.total;

  return (
    <div ref={rootRef} className="font-gs bg-[#0C0B09] text-[#EFEBE1] antialiased overflow-clip">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "180px" }} />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className={`nav-swap fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3.5 bg-[#F4F2ED]/85 backdrop-blur-xl" : "py-6"}`}>
        <nav className={`${WRAP} flex items-center justify-between`}>
          <a href="/" target="_blank" rel="noopener" aria-label="The Vila Home (se abre en una pestaña nueva)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="nav-logo h-9 sm:h-11 w-auto transition-all duration-500" style={{ filter: scrolled ? "brightness(0)" : "none" }} />
          </a>
          <div className="flex items-center gap-3 sm:gap-4">
            <nav aria-label="Idioma" className={`flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-500 ${scrolled ? "text-[#16150F]" : "text-[#EFEBE1]"}`}>
              {DP_LANGS.map((l) =>
                l === lang ? (
                  <span key={l} aria-current="true" className="px-1.5 py-1 underline underline-offset-[5px] decoration-1">
                    {l}
                  </span>
                ) : (
                  <button key={l} type="button" onClick={() => setLang(l as Lang)} className="px-1.5 py-1 opacity-50 hover:opacity-100 transition-opacity uppercase">
                    {l}
                  </button>
                ),
              )}
            </nav>
            <button type="button" onClick={ctaToForm} className={`nav-cta text-[13px] font-medium tracking-tight rounded-full px-5 py-2.5 transition-all duration-500 ${scrolled ? "bg-[#16150F] text-[#F4F2ED] hover:bg-black" : "bg-white/10 text-[#F4F2ED] ring-1 ring-white/25 backdrop-blur hover:bg-white/20"} ${!cardVisible && step !== 4 ? "" : ""}`}>
              {c.nav.cta}
            </button>
          </div>
        </nav>
      </header>

      {/* ── HERO: mensaje + tarjeta de formulario ───────────────────── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0C0B09] pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24">
        <div className={`${WRAP} grid gap-12 lg:gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center`}>
          {/* Mensaje */}
          <div>
            <p className={`hero-in ${EY} text-[#9A958A]`}>{c.hero.eyebrow}</p>
            <h1 className="hero-in mt-5 font-medium tracking-[-0.03em] leading-[0.98] text-[#F4F2ED] text-[13vw] sm:text-[9vw] lg:text-[5.6rem] [text-wrap:balance]" style={{ animationDelay: "0.08s" }}>
              {c.hero.titlePre}
              <span className="relative z-0 inline-block whitespace-nowrap">
                {c.hero.titleMark}
                <Squiggle className="translate-y-[0.16em]" />
              </span>
              {c.hero.titlePost}
            </h1>
            <div className="hero-in mt-6 text-[#EFEBE1]" style={{ animationDelay: "0.16s" }}>
              <p className="text-[5.4vw] sm:text-[3vw] lg:text-[1.7rem] tracking-[-0.01em] leading-[1.2] text-[#B7B2A6]">{c.hero.sub1}</p>
              <p className="mt-1 inline-block relative z-0 font-medium tracking-[-0.02em] text-[8vw] sm:text-[4.4vw] lg:text-[2.6rem]">
                {c.hero.sub2}
                <Squiggle className="h-[0.3em]" />
              </p>
              <p className="mt-5 max-w-[34ch] text-[15px] lg:text-[17px] leading-relaxed text-[#B7B2A6]">{c.hero.lead}</p>
            </div>
            <div className="hero-in mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "0.24s" }}>
              <span className="flex items-center gap-2 text-[#EFEBE1]">
                <span className="text-xl font-medium tracking-tight">{rating}</span>
                <Stars />
              </span>
              <span className="text-[13px] text-[#9A958A]">{f.trust(rating)}</span>
            </div>
          </div>

          {/* Tarjeta de formulario (clara, destaca sobre el fondo oscuro) */}
          <div ref={cardRef} className="hero-in lg:justify-self-end w-full max-w-[520px] lg:max-w-none" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl lg:rounded-[1.6rem] bg-[#F4F2ED] text-[#16150F] p-6 sm:p-8 shadow-[0_60px_120px_-50px_rgba(0,0,0,0.85)]">
              {/* honeypot */}
              <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              {/* Progreso */}
              {step !== 4 && (
                <div className="mb-6 flex items-center justify-between">
                  <span className={`${EY} text-[#A7A296]`}>{f.stepOf(step)}</span>
                  <span className="flex gap-1.5" aria-hidden>
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={`h-1.5 rounded-full transition-all duration-300 ${n === step ? "w-6 bg-[#16150F]" : n < step ? "w-3 bg-[#16150F]/60" : "w-3 bg-[#16150F]/15"}`} />
                    ))}
                  </span>
                </div>
              )}

              {/* Paso 1 — precio */}
              {step === 1 && (
                <div>
                  <label htmlFor="dp-price" className="block font-medium tracking-[-0.02em] text-[20px] sm:text-[22px] leading-tight">
                    {f.q1}
                  </label>
                  <div className="mt-5 flex items-end gap-2 border-b-2 border-[#16150F]/25 focus-within:border-[#16150F] transition-colors">
                    <input
                      id="dp-price"
                      ref={priceRef}
                      inputMode="numeric"
                      autoComplete="off"
                      value={priceDisplay}
                      onChange={(e) => onPrice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && toStep(2)}
                      placeholder={f.pricePh}
                      className="w-full bg-transparent pb-2 text-[40px] sm:text-[52px] font-medium tracking-[-0.03em] leading-none placeholder:text-[#16150F]/25 outline-none"
                    />
                    <span className="pb-3 text-[26px] sm:text-[32px] font-medium text-[#16150F]/45">{f.priceSuffix}</span>
                  </div>
                  {errLine(1)}
                  <button type="button" onClick={() => toStep(2)} className="mt-7 w-full rounded-full bg-[#16150F] text-[#F4F2ED] text-[16px] font-medium py-4 hover:bg-black transition-colors">
                    {f.next}
                  </button>
                  <p className="mt-3 text-center text-[12px] text-[#A7A296]">{c.hero.micro}</p>
                </div>
              )}

              {/* Paso 2 — dónde / qué / cuándo */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <p className="font-medium tracking-[-0.01em] text-[16px] mb-3">{f.q2a}</p>
                    {opts("muni", f.muni, muni)}
                    {isOtroMuni && (
                      <input ref={muniOtroRef} value={muniOtro} onChange={(e) => setMuniOtro(e.target.value)} placeholder={f.muniOtroPh} aria-label={f.muniOtroL} className="mt-3 w-full rounded-xl bg-white ring-1 ring-[#16150F]/15 focus:ring-[#16150F] px-4 py-3 text-[15px] outline-none transition" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium tracking-[-0.01em] text-[16px] mb-3">{f.q2b}</p>
                    {opts("tipo", f.tipo, tipo)}
                    {isOtroTipo && (
                      <input ref={tipoOtroRef} value={tipoOtro} onChange={(e) => setTipoOtro(e.target.value)} placeholder={f.tipoOtroPh} aria-label={f.tipoOtroL} className="mt-3 w-full rounded-xl bg-white ring-1 ring-[#16150F]/15 focus:ring-[#16150F] px-4 py-3 text-[15px] outline-none transition" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium tracking-[-0.01em] text-[16px] mb-3">{f.q2c}</p>
                    {opts("time", f.time, time)}
                  </div>
                  {errLine(2)}
                  <div className="flex items-center justify-between pt-1">
                    <button type="button" onClick={() => setStep(1)} className="text-[14px] text-[#8A8578] hover:text-[#16150F] transition-colors">
                      {f.back}
                    </button>
                    <button type="button" onClick={() => toStep(3)} className="rounded-full bg-[#16150F] text-[#F4F2ED] text-[15px] font-medium px-7 py-3 hover:bg-black transition-colors">
                      {f.next}
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3 — nombre / móvil / RGPD */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor={nombreId} className="block text-[13px] font-medium text-[#5c584e] mb-1.5">
                      {f.fname}
                    </label>
                    <input id={nombreId} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={f.fnamePh} autoComplete="name" className="w-full rounded-xl bg-white ring-1 ring-[#16150F]/15 focus:ring-[#16150F] px-4 py-3 text-[16px] outline-none transition" />
                  </div>
                  <div>
                    <label htmlFor="dp-tel" className="block text-[13px] font-medium text-[#5c584e] mb-1.5">
                      {f.fphone}
                    </label>
                    <input id="dp-tel" value={tel} onChange={(e) => setTel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitLead()} placeholder={f.fphonePh} inputMode="tel" autoComplete="tel" className="w-full rounded-xl bg-white ring-1 ring-[#16150F]/15 focus:ring-[#16150F] px-4 py-3 text-[16px] outline-none transition" />
                  </div>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input type="checkbox" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#16150F]" />
                    <span className="text-[13px] leading-snug text-[#5c584e]">
                      {f.rgpd}{" "}
                      <a href="/privacidad" target="_blank" rel="noopener" className="text-[#16150F] font-medium underline underline-offset-2 decoration-[#16150F]/40 hover:decoration-[#16150F]">
                        {f.rgpdLink}
                      </a>
                      .
                    </span>
                  </label>
                  {errLine(3)}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button type="button" onClick={() => setStep(2)} className="text-[14px] text-[#8A8578] hover:text-[#16150F] transition-colors shrink-0">
                      {f.back}
                    </button>
                    <button type="button" onClick={submitLead} disabled={sending} className="flex-1 rounded-full bg-[#16150F] text-[#F4F2ED] text-[16px] font-medium py-4 hover:bg-black transition-colors disabled:opacity-70">
                      {sending ? "···" : f.send}
                    </button>
                  </div>
                  <p className="text-[11px] leading-snug text-[#A7A296]">{f.legal}</p>
                </div>
              )}

              {/* Paso 4 — éxito */}
              {step === 4 && (
                <div className="text-center py-4">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16150F] text-[#F4F2ED]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className={`mt-5 ${EY} text-[#A7A296]`}>{f.okKicker}</p>
                  <h3 className="mt-2 font-medium tracking-[-0.03em] text-[34px] leading-none">{f.okh}</h3>
                  {okSum && <p className="mt-4 inline-block rounded-full bg-[#16150F]/5 px-4 py-1.5 text-[14px] font-medium text-[#16150F]">{okSum}</p>}
                  <p className="mt-4 mx-auto max-w-[38ch] text-[15px] leading-relaxed text-[#5c584e]">{f.oktxt}</p>
                  {waHref && (
                    <a href={waHref} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12a150] text-white text-[15px] font-medium px-6 py-3 hover:brightness-95 transition">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.5.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.6-.8c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.1.1.6-.1 1.3Z" />
                      </svg>
                      {f.okwa}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee de zonas vendidas ───────────────────────────────── */}
      <section aria-hidden className="relative bg-[#0C0B09] border-y border-white/5 py-5 overflow-hidden">
        <div className="flex w-max items-center gap-8 animate-[marquee-scroll_40s_linear_infinite] motion-reduce:animate-none">
          {[...DP_MARQUEE, ...DP_MARQUEE].map((z, i) => (
            <span key={i} className="flex items-center gap-8 shrink-0 text-[13px] uppercase tracking-[0.18em] text-[#6F6C64]">
              <span className="text-[#3FB98F]">●</span>
              <span>
                {c.marquee.label} {z}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────────── */}
      <section id="como" className={`relative bg-[#F4F2ED] text-[#16150F] ${PAD} scroll-mt-16`}>
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#A7A296]`}>{c.how.eyebrow}</p>
          <h2 className="rv mt-4 max-w-[20ch] font-medium tracking-[-0.03em] leading-[1.03] text-[8vw] sm:text-[5vw] lg:text-[3.4rem] [text-wrap:balance]">{c.how.title}</h2>
          <div className="rv-slow mt-10 lg:mt-16 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {c.how.steps.map((s) => (
              <div key={s.n} className="border-t border-[#16150F]/12 pt-5">
                <span className="text-[13px] tracking-[0.25em] text-[#A7A296]">{s.n}</span>
                <h3 className="mt-3 text-[20px] lg:text-[23px] font-medium tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-2.5 text-[14px] lg:text-[15px] leading-relaxed text-[#5c584e]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRUEBA: «el resto» (antes/después) ──────────────────────── */}
      <section className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} overflow-hidden`}>
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#9A958A]`}>{c.proof.eyebrow}</p>
          <h2 className="rv mt-4 max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.02] text-[8.4vw] sm:text-[5.2vw] lg:text-[3.5rem] [text-wrap:balance]">{c.proof.title}</h2>
          <p className="rv mt-5 max-w-xl text-[15px] lg:text-[17px] leading-relaxed text-[#B7B2A6]">{c.proof.body}</p>
        </div>
        <div className="rv-slow mt-10 lg:mt-14 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <BeforeAfter before={pairs[roomIdx].mal} after={pairs[roomIdx].bien} room={pairs[roomIdx].room} hint={c.proof.hint} labelBefore={c.proof.labelBefore} labelAfter={c.proof.labelAfter} />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pairs.map((p, i) => (
              <button
                key={p.room}
                type="button"
                onClick={() => setRoomIdx(i)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] sm:text-[13px] tracking-[-0.01em] transition-colors duration-300 ring-1 ${i === roomIdx ? "bg-[#EFEBE1] text-[#16150F] ring-transparent" : "text-[#9A958A] ring-[#3a382f] hover:text-[#EFEBE1]"}`}
              >
                {p.room}
              </button>
            ))}
          </div>

          {/* Tour virtual: el otro pilar de «el resto». Toque para activar. */}
          <div className="mt-14 lg:mt-20 grid gap-8 lg:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className={`${EY} text-[#9A958A]`}>{tour.kicker}</p>
              <h3 className="mt-4 max-w-[14ch] font-medium tracking-[-0.03em] leading-[1.05] text-[7vw] sm:text-[3.6vw] lg:text-[2.4rem] [text-wrap:balance]">{tour.title}</h3>
              <p className="mt-4 max-w-md text-[15px] lg:text-[16px] leading-relaxed text-[#B7B2A6]">{tour.body[0]}</p>
            </div>
            <div>
              <TourFrame src={tour.matterport} activate={tour.activate} />
              <p className="mt-4 text-[13px] text-[#8A8578]">{tour.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIN LETRA PEQUEÑA ───────────────────────────────────────── */}
      <section className={`relative bg-[#F4F2ED] text-[#16150F] ${PAD}`}>
        <div className={WRAP}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={`rv ${EY} text-[#A7A296]`}>{c.honesty.eyebrow}</p>
            <div className="rv mt-6">
              {c.honesty.lines.map((l) => (
                <p key={l} className="text-[#8A8578] font-medium tracking-[-0.02em] leading-[1.25] text-[5.6vw] sm:text-[3.2vw] lg:text-[2rem]">
                  {l}
                </p>
              ))}
              <p className="mt-1 font-medium tracking-[-0.025em] leading-[1.1] text-[8vw] sm:text-[4.6vw] lg:text-[3rem]">{c.honesty.strong}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESEÑAS ─────────────────────────────────────────────────── */}
      <section className={`relative bg-[#F4F2ED] text-[#16150F] border-t border-[#16150F]/10 ${PAD}`}>
        <div className={WRAP}>
          <div className="rv flex items-center gap-3">
            <span className="text-4xl lg:text-5xl font-medium tracking-tight">{rating}</span>
            <div>
              <Stars className="w-4 h-4" />
              <p className="text-[12px] text-[#A7A296] mt-1">{c.reviews.googleLabel} · {total}</p>
            </div>
          </div>
          <div className="rv-slow mt-10 lg:mt-14 max-w-3xl">
            <div key={revIdx}>
              <Quote text={reviews[revIdx].quote} author={reviews[revIdx].name} tag={reviews[revIdx].tag} more={c.reviews.readMore} less={c.reviews.readLess} />
            </div>
            <div className="mt-8 flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} type="button" aria-label={`Reseña ${i + 1}`} onClick={() => setRevIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === revIdx ? "w-6 bg-[#16150F]" : "w-1.5 bg-[#16150F]/25 hover:bg-[#16150F]/45"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EN NÚMEROS ──────────────────────────────────────────────── */}
      <section className={`relative bg-[#0C0B09] text-[#EFEBE1] ${PAD} border-t border-white/5`}>
        <div className={WRAP}>
          <p className={`rv ${EY} text-[#9A958A]`}>{c.stats.eyebrow}</p>
          <div className="rv-slow mt-8 lg:mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {c.stats.items.map((s) => (
              <div key={s.label} className="border-t border-white/10 pt-5">
                <p className="font-medium tracking-[-0.03em] leading-none text-[13vw] sm:text-[6vw] lg:text-[4.2rem]">
                  <CountUp value={s.value} dec={s.dec} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[14px] lg:text-[15px] text-[#B7B2A6]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CIERRE ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0C0B09] text-[#EFEBE1]">
        <Image src="/images/vender/vista-2.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B09] via-[#0C0B09]/80 to-[#0C0B09]" aria-hidden />
        <div className={`relative ${WRAP} ${PAD} text-center`}>
          <p className={`rv ${EY} text-[#9A958A]`}>{c.close.eyebrow}</p>
          <h2 className="rv mt-4 mx-auto max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.02] text-[10vw] sm:text-[6vw] lg:text-[4rem] text-[#F4F2ED] [text-wrap:balance]">{c.close.title}</h2>
          <p className="rv mt-4 text-[5.4vw] sm:text-[3vw] lg:text-[1.7rem] font-medium tracking-[-0.02em] text-[#9A958A]">{c.close.sub}</p>
          <button type="button" onClick={ctaToForm} className="rv mt-9 inline-flex items-center gap-3 rounded-full bg-[#F4F2ED] text-[#16150F] text-[16px] font-medium pl-8 pr-3.5 py-3.5 hover:bg-white transition-colors group">
            {c.close.cta}
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16150F] text-[#F4F2ED] transition-transform duration-500 group-hover:-translate-y-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#F4F2ED]">
        <div className={`${WRAP} py-9 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <a href="/" target="_blank" rel="noopener" aria-label="The Vila Home — inicio (se abre en una pestaña nueva)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="h-8 sm:h-9 w-auto" style={{ filter: "brightness(0)" }} />
          </a>
          {/* Enlaces legales en pestaña nueva: no queremos sacar al visitante
              de la landing de campaña (evitar fugas). */}
          <nav className="flex items-center gap-6 text-[13px]">
            <a href="/aviso-legal" target="_blank" rel="noopener" className="text-[#7d786c] hover:text-[#16150F] transition-colors">
              {c.footer.legal}
            </a>
            <a href="/privacidad" target="_blank" rel="noopener" className="text-[#7d786c] hover:text-[#16150F] transition-colors">
              {c.footer.privacy}
            </a>
            <a href="/cookies" target="_blank" rel="noopener" className="text-[#7d786c] hover:text-[#16150F] transition-colors">
              {c.footer.cookies}
            </a>
          </nav>
          <p className="text-[12px] text-[#A7A296]">© {new Date().getFullYear()} The Vila Home</p>
        </div>
      </footer>
    </div>
  );
}
