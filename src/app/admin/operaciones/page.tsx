import { getDbRestored } from "@/lib/db";
import OperacionesClient from "./OperacionesClient";

export const metadata = { title: "Operaciones — Admin · The Vila Home" };
export const dynamic  = "force-dynamic";

export interface OpRow {
  ref:                string;
  slug:               string;
  titulo:             string;
  tipo:               string;
  subtipo:            string | null;
  tipo_operacion:     string;
  precio_actual:      number;
  ciudad:             string | null;
  habitaciones:       number | null;
  m2_construidos:     number | null;
  imagenes:           string;
  estado_op:          string;
  propietario_nombre: string | null;
  precio_inicial:     number | null;
  honorarios_tipo:    string | null;
  honorarios_valor:   number | null;
  fecha_inicio:       string | null;
}

async function getOperaciones(): Promise<OpRow[]> {
  try {
    const db = await getDbRestored();
    return db.prepare(`
      SELECT
        p.ref, p.slug, p.titulo, p.tipo, p.subtipo,
        p.operacion            AS tipo_operacion,
        p.precio               AS precio_actual,
        p.ciudad, p.habitaciones, p.m2_construidos, p.imagenes,
        COALESCE(o.estado, 'en_venta') AS estado_op,
        o.propietario_nombre,
        o.precio_inicial,
        o.honorarios_tipo,
        o.honorarios_valor,
        o.fecha_inicio
      FROM properties p
      LEFT JOIN operaciones o ON p.ref = o.ref
      ORDER BY p.fecha DESC
    `).all() as OpRow[];
  } catch {
    return [];
  }
}

export default async function OperacionesPage() {
  const rows = await getOperaciones();
  return <OperacionesClient rows={rows} />;
}
