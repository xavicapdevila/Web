import { NextResponse } from "next/server";
import { syncProperties } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false; // fail closed: no secret configured → deny
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

async function handleSync(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await syncProperties();
    return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    // Log the detail server-side only — String(error) can leak internal paths
    console.error("[sync]", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

// Vercel Cron Jobs send GET requests — must be handled here
export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}
