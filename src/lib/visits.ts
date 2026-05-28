/**
 * Blog visit counter + share counter + referrer tracker.
 * Production  → Vercel Blob  (blog-visits.json / blog-shares.json / blog-referrers.json)
 * Local dev   → SQLite       (blog_visits / blog_shares / blog_referrers tables)
 */

const VISITS_KEY = "blog-visits.json";
const SHARES_KEY = "blog-shares.json";
const REFS_KEY   = "blog-referrers.json";
const USE_BLOB   = process.env.VERCEL === "1";
const OWN_DOMAIN = "thevilahome.com";

type VisitMap = Record<string, number>;
/** { slug → { domain → count } } */
type RefMap = Record<string, Record<string, number>>;

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

// ── Blob helpers — shares ─────────────────────────────────────────────────────

async function readBlobShares(): Promise<VisitMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: SHARES_KEY });
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

async function writeBlobShares(counts: VisitMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: SHARES_KEY });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  await put(SHARES_KEY, JSON.stringify(counts), {
    access: "public",
    contentType: "application/json",
  });
}

// ── Blob helpers — referrers ──────────────────────────────────────────────────

async function readBlobRefs(): Promise<RefMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: REFS_KEY });
    if (blobs.length === 0) return {};
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as RefMap;
  } catch {
    return {};
  }
}

async function writeBlobRefs(refs: RefMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: REFS_KEY });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  await put(REFS_KEY, JSON.stringify(refs), {
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

/**
 * Track an external referrer for a slug.
 * Ignores: empty referrers, own-domain navigation, and malformed URLs.
 * Fire-and-forget — call without await from the API route.
 */
export async function trackReferrer(slug: string, rawReferrer: string): Promise<void> {
  if (!rawReferrer) return;
  let domain: string;
  try {
    const u = new URL(rawReferrer);
    if (u.hostname.includes(OWN_DOMAIN)) return; // internal nav — skip
    domain = u.hostname.replace(/^www\./, "");
  } catch {
    return;
  }
  if (!domain) return;

  if (USE_BLOB) {
    const refs = await readBlobRefs();
    if (!refs[slug]) refs[slug] = {};
    refs[slug][domain] = (refs[slug][domain] ?? 0) + 1;
    await writeBlobRefs(refs);
    return;
  }

  // Local dev — SQLite
  try {
    const { getDb } = await import("./db");
    const db = getDb();
    db.prepare(
      `INSERT INTO blog_referrers (slug, domain, count) VALUES (?, ?, 1)
       ON CONFLICT (slug, domain) DO UPDATE SET count = count + 1`
    ).run(slug, domain);
  } catch {
    // table may not exist yet in old local DBs — ignore
  }
}

/** Return sorted referrers for a slug: [{ domain, count }] */
export async function getTopReferrers(
  slug: string,
  limit = 10
): Promise<{ domain: string; count: number }[]> {
  let map: Record<string, number> = {};

  if (USE_BLOB) {
    const refs = await readBlobRefs();
    map = refs[slug] ?? {};
  } else {
    try {
      const { getDb } = await import("./db");
      const db = getDb();
      const rows = db
        .prepare("SELECT domain, count FROM blog_referrers WHERE slug = ? ORDER BY count DESC LIMIT ?")
        .all(slug, limit) as { domain: string; count: number }[];
      return rows;
    } catch {
      return [];
    }
  }

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([domain, count]) => ({ domain, count }));
}

/** Return the share count for a single slug. */
export async function getShareCount(slug: string): Promise<number> {
  if (USE_BLOB) {
    const counts = await readBlobShares();
    return counts[slug] ?? 0;
  }
  try {
    const { getDb } = await import("./db");
    const db = getDb();
    const row = db
      .prepare("SELECT count FROM blog_shares WHERE slug = ?")
      .get(slug) as { count: number } | undefined;
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

/** Atomically increment the share count for a slug and return the new value. */
export async function incrementShare(slug: string): Promise<number> {
  if (USE_BLOB) {
    const counts = await readBlobShares();
    const newCount = (counts[slug] ?? 0) + 1;
    counts[slug] = newCount;
    await writeBlobShares(counts);
    return newCount;
  }
  try {
    const { getDb } = await import("./db");
    const db = getDb();
    db.prepare(
      `INSERT INTO blog_shares (slug, count) VALUES (?, 1)
       ON CONFLICT (slug) DO UPDATE SET count = count + 1`
    ).run(slug);
    const row = db
      .prepare("SELECT count FROM blog_shares WHERE slug = ?")
      .get(slug) as { count: number } | undefined;
    return row?.count ?? 1;
  } catch {
    return 0;
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
