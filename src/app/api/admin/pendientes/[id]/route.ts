import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

const ACCIONES: Record<string, { estado: string; evento: string; descripcion: string }> = {
  // salida_feed actions
  vendida_nosotros: {
    estado: "vendido",
    evento: "Vendida por The Vila Home",
    descripcion: "Operación cerrada. Vendida a través de The Vila Home.",
  },
  vendida_otros: {
    estado: "archivado",
    evento: "Vendida con terceros",
    descripcion: "La propiedad fue vendida a través de otra agencia o por el propietario.",
  },
  retirada: {
    estado: "archivado",
    evento: "Retirada del mercado",
    descripcion: "El propietario ha decidido retirar la propiedad del mercado.",
  },
  eliminar: { estado: "", evento: "", descripcion: "" },
  // reaparicion actions
  reactivar: {
    estado: "en_venta",
    evento: "Reactivada en el mercado",
    descripcion: "La propiedad ha vuelto al mercado tras estar archivada. Estado actualizado a En venta.",
  },
  mantener_cerrada: {
    estado: "",   // no change to estado
    evento: "Reaparición en feed ignorada",
    descripcion: "La propiedad volvió a aparecer en Inmovilla pero se mantiene cerrada en el CRM.",
  },
};

/**
 * PATCH /api/admin/pendientes/[id]
 * Body: { accion: "vendida_nosotros" | "vendida_otros" | "retirada" | "eliminar" }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;

  try {
    const { accion } = await req.json();
    if (!ACCIONES[accion]) return NextResponse.json({ error: "Acción no válida" }, { status: 400 });

    const db = getDb();
    const pendiente = db.prepare(`SELECT * FROM operaciones_pendientes WHERE id = ?`).get(id) as
      | { ref: string; titulo: string } | undefined;
    if (!pendiente) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const { ref } = pendiente;
    const cfg = ACCIONES[accion];

    if (accion === "eliminar") {
      // Remove all CRM data + the property itself
      db.prepare(`DELETE FROM operaciones_seguimiento WHERE ref = ?`).run(ref);
      db.prepare(`DELETE FROM operaciones_visitas    WHERE ref = ?`).run(ref);
      db.prepare(`DELETE FROM operaciones_documentos WHERE ref = ?`).run(ref);
      db.prepare(`DELETE FROM operaciones_historial  WHERE ref = ?`).run(ref);
      db.prepare(`DELETE FROM operaciones            WHERE ref = ?`).run(ref);
      db.prepare(`DELETE FROM properties             WHERE ref = ?`).run(ref);
    } else if (accion === "mantener_cerrada") {
      // No estado change — just log the decision and resolve the pending
      db.prepare(`
        INSERT INTO operaciones_historial (ref, evento, descripcion)
        VALUES (?, ?, ?)
      `).run(ref, cfg.evento, cfg.descripcion);
    } else {
      // Upsert the operaciones record with the new estado
      const existing = db.prepare(`SELECT 1 FROM operaciones WHERE ref = ?`).get(ref);
      if (existing) {
        db.prepare(`
          UPDATE operaciones SET estado = ?, updated_at = datetime('now') WHERE ref = ?
        `).run(cfg.estado, ref);
      } else {
        db.prepare(`INSERT INTO operaciones (ref, estado) VALUES (?, ?)`).run(ref, cfg.estado);
      }
      db.prepare(`
        INSERT INTO operaciones_historial (ref, evento, descripcion)
        VALUES (?, ?, ?)
      `).run(ref, cfg.evento, cfg.descripcion);
    }

    // Mark pending as resolved
    db.prepare(`
      UPDATE operaciones_pendientes
      SET resuelta = 1, resuelta_at = datetime('now'), accion = ?
      WHERE id = ?
    `).run(accion, id);

    const remaining = (db.prepare(`SELECT COUNT(*) as n FROM operaciones_pendientes WHERE resuelta = 0`).get() as { n: number }).n;
    return NextResponse.json({ ok: true, remaining });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al resolver" }, { status: 500 });
  }
}
