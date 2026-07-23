import { NextRequest, NextResponse } from "next/server";
import { incrementVisit, getShareCount, trackReferrer } from "@/lib/visits";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Endpoint público que escribe contadores: acotar ritmo y formato del slug
    // para que nadie infle visitas ni siembre claves basura en el almacén.
    const limit = rateLimit(`blog-visit:${clientIp(req)}`, 60, 60 * 60 * 1000);
    if (!limit.ok) return NextResponse.json({ count: 0, shareCount: 0 }, { status: 429 });

    const body = await req.json();
    const slug     = typeof body?.slug     === "string" ? body.slug.trim()     : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer.trim().slice(0, 500) : "";

    if (!/^[\w-]{1,140}$/.test(slug)) return NextResponse.json({ count: 0, shareCount: 0 }, { status: 400 });

    // Run visit increment and share count fetch in parallel
    const [count, shareCount] = await Promise.all([
      incrementVisit(slug),
      getShareCount(slug),
    ]);

    // Track external referrer in the background (non-blocking)
    if (referrer) trackReferrer(slug, referrer).catch(() => {});

    return NextResponse.json({ count, shareCount });
  } catch {
    return NextResponse.json({ count: 0, shareCount: 0 });
  }
}
