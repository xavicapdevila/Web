import { NextRequest, NextResponse } from "next/server";
import { getAvisoVacaciones, saveAvisoVacaciones, textosAviso, normalizaFechaHora } from "@/lib/aviso-vacaciones";
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

/**
 * GET /api/admin/vacaciones — la configuración cruda + los textos que la barra
 * enseñaría con ella (para la vista previa de los paneles).
 */
export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const aviso = await getAvisoVacaciones();
  return NextResponse.json({ ...aviso, textos: textosAviso(aviso.hasta) });
}

/** PUT /api/admin/vacaciones  body: { activo, desde|null, hasta|null } ("YYYY-MM-DDTHH:mm"). */
export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const aviso = {
      activo: Boolean(body?.activo),
      desde: normalizaFechaHora(body?.desde),
      hasta: normalizaFechaHora(body?.hasta),
    };
    await saveAvisoVacaciones(aviso);
    return NextResponse.json({ ok: true, ...aviso });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
