import { NextRequest, NextResponse } from "next/server";
import { incrementShare } from "@/lib/visits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    if (!slug) return NextResponse.json({ count: 0 }, { status: 400 });
    const count = await incrementShare(slug);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
