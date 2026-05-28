import { NextResponse } from "next/server";
import { syncProperties } from "@/lib/sync";

export const dynamic = "force-dynamic";
// REST sync fetches ~20 properties at 7.5 s/request — allow up to 5 min.
// Vercel Pro supports up to 300 s; Hobby is limited to 10 s (XML fallback only).
export const maxDuration = 300;

export async function POST(request: Request) {
  // Validate cron secret for production security
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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

export async function GET() {
  // Allow GET for manual trigger in dev
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Use POST" }, { status: 405 });
  }
  try {
    const result = await syncProperties();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
