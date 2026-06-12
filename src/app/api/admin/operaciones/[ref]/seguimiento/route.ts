import { NextRequest, NextResponse } from "next/server";
import { getDbRestored, persistDbToBlob } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = await getDbRestored();
    const { fecha, tipo, notas, agente } = await req.json();
    if (!fecha || !tipo) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    const result = db.prepare(`
      INSERT INTO operaciones_seguimiento (ref, fecha, tipo, notas, agente)
      VALUES (?, ?, ?, ?, ?)
    `).run(ref, fecha, tipo, notas ?? null, agente ?? null);
    const entry = db.prepare(`SELECT * FROM operaciones_seguimiento WHERE id = ?`).get(result.lastInsertRowid);
    await persistDbToBlob();
    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = await getDbRestored();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
    db.prepare(`DELETE FROM operaciones_seguimiento WHERE id = ? AND ref = ?`).run(id, ref);
    await persistDbToBlob();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
