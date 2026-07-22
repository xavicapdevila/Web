import { NextResponse } from "next/server";
import sharp from "sharp";
import { getCachedPropertyBySlug } from "@/lib/sync";

// Tarjeta 1200×630 (1.91:1) para la vista previa al compartir la ficha
// (WhatsApp/Telegram/redes): la primera foto del inmueble recortada y servida
// como JPEG comprimido. SIN precio: se ve al entrar en la web.
//
// Antes esto era un opengraph-image.tsx (ImageResponse), pero ese runtime solo
// emite PNG y una foto en PNG a 1200×630 pesaba ~1,5 MB — WhatsApp descarta las
// vistas previas de más de ~600 KB y el enlace salía sin foto. El JPEG queda en
// ~100-250 KB.

const BASE_URL = "https://www.thevilahome.com";
const FALLBACK = `${BASE_URL}/og-image.jpg`;

// La tarjeta se cachea en el CDN un día y se sirve rancia mientras regenera:
// la foto de portada de un inmueble apenas cambia.
const CACHE = "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let fotoUrl: string | null = null;
  try {
    const property = await getCachedPropertyBySlug(slug);
    fotoUrl = property?.imagenes[0]?.url ?? null;
  } catch {
    fotoUrl = null;
  }
  if (!fotoUrl) return NextResponse.redirect(FALLBACK, { status: 302 });

  try {
    const res = await fetch(fotoUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`foto ${res.status}`);
    const original = Buffer.from(await res.arrayBuffer());
    const jpeg = await sharp(original)
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    return new NextResponse(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": CACHE,
      },
    });
  } catch {
    // Feed o CDN de fotos caídos: mejor la tarjeta de marca que un enlace pelado.
    return NextResponse.redirect(FALLBACK, { status: 302 });
  }
}
