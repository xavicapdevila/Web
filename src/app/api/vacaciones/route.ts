import { NextResponse } from "next/server";
import { getAvisoPublico } from "@/lib/aviso-vacaciones";

export const dynamic = "force-dynamic";

/** GET /api/vacaciones — el aviso ya filtrado (apagado si caducó). Público. */
export async function GET() {
  const aviso = await getAvisoPublico();
  return NextResponse.json(aviso, {
    // Cache corta en el edge: al guardar desde /admin el cambio se ve en ≤1 min
    // sin que cada visita pague un list+fetch a Blob.
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
  });
}
