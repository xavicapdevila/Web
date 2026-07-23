/**
 * Átomos de interfaz del diagnóstico — sistema oscuro premium.
 *
 * Tokens: fondo #060A09 · texto #EDF2EF / #8FA39B · cristal blanco al 3–6% con
 * borde blanco al 8% · acento esmeralda→teal (#34D399 → #14B8A6) · ámbar
 * #FBBF24 (medio) · coral #FB7185 (riesgo). Números y titulares en Space
 * Grotesk vía `--font-dx-display` (ver fuente.ts).
 */

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contenedor raíz de todas las pantallas del diagnóstico.
 * max-w-[100vw]: si algo externo al proyecto (p. ej. extensiones del navegador
 * que inyectan DOM) ensancha el body, nuestras columnas siguen centradas sobre
 * el ancho visible y no sobre ese ancho fantasma. El overflow-x-clip absorbe
 * el desajuste de barra de scroll que 100vw arrastra en Windows.
 */
export const CLASE_PAGINA =
  "dx-root relative min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#060A09] text-[#EDF2EF] antialiased";

/** Titulares y cifras */
export const DISPLAY = "[font-family:var(--font-dx-display),system-ui]";

export const GRADIENTE = "linear-gradient(135deg, #34D399 0%, #14B8A6 100%)";

/** Halos de fondo — colocar una vez por pantalla, detrás del contenido */
export function Halos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, #34D399, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-56 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, #14B8A6, transparent 70%)" }}
      />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#34D399]">
      {children}
    </p>
  );
}

/** Distintivo de sección con punto “en vivo” */
export function Distintivo({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium tracking-[0.02em] text-[#B7C4BE]">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-[#34D399] motion-safe:animate-[dx-pulse_2.4s_ease-in-out_infinite]"
      />
      {children}
    </span>
  );
}

export function Tarjeta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Píldora compacta para listas largas de opciones (municipios, zonas): ancho
 * según contenido y flujo en línea — en móvil queda ordenada donde la rejilla
 * de cajas se veía irregular.
 */
export function Pildora({
  seleccionado,
  onClick,
  children,
  className,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={seleccionado}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-[14px] font-medium leading-snug tracking-[-0.01em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34D399]",
        seleccionado
          ? "border-transparent text-[#052E22] shadow-[0_4px_20px_rgba(20,184,166,0.35)]"
          : "border-white/[0.12] bg-white/[0.03] text-[#D7E2DC] hover:border-[#34D399]/50 hover:text-[#EDF2EF]",
        className,
      )}
      style={seleccionado ? { background: GRADIENTE } : undefined}
    >
      {children}
    </button>
  );
}

/** Wordmark oficial (logo.svg, blanco) — el mismo del resto de la web */
export function Logo({ className = "h-6 w-auto" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="The Vila Home" width={327} height={104} className={className} />;
}

/** Chip-botón grande y accesible para respuestas */
export function ChipOpcion({
  seleccionado,
  onClick,
  children,
  descripcion,
  rol = "radio",
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
  descripcion?: string;
  rol?: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      role={rol}
      aria-checked={seleccionado}
      onClick={onClick}
      className={`group relative w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34D399] ${
        seleccionado
          ? "border-[#34D399]/70 bg-[#34D399]/[0.09] shadow-[0_0_24px_rgba(52,211,153,0.12)]"
          : "border-white/[0.09] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="block text-[16px] font-medium tracking-[-0.01em] text-[#EDF2EF]">
          {children}
        </span>
        <span
          aria-hidden
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            seleccionado ? "border-transparent" : "border-white/20 group-hover:border-white/40"
          }`}
          style={seleccionado ? { background: GRADIENTE } : undefined}
        >
          {seleccionado ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
              <path d="M2.5 6.5 5 9l4.5-5.5" stroke="#052E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
      </span>
      {descripcion ? (
        <span className="mt-1 block pr-8 text-[13px] leading-snug text-[#8FA39B]">
          {descripcion}
        </span>
      ) : null}
    </button>
  );
}

export function BotonPrimario({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-[16px] font-semibold tracking-[-0.01em] text-[#052E22] shadow-[0_10px_36px_rgba(20,184,166,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_44px_rgba(20,184,166,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none sm:w-auto"
      style={{ background: GRADIENTE }}
    >
      {children}
    </button>
  );
}

function colorNivel(valor: number, invertido: boolean): string {
  const bueno = invertido ? valor <= 33 : valor >= 70;
  const regular = invertido ? valor <= 62 : valor >= 45;
  return bueno ? "#34D399" : regular ? "#FBBF24" : "#FB7185";
}

/** Barra horizontal de un indicador 0–100 */
export function BarraIndicador({
  etiqueta,
  valor,
  invertido = false,
  lectura,
}: {
  etiqueta: string;
  valor: number;
  /** true para el riesgo: más alto = peor */
  invertido?: boolean;
  /** Lectura en una línea que explica la nota */
  lectura?: string;
}) {
  const color = colorNivel(valor, invertido);
  const esVerde = color === "#34D399";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[14px] font-medium tracking-[-0.01em] text-[#D7E2DC]">{etiqueta}</p>
        <p className={`${DISPLAY} text-[14px] font-semibold tabular-nums`} style={{ color }}>
          {valor}
        </p>
      </div>
      <div
        role="meter"
        aria-label={etiqueta}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valor}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${valor}%`,
            background: esVerde ? GRADIENTE : color,
            boxShadow: `0 0 12px ${color}55`,
          }}
        />
      </div>
      {lectura ? (
        <p className="mt-1.5 text-[12.5px] leading-snug text-[#8FA39B]">{lectura}</p>
      ) : null}
    </div>
  );
}

/** Anillo con la puntuación general — trazo en degradado con brillo */
export function AnilloPuntuacion({
  valor,
  tamano = 150,
}: {
  valor: number;
  tamano?: number;
}) {
  const idGrad = useId();
  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const color = colorNivel(valor, false);
  const esVerde = color === "#34D399";
  return (
    <div
      className="relative"
      style={{ width: tamano, height: tamano }}
      role="img"
      aria-label={`Puntuación general: ${valor} sobre 100`}
    >
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={idGrad} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={radio} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={radio}
          fill="none"
          stroke={esVerde ? `url(#${idGrad})` : color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - valor / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${DISPLAY} text-[40px] font-semibold leading-none tracking-[-0.03em] text-[#EDF2EF]`}>
          {valor}
        </span>
        <span className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-[#5C6B65]">
          de 100
        </span>
      </div>
    </div>
  );
}
