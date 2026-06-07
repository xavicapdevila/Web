import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import OperacionDetail from "./OperacionDetail";

export const dynamic = "force-dynamic";

export interface PropertyData {
  ref: string; slug: string; titulo: string; tipo: string; subtipo: string | null;
  operacion: string; precio: number; ciudad: string | null;
  habitaciones: number | null; banos: number | null;
  m2_construidos: number | null; imagenes: string;
  agente: string | null; agente_email: string | null;
}

export interface OperacionData {
  ref: string; estado: string;
  precio_inicial: number | null;
  honorarios_tipo: string; honorarios_valor: number | null; honorarios_iva: number;
  propietario_nombre: string | null; propietario_telefono: string | null;
  propietario_email: string | null; propietario_nif: string | null;
  propietario_notas: string | null; observaciones: string | null;
  fecha_inicio: string | null; fecha_cierre: string | null;
  created_at: string; updated_at: string;
}

export interface SeguimientoEntry {
  id: number; ref: string; fecha: string; tipo: string;
  notas: string | null; agente: string | null; created_at: string;
}

export interface VisitaEntry {
  id: number; ref: string; fecha: string;
  nombre_contacto: string | null; telefono_contacto: string | null;
  valoracion: string; notas: string | null; agente: string | null; created_at: string;
}

export interface DocumentoEntry {
  id: number; ref: string; nombre: string; tipo: string; url: string | null; created_at: string;
}

export interface HistorialEntry {
  id: number; ref: string; evento: string;
  descripcion: string | null; agente: string | null; created_at: string;
}

function getData(ref: string) {
  try {
    const db = getDb();
    const property = db.prepare(`
      SELECT ref, slug, titulo, tipo, subtipo, operacion, precio, ciudad,
             habitaciones, banos, m2_construidos, imagenes, agente, agente_email
      FROM properties WHERE ref = ?
    `).get(ref) as PropertyData | undefined;
    if (!property) return null;

    const operacion = (db.prepare(`SELECT * FROM operaciones WHERE ref = ?`).get(ref) as OperacionData | undefined)
      ?? { ref, estado: "en_venta", precio_inicial: null, honorarios_tipo: "porcentaje", honorarios_valor: 3.0, honorarios_iva: 0,
           propietario_nombre: null, propietario_telefono: null, propietario_email: null, propietario_nif: null,
           propietario_notas: null, observaciones: null, fecha_inicio: null, fecha_cierre: null,
           created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

    const seguimiento = db.prepare(`SELECT * FROM operaciones_seguimiento WHERE ref = ? ORDER BY fecha DESC`).all(ref) as SeguimientoEntry[];
    const visitas = db.prepare(`SELECT * FROM operaciones_visitas WHERE ref = ? ORDER BY fecha DESC`).all(ref) as VisitaEntry[];
    const documentos = db.prepare(`SELECT * FROM operaciones_documentos WHERE ref = ? ORDER BY created_at DESC`).all(ref) as DocumentoEntry[];
    const historial = db.prepare(`SELECT * FROM operaciones_historial WHERE ref = ? ORDER BY created_at DESC`).all(ref) as HistorialEntry[];

    return { property, operacion, seguimiento, visitas, documentos, historial };
  } catch {
    return null;
  }
}

export default async function OperacionDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const data = getData(ref);
  if (!data) notFound();
  return <OperacionDetail {...data} />;
}
