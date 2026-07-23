/**
 * Reglas de puntuación del diagnóstico — ARCHIVO DE CONFIGURACIÓN EDITABLE.
 *
 * Todo lo que decide una puntuación vive aquí: pesos, umbrales y ajustes.
 * El motor (motor.ts) solo aplica estas reglas; no contiene números propios.
 *
 * Si cambias cualquier valor, sube ALGORITMO_VERSION para que los
 * diagnósticos guardados queden trazados a la config con la que se calcularon.
 *
 * Sin números aleatorios: misma combinación de respuestas + misma config
 * → exactamente el mismo resultado, siempre.
 */

import type { EstadoVivienda, HorizonteVenta, TipoVivienda, TiempoAnunciado } from "./tipos";

export const ALGORITMO_VERSION = "1.1.0";

/** Tramo de ratio precio esperado / precio de referencia → puntos */
export interface TramoRatio {
  /** Se aplica si ratio <= hasta (el último tramo usa Infinity) */
  hasta: number;
  puntos: number;
}

export interface ConfigScoring {
  version: string;

  /** Pesos de la puntuación general. Deben sumar 100. El riesgo puntúa invertido (100 − riesgo). */
  pesos: {
    encajeDemanda: number;
    atractivo: number;
    competitividadPrecio: number;
    preparacion: number;
    riesgoEstancamiento: number;
  };

  precio: {
    /** Ajuste del precio de referencia según estado de la vivienda */
    factorEstado: Record<EstadoVivienda, number>;
    /** Ajuste del €/m² base de la zona según tipología */
    factorTipo: Record<TipoVivienda, number>;
    /** Tramos de ratio (precio esperado / referencia) → puntos de competitividad */
    tramos: TramoRatio[];
    /**
     * Los metros por encima de `plena` cuentan a `factorExtra`: una casa de
     * 275 m² no vale el doble que una de 137 — el €/m² real cae con el
     * tamaño. Sin esto, las viviendas grandes salían con horquillas infladas.
     */
    superficieEquivalente: {
      plena: number;
      factorExtra: number;
    };
    /** Horquilla orientativa de salida alrededor del precio de referencia */
    horquilla: {
      /** Multiplicador del límite inferior (p. ej. 0.95) */
      inferior: number;
      /** Multiplicador del límite superior (p. ej. 1.05) */
      superior: number;
      /** Redondeo en euros para no aparentar precisión falsa (p. ej. 5000) */
      redondeo: number;
    };
  };

  encaje: {
    /** Ajuste por nº de habitaciones respecto al rango más demandado por tipología */
    habitacionesIdeales: Record<TipoVivienda, { min: number; max: number }>;
    dentroRangoHabitaciones: number;
    fueraRangoHabitaciones: number;
    /** Superficies muy pequeñas o muy grandes encajan con menos compradores */
    superficieMinimaComoda: number;
    superficieMaximaComoda: number;
    ajusteSuperficieExtrema: number;
  };

  atractivo: {
    base: number;
    estado: Record<EstadoVivienda, number>;
    /** El ascensor solo puntúa en tipologías de edificio (piso / ático) */
    ascensorSi: number;
    ascensorNoPiso: number;
    ascensorNoAtico: number;
    caracteristicas: {
      terraza: number;
      terrazaEnAtico: number;
      balcon: number;
      jardin: number;
      parking: number;
      vistas: number;
      piscina: number;
    };
    segundoBano: number;
  };

  preparacion: {
    base: number;
    estado: Record<EstadoVivienda, number>;
    horizonte: Record<HorizonteVenta, number>;
    /** Llevar tiempo anunciado obliga a reposicionar el anuncio */
    tiempoAnunciado: Record<TiempoAnunciado, number>;
    sinAnunciar: number;
    /** Penalización si el precio esperado supera este ratio sobre la referencia */
    ratioPrecioDesalineado: number;
    ajustePrecioDesalineado: number;
  };

  riesgo: {
    base: number;
    /** Tramos de ratio de precio → puntos de riesgo añadidos */
    tramosPrecio: TramoRatio[];
    tiempoAnunciado: Record<TiempoAnunciado, number>;
    estado: Partial<Record<EstadoVivienda, number>>;
    /** Riesgo añadido cuando la demanda de la zona (0–100) queda por debajo de cada umbral */
    demandaBaja: { umbral: number; puntos: number }[];
    /** Umbrales del nivel de riesgo: <= bajo → "bajo", <= medio → "medio", resto "alto" */
    niveles: { bajo: number; medio: number };
  };
}

export const CONFIG_SCORING: ConfigScoring = {
  version: ALGORITMO_VERSION,

  pesos: {
    encajeDemanda: 22,
    atractivo: 24,
    competitividadPrecio: 28,
    preparacion: 14,
    riesgoEstancamiento: 12,
  },

  precio: {
    factorEstado: {
      reformado: 1.12,
      "buen-estado": 1.0,
      actualizar: 0.88,
      reformar: 0.72,
    },
    factorTipo: {
      piso: 1.0,
      atico: 1.15,
      "planta-baja": 0.92,
      casa: 1.05,
      adosada: 1.0,
    },
    tramos: [
      { hasta: 0.92, puntos: 95 },
      { hasta: 1.0, puntos: 88 },
      { hasta: 1.05, puntos: 78 },
      { hasta: 1.12, puntos: 62 },
      { hasta: 1.2, puntos: 45 },
      { hasta: 1.35, puntos: 28 },
      { hasta: Infinity, puntos: 15 },
    ],
    superficieEquivalente: {
      plena: 130,
      factorExtra: 0.6,
    },
    horquilla: {
      inferior: 0.95,
      superior: 1.05,
      redondeo: 5000,
    },
  },

  encaje: {
    habitacionesIdeales: {
      piso: { min: 2, max: 3 },
      atico: { min: 2, max: 3 },
      "planta-baja": { min: 2, max: 3 },
      casa: { min: 3, max: 4 },
      adosada: { min: 3, max: 4 },
    },
    dentroRangoHabitaciones: 6,
    fueraRangoHabitaciones: -5,
    superficieMinimaComoda: 45,
    superficieMaximaComoda: 260,
    ajusteSuperficieExtrema: -6,
  },

  atractivo: {
    base: 48,
    estado: {
      reformado: 18,
      "buen-estado": 10,
      actualizar: -4,
      reformar: -14,
    },
    ascensorSi: 9,
    ascensorNoPiso: -12,
    ascensorNoAtico: -18,
    caracteristicas: {
      terraza: 8,
      terrazaEnAtico: 11,
      balcon: 4,
      jardin: 8,
      parking: 6,
      vistas: 6,
      piscina: 9,
    },
    segundoBano: 4,
  },

  preparacion: {
    base: 52,
    estado: {
      reformado: 18,
      "buen-estado": 12,
      actualizar: -2,
      reformar: -10,
    },
    horizonte: {
      "cuanto-antes": 12,
      "3-6-meses": 10,
      "este-anyo": 4,
      explorando: -6,
    },
    tiempoAnunciado: {
      "menos-1-mes": -2,
      "1-3-meses": -5,
      "3-6-meses": -9,
      "mas-6-meses": -14,
    },
    sinAnunciar: 6,
    ratioPrecioDesalineado: 1.2,
    ajustePrecioDesalineado: -8,
  },

  riesgo: {
    base: 18,
    tramosPrecio: [
      { hasta: 1.0, puntos: 0 },
      { hasta: 1.05, puntos: 8 },
      { hasta: 1.12, puntos: 18 },
      { hasta: 1.2, puntos: 30 },
      { hasta: 1.35, puntos: 45 },
      { hasta: Infinity, puntos: 58 },
    ],
    tiempoAnunciado: {
      "menos-1-mes": 2,
      "1-3-meses": 6,
      "3-6-meses": 14,
      "mas-6-meses": 22,
    },
    estado: {
      actualizar: 4,
      reformar: 9,
    },
    demandaBaja: [
      { umbral: 55, puntos: 8 },
      { umbral: 40, puntos: 8 },
    ],
    niveles: { bajo: 33, medio: 62 },
  },
};

/** Devuelve los puntos del primer tramo cuyo límite cubre el ratio */
export function puntosPorTramo(tramos: TramoRatio[], ratio: number): number {
  for (const tramo of tramos) {
    if (ratio <= tramo.hasta) return tramo.puntos;
  }
  return tramos[tramos.length - 1]?.puntos ?? 0;
}
