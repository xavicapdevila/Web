import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const session = request.cookies.get("tvh_admin");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ref, sold_by, admin_notes } = await request.json() as {
      ref?: string;
      sold_by?: "tvh" | "others" | null;
      admin_notes?: string;
    };

    if (!ref) return NextResponse.json({ error: "ref required" }, { status: 400 });

    const db = getDb();
    const updates: string[] = [];
    const params: (string | null)[] = [];

    if (sold_by !== undefined) {
      updates.push("sold_by = ?");
      params.push(sold_by ?? null);
    }
    if (admin_notes !== undefined) {
      updates.push("admin_notes = ?");
      params.push(admin_notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "nothing to update" }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    params.push(ref);

    db.prepare(`UPDATE properties SET ${updates.join(", ")} WHERE ref = ?`).run(...params);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
