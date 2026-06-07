import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

/** GET /api/admin/pendientes — returns unresolved pending actions */
export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const db = getDb();
    const pendientes = db.prepare(`
      SELECT p.*, o.estado as op_estado
      FROM operaciones_pendientes p
      LEFT JOIN operaciones o ON p.ref = o.ref
      WHERE p.resuelta = 0
      ORDER BY p.created_at DESC
    `).all();
    return NextResponse.json({ pendientes, count: pendientes.length });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
