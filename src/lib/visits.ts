/**
 * Blog visit counter.
 * Production  → Vercel Blob  (blog-visits.json  { slug: count })
 * Local dev   → SQLite       (blog_visits table)
 */

const VISITS_KEY = "blog-visits.json";
const USE_BLOB = process.env.VERCEL === "1";

type VisitMap = Record<string, number>;

// ── Blob helpers ──────────────────────────────────────────────────────────────

async function readBlobVisits(): Promise<VisitMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: VISITS_KEY });
    if (blobs.length === 0) return {};
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as VisitMap;
  } catch {
    return {};
  }
}

async function writeBlobVisits(counts: VisitMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: VISITS_KEY });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  await put(VISITS_KEY, JSON.stringify(counts), {
    access: "public",
    contentType: "application/json",
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Return { slug → count } for all articles. */
export async function getAllVisitCounts(): Promise<VisitMap> {
  if (USE_BLOB) return readBlobVisits();

  // Local dev — SQLite
  try {
    const { getDb } = await import("./db");
    const db = getDb();
    const rows = db
      .prepare("SELECT slug, count FROM blog_visits")
      .all() as { slug: string; count: number }[];
    return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
  } catch {
    return {};
  }
}

/** Atomically increment the visit count for a slug and return the new value. */
export async function incrementVisit(slug: string): Promise<number> {
  if (USE_BLOB) {
    const counts = await readBlobVisits();
    const newCount = (counts[slug] ?? 0) + 1;
    counts[slug] = newCount;
    await writeBlobVisits(counts);
    return newCount;
  }

  // Local dev — SQLite (upsert)
  try {
    const { getDb } = await import("./db");
    const db = getDb();
    db.prepare(
      `INSERT INTO blog_visits (slug, count) VALUES (?, 1)
       ON CONFLICT (slug) DO UPDATE SET count = count + 1`
    ).run(slug);
    const row = db
      .prepare("SELECT count FROM blog_visits WHERE slug = ?")
      .get(slug) as { count: number } | undefined;
    return row?.count ?? 1;
  } catch {
    return 0;
  }
}
