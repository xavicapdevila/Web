import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT
        p.ref, p.slug, p.titulo, p.tipo, p.subtipo,
        p.operacion AS tipo_operacion,
        p.precio    AS precio_actual,
        p.ciudad, p.habitaciones, p.m2_construidos, p.imagenes,
        COALESCE(o.estado, 'en_venta') AS estado_op,
        o.propietario_nombre, o.precio_inicial,
        o.honorarios_tipo, o.honorarios_valor, o.fecha_inicio
      FROM properties p
      LEFT JOIN operaciones o ON p.ref = o.ref
      ORDER BY p.fecha DESC
    `).all();
    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json({ error: "Error al obtener operaciones" }, { status: 500 });
  }
}
