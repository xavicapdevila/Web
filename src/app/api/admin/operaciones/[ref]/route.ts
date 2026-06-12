import { NextRequest, NextResponse } from "next/server";
import { getDbRestored, persistDbToBlob } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = await getDbRestored();
    const property = db.prepare(`
      SELECT ref, slug, titulo, tipo, subtipo, operacion, precio, ciudad,
             habitaciones, banos, m2_construidos, imagenes, agente, agente_email
      FROM properties WHERE ref = ?
    `).get(ref);
    if (!property) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });

    const operacion = db.prepare(`SELECT * FROM operaciones WHERE ref = ?`).get(ref);
    const seguimiento = db.prepare(`SELECT * FROM operaciones_seguimiento WHERE ref = ? ORDER BY fecha DESC`).all(ref);
    const visitas = db.prepare(`SELECT * FROM operaciones_visitas WHERE ref = ? ORDER BY fecha DESC`).all(ref);
    const documentos = db.prepare(`SELECT * FROM operaciones_documentos WHERE ref = ? ORDER BY created_at DESC`).all(ref);
    const historial = db.prepare(`SELECT * FROM operaciones_historial WHERE ref = ? ORDER BY created_at DESC`).all(ref);

    return NextResponse.json({ property, operacion, seguimiento, visitas, documentos, historial });
  } catch {
    return NextResponse.json({ error: "Error al obtener operación" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = await getDbRestored();
    const property = db.prepare(`SELECT ref FROM properties WHERE ref = ?`).get(ref);
    if (!property) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });

    const body = await req.json();
    const existing = db.prepare(`SELECT estado FROM operaciones WHERE ref = ?`).get(ref) as { estado: string } | undefined;

    if (!existing) {
      db.prepare(`
        INSERT INTO operaciones (ref, estado, precio_inicial, honorarios_tipo, honorarios_valor, honorarios_iva,
          propietario_nombre, propietario_telefono, propietario_email, propietario_nif, propietario_notas,
          observaciones, fecha_inicio, fecha_cierre)
        VALUES (@ref, @estado, @precio_inicial, @honorarios_tipo, @honorarios_valor, @honorarios_iva,
          @propietario_nombre, @propietario_telefono, @propietario_email, @propietario_nif, @propietario_notas,
          @observaciones, @fecha_inicio, @fecha_cierre)
      `).run({
        ref,
        estado: body.estado ?? "en_venta",
        precio_inicial: body.precio_inicial ?? null,
        honorarios_tipo: body.honorarios_tipo ?? "porcentaje",
        honorarios_valor: body.honorarios_valor ?? 3.0,
        honorarios_iva: body.honorarios_iva ?? 0,
        propietario_nombre: body.propietario_nombre ?? null,
        propietario_telefono: body.propietario_telefono ?? null,
        propietario_email: body.propietario_email ?? null,
        propietario_nif: body.propietario_nif ?? null,
        propietario_notas: body.propietario_notas ?? null,
        observaciones: body.observaciones ?? null,
        fecha_inicio: body.fecha_inicio ?? null,
        fecha_cierre: body.fecha_cierre ?? null,
      });
      db.prepare(`
        INSERT INTO operaciones_historial (ref, evento, descripcion, agente)
        VALUES (?, 'Operación creada', 'Ficha de operación creada', ?)
      `).run(ref, body._agente ?? null);
    } else {
      // Log estado change if it changed
      if (body.estado && body.estado !== existing.estado) {
        const LABELS: Record<string, string> = {
          en_venta: "En venta", reservado: "Reservado", en_arras: "En arras",
          vendido: "Vendido", archivado: "Archivado",
        };
        db.prepare(`
          INSERT INTO operaciones_historial (ref, evento, descripcion, agente)
          VALUES (?, 'Cambio de estado', ?, ?)
        `).run(ref, `${LABELS[existing.estado] ?? existing.estado} → ${LABELS[body.estado] ?? body.estado}`, body._agente ?? null);
      }

      const allowed = [
        "estado", "precio_inicial", "honorarios_tipo", "honorarios_valor", "honorarios_iva",
        "propietario_nombre", "propietario_telefono", "propietario_email", "propietario_nif",
        "propietario_notas", "observaciones", "fecha_inicio", "fecha_cierre",
      ];
      const sets: string[] = [];
      const vals: unknown[] = [];
      for (const key of allowed) {
        if (key in body) { sets.push(`${key} = ?`); vals.push(body[key]); }
      }
      if (sets.length > 0) {
        sets.push(`updated_at = datetime('now')`);
        vals.push(ref);
        db.prepare(`UPDATE operaciones SET ${sets.join(", ")} WHERE ref = ?`).run(...vals);
      }
    }

    const operacion = db.prepare(`SELECT * FROM operaciones WHERE ref = ?`).get(ref);
    const historial = db.prepare(`SELECT * FROM operaciones_historial WHERE ref = ? ORDER BY created_at DESC`).all(ref);

    // Persist to Blob so the change survives container recycling
    await persistDbToBlob();

    return NextResponse.json({ operacion, historial });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
