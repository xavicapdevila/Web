/**
 * Favicon generator for The Vila Home
 * Two-tier strategy:
 *   - Small (16/32/48/64 px, ICO): gold V on dark — reads clearly in any browser tab
 *   - Large (96/128/180/192/512 px): full "THE VILA HOME" logo on dark
 *   - SVG favicon: full logo embedded as scalable vector (used by Chrome, Firefox, Edge)
 *
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.join(__dirname, "..");
const PUBLIC  = path.join(ROOT, "public");
const APP     = path.join(ROOT, "src", "app");

// ─── Small-icon design: gold V on dark ───────────────────────────────────────
// 30 px arm width in 100-unit viewBox → ~5 px at 16 px output.
const SVG_V = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f0f0f"/>
  <polygon points="0,0 50,100 100,0 70,0 50,70 30,0" fill="#C9B99A"/>
</svg>`;

// ─── Large-icon design: full logo on dark ────────────────────────────────────
// Original logo viewBox: 327.57 × 104.09  (aspect ≈ 3.147 : 1)
// We scale it to 90% of the square width and centre it vertically.
const LOGO_ASPECT = 327.57 / 104.09;  // ≈ 3.147

// Load logo.svg, recolour from white to brand gold, strip class-based styles.
const logoRaw = fs.readFileSync(path.join(PUBLIC, "logo.svg"), "utf8");
const logoContent = logoRaw
  .replace(/<defs>[\s\S]*?<\/defs>/g, "")           // remove <defs> block
  .replace(/<svg[^>]*>/,  "")                         // remove opening <svg>
  .replace(/<\/svg>/,     "")                         // remove closing </svg>
  .replace(/class="cls-1"/g, 'fill="#C9B99A"')        // inline gold fill
  .trim();

// SVG for the favicon.svg file — full logo, scales perfectly in modern browsers.
// scale(0.2748) maps 327.57 → 90 units; centre vertically at ≈ 35.7 units.
const SVG_LOGO_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f0f0f"/>
  <g transform="translate(5,35.7) scale(0.2748)">
    ${logoContent}
  </g>
</svg>`;

// ─── ICO builder (multi-resolution PNG-in-ICO) ───────────────────────────────
function buildIco(entries) {
  const n = entries.length;
  const HEADER   = 6;
  const DIRENTRY = 16;
  const headerBytes = HEADER + n * DIRENTRY;

  let offset = headerBytes;
  const offsets = entries.map((e) => { const o = offset; offset += e.data.length; return o; });

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(n, 4);

  entries.forEach((e, i) => {
    const p = HEADER + i * DIRENTRY;
    const dim = e.size >= 256 ? 0 : e.size;
    buf.writeUInt8(dim,  p + 0);
    buf.writeUInt8(dim,  p + 1);
    buf.writeUInt8(0,    p + 2);
    buf.writeUInt8(0,    p + 3);
    buf.writeUInt16LE(1,             p + 4);
    buf.writeUInt16LE(32,            p + 6);
    buf.writeUInt32LE(e.data.length, p + 8);
    buf.writeUInt32LE(offsets[i],    p + 12);
  });

  entries.forEach((e, i) => e.data.copy(buf, offsets[i]));
  return buf;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  // Small: gold V
  const pngV = (size) =>
    sharp(Buffer.from(SVG_V)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

  // Large: full logo composited on a dark background
  const pngLogo = async (size) => {
    const bg = await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 15, g: 15, b: 15, alpha: 1 } }
    }).png().toBuffer();

    const logoW = Math.round(size * 0.85);
    const logoH = Math.round(logoW / LOGO_ASPECT);
    const left  = Math.round((size - logoW) / 2);
    const top   = Math.round((size - logoH) / 2);

    const logoRendered = await sharp(Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327.57 104.09">
        ${logoContent}
      </svg>`
    )).resize(logoW, logoH).png().toBuffer();

    return sharp(bg)
      .composite([{ input: logoRendered, left, top }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  console.log("Rendering PNGs…");
  const [p16, p32, p48, p64] = await Promise.all([pngV(16), pngV(32), pngV(48), pngV(64)]);
  const [p96, p128, p180, p192, p512] = await Promise.all([
    pngLogo(96), pngLogo(128), pngLogo(180), pngLogo(192), pngLogo(512),
  ]);

  // ── public/ ───────────────────────────────────────────────────────────────
  const writes = [
    ["favicon-16x16.png",          p16  ],  // V — browser tab fallback
    ["favicon-32x32.png",          p32  ],  // V — browser tab fallback
    ["favicon-48x48.png",          p48  ],  // V — browser tab fallback
    ["favicon-96x96.png",          p96  ],  // Logo
    ["apple-touch-icon.png",       p180 ],  // Logo — iOS home screen
    ["android-chrome-192x192.png", p192 ],  // Logo — PWA / Android
    ["android-chrome-512x512.png", p512 ],  // Logo — PWA splash
    ["icon-192.png",               p192 ],  // Logo — manifest
    ["icon-512.png",               p512 ],  // Logo — manifest
    ["mstile-150x150.png",         p128 ],  // Logo — Windows tile
  ];

  for (const [name, data] of writes) {
    fs.writeFileSync(path.join(PUBLIC, name), data);
    console.log(`  public/${name}  (${data.length} bytes)`);
  }

  // SVG favicon: full logo, vector — Chrome / Firefox / Edge use this
  fs.writeFileSync(path.join(PUBLIC, "favicon.svg"), SVG_LOGO_FAVICON);
  console.log(`  public/favicon.svg  (full logo)`);

  // ICO: V-only frames for maximum tab compatibility
  const ico = buildIco([
    { size: 16, data: p16 },
    { size: 32, data: p32 },
    { size: 48, data: p48 },
    { size: 64, data: p64 },
  ]);
  fs.writeFileSync(path.join(APP,    "favicon.ico"), ico);
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico);
  console.log(`  src/app/favicon.ico  (${ico.length} bytes)`);
  console.log(`  public/favicon.ico   (${ico.length} bytes)`);

  console.log("\n✓ All favicon files generated.");
}

run().catch((e) => { console.error(e); process.exit(1); });
