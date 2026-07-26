"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /home-wow — LA GALERÍA NOCTURNA (prototipo v7)

   PROTOTIPO, noindex. Séptima pasada, y un giro de premisa razonado:
   seis versiones CLARAS no han arrancado el «guau»; lo único que Xavi ha
   calificado de espectacular (diagnóstico v2) era OSCURO, y su web actual
   es oscura. La fotografía inmobiliaria explota sobre negro. Así que:
   NEGRO PROFUNDO + hueso + UN acento fuego + Space Grotesk de display.

   Las dos piezas «fuera de lo común» que sostienen la página:
   1. El titular con LA FOTO DENTRO DE LAS LETRAS (background-clip: text):
      «Human» lleva la foto del equipo en el relleno de los glifos.
   2. LA CARTERA COMO ÍNDICE: filas tipográficas enormes (01 · Casa ·
      Sitges · precio) que al pasar el ratón revelan la foto en un marco
      lateral fijo. En móvil, cada fila es una tarjeta con su foto.

   REGLAS VIGENTES (vetos acumulados de Xavi — no romper):
   - Cero cursivas. Cero scrolljacking (solo fundidos de entrada y
     marquesina/sello autónomos). Ni verde ni dorado.
   - «Cambia lo que pone»: el copy es nuevo (esta pasada lo autorizó);
     «Human Real Estate» se conserva como marca — es el claim de la casa.

   DATOS: cartera XML real, Google Places real. El comparador se queda:
   no es adorno, es la demo del negocio.
   ───────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import { LANGS } from "@/lib/i18n";
import { tipologia } from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";
import { Phone } from "lucide-react";

const NOCHE = "#0B0A08";
const NOCHE_2 = "#12100C";
const HUESO = "#EDE6DA";
const HUESO_SUAVE = "rgba(237,230,218,0.55)";
const FUEGO = "#FF4A1F";
const HUMO = "rgba(237,230,218,0.14)";

const EY = "text-[11px] font-medium uppercase tracking-[0.3em]";
const WRAP = "mx-auto w-full max-w-[1480px] px-6 lg:px-12";
const DISPLAY: React.CSSProperties = { fontFamily: "var(--font-grotesk), var(--font-general-sans), sans-serif" };

/* Nombres propios: no se traducen. */
const MUNICIPIOS = ["Vilanova i la Geltrú", "Sitges", "Cubelles", "Sant Pere de Ribes", "Canyelles", "El Garraf"];

const METODO = [
  { n: "01", nombre: "Fotografía profesional", detalle: "Luz, encuadre y orden. La primera impresión, cuidada." },
  { n: "02", nombre: "Vídeo", detalle: "La casa contada en movimiento, no en miniaturas." },
  { n: "03", nombre: "Plano 3D", detalle: "Que se entienda la casa antes de pisarla." },
  { n: "04", nombre: "Tour virtual", detalle: "La primera visita, desde el sofá del comprador." },
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
  const { t, lang, setLang } = useLanguage();
  const ratingTxt = rating.toLocaleString("es-ES", { minimumFractionDigits: 1 });

  const cartera = properties.filter((p) => p.imagenes?.[0]?.url).slice(0, 7);
  const [enfoque, setEnfoque] = useState(0);
  const cita = [...reviews.slice(0, 4)].sort((a, b) => b.text.length - a.text.length)[0];

  return (
    <div className="font-gs antialiased" style={{ background: NOCHE, color: HUESO }}>
      {/* ── Menú propio de la galería (oscuro, mínimo) ─────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl" style={{ background: "rgba(11,10,8,0.72)", borderBottom: `1px solid ${HUMO}` }}>
        <nav className={`${WRAP} h-[72px] flex items-center justify-between gap-6`}>
          <Link href="/home-wow" aria-label="The Vila Home" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="The Vila Home" className="h-8 sm:h-9 w-auto" />
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium" style={{ color: HUESO }}>
            <Link href="/propiedades-wow" className="hover:opacity-60 transition-opacity">{t("navProperties")}</Link>
            <Link href="/quienes-somos" className="hover:opacity-60 transition-opacity">{t("navAbout")}</Link>
            <Link href="/valoracion" className="hover:opacity-60 transition-opacity">{t("navValuation")}</Link>
            <Link href="/blog" className="hover:opacity-60 transition-opacity">{t("navBlog")}</Link>
            <Link href="/contacto" className="hover:opacity-60 transition-opacity">{t("navContact")}</Link>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-1 pr-4" style={{ borderRight: `1px solid ${HUMO}` }}>
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`text-[10px] tracking-widest px-1.5 py-0.5 cursor-pointer transition-opacity ${
                    lang === code ? "opacity-100 underline underline-offset-4" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <a href="tel:936061800" className="hidden md:flex items-center gap-2 text-[13px] hover:opacity-60 transition-opacity">
              <Phone size={13} />
              {siteConfig.phoneDisplay}
            </a>
            <Link href="/valoracion" className="text-[13px] font-medium rounded-full px-5 py-2.5 whitespace-nowrap transition-opacity hover:opacity-90" style={{ background: FUEGO, color: "#FFF" }}>
              {t("heroValueHome")}
            </Link>
          </div>
        </nav>
      </header>

      {/* ── EL TITULAR CON LA FOTO DENTRO ──────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(80rem 40rem at 50% -10%, rgba(255,74,31,0.07), transparent 60%)` }} />
        <div className={`${WRAP} relative text-center`}>
          <p className={`hero-in ${EY}`} style={{ color: HUESO_SUAVE }}>
            {t("heroLocation")}
          </p>

          <h1 className="mt-8 font-bold leading-[0.88] tracking-[-0.03em]" style={DISPLAY}>
            <span className="hw-mask">
              <span className="hw-line hw-cliptext block text-[22vw] sm:text-[17vw] lg:text-[15rem]" style={{ backgroundImage: "url(/hero.jpg)" }}>
                HUMAN
              </span>
            </span>
            <span className="hw-mask">
              <span className="hw-line block text-[8.5vw] sm:text-[6.5vw] lg:text-[5.6rem] mt-1 lg:mt-2" style={{ color: HUESO, animationDelay: "0.14s" }}>
                REAL ESTATE
              </span>
            </span>
          </h1>

          <p className="hero-in mt-9 mx-auto max-w-[42ch] text-[16px] lg:text-[19px] leading-[1.55]" style={{ color: HUESO_SUAVE, animationDelay: "0.32s" }}>
            Las mejores casas de Vilanova, Sitges y el Garraf — producidas, enseñadas y vendidas como merecen.
          </p>

          <div className="hero-in mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.4s" }}>
            <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: FUEGO, color: "#FFF" }}>
              {t("heroValueHome")}
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/propiedades-wow" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-white/5" style={{ boxShadow: `inset 0 0 0 1px ${HUMO}`, color: HUESO }}>
              {t("heroSeeProperties")}
            </Link>
          </div>

          <div className="hero-in mt-9 flex items-center justify-center gap-3" style={{ animationDelay: "0.48s" }}>
            <span className="text-[16px] font-medium tracking-tight">{ratingTxt}</span>
            <Stars />
            <span className="text-[13px]" style={{ color: HUESO_SUAVE }}>
              {totalReviews} {t("heroReviews")}
            </span>
          </div>
        </div>
      </section>

      {/* ── Marquesina en contorno hueso ───────────────────────────────── */}
      <div aria-hidden className="py-6 overflow-hidden select-none hw-marquee-pause" style={{ borderTop: `1px solid ${HUMO}`, borderBottom: `1px solid ${HUMO}` }}>
        <div className="hw-marquee flex whitespace-nowrap will-change-transform items-center">
          {[0, 1].map((copia) => (
            <div key={copia} className="flex shrink-0 items-center">
              {MUNICIPIOS.map((m) => (
                <span key={`${copia}-${m}`} className="flex items-center">
                  <span className="px-7 font-bold uppercase tracking-[-0.01em] text-[7vw] sm:text-[4.5vw] lg:text-[3.2rem] leading-[1.25]" style={{ ...DISPLAY, color: "transparent", WebkitTextStroke: `1px ${HUESO_SUAVE}` }}>
                    {m}
                  </span>
                  <span aria-hidden className="text-[1.1rem]" style={{ color: FUEGO }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── EL ÍNDICE: la cartera como lista tipográfica ───────────────── */}
      <section className="py-16 lg:py-24">
        <div className={WRAP}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`rv ${EY}`} style={{ color: FUEGO }}>Ahora en venta</p>
              <h2 className="rv mt-4 font-bold tracking-[-0.02em] leading-[0.96] text-[11vw] sm:text-[6.5vw] lg:text-[4.2rem]" style={DISPLAY}>
                El índice.
              </h2>
            </div>
            <Link href="/propiedades-wow" className="rv group inline-flex items-center gap-2 text-[15px] font-medium pb-2" style={{ color: HUESO }}>
              {t("featuredSeeAll")}
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: FUEGO }} />
            </Link>
          </div>

          <div className="mt-12 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 items-start">
            {/* Las filas del índice. */}
            <div>
              {cartera.map((p, i) => (
                <Link
                  key={p.ref}
                  href={`/propiedades/${p.slug}`}
                  onMouseEnter={() => setEnfoque(i)}
                  onFocus={() => setEnfoque(i)}
                  className="rv group flex items-baseline gap-4 lg:gap-6 py-5 lg:py-6 transition-colors"
                  style={{ borderTop: `1px solid ${HUMO}`, animationDelay: `${i * 40}ms` }}
                >
                  <span className="text-[12px] font-medium tabular-nums w-7 shrink-0 transition-colors" style={{ color: enfoque === i ? FUEGO : HUESO_SUAVE }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* En móvil la foto va dentro de la fila. */}
                  <span className="relative lg:hidden w-16 h-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.imagenes[0].url} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold tracking-[-0.02em] leading-[1.05] text-[6vw] sm:text-[3.4vw] lg:text-[2.4rem] truncate transition-transform duration-500 lg:group-hover:translate-x-2" style={DISPLAY}>
                      {tipologia(p)} · {p.ciudad}
                    </span>
                    {p.zona && <span className="block mt-1 text-[13px] truncate" style={{ color: HUESO_SUAVE }}>{p.zona}</span>}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-medium tabular-nums text-[4.5vw] sm:text-[2.4vw] lg:text-[1.5rem]" style={{ color: enfoque === i ? FUEGO : HUESO }}>
                      {p.precio?.toLocaleString("es-ES")} €
                    </span>
                    {p.estadoFicha === 7 && (
                      <span className="mt-1 inline-block text-[10px] font-medium tracking-[0.18em] uppercase" style={{ color: FUEGO }}>
                        {t("cardReserved")}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
              <div style={{ borderTop: `1px solid ${HUMO}` }} />
            </div>

            {/* El visor: la foto de la fila enfocada (escritorio). */}
            <div className="rv hidden lg:block sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: NOCHE_2 }}>
                {cartera.map((p, i) => (
                  <Image
                    key={p.ref}
                    src={p.imagenes[0].url}
                    alt={`${tipologia(p)} en ${p.ciudad ?? ""}`}
                    fill
                    sizes="40vw"
                    className="object-cover transition-opacity duration-500"
                    style={{ opacity: enfoque === i ? 1 : 0 }}
                  />
                ))}
                <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(11,10,8,0.6)", color: HUESO, backdropFilter: "blur(8px)" }}>
                  <Camera size={11} style={{ color: FUEGO }} />
                  {cartera[enfoque]?.imagenes.length}
                </span>
                <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[13px] font-medium" style={{ color: HUESO }}>
                  <span>{tipologia(cartera[enfoque])} · {cartera[enfoque]?.ciudad}</span>
                  <span style={{ color: FUEGO }}>{String(enfoque + 1).padStart(2, "0")}/{String(cartera.length).padStart(2, "0")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EL MÉTODO + comparador ─────────────────────────────────────── */}
      <section className="py-16 lg:py-24" style={{ background: NOCHE_2 }}>
        <div className={`${WRAP} grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
          <div>
            <p className={`rv ${EY}`} style={{ color: FUEGO }}>El método</p>
            <h2 className="rv mt-5 max-w-[16ch] font-bold tracking-[-0.02em] leading-[1.0] text-[9.5vw] sm:text-[5.5vw] lg:text-[3.6rem]" style={DISPLAY}>
              Del móvil a la obra.
            </h2>
            <p className="rv mt-5 max-w-[42ch] text-[15px] lg:text-[17px] leading-[1.6]" style={{ color: HUESO_SUAVE }}>
              La mayoría anuncia con ocho fotos de móvil. Nosotros producimos cada casa — y esa es la diferencia entre esperar comprador y elegirlo.
            </p>
            <div className="mt-9">
              {METODO.map((m) => (
                <div key={m.n} className="rv flex items-baseline gap-5 py-4" style={{ borderTop: `1px solid ${HUMO}` }}>
                  <span className="text-[13px] font-medium tabular-nums w-8 shrink-0" style={{ color: FUEGO }}>{m.n}</span>
                  <div>
                    <p className="text-[16px] font-medium">{m.nombre}</p>
                    <p className="mt-0.5 text-[14px]" style={{ color: HUESO_SUAVE }}>{m.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rv">
            <AntesDespues mal="/images/vender/salon-mal.png" bien="/images/vender/salon-bien.jpg" chip="Arrastra para comparar" />
          </div>
        </div>
      </section>

      {/* ── LA PRUEBA ──────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className={`${WRAP} max-w-[62rem] text-center`}>
          <p className={`rv ${EY}`} style={{ color: FUEGO }}>Palabra de cliente</p>
          {cita && (
            <>
              <blockquote className="rv mt-8 font-bold leading-[1.25] tracking-[-0.01em] text-[5.5vw] sm:text-[3.2vw] lg:text-[2.1rem]" style={DISPLAY}>
                <span className="line-clamp-[6]">“{cita.text}”</span>
              </blockquote>
              <figcaption className="rv mt-7 flex items-center justify-center gap-3">
                <Stars />
                <span className="text-[14px] font-medium">{cita.author}</span>
              </figcaption>
            </>
          )}
          <p className="rv mt-8 text-[14px]" style={{ color: HUESO_SUAVE }}>
            <span className="font-medium" style={{ color: FUEGO }}>{ratingTxt} / 5</span> · {totalReviews} {t("heroReviews")}
          </p>
        </div>
      </section>

      {/* ── ¿CUÁNTO VALE LA TUYA? — foto a sangre ──────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[70svh] flex items-center">
          <Image src="/images/vender/terraza-bien.jpg" alt="Terraza producida por The Vila Home" fill sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(11,10,8,0.85) 0%, rgba(11,10,8,0.35) 60%, rgba(11,10,8,0.15) 100%)" }} />
          <div className={`${WRAP} relative py-20`}>
            <p className={`rv ${EY}`} style={{ color: FUEGO }}>¿Vendes?</p>
            <h2 className="rv mt-5 max-w-[14ch] font-bold tracking-[-0.02em] leading-[0.98] text-[11vw] sm:text-[7vw] lg:text-[4.6rem]" style={DISPLAY}>
              ¿Cuánto vale la tuya?
            </h2>
            <p className="rv mt-5 max-w-[36ch] text-[16px] lg:text-[18px] leading-[1.55]" style={{ color: "rgba(237,230,218,0.75)" }}>
              No hace falta tenerlo claro para empezar. Empieza por el número.
            </p>
            <div className="rv mt-9 flex flex-wrap gap-3">
              <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: FUEGO, color: "#FFF" }}>
                {t("ctaValuate")}
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/contacto" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-white/10" style={{ boxShadow: "inset 0 0 0 1px rgba(237,230,218,0.4)", color: HUESO }}>
                {t("ctaContact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HABLEMOS ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className={`${WRAP} text-center`}>
          <h2 className="rv font-bold uppercase tracking-[-0.02em] leading-[0.9] text-[16vw] sm:text-[12vw] lg:text-[9rem]" style={{ ...DISPLAY, color: "transparent", WebkitTextStroke: `1.5px ${HUESO}` }}>
            Hablemos
          </h2>
          <p className="rv mt-7 mx-auto max-w-[38ch] text-[16px] lg:text-[19px] leading-[1.55]" style={{ color: HUESO_SUAVE }}>
            No hace falta tenerlo claro para empezar.
          </p>
          <div className="rv mt-9 flex flex-wrap justify-center gap-3">
            <a href="tel:936061800" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: HUESO, color: NOCHE }}>
              936 061 800
            </a>
            <Link href="/contacto" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-white/5" style={{ boxShadow: `inset 0 0 0 1px ${HUMO}`, color: HUESO }}>
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

/* Antes/después arrastrable: el MISMO salón con móvil y producido. */
function AntesDespues({ mal, bien, chip }: { mal: string; bien: string; chip: string }) {
  const [v, setV] = useState(58);
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/50 select-none">
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
      <span className="absolute -bottom-3 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg" style={{ background: FUEGO, color: "#FFF" }}>
        {chip}
      </span>
    </div>
  );
}

/* Estrellas en fuego: el único color de la galería. */
function Stars() {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={FUEGO}>
          <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}
