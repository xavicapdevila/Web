import { NextRequest, NextResponse } from "next/server";
import { syncProperties } from "@/lib/sync";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  // Verify admin session cookie
  if (!verifySession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncProperties();
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
