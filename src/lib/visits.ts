/**
 * Blog visit counter + share counter + referrer tracker.
 * Production  → Vercel Blob  (blog-visits.json / blog-shares.json / blog-referrers.json)
 * Local dev   → SQLite       (blog_visits / blog_shares / blog_referrers tables)
 */

const VISITS_KEY = "blog-visits.json";
const SHARES_KEY = "blog-shares.json";
const REFS_KEY   = "blog-referrers.json";
// Prefijos para list(): los blobs se suben con addRandomSuffix (URL
// impredecible en el store público) y se localizan por prefijo.
const VISITS_PREFIX = "blog-visits";
const SHARES_PREFIX = "blog-shares";
const REFS_PREFIX   = "blog-referrers";
const USE_BLOB   = process.env.VERCEL === "1";
const OWN_DOMAIN = "thevilahome.com";
// Topes anti-abuso del almacén de referrers (clave `domain` es entrada pública)
const MAX_SLUGS_REFS = 2000;
const MAX_DOMAINS_PER_SLUG = 50;

type VisitMap = Record<string, number>;
/** { slug → { domain → count } } */
type RefMap = Record<string, Record<string, number>>;

// ── Blob helpers ──────────────────────────────────────────────────────────────

async function readBlobVisits(): Promise<VisitMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: VISITS_PREFIX });
    if (blobs.length === 0) return {};
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    // Try blobs from newest to oldest; skip any that return 404 (race with deletion)
    for (const blob of sorted) {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (res.ok) return (await res.json()) as VisitMap;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeBlobVisits(counts: VisitMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  // Write new version FIRST — ensures reads never see 0 blobs and return {}
  await put(VISITS_KEY, JSON.stringify(counts), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
  // Clean up old versions (non-fatal if it fails)
  try {
    const { blobs } = await list({ prefix: VISITS_PREFIX });
    if (blobs.length > 1) {
      const sorted = [...blobs].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      await del(sorted.slice(1).map((b) => b.url));
    }
  } catch { /* cleanup failure is non-fatal */ }
}

// ── Blob helpers — shares ─────────────────────────────────────────────────────

async function readBlobShares(): Promise<VisitMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: SHARES_PREFIX });
    if (blobs.length === 0) return {};
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    for (const blob of sorted) {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (res.ok) return (await res.json()) as VisitMap;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeBlobShares(counts: VisitMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  await put(SHARES_KEY, JSON.stringify(counts), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
  try {
    const { blobs } = await list({ prefix: SHARES_PREFIX });
    if (blobs.length > 1) {
      const sorted = [...blobs].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      await del(sorted.slice(1).map((b) => b.url));
    }
  } catch { /* cleanup failure is non-fatal */ }
}

// ── Blob helpers — referrers ──────────────────────────────────────────────────

async function readBlobRefs(): Promise<RefMap> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: REFS_PREFIX });
    if (blobs.length === 0) return {};
    const sorted = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    for (const blob of sorted) {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (res.ok) return (await res.json()) as RefMap;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeBlobRefs(refs: RefMap): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");
  await put(REFS_KEY, JSON.stringify(refs), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
  try {
    const { blobs } = await list({ prefix: REFS_PREFIX });
    if (blobs.length > 1) {
      const sorted = [...blobs].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      await del(sorted.slice(1).map((b) => b.url));
    }
  } catch { /* cleanup failure is non-fatal */ }
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
    // Topes: sin esto, rotar slug+hostname en peticiones públicas inflaría el
    // JSON sin límite. Una vez alcanzado el tope solo se incrementan claves
    // ya conocidas; no se crean nuevas.
    const slugConocido = Object.prototype.hasOwnProperty.call(refs, slug);
    if (!slugConocido && Object.keys(refs).length >= MAX_SLUGS_REFS) return;
    if (!refs[slug]) refs[slug] = {};
    const dominioConocido = Object.prototype.hasOwnProperty.call(refs[slug], domain);
    if (!dominioConocido && Object.keys(refs[slug]).length >= MAX_DOMAINS_PER_SLUG) return;
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

/** Increment the share count for a slug and return the new value (fire-and-forget write). */
export async function incrementShare(slug: string): Promise<number> {
  if (USE_BLOB) {
    let newCount = 1;
    try {
      const counts = await readBlobShares();
      newCount = (counts[slug] ?? 0) + 1;
      counts[slug] = newCount;
      writeBlobShares(counts).catch(() => {});
    } catch {
      newCount = 1;
    }
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
    return 1;
  }
}

/**
 * Increment the visit count for a slug and return the new value.
 *
 * Blob path: read current counts → calculate newCount → fire Blob write
 * in the background (non-blocking) → return newCount immediately.
 * This ensures the counter is always visible even if the Blob write
 * is slow or fails (the count shown is accurate for this request;
 * persistence is best-effort).
 */
export async function incrementVisit(slug: string): Promise<number> {
  if (USE_BLOB) {
    let newCount = 1;
    try {
      const counts = await readBlobVisits();
      newCount = (counts[slug] ?? 0) + 1;
      counts[slug] = newCount;
      // Fire-and-forget: write persists in background, never blocks the response
      writeBlobVisits(counts).catch(() => {});
    } catch {
      // readBlobVisits failed — still show 1 for this visit
      newCount = 1;
    }
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
    return 1;
  }
}
