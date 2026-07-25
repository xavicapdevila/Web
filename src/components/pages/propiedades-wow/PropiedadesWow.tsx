"use client";

/* ─────────────────────────────────────────────────────────────────────
   /propiedades-wow — LA PARRILLA DEL REDISEÑO (prototipo, noindex)

   Navegable desde /home-wow. Dos piezas pedidas por Xavi:
   - ORDENACIÓN arriba a la derecha tipo Idealista (recientes / precio).
   - BUSCADOR moderno: una barra de píldoras (tipo, población, precio,
     habitaciones) sobre la parrilla. Cada píldora abre su panel; todo
     filtra en cliente — son ~100 inmuebles ya cargados.

   SIN VERDE (uso interno) y sin dorados: monocromo crema/tinta/blanco.
   Los valores de tipo y población salen de los DATOS, no de una lista a
   mano: si mañana entra un ático en Sitges, el filtro lo recoge solo.
   ───────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Check, ChevronDown, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/layout/Footer";
import NavWow from "@/components/pages/home-wow/NavWow";
import TarjetaPropiedad, { tipologia } from "@/components/pages/propiedades-claro/TarjetaPropiedad";
import type { Property } from "@/types/property";

const PAPER = "#F7F5EF";
const INK = "#15140F";
const INK_SOFT = "#57534A";
const LINE = "rgba(21,20,15,0.1)";
const WRAP = "mx-auto w-full max-w-[1480px] px-6 lg:px-12";

type Orden = "recientes" | "barato" | "caro";

/* Solo castellano, como el resto del copy del prototipo: se traduce cuando
   el diseño se congele. */
const ORDENES: { id: Orden; label: string }[] = [
  { id: "recientes", label: "Más recientes" },
  { id: "barato", label: "Precio: más bajo" },
  { id: "caro", label: "Precio: más alto" },
];

const PRECIOS: { id: string; label: string; min: number; max: number }[] = [
  { id: "0-200", label: "Hasta 200.000 €", min: 0, max: 200_000 },
  { id: "200-400", label: "200.000 – 400.000 €", min: 200_000, max: 400_000 },
  { id: "400-700", label: "400.000 – 700.000 €", min: 400_000, max: 700_000 },
  { id: "700+", label: "Más de 700.000 €", min: 700_000, max: Infinity },
];

const HABS = [
  { id: "1", label: "1 o más" },
  { id: "2", label: "2 o más" },
  { id: "3", label: "3 o más" },
  { id: "4", label: "4 o más" },
];

export default function PropiedadesWow({ properties }: { properties: Property[] }) {
  const { t } = useLanguage();
  const [orden, setOrden] = useState<Orden>("recientes");
  const [tipo, setTipo] = useState<string | null>(null);
  const [ciudad, setCiudad] = useState<string | null>(null);
  const [precio, setPrecio] = useState<string | null>(null);
  const [habs, setHabs] = useState<string | null>(null);

  /* Valores de filtro sacados de la cartera real. */
  const tipos = useMemo(
    () => [...new Set(properties.map((p) => tipologia(p)).filter(Boolean))].sort().map((x) => ({ id: x, label: x })),
    [properties],
  );
  const ciudades = useMemo(
    () => [...new Set(properties.map((p) => p.ciudad).filter(Boolean))].sort().map((x) => ({ id: x!, label: x! })),
    [properties],
  );

  const filtradas = useMemo(() => {
    const rango = PRECIOS.find((r) => r.id === precio);
    const lista = properties.filter((p) => {
      if (tipo && tipologia(p) !== tipo) return false;
      if (ciudad && p.ciudad !== ciudad) return false;
      if (rango && !((p.precio ?? 0) >= rango.min && (p.precio ?? 0) < rango.max)) return false;
      if (habs && (p.habitaciones ?? 0) < Number(habs)) return false;
      return true;
    });
    if (orden === "barato") lista.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
    if (orden === "caro") lista.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
    if (orden === "recientes") lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
    return lista;
  }, [properties, tipo, ciudad, precio, habs, orden]);

  const hayFiltros = Boolean(tipo || ciudad || precio || habs);
  const limpiar = () => { setTipo(null); setCiudad(null); setPrecio(null); setHabs(null); };

  return (
    <div className="font-gs antialiased min-h-screen" style={{ background: PAPER, color: INK }}>
      <NavWow />

      <main className={`${WRAP} pt-32 lg:pt-40 pb-24`}>
        <p className="hero-in text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: INK_SOFT }}>
          {t("heroLocation")}
        </p>
        <h1 className="mt-4 font-medium tracking-[-0.04em] leading-[0.92] text-[11vw] sm:text-[7vw] lg:text-[4.5rem]">
          <span className="hw-mask"><span className="hw-line">{t("navProperties")}</span></span>
        </h1>

        {/* ── El buscador: píldoras de filtro + ordenar a la derecha ────
            En móvil la fila desliza en horizontal (nada se apila raro);
            en escritorio respira sola. */}
        <div className="hero-in mt-8 flex items-center gap-2.5 overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap" style={{ animationDelay: "0.2s" }}>
          <Desplegable etiqueta="Tipo" opciones={tipos} activo={tipo} onSelect={setTipo} />
          <Desplegable etiqueta="Población" opciones={ciudades} activo={ciudad} onSelect={setCiudad} />
          <Desplegable etiqueta="Precio" opciones={PRECIOS} activo={precio} onSelect={setPrecio} />
          <Desplegable etiqueta="Habitaciones" opciones={HABS} activo={habs} onSelect={setHabs} />
          {hayFiltros && (
            <button
              onClick={limpiar}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors hover:bg-black/5 cursor-pointer"
              style={{ color: INK_SOFT }}
            >
              <X size={13} />
              Limpiar
            </button>
          )}

          <span className="ml-auto hidden lg:block text-[14px] whitespace-nowrap pr-1" style={{ color: INK_SOFT }}>
            {filtradas.length} {t("propPageFoundMany")}
          </span>
          <Desplegable
            etiqueta="Ordenar"
            icono={<ArrowUpDown size={14} />}
            opciones={ORDENES}
            activo={orden}
            onSelect={(id) => setOrden((id as Orden) ?? "recientes")}
            fija
          />
        </div>
        <p className="lg:hidden mt-4 text-[14px]" style={{ color: INK_SOFT }}>
          {filtradas.length} {t("propPageFoundMany")}
        </p>

        {/* La parrilla. La clave fuerza el remonte al cambiar filtros u
            orden, para que el revelado (.rv) no deje tarjetas a medias. */}
        <div key={`${orden}-${tipo}-${ciudad}-${precio}-${habs}`} className="mt-8 lg:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {filtradas.map((p, i) => (
            <TarjetaPropiedad key={p.ref} p={p} delay={(i % 3) * 50} />
          ))}
        </div>

        {filtradas.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-[17px]" style={{ color: INK_SOFT }}>
              Ninguna propiedad encaja con esos filtros.
            </p>
            <button onClick={limpiar} className="mt-4 inline-flex items-center rounded-full text-[14px] font-medium px-6 py-3 cursor-pointer" style={{ background: INK, color: PAPER }}>
              Quitar filtros
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ── Píldora con desplegable ──────────────────────────────────────────────
   `fija`: la de Ordenar siempre tiene un valor (no se puede "quitar"), las
   demás alternan — pulsar la opción activa la desactiva. */
function Desplegable({
  etiqueta,
  icono,
  opciones,
  activo,
  onSelect,
  fija = false,
}: {
  etiqueta: string;
  icono?: React.ReactNode;
  opciones: readonly { id: string; label: string }[];
  activo: string | null;
  onSelect: (id: string | null) => void;
  fija?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    addEventListener("mousedown", fuera);
    return () => removeEventListener("mousedown", fuera);
  }, [abierto]);

  const activaLabel = opciones.find((o) => o.id === activo)?.label;
  const conValor = Boolean(activo) && !fija;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-full pl-4 pr-3 py-2.5 text-[13.5px] font-medium whitespace-nowrap transition-colors cursor-pointer"
        style={
          conValor
            ? { background: INK, color: PAPER }
            : { background: "#FFF", boxShadow: `inset 0 0 0 1px ${LINE}` }
        }
      >
        {icono}
        {fija ? activaLabel : activaLabel ?? etiqueta}
        <ChevronDown size={14} className={`transition-transform duration-300 ${abierto ? "rotate-180" : ""}`} style={{ opacity: 0.55 }} />
      </button>

      {abierto && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[13rem] max-h-72 overflow-y-auto rounded-2xl p-1.5"
          style={{ background: "#FFF", boxShadow: `inset 0 0 0 1px ${LINE}, 0 16px 44px rgba(21,20,15,0.14)` }}
        >
          {opciones.map((o) => {
            const activa = o.id === activo;
            return (
              <button
                key={o.id}
                role="option"
                aria-selected={activa}
                onClick={() => { onSelect(fija ? o.id : activa ? null : o.id); setAbierto(false); }}
                className="w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] transition-colors hover:bg-black/5 cursor-pointer"
                style={{ fontWeight: activa ? 600 : 400, color: INK }}
              >
                {o.label}
                {activa && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
