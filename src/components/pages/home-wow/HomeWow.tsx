"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /home-wow — LA HOME COMO CINE (prototipo v4)

   PROTOTIPO, noindex. Tras dos pasadas «no es wow», Xavi eligió dirección:
   CINE INMOBILIARIO — cada sección es una escena a pantalla completa, las
   casas son las protagonistas, el texto flota encima y entre escena y
   escena hay cortes de película (barridos horizontales, scroll-driven).

   LA SECUENCIA:
     1. APERTURA — el hero de siempre (INTOCABLE por orden de Xavi): la
        foto del equipo a sangre que se pliega en tarjeta.
     2. Declaración que se enciende palabra a palabra (respiro en crema).
     3. Marquesina de municipios — la cartela de título.
     4. EL TRÁILER — la cartera a pantalla completa: fotos reales de las
        casas a sangre, con barridos de cine entre una y otra, rótulo
        flotante (tipología, zona, precio) y contador de escena.
     5. EL MÉTODO, EN DOS PLANOS — el salón con foto de móvil a sangre;
        barrido; el MISMO salón producido. Y de remate, el comparador
        arrastrable sobre tinta.
     6. LA PRUEBA — escena en tinta: la nota de Google gigante, las
        cifras y las reseñas reales en cinta.
     7. La cartera completa (carril) + «Hablemos.» + footer real.

   Todo el movimiento es CSS scroll-driven (hw-cine-*): sin soporte o con
   reduced-motion cada escena colapsa a un fotograma fijo con su rótulo.
   Grano de película y viñeteado en las escenas fotográficas (hw-grain,
   hw-vignette). Monocromo crema/tinta — sin verde ni dorados.

   DATOS: nada inventado — las fotos del tráiler son la cartera del XML,
   la nota es la de Google Places, el copy vive en home-wow-copy.ts.
   ───────────────────────────────────────────────────────────────────── */

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fillTemplate } from "@/lib/i18n";
import { HOME_CLARO_COPY as C } from "@/lib/home-claro-copy";
import { HOME_WOW_COPY as W } from "@/lib/home-wow-copy";
import Footer from "@/components/layout/Footer";
import NavWow from "@/components/pages/home-wow/NavWow";
import TarjetaPropiedad, { tipologia } from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";

const PAPER = "#F7F5EF";
const INK = "#15140F";
const INK_SOFT = "#57534A";
const LINE = "rgba(21,20,15,0.1)";

const EY = "text-[11px] font-medium uppercase tracking-[0.28em]";
const WRAP = "mx-auto w-full max-w-[1480px] px-6 lg:px-12";

/* Nombres propios: no se traducen. */
const MUNICIPIOS = ["Vilanova i la Geltrú", "Sitges", "Cubelles", "Sant Pere de Ribes", "Canyelles", "El Garraf"];

/* Cuántas casas salen en el tráiler. */
const ESCENAS = 4;

export default function HomeWow({
  rating,
  totalReviews,
  reviews,
  properties,
}: {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  properties: Property[];
}) {
  const { t } = useLanguage();
  const ratingTxt = rating.toLocaleString("es-ES", { minimumFractionDigits: 1 });

  /* Las protagonistas del tráiler: las primeras con foto. */
  const estrellas = properties.filter((p) => p.imagenes?.[0]?.url).slice(0, ESCENAS);

  const railRef = useRef<HTMLDivElement>(null);
  const rail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth, 880), behavior: "smooth" });
  };

  return (
    <div className="font-gs antialiased" style={{ background: PAPER, color: INK }}>
      <NavWow overHero />

      {/* ── ESCENA 1 · Apertura (el hero intocable) ────────────────────── */}
      <section className="hw-runway relative">
        <div className="hw-stage">
          <div className="hw-shrink absolute inset-0 overflow-hidden" style={{ background: INK }}>
            <div className="hw-kb absolute inset-0">
              <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" quality={75} className="object-cover object-center" />
            </div>
            <div aria-hidden className="absolute inset-0" style={{ background: "rgba(30,22,16,0.36)" }} />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(30,22,16,0.25) 0%, rgba(30,22,16,0) 35%, rgba(30,22,16,0.5) 100%)" }} />
            <div
              className="absolute left-[7%] bottom-[10%] flex items-center gap-3 rounded-full px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", color: INK }}
            >
              <span className="text-[17px] font-medium tracking-tight">{ratingTxt}</span>
              <Stars />
              <span className="text-[12.5px] hidden sm:inline" style={{ color: INK_SOFT }}>
                {totalReviews} {t("heroReviews")}
              </span>
            </div>
          </div>

          <div className="hw-heroout absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <p className={`hero-in ${EY} text-white/75`}>{t("heroLocation")}</p>
            <h1 className="mt-6 font-medium tracking-[-0.04em] leading-[0.92] text-[15vw] sm:text-[11vw] lg:text-[9.5rem] text-white">
              <span className="hw-mask"><span className="hw-line">Human</span></span>
              <span className="hw-mask"><span className="hw-line hw-outline-w" style={{ animationDelay: "0.14s" }}>Real Estate</span></span>
            </h1>
            <p className="hero-in mt-8 flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-white/60" style={{ animationDelay: "0.6s" }}>
              <ArrowDown size={13} /> scroll
            </p>
          </div>

          <div className="hw-heroin absolute inset-x-0 bottom-[11%] z-10 flex justify-center gap-3 px-6">
            <Link
              href="/valoracion"
              className="pointer-events-auto inline-flex items-center rounded-full text-[15px] font-medium px-7 py-3.5 transition-opacity hover:opacity-85"
              style={{ background: "#FFF", color: INK }}
            >
              {t("heroValueHome")}
            </Link>
            <Link
              href="/propiedades-wow"
              className="pointer-events-auto inline-flex items-center rounded-full text-[15px] font-medium px-7 py-3.5 text-white transition-colors hover:bg-white/10"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)" }}
            >
              {t("heroSeeProperties")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── ESCENA 2 · Declaración palabra a palabra ───────────────────── */}
      <section className="pt-20 sm:pt-24 lg:pt-28">
        <div className={WRAP}>
          <p className="max-w-[26ch] font-medium tracking-[-0.03em] leading-[1.14] text-[7vw] sm:text-[4.2vw] lg:text-[2.8rem]">
            {C.intro.split(" ").map((palabra, i) => (
              <span
                key={i}
                className="hw-word"
                style={{ animationRange: `entry ${25 + i * 4}% cover ${42 + i * 4}%` } as React.CSSProperties}
              >
                {palabra}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* ── ESCENA 3 · Cartela: la marquesina de municipios ──────────── */}
        <div aria-hidden className="mt-12 lg:mt-16 pb-16 lg:pb-20 overflow-hidden select-none hw-marquee-pause">
          <div className="hw-marquee flex whitespace-nowrap will-change-transform">
            {[0, 1].map((copia) => (
              <div key={copia} className="flex shrink-0 items-center">
                {MUNICIPIOS.map((m, i) => (
                  <span key={`${copia}-${m}`} className="flex items-center">
                    <span
                      className={`px-6 font-medium tracking-[-0.02em] text-[9vw] sm:text-[6vw] lg:text-[4.6rem] leading-[1.2] ${i % 2 ? "hw-outline" : ""}`}
                      style={i % 2 ? undefined : { color: INK }}
                    >
                      {m}
                    </span>
                    <span aria-hidden className="text-[1.3rem] lg:text-[1.7rem]" style={{ color: INK_SOFT }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESCENA 4 · EL TRÁILER: la cartera a pantalla completa ────────
          Un fotograma por casa; entre casa y casa, barrido horizontal.
          El rótulo (tipología, zona, precio) entra y sale con su plano. */}
      <section
        className="hw-cine-runway relative"
        style={{ "--cine-h": `${(estrellas.length + 1) * 100}vh` } as React.CSSProperties}
      >
        <div className="hw-stage hw-grain hw-vignette" style={{ background: INK }}>
          {estrellas.map((p, i) => (
            <div
              key={p.ref}
              className={`absolute inset-0 ${i === 0 ? "" : i % 2 ? "hw-cut-r" : "hw-cut"}`}
              style={i === 0 ? undefined : ({ animationRange: `contain ${i * 25 - 10}% contain ${i * 25}%` } as React.CSSProperties)}
            >
              <Image
                src={p.imagenes[0].url}
                alt={`${tipologia(p)} en ${p.ciudad ?? ""}`}
                fill
                sizes="100vw"
                quality={78}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(21,20,15,0.3) 0%, rgba(21,20,15,0.05) 40%, rgba(21,20,15,0.55) 100%)" }} />
            </div>
          ))}

          {/* Los rótulos, como créditos de película. */}
          {estrellas.map((p, i) => (
            <div
              key={`rotulo-${p.ref}`}
              className={`absolute inset-x-0 bottom-0 z-10 ${i === 0 ? "hw-caption0" : "hw-caption"}`}
              style={{ animationRange: i === 0 ? "contain 0% contain 21%" : `contain ${i * 25 - 6}% contain ${Math.min(i * 25 + 21, 100)}%` } as React.CSSProperties}
            >
              <div className={`${WRAP} pb-10 lg:pb-14 flex flex-wrap items-end justify-between gap-6 text-white`}>
                <div>
                  <p className={`${EY} text-white/60`}>
                    Ahora mismo, en venta · {String(i + 1).padStart(2, "0")}/{String(estrellas.length).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-medium tracking-[-0.03em] leading-[1.02] text-[10vw] sm:text-[6vw] lg:text-[4.2rem]">
                    {tipologia(p)}
                    {p.ciudad ? <span className="text-white/60"> · {p.ciudad}</span> : null}
                  </p>
                  {p.zona && <p className="mt-2 text-[15px] text-white/70">{p.zona}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium tracking-[-0.02em] text-[8vw] sm:text-[4vw] lg:text-[2.6rem]">
                    {p.precio?.toLocaleString("es-ES")} €
                  </span>
                  <Link
                    href={`/propiedades/${p.slug}`}
                    className="pointer-events-auto inline-flex items-center rounded-full text-[14px] font-medium px-6 py-3 transition-opacity hover:opacity-85"
                    style={{ background: "#FFF", color: INK }}
                  >
                    Ver esta casa
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ESCENA 5 · EL MÉTODO, EN DOS PLANOS ────────────────────────── */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className={WRAP}>
          <p className={`rv ${EY}`} style={{ color: INK_SOFT }}>{W.metodo.label}</p>
          <h2 className="rv mt-5 max-w-[24ch] font-medium tracking-[-0.035em] leading-[0.96] text-[11vw] sm:text-[6vw] lg:text-[3.8rem]">
            {W.metodo.titulo1} <span style={{ color: INK_SOFT }}>{W.metodo.titulo2}</span>
          </h2>
        </div>
      </section>

      <section className="hw-cine-runway relative" style={{ "--cine-h": "300vh" } as React.CSSProperties}>
        <div className="hw-stage hw-grain hw-vignette" style={{ background: INK }}>
          {/* Plano 1: la foto de móvil, a sangre. */}
          <div className="absolute inset-0">
            <Image src="/images/vender/salon-mal.png" alt="El salón, con foto de móvil" fill sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(21,20,15,0.35) 0%, rgba(21,20,15,0.1) 40%, rgba(21,20,15,0.6) 100%)" }} />
          </div>
          {/* Plano 2: el MISMO salón, producido — entra con barrido. */}
          <div className="hw-cut absolute inset-0" style={{ animationRange: "contain 35% contain 55%" } as React.CSSProperties}>
            <Image src="/images/vender/salon-bien.jpg" alt="El mismo salón, producido" fill sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(21,20,15,0.3) 0%, rgba(21,20,15,0.05) 40%, rgba(21,20,15,0.5) 100%)" }} />
          </div>

          {/* Rótulos de los dos planos. */}
          <div className="hw-caption0 absolute inset-x-0 bottom-0 z-10" style={{ animationRange: "contain 0% contain 42%" } as React.CSSProperties}>
            <div className={`${WRAP} pb-10 lg:pb-14 max-w-none text-white`}>
              <p className={`${EY} text-white/60`}>{W.metodo.pasos[0].chip}</p>
              <p className="mt-3 max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.05] text-[9vw] sm:text-[5vw] lg:text-[3.6rem]">{W.metodo.pasos[0].titulo}</p>
              <p className="mt-4 max-w-[44ch] text-[15px] lg:text-[17px] leading-[1.6] text-white/75">{W.metodo.pasos[0].cuerpo}</p>
            </div>
          </div>
          <div className="hw-caption absolute inset-x-0 bottom-0 z-10" style={{ animationRange: "contain 38% contain 100%" } as React.CSSProperties}>
            <div className={`${WRAP} pb-10 lg:pb-14 max-w-none text-white`}>
              <p className={`${EY} text-white/60`}>Producción The Vila Home</p>
              <p className="mt-3 max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.05] text-[9vw] sm:text-[5vw] lg:text-[3.6rem]">{W.metodo.pasos[1].titulo}</p>
              <p className="mt-4 max-w-[44ch] text-[15px] lg:text-[17px] leading-[1.6] text-white/75">{W.metodo.pasos[1].cuerpo}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Remate del método: tócalo tú — el comparador sobre tinta. */}
      <section className="py-20 sm:py-24 lg:py-28" style={{ background: INK, color: PAPER }}>
        <div className={`${WRAP} grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center`}>
          <div>
            <p className={`rv ${EY}`} style={{ color: "rgba(247,245,239,0.55)" }}>Compruébalo tú</p>
            <h3 className="rv mt-5 max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.05] text-[9vw] sm:text-[5vw] lg:text-[3.2rem]">
              La diferencia no se cuenta. Se arrastra.
            </h3>
            <p className="rv mt-6 max-w-[44ch] text-[15px] lg:text-[17px] leading-[1.6]" style={{ color: "rgba(247,245,239,0.65)" }}>
              Fotografía profesional, vídeo, plano 3D y tour virtual. Para que quien mira desde el sofá llegue a la visita medio convencido.
            </p>
          </div>
          <div className="rv">
            <AntesDespues mal="/images/vender/salon-mal.png" bien="/images/vender/salon-bien.jpg" chip={W.metodo.pasos[1].chip} />
          </div>
        </div>
      </section>

      {/* ── ESCENA 6 · LA PRUEBA: la nota gigante + reseñas ────────────── */}
      <section className="py-24 sm:py-28 lg:py-36" style={{ background: "#100F0B", color: PAPER }}>
        <div className={`${WRAP} text-center`}>
          <p className={`rv ${EY}`} style={{ color: "rgba(247,245,239,0.55)" }}>{W.metodo.pasos[2].chip}</p>
          <h2 className="rv mt-6 max-w-[20ch] mx-auto font-medium tracking-[-0.035em] leading-[1.0] text-[10vw] sm:text-[6vw] lg:text-[3.8rem]">
            {W.metodo.pasos[2].titulo}
          </h2>
          <div className="rv mt-10 flex items-baseline justify-center gap-4">
            <span className="font-medium tracking-[-0.05em] leading-none text-[34vw] sm:text-[20vw] lg:text-[14rem]">{ratingTxt}</span>
            <span className="text-[18px]" style={{ color: "rgba(247,245,239,0.55)" }}>/ 5</span>
          </div>
          <div className="rv mt-6 flex justify-center [&_svg]:w-5 [&_svg]:h-5 [&_svg]:fill-[#F7F5EF]"><Stars /></div>
          <p className="rv mt-5 text-[15px]" style={{ color: "rgba(247,245,239,0.65)" }}>
            {fillTemplate(W.metodo.pasos[2].cuerpo, { rating: ratingTxt, reviews: String(totalReviews) })}
          </p>
        </div>

        <div className="mt-14 overflow-hidden hw-marquee-pause" style={{ maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
          <div className="hw-marquee-slow flex gap-4 whitespace-normal will-change-transform">
            {[0, 1].map((copia) => (
              <div key={copia} className="flex gap-4 shrink-0 pr-4">
                {reviews.slice(0, 6).map((r, i) => (
                  <figure
                    key={`${copia}-${i}`}
                    className="w-[320px] sm:w-[360px] shrink-0 rounded-2xl p-6 flex flex-col gap-4"
                    style={{ background: "rgba(247,245,239,0.06)", boxShadow: "inset 0 0 0 1px rgba(247,245,239,0.12)" }}
                  >
                    <span className="[&_svg]:fill-[#F7F5EF]"><Stars /></span>
                    <blockquote className="text-[14px] leading-[1.65] flex-1" style={{ color: "rgba(247,245,239,0.85)" }}>
                      <span className="line-clamp-[5]">{r.text}</span>
                    </blockquote>
                    <figcaption className="text-[13px] font-medium" style={{ color: "rgba(247,245,239,0.55)" }}>{r.author}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESCENA 7 · La cartera completa (carril) ────────────────────── */}
      <section className="pt-20 sm:pt-24 lg:pt-28 pb-8">
        <div className={WRAP}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`rv ${EY}`} style={{ color: INK_SOFT }}>{t("featuredLabel")}</p>
              <h2 className="rv mt-4 font-medium tracking-[-0.035em] leading-[0.96] text-[10vw] sm:text-[5.5vw] lg:text-[3.4rem]">
                {t("featuredTitle")}
              </h2>
            </div>
            <div className="rv flex items-center gap-3 pb-2">
              <Link href="/propiedades-wow" className="group inline-flex items-center gap-2 text-[15px] font-medium">
                {t("featuredSeeAll")}
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <div className="hidden [@media(hover:hover)]:flex items-center gap-2 pl-2">
                <button onClick={() => rail(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${LINE}` }}>
                  <ChevronLeft size={17} />
                </button>
                <button onClick={() => rail(1)} aria-label="Siguiente" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${LINE}` }}>
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          className="mt-10 flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain px-6 lg:px-[max(3rem,calc((100vw-1480px)/2+3rem))]"
        >
          {properties.slice(0, 9).map((p, i) => (
            <div key={p.ref} className="w-[80vw] sm:w-[46vw] lg:w-[420px] shrink-0 snap-start">
              <TarjetaPropiedad p={p} delay={i * 40} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 lg:py-40">
        <div className={`${WRAP} text-center`}>
          <p className={`rv ${EY}`} style={{ color: INK_SOFT }}>{t("ctaLabel")}</p>
          <h2 className="rv mt-6 font-medium tracking-[-0.04em] leading-[0.9] text-[14vw] sm:text-[10vw] lg:text-[7rem]">
            {C.cta.titulo}
          </h2>
          <p className="rv mt-7 mx-auto max-w-[38ch] text-[17px] lg:text-[19px] leading-[1.55]" style={{ color: INK_SOFT }}>
            {C.cta.subtitulo}
          </p>
          <div className="rv mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/valoracion" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-85" style={{ background: INK, color: PAPER }}>
              {t("ctaValuate")}
            </Link>
            <Link href="/contacto" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${LINE}` }}>
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Piezas ───────────────────────────────────────────────────────────── */

/* Antes/después arrastrable: el MISMO salón con móvil y producido. El
   control es un <input range> invisible a pantalla completa — funciona
   con dedo y con ratón, y sin JS queda la foto buena medio revelada. */
function AntesDespues({ mal, bien, chip }: { mal: string; bien: string; chip: string }) {
  const [v, setV] = useState(58);
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-black/30 select-none">
        <Image src={mal} alt="El salón, con foto de móvil" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={bien} alt="El mismo salón, producido" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        </div>
        <div aria-hidden className="absolute top-0 bottom-0 w-[2px] bg-white shadow" style={{ left: `${v}%` }} />
        <div
          aria-hidden
          className="absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[15px]"
          style={{ left: `${v}%`, top: "50%", transform: "translate(-50%,-50%)", color: INK }}
        >
          ⇄
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
          Móvil
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm" style={{ color: INK }}>
          Producción
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-label="Comparar foto de móvil con producción profesional"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
      <span className="absolute -bottom-3 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg" style={{ background: PAPER, color: INK }}>
        {chip}
      </span>
    </div>
  );
}

/* Estrellas en tinta: la página es monocroma (el verde es de uso interno). */
function Stars() {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={INK}>
          <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}
