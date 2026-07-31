import { NextRequest, NextResponse } from "next/server";
import { getAvisoVacaciones, saveAvisoVacaciones } from "@/lib/aviso-vacaciones";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

/**
 * Acceso doble: la cookie del /admin de la web, o el Bearer que ya comparte
 * Ora para editar el bio-link (LINKS_ADMIN_SECRET) — así el CRM puede poner y
 * quitar el aviso sin credenciales nuevas.
 */
function isAuth(req: NextRequest) {
  if (verifySession(req.cookies.get(ADMIN_COOKIE)?.value)) return true;
  const secret = process.env.LINKS_ADMIN_SECRET;
  return !!secret && req.headers.get("Authorization") === `Bearer ${secret}`;
}

/** GET /api/admin/vacaciones — la configuración cruda (para los paneles). */
export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await getAvisoVacaciones());
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
