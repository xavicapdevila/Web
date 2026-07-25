"use client";

/* ─────────────────────────────────────────────────────────────────────
   TARJETA DE PROPIEDAD — versión clara (prototipo)

   La primera versión de esta tarjeta era más bonita y MÁS POBRE: se había
   quedado en foto + tipología + precio. Se habían caído por el camino el
   contador de fotos, Plano, 360, Compartir, el WhatsApp del asesor y el
   estado de RESERVADO. Si una vivienda está reservada y la tarjeta no lo
   dice, la página miente: eso es peor que ser fea.

   Aquí está lo de la tarjeta publicada, con la piel nueva. Mismas
   condiciones que PropertyCard.tsx (hasPlano por eti "plano", has360 por
   eti "360", reservado por estadoFicha 7) y mismos textos de i18n.

   LA BAJADA DE PRECIO NO SE MUESTRA, por decisión de Xavi: la publicada
   pinta un distintivo con el % de outlet/precioAnterior; aquí no. Si algún
   día se quiere recuperar, los datos siguen en el XML.

   TIPOLOGÍA EN VEZ DEL TÍTULO: los títulos del XML son texto libre y no
   están todos en castellano ("Pis a Centre Vila", "Casa a Olivella" son
   catalán). La tarjeta publicada los pasa por useAutoTranslate, que ASUME
   ORIGEN CASTELLANO: en ES no traduce (→ salen en catalán en la página
   española) y en EN/FR traduce catalán creyendo que es castellano. Usar
   tipo/subtipo esquiva las dos cosas.

   DIFERENCIA HONESTA CON LA PUBLICADA: allí los distintivos abren visores
   (galería, vídeo, tour) dentro de la propia tarjeta — 445 líneas con seis
   estados y tres lightboxes. Aquí llevan a la ficha, que ya los tiene. Si
   el rediseño sale adelante hay que decidir si los visores en la parrilla
   valen su coste, o si el sitio del tour es la ficha.
   ───────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Heart, Play, RotateCcw, Rotate3d, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { buildAgentWhatsApp } from "@/lib/agents";
import { fillTemplate } from "@/lib/i18n";
import ShareModal from "@/components/properties/ShareModal";
import { FloorPlanIcon } from "@/components/properties/icons";
import { recorridoDeTarjeta } from "@/lib/recorrido-tarjeta";
import type { Property } from "@/types/property";

const INK = "#15140F";
const INK_SOFT = "#57534A";

/* Cristal. OJO con el fondo blanco: una lámina blanca translúcida sobre
   papel blanco es INVISIBLE — el cristal solo existe si hay algo detrás.
   Donde hay foto (las tarjetas) sigue funcionando igual. Donde no la hay
   (el filtro lateral) ya no es cristal: es una tarjeta blanca, y por eso
   se le sube el canto para que al menos tenga borde y sombra. */
const CRISTAL: React.CSSProperties = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "inset 0 0 0 1px rgba(21,20,15,0.08), 0 1px 20px rgba(21,20,15,0.05)",
};

/* Tipología: subtipo si existe ("Ático" dice más que "Piso"), si no el tipo. */
export function tipologia(p: Property): string {
  const x = p.subtipo?.trim() || p.tipo?.trim() || "";
  return x ? x.charAt(0).toUpperCase() + x.slice(1) : "";
}

export default function TarjetaPropiedad({ p, delay = 0 }: { p: Property; delay?: number }) {
  const { t } = useLanguage();
  const [compartir, setCompartir] = useState(false);
  /* Favorito — DE MOMENTO SOLO VISUAL (estado local, se pierde al recargar).
     El plan completo (idea de Xavi, jul 2026): guardar con email → aviso por
     correo si baja de precio o se retira, y contador de favoritos en la
     ficha junto a visitas y contactos (solo datos de nuestra web, tipo
     Idealista). Necesita almacenamiento + Resend: se decide aparte. */
  const [fav, setFav] = useState(false);
  const tipo = tipologia(p);

  /* ── EL RECORRIDO ────────────────────────────────────────────────────
     Al pasar el ratón, la tarjeta camina por la casa: salón, cocina,
     dormitorio, terraza… Sin clics.

     Por qué esto es lo único de todo el rediseño que el mercado NO puede
     copiar: no es código, es MATERIAL. TVH produce 22–57 fotos etiquetadas
     por estancia en cada vivienda. Idealista, Fotocasa y las agencias de
     al lado suben ocho fotos de móvil sin etiquetar — aunque copien el
     efecto, no tienen con qué llenarlo. */
  const paradas = recorridoDeTarjeta(p);
  const [i, setI] = useState(0);
  const [andando, setAndando] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const arrancar = () => {
    /* Reservada: la tarjeta lleva velo oscuro — pasear debajo queda raro. */
    if (p.estadoFicha === 7) return;
    if (paradas.length < 2 || timer.current) return;
    /* Solo si el visitante quiere movimiento. */
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAndando(true);
    timer.current = setInterval(() => setI((n) => (n + 1) % paradas.length), 1100);
  };
  const parar = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setAndando(false);
    /* Vuelve a la portada: si se queda en el baño, la parrilla acaba siendo
       un muestrario de baños. */
    setI(0);
  };
  /* Sin esto, sacar la tarjeta del DOM (al filtrar, al paginar) deja el
     intervalo vivo y actualizando un componente que ya no existe. */
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  /* Mismas condiciones que la tarjeta publicada. */
  const hasPlano = p.imagenes?.some((i) => i.eti === "plano") ?? false;
  const has360 = p.imagenes?.some((i) => i.eti === "360") ?? false;
  const hasVideo = Boolean(p.video1);
  const hasTour = Boolean(p.tour);
  const reservado = p.estadoFicha === 7;

  const url = `https://www.thevilahome.com/propiedades/${p.slug}`;
  /* WhatsApp AL ASESOR que la lleva (no a un número genérico): sale de
     agenteEmail vía la config central de agentes. */
  const waAsesor = buildAgentWhatsApp(p.agenteEmail, t("propWhatsappMsg"), {
    titulo: tipo,
    ref: p.ref ?? "",
    url,
  });
  const waCompartir = `https://wa.me/?text=${encodeURIComponent(
    fillTemplate(t("propShareWaMsg"), { titulo: tipo, url }),
  )}`;

  const precio = p.precio?.toLocaleString("es-ES");

  return (
    <>
      {compartir && (
        <ShareModal
          url={url}
          titulo={`${tipo}${p.zona ? ` · ${p.zona}` : ""}`}
          price={`${precio} €`}
          waUrl={waCompartir}
          onClose={() => setCompartir(false)}
        />
      )}

      <div
        className="rv group block"
        style={{ animationDelay: `${delay}ms` }}
        onMouseEnter={arrancar}
        onMouseLeave={parar}
      >
        {/* 4/5 alargaba demasiado; 5/4 dejaba la foto en 259px y se veía
            pequeña. 1/1 es el punto medio: foto cuadrada, generosa, y la
            tarjeta no se convierte en un póster. */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5">
          {/* El enlace envuelve SOLO la foto y el texto. Los distintivos y
              las acciones van fuera de él: un <button> dentro de un <a> es
              HTML inválido y en móvil se pisan los toques. */}
          <Link href={`/propiedades/${p.slug}`} className="absolute inset-0" aria-label={[tipo, p.zona, p.ciudad].filter(Boolean).join(", ")}>
            {paradas.map((parada, n) => (
              <Image
                key={parada.src}
                src={parada.src}
                alt={n === 0 ? [tipo, p.zona, p.ciudad].filter(Boolean).join(", ") : ""}
                fill
                /* Solo la portada es prioritaria; el resto se cargan cuando
                   el navegador puede. Si todas fuesen priority, una parrilla
                   de 12 pediría 70 fotos de golpe. */
                priority={false}
                loading={n === 0 ? undefined : "lazy"}
                sizes="(max-width:640px) 100vw, 33vw"
                className="object-cover transition-opacity duration-500"
                style={{ opacity: n === i ? 1 : 0 }}
              />
            ))}
          </Link>

          {/* Dónde estás dentro de la casa. Es lo que convierte el efecto en
              una lectura y no en un pase de diapositivas: sin el nombre, las
              fotos solo pasan; con él, estás recorriendo. */}
          {andando && paradas[i]?.estancia && (
            <div className="absolute top-3 left-3 pointer-events-none">
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ ...CRISTAL, color: INK }}
              >
                {paradas[i].estancia}
              </span>
            </div>
          )}

          {/* Barra de avance: cuántas estancias hay y por cuál vas. */}
          {paradas.length > 1 && (
            <div className="absolute top-3 right-3 flex gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {paradas.map((parada, n) => (
                <span
                  key={parada.src}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ width: n === i ? 14 : 5, background: n === i ? "#FFF" : "rgba(255,255,255,0.5)" }}
                />
              ))}
            </div>
          )}

          {/* ── Reservada: velo oscuro con el estado EN EL CENTRO, como la
              tarjeta publicada (decisión de Xavi). pointer-events-none: el
              enlace a la ficha de debajo sigue funcionando. */}
          {reservado && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-10">
              <span className="text-white font-medium text-[15px] tracking-[0.3em] uppercase border border-white/70 px-5 py-2">
                {t("cardReserved")}
              </span>
            </div>
          )}

          {/* ── Derecha: acciones. A la izquierda va lo que la vivienda
              TIENE (fotos, plano, vídeo, tour); a la derecha, lo que TÚ
              puedes hacer (guardar, WhatsApp, compartir).
              RESERVADA = SIN CONTACTO: el WhatsApp desaparece (guardar y
              compartir no son contacto y se quedan). */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-20">
            {/* Siempre visibles en móvil (no hay hover, y es donde se usa
                WhatsApp de verdad); en escritorio aparecen al pasar. */}
            <div className="flex gap-1.5 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setFav((v) => !v)}
                title="Guardar"
                aria-label="Guardar en favoritos"
                aria-pressed={fav}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                style={CRISTAL}
              >
                <Heart
                  size={14}
                  style={{ color: INK, fill: fav ? INK : "transparent", transition: "fill 0.2s" }}
                />
              </button>
              {!reservado && (
                <a
                  href={waAsesor}
                  target="_blank"
                  rel="noopener"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                  style={CRISTAL}
                >
                  <IconoWhatsApp />
                </a>
              )}
              <button
                onClick={() => setCompartir(true)}
                title={t("propShare")}
                aria-label={t("propShare")}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                style={CRISTAL}
              >
                <Share2 size={14} style={{ color: INK }} />
              </button>
            </div>
          </div>





          {/* ── Abajo: distintivos ENCIMA del cristal + los datos ─────────
              Los distintivos NO van dentro del cristal ni flotando arriba
              sobre la foto (ahí tapaban la casa). Van pegados al borde
              superior de la lámina, alineados a su izquierda: se leen como
              una pestaña de la propia lámina, y la foto queda limpia.
              Es una columna, así que nunca se solapan por mucho que crezca
              el contenido. */}
          <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col items-start gap-1.5">
            {/* Solo se pintan si EXISTEN de verdad: nada de insignias
                decorativas que prometan lo que no hay. */}
            <div className="flex flex-wrap gap-1.5">
              {(p.imagenes?.length ?? 0) > 0 && (
                <Distintivo href={`/propiedades/${p.slug}`} titulo={`${p.imagenes.length} fotos`}>
                  <Camera size={12} />
                  <span className="tabular-nums">{p.imagenes.length}</span>
                </Distintivo>
              )}
              {hasPlano && (
                <Distintivo href={`/propiedades/${p.slug}`} titulo={t("galleryPlan")}>
                  <FloorPlanIcon size={12} />
                </Distintivo>
              )}
              {hasVideo && (
                <Distintivo href={`/propiedades/${p.slug}`} titulo={t("galleryVideo")}>
                  <Play size={11} fill="currentColor" />
                </Distintivo>
              )}
              {has360 && (
                <Distintivo href={`/propiedades/${p.slug}`} titulo={t("gallery360")}>
                  <RotateCcw size={12} />
                </Distintivo>
              )}
              {hasTour && (
                <Distintivo href={`/propiedades/${p.slug}`} titulo={t("galleryVirtualTour")}>
                  <Rotate3d size={12} />
                </Distintivo>
              )}
            </div>

            <Link href={`/propiedades/${p.slug}`} className="w-full rounded-xl px-3.5 py-3 block" style={CRISTAL}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] font-medium tracking-[-0.01em] truncate">{tipo}</p>
                <p className="text-[15px] font-medium shrink-0">{precio} €</p>
              </div>
              <p className="text-[12.5px] mt-0.5 truncate" style={{ color: INK_SOFT }}>
                {[p.zona, p.ciudad].filter(Boolean).join(", ")}
              </p>
              <p className="mt-1.5 text-[12.5px]" style={{ color: INK_SOFT }}>
                {[
                  p.habitaciones && `${p.habitaciones} hab`,
                  p.banos && `${p.banos} baños`,
                  p.m2Construidos && `${p.m2Construidos} m²`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Distintivo({ href, titulo, children }: { href: string; titulo: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      title={titulo}
      aria-label={titulo}
      className="h-7 px-2.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-medium transition-transform hover:scale-105"
      style={{ ...CRISTAL, color: INK }}
    >
      {children}
    </Link>
  );
}

/* El icono de WhatsApp no está en lucide: se dibuja. */
function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill={INK} aria-hidden>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.2-.7 1-.9 1.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.2c-.2-.6-.4-.5-.6-.5h-.6a1 1 0 0 0-.8.4 3.2 3.2 0 0 0-1 2.4 5.6 5.6 0 0 0 1.2 3 12.7 12.7 0 0 0 4.9 4.3c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.8.1 2.9 2.9 0 0 0 1.9-1.3 2.4 2.4 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.3a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
    </svg>
  );
}
