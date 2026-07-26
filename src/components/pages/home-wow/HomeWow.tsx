"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /home-wow — LA INMOBILIARIA QUE PIENSA (prototipo v8)

   PROTOTIPO, noindex. Octava pasada, y esta vez el brief llegó entero
   (26 jul): «tiene que parecer una INMOBILIARIA, premium sin dorado ni
   cursivas ni serif; y que al acabar de leer el vendedor diga: esta
   gente piensa distinto y va a dar a mi casa el valor que corresponde —
   SIN DECIRLO».

   La tesis de esta versión: el «guau» no está en el layout, está en las
   PALABRAS. La página es una inmobiliaria premium reconocible al primer
   segundo (foto grande, valoración, casas, reseñas) y la diferencia la
   llevan tres PRINCIPIOS OPERATIVOS — políticas de trabajo con coste
   («aunque nos cueste el encargo») — que demuestran criterio sin
   autoelogio. Cero "somos los mejores". Cero clichés. Cero cifras
   inventadas: la única cifra es la nota real de Google.

   REGLAS VIGENTES: sin cursivas, sin serif, sin dorado ni verde, sin
   scrolljacking. General Sans + contorno (la letra aprobada). Claro.
   El comparador se queda: es la prueba del método, no un adorno.
   ───────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/layout/Footer";
import NavWow from "@/components/pages/home-wow/NavWow";
import { tipologia } from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";

const PAPEL = "#F7F5F0";
const BLANCO = "#FFFFFF";
const TINTA = "#141210";
const TINTA_SUAVE = "#5B564E";
const FILO = "rgba(20,18,16,0.11)";

const EY = "text-[11px] font-medium uppercase tracking-[0.3em]";
const WRAP = "mx-auto w-full max-w-[1440px] px-6 lg:px-12";

/* ── EL COPY. Aquí está la web. ──────────────────────────────────────
   Principios operativos: hechos de cómo trabajamos, con su coste. El
   lector concluye solo que pensamos distinto — la página no lo dice. */
const PRINCIPIOS = [
  {
    n: "01",
    titulo: "No publicamos el primer día.",
    cuerpo:
      "Una casa que sale mal a la venta se quema en dos semanas, y el mercado no da segundas primeras impresiones. Antes del portal: un precio defendible, fotografía profesional, vídeo, plano y tour. Publicar es el último paso, no el primero.",
  },
  {
    n: "02",
    titulo: "El precio no se promete. Se argumenta.",
    cuerpo:
      "Cualquiera puede decirte la cifra que quieres oír; es la manera más vieja de conseguir un encargo. Nosotros te enseñamos con qué compite tu casa y por cuánto se ha cerrado tu zona. Y si no compartimos tu cifra, te lo decimos — aunque nos cueste el encargo.",
  },
  {
    n: "03",
    titulo: "Menos visitas. Mejores visitas.",
    cuerpo:
      "Tu casa no es una sala de exposiciones, y cada visita te cuesta una tarde. Filtramos antes de abrir tu puerta: quien entra, entra en serio. Presumir de muchas visitas es presumir de hacerte perder el tiempo.",
  },
];

const PRODUCCION = [
  { nombre: "Fotografía profesional", detalle: "La primera visita ocurre en el portal. Que valga." },
  { nombre: "Vídeo", detalle: "La casa contada en movimiento, no en miniaturas." },
  { nombre: "Plano 3D", detalle: "Que se entienda la casa antes de pisarla." },
  { nombre: "Tour virtual", detalle: "Quien pide visita después del tour, viene decidido." },
];

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

  const casas = properties.filter((p) => p.imagenes?.[0]?.url).slice(0, 6);

  return (
    <div className="font-gs antialiased" style={{ background: PAPEL, color: TINTA }}>
      <NavWow overHero />

      {/* ── HERO: inmobiliaria al primer segundo ───────────────────────── */}
      <section className="relative min-h-[92svh] flex items-end overflow-hidden">
        <Image src="/images/vender/vista.jpg" alt="Vivienda en el Garraf" fill priority sizes="100vw" quality={78} className="object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,18,16,0.3) 0%, rgba(20,18,16,0.05) 40%, rgba(20,18,16,0.62) 100%)" }} />

        <div className={`${WRAP} relative pb-14 lg:pb-20 text-white`}>
          <p className={`hero-in ${EY} text-white/70`}>Human Real Estate · Vilanova i la Geltrú · Sitges · el Garraf</p>
          <h1 className="mt-6 max-w-[17ch] font-medium tracking-[-0.035em] leading-[1.0] text-[11.5vw] sm:text-[7.5vw] lg:text-[5.4rem]">
            <span className="hw-mask"><span className="hw-line">Vender bien casi nunca</span></span>
            <span className="hw-mask"><span className="hw-line" style={{ animationDelay: "0.12s" }}>es vender <span className="hw-outline-w">rápido</span>.</span></span>
          </h1>
          <p className="hero-in mt-6 max-w-[46ch] text-[16px] lg:text-[18px] leading-[1.55] text-white/80" style={{ animationDelay: "0.3s" }}>
            Preferimos contarte esto en la primera conversación, no después de firmar el encargo.
          </p>
          <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.4s" }}>
            <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-7 py-3.5 transition-opacity hover:opacity-90" style={{ background: BLANCO, color: TINTA }}>
              {t("heroValueHome")}
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/propiedades-wow" className="inline-flex items-center rounded-full text-[15px] font-medium px-7 py-3.5 text-white transition-colors hover:bg-white/10" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)" }}>
              {t("heroSeeProperties")}
            </Link>
          </div>
          <div className="hero-in mt-8 flex items-center gap-3" style={{ animationDelay: "0.48s" }}>
            <span className="text-[16px] font-medium tracking-tight">{ratingTxt}</span>
            <Stars claras />
            <span className="text-[13px] text-white/70">{totalReviews} {t("heroReviews")}</span>
          </div>
        </div>
      </section>

      {/* ── CÓMO PENSAMOS: los tres principios ─────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className={WRAP}>
          <p className={`rv ${EY}`} style={{ color: TINTA_SUAVE }}>Cómo trabajamos</p>
          <h2 className="rv mt-5 max-w-[24ch] font-medium tracking-[-0.03em] leading-[1.02] text-[9.5vw] sm:text-[5.5vw] lg:text-[3.6rem]">
            Tres decisiones que tomamos antes que tú nos elijas.
          </h2>

          <div className="mt-14 grid lg:grid-cols-3 gap-5">
            {PRINCIPIOS.map((p, i) => (
              <article
                key={p.n}
                className="rv rounded-2xl p-8 lg:p-10 flex flex-col"
                style={{ background: BLANCO, boxShadow: `inset 0 0 0 1px ${FILO}, 0 18px 44px rgba(20,18,16,0.05)`, animationDelay: `${i * 70}ms` }}
              >
                <span className="text-[12px] font-medium tabular-nums" style={{ color: TINTA_SUAVE }}>{p.n}</span>
                <h3 className="mt-5 font-medium tracking-[-0.02em] leading-[1.15] text-[24px] lg:text-[27px]">{p.titulo}</h3>
                <p className="mt-5 text-[15px] lg:text-[15.5px] leading-[1.7]" style={{ color: TINTA_SUAVE }}>{p.cuerpo}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA PRODUCCIÓN: el método demostrado, no contado ────────────── */}
      <section className="py-4 lg:py-8">
        <div className={WRAP}>
          <div className="rounded-[1.75rem] lg:rounded-[2rem] p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" style={{ background: TINTA, color: PAPEL }}>
            <div>
              <p className={`rv ${EY}`} style={{ color: "rgba(247,245,240,0.55)" }}>La producción</p>
              <h2 className="rv mt-5 max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.05] text-[9vw] sm:text-[5vw] lg:text-[3.2rem]">
                Esto no lo decimos. Lo puedes mover con el dedo.
              </h2>
              <div className="mt-10">
                {PRODUCCION.map((m, i) => (
                  <div key={m.nombre} className="rv flex items-baseline gap-5 py-4" style={{ borderTop: "1px solid rgba(247,245,240,0.14)", animationDelay: `${i * 50}ms` }}>
                    <span className="text-[12px] font-medium tabular-nums w-7 shrink-0" style={{ color: "rgba(247,245,240,0.5)" }}>0{i + 1}</span>
                    <div>
                      <p className="text-[16px] font-medium">{m.nombre}</p>
                      <p className="mt-0.5 text-[14px]" style={{ color: "rgba(247,245,240,0.6)" }}>{m.detalle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="rv mt-8 text-[13.5px]" style={{ color: "rgba(247,245,240,0.5)" }}>
                En cada vivienda que vendemos. El salón del comparador es de una de ellas.
              </p>
            </div>
            <div className="rv">
              <AntesDespues mal="/images/vender/salon-mal.png" bien="/images/vender/salon-bien.jpg" chip="Arrastra para comparar" />
            </div>
          </div>
        </div>
      </section>

      {/* ── LAS CASAS ──────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className={WRAP}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`rv ${EY}`} style={{ color: TINTA_SUAVE }}>{t("featuredLabel")}</p>
              <h2 className="rv mt-4 font-medium tracking-[-0.03em] leading-[0.98] text-[10vw] sm:text-[5.5vw] lg:text-[3.4rem]">
                Las casas que lo demuestran.
              </h2>
            </div>
            <Link href="/propiedades-wow" className="rv group inline-flex items-center gap-2 text-[15px] font-medium pb-2">
              {t("featuredSeeAll")}
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {casas.map((p, i) => (
              <Link key={p.ref} href={`/propiedades/${p.slug}`} className="rv group block" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ background: "#E8E4DC" }}>
                  <Image
                    src={p.imagenes[0].url}
                    alt={`${tipologia(p)} en ${p.ciudad ?? ""}`}
                    fill
                    sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                  />
                  {p.estadoFicha === 7 && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="text-white text-[12px] font-medium tracking-[0.28em] uppercase border border-white/70 px-4 py-1.5">
                        {t("cardReserved")}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.85)", color: TINTA, backdropFilter: "blur(8px)" }}>
                    {p.imagenes.length} fotos · plano · tour
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[16.5px] font-medium truncate">{tipologia(p)} · {p.ciudad}</p>
                    {p.zona && <p className="mt-0.5 text-[13px] truncate" style={{ color: TINTA_SUAVE }}>{p.zona}</p>}
                  </div>
                  <p className="text-[16.5px] font-medium shrink-0 tabular-nums">{p.precio?.toLocaleString("es-ES")} €</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA PRUEBA, sin adjetivos propios ───────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className={WRAP}>
          <div className="max-w-[46rem]">
            <p className={`rv ${EY}`} style={{ color: TINTA_SUAVE }}>La parte que no escribimos nosotros</p>
            <h2 className="rv mt-4 font-medium tracking-[-0.03em] leading-[1.0] text-[10vw] sm:text-[5.5vw] lg:text-[3.4rem]">
              {ratingTxt} sobre 5, en {totalReviews} versiones.
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map((r, i) => (
              <figure key={i} className="rv rounded-2xl p-7 flex flex-col gap-5" style={{ background: BLANCO, boxShadow: `inset 0 0 0 1px ${FILO}`, animationDelay: `${i * 70}ms` }}>
                <Stars />
                <blockquote className="text-[15px] leading-[1.7] flex-1">
                  <span className="line-clamp-[7]">{r.text}</span>
                </blockquote>
                <figcaption className="text-[13.5px] font-medium" style={{ color: TINTA_SUAVE }}>
                  {r.author} · reseña de Google
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL CIERRE ──────────────────────────────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className={`${WRAP} text-center`}>
          <h2 className="rv mx-auto max-w-[18ch] font-medium tracking-[-0.035em] leading-[1.0] text-[11vw] sm:text-[7vw] lg:text-[4.6rem]">
            Cuéntanos tu caso.
            <br />
            <span style={{ color: TINTA_SUAVE }}>Sin guion y sin compromiso.</span>
          </h2>
          <p className="rv mt-6 mx-auto max-w-[44ch] text-[16px] lg:text-[18px] leading-[1.6]" style={{ color: TINTA_SUAVE }}>
            No hace falta tenerlo claro para empezar. Si tu casa no está lista para venderse, también te lo diremos.
          </p>
          <div className="rv mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: TINTA, color: PAPEL }}>
              {t("ctaValuate")}
              <ArrowUpRight size={16} />
            </Link>
            <a href="tel:936061800" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${FILO}` }}>
              936 061 800
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Piezas ───────────────────────────────────────────────────────────── */

/* Antes/después arrastrable: el MISMO salón con móvil y producido. */
function AntesDespues({ mal, bien, chip }: { mal: string; bien: string; chip: string }) {
  const [v, setV] = useState(58);
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 select-none">
        <Image src={mal} alt="El salón, con foto de móvil" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={bien} alt="El mismo salón, producido" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        </div>
        <div aria-hidden className="absolute top-0 bottom-0 w-[2px] bg-white shadow" style={{ left: `${v}%` }} />
        <div
          aria-hidden
          className="absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[15px] text-black"
          style={{ left: `${v}%`, top: "50%", transform: "translate(-50%,-50%)" }}
        >
          ⇄
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
          Móvil
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-white/85 text-black backdrop-blur-sm">
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
      <span className="absolute -bottom-3 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg" style={{ background: "#FFF", color: TINTA }}>
        {chip}
      </span>
    </div>
  );
}

/* Estrellas en tinta (o blancas sobre el hero). Sin dorado. */
function Stars({ claras = false }: { claras?: boolean }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={claras ? "#FFFFFF" : TINTA}>
          <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}
