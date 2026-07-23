/**
 * Diagnóstico inicial de salida al mercado — tipos compartidos.
 *
 * PROTOTIPO con datos simulados (mock). Nada de lo que produce este módulo
 * es una valoración real ni sustituye la revisión de un profesional.
 */

export type TipoVivienda = "piso" | "atico" | "planta-baja" | "casa" | "adosada";

export type EstadoVivienda = "reformado" | "buen-estado" | "actualizar" | "reformar";

export type Caracteristica = "terraza" | "balcon" | "jardin" | "parking" | "vistas" | "piscina";

export type TiempoAnunciado = "menos-1-mes" | "1-3-meses" | "3-6-meses" | "mas-6-meses";

export type HorizonteVenta = "cuanto-antes" | "3-6-meses" | "este-anyo" | "explorando";

export interface RespuestasDiagnostico {
  municipio: string;
  /** Nombre libre cuando municipio === "otro"; null en el resto de casos */
  municipioOtro: string | null;
  zona: string;
  tipo: TipoVivienda;
  /** m² construidos aproximados */
  superficie: number;
  /** 0 = estudio · 5 = cinco o más */
  habitaciones: number;
  /** 1..3 (3 = tres o más) */
  banos: number;
  ascensor: "si" | "no";
  caracteristicas: Caracteristica[];
  estado: EstadoVivienda;
  /** Precio que el propietario espera conseguir, en euros */
  precioEsperado: number;
  yaAnunciado: "si" | "no";
  /** null cuando yaAnunciado === "no" */
  tiempoAnunciado: TiempoAnunciado | null;
  horizonte: HorizonteVenta;
}

export interface Indicadores {
  /** Encaje con la demanda de la zona y tipología (0–100, más es mejor) */
  encajeDemanda: number;
  /** Atractivo del inmueble (0–100, más es mejor) */
  atractivo: number;
  /** Competitividad del precio indicado (0–100, más es mejor) */
  competitividadPrecio: number;
  /** Preparación para salir al mercado (0–100, más es mejor) */
  preparacion: number;
  /** Riesgo de estancamiento (0–100, MÁS ES PEOR) */
  riesgoEstancamiento: number;
}

export type NivelRiesgo = "bajo" | "medio" | "alto";

/**
 * Posición cualitativa del precio esperado frente a la horquilla de la zona.
 * A propósito NO existe "por debajo": decirle a un propietario que podría
 * pedir más ancla la negociación posterior y es muy difícil de deshacer.
 * Un precio prudente se comunica como "dentro de la horquilla".
 */
export type PosicionPrecio = "en-banda" | "parte-alta" | "por-encima";

export interface PasoPlan {
  titulo: string;
  texto: string;
}

export interface Factor {
  id: string;
  texto: string;
  /** Peso interno para ordenar de forma estable qué factores se muestran */
  peso: number;
}

export interface ResultadoDiagnostico {
  /** Identificador estable: mismas respuestas + misma config → mismo id */
  id: string;
  version: string;
  respuestas: RespuestasDiagnostico;
  indicadores: Indicadores;
  puntuacionGeneral: number;
  nivelRiesgo: NivelRiesgo;
  fortalezas: Factor[];
  aRevisar: Factor[];
  /** Párrafos de explicación generados por reglas y plantillas */
  explicacion: string[];
  /** Lectura en una línea de cada indicador */
  lecturaIndicadores: Record<keyof Indicadores, string>;
  /** El porqué de cada nota: los factores concretos que la explican */
  porques: Record<keyof Indicadores, string[]>;
  posicionPrecio: PosicionPrecio;
  /**
   * Horquilla orientativa de salida en euros (redondeada). Sale de las
   * referencias simuladas por zona/tipología: SIEMPRE se presenta como
   * orientativa y pendiente de visita.
   */
  horquillaSalida: { inferior: number; superior: number };
  /** Plan de salida recomendado, por orden */
  planSalida: PasoPlan[];
  /** A quién le encaja esta vivienda, según tipología/estado/zona */
  perfilComprador: string;
}

export type EstadoLead = "nuevo" | "contactado" | "visita-agendada" | "descartado";

export interface DatosContacto {
  nombre: string;
  telefono: string;
  email: string;
  aceptaPrivacidad: boolean;
  aceptaContacto: boolean;
  quiereLlamada: boolean;
  franjaLlamada: "manana" | "tarde" | null;
}

export interface RegistroDiagnostico {
  resultado: ResultadoDiagnostico;
  contacto: DatosContacto | null;
  estadoLead: EstadoLead;
  /** ISO 8601 — metadato de almacenamiento, NO forma parte del resultado */
  creadoEn: string;
  /** true cuando se sembró desde el modo demo o el panel */
  demo: boolean;
}
