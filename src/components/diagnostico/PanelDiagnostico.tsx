"use client";

/**
 * Panel interno de demostración: lista los diagnósticos guardados en este
 * navegador, permite filtrarlos, cambiar el estado de cada lead, exportar a
 * CSV, sembrar datos de prueba y ajustar los pesos del algoritmo.
 *
 * Ruta privada de prueba: sin enlaces desde la web y con noindex. En un
 * despliegue real iría detrás de autenticación.
 */

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  borrarRegistros,
  cambiarEstadoLead,
  descargarCsv,
  guardarPesosOverride,
  instantaneaPesos,
  instantaneaPesosServidor,
  instantaneaRegistros,
  instantaneaRegistrosServidor,
  restaurarPesos,
  sembrarDatosDemo,
  suscribirAlmacen,
  type PesosScoring,
} from "@/lib/diagnostico/almacen";
import { ALGORITMO_VERSION, CONFIG_SCORING } from "@/lib/diagnostico/config-scoring";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_ESTADO_LEAD,
  ETIQUETA_HORIZONTE,
  ETIQUETA_INDICADOR,
  ETIQUETA_NIVEL_RIESGO,
  ETIQUETA_TIEMPO_ANUNCIADO,
  ETIQUETA_TIPO,
  ORDEN_ESTADOS_LEAD,
} from "@/lib/diagnostico/etiquetas";
import { MUNICIPIOS, OTRO_MUNICIPIO, nombresUbicacion } from "@/lib/diagnostico/referencias-mock";
import type { EstadoLead, TipoVivienda } from "@/lib/diagnostico/tipos";
import { fuenteDisplay } from "./fuente";
import { CLASE_PAGINA, DISPLAY, Eyebrow, GRADIENTE, Halos, Tarjeta } from "./ui";

const CLASE_SELECT =
  "rounded-xl border border-white/[0.12] bg-[#0B1210] px-3 py-2 text-[13px] text-[#EDF2EF] outline-none focus:border-[#34D399]/70";

const COLOR_RIESGO = { bajo: "#34D399", medio: "#FBBF24", alto: "#FB7185" } as const;

function fechaCorta(iso: string): string {
  const f = new Date(iso);
  return f.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) +
    " · " +
    f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function PanelDiagnostico() {
  // Los registros y los pesos viven en localStorage: el almacén notifica cada
  // cambio y useSyncExternalStore mantiene la vista al día sin efectos.
  const registros = useSyncExternalStore(
    suscribirAlmacen,
    instantaneaRegistros,
    instantaneaRegistrosServidor,
  );
  const pesosGuardados = useSyncExternalStore(
    suscribirAlmacen,
    instantaneaPesos,
    instantaneaPesosServidor,
  );

  const [filtroMunicipio, setFiltroMunicipio] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroResultado, setFiltroResultado] = useState("todos");
  const [filtroLead, setFiltroLead] = useState("todos");
  const [abierto, setAbierto] = useState<string | null>(null);
  /** Edición en curso de los pesos; null = mostrar lo guardado (o el archivo) */
  const [edicion, setEdicion] = useState<PesosScoring | null>(null);
  const [aviso, setAviso] = useState("");

  const hayOverride = pesosGuardados !== null;
  const pesos = edicion ?? pesosGuardados ?? CONFIG_SCORING.pesos;

  const filtrados = useMemo(() => {
    return registros.filter((reg) => {
      const r = reg.resultado.respuestas;
      if (filtroMunicipio !== "todos" && r.municipio !== filtroMunicipio) return false;
      if (filtroTipo !== "todos" && r.tipo !== filtroTipo) return false;
      if (filtroLead !== "todos" && reg.estadoLead !== filtroLead) return false;
      const p = reg.resultado.puntuacionGeneral;
      if (filtroResultado === "alto" && p < 70) return false;
      if (filtroResultado === "medio" && (p < 40 || p >= 70)) return false;
      if (filtroResultado === "bajo" && p >= 40) return false;
      return true;
    });
  }, [registros, filtroMunicipio, filtroTipo, filtroResultado, filtroLead]);

  const sumaPesos = Object.values(pesos).reduce((a, b) => a + b, 0);

  function avisar(texto: string) {
    setAviso(texto);
    window.setTimeout(() => setAviso(""), 3500);
  }

  return (
    <div className={`${fuenteDisplay.variable} ${CLASE_PAGINA}`}>
      <Halos />
      <div className="relative mx-auto w-full max-w-3xl px-5 pb-16 pt-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Panel interno · demo</Eyebrow>
            <h1 className={`${DISPLAY} mt-2 text-[27px] font-semibold tracking-[-0.02em] text-[#EDF2EF]`}>
              Diagnósticos
            </h1>
            <p className="mt-1 text-[13px] text-[#8FA39B]">
              Algoritmo v{ALGORITMO_VERSION}
              {hayOverride ? " · pesos ajustados desde este panel" : " · pesos del archivo de config"}
              {" · "}almacenado solo en este navegador
            </p>
          </div>
          <Link
            href="/antes-de-vender"
            className="text-[13px] text-[#8FA39B] underline underline-offset-4 transition-colors hover:text-[#EDF2EF]"
          >
            Ver la landing →
          </Link>
        </header>

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const n = sembrarDatosDemo();
              avisar(n > 0 ? `${n} diagnósticos de prueba añadidos.` : "Los casos de prueba ya estaban sembrados.");
            }}
            className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#052E22] shadow-[0_6px_24px_rgba(20,184,166,0.3)] transition-all hover:brightness-110"
            style={{ background: GRADIENTE }}
          >
            Sembrar datos de prueba
          </button>
          <button
            type="button"
            onClick={() => descargarCsv(filtrados)}
            disabled={filtrados.length === 0}
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-[13px] font-medium text-[#EDF2EF] transition-colors hover:border-[#34D399]/60 disabled:opacity-35"
          >
            Exportar CSV ({filtrados.length})
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("¿Borrar todos los diagnósticos guardados en este navegador?")) {
                borrarRegistros();
                avisar("Registros borrados.");
              }
            }}
            disabled={registros.length === 0}
            className="rounded-full border border-[#FB7185]/30 px-5 py-2.5 text-[13px] font-medium text-[#FB7185] transition-colors hover:border-[#FB7185] disabled:opacity-35"
          >
            Borrar todo
          </button>
          {aviso ? (
            <p role="status" className="text-[13px] text-[#34D399]">
              {aviso}
            </p>
          ) : null}
        </div>

        {/* Filtros */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <label className="flex items-center gap-2 text-[13px] text-[#8FA39B]">
            Municipio
            <select
              value={filtroMunicipio}
              onChange={(e) => setFiltroMunicipio(e.target.value)}
              className={CLASE_SELECT}
            >
              <option value="todos">Todos</option>
              {MUNICIPIOS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
              <option value={OTRO_MUNICIPIO}>Otra población</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#8FA39B]">
            Tipología
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className={CLASE_SELECT}
            >
              <option value="todos">Todas</option>
              {(Object.keys(ETIQUETA_TIPO) as TipoVivienda[]).map((t) => (
                <option key={t} value={t}>
                  {ETIQUETA_TIPO[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#8FA39B]">
            Resultado
            <select
              value={filtroResultado}
              onChange={(e) => setFiltroResultado(e.target.value)}
              className={CLASE_SELECT}
            >
              <option value="todos">Todos</option>
              <option value="alto">70 o más</option>
              <option value="medio">40–69</option>
              <option value="bajo">Menos de 40</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#8FA39B]">
            Lead
            <select
              value={filtroLead}
              onChange={(e) => setFiltroLead(e.target.value)}
              className={CLASE_SELECT}
            >
              <option value="todos">Todos</option>
              {ORDEN_ESTADOS_LEAD.map((e) => (
                <option key={e} value={e}>
                  {ETIQUETA_ESTADO_LEAD[e]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Lista */}
        <div className="mt-6 space-y-3">
          {filtrados.length === 0 ? (
            <Tarjeta className="p-8 text-center">
              <p className="text-[15px] text-[#8FA39B]">
                No hay diagnósticos que mostrar.
                {registros.length === 0
                  ? " Siembra los datos de prueba o completa uno desde la landing."
                  : " Prueba a quitar algún filtro."}
              </p>
            </Tarjeta>
          ) : (
            filtrados.map((reg) => {
              const res = reg.resultado;
              const r = res.respuestas;
              const nombres = nombresUbicacion(r);
              const esAbierto = abierto === res.id;
              return (
                <Tarjeta key={res.id} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAbierto(esAbierto ? null : res.id)}
                    aria-expanded={esAbierto}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <span
                      className={`${DISPLAY} flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold tabular-nums`}
                      style={{
                        color: COLOR_RIESGO[res.nivelRiesgo],
                        backgroundColor: `${COLOR_RIESGO[res.nivelRiesgo]}1a`,
                      }}
                    >
                      {res.puntuacionGeneral}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium tracking-[-0.01em] text-[#EDF2EF]">
                        {ETIQUETA_TIPO[r.tipo]} · {nombres.zona}
                      </span>
                      <span className="block truncate text-[13px] text-[#8FA39B]">
                        {r.municipio === OTRO_MUNICIPIO ? "Otra población" : nombres.municipio} ·{" "}
                        {reg.contacto ? reg.contacto.nombre : "Sin datos de contacto"} ·{" "}
                        {fechaCorta(reg.creadoEn)}
                        {reg.demo ? " · demo" : ""}
                      </span>
                    </span>
                    <span className="hidden text-[12px] text-[#5C6B65] sm:block">
                      {esAbierto ? "Cerrar" : "Ver detalle"}
                    </span>
                  </button>

                  {esAbierto ? (
                    <div className="space-y-6 border-t border-white/[0.08] px-5 py-5">
                      {/* Estado del lead */}
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-[13px] text-[#8FA39B]">
                          Estado del lead
                          <select
                            value={reg.estadoLead}
                            onChange={(e) => cambiarEstadoLead(res.id, e.target.value as EstadoLead)}
                            className={CLASE_SELECT}
                          >
                            {ORDEN_ESTADOS_LEAD.map((estado) => (
                              <option key={estado} value={estado}>
                                {ETIQUETA_ESTADO_LEAD[estado]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <span className={`${DISPLAY} text-[12px] tabular-nums text-[#5C6B65]`}>
                          {res.id} · v{res.version} · riesgo{" "}
                          {ETIQUETA_NIVEL_RIESGO[res.nivelRiesgo].toLowerCase()}
                          {res.horquillaSalida
                            ? ` · horquilla ${res.horquillaSalida.inferior.toLocaleString("es-ES")}–${res.horquillaSalida.superior.toLocaleString("es-ES")} €`
                            : ""}
                        </span>
                      </div>

                      {/* Contacto */}
                      {reg.contacto ? (
                        <div className="text-[14px] leading-relaxed">
                          <p className="font-medium text-[#EDF2EF]">{reg.contacto.nombre}</p>
                          <p className="text-[#8FA39B]">
                            {reg.contacto.telefono} · {reg.contacto.email}
                            {reg.contacto.quiereLlamada
                              ? ` · pide llamada (${reg.contacto.franjaLlamada === "manana" ? "mañana" : "tarde"})`
                              : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[13px] italic text-[#5C6B65]">
                          Completó el diagnóstico pero no dejó sus datos.
                        </p>
                      )}

                      {/* Puntuaciones */}
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#5C6B65]">
                          Puntuaciones
                        </p>
                        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-3">
                          {(Object.keys(ETIQUETA_INDICADOR) as (keyof typeof ETIQUETA_INDICADOR)[]).map(
                            (clave) => (
                              <div key={clave} className="flex items-baseline justify-between gap-2">
                                <dt className="text-[#8FA39B]">{ETIQUETA_INDICADOR[clave]}</dt>
                                <dd className={`${DISPLAY} font-semibold tabular-nums text-[#EDF2EF]`}>
                                  {res.indicadores[clave]}
                                </dd>
                              </div>
                            ),
                          )}
                          <div className="flex items-baseline justify-between gap-2">
                            <dt className="text-[#8FA39B]">General</dt>
                            <dd className={`${DISPLAY} font-semibold tabular-nums text-[#EDF2EF]`}>{res.puntuacionGeneral}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Respuestas */}
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#5C6B65]">
                          Respuestas
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#8FA39B]">
                          {r.superficie} m² · {r.habitaciones === 0 ? "estudio" : `${r.habitaciones} hab.`} ·{" "}
                          {r.banos} {r.banos === 1 ? "baño" : "baños"} ·{" "}
                          {r.ascensor === "si" ? "con ascensor" : "sin ascensor"} ·{" "}
                          {ETIQUETA_ESTADO[r.estado].toLowerCase()} ·{" "}
                          {r.caracteristicas.length > 0 ? r.caracteristicas.join(", ") : "sin extras"} ·
                          espera {r.precioEsperado.toLocaleString("es-ES")} € ·{" "}
                          {r.yaAnunciado === "si"
                            ? `anunciada (${r.tiempoAnunciado ? ETIQUETA_TIEMPO_ANUNCIADO[r.tiempoAnunciado].toLowerCase() : "tiempo sin indicar"})`
                            : "sin anunciar"}{" "}
                          · vender: {ETIQUETA_HORIZONTE[r.horizonte].toLowerCase()}
                        </p>
                      </div>

                      {/* Diagnóstico */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#34D399]">
                            Fortalezas
                          </p>
                          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[#D7E2DC]">
                            {res.fortalezas.map((f) => (
                              <li key={f.id}>· {f.texto}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#FBBF24]">
                            A revisar
                          </p>
                          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[#D7E2DC]">
                            {res.aRevisar.map((f) => (
                              <li key={f.id}>· {f.texto}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </Tarjeta>
              );
            })
          )}
        </div>

        {/* Pesos del algoritmo */}
        <Tarjeta className="mt-10 p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#5C6B65]">
            Pesos del algoritmo
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#8FA39B]">
            Los valores canónicos viven en{" "}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 text-[12px] text-[#D7E2DC]">
              src/lib/diagnostico/config-scoring.ts
            </code>
            . Desde aquí puedes probar otros pesos: se aplican a los diagnósticos nuevos de este
            navegador y quedan marcados como «v{ALGORITMO_VERSION}+panel».
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(Object.keys(pesos) as (keyof PesosScoring)[]).map((clave) => (
              <label key={clave} className="text-[12px] text-[#8FA39B]">
                {ETIQUETA_INDICADOR[clave]}
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={pesos[clave]}
                  onChange={(e) =>
                    setEdicion({ ...pesos, [clave]: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className={`${DISPLAY} mt-1 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-[14px] font-semibold tabular-nums text-[#EDF2EF] outline-none transition-colors focus:border-[#34D399]/70`}
                />
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className={`text-[13px] tabular-nums ${sumaPesos === 100 ? "text-[#34D399]" : "text-[#FB7185]"}`}>
              Suma: {sumaPesos} {sumaPesos === 100 ? "✓" : "(debe ser 100)"}
            </p>
            <button
              type="button"
              disabled={sumaPesos !== 100}
              onClick={() => {
                guardarPesosOverride(pesos);
                setEdicion(null);
                avisar("Pesos guardados: se aplicarán a los próximos diagnósticos.");
              }}
              className="rounded-full border border-white/[0.15] px-4 py-2 text-[13px] font-medium text-[#EDF2EF] transition-colors hover:border-[#34D399]/60 disabled:opacity-35"
            >
              Guardar pesos
            </button>
            <button
              type="button"
              onClick={() => {
                restaurarPesos();
                setEdicion(null);
                avisar("Restaurados los pesos del archivo de configuración.");
              }}
              className="rounded-full px-4 py-2 text-[13px] text-[#8FA39B] underline underline-offset-4 transition-colors hover:text-[#EDF2EF]"
            >
              Restaurar archivo
            </button>
          </div>
        </Tarjeta>
      </div>
    </div>
  );
}
