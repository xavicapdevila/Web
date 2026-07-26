"use client";

/* ─────────────────────────────────────────────────────────────────────
   THE VILA HOME · /home-wow — EL DOSSIER (prototipo v6)

   PROTOTIPO, noindex. Sexta pasada. Las reglas que han quedado grabadas
   del proceso con Xavi:
   - CURSIVAS PROHIBIDAS («las odio»). Nada de serif itálica.
   - La letra buena es la de antes: General Sans + «Real Estate» en
     contorno (Inter, tracking 0 — hw-outline).
   - Sin scrolljacking: el movimiento no persigue el dedo. Lo que se
     mueve, se mueve solo y despacio (marquesina, sello giratorio).
   - «Dale una vuelta a los colores»: entra el TEJA (#BC5233) — el color
     de los tejados mediterráneos. Ni verde (interno) ni dorado (cliché).
     Ritmo de fondos: crema → blanco → chocolate → teja.
   - «Que se diga: guau, qué web más trabajada»: densidad de OFICIO.
     Números de sección, esquinas marcadas, chips, tarjetas flotantes,
     sello circular giratorio, bento de fotos. Capas, no minimalismo.

   El titular "Human Real Estate" es INTOCABLE (el texto).
   DATOS: cartera XML real, Google Places real, copy de Xavi.
   ───────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { HOME_CLARO_COPY as C } from "@/lib/home-claro-copy";
import Footer from "@/components/layout/Footer";
import NavWow from "@/components/pages/home-wow/NavWow";
import { tipologia } from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";

const CREMA = "#F5F0E7";
const BLANCO = "#FFFFFF";
const TINTA = "#16120E";
const TINTA_SUAVE = "#5A5348";
const CHOCO = "#221A14";
const TEJA = "#BC5233";
const FILO = "rgba(22,18,14,0.12)";

const EY = "text-[11px] font-medium uppercase tracking-[0.28em]";
const WRAP = "mx-auto w-full max-w-[1480px] px-6 lg:px-12";

/* Nombres propios: no se traducen. */
const MUNICIPIOS = ["Vilanova i la Geltrú", "Sitges", "Cubelles", "Sant Pere de Ribes", "Canyelles", "El Garraf"];

const METODO = [
  { n: "01", nombre: "Fotografía profesional", detalle: "Luz, encuadre y orden. La primera impresión, cuidada." },
  { n: "02", nombre: "Vídeo", detalle: "La casa contada en movimiento, no en miniaturas." },
  { n: "03", nombre: "Plano 3D", detalle: "Que se entienda la casa antes de pisarla." },
  { n: "04", nombre: "Tour virtual", detalle: "La primera visita, desde el sofá del comprador." },
];

/* Cabecera de sección numerada — el detalle de dossier que se repite. */
function Rotulo({ n, children, claro = false }: { n: string; children: React.ReactNode; claro?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="text-[11px] font-medium tabular-nums px-2.5 py-1 rounded-full"
        style={{ color: claro ? CREMA : TEJA, boxShadow: `inset 0 0 0 1px ${claro ? "rgba(245,240,231,0.35)" : TEJA}` }}
      >
        {n}
      </span>
      <span className={EY} style={{ color: claro ? "rgba(245,240,231,0.6)" : TINTA_SUAVE }}>{children}</span>
      <span aria-hidden className="flex-1 h-px" style={{ background: claro ? "rgba(245,240,231,0.2)" : FILO }} />
    </div>
  );
}

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

  const conFoto = properties.filter((p) => p.imagenes?.[0]?.url);
  const flotantes = conFoto.slice(0, 2);
  const bento = conFoto.slice(0, 6);

  return (
    <div className="font-gs antialiased" style={{ background: CREMA, color: TINTA }}>
      <NavWow />

      {/* ── (00) EL HERO-DOSSIER ───────────────────────────────────────── */}
      <section className="relative pt-36 lg:pt-44 pb-16 overflow-hidden">
        {/* Marco de taller: esquinas marcadas del lienzo. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 lg:inset-x-12 top-28 bottom-6 hidden sm:block">
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos) => (
            <span key={pos} className={`absolute w-6 h-6 ${pos}`} style={{ borderColor: TEJA }} />
          ))}
        </div>

        <div className={`${WRAP} relative text-center`}>
          <p className={`hero-in ${EY}`} style={{ color: TINTA_SUAVE }}>{t("heroLocation")}</p>

          <h1 className="mt-8 font-medium tracking-[-0.04em] leading-[0.9] text-[16vw] sm:text-[12vw] lg:text-[10rem]">
            <span className="hw-mask"><span className="hw-line">Human</span></span>
            <span className="hw-mask"><span className="hw-line hw-outline" style={{ animationDelay: "0.14s" }}>Real Estate</span></span>
          </h1>

          <p className="hero-in mt-8 mx-auto max-w-[36ch] text-[17px] lg:text-[19px] leading-[1.55]" style={{ color: TINTA_SUAVE, animationDelay: "0.3s" }}>
            {C.intro}
          </p>

          <div className="hero-in mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.38s" }}>
            <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-7 py-3.5 transition-opacity hover:opacity-90" style={{ background: TEJA, color: "#FFF" }}>
              {t("heroValueHome")}
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/propiedades-wow" className="inline-flex items-center rounded-full text-[15px] font-medium px-7 py-3.5 transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${FILO}` }}>
              {t("heroSeeProperties")}
            </Link>
          </div>

          <div className="hero-in mt-8 flex items-center justify-center gap-3" style={{ animationDelay: "0.46s" }}>
            <span className="text-[16px] font-medium tracking-tight">{ratingTxt}</span>
            <Stars />
            <span className="text-[13px]" style={{ color: TINTA_SUAVE }}>
              {totalReviews} {t("heroReviews")}
            </span>
          </div>

          {/* Las tarjetas flotantes: dos casas reales asomadas al hero. */}
          {flotantes[0] && (
            <Link
              href={`/propiedades/${flotantes[0].slug}`}
              className="hero-in group absolute hidden lg:block left-0 top-[46%] w-[230px] -rotate-[5deg] transition-transform duration-500 hover:-rotate-[2deg] hover:scale-[1.03]"
              style={{ animationDelay: "0.5s" }}
            >
              <span className="block rounded-2xl p-2.5 pb-3 shadow-xl shadow-black/15" style={{ background: BLANCO }}>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={flotantes[0].imagenes[0].url} alt={tipologia(flotantes[0])} fill sizes="230px" className="object-cover" />
                </span>
                <span className="mt-2.5 flex items-center justify-between px-1 text-[12.5px] font-medium">
                  <span>{tipologia(flotantes[0])} · {flotantes[0].ciudad}</span>
                  <span style={{ color: TEJA }}>{flotantes[0].precio?.toLocaleString("es-ES")} €</span>
                </span>
              </span>
            </Link>
          )}
          {flotantes[1] && (
            <Link
              href={`/propiedades/${flotantes[1].slug}`}
              className="hero-in group absolute hidden lg:block right-0 top-[24%] w-[230px] rotate-[4deg] transition-transform duration-500 hover:rotate-[1deg] hover:scale-[1.03]"
              style={{ animationDelay: "0.58s" }}
            >
              <span className="block rounded-2xl p-2.5 pb-3 shadow-xl shadow-black/15" style={{ background: BLANCO }}>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={flotantes[1].imagenes[0].url} alt={tipologia(flotantes[1])} fill sizes="230px" className="object-cover" />
                </span>
                <span className="mt-2.5 flex items-center justify-between px-1 text-[12.5px] font-medium">
                  <span>{tipologia(flotantes[1])} · {flotantes[1].ciudad}</span>
                  <span style={{ color: TEJA }}>{flotantes[1].precio?.toLocaleString("es-ES")} €</span>
                </span>
              </span>
            </Link>
          )}

          {/* El sello giratorio — la firma de acabado. */}
          <div aria-hidden className="hero-in absolute right-2 lg:right-10 -bottom-2 hidden sm:block" style={{ animationDelay: "0.66s" }}>
            <div className="hw-spin relative w-[110px] h-[110px]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path id="hwCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text style={{ fontSize: "10.5px", letterSpacing: "2.6px", fill: TINTA }}>
                  <textPath href="#hwCircle">HUMAN REAL ESTATE · THE VILA HOME ·</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[20px]" style={{ color: TEJA }}>✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── La cinta teja: el golpe de color ───────────────────────────── */}
      <div aria-hidden className="overflow-hidden select-none hw-marquee-pause py-4" style={{ background: TEJA, color: "#FFF" }}>
        <div className="hw-marquee flex whitespace-nowrap will-change-transform">
          {[0, 1].map((copia) => (
            <div key={copia} className="flex shrink-0 items-center">
              {MUNICIPIOS.map((m) => (
                <span key={`${copia}-${m}`} className="flex items-center gap-6 pr-6">
                  <span className="text-[15px] font-medium tracking-[0.08em] uppercase">{m}</span>
                  <span aria-hidden className="text-[11px] opacity-70">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── (01) LA CARTERA: bento de fotos ────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className={WRAP}>
          <Rotulo n="01">La cartera</Rotulo>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <h2 className="rv font-medium tracking-[-0.035em] leading-[0.96] text-[11vw] sm:text-[6vw] lg:text-[3.8rem]">
              {t("featuredTitle")}
            </h2>
            <Link href="/propiedades-wow" className="rv group inline-flex items-center gap-2 text-[15px] font-medium pb-2" style={{ color: TEJA }}>
              {t("featuredSeeAll")}
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Bento: 2 grandes + 4 medianas, todas con sus chips de oficio. */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {bento.map((p, i) => {
              const grande = i < 2;
              return (
                <Link
                  key={p.ref}
                  href={`/propiedades/${p.slug}`}
                  className={`rv group relative overflow-hidden rounded-2xl lg:rounded-[1.25rem] ${grande ? "col-span-2 aspect-[16/10]" : "col-span-1 aspect-[4/5] sm:aspect-[4/4]"}`}
                  style={{ animationDelay: `${(i % 4) * 60}ms`, background: "#E9E2D5" }}
                >
                  <Image
                    src={p.imagenes[0].url}
                    alt={`${tipologia(p)} en ${p.ciudad ?? ""}`}
                    fill
                    sizes={grande ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(22,18,14,0) 50%, rgba(22,18,14,0.55) 100%)" }} />

                  {/* Chips de oficio: nº de fotos arriba, datos abajo. */}
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(22,18,14,0.55)", backdropFilter: "blur(8px)" }}>
                    <Camera size={11} />
                    {p.imagenes.length}
                  </span>
                  {p.estadoFicha === 7 && (
                    <span className="absolute top-3 right-3 text-[10px] font-medium tracking-[0.18em] uppercase px-2.5 py-1 rounded-full" style={{ background: TEJA, color: "#FFF" }}>
                      {t("cardReserved")}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 flex items-end justify-between gap-3 text-white">
                    <div>
                      <p className={`font-medium ${grande ? "text-[19px]" : "text-[15px]"}`}>
                        {tipologia(p)} · {p.ciudad}
                      </p>
                      {p.zona && grande && <p className="mt-0.5 text-[12.5px] text-white/70">{p.zona}</p>}
                    </div>
                    <p className={`font-medium shrink-0 ${grande ? "text-[19px]" : "text-[14px]"}`}>{p.precio?.toLocaleString("es-ES")} €</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── (02) EL MÉTODO — bloque chocolate con el comparador ────────── */}
      <section className="py-8 lg:py-12">
        <div className={WRAP}>
          <div className="rounded-[1.75rem] lg:rounded-[2.25rem] p-8 sm:p-12 lg:p-16" style={{ background: CHOCO, color: CREMA }}>
            <Rotulo n="02" claro>Nuestro método</Rotulo>
            <div className="mt-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="rv max-w-[16ch] font-medium tracking-[-0.03em] leading-[1.04] text-[9vw] sm:text-[5.5vw] lg:text-[3.4rem]">
                  Tu casa, producida <span style={{ color: TEJA }}>como se merece.</span>
                </h2>
                <div className="mt-10">
                  {METODO.map((m) => (
                    <div key={m.n} className="rv flex items-baseline gap-5 py-4" style={{ borderTop: "1px solid rgba(245,240,231,0.15)" }}>
                      <span className="text-[13px] font-medium tabular-nums w-8 shrink-0" style={{ color: TEJA }}>{m.n}</span>
                      <div>
                        <p className="text-[16px] font-medium">{m.nombre}</p>
                        <p className="mt-0.5 text-[14px]" style={{ color: "rgba(245,240,231,0.6)" }}>{m.detalle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rv">
                <AntesDespues mal="/images/vender/salon-mal.png" bien="/images/vender/salon-bien.jpg" chip="Arrastra para comparar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── (03) LA PRUEBA: reseñas como fichas apiladas ───────────────── */}
      <section className="py-16 lg:py-24">
        <div className={WRAP}>
          <Rotulo n="03">La prueba</Rotulo>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <h2 className="rv max-w-[22ch] font-medium tracking-[-0.035em] leading-[0.98] text-[10vw] sm:text-[5.5vw] lg:text-[3.4rem]">
              No nos creas a nosotros.
            </h2>
            <div className="rv flex items-center gap-3 pb-2">
              <span className="font-medium tracking-[-0.03em] text-[2.2rem] leading-none">{ratingTxt}</span>
              <Stars />
              <span className="text-[13px]" style={{ color: TINTA_SUAVE }}>
                {totalReviews} {t("heroReviews")}
              </span>
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map((r, i) => (
              <figure
                key={i}
                className={`rv rounded-2xl p-7 flex flex-col gap-5 shadow-lg shadow-black/5 ${i === 1 ? "sm:-rotate-1 sm:translate-y-3" : i === 2 ? "sm:rotate-1" : "sm:-translate-y-1"}`}
                style={{ background: BLANCO, boxShadow: `inset 0 0 0 1px ${FILO}, 0 14px 34px rgba(22,18,14,0.07)`, animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Stars />
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: TEJA }}>Google</span>
                </div>
                <blockquote className="text-[15px] leading-[1.65] flex-1">
                  <span className="line-clamp-[7]">{r.text}</span>
                </blockquote>
                <figcaption className="text-[13.5px] font-medium" style={{ color: TINTA_SUAVE }}>{r.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── (04) ¿VENDES? — la banda teja ──────────────────────────────── */}
      <section className="py-8 lg:py-12">
        <div className={WRAP}>
          <div className="relative overflow-hidden rounded-[1.75rem] lg:rounded-[2.25rem] p-8 sm:p-12 lg:p-16" style={{ background: TEJA, color: "#FFF" }}>
            <span aria-hidden className="absolute -right-10 -top-16 font-medium leading-none tracking-[-0.04em] text-[14rem] lg:text-[20rem] opacity-[0.12] select-none">
              ✦
            </span>
            <Rotulo n="04" claro>{t("ctaLabel")}</Rotulo>
            <div className="mt-10 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 items-center">
              <div>
                <h2 className="rv max-w-[18ch] font-medium tracking-[-0.03em] leading-[1.0] text-[10vw] sm:text-[6vw] lg:text-[4rem]">
                  Empieza por saber cuánto vale.
                </h2>
                <p className="rv mt-5 max-w-[40ch] text-[16px] lg:text-[18px] leading-[1.55] text-white/80">
                  {C.cta.subtitulo}
                </p>
              </div>
              <div className="rv flex flex-wrap lg:justify-end gap-3">
                <Link href="/valoracion" className="inline-flex items-center gap-2 rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: TINTA, color: CREMA }}>
                  {t("ctaValuate")}
                  <ArrowUpRight size={16} />
                </Link>
                <Link href="/contacto" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 text-white transition-colors hover:bg-white/10" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)" }}>
                  {t("ctaContact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hablemos ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className={`${WRAP} text-center`}>
          <h2 className="rv font-medium tracking-[-0.04em] leading-[0.9] text-[15vw] sm:text-[10vw] lg:text-[7rem]">
            <span className="hw-outline">{C.cta.titulo}</span>
          </h2>
          <p className="rv mt-6 mx-auto max-w-[38ch] text-[17px] lg:text-[19px] leading-[1.55]" style={{ color: TINTA_SUAVE }}>
            {C.cta.subtitulo}
          </p>
          <div className="rv mt-9 flex flex-wrap justify-center gap-3">
            <a href="tel:936061800" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-opacity hover:opacity-90" style={{ background: TINTA, color: CREMA }}>
              936 061 800
            </a>
            <Link href="/contacto" className="inline-flex items-center rounded-full text-[15px] font-medium px-8 py-4 transition-colors hover:bg-black/5" style={{ boxShadow: `inset 0 0 0 1px ${FILO}` }}>
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-black/30 select-none">
        <Image src={mal} alt="El salón, con foto de móvil" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={bien} alt="El mismo salón, producido" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" />
        </div>
        <div aria-hidden className="absolute top-0 bottom-0 w-[2px] bg-white shadow" style={{ left: `${v}%` }} />
        <div
          aria-hidden
          className="absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[15px]"
          style={{ left: `${v}%`, top: "50%", transform: "translate(-50%,-50%)", color: TINTA }}
        >
          ⇄
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
          Móvil
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm" style={{ color: TINTA }}>
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
      <span className="absolute -bottom-3 left-4 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg" style={{ background: TEJA, color: "#FFF" }}>
        {chip}
      </span>
    </div>
  );
}

/* Estrellas en teja: el acento nuevo. */
function Stars() {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={TEJA}>
          <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}
