import { NextRequest, NextResponse } from "next/server";
import { incrementShare } from "@/lib/visits";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Endpoint público que escribe contadores: mismo cierre que blog/visit.
    const limit = rateLimit(`blog-share:${clientIp(req)}`, 20, 60 * 60 * 1000);
    if (!limit.ok) return NextResponse.json({ count: 0 }, { status: 429 });

    const body = await req.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    if (!/^[\w-]{1,140}$/.test(slug)) return NextResponse.json({ count: 0 }, { status: 400 });
    const count = await incrementShare(slug);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
