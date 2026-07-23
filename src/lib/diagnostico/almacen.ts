/**
 * Almacén del prototipo: los diagnósticos viven en localStorage del navegador.
 *
 * Decisión deliberada — es una demo navegable sin backend: nada se envía a
 * ningún servidor ni se escribe en el Blob de producción. Cada navegador ve
 * solo sus propios registros. Si el prototipo se aprueba, este módulo es el
 * único que habría que sustituir por una persistencia real.
 */

import { ALGORITMO_VERSION, CONFIG_SCORING, type ConfigScoring } from "./config-scoring";
import { calcularDiagnostico } from "./motor";
import { CASOS_EJEMPLO, OTRO_MUNICIPIO, nombresUbicacion } from "./referencias-mock";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_ESTADO_LEAD,
  ETIQUETA_NIVEL_RIESGO,
  ETIQUETA_TIPO,
} from "./etiquetas";
import type { DatosContacto, EstadoLead, RegistroDiagnostico } from "./tipos";

const CLAVE_REGISTROS = "tvh-diagnostico:registros";
const CLAVE_PESOS = "tvh-diagnostico:pesos";

function hayVentana(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/* ── Suscripción (para useSyncExternalStore en el panel) ─────────────────── */

const oyentes = new Set<() => void>();
let cacheRegistros: RegistroDiagnostico[] | null = null;
let cachePesos: { valor: PesosScoring | null } | null = null;

function notificar(): void {
  cacheRegistros = null;
  cachePesos = null;
  oyentes.forEach((fn) => fn());
}

export function suscribirAlmacen(cb: () => void): () => void {
  oyentes.add(cb);
  return () => oyentes.delete(cb);
}

/** Instantánea estable de los registros (cacheada hasta el siguiente cambio) */
export function instantaneaRegistros(): RegistroDiagnostico[] {
  if (cacheRegistros === null) cacheRegistros = cargarRegistros();
  return cacheRegistros;
}

const SIN_REGISTROS: RegistroDiagnostico[] = [];
export function instantaneaRegistrosServidor(): RegistroDiagnostico[] {
  return SIN_REGISTROS;
}

/** Instantánea estable de los pesos guardados desde el panel (o null) */
export function instantaneaPesos(): PesosScoring | null {
  if (cachePesos === null) cachePesos = { valor: cargarPesosOverride() };
  return cachePesos.valor;
}

export function instantaneaPesosServidor(): PesosScoring | null {
  return null;
}

export function cargarRegistros(): RegistroDiagnostico[] {
  if (!hayVentana()) return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE_REGISTROS);
    if (!crudo) return [];
    const lista = JSON.parse(crudo) as RegistroDiagnostico[];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function persistir(registros: RegistroDiagnostico[]): void {
  if (!hayVentana()) return;
  try {
    window.localStorage.setItem(CLAVE_REGISTROS, JSON.stringify(registros));
  } catch {
    // Cuota llena o modo privado: la demo sigue funcionando sin persistencia
  }
  notificar();
}

/** Guarda (o actualiza, si ya existe el mismo id) un registro y lo devuelve */
export function guardarRegistro(registro: RegistroDiagnostico): RegistroDiagnostico {
  const registros = cargarRegistros();
  const indice = registros.findIndex((r) => r.resultado.id === registro.resultado.id);
  if (indice >= 0) {
    // Mismo diagnóstico repetido: conservamos la fecha original y el contacto previo si el nuevo no trae
    const previo = registros[indice];
    registros[indice] = {
      ...registro,
      creadoEn: previo.creadoEn,
      contacto: registro.contacto ?? previo.contacto,
      estadoLead: previo.estadoLead,
    };
    persistir(registros);
    return registros[indice];
  }
  registros.unshift(registro);
  persistir(registros);
  return registro;
}

export function adjuntarContacto(idResultado: string, contacto: DatosContacto): void {
  const registros = cargarRegistros();
  const registro = registros.find((r) => r.resultado.id === idResultado);
  if (!registro) return;
  registro.contacto = contacto;
  persistir(registros);
}

export function cambiarEstadoLead(idResultado: string, estado: EstadoLead): void {
  const registros = cargarRegistros();
  const registro = registros.find((r) => r.resultado.id === idResultado);
  if (!registro) return;
  registro.estadoLead = estado;
  persistir(registros);
}

export function borrarRegistros(): void {
  if (!hayVentana()) return;
  window.localStorage.removeItem(CLAVE_REGISTROS);
  notificar();
}

/* ── Pesos editables desde el panel ──────────────────────────────────────── */

export type PesosScoring = ConfigScoring["pesos"];

export function cargarPesosOverride(): PesosScoring | null {
  if (!hayVentana()) return null;
  try {
    const crudo = window.localStorage.getItem(CLAVE_PESOS);
    return crudo ? (JSON.parse(crudo) as PesosScoring) : null;
  } catch {
    return null;
  }
}

export function guardarPesosOverride(pesos: PesosScoring): void {
  if (!hayVentana()) return;
  window.localStorage.setItem(CLAVE_PESOS, JSON.stringify(pesos));
  notificar();
}

export function restaurarPesos(): void {
  if (!hayVentana()) return;
  window.localStorage.removeItem(CLAVE_PESOS);
  notificar();
}

/**
 * Config vigente: la del archivo, o con los pesos ajustados desde el panel.
 * Cuando hay override, la versión se marca para que quede trazado que el
 * resultado no salió de la config canónica del archivo.
 */
export function configVigente(): ConfigScoring {
  const pesos = cargarPesosOverride();
  if (!pesos) return CONFIG_SCORING;
  return { ...CONFIG_SCORING, pesos, version: `${ALGORITMO_VERSION}+panel` };
}

/* ── Datos de prueba ─────────────────────────────────────────────────────── */

const CONTACTOS_DEMO: (DatosContacto | null)[] = [
  {
    nombre: "Marta Ferrer",
    telefono: "600 111 222",
    email: "marta.demo@example.com",
    aceptaPrivacidad: true,
    aceptaContacto: true,
    quiereLlamada: true,
    franjaLlamada: "manana",
  },
  null,
  {
    nombre: "Jordi Soler",
    telefono: "611 333 444",
    email: "jordi.demo@example.com",
    aceptaPrivacidad: true,
    aceptaContacto: true,
    quiereLlamada: false,
    franjaLlamada: null,
  },
  {
    nombre: "Anna Puig",
    telefono: "622 555 666",
    email: "anna.demo@example.com",
    aceptaPrivacidad: true,
    aceptaContacto: true,
    quiereLlamada: true,
    franjaLlamada: "tarde",
  },
  null,
];

/** Siembra los cinco casos de ejemplo como registros demo. Devuelve cuántos añadió. */
export function sembrarDatosDemo(): number {
  const existentes = cargarRegistros();
  const ahora = Date.now();
  let anadidos = 0;
  CASOS_EJEMPLO.forEach((caso, i) => {
    const resultado = calcularDiagnostico(caso.respuestas, configVigente());
    if (existentes.some((r) => r.resultado.id === resultado.id)) return;
    existentes.push({
      resultado,
      contacto: CONTACTOS_DEMO[i % CONTACTOS_DEMO.length],
      estadoLead: "nuevo",
      // Fechas escalonadas hacia atrás para que la lista tenga vida
      creadoEn: new Date(ahora - (i + 1) * 36e5 * 7).toISOString(),
      demo: true,
    });
    anadidos++;
  });
  persistir(existentes);
  return anadidos;
}

/* ── Exportación CSV ─────────────────────────────────────────────────────── */

function celda(valor: string | number | boolean | null | undefined): string {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  return `"${texto.replace(/"/g, '""')}"`;
}

export function registrosACsv(registros: RegistroDiagnostico[]): string {
  const cabecera = [
    "id",
    "fecha",
    "version_algoritmo",
    "municipio",
    "zona",
    "tipologia",
    "superficie_m2",
    "habitaciones",
    "banos",
    "ascensor",
    "caracteristicas",
    "estado_vivienda",
    "precio_esperado",
    "horquilla_inferior",
    "horquilla_superior",
    "ya_anunciado",
    "tiempo_anunciado",
    "horizonte",
    "encaje_demanda",
    "atractivo",
    "competitividad_precio",
    "preparacion",
    "riesgo_estancamiento",
    "puntuacion_general",
    "nivel_riesgo",
    "nombre",
    "telefono",
    "email",
    "quiere_llamada",
    "franja_llamada",
    "estado_lead",
    "demo",
  ];

  const filas = registros.map((reg) => {
    const { resultado: res, contacto } = reg;
    const r = res.respuestas;
    const nombres = nombresUbicacion(r);
    return [
      res.id,
      reg.creadoEn,
      res.version,
      r.municipio === OTRO_MUNICIPIO ? `Otra: ${nombres.municipio}` : nombres.municipio,
      r.municipio === OTRO_MUNICIPIO ? "" : nombres.zona,
      ETIQUETA_TIPO[r.tipo],
      r.superficie,
      r.habitaciones,
      r.banos,
      r.ascensor,
      r.caracteristicas.join(" · "),
      ETIQUETA_ESTADO[r.estado],
      r.precioEsperado,
      res.horquillaSalida?.inferior ?? "",
      res.horquillaSalida?.superior ?? "",
      r.yaAnunciado,
      r.tiempoAnunciado ?? "",
      r.horizonte,
      res.indicadores.encajeDemanda,
      res.indicadores.atractivo,
      res.indicadores.competitividadPrecio,
      res.indicadores.preparacion,
      res.indicadores.riesgoEstancamiento,
      res.puntuacionGeneral,
      ETIQUETA_NIVEL_RIESGO[res.nivelRiesgo],
      contacto?.nombre ?? "",
      contacto?.telefono ?? "",
      contacto?.email ?? "",
      contacto ? (contacto.quiereLlamada ? "si" : "no") : "",
      contacto?.franjaLlamada ?? "",
      ETIQUETA_ESTADO_LEAD[reg.estadoLead],
      reg.demo ? "si" : "no",
    ]
      .map(celda)
      .join(";");
  });

  // BOM para que Excel abra los acentos bien
  return "﻿" + [cabecera.map(celda).join(";"), ...filas].join("\r\n");
}

export function descargarCsv(registros: RegistroDiagnostico[]): void {
  if (!hayVentana()) return;
  const blob = new Blob([registrosACsv(registros)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `diagnosticos-tvh-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
