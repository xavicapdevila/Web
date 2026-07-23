import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { fuenteDisplay } from "./fuente";
import { CLASE_PAGINA, DISPLAY, Distintivo, GRADIENTE, Halos, Logo, Tarjeta } from "./ui";

/**
 * Landing de entrada del diagnóstico — tráfico de Meta Ads.
 * Oscura, premium, con un informe de ejemplo flotando en el hero.
 * Server component sin JS de cliente: carga instantánea en móvil.
 */

const TEXTO_GRADIENTE = {
  background: GRADIENTE,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

/** Tarjeta-informe de ejemplo del hero (valores fijos, marcados como ejemplo) */
function MiniInforme() {
  const radio = 44;
  const circ = 2 * Math.PI * radio;
  const valor = 82;
  const barras: [string, number][] = [
    ["Encaje con la demanda", 88],
    ["Competitividad del precio", 74],
    ["Preparación para vender", 81],
  ];
  return (
    <div
      className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-[#0B1210]/80 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl motion-safe:animate-[dx-float_7s_ease-in-out_infinite]"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FA39B]">
          Diagnóstico inicial
        </p>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#5C6B65]">
          Ejemplo
        </span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="dx-hero-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <circle cx="52" cy="52" r={radio} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
            <circle
              cx="52"
              cy="52"
              r={radio}
              fill="none"
              stroke="url(#dx-hero-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - valor / 100)}
              style={{ filter: "drop-shadow(0 0 10px rgba(52,211,153,0.4))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${DISPLAY} text-[30px] font-semibold leading-none text-[#EDF2EF]`}>
              {valor}
            </span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[#5C6B65]">
              de 100
            </span>
          </div>
        </div>
        <div>
          <span className="inline-block rounded-full bg-[#34D399]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#34D399]">
            Riesgo bajo
          </span>
          <p className="mt-2.5 text-[12px] leading-relaxed text-[#8FA39B]">
            Ático · 105 m² · Ribes Roges
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {barras.map(([nombre, v]) => (
          <div key={nombre}>
            <div className="flex items-baseline justify-between">
              <p className="text-[12px] text-[#B7C4BE]">{nombre}</p>
              <p className={`${DISPLAY} text-[12px] font-semibold tabular-nums text-[#34D399]`}>{v}</p>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full"
                style={{ width: `${v}%`, background: GRADIENTE, boxShadow: "0 0 10px rgba(52,211,153,0.35)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingDiagnostico() {
  return (
    <div className={`${fuenteDisplay.variable} ${CLASE_PAGINA}`}>
      <Halos />
      {/* Retícula de puntos sutil bajo el hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="relative">
        {/* Cabecera */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-7 sm:px-8">
          <Logo className="h-11 w-auto" />
          <a
            href="#como-funciona"
            className="text-[13px] text-[#8FA39B] underline-offset-4 transition-colors hover:text-[#EDF2EF] hover:underline"
          >
            Cómo funciona
          </a>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          {/* Hero */}
          <section className="grid items-center gap-14 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <div className="motion-safe:animate-[dx-fade-up_0.7s_ease-out_both]">
              <Distintivo>Herramienta gratuita para propietarios · Garraf y Penedès</Distintivo>
              <h1
                className={`${DISPLAY} mt-6 max-w-[24ch] text-[clamp(2.1rem,7vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.03em] [text-wrap:balance]`}
              >
                Tu casa merece un análisis antes de un anuncio.{" "}
                <span style={TEXTO_GRADIENTE}>Hazlo gratis, en 2 minutos.</span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-[#8FA39B]">
                Responde 12 preguntas sobre tu casa y recibe al momento tu diagnóstico: la
                nota de salida, una horquilla de precio orientativa de tu zona y el plan con
                lo que haríamos antes de publicarla.
              </p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/antes-de-vender/analisis"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-9 py-4 text-[16px] font-semibold tracking-[-0.01em] text-[#052E22] shadow-[0_10px_40px_rgba(20,184,166,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_52px_rgba(20,184,166,0.55)] sm:w-auto"
                  style={{ background: GRADIENTE }}
                >
                  Analizar mi vivienda
                  <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/antes-de-vender/analisis?demo=1"
                  className="text-[14px] text-[#8FA39B] underline underline-offset-4 transition-colors hover:text-[#EDF2EF]"
                >
                  Ver un ejemplo primero
                </Link>
              </div>

              <p className="mt-5 text-[13px] text-[#5C6B65]">
                2 minutos · una pregunta por pantalla · sin registrarte
              </p>

              <p className="mt-8 max-w-[52ch] border-l-2 border-[#34D399]/50 pl-4 text-[13.5px] leading-relaxed text-[#8FA39B]">
                No es una valoración automática ni sustituye la revisión de un profesional.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <MiniInforme />
            </div>
          </section>

          {/* Franja honesta */}
          <section className="grid grid-cols-3 divide-x divide-white/[0.07] border-y border-white/[0.07] py-8">
            {[
              ["5", "indicadores medidos"],
              ["1", "lectura honesta"],
              ["0", "promesas vacías"],
            ].map(([cifra, texto]) => (
              <div key={texto} className="px-4 text-center sm:px-8">
                <p className={`${DISPLAY} text-[34px] font-semibold leading-none`} style={TEXTO_GRADIENTE}>
                  {cifra}
                </p>
                <p className="mt-2 text-[12.5px] text-[#8FA39B] sm:text-[13.5px]">{texto}</p>
              </div>
            ))}
          </section>

          {/* Qué mide */}
          <section className="py-20">
            <h2 className={`${DISPLAY} max-w-[24ch] text-[clamp(1.6rem,4.5vw,2.3rem)] font-semibold leading-tight tracking-[-0.02em]`}>
              Cinco lecturas de tu vivienda. <span style={TEXTO_GRADIENTE}>Sin humo.</span>
            </h2>
            <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Encaje con la demanda", "Si lo que vendes es lo que tu zona está buscando ahora mismo."],
                ["Atractivo del inmueble", "Lo que suma y lo que resta a ojos de quien cruza la puerta."],
                ["Competitividad del precio", "Cómo se sitúa tu precio frente a la horquilla real de tu zona."],
                ["Preparación para vender", "Si la vivienda está lista para salir, o le falta un paso."],
                ["Riesgo de estancamiento", "La probabilidad de que el anuncio envejezca sin visitas."],
              ].map(([titulo, texto], i) => (
                <Tarjeta key={titulo} className="group p-6 hover:border-[#34D399]/40">
                  <p className={`${DISPLAY} text-[13px] font-semibold tabular-nums text-[#34D399]`}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-[#EDF2EF]">
                    {titulo}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#8FA39B]">{texto}</p>
                </Tarjeta>
              ))}
              <div
                className="flex flex-col justify-between rounded-2xl p-6"
                style={{ background: GRADIENTE }}
              >
                <p className={`${DISPLAY} text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[#052E22]`}>
                  Y una puntuación general de 0 a 100 que lo resume todo.
                </p>
                <Link
                  href="/antes-de-vender/analisis"
                  className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#052E22] underline-offset-4 hover:underline"
                >
                  Probar ahora <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>

          {/* Cómo funciona */}
          <section id="como-funciona" className="border-t border-white/[0.07] py-20">
            <h2 className={`${DISPLAY} text-[clamp(1.6rem,4.5vw,2.3rem)] font-semibold leading-tight tracking-[-0.02em]`}>
              Dos minutos. <span style={TEXTO_GRADIENTE}>Tres pasos.</span>
            </h2>
            <ol className="mt-10 grid gap-3.5 lg:grid-cols-3">
              {[
                [
                  "Nos cuentas tu vivienda",
                  "Doce preguntas sencillas: zona, tipología, estado y el precio que tienes en mente. Una por pantalla, sin formularios eternos.",
                ],
                [
                  "La contrastamos con tu zona",
                  "Cruzamos tus respuestas con referencias de demanda y precio por zona y tipología del Garraf.",
                ],
                [
                  "Recibes el diagnóstico",
                  "Lo que ayuda, lo que frena y el riesgo de que la venta se estanque. Claro, por escrito y revisado por una persona. Y si quieres, venimos a ver la vivienda sin compromiso para afinarlo.",
                ],
              ].map(([titulo, texto], i) => (
                <li key={titulo} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <span
                    className={`${DISPLAY} flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold text-[#052E22]`}
                    style={{ background: GRADIENTE }}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-[#EDF2EF]">
                    {titulo}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#8FA39B]">{texto}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Qué es / qué no es */}
          <section className="border-t border-white/[0.07] py-20">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Tarjeta className="p-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#34D399]">
                  Esto sí es
                </p>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Un diagnóstico inicial de cómo saldría tu vivienda hoy.",
                    "Una lectura honesta de tu precio frente a la zona.",
                    "El punto de partida para una conversación con criterio.",
                  ].map((texto) => (
                    <li key={texto} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[#D7E2DC]">
                      <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#34D399]" strokeWidth={2.5} />
                      {texto}
                    </li>
                  ))}
                </ul>
              </Tarjeta>
              <Tarjeta className="p-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#FB7185]">
                  Esto no es
                </p>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Una valoración automática de tu vivienda.",
                    "Una promesa de precio o de plazo de venta.",
                    "Un sustituto de la revisión de un profesional.",
                  ].map((texto) => (
                    <li key={texto} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[#8FA39B]">
                      <X className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FB7185]" strokeWidth={2.5} />
                      {texto}
                    </li>
                  ))}
                </ul>
              </Tarjeta>
            </div>
          </section>

          {/* CTA final */}
          <section className="pb-24">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{ background: "radial-gradient(600px circle at 50% 0%, #34D399, transparent 70%)" }}
              />
              <h2
                className={`${DISPLAY} relative mx-auto max-w-[22ch] text-[clamp(1.7rem,5vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em] [text-wrap:balance]`}
              >
                Sal al mercado sabiendo lo que vas a encontrarte.
              </h2>
              <p className="relative mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[#8FA39B]">
                Dos minutos ahora pueden ahorrarte seis meses de anuncio congelado.
              </p>
              <div className="relative mt-9">
                <Link
                  href="/antes-de-vender/analisis"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full px-10 py-4 text-[16px] font-semibold tracking-[-0.01em] text-[#052E22] shadow-[0_10px_40px_rgba(20,184,166,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_52px_rgba(20,184,166,0.55)]"
                  style={{ background: GRADIENTE }}
                >
                  Analizar mi vivienda
                  <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/[0.07]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-[12px] text-[#5C6B65] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>The Vila Home · Vilanova i la Geltrú</p>
            <p>
              Prototipo con datos de referencia simulados ·{" "}
              <Link href="/privacidad" className="underline underline-offset-2 transition-colors hover:text-[#8FA39B]">
                Privacidad
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
