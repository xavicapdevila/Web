import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = getDb();
    const { nombre, tipo, url } = await req.json();
    if (!nombre) return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
    const result = db.prepare(`
      INSERT INTO operaciones_documentos (ref, nombre, tipo, url)
      VALUES (?, ?, ?, ?)
    `).run(ref, nombre, tipo ?? "otro", url ?? null);
    const entry = db.prepare(`SELECT * FROM operaciones_documentos WHERE id = ?`).get(result.lastInsertRowid);
    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
    db.prepare(`DELETE FROM operaciones_documentos WHERE id = ? AND ref = ?`).run(id, ref);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
