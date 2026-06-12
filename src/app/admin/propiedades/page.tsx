import { getDb, initDbFromBlob } from "@/lib/db";
import PropertiesClient from "./PropertiesClient";

export const metadata = { title: "Propiedades — Admin · The Vila Home" };
export const dynamic  = "force-dynamic";

interface PropRow {
  ref:            string;
  slug:           string;
  titulo:         string;
  tipo:           string;
  subtipo:        string | null;
  operacion:      string;
  precio:         number;
  ciudad:         string | null;
  zona:           string | null;
  direccion:      string | null;
  habitaciones:   number | null;
  banos:          number | null;
  m2_construidos: number | null;
  estado_ficha:   number;
  imagenes:       string;
  plano_pins:     string;
  fecha:          string;
  fechaact:       string | null;
  estado_op:      string;
}

async function getProperties(): Promise<PropRow[]> {
  // Restore DB from Blob on cold-start Vercel containers
  await initDbFromBlob();
  try {
    const db = getDb();
    return db
      .prepare(
        `SELECT p.ref, p.slug, p.titulo, p.tipo, p.subtipo, p.operacion, p.precio,
                p.ciudad, p.zona, p.direccion, p.habitaciones, p.banos, p.m2_construidos,
                p.estado_ficha, p.imagenes, p.plano_pins, p.fecha, p.fechaact,
                COALESCE(o.estado, '') AS estado_op
         FROM properties p
         LEFT JOIN operaciones o ON o.ref = p.ref
         ORDER BY p.fecha DESC`
      )
      .all() as PropRow[];
  } catch {
    return [];
  }
}

export default async function AdminPropertiesPage() {
  const rows = await getProperties();
  return <PropertiesClient rows={rows} />;
}
