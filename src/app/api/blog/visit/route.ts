import { NextRequest, NextResponse } from "next/server";
import { incrementVisit, trackReferrer } from "@/lib/visits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug     = typeof body?.slug     === "string" ? body.slug.trim()     : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer.trim() : "";

    if (!slug) return NextResponse.json({ count: 0 }, { status: 400 });

    const count = await incrementVisit(slug);

    // Track external referrer in the background (non-blocking)
    if (referrer) trackReferrer(slug, referrer).catch(() => {});

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
