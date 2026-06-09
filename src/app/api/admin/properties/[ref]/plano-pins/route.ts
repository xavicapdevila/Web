import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { FloorPlanPin } from "@/types/property";

type Ctx = { params: Promise<{ ref: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ref } = await params;
  try {
    const db  = getDb();
    const row = db.prepare("SELECT plano_pins, imagenes FROM properties WHERE ref = ?").get(ref) as
      { plano_pins: string; imagenes: string } | undefined;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const pins: FloorPlanPin[] = JSON.parse(row.plano_pins ?? "[]");
    const imagenes             = JSON.parse(row.imagenes   ?? "[]");
    return NextResponse.json({ pins, imagenes });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { ref } = await params;
  try {
    const { pins }: { pins: FloorPlanPin[] } = await req.json();
    if (!Array.isArray(pins)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const db = getDb();
    const result = db
      .prepare("UPDATE properties SET plano_pins = ? WHERE ref = ?")
      .run(JSON.stringify(pins), ref);

    if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
