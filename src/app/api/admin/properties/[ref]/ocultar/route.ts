import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getDbRestored, persistDbToBlob } from "@/lib/db";

type Ctx = { params: Promise<{ ref: string }> };

function isAuth(req: NextRequest) {
  return req.cookies.get("tvh_admin")?.value === "authenticated";
}

/**
 * PUT /api/admin/properties/[ref]/ocultar  body: { oculta: boolean }
 * Hides (oculta: true) or shows (oculta: false) a property in the public site,
 * regardless of whether it is still present in the Inmovilla feed.
 */
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!isAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { ref } = await params;
  try {
    const { oculta } = await req.json();
    const db = await getDbRestored();

    if (oculta) {
      db.prepare(`INSERT OR IGNORE INTO propiedades_ocultas (ref) VALUES (?)`).run(ref);
    } else {
      db.prepare(`DELETE FROM propiedades_ocultas WHERE ref = ?`).run(ref);
    }

    // Persist to Blob so every serverless instance + public pages see the change
    await persistDbToBlob();
    // Invalidate the Vercel Data Cache so listings pick up the change
    try { revalidateTag("properties", "default"); } catch { /* non-fatal in local dev */ }

    return NextResponse.json({ ok: true, oculta: !!oculta });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
