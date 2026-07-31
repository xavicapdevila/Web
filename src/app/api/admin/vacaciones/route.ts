import { NextRequest, NextResponse } from "next/server";
import { saveAvisoVacaciones } from "@/lib/aviso-vacaciones";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

function isAuth(req: NextRequest) {
  return verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
}

/** PUT /api/admin/vacaciones  body: { activo: boolean, vuelta: string|null } */
export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const activo = Boolean(body?.activo);
    const vuelta =
      typeof body?.vuelta === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.vuelta)
        ? body.vuelta
        : null;
    await saveAvisoVacaciones({ activo, vuelta });
    return NextResponse.json({ ok: true, activo, vuelta });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
