/**
 * Next.js Instrumentation hook — runs once on server startup before any request.
 *
 * On Vercel serverless, each cold start gets an empty /tmp directory, so the
 * SQLite DB doesn't exist yet. This hook detects an empty DB and triggers the
 * initial sync so the first user request doesn't see 0 properties.
 */
export async function register() {
  // Only run in the Node.js runtime (not Edge), and not during next build
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { getDb } = await import("@/lib/db");
    const db = getDb();

    const { c } = db
      .prepare("SELECT COUNT(*) as c FROM properties")
      .get() as { c: number };

    if (c === 0) {
      console.log("[init] Empty DB — triggering initial sync from API...");
      const { syncProperties } = await import("@/lib/sync");
      const result = await syncProperties();
      console.log(
        `[init] Sync complete: +${result.added} added, ${result.total} total`
      );
    }
  } catch (err) {
    // Never block startup — log and continue
    console.error("[init] Startup sync failed:", err);
  }
}
