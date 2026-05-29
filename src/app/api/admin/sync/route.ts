import { NextRequest, NextResponse } from "next/server";
import { syncProperties } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  // Verify admin session cookie
  const session = request.cookies.get("tvh_admin");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Manual sync always uses REST — never fall back to XML, which would
    // delete REST-only properties (new listings not yet in the XML feed).
    const result = await syncProperties("rest");
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
