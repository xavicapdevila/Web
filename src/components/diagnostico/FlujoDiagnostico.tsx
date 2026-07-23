"use client";

/**
 * Orquestador del recorrido: cuestionario → procesamiento → resultado
 * (con captación, confirmación y solicitud de llamada). Guarda cada
 * diagnóstico en el almacén local para que el panel interno lo liste.
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { captureAttribution, getAttribution, getClickIds } from "@/lib/attribution";
import { adjuntarContacto, configVigente, guardarRegistro } from "@/lib/diagnostico/almacen";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_NIVEL_RIESGO,
  ETIQUETA_POSICION_PRECIO,
  ETIQUETA_TIPO,
} from "@/lib/diagnostico/etiquetas";
import { calcularDiagnostico } from "@/lib/diagnostico/motor";
import { CASOS_EJEMPLO, nombresUbicacion } from "@/lib/diagnostico/referencias-mock";
import type {
  DatosContacto,
  RespuestasDiagnostico,
  ResultadoDiagnostico,
} from "@/lib/diagnostico/tipos";
import Cuestionario from "./Cuestionario";
import Procesando from "./Procesando";
import Resultado from "./Resultado";
import { fuenteDisplay } from "./fuente";
import { CLASE_PAGINA, DISPLAY, Halos, Logo } from "./ui";

type Fase = "cuestionario" | "procesando" | "resultado";

export default function FlujoDiagnostico({ abrirDemo = false }: { abrirDemo?: boolean }) {
  const [fase, setFase] = useState<Fase>("cuestionario");
  const [respuestas, setRespuestas] = useState<RespuestasDiagnostico | null>(null);
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);
  const [contacto, setContacto] = useState<DatosContacto | null>(null);
  const [demoVisible, setDemoVisible] = useState(abrirDemo);
  const [esDemo, setEsDemo] = useState(false);

  const empezarCalculo = useCallback((r: RespuestasDiagnostico, demo: boolean) => {
    setRespuestas(r);
    setEsDemo(demo);
    setDemoVisible(false);
    setContacto(null);
    setFase("procesando");
    window.scrollTo({ top: 0 });
  }, []);

  const terminarProcesamiento = useCallback(() => {
    if (!respuestas) return;
    const res = calcularDiagnostico(respuestas, configVigente());
    guardarRegistro({
      resultado: res,
      contacto: null,
      estadoLead: "nuevo",
      creadoEn: new Date().toISOString(),
      demo: esDemo,
    });
    setResultado(res);
    setFase("resultado");
    window.scrollTo({ top: 0 });
  }, [respuestas, esDemo]);

  function enviarContacto(datos: DatosContacto) {
    if (!resultado) return;
    adjuntarContacto(resultado.id, datos);
    setContacto(datos);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Lead al equipo (email + módulo Leads de Ora), en segundo plano: el
    // informe se desbloquea igual aunque la red falle — lo crítico es avisar.
    const r = resultado.respuestas;
    const nombres = nombresUbicacion(r);

    // Evento Lead en el Pixel del navegador con el mismo eventId que enviará
    // el servidor por la Conversions API → Meta deduplica (patrón de /vender).
    const eventId = `advl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      if (w.fbq) {
        w.fbq(
          "track",
          "Lead",
          { content_name: "antes-de-vender", content_category: r.yaAnunciado === "si" ? "en_venta" : r.horizonte },
          { eventID: eventId },
        );
      }
    } catch {}

    void fetch("/api/antes-de-vender-lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId,
        attribution: getAttribution(),
        clickIds: getClickIds(),
        sourceUrl: window.location.href,
        nombre: datos.nombre,
        telefono: datos.telefono,
        email: datos.email,
        tipo: ETIQUETA_TIPO[r.tipo],
        zona: nombres.zona,
        municipio: nombres.municipio,
        estado: ETIQUETA_ESTADO[r.estado],
        superficie: r.superficie,
        precioEsperado: r.precioEsperado,
        horquillaInferior: resultado.horquillaSalida.inferior,
        horquillaSuperior: resultado.horquillaSalida.superior,
        nota: resultado.puntuacionGeneral,
        riesgo: ETIQUETA_NIVEL_RIESGO[resultado.nivelRiesgo],
        posicionPrecio: ETIQUETA_POSICION_PRECIO[resultado.posicionPrecio],
        horizonte: r.horizonte,
        yaAnunciada: r.yaAnunciado === "si",
        ref: resultado.id,
        version: resultado.version,
      }),
    }).catch((err) => console.error("[antes-de-vender] lead no enviado", err));
  }

  function solicitarLlamada(franja: "manana" | "tarde") {
    if (!resultado || !contacto) return;
    const actualizado: DatosContacto = { ...contacto, quiereLlamada: true, franjaLlamada: franja };
    adjuntarContacto(resultado.id, actualizado);
    setContacto(actualizado);
  }

  // Atribución de primer contacto (por si se aterriza directo en /analisis
  // con parámetros de campaña; en la landing la captura CapturaAtribucion)
  useEffect(() => {
    captureAttribution();
  }, []);

  // Cerrar el selector de demo con Escape
  useEffect(() => {
    if (!demoVisible) return;
    const onTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDemoVisible(false);
    };
    window.addEventListener("keydown", onTecla);
    return () => window.removeEventListener("keydown", onTecla);
  }, [demoVisible]);

  return (
    <div className={`${fuenteDisplay.variable} ${CLASE_PAGINA}`}>
      <Halos />
      <header className="relative mx-auto flex w-full max-w-xl items-center justify-between px-5 pt-6 sm:px-6">
        <Link href="/antes-de-vender" aria-label="The Vila Home — volver al inicio">
          <Logo className="h-9 w-auto" />
        </Link>
        {fase === "resultado" ? (
          <span className="text-[12px] text-[#5C6B65]">Diagnóstico inicial</span>
        ) : null}
      </header>

      {fase === "cuestionario" && (
        <Cuestionario
          onCompletar={(r) => empezarCalculo(r, false)}
          onDemo={() => setDemoVisible(true)}
        />
      )}
      {fase === "procesando" && <Procesando onTerminar={terminarProcesamiento} />}
      {fase === "resultado" && resultado && (
        <Resultado
          resultado={resultado}
          contacto={contacto}
          onEnviarContacto={enviarContacto}
          onSolicitarLlamada={solicitarLlamada}
        />
      )}

      {/* Selector de escenarios de demo */}
      {demoVisible ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Escenarios de demostración"
          onClick={() => setDemoVisible(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1210]/95 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#34D399]">
                  Modo demo
                </p>
                <h2 className={`${DISPLAY} mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[#EDF2EF]`}>
                  Elige un escenario de ejemplo
                </h2>
                <p className="mt-1 text-[13px] text-[#8FA39B]">
                  Rellena el cuestionario al instante con un caso simulado de Vilanova.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDemoVisible(false)}
                aria-label="Cerrar"
                className="rounded-full p-2 text-[#8FA39B] transition-colors hover:text-[#EDF2EF]"
              >
                ✕
              </button>
            </div>
            <div className="mt-5 space-y-2.5">
              {CASOS_EJEMPLO.map((caso) => (
                <button
                  key={caso.id}
                  type="button"
                  onClick={() => empezarCalculo(caso.respuestas, true)}
                  className="w-full rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-4 text-left transition-all hover:border-[#34D399]/50 hover:bg-[#34D399]/[0.06]"
                >
                  <span className="block text-[15px] font-medium tracking-[-0.01em] text-[#EDF2EF]">
                    {caso.nombre}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-[#8FA39B]">
                    {caso.descripcion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
