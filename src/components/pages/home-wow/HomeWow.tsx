"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /home-wow — LA HOME ESPECTACULAR (prototipo, desde cero)

   PROTOTIPO, noindex. Encargo de Xavi (jul 2026): «desde cero, espectacular,
   moderno, fondo claro». Navegable con /propiedades-wow.

   FEEDBACK APLICADO (25 jul):
   - SIN VERDE: el verde es de uso interno (Ora). Y sin dorados. La página
     es monocroma — crema, tinta y blanco. El acento es el CONTRASTE.
   - Tipos un punto más contenidos: había títulos desproporcionados.
   - El contorno («Real Estate») va en Inter con espaciado 0: con General
     Sans apretada los trazos de letras vecinas se entrelazaban.
   - EL EQUIPO FUERA de la home: para eso está /quienes-somos. (La foto del
     hero se queda: es la misma que la home publicada.)
   - Los «tres puntos» reformulados para convencer (home-wow-copy.ts).

   LAS PIEZAS DEL ESPECTÁCULO:
     1. Hero coreografiado: la foto a sangre se pliega en tarjeta al hacer
        scroll (CSS scroll-driven, clases hw-*; sin soporte → hero clásico).
     2. Marquesina de municipios, relleno y contorno alternados.
     3. Método en tarjetas que se apilan (sticky): blanca, crema y tinta.
     4. Propiedades en carril horizontal (la tarjeta del recorrido).
     5. Cifras que cuentan al entrar + reseñas reales en cinta.
     6. «Hablemos.» grande, pero ya no descomunal.

   DATOS: nada inventado — Google Places real, XML real, i18n real.
   ───────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fillTemplate } from "@/lib/i18n";
import { HOME_CLARO_COPY as C } from "@/lib/home-claro-copy";
import { HOME_WOW_COPY as W } from "@/lib/home-wow-copy";
import Footer from "@/components/layout/Footer";
import NavWow from "@/components/pages/home-wow/NavWow";
import TarjetaPropiedad from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";

const PAPER = "#F7F5EF";
const CARD = "#FFFFFF";
const CARD_CALIDA = "#ECE8DF";
const INK = "#15140F";
const INK_SOFT = "#57534A";
const LINE = "rgba(21,20,15,0.1)";

const EY = "text-[11px] font-medium uppercase tracking-[0.28em]";
const WRAP = "mx-auto w-full max-w-[1480px] px-6 lg:px-12";
const PAD = "py-20 sm:py-24 lg:py-32";

/* Nombres propios: no se traducen. */
const MUNICIPIOS = ["Vilanova i la Geltrú", "Sitges", "Cubelles", "Sant Pere de Ribes", "Canyelles", "El Garraf"];

/* Piel de cada tarjeta del método: blanca, crema cálida y tinta. */
const PIEL = [
  { bg: CARD, fg: INK, soft: INK_SOFT, stroke: INK },
  { bg: CARD_CALIDA, fg: INK, soft: INK_SOFT, stroke: INK },
  { bg: INK, fg: PAPER, soft: "rgba(247,245,239,0.65)", stroke: "#F7F5EF" },
] as const;

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

  const railRef = useRef<HTMLDivElement>(null);
  const rail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth, 880), behavior: "smooth" });
  };

  return (
    <div className="font-gs antialiased" style={{ background: PAPER, color: INK }}>
      <NavWow overHero />

      {/* ── 1 · HERO coreografiado ─────────────────────────────────────── */}
      <section className="hw-runway relative">
        <div className="hw-stage">
          <div className="hw-shrink absolute inset-0 overflow-hidden" style={{ background: INK }}>
            <div className="hw-kb absolute inset-0">
              <Image src="/hero.jpg" alt="El equipo de The Vila Home" fill priority sizes="100vw" quality={75} className="object-cover object-center" />
            </div>
            <div aria-hidden className="absolute inset-0" style={{ background: "rgba(30,22,16,0.36)" }} />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(30,22,16,0.25) 0%, rgba(30,22,16,0) 35%, rgba(30,22,16,0.5) 100%)" }} />

            {/* La nota de Google, dentro de la foto (se pliega con ella). */}
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

          {/* El titular: entra por líneas al cargar, sale al hacer scroll. */}
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

          {/* Los CTA entran cuando la foto ya es tarjeta. */}
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

      {/* ── 2 · Declaración + marquesina ───────────────────────────────── */}
      <section className="pt-20 sm:pt-24 lg:pt-28">
        <div className={WRAP}>
          <p className="rv max-w-[26ch] font-medium tracking-[-0.03em] leading-[1.14] text-[7vw] sm:text-[4.2vw] lg:text-[2.8rem]">
            {C.intro.split(" ").slice(0, 5).join(" ")}{" "}
            <span style={{ color: INK_SOFT }}>{C.intro.split(" ").slice(5).join(" ")}</span>
          </p>
        </div>
        <div aria-hidden className="mt-12 lg:mt-16 overflow-hidden select-none hw-marquee-pause">
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

      {/* ── 3 · POR QUÉ NOSOTROS: tarjetas que se apilan ───────────────── */}
      <section className={PAD}>
        <div className={WRAP}>
          <div className="max-w-[46rem]">
            <p className={`rv ${EY}`} style={{ color: INK_SOFT }}>{W.metodo.label}</p>
            <h2 className="rv mt-5 font-medium tracking-[-0.035em] leading-[0.96] text-[11vw] sm:text-[6vw] lg:text-[3.8rem]">
              {W.metodo.titulo1} <span style={{ color: INK_SOFT }}>{W.metodo.titulo2}</span>
            </h2>
          </div>

          <div className="mt-14 flex flex-col gap-6">
            {W.metodo.pasos.map((paso, i) => {
              const piel = PIEL[i % PIEL.length];
              const cuerpo = fillTemplate(paso.cuerpo, { rating: ratingTxt, reviews: String(totalReviews) });
              return (
                <article
                  key={paso.n}
                  className="sticky rounded-[1.75rem] lg:rounded-[2.25rem] p-8 sm:p-12 lg:p-14 min-h-[48vh] flex flex-col justify-between overflow-hidden"
                  style={{
                    top: `calc(6rem + ${i * 1.25}rem)`,
                    background: piel.bg,
                    color: piel.fg,
                    boxShadow: piel.bg === CARD ? `inset 0 0 0 1px ${LINE}, 0 -12px 40px rgba(21,20,15,0.08)` : "0 -12px 40px rgba(21,20,15,0.12)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute -top-5 right-4 lg:right-10 font-medium leading-none tracking-[-0.04em] text-[6.5rem] lg:text-[10rem] opacity-60"
                    style={{ color: "transparent", WebkitTextStroke: `1.5px ${piel.stroke}` }}
                  >
                    {paso.n}
                  </span>
                  <div className="relative max-w-[22ch]">
                    <h3 className="font-medium tracking-[-0.03em] leading-[1.08] text-[6.5vw] sm:text-[3.6vw] lg:text-[2.5rem]">{paso.titulo}</h3>
                  </div>
                  <p className="relative mt-10 max-w-[52ch] text-[16px] lg:text-[18px] leading-[1.6]" style={{ color: piel.soft }}>
                    {cuerpo}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 · PROPIEDADES: carril deslizable ─────────────────────────── */}
      <section className="pb-8">
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
              {/* Flechas solo con ratón — en táctil se desliza, como en toda la web. */}
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

        {/* El carril sangra hasta el borde de la pantalla. */}
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

      {/* ── 5 · CONFIANZA: cifras + cinta de reseñas ───────────────────── */}
      <section className={PAD}>
        <div className={WRAP}>
          <p className={`rv ${EY}`} style={{ color: INK_SOFT }}>{t("testimonialsLabel")}</p>
          <div className="rv mt-8 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
            <Cifra to={450} prefix="+" label={t("heroFamilies")} />
            <Cifra to={15} prefix="+" label={t("heroYears")} />
            <Cifra to={rating} decimals={1} label={t("testimonialsTitle")} stars />
            <Cifra to={totalReviews} label={t("testimonialsReviews")} />
          </div>
        </div>

        <div className="mt-14 overflow-hidden hw-marquee-pause" style={{ maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
          <div className="hw-marquee-slow flex gap-4 whitespace-normal will-change-transform">
            {[0, 1].map((copia) => (
              <div key={copia} className="flex gap-4 shrink-0 pr-4">
                {reviews.slice(0, 6).map((r, i) => (
                  <figure key={`${copia}-${i}`} className="w-[320px] sm:w-[360px] shrink-0 rounded-2xl p-6 flex flex-col gap-4" style={{ background: CARD, boxShadow: `inset 0 0 0 1px ${LINE}` }}>
                    <Stars />
                    <blockquote className="text-[14px] leading-[1.65] flex-1">
                      <span className="line-clamp-[5]">{r.text}</span>
                    </blockquote>
                    <figcaption className="text-[13px] font-medium" style={{ color: INK_SOFT }}>{r.author}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · CTA final ──────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32 lg:pb-40">
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

/* Cifra que cuenta al entrar en pantalla. El servidor renderiza el valor
   FINAL: sin JS no se pierde nada — la animación es cortesía. */
function Cifra({ to, decimals = 0, prefix = "", label, stars }: {
  to: number; decimals?: number; prefix?: string; label: string; stars?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = (n: number) => prefix + n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const paso = (now: number) => {
        const p = Math.min((now - t0) / 1300, 1);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, decimals, prefix]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <span ref={ref} className="font-medium tracking-[-0.04em] leading-none text-[10vw] sm:text-[5.5vw] lg:text-[3.4rem] tabular-nums">
          {prefix + to.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        </span>
        {stars && <Stars />}
      </div>
      <p className="mt-3 text-[13px] lg:text-[14px]" style={{ color: INK_SOFT }}>{label}</p>
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
