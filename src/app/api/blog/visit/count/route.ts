import { type NextRequest, NextResponse } from "next/server";
import { getAllVisitCounts, getShareCount } from "@/lib/visits";

/** GET /api/blog/visit/count?slug=... — returns current counts without incrementing */
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug")?.trim() ?? "";
    if (!slug) return NextResponse.json({ count: 0, shareCount: 0 }, { status: 400 });

    const [allVisits, shareCount] = await Promise.all([
      getAllVisitCounts(),
      getShareCount(slug),
    ]);

    return NextResponse.json({ count: allVisits[slug] ?? 0, shareCount });
  } catch {
    return NextResponse.json({ count: 0, shareCount: 0 });
  }
}
