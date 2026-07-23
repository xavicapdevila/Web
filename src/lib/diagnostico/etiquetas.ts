/**
 * Etiquetas en castellano compartidas por la interfaz, las plantillas y el
 * CSV del panel. Un único sitio para que los textos no diverjan.
 */

import type {
  Caracteristica,
  EstadoLead,
  EstadoVivienda,
  HorizonteVenta,
  Indicadores,
  NivelRiesgo,
  PosicionPrecio,
  TiempoAnunciado,
  TipoVivienda,
} from "./tipos";

export const ETIQUETA_TIPO: Record<TipoVivienda, string> = {
  piso: "Piso",
  atico: "Ático",
  "planta-baja": "Planta baja",
  casa: "Casa / chalet",
  adosada: "Casa adosada",
};

/** Con artículo, para frases: "un piso", "una casa adosada"… */
export const TIPO_EN_FRASE: Record<TipoVivienda, string> = {
  piso: "un piso",
  atico: "un ático",
  "planta-baja": "una planta baja",
  casa: "una casa",
  adosada: "una casa adosada",
};

export const ETIQUETA_ESTADO: Record<EstadoVivienda, string> = {
  reformado: "Reformado",
  "buen-estado": "Buen estado",
  actualizar: "Para actualizar",
  reformar: "Para reformar",
};

export const ETIQUETA_CARACTERISTICA: Record<Caracteristica, string> = {
  terraza: "Terraza",
  balcon: "Balcón",
  jardin: "Jardín",
  parking: "Parking",
  vistas: "Vistas",
};

export const ETIQUETA_TIEMPO_ANUNCIADO: Record<TiempoAnunciado, string> = {
  "menos-1-mes": "Menos de 1 mes",
  "1-3-meses": "Entre 1 y 3 meses",
  "3-6-meses": "Entre 3 y 6 meses",
  "mas-6-meses": "Más de 6 meses",
};

export const ETIQUETA_HORIZONTE: Record<HorizonteVenta, string> = {
  "cuanto-antes": "Cuanto antes",
  "3-6-meses": "En 3–6 meses",
  "este-anyo": "Este año",
  explorando: "Solo estoy explorando",
};

export const ETIQUETA_INDICADOR: Record<keyof Indicadores, string> = {
  encajeDemanda: "Encaje con la demanda",
  atractivo: "Atractivo del inmueble",
  competitividadPrecio: "Competitividad del precio",
  preparacion: "Preparación para vender",
  riesgoEstancamiento: "Riesgo de estancamiento",
};

export const ETIQUETA_NIVEL_RIESGO: Record<NivelRiesgo, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
};

export const ETIQUETA_POSICION_PRECIO: Record<PosicionPrecio, string> = {
  "en-banda": "En la horquilla",
  "parte-alta": "Parte alta",
  "por-encima": "Por encima",
};

export const ORDEN_POSICIONES_PRECIO: PosicionPrecio[] = [
  "en-banda",
  "parte-alta",
  "por-encima",
];

export const ETIQUETA_ESTADO_LEAD: Record<EstadoLead, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  "visita-agendada": "Visita agendada",
  descartado: "Descartado",
};

export const ORDEN_ESTADOS_LEAD: EstadoLead[] = [
  "nuevo",
  "contactado",
  "visita-agendada",
  "descartado",
];

/** Partículas que quedan en minúscula salvo al inicio: "Castellet i la Gornal" */
const PARTICULAS = new Set(["de", "del", "dels", "la", "les", "el", "els", "i", "y", "sa", "ses"]);

/**
 * Iniciales en mayúscula para topónimos (regla global TVH de nombres):
 * "les roquetes" → "Les Roquetes" · "l'arboç" → "L'Arboç" ·
 * "castellet i la gornal" → "Castellet i la Gornal".
 */
export function capitalizarIniciales(texto: string): string {
  return texto
    .toLowerCase()
    .split(/\s+/)
    .map((palabra, i) => {
      if (i > 0 && PARTICULAS.has(palabra)) return palabra;
      return palabra
        .replace(/^\p{L}/u, (letra) => letra.toUpperCase())
        .replace(/(['’])(\p{L})/gu, (_, apostrofe, letra) => apostrofe + letra.toUpperCase());
    })
    .join(" ");
}
