import { NextResponse } from "next/server";
import { getAvisoPublico } from "@/lib/aviso-vacaciones";

export const dynamic = "force-dynamic";

/**
 * GET /api/vacaciones — el aviso ya filtrado por su ventana [desde, hasta) y
 * con los textos montados en los 4 idiomas. Público.
 */
export async function GET() {
  const aviso = await getAvisoPublico();
  return NextResponse.json(aviso, {
    // Cache corta en el edge: los cambios (y los bordes de la ventana horaria)
    // se notan en ~1 min sin que cada visita pague un list+fetch a Blob.
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=60" },
  });
}
