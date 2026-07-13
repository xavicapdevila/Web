"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";
import CountUp from "@/components/ui/CountUp";
import LeadForm from "@/components/vender/LeadForm";
import { siteConfig } from "@/lib/config";
import type { GoogleReview } from "@/lib/googlePlaces";

/* ─────────────────────────────────────────────────────────────────────
   PROTOTIPO /vender-preview — rediseño "por qué somos diferentes".
   Estructura corta y visual (misma en desktop y móvil):
     hero corto → comparación (el golpe visual) → tour 3D real →
     cómo la movemos → reseñas reales → por qué nos eligen →
     banda de cierre + formulario.
   Paleta piedra cálida monocroma (coherente con la landing actual).
   Copy en ES (el i18n a 4 lenguas se hace tras aprobar la estructura).
   ───────────────────────────────────────────────────────────────────── */

const MATTERPORT_URL = "https://my.matterport.com/show/?m=zeLdy8k2NEZ&play=1&qs=1";

const CHANNELS = [
  { src: "/images/portales/idealista.svg", alt: "Idealista" },
  { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
  { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
  { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
  { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
  { src: "/images/portales/luxuryestate.svg", alt: "Luxury Estate" },
  { src: "/images/portales/properstar.svg", alt: "Properstar" },
  { src: "/images/portales/instagram.svg", alt: "Instagram" },
  { src: "/images/portales/tiktok.svg", alt: "TikTok" },
];

/* Parejas de la MISMA habitación: foto "sin cuidar" vs. presentada por nosotros.
   (Fotos reales del mismo inmueble que el tour.) */
const PAIRS = [
  { room: "El comedor", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien.jpg" },
  { room: "El salón", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien.jpg" },
  { room: "El porche", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien.jpg" },
  { room: "La terraza", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien.jpg" },
];

/* Fotos sueltas para el carrusel de "cómo la movemos". */
const SHOWCASE = ["/images/vender/vista.jpg", "/images/vender/entrada.jpg", "/images/vender/jardin.jpg", "/images/vender/salon-bien.jpg", "/images/vender/comedor-bien.jpg", "/images/vender/terraza-bien.jpg"];

const WHY_POINTS = [
  {
    lead: "Te diremos el precio que creemos.",
    body: ["No el que necesitas escuchar para firmar un encargo.", "Porque una expectativa irreal no vende una vivienda. Solo hace perder tiempo."],
  },
  {
    lead: "Si creemos que no somos la mejor opción, te lo diremos.",
    body: ["No queremos vender todas las casas.", "Queremos vender muy bien aquellas en las que realmente podemos aportar valor."],
  },
  {
    lead: "Estar informado no debería ser un favor.",
    body: ["Debería ser lo normal.", "Por eso sabrás qué está ocurriendo con tu vivienda en cada momento."],
  },
  {
    lead: "Preferimos una conversación incómoda hoy… que una decepción dentro de tres meses.",
    body: ["Porque nuestra obligación no es darte siempre la razón.", "Es ayudarte a tomar la mejor decisión."],
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FBBC04]"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" /></svg>
      ))}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#E6E1D6] border border-[#C7BFB0] text-[#1C1913] font-dm-serif text-lg shrink-0">{initials}</div>
  );
}

function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase ${onDark ? "text-[#C9C2B6]" : "text-[#8A8172]"}`}>{children}</p>;
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="The Vila Home" className="h-9 sm:h-10 w-auto" style={dark ? { filter: "brightness(0)" } : undefined} />;
}

/* Tour 3D real (Matterport). Se previsualiza directamente (lazy). */
function TourEmbed() {
  return (
    <div className="relative aspect-video overflow-hidden bg-[#14120C]">
      <iframe
        src={MATTERPORT_URL}
        title="Tour virtual 3D — The Vila Home"
        loading="lazy"
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

/* ── Componente ────────────────────────────────────────────────────── */

interface Props {
  reviews?: GoogleReview[];
  rating?: number;
  totalReviews?: number;
}

export default function VenderPreview({ reviews = [], rating: ratingProp, totalReviews }: Props) {
  const { googleReviews } = siteConfig;
  const gRating = ratingProp ?? googleReviews.rating;
  const gTotal = totalReviews ?? googleReviews.total;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reseñas REALES curadas a mano: la API de Google solo devuelve 5 por
  // "relevancia" (no las últimas), así que elegimos las mejores — todas
  // sobre el trato humano, que es el diferencial.
  const CURATED_REVIEWS = [
    { quote: "Desde el primer día se notó que no son una inmobiliaria más: trato súper cercano, comunicación clara y una forma de trabajar nada común hoy día. El reportaje de la vivienda fue espectacular y marcó la diferencia.", name: "Noelia Nieto", initials: "N", tag: "Reseña en Google" },
    { quote: "He lidiado con varias inmobiliarias a la vez y de verdad que la diferencia es abismal. Trabajan de forma honesta, con empatía y mucha profesionalidad. Nos hemos sentido acompañados en todo momento.", name: "Yolee Seth", initials: "Y", tag: "Reseña en Google" },
    { quote: "El trato fue muy profesional y cercano durante todo el proceso de venta de nuestro piso. Ari fue especialmente amable, siempre atenta y dispuesta a ayudarnos.", name: "Patricia Reyes", initials: "P", tag: "Reseña en Google" },
    { quote: "Ha sido un privilegio contar con ellos para la venta de mi piso. Son súper profesionales y facilitan todo. Recomiendo al 100%: trato cercano y transparente.", name: "Laura Cano", initials: "L", tag: "Reseña en Google" },
    { quote: "Ariadna es súper amable, rápida y conoce mucho todo el proceso. Me sentí súper tranquila de tener a alguien con su experiencia que me asesore. Recomiendo mucho el servicio.", name: "Carmela Castellanos", initials: "C", tag: "Reseña en Google" },
    { quote: "Grans professionals i millors persones. La seva gestió ha estat impecable.", name: "Jordi Pons", initials: "J", tag: "Reseña en Google" },
  ];
  const testimonialCards = CURATED_REVIEWS.length
    ? CURATED_REVIEWS
    : reviews.slice(0, 3).map((r) => ({ quote: r.text, name: r.author, initials: r.author.trim().charAt(0).toUpperCase(), tag: "Reseña en Google" }));

  const WRAP = "w-full max-w-[1400px] mx-auto px-6 lg:px-12";

  return (
    <div className="font-dm-sans bg-[#D9D3C7] text-[#1C1913] min-h-screen antialiased selection:bg-[#1C1913]/20">
      {/* Cinta de prototipo */}
      <div className="fixed bottom-4 left-4 z-[70] rounded-full bg-[#1C1913] text-[#F2EEE6] text-[11px] font-semibold tracking-wide px-3.5 py-1.5 shadow-lg pointer-events-none">
        PROTOTIPO · /vender-preview
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#EEEAE1]/90 backdrop-blur-md border-b border-[#C7BFB0]" : "bg-gradient-to-b from-[#14120C]/90 to-transparent"}`}>
        <nav className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between gap-4">
          <Link href="/" aria-label="The Vila Home — inicio"><Wordmark dark={scrolled} /></Link>
          <a href="#contacto" className={`inline-flex rounded-full text-[13px] font-semibold px-5 py-2.5 transition-colors duration-300 ${scrolled ? "bg-[#1C1913] text-[#F2EEE6] hover:bg-black" : "bg-[#F2EEE6] text-[#14120C] hover:bg-white"}`}>Hablemos</a>
        </nav>
      </header>

      {/* ── HERO (corto) ───────────────────────────────────────────── */}
      <section className="relative min-h-[92svh] flex items-center overflow-hidden bg-[#14120C]">
        <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" className="object-cover object-[68%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14120C] via-[#14120C]/75 to-[#14120C]/40" aria-hidden />
        <div className={`relative ${WRAP} pt-24 pb-16`}>
          <AnimateIn direction="up">
            <Eyebrow onDark>Human Real Estate</Eyebrow>
            <h1 className="font-dm-serif tracking-[-0.01em] mt-5 text-[#F2EEE6] max-w-3xl">
              <span className="block text-[2.4rem] sm:text-[3.2rem] lg:text-[4rem] leading-[1.05]">No necesitas una inmobiliaria.</span>
              <span className="block text-[#C9C2B6] text-[1.3rem] sm:text-[1.55rem] lg:text-[1.85rem] leading-snug mt-3">Necesitas a alguien en quien confiar cuando todo está en juego.</span>
            </h1>
            <div className="mt-7 space-y-4 max-w-2xl">
              <p className="font-light text-lg leading-relaxed text-[#CBC6BB]">Vender una vivienda no consiste en publicar un anuncio. Consiste en gestionar dudas, negociar con criterio, evitar errores y acompañarte en una decisión que probablemente solo tomarás unas pocas veces en la vida.</p>
              <p className="font-light text-lg leading-relaxed text-[#CBC6BB]"><span className="text-[#F2EEE6]">Nosotros no intentamos convencerte.</span> Nos dedicamos a que, cuando llegue el día de firmar, tengas la tranquilidad de saber que cada decisión ha sido la correcta.</p>
            </div>
            <div className="mt-9">
              <a href="#contacto" className="inline-flex rounded-full bg-[#F2EEE6] text-[#14120C] text-base font-semibold px-8 py-4 hover:bg-white transition-colors duration-300">Cuéntanos tu caso</a>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-11">
              <div className="flex items-baseline gap-2">
                <span className="font-dm-serif text-4xl text-[#F2EEE6]"><CountUp target={450} prefix="+" /></span>
                <span className="text-sm text-[#9A9384] max-w-[9rem] leading-tight">familias acompañadas</span>
              </div>
              <span className="hidden sm:block w-px h-10 bg-white/15" aria-hidden />
              <div className="flex items-baseline gap-2">
                <span className="font-dm-serif text-4xl text-[#F2EEE6]">{gRating}</span>
                <span className="text-sm text-[#9A9384] leading-tight flex items-center gap-1"><Stars className="scale-90" /> en Google</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── HUMANO — "esta gente me entiende" ──────────────────────── */}
      <section className="bg-[#E6E1D6] border-b border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>Antes de hablar de tu casa</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.02] mt-4 text-[#1C1913]">La parte difícil nunca ha sido vender una vivienda.</h2>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={120}>
            <div className="mt-8 max-w-2xl space-y-3 font-light text-lg leading-relaxed text-[#5E594F]">
              <p>La parte difícil es decidir si aceptar una oferta.</p>
              <p>Saber si ese es realmente su valor.</p>
              <p>Confiar en que no estás dejando dinero encima de la mesa.</p>
              <p>Tener la tranquilidad de que quien tienes delante piensa en tus intereses antes que en cerrar una operación.</p>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={200}>
            <p className="font-dm-serif text-3xl sm:text-4xl lg:text-[2.4rem] leading-[1.15] text-[#1C1913] mt-12 max-w-3xl">
              Porque una vivienda puede venderse en unas semanas.
              <span className="block text-[#8A8172] text-2xl sm:text-3xl lg:text-[2rem] mt-2">Pero la decisión que tomes te acompañará durante muchos años.</span>
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMPARACIÓN — el golpe visual ──────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>La presentación</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#1C1913]"><span className="text-[#8A8172]">No cambia la vivienda.</span> Cambia lo que transmite.</h2>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={120}>
            <div className="mt-8 max-w-2xl space-y-3 font-light text-lg leading-relaxed text-[#5E594F]">
              <p>Las personas no visitan una casa por sus metros cuadrados.</p>
              <p>La visitan porque, al verla, imaginan su vida dentro.</p>
              <p>Por eso cuidamos cada fotografía, cada encuadre y cada detalle.</p>
              <p>Porque la primera visita siempre ocurre a través de una pantalla.</p>
            </div>
          </AnimateIn>

          {/* Parejas reales: misma habitación, Antes (sin cuidar) vs Después (nosotros) */}
          <div className="grid gap-6 mt-14 max-w-3xl">
            {PAIRS.map((p, i) => (
              <AnimateIn key={p.room} direction="up" delay={(i % 2) * 80}>
                <figure className="rounded-2xl overflow-hidden border border-[#C7BFB0] bg-[#F3F0E8] shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
                  <div className="grid grid-cols-2 gap-[3px] bg-[#C7BFB0]">
                    <div className="relative aspect-[4/3] bg-[#14120C]">
                      <Image src={p.mal} alt={`${p.room}, sin cuidar`} fill sizes="(max-width:768px) 50vw, 384px" className="object-cover [filter:brightness(0.9)_saturate(0.75)]" />
                      <span className="absolute inset-0 bg-[#14120C]/20" aria-hidden />
                      <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold tracking-wide uppercase text-white bg-black/55 backdrop-blur-sm rounded px-2.5 py-1">Antes</span>
                    </div>
                    <div className="relative aspect-[4/3]">
                      <Image src={p.bien} alt={`${p.room}, presentado por The Vila Home`} fill sizes="(max-width:768px) 50vw, 384px" className="object-cover" />
                      <span className="absolute bottom-2.5 right-2.5 text-[11px] font-bold tracking-wide uppercase text-[#14120C] bg-[#F2EEE6] rounded px-2.5 py-1">Después</span>
                    </div>
                  </div>
                  <figcaption className="flex items-center justify-between px-4 py-3.5">
                    <span className="font-dm-serif text-[1.2rem] text-[#1C1913]">{p.room}</span>
                    <span className="text-[12px] text-[#857E70]">Antes, sin cuidar · Después, con nosotros</span>
                  </figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOUR 3D real + plano 3D ────────────────────────────────── */}
      <section className="bg-[#14120C] text-[#F2EEE6]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <div className="grid lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-16 items-center">
            <AnimateIn direction="up">
              <div>
                <Eyebrow onDark>Tour virtual 3D</Eyebrow>
                <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#F2EEE6]">El primer paso ya no es una visita.</h2>
                <div className="mt-6 space-y-3 font-light text-lg leading-relaxed text-[#C9C2B6] max-w-xl">
                  <p>Cuando alguien llama para visitar tu casa, la decisión ya está medio tomada.</p>
                  <p>Hoy los compradores no recorren una vivienda por primera vez al abrir la puerta. Lo hacen desde el sofá, comparando decenas de casas y decidiendo cuáles merecen una visita.</p>
                  <p><span className="text-[#F2EEE6]">Por eso no utilizamos un tour virtual para impresionar.</span> Lo utilizamos para que quien venga a verla ya sepa que puede ser su próxima casa.</p>
                </div>
                <p className="text-[13px] text-[#8B867B] mt-7">Tour real de una vivienda nuestra. Arrástrala y recórrela tú mismo.</p>
              </div>
            </AnimateIn>
            <AnimateIn direction="up" delay={120}>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.7)]">
                <TourEmbed />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Cómo la movemos ────────────────────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>Cómo encontramos al comprador adecuado</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#1C1913]"><span className="text-[#8A8172]">La visibilidad no vende una casa.</span> La atención sí.</h2>
              <div className="mt-8 space-y-4 font-light text-lg leading-relaxed text-[#5E594F]">
                <p>Hoy cualquier inmobiliaria puede publicar una vivienda en los mismos portales. La diferencia no está en dónde aparece.</p>
                <p>Está en conseguir que alguien deje de pasar anuncios y piense:</p>
              </div>
              <p className="font-dm-serif text-3xl sm:text-4xl lg:text-[2.4rem] text-[#1C1913] mt-6">«Quiero vivir aquí.»</p>
              <p className="mt-6 font-light text-lg leading-relaxed text-[#5E594F]">Ese momento dura apenas unos segundos. Y es ahí donde empieza realmente una buena venta.</p>
            </div>
          </AnimateIn>

          <div className="mt-12 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}>
            <div className="flex gap-4 w-max hover:[animation-play-state:paused]" style={{ animation: "marquee-scroll 45s linear infinite" }}>
              {[...SHOWCASE, ...SHOWCASE].map((src, i) => (
                <div key={i} className="relative w-[70vw] sm:w-[42vw] lg:w-[26vw] aspect-[4/3] shrink-0 rounded-2xl overflow-hidden border border-[#C7BFB0]">
                  <Image src={src} alt="" fill sizes="(max-width:640px) 70vw, 26vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 space-y-14 lg:space-y-20">
            {/* 01 — que destaque */}
            <AnimateIn direction="up">
              <div className="grid lg:grid-cols-[auto_1fr] gap-x-8 lg:gap-x-12 gap-y-3">
                <span className="font-dm-serif text-6xl lg:text-7xl text-[#C7BFB0] leading-none">01</span>
                <div className="max-w-2xl">
                  <h3 className="font-dm-serif text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-[#1C1913]">Primero conseguimos que destaque.</h3>
                  <div className="mt-4 space-y-3 font-light text-lg leading-relaxed text-[#5E594F]">
                    <p>Una vivienda solo tiene una oportunidad para causar una primera impresión.</p>
                    <p>Por eso cuidamos cada fotografía, cada vídeo y cada detalle para que, entre decenas de anuncios, la tuya sea la que alguien decida abrir.</p>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* 02 — que llegue más lejos */}
            <AnimateIn direction="up">
              <div className="grid lg:grid-cols-[auto_1fr] gap-x-8 lg:gap-x-12 gap-y-3">
                <span className="font-dm-serif text-6xl lg:text-7xl text-[#C7BFB0] leading-none">02</span>
                <div className="max-w-2xl">
                  <h3 className="font-dm-serif text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-[#1C1913]">Después hacemos que llegue más lejos.</h3>
                  <div className="mt-4 space-y-3 font-light text-lg leading-relaxed text-[#5E594F]">
                    <p>No esperamos a que el comprador aparezca. Movemos tu vivienda allí donde las personas descubren oportunidades antes incluso de empezar a buscarlas.</p>
                    <p>Porque las mejores ventas no siempre nacen de una búsqueda. Muchas empiezan despertando interés.</p>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* 03 — delante de quien puede comprarla (con los portales) */}
            <AnimateIn direction="up">
              <div className="grid lg:grid-cols-[auto_1fr] gap-x-8 lg:gap-x-12 gap-y-3">
                <span className="font-dm-serif text-6xl lg:text-7xl text-[#C7BFB0] leading-none">03</span>
                <div className="max-w-2xl">
                  <h3 className="font-dm-serif text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-[#1C1913]">Y la ponemos delante de quien puede comprarla.</h3>
                  <div className="mt-4 space-y-3 font-light text-lg leading-relaxed text-[#5E594F]">
                    <p>Portales inmobiliarios, campañas, redes sociales y nuestra propia base de compradores.</p>
                    <p>No buscamos miles de personas. Buscamos a la persona adecuada.</p>
                    <p>Porque cuando una vivienda llega a quien realmente la estaba esperando… las decisiones llegan mucho antes.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-5 mt-8 opacity-80">
                    {CHANNELS.filter((c) => c.alt).map((ch) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={ch.alt} src={ch.src} alt={ch.alt} className="h-5 lg:h-6 w-auto object-contain grayscale opacity-70" />
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── En redes (reel) ────────────────────────────────────────── */}
      <section className="bg-[#14120C] text-[#F2EEE6]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            <AnimateIn direction="up">
              <div className="max-w-xl">
                <Eyebrow onDark>En redes</Eyebrow>
                <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#F2EEE6]">No competimos solo con otras viviendas. <span className="text-[#C9C2B6]">Competimos por la atención de las personas.</span></h2>
                <p className="mt-7 font-light text-lg leading-relaxed text-[#C9C2B6]">Cada día alguien hace cientos de gestos automáticos con el dedo.</p>
                <div className="flex items-baseline gap-4 mt-5 font-dm-serif text-3xl">
                  <span className="text-[#F2EEE6]">Desliza.</span>
                  <span className="text-[#8B867B]">Pasa.</span>
                  <span className="text-[#57544D]">Olvida.</span>
                </div>
                <div className="mt-6 space-y-3 font-light text-lg leading-relaxed text-[#C9C2B6]">
                  <p>Nuestro trabajo consiste en conseguir que, durante unos segundos, deje de hacerlo.</p>
                  <p><span className="text-[#F2EEE6]">Porque cuando una vivienda consigue llamar la atención…</span> todo lo demás empieza a ocurrir.</p>
                </div>
                <a href="https://www.instagram.com/p/DV0sxvdDHur/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-[#F2EEE6] underline underline-offset-4 decoration-white/30 hover:decoration-white">Ver en Instagram →</a>
              </div>
            </AnimateIn>
            <AnimateIn direction="up" delay={120}>
              <div className="mx-auto w-full max-w-[290px]">
                <div className="rounded-[2.2rem] border-[7px] border-[#26251F] overflow-hidden bg-black shadow-[0_50px_90px_-40px_rgba(0,0,0,0.7)]">
                  <video src="/images/vender/reel.mp4" className="w-full aspect-[9/16] object-cover bg-black" autoPlay muted loop playsInline controls preload="metadata" />
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Reseñas reales ─────────────────────────────────────────── */}
      <section className="bg-[#D9D3C7]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>Lo que dicen quienes ya han pasado por esto</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#1C1913]"><span className="text-[#8A8172]">No hace falta que nos creas a nosotros.</span> Preferimos que les leas a ellos.</h2>
              <div className="mt-8 max-w-2xl space-y-4 font-light text-lg leading-relaxed text-[#5E594F]">
                <p>Podríamos hablarte de nuestro trabajo, de cómo acompañamos a cada propietario o de la importancia que damos a cada detalle.</p>
                <p>Pero creemos que quien mejor puede explicarlo es quien ya ha vendido su casa con nosotros.</p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={80}>
            <div className="flex items-center gap-3 mt-8">
              <span className="font-dm-serif text-5xl text-[#1C1913] leading-none">{gRating}</span>
              <div><Stars /><p className="text-xs text-[#857E70] mt-1">Opiniones reales en Google</p></div>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonialCards.map((t, i) => (
              <AnimateIn key={`${t.name}-${i}`} direction="up" delay={(i % 3) * 90}>
                <figure className="flex flex-col h-full bg-[#F3F0E8] border border-[#C7BFB0] rounded-2xl p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
                  <Stars />
                  <blockquote className="font-light text-[15px] leading-relaxed text-[#5E594F] mt-5 flex-1">“{t.quote}”</blockquote>
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

      {/* ── Por qué nos eligen / honestidad ────────────────────────── */}
      <section className="bg-[#E6E1D6] border-y border-[#C7BFB0]">
        <div className={`${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-3xl">
              <Eyebrow>Por qué nos eligen</Eyebrow>
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] mt-4 text-[#1C1913]">La confianza no se gana diciendo que sí a todo.</h2>
              <div className="mt-8 max-w-2xl font-light text-lg leading-relaxed text-[#5E594F]">
                <p>Hay muchas formas de vender una casa. <span className="text-[#1C1913]">Nosotros solo conocemos una.</span></p>
                <div className="mt-4 space-y-1.5">
                  <p>La que prioriza tus intereses antes que cerrar una operación.</p>
                  <p>La que dice la verdad, incluso cuando es incómoda.</p>
                  <p>La que entiende que la confianza tarda meses en construirse y segundos en perderse.</p>
                </div>
                <p className="mt-4 text-[#1C1913]">Por eso trabajamos así.</p>
              </div>
            </div>
          </AnimateIn>

          <div className="mt-16 space-y-12 lg:space-y-14 max-w-4xl">
            {WHY_POINTS.map((p, i) => (
              <AnimateIn key={p.lead} direction="up" delay={(i % 2) * 60}>
                <div className="grid lg:grid-cols-[auto_1fr] gap-x-8 lg:gap-x-12 gap-y-2 border-t border-[#C7BFB0] pt-8">
                  <span className="font-dm-serif text-5xl lg:text-6xl text-[#C7BFB0] leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <div className="max-w-2xl">
                    <h3 className="font-dm-serif text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-[#1C1913]">{p.lead}</h3>
                    <div className="mt-3 space-y-2 font-light text-lg leading-relaxed text-[#5E594F]">
                      {p.body.map((b) => <p key={b}>{b}</p>)}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banda de cierre + formulario ───────────────────────────── */}
      <section id="contacto" className="relative bg-[#14120C] text-[#F2EEE6] scroll-mt-20">
        <div className={`relative ${WRAP} py-20 lg:py-28`}>
          <AnimateIn direction="up">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-dm-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] text-[#F2EEE6]">Todo empieza con una conversación.</h2>
              <p className="font-dm-serif text-2xl sm:text-3xl text-[#C9C2B6] mt-3">No con un contrato. Ni con promesas.</p>
              <div className="mt-7 space-y-4 font-light text-lg leading-relaxed text-[#C9C2B6]">
                <p>Solo con una conversación para entender tu situación y explicarte, con total transparencia, cómo enfocaríamos la venta de tu vivienda.</p>
                <p>Si después decides que somos la mejor opción para acompañarte, perfecto. <span className="text-[#F2EEE6]">Y si no, también.</span></p>
                <p><span className="text-[#F2EEE6]">Porque la confianza nunca debería pedirse.</span> Debería ganarse.</p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={120}>
            <div className="max-w-xl mx-auto mt-12">
              <LeadForm source="vender-preview" whatsappOnSuccess submitLabel="Hablemos de tu casa" />
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={200}>
            <div className="max-w-2xl mx-auto text-center mt-16 pt-10 border-t border-white/10">
              <p className="font-dm-serif text-2xl sm:text-3xl lg:text-[2.4rem] leading-[1.15] text-[#F2EEE6]">Ahora la decisión sigue siendo tuya.<br /><span className="text-[#C9C2B6]">Si decides confiar en alguien, nos encantará que sea en nosotros.</span></p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#E6E1D6] border-t border-[#C7BFB0]">
        <div className={`${WRAP} py-12`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" aria-label="The Vila Home — inicio"><Wordmark dark /></Link>
            <nav className="flex items-center gap-7 text-sm text-[#857E70]">
              <Link href="/aviso-legal" className="hover:text-[#1C1913] transition-colors">Aviso legal</Link>
              <Link href="/privacidad" className="hover:text-[#1C1913] transition-colors">Privacidad</Link>
              <Link href="/cookies" className="hover:text-[#1C1913] transition-colors">Cookies</Link>
            </nav>
          </div>
          <p className="text-xs text-[#9A9384] mt-8 text-center md:text-left">© {new Date().getFullYear()} The Vila Home</p>
        </div>
      </footer>
    </div>
  );
}
