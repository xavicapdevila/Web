import { getDb } from "@/lib/db";
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
  habitaciones:   number | null;
  banos:          number | null;
  m2_construidos: number | null;
  estado_ficha:   number;
  imagenes:       string;
  plano_pins:     string;
  fecha:          string;
  fechaact:       string | null;
}

function getProperties(): PropRow[] {
  try {
    const db = getDb();
    return db
      .prepare(
        `SELECT ref, slug, titulo, tipo, subtipo, operacion, precio,
                ciudad, habitaciones, banos, m2_construidos,
                estado_ficha, imagenes, plano_pins, fecha, fechaact
         FROM properties
         ORDER BY fecha DESC`
      )
      .all() as PropRow[];
  } catch {
    return [];
  }
}

export default function AdminPropertiesPage() {
  const rows = getProperties();
  return <PropertiesClient rows={rows} />;
}
