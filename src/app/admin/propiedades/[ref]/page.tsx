import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import PropertyDetail from "./PropertyDetail";

export const dynamic = "force-dynamic";

interface FullRow {
  ref: string; slug: string; titulo: string; tipo: string; subtipo: string | null;
  operacion: string; precio: number; precio_anterior: number | null;
  outlet: number; porcentaje_bajada: number | null; estado_ficha: number;
  descripcion: string | null; ciudad: string | null; provincia: string | null;
  cp: string | null; zona: string | null; direccion: string | null;
  habitaciones: number | null; banos: number | null;
  m2_construidos: number | null; m2_utiles: number | null; m2_parcela: number | null;
  planta: string | null; num_plantas: number | null;
  ascensor: number; garaje: number; garaje_tipo: string | null; trastero: number;
  urbanizacion: number; piscina: number; piscina_privada: number; piscina_com: number;
  terraza: number; jardin: number; balcon: number; solarium: number;
  barbacoa: number; chimenea: number; vistas_al_mar: number;
  amueblado: number; arma_empotrado: number;
  calefaccion: string | null; aire_cond: number; bomba_frio_calor: number;
  orientacion: string | null; antiguedad: string | null; estado: string | null;
  ibi: number | null; gastos_comun: number | null; periodicidad_comunidad: string | null;
  certificado_energetico: string | null; consumo_energetico: string | null;
  emisiones_letra: string | null; emisiones_energeticas: string | null; energia_exento: number;
  agente: string | null; agente_email: string | null;
  agente_foto: string | null; agente_telefono: string | null;
  fecha: string | null; fechaact: string | null; updated_at: string | null;
  admin_status: string; sold_by: string | null; admin_notes: string | null;
}

function getProperty(ref: string): FullRow | null {
  try {
    const db = getDb();
    return db.prepare("SELECT * FROM properties WHERE ref = ?").get(ref) as FullRow | null;
  } catch { return null; }
}

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const row = getProperty(ref);
  if (!row) notFound();
  return <PropertyDetail row={row} />;
}
