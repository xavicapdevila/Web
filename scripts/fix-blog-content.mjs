/**
 * One-off migration of the production blog posts (Vercel Blob).
 *
 *   node scripts/fix-blog-content.mjs           # dry run (backup + summary, NO write)
 *   node scripts/fix-blog-content.mjs --apply   # writes the cleaned posts to Blob
 *
 * Fixes (Tareas 3 + 4 del brief):
 *   1. Internal absolute links (www / non-www) → relative paths (no redirect hop).
 *   2. Typo slug references  ocumentacion-…  →  documentacion-…  (7 posts).
 *   3. Broken plain-text link "(/proceso-venta-vivienda)" → real <a> with the
 *      correct slug, in elegir-inmobiliaria-vender-piso.
 *   4. Renames the post slug  ocumentacion-…  →  documentacion-…
 *
 * Always writes a timestamped local backup before any Blob mutation.
 */
import { readFileSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");

// minimal .env.local loader
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const TYPO_SLUG = "ocumentacion-necesaria-vender-vivienda-catalunya";
const GOOD_SLUG = "documentacion-necesaria-vender-vivienda-catalunya";

// Same normalisation as src/lib/blog-content.ts (absolute internal → relative)
function normalizeLinks(html) {
  return html
    .replace(/https?:\/\/(?:www\.)?thevilahome\.com(\/[^\s"'<>]*)/gi, "$1")
    .replace(/https?:\/\/(?:www\.)?thevilahome\.com(?=["'\s<>])/gi, "/");
}

function fixContent(html, slug) {
  if (!html) return html;
  let out = normalizeLinks(html);
  // Typo slug references → correct (lookbehind avoids touching documentacion-…)
  out = out.replace(
    new RegExp(`(?<!d)${TYPO_SLUG}`, "g"),
    GOOD_SLUG
  );
  // Broken plain-text reference → real anchor (appears twice in this post)
  if (slug === "elegir-inmobiliaria-vender-piso") {
    out = out.replaceAll(
      "<em>Proceso de venta de una vivienda: pasos clave para vender sin errores</em> (/proceso-venta-vivienda)",
      '<a href="/blog/proceso-de-venta-de-una-vivienda"><em>Proceso de venta de una vivienda: pasos clave para vender sin errores</em></a>'
    );
  }
  return out;
}

const { list, put, del } = await import("@vercel/blob");
const { blobs } = await list({ prefix: "blog-posts.json" });
if (!blobs.length) { console.error("No blob found — aborting."); process.exit(1); }
const latest = [...blobs].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
const posts = await (await fetch(latest.url, { cache: "no-store" })).json();

// Backup
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = `data/blog-backup-${stamp}.json`;
writeFileSync(backupPath, JSON.stringify(posts, null, 2));
console.log(`Backup written → ${backupPath}  (${posts.length} posts)\n`);

// Transform
let contentChanges = 0, slugRenamed = 0;
const updated = posts.map((p) => {
  const next = { ...p };
  if (p.contenido) {
    const fixed = fixContent(p.contenido, p.slug);
    if (fixed !== p.contenido) { contentChanges++; console.log(`  content fixed: ${p.slug}`); }
    next.contenido = fixed;
  }
  if (p.slug === TYPO_SLUG) { next.slug = GOOD_SLUG; slugRenamed++; console.log(`  SLUG RENAMED: ${TYPO_SLUG} -> ${GOOD_SLUG}`); }
  return next;
});

console.log(`\nSummary: ${contentChanges} posts with content changes, ${slugRenamed} slug renamed.`);

// Sanity checks
const stillTypo = updated.filter((p) =>
  p.slug === TYPO_SLUG ||
  new RegExp(`(?<!d)${TYPO_SLUG}`).test(p.contenido || "")
);
const stillAbsolute = updated.filter((p) => /https?:\/\/(?:www\.)?thevilahome\.com/i.test(p.contenido || ""));
const stillBare = updated.filter((p) => (p.contenido || "").includes("(/proceso-venta-vivienda)"));
console.log(`Post-fix checks → remaining typo: ${stillTypo.length}, remaining absolute internal links: ${stillAbsolute.length}, remaining broken plain link: ${stillBare.length}`);

if (!APPLY) {
  console.log("\nDRY RUN — no Blob write. Re-run with --apply to publish.");
  process.exit(0);
}

if (stillTypo.length || stillBare.length) {
  console.error("\nABORT: sanity check failed, not writing.");
  process.exit(1);
}

// Write (same del+put pattern as src/lib/blog.ts writeBlobPosts)
const { blobs: existing } = await list({ prefix: "blog-posts.json" });
if (existing.length) await del(existing.map((b) => b.url));
await put("blog-posts.json", JSON.stringify(updated), {
  access: "public",
  contentType: "application/json",
});
console.log("\n✅ APPLIED — blog-posts.json updated in Vercel Blob.");
