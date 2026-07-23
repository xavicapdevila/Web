"use client";

/**
 * Cuestionario paso a paso: una pregunta por pantalla, barra de progreso y
 * navegación adelante/atrás. Los pasos visibles se adaptan a las respuestas
 * (el ascensor solo aplica a piso/ático; el tiempo anunciado, solo si ya
 * está anunciado).
 */

import { useMemo, useRef, useState } from "react";
import { MUNICIPIOS_CATALUNYA } from "@/lib/catalunya-municipios";
import { MUNICIPIOS, OTRO_MUNICIPIO } from "@/lib/diagnostico/referencias-mock";
import {
  ETIQUETA_CARACTERISTICA,
  ETIQUETA_ESTADO,
  ETIQUETA_HORIZONTE,
  ETIQUETA_TIEMPO_ANUNCIADO,
  ETIQUETA_TIPO,
} from "@/lib/diagnostico/etiquetas";
import type {
  Caracteristica,
  EstadoVivienda,
  HorizonteVenta,
  RespuestasDiagnostico,
  TiempoAnunciado,
  TipoVivienda,
} from "@/lib/diagnostico/tipos";
import { BotonPrimario, ChipOpcion, DISPLAY, Eyebrow, Pildora } from "./ui";

/* ── Autocompletado de poblaciones (solo Catalunya) ──────────────────────── */

function normalizarTexto(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’´`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sin artículo inicial, para que "arboç" encuentre "l'Arboç" */
function sinArticulo(s: string): string {
  return normalizarTexto(s)
    .replace(/^(el|la|els|les|lo|los|sa|ses)\s+/, "")
    .replace(/^l'/, "");
}

const POBLACIONES_CATALUNYA = MUNICIPIOS_CATALUNYA.filter((m) => m !== "Altres/Diversos");

/** Población escrita → municipio con referencias propias (si lo es) */
function municipioListado(nombreOficial: string): string | null {
  const clave = sinArticulo(nombreOficial);
  return MUNICIPIOS.find((m) => sinArticulo(m.nombre) === clave)?.id ?? null;
}

function buscarSugerencias(texto: string): string[] {
  const q = sinArticulo(texto);
  if (q.length < 2) return [];
  const empiezan: string[] = [];
  const contienen: string[] = [];
  for (const m of POBLACIONES_CATALUNYA) {
    const n = sinArticulo(m);
    if (n.startsWith(q)) empiezan.push(m);
    else if (n.includes(q)) contienen.push(m);
  }
  return [...empiezan, ...contienen].slice(0, 6);
}

function coincidenciaExacta(texto: string): string | null {
  const q = sinArticulo(texto);
  if (!q) return null;
  return POBLACIONES_CATALUNYA.find((m) => sinArticulo(m) === q) ?? null;
}

interface Borrador {
  municipio?: string;
  municipioOtro?: string | null;
  zona?: string;
  tipo?: TipoVivienda;
  superficie?: number | null;
  habitaciones?: number;
  banos?: number;
  ascensor?: "si" | "no";
  caracteristicas: Caracteristica[];
  estado?: EstadoVivienda;
  precioEsperado?: number | null;
  yaAnunciado?: "si" | "no";
  tiempoAnunciado?: TiempoAnunciado | null;
  horizonte?: HorizonteVenta;
}

type PasoId =
  | "ubicacion"
  | "tipo"
  | "superficie"
  | "habitaciones"
  | "banos"
  | "ascensor"
  | "caracteristicas"
  | "estado"
  | "precio"
  | "anunciado"
  | "tiempo-anunciado"
  | "horizonte";

const DESCRIPCION_ESTADO: Record<EstadoVivienda, string> = {
  reformado: "Reforma reciente, lista para entrar a vivir",
  "buen-estado": "Cuidada, sin obras pendientes",
  actualizar: "Habitable, pero pide pintura o pequeños cambios",
  reformar: "Necesita una reforma para venderse bien",
};

function formatearMiles(n: number): string {
  return n.toLocaleString("es-ES");
}

export default function Cuestionario({
  onCompletar,
  onDemo,
}: {
  onCompletar: (respuestas: RespuestasDiagnostico) => void;
  onDemo: () => void;
}) {
  const [borrador, setBorrador] = useState<Borrador>({ caracteristicas: [] });
  const [indice, setIndice] = useState(0);
  const avanceProgramado = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conAscensor = borrador.tipo === "piso" || borrador.tipo === "atico";
  const pasos = useMemo<PasoId[]>(() => {
    const lista: PasoId[] = ["ubicacion", "tipo", "superficie", "habitaciones", "banos"];
    if (borrador.tipo === undefined || conAscensor) lista.push("ascensor");
    lista.push("caracteristicas", "estado", "precio", "anunciado");
    if (borrador.yaAnunciado === undefined || borrador.yaAnunciado === "si") {
      lista.push("tiempo-anunciado");
    }
    lista.push("horizonte");
    return lista;
  }, [borrador.tipo, borrador.yaAnunciado, conAscensor]);

  const paso = pasos[Math.min(indice, pasos.length - 1)];
  const esUltimo = indice >= pasos.length - 1;

  function actualizar(parche: Partial<Borrador>) {
    setBorrador((previo) => ({ ...previo, ...parche }));
  }

  function avanzar() {
    if (avanceProgramado.current) clearTimeout(avanceProgramado.current);
    setIndice((i) => Math.min(i + 1, pasos.length - 1));
  }

  /** Selección única: marca la respuesta y avanza con una pausa breve */
  function elegirYAvanzar(parche: Partial<Borrador>, ultimo = false) {
    actualizar(parche);
    if (avanceProgramado.current) clearTimeout(avanceProgramado.current);
    if (ultimo) return;
    avanceProgramado.current = setTimeout(() => setIndice((i) => i + 1), 240);
  }

  function retroceder() {
    if (avanceProgramado.current) clearTimeout(avanceProgramado.current);
    setIndice((i) => Math.max(i - 1, 0));
  }

  function completar(parche: Partial<Borrador> = {}) {
    const b = { ...borrador, ...parche };
    if (
      !b.municipio ||
      !b.zona ||
      !b.tipo ||
      !b.superficie ||
      b.habitaciones === undefined ||
      !b.banos ||
      !b.estado ||
      !b.precioEsperado ||
      !b.yaAnunciado ||
      !b.horizonte
    ) {
      return;
    }
    if (b.municipio === OTRO_MUNICIPIO && !(b.municipioOtro ?? "").trim()) {
      return;
    }
    onCompletar({
      municipio: b.municipio,
      municipioOtro: b.municipio === OTRO_MUNICIPIO ? (b.municipioOtro ?? "").trim() : null,
      zona: b.zona,
      tipo: b.tipo,
      superficie: b.superficie,
      habitaciones: b.habitaciones,
      banos: b.banos,
      ascensor: b.ascensor ?? "no",
      caracteristicas: b.caracteristicas,
      estado: b.estado,
      precioEsperado: b.precioEsperado,
      yaAnunciado: b.yaAnunciado,
      tiempoAnunciado: b.yaAnunciado === "si" ? (b.tiempoAnunciado ?? null) : null,
      horizonte: b.horizonte,
    });
  }

  const municipioActual = MUNICIPIOS.find((m) => m.id === borrador.municipio);
  const progreso = Math.round((indice / pasos.length) * 100);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-6 sm:px-6">
      {/* Progreso */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={retroceder}
          disabled={indice === 0}
          className="rounded-full px-3 py-2 text-[14px] text-[#8FA39B] transition-colors hover:text-[#EDF2EF] disabled:invisible"
          aria-label="Volver a la pregunta anterior"
        >
          ← Atrás
        </button>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progreso}
          aria-label="Progreso del cuestionario"
          className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]"
        >
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${progreso}%`,
              background: "linear-gradient(90deg, #34D399, #14B8A6)",
              boxShadow: "0 0 10px rgba(52,211,153,0.4)",
            }}
          />
        </div>
        <p className={`${DISPLAY} text-[12px] font-medium tabular-nums text-[#5C6B65]`}>
          {Math.min(indice + 1, pasos.length)}/{pasos.length}
        </p>
      </div>

      {/* Anclado arriba a altura FIJA: la pregunta empieza siempre en el mismo
          punto, sin recentrarse según lo alto que sea cada paso */}
      <div className="flex-1 pb-10 pt-10 sm:pt-16">
        {paso === "ubicacion" && (
          <fieldset>
            <legend className="sr-only">Municipio y zona aproximada</legend>
            <Eyebrow>Ubicación</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Dónde está la vivienda?
            </h2>
            <p className="mt-2 text-[14px] text-[#8FA39B]">Municipio y zona aproximada.</p>
            {/* Rejilla de celdas IGUALES: auto-rows-fr + h-full para que todas las
                casillas midan lo mismo aunque un nombre ocupe dos líneas */}
            <div
              className="mt-6 grid auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Municipio"
            >
              {MUNICIPIOS.map((m) => (
                <Pildora
                  key={m.id}
                  seleccionado={borrador.municipio === m.id}
                  onClick={() => actualizar({ municipio: m.id, zona: undefined, municipioOtro: null })}
                  className="flex h-full min-h-12 w-full items-center justify-center rounded-xl px-3 py-2 text-center text-[13.5px]"
                >
                  {m.nombre}
                </Pildora>
              ))}
              <Pildora
                seleccionado={borrador.municipio === OTRO_MUNICIPIO}
                onClick={() =>
                  actualizar({
                    municipio: OTRO_MUNICIPIO,
                    zona: OTRO_MUNICIPIO,
                    municipioOtro: borrador.municipioOtro ?? "",
                  })
                }
                className="flex h-full min-h-12 w-full items-center justify-center rounded-xl px-3 py-2 text-center text-[13.5px]"
              >
                Otra población…
              </Pildora>
            </div>
            {borrador.municipio === OTRO_MUNICIPIO
              ? (() => {
                  const texto = borrador.municipioOtro ?? "";
                  const exacta = coincidenciaExacta(texto);
                  const sugerencias = buscarSugerencias(texto).filter((s) => s !== exacta);
                  const sinResultados =
                    texto.trim().length >= 3 && !exacta && sugerencias.length === 0;

                  const elegirPoblacion = (oficial: string) => {
                    const listado = municipioListado(oficial);
                    if (listado) {
                      // Es uno de los municipios con referencias: lo tratamos como tal
                      actualizar({ municipio: listado, zona: undefined, municipioOtro: null });
                    } else {
                      actualizar({ municipioOtro: oficial });
                    }
                  };

                  return (
                    <div className="mt-6">
                      <label
                        htmlFor="municipio-otro"
                        className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#5C6B65]"
                      >
                        ¿Qué población?
                      </label>
                      <input
                        id="municipio-otro"
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={sugerencias.length > 0}
                        aria-controls="sugerencias-poblacion"
                        value={texto}
                        onChange={(e) => actualizar({ municipioOtro: e.target.value })}
                        className="mt-3 w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-4 text-[17px] tracking-[-0.01em] text-[#EDF2EF] outline-none transition-colors placeholder:text-[#3d4a45] focus:border-[#34D399]/70"
                        placeholder="Empieza a escribir…"
                      />
                      {sugerencias.length > 0 ? (
                        <div
                          id="sugerencias-poblacion"
                          role="listbox"
                          aria-label="Poblaciones sugeridas"
                          className="mt-2 overflow-hidden rounded-2xl border border-white/[0.1]"
                        >
                          {sugerencias.map((s) => (
                            <button
                              key={s}
                              type="button"
                              role="option"
                              aria-selected={false}
                              onClick={() => elegirPoblacion(s)}
                              className="block w-full border-b border-white/[0.06] bg-white/[0.03] px-5 py-3 text-left text-[14px] text-[#D7E2DC] transition-colors last:border-b-0 hover:bg-[#34D399]/[0.08] hover:text-[#EDF2EF]"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {exacta ? (
                        <p className="mt-2.5 text-[13px] leading-relaxed text-[#34D399]">
                          {exacta} ✓ — aún no tenemos referencias afinadas ahí: el diagnóstico
                          será más prudente y lo contrastará una persona del equipo.
                        </p>
                      ) : sinResultados ? (
                        <p className="mt-2.5 text-[13px] leading-relaxed text-[#FBBF24]">
                          Si es fuera de Catalunya, no trabajamos esa zona.
                        </p>
                      ) : (
                        <p className="mt-2.5 text-[13px] leading-relaxed text-[#5C6B65]">
                          Solo trabajamos en Catalunya: escribe y elige tu población de la
                          lista.
                        </p>
                      )}
                      <div className="mt-6">
                        <BotonPrimario
                          onClick={() => {
                            if (!exacta) return;
                            const listado = municipioListado(exacta);
                            if (listado) {
                              actualizar({ municipio: listado, zona: undefined, municipioOtro: null });
                            } else {
                              actualizar({ municipioOtro: exacta });
                              avanzar();
                            }
                          }}
                          disabled={!exacta}
                        >
                          Continuar
                        </BotonPrimario>
                      </div>
                    </div>
                  );
                })()
              : null}
            {municipioActual ? (
              <div className="mt-6">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#5C6B65]">
                  Zona
                </p>
                <div
                  className="mt-3 grid auto-rows-fr grid-cols-2 gap-2"
                  role="radiogroup"
                  aria-label="Zona aproximada"
                >
                  {municipioActual.zonas.map((z) => (
                    <Pildora
                      key={z.id}
                      seleccionado={borrador.zona === z.id}
                      onClick={() => elegirYAvanzar({ zona: z.id })}
                      className="flex h-full min-h-12 w-full items-center justify-center rounded-xl px-3 py-2 text-center text-[13.5px]"
                    >
                      {z.nombre}
                    </Pildora>
                  ))}
                </div>
              </div>
            ) : null}
          </fieldset>
        )}

        {paso === "tipo" && (
          <fieldset>
            <legend className="sr-only">Tipo de vivienda</legend>
            <Eyebrow>Tipología</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Qué tipo de vivienda es?
            </h2>
            <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Tipo de vivienda">
              {(Object.keys(ETIQUETA_TIPO) as TipoVivienda[]).map((tipo) => (
                <ChipOpcion
                  key={tipo}
                  seleccionado={borrador.tipo === tipo}
                  onClick={() =>
                    elegirYAvanzar({
                      tipo,
                      // El ascensor solo se pregunta en piso/ático; el resto sale como "no"
                      ascensor: tipo === "piso" || tipo === "atico" ? borrador.ascensor : "no",
                    })
                  }
                >
                  {ETIQUETA_TIPO[tipo]}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}

        {paso === "superficie" && (
          <div>
            <Eyebrow>Superficie</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Cuántos metros tiene, aproximadamente?
            </h2>
            <p className="mt-2 text-[14px] text-[#8FA39B]">
              Metros construidos, más o menos. No hace falta que sea exacto.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <label htmlFor="superficie" className="sr-only">
                Superficie aproximada en metros cuadrados
              </label>
              <input
                id="superficie"
                inputMode="numeric"
                autoComplete="off"
                value={borrador.superficie ?? ""}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  actualizar({ superficie: Number.isNaN(n) ? null : Math.min(n, 2000) });
                }}
                className={`${DISPLAY} w-36 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-4 text-[22px] font-semibold tracking-[-0.01em] text-[#EDF2EF] outline-none transition-colors placeholder:text-[#3d4a45] focus:border-[#34D399]/70`}
                placeholder="90"
              />
              <span className="text-[16px] text-[#8FA39B]">m²</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[60, 75, 90, 110, 140, 180].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => actualizar({ superficie: m })}
                  className="rounded-full border border-white/[0.12] px-4 py-2 text-[13px] text-[#8FA39B] transition-colors hover:border-[#34D399]/60 hover:text-[#EDF2EF]"
                >
                  ~{m} m²
                </button>
              ))}
            </div>
            <div className="mt-8">
              <BotonPrimario
                onClick={avanzar}
                disabled={!borrador.superficie || borrador.superficie < 20}
              >
                Continuar
              </BotonPrimario>
            </div>
          </div>
        )}

        {paso === "habitaciones" && (
          <fieldset>
            <legend className="sr-only">Número de habitaciones</legend>
            <Eyebrow>Habitaciones</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Cuántas habitaciones?
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Habitaciones">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <ChipOpcion
                  key={n}
                  seleccionado={borrador.habitaciones === n}
                  onClick={() => elegirYAvanzar({ habitaciones: n })}
                >
                  {n === 0 ? "Estudio" : n === 5 ? "5 o más" : n}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}

        {paso === "banos" && (
          <fieldset>
            <legend className="sr-only">Número de baños</legend>
            <Eyebrow>Baños</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Cuántos baños?
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Baños">
              {[1, 2, 3].map((n) => (
                <ChipOpcion
                  key={n}
                  seleccionado={borrador.banos === n}
                  onClick={() => elegirYAvanzar({ banos: n })}
                >
                  {n === 3 ? "3 o más" : n}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}

        {paso === "ascensor" && (
          <fieldset>
            <legend className="sr-only">Ascensor</legend>
            <Eyebrow>Ascensor</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿El edificio tiene ascensor?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Ascensor">
              <ChipOpcion
                seleccionado={borrador.ascensor === "si"}
                onClick={() => elegirYAvanzar({ ascensor: "si" })}
              >
                Sí
              </ChipOpcion>
              <ChipOpcion
                seleccionado={borrador.ascensor === "no"}
                onClick={() => elegirYAvanzar({ ascensor: "no" })}
              >
                No
              </ChipOpcion>
            </div>
          </fieldset>
        )}

        {paso === "caracteristicas" && (
          <fieldset>
            <legend className="sr-only">Características</legend>
            <Eyebrow>Características</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Qué tiene la vivienda?
            </h2>
            <p className="mt-2 text-[14px] text-[#8FA39B]">
              Marca todo lo que aplique. Si nada, continúa sin marcar.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {(Object.keys(ETIQUETA_CARACTERISTICA) as Caracteristica[]).map((c) => {
                const activa = borrador.caracteristicas.includes(c);
                return (
                  <ChipOpcion
                    key={c}
                    rol="checkbox"
                    seleccionado={activa}
                    onClick={() =>
                      actualizar({
                        caracteristicas: activa
                          ? borrador.caracteristicas.filter((x) => x !== c)
                          : [...borrador.caracteristicas, c],
                      })
                    }
                  >
                    {ETIQUETA_CARACTERISTICA[c]}
                  </ChipOpcion>
                );
              })}
            </div>
            <div className="mt-8">
              <BotonPrimario onClick={avanzar}>Continuar</BotonPrimario>
            </div>
          </fieldset>
        )}

        {paso === "estado" && (
          <fieldset>
            <legend className="sr-only">Estado de la vivienda</legend>
            <Eyebrow>Estado</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿En qué estado está?
            </h2>
            <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Estado de la vivienda">
              {(Object.keys(ETIQUETA_ESTADO) as EstadoVivienda[]).map((estado) => (
                <ChipOpcion
                  key={estado}
                  seleccionado={borrador.estado === estado}
                  descripcion={DESCRIPCION_ESTADO[estado]}
                  onClick={() => elegirYAvanzar({ estado })}
                >
                  {ETIQUETA_ESTADO[estado]}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}

        {paso === "precio" && (
          <div>
            <Eyebrow>Precio</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Qué precio te gustaría conseguir?
            </h2>
            <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-[#8FA39B]">
              El que tienes en mente, sin compromiso. Solo lo usamos para contrastarlo con la
              horquilla de precios de la zona: no lo publicamos en ningún sitio.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <label htmlFor="precio" className="sr-only">
                Precio esperado en euros
              </label>
              <input
                id="precio"
                inputMode="numeric"
                autoComplete="off"
                value={borrador.precioEsperado ? formatearMiles(borrador.precioEsperado) : ""}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  actualizar({ precioEsperado: Number.isNaN(n) ? null : Math.min(n, 20_000_000) });
                }}
                className={`${DISPLAY} w-52 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-4 text-[22px] font-semibold tracking-[-0.01em] text-[#EDF2EF] outline-none transition-colors placeholder:text-[#3d4a45] focus:border-[#34D399]/70`}
                placeholder="250.000"
              />
              <span className="text-[16px] text-[#8FA39B]">€</span>
            </div>
            <div className="mt-8">
              <BotonPrimario
                onClick={avanzar}
                disabled={!borrador.precioEsperado || borrador.precioEsperado < 10_000}
              >
                Continuar
              </BotonPrimario>
            </div>
          </div>
        )}

        {paso === "anunciado" && (
          <fieldset>
            <legend className="sr-only">¿Ya está anunciada?</legend>
            <Eyebrow>Situación actual</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Ya está anunciada en algún portal?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Ya anunciada">
              <ChipOpcion
                seleccionado={borrador.yaAnunciado === "si"}
                onClick={() => elegirYAvanzar({ yaAnunciado: "si" })}
              >
                Sí
              </ChipOpcion>
              <ChipOpcion
                seleccionado={borrador.yaAnunciado === "no"}
                onClick={() => elegirYAvanzar({ yaAnunciado: "no", tiempoAnunciado: null })}
              >
                No
              </ChipOpcion>
            </div>
          </fieldset>
        )}

        {paso === "tiempo-anunciado" && (
          <fieldset>
            <legend className="sr-only">Tiempo anunciada</legend>
            <Eyebrow>Situación actual</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Cuánto tiempo lleva anunciada?
            </h2>
            <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Tiempo anunciada">
              {(Object.keys(ETIQUETA_TIEMPO_ANUNCIADO) as TiempoAnunciado[]).map((t) => (
                <ChipOpcion
                  key={t}
                  seleccionado={borrador.tiempoAnunciado === t}
                  onClick={() => elegirYAvanzar({ tiempoAnunciado: t })}
                >
                  {ETIQUETA_TIEMPO_ANUNCIADO[t]}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}

        {paso === "horizonte" && (
          <fieldset>
            <legend className="sr-only">Cuándo te gustaría vender</legend>
            <Eyebrow>Calendario</Eyebrow>
            <h2 className={`${DISPLAY} mt-3 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-[#EDF2EF]`}>
              ¿Cuándo te gustaría vender?
            </h2>
            <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Cuándo vender">
              {(Object.keys(ETIQUETA_HORIZONTE) as HorizonteVenta[]).map((h) => (
                <ChipOpcion
                  key={h}
                  seleccionado={borrador.horizonte === h}
                  onClick={() => {
                    if (esUltimo) {
                      completar({ horizonte: h });
                    } else {
                      elegirYAvanzar({ horizonte: h });
                    }
                  }}
                >
                  {ETIQUETA_HORIZONTE[h]}
                </ChipOpcion>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onDemo}
          className="text-[12px] text-[#5C6B65] underline underline-offset-4 transition-colors hover:text-[#8FA39B]"
        >
          Modo demo — rellenar con un ejemplo
        </button>
      </div>
    </div>
  );
}
