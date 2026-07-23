"use client";

/**
 * Pantalla de resultado: parte del informe se muestra siempre; el detalle
 * completo (fortalezas, aspectos a revisar y explicación) se desbloquea al
 * dejar los datos de contacto. Tras enviarlos: confirmación y opción de
 * solicitar una llamada.
 */

import Link from "next/link";
import { Check, Download, Phone } from "lucide-react";
import { useState } from "react";
import { FRASE_PRECIO_MOVIMIENTO, textoHorquilla } from "@/lib/diagnostico/plantillas";
import { descargarInformePdf } from "./informe-pdf";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_NIVEL_RIESGO,
  ETIQUETA_POSICION_PRECIO,
  ETIQUETA_TIPO,
  ORDEN_POSICIONES_PRECIO,
} from "@/lib/diagnostico/etiquetas";
import { nombresUbicacion } from "@/lib/diagnostico/referencias-mock";
import type { DatosContacto, ResultadoDiagnostico } from "@/lib/diagnostico/tipos";
import FormularioContacto from "./FormularioContacto";
import { AnilloPuntuacion, BarraIndicador, DISPLAY, Eyebrow, GRADIENTE, Tarjeta } from "./ui";

const COLOR_RIESGO = {
  bajo: "#34D399",
  medio: "#FBBF24",
  alto: "#FB7185",
} as const;

/** Botón de descarga del informe en PDF, con estado mientras genera */
function BotonDescarga({
  resultado,
  contacto,
}: {
  resultado: ResultadoDiagnostico;
  contacto: DatosContacto | null;
}) {
  const [generando, setGenerando] = useState(false);
  return (
    <button
      type="button"
      disabled={generando}
      onClick={async () => {
        setGenerando(true);
        try {
          await descargarInformePdf(resultado, contacto);
        } finally {
          setGenerando(false);
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-[#34D399]/50 px-5 py-2.5 text-[14px] font-semibold text-[#34D399] transition-colors hover:bg-[#34D399] hover:text-[#052E22] disabled:opacity-50"
    >
      <Download className="h-4 w-4" strokeWidth={2.5} />
      {generando ? "Preparando el PDF…" : "Descargar informe (PDF)"}
    </button>
  );
}

export default function Resultado({
  resultado,
  contacto,
  onEnviarContacto,
  onSolicitarLlamada,
}: {
  resultado: ResultadoDiagnostico;
  contacto: DatosContacto | null;
  onEnviarContacto: (datos: DatosContacto) => void;
  onSolicitarLlamada: (franja: "manana" | "tarde") => void;
}) {
  const r = resultado.respuestas;
  const desbloqueado = contacto !== null;
  const colorRiesgo = COLOR_RIESGO[resultado.nivelRiesgo];
  const nombres = nombresUbicacion(r);
  const ubicacion =
    nombres.zona === nombres.municipio ? nombres.municipio : `${nombres.zona}, ${nombres.municipio}`;

  return (
    <div className="relative mx-auto w-full max-w-xl px-5 pb-16 pt-8 sm:px-6">
      {/* Confirmación tras dejar los datos */}
      {desbloqueado ? (
        <div
          className="mb-8 rounded-2xl border border-[#34D399]/30 bg-[#34D399]/[0.07] p-5 shadow-[0_0_40px_rgba(52,211,153,0.08)]"
          role="status"
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#EDF2EF]">
            Hecho, {contacto.nombre.split(" ")[0]}. Tu diagnóstico completo ya está abajo.
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#8FA39B]">
            Una persona del equipo — no un robot — lo revisará y te escribirá en menos de un
            día laborable. Y si te encaja, el siguiente paso es que vayamos a ver la vivienda
            — sin ningún compromiso — para afinar el diagnóstico con datos reales.
          </p>
          <div className="mt-4">
            <BotonDescarga resultado={resultado} contacto={contacto} />
          </div>
          {contacto.quiereLlamada ? (
            <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-[#34D399]">
              <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
              Anotado: te llamaremos por la{" "}
              {contacto.franjaLlamada === "manana" ? "mañana (9–14 h)" : "tarde (16–19 h)"}.
            </p>
          ) : (
            <div className="mt-3">
              <p className="text-[13px] text-[#8FA39B]">¿Prefieres que te llamemos?</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSolicitarLlamada("manana")}
                  className="rounded-full border border-[#34D399]/50 px-4 py-2 text-[13px] font-semibold text-[#34D399] transition-colors hover:bg-[#34D399] hover:text-[#052E22]"
                >
                  Mañana · 9–14 h
                </button>
                <button
                  type="button"
                  onClick={() => onSolicitarLlamada("tarde")}
                  className="rounded-full border border-[#34D399]/50 px-4 py-2 text-[13px] font-semibold text-[#34D399] transition-colors hover:bg-[#34D399] hover:text-[#052E22]"
                >
                  Tarde · 16–19 h
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Cabecera del informe */}
      <Eyebrow>Diagnóstico inicial</Eyebrow>
      <h1 className={`${DISPLAY} mt-3 text-[29px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
        Así saldría hoy tu vivienda al mercado.
      </h1>
      <p className="mt-2 text-[14px] text-[#8FA39B]">
        {ETIQUETA_TIPO[r.tipo]} · {r.superficie} m² · {ubicacion} · {ETIQUETA_ESTADO[r.estado]}
      </p>

      <div className="mt-9 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <AnilloPuntuacion valor={resultado.puntuacionGeneral} />
        <div className="text-center sm:text-left">
          <span
            className="inline-block rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: colorRiesgo, backgroundColor: `${colorRiesgo}1a` }}
          >
            Riesgo de estancamiento: {ETIQUETA_NIVEL_RIESGO[resultado.nivelRiesgo]}
          </span>
          <p className="mt-3 max-w-[40ch] text-[13.5px] leading-relaxed text-[#8FA39B]">
            Lectura orientativa: no conocemos la dirección exacta ni hemos visitado la
            vivienda, y todo puede variar al verla. Por eso el siguiente paso es que una
            persona del equipo la vea contigo.
          </p>
        </div>
      </div>

      {/* Indicadores — siempre visibles, con su lectura en una línea */}
      <Tarjeta className="mt-10 space-y-6 p-6">
        <BarraIndicador
          etiqueta="Encaje con la demanda"
          valor={resultado.indicadores.encajeDemanda}
          lectura={resultado.lecturaIndicadores.encajeDemanda}
        />
        <BarraIndicador
          etiqueta="Atractivo del inmueble"
          valor={resultado.indicadores.atractivo}
          lectura={resultado.lecturaIndicadores.atractivo}
        />
        <BarraIndicador
          etiqueta="Competitividad del precio"
          valor={resultado.indicadores.competitividadPrecio}
          lectura={resultado.lecturaIndicadores.competitividadPrecio}
        />
        <BarraIndicador
          etiqueta="Preparación para vender"
          valor={resultado.indicadores.preparacion}
          lectura={resultado.lecturaIndicadores.preparacion}
        />
        <BarraIndicador
          etiqueta="Riesgo de estancamiento"
          valor={resultado.indicadores.riesgoEstancamiento}
          invertido
          lectura={resultado.lecturaIndicadores.riesgoEstancamiento}
        />
      </Tarjeta>

      {/* Posición del precio en la horquilla — cualitativa, sin cifras */}
      <Tarjeta className="mt-4 p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#5C6B65]">
          Tu precio frente a la horquilla de la zona
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#5C6B65]">
          La horquilla es el rango de precios en el que se venden viviendas comparables a la
          tuya en tu zona.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-1.5" role="img" aria-label={`Posición del precio: ${ETIQUETA_POSICION_PRECIO[resultado.posicionPrecio]}`}>
          {ORDEN_POSICIONES_PRECIO.map((posicion) => {
            const activa = posicion === resultado.posicionPrecio;
            return (
              <div key={posicion} className="text-center">
                <div
                  className="h-2 rounded-full"
                  style={
                    activa
                      ? { background: GRADIENTE, boxShadow: "0 0 12px rgba(52,211,153,0.45)" }
                      : { backgroundColor: "rgba(255,255,255,0.08)" }
                  }
                />
                <p
                  className={`mt-2 text-[11px] leading-tight ${
                    activa ? "font-semibold text-[#EDF2EF]" : "text-[#5C6B65]"
                  }`}
                >
                  {ETIQUETA_POSICION_PRECIO[posicion]}
                </p>
              </div>
            );
          })}
        </div>
      </Tarjeta>

      {/* Primera fortaleza — anticipo del informe */}
      <div className="mt-9">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#34D399]">
          Lo que juega a tu favor
        </p>
        <p className="mt-3 border-l-2 border-[#34D399] pl-4 text-[15px] leading-relaxed text-[#D7E2DC]">
          {resultado.fortalezas[0]?.texto}
        </p>
      </div>

      {desbloqueado ? (
        <>
          {/* Horquilla orientativa de salida — el dato estrella, solo desbloqueado */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#34D399]/30 bg-white/[0.03] p-6 sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.1]"
              style={{ background: "radial-gradient(420px circle at 15% 0%, #34D399, transparent 70%)" }}
            />
            <div className="relative">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#34D399]">
                Horquilla orientativa de salida
              </p>
              <p className={`${DISPLAY} mt-3 text-[clamp(1.5rem,5vw,2.1rem)] font-semibold tracking-[-0.02em] text-[#EDF2EF]`}>
                {resultado.horquillaSalida.inferior.toLocaleString("es-ES")} €{" "}
                <span className="text-[#5C6B65]">—</span>{" "}
                {resultado.horquillaSalida.superior.toLocaleString("es-ES")} €
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#B7C4BE]">
                {textoHorquilla(resultado)}
              </p>
              <p className="mt-3 border-l-2 border-[#34D399] pl-3.5 text-[13.5px] leading-relaxed text-[#B7C4BE]">
                {FRASE_PRECIO_MOVIMIENTO}
              </p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#5C6B65]">
                Orientativa: calculada con referencias por zona y tipología, sin conocer la
                dirección exacta ni haber visitado la vivienda. La visita del equipo la afina
                con comparables reales.
              </p>
            </div>
          </div>

          {/* Informe completo */}
          <div className="mt-8 space-y-3.5">
            {resultado.fortalezas.slice(1).map((f) => (
              <p key={f.id} className="border-l-2 border-[#34D399] pl-4 text-[15px] leading-relaxed text-[#D7E2DC]">
                {f.texto}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#FBBF24]">
              Lo que conviene revisar
            </p>
            <div className="mt-3 space-y-3.5">
              {resultado.aRevisar.map((f) => (
                <p key={f.id} className="border-l-2 border-[#FBBF24] pl-4 text-[15px] leading-relaxed text-[#D7E2DC]">
                  {f.texto}
                </p>
              ))}
            </div>
          </div>

          {/* Plan de salida — solo los titulares; el detalle vive en el PDF */}
          <div className="mt-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#34D399]">
              Plan de salida, en cinco pasos
            </p>
            <ol className="mt-4 space-y-2.5">
              {resultado.planSalida.map((paso, i) => (
                <li key={paso.titulo} className="flex items-center gap-3.5">
                  <span
                    className={`${DISPLAY} flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#052E22]`}
                    style={{ background: GRADIENTE }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[15px] font-medium tracking-[-0.01em] text-[#EDF2EF]">
                    {paso.titulo}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* El informe completo vive en el PDF */}
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0B1210]/85 p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{ background: "radial-gradient(420px circle at 85% 0%, #34D399, transparent 70%)" }}
            />
            <div className="relative">
              <h2 className={`${DISPLAY} text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#EDF2EF]`}>
                Tu informe completo, en PDF.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#8FA39B]">
                Aquí arriba tienes el resumen. El documento entero — con gráficas y el porqué
                de cada nota — te lo llevas en PDF:
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "El porqué de cada indicador, con gráficas",
                  "Nuestra lectura completa de zona y precio",
                  "A quién le encaja tu vivienda",
                  "El plan de salida, paso a paso y explicado",
                  "Calendario de los primeros 30 días",
                  "Checklist de puesta a punto antes de fotos y visitas",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[#B7C4BE]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <BotonDescarga resultado={resultado} contacto={contacto} />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-[#5C6B65]">
                Recuerda: todo esto es orientativo, con los datos que nos has dado. Lo que lo
                convierte en una estrategia real es ver la vivienda — visita sin ningún
                compromiso.
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/[0.08] pt-8 text-center">
            <p className={`${DISPLAY} text-[13px] tabular-nums text-[#5C6B65]`}>
              Referencia del diagnóstico: {resultado.id} · versión {resultado.version}
            </p>
            <Link
              href="/antes-de-vender"
              className="mt-4 inline-block text-[14px] text-[#8FA39B] underline underline-offset-4 transition-colors hover:text-[#EDF2EF]"
            >
              Hacer otro diagnóstico
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Anticipo difuminado — decorativo, el contenido real no se renderiza */}
          <div aria-hidden className="mt-6 select-none space-y-3.5 blur-[7px]">
            <p className="border-l-2 border-[#34D399] pl-4 text-[15px] text-[#8FA39B]">
              La segunda fortaleza de tu vivienda aparece aquí, con el detalle de por qué pesa
              en tu zona.
            </p>
            <p className="border-l-2 border-[#FBBF24] pl-4 text-[15px] text-[#8FA39B]">
              Y aquí, los dos aspectos concretos que conviene revisar antes de salir al
              mercado, explicados sin rodeos.
            </p>
            <p className="border-l-2 border-[#34D399] pl-4 text-[15px] text-[#8FA39B]">
              Además: la horquilla orientativa de salida en euros, a quién le encaja tu
              vivienda y un plan de salida en cinco pasos.
            </p>
          </div>

          {/* Captación */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0B1210]/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{ background: "radial-gradient(420px circle at 85% 0%, #34D399, transparent 70%)" }}
            />
            <div className="relative">
              <h2 className={`${DISPLAY} text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#EDF2EF]`}>
                Tu diagnóstico completo, revisado por una persona.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#8FA39B]">
                Déjanos tus datos y desbloquea el informe entero: la horquilla orientativa de
                salida en euros, fortalezas, aspectos a revisar, el plan de salida y el
                informe completo en PDF. Y si quieres, lo rematamos viendo la vivienda — una
                visita sin ningún compromiso. No publicamos nada en ningún sitio.
              </p>
              <div className="mt-6">
                <FormularioContacto onEnviar={onEnviarContacto} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
