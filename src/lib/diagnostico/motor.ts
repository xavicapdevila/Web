/**
 * Motor de puntuación del diagnóstico — determinista y separado de la UI.
 *
 * Sin números aleatorios, sin fechas, sin estado: la misma combinación de
 * respuestas con la misma configuración produce SIEMPRE exactamente el mismo
 * resultado (incluido el identificador). Las reglas numéricas viven en
 * config-scoring.ts; las referencias simuladas en referencias-mock.ts; los
 * textos en plantillas.ts.
 */

import { CONFIG_SCORING, puntosPorTramo, type ConfigScoring } from "./config-scoring";
import { OTRO_MUNICIPIO, buscarMunicipio, buscarZona, nombresUbicacion } from "./referencias-mock";
import { capitalizarIniciales } from "./etiquetas";
import {
  calcularPosicionPrecio,
  construirExplicacion,
  construirFactores,
  construirLecturas,
  construirPerfilComprador,
  construirPlanSalida,
  construirPorques,
} from "./plantillas";
import type {
  Indicadores,
  NivelRiesgo,
  RespuestasDiagnostico,
  ResultadoDiagnostico,
} from "./tipos";

/** Contexto derivado que comparten indicadores, factores y plantillas */
export interface ContextoCalculo {
  respuestas: RespuestasDiagnostico;
  config: ConfigScoring;
  nombreMunicipio: string;
  nombreZona: string;
  /** true cuando el propietario escribió una población fuera de las referencias */
  esMunicipioDesconocido: boolean;
  /** Demanda simulada de la zona ajustada por tipología (0–100) */
  demandaZona: number;
  /** Precio de referencia simulado para esta vivienda, en euros */
  precioReferencia: number;
  /** precioEsperado / precioReferencia */
  ratioPrecio: number;
  esTipologiaConAscensor: boolean;
}

function clamp(valor: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, valor));
}

/** FNV-1a de 32 bits — hash estable sin dependencias para el identificador */
function fnv1a(texto: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * Forma canónica de las respuestas: claves en orden fijo y características
 * ordenadas, para que el hash no dependa del orden en que se marcaron.
 */
export function normalizarRespuestas(r: RespuestasDiagnostico): RespuestasDiagnostico {
  const esOtro = r.municipio === OTRO_MUNICIPIO;
  const otroLimpio = (r.municipioOtro ?? "").trim().replace(/\s+/g, " ");
  return {
    municipio: r.municipio,
    // Forma canónica del nombre libre: "les roquetes " y "Les Roquetes"
    // deben producir el mismo diagnóstico (y el mismo identificador)
    municipioOtro: esOtro && otroLimpio ? capitalizarIniciales(otroLimpio) : null,
    zona: r.zona,
    tipo: r.tipo,
    superficie: Math.round(r.superficie),
    habitaciones: r.habitaciones,
    banos: r.banos,
    ascensor: r.ascensor,
    caracteristicas: [...r.caracteristicas].sort(),
    estado: r.estado,
    precioEsperado: Math.round(r.precioEsperado),
    yaAnunciado: r.yaAnunciado,
    tiempoAnunciado: r.yaAnunciado === "si" ? r.tiempoAnunciado : null,
    horizonte: r.horizonte,
  };
}

export function construirContexto(
  respuestas: RespuestasDiagnostico,
  config: ConfigScoring,
): ContextoCalculo {
  const esOtro = respuestas.municipio === OTRO_MUNICIPIO;
  const municipio = esOtro ? null : buscarMunicipio(respuestas.municipio);
  const zona = esOtro ? null : buscarZona(respuestas.municipio, respuestas.zona);
  const nombres = nombresUbicacion(respuestas);

  // Valores prudentes de comarca cuando no hay referencia ("otra población")
  const demandaBase = zona?.demanda ?? 60;
  const factorTipoDemanda = municipio?.demandaTipo[respuestas.tipo] ?? 1;
  const precioM2Base = zona?.precioM2Base ?? 2200;

  const precioM2 =
    precioM2Base *
    config.precio.factorTipo[respuestas.tipo] *
    config.precio.factorEstado[respuestas.estado];
  // Superficie equivalente: los metros por encima del umbral valen menos por
  // m² (el €/m² real cae con el tamaño — sin esto las casas grandes salían
  // con referencias infladas)
  const { plena, factorExtra } = config.precio.superficieEquivalente;
  const superficieEquivalente =
    Math.min(respuestas.superficie, plena) +
    Math.max(0, respuestas.superficie - plena) * factorExtra;
  const precioReferencia = Math.round(precioM2 * superficieEquivalente);

  return {
    respuestas,
    config,
    nombreMunicipio: nombres.municipio,
    nombreZona: nombres.zona,
    esMunicipioDesconocido: esOtro,
    demandaZona: clamp(Math.round(demandaBase * factorTipoDemanda)),
    precioReferencia,
    ratioPrecio: precioReferencia > 0 ? respuestas.precioEsperado / precioReferencia : 1,
    esTipologiaConAscensor: respuestas.tipo === "piso" || respuestas.tipo === "atico",
  };
}

function calcularEncajeDemanda(ctx: ContextoCalculo): number {
  const { respuestas, config } = ctx;
  const reglas = config.encaje;
  let puntos = ctx.demandaZona;

  const rango = reglas.habitacionesIdeales[respuestas.tipo];
  puntos +=
    respuestas.habitaciones >= rango.min && respuestas.habitaciones <= rango.max
      ? reglas.dentroRangoHabitaciones
      : reglas.fueraRangoHabitaciones;

  if (
    respuestas.superficie < reglas.superficieMinimaComoda ||
    respuestas.superficie > reglas.superficieMaximaComoda
  ) {
    puntos += reglas.ajusteSuperficieExtrema;
  }

  return clamp(Math.round(puntos));
}

function calcularAtractivo(ctx: ContextoCalculo): number {
  const { respuestas, config } = ctx;
  const reglas = config.atractivo;
  let puntos = reglas.base + reglas.estado[respuestas.estado];

  if (ctx.esTipologiaConAscensor) {
    if (respuestas.ascensor === "si") {
      puntos += reglas.ascensorSi;
    } else {
      puntos += respuestas.tipo === "atico" ? reglas.ascensorNoAtico : reglas.ascensorNoPiso;
    }
  }

  for (const c of respuestas.caracteristicas) {
    if (c === "terraza") {
      puntos +=
        respuestas.tipo === "atico"
          ? reglas.caracteristicas.terrazaEnAtico
          : reglas.caracteristicas.terraza;
    } else {
      puntos += reglas.caracteristicas[c];
    }
  }

  if (respuestas.banos >= 2) puntos += reglas.segundoBano;

  return clamp(Math.round(puntos));
}

function calcularCompetitividadPrecio(ctx: ContextoCalculo): number {
  return clamp(puntosPorTramo(ctx.config.precio.tramos, ctx.ratioPrecio));
}

function calcularPreparacion(ctx: ContextoCalculo): number {
  const { respuestas, config } = ctx;
  const reglas = config.preparacion;
  let puntos = reglas.base + reglas.estado[respuestas.estado] + reglas.horizonte[respuestas.horizonte];

  if (respuestas.yaAnunciado === "si" && respuestas.tiempoAnunciado) {
    puntos += reglas.tiempoAnunciado[respuestas.tiempoAnunciado];
  } else {
    puntos += reglas.sinAnunciar;
  }

  if (ctx.ratioPrecio > reglas.ratioPrecioDesalineado) {
    puntos += reglas.ajustePrecioDesalineado;
  }

  return clamp(Math.round(puntos));
}

function calcularRiesgoEstancamiento(ctx: ContextoCalculo): number {
  const { respuestas, config } = ctx;
  const reglas = config.riesgo;
  let puntos = reglas.base + puntosPorTramo(reglas.tramosPrecio, ctx.ratioPrecio);

  if (respuestas.yaAnunciado === "si" && respuestas.tiempoAnunciado) {
    puntos += reglas.tiempoAnunciado[respuestas.tiempoAnunciado];
  }

  puntos += reglas.estado[respuestas.estado] ?? 0;

  for (const tramo of reglas.demandaBaja) {
    if (ctx.demandaZona < tramo.umbral) puntos += tramo.puntos;
  }

  return clamp(Math.round(puntos));
}

/** Horquilla orientativa de salida, redondeada para no aparentar precisión falsa */
function calcularHorquilla(ctx: ContextoCalculo): { inferior: number; superior: number } {
  const { horquilla } = ctx.config.precio;
  const redondear = (v: number) => Math.round(v / horquilla.redondeo) * horquilla.redondeo;
  return {
    inferior: redondear(ctx.precioReferencia * horquilla.inferior),
    superior: redondear(ctx.precioReferencia * horquilla.superior),
  };
}

function nivelDeRiesgo(riesgo: number, config: ConfigScoring): NivelRiesgo {
  if (riesgo <= config.riesgo.niveles.bajo) return "bajo";
  if (riesgo <= config.riesgo.niveles.medio) return "medio";
  return "alto";
}

function puntuacionGeneral(ind: Indicadores, config: ConfigScoring): number {
  const p = config.pesos;
  const total = p.encajeDemanda + p.atractivo + p.competitividadPrecio + p.preparacion + p.riesgoEstancamiento;
  const suma =
    ind.encajeDemanda * p.encajeDemanda +
    ind.atractivo * p.atractivo +
    ind.competitividadPrecio * p.competitividadPrecio +
    ind.preparacion * p.preparacion +
    (100 - ind.riesgoEstancamiento) * p.riesgoEstancamiento;
  return clamp(Math.round(suma / total));
}

export function calcularDiagnostico(
  entrada: RespuestasDiagnostico,
  config: ConfigScoring = CONFIG_SCORING,
): ResultadoDiagnostico {
  const respuestas = normalizarRespuestas(entrada);
  const ctx = construirContexto(respuestas, config);

  const indicadores: Indicadores = {
    encajeDemanda: calcularEncajeDemanda(ctx),
    atractivo: calcularAtractivo(ctx),
    competitividadPrecio: calcularCompetitividadPrecio(ctx),
    preparacion: calcularPreparacion(ctx),
    riesgoEstancamiento: calcularRiesgoEstancamiento(ctx),
  };

  const nivelRiesgo = nivelDeRiesgo(indicadores.riesgoEstancamiento, config);
  const { fortalezas, aRevisar } = construirFactores(ctx, indicadores);

  const id = "dx-" + fnv1a(config.version + "|" + JSON.stringify(respuestas));

  return {
    id,
    version: config.version,
    respuestas,
    indicadores,
    puntuacionGeneral: puntuacionGeneral(indicadores, config),
    nivelRiesgo,
    fortalezas,
    aRevisar,
    explicacion: construirExplicacion(ctx, indicadores, nivelRiesgo),
    lecturaIndicadores: construirLecturas(ctx, indicadores),
    porques: construirPorques(ctx, indicadores),
    posicionPrecio: calcularPosicionPrecio(ctx.ratioPrecio),
    horquillaSalida: calcularHorquilla(ctx),
    planSalida: construirPlanSalida(ctx, indicadores),
    perfilComprador: construirPerfilComprador(ctx),
  };
}
