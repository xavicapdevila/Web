/**
 * Favicon generator for The Vila Home
 * Outputs all required icon sizes + a multi-resolution .ico file.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");

// ─── Icon design ──────────────────────────────────────────────────────────────
// Dark tile (#0f0f0f) matching the site background + gold V (#C9B99A).
// Positive-space gold V = reads immediately as the brand mark at any size.
// 30 px arm width in 100-unit viewBox → ~5 px at 16 px output.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f0f0f"/>
  <polygon points="0,0 50,100 100,0 70,0 50,70 30,0" fill="#C9B99A"/>
</svg>`;

// ─── ICO builder (multi-resolution PNG-in-ICO) ───────────────────────────────
// ICO spec: https://en.wikipedia.org/wiki/ICO_(file_format)
function buildIco(entries) {
  // entries: [{ size: number, data: Buffer }]  — PNG data for each frame
  const n = entries.length;
  const HEADER = 6;          // ICONDIR
  const DIRENTRY = 16;       // ICONDIRENTRY per image
  const headerBytes = HEADER + n * DIRENTRY;

  // Pre-calculate image offsets
  let offset = headerBytes;
  const offsets = entries.map((e) => {
    const o = offset;
    offset += e.data.length;
    return o;
  });

  const buf = Buffer.alloc(offset);

  // ICONDIR
  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // type  = 1 (ICO)
  buf.writeUInt16LE(n, 4); // count

  // ICONDIRENTRY × n
  entries.forEach((e, i) => {
    const p = HEADER + i * DIRENTRY;
    const dim = e.size >= 256 ? 0 : e.size; // 0 means 256
    buf.writeUInt8(dim, p + 0);             // width
    buf.writeUInt8(dim, p + 1);             // height
    buf.writeUInt8(0, p + 2);               // colour count (0 = truecolour)
    buf.writeUInt8(0, p + 3);               // reserved
    buf.writeUInt16LE(1, p + 4);            // planes
    buf.writeUInt16LE(32, p + 6);           // bpp
    buf.writeUInt32LE(e.data.length, p + 8);  // bytes in image
    buf.writeUInt32LE(offsets[i], p + 12);    // file offset of image
  });

  // Image data
  entries.forEach((e, i) => e.data.copy(buf, offsets[i]));

  return buf;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  const svgBuf = Buffer.from(SVG);

  // Render all sizes we need
  async function png(size) {
    return sharp(svgBuf)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  console.log("Rendering PNGs…");
  const [
    p16, p32, p48, p64, p96, p128, p180, p192, p256, p512,
  ] = await Promise.all([
    png(16), png(32), png(48), png(64), png(96), png(128),
    png(180), png(192), png(256), png(512),
  ]);

  // ── public/ ────────────────────────────────────────────────────────────────
  const writes = [
    ["favicon-16x16.png",         p16 ],
    ["favicon-32x32.png",         p32 ],
    ["favicon-48x48.png",         p48 ],
    ["favicon-96x96.png",         p96 ],
    ["apple-touch-icon.png",      p180],  // 180×180 for iOS home-screen
    ["android-chrome-192x192.png",p192],
    ["android-chrome-512x512.png",p512],
    ["icon-192.png",              p192],
    ["icon-512.png",              p512],
    ["mstile-150x150.png",        p128],  // Windows tile (shown at 150×150)
  ];

  for (const [name, data] of writes) {
    fs.writeFileSync(path.join(PUBLIC, name), data);
    console.log(`  public/${name}  (${data.length} bytes)`);
  }

  // Updated SVG favicon (simpler monogram, works as SVG favicon in modern browsers)
  const svgFaviconPath = path.join(PUBLIC, "favicon.svg");
  fs.writeFileSync(svgFaviconPath, SVG);
  console.log(`  public/favicon.svg`);

  // ── Multi-resolution ICO ──────────────────────────────────────────────────
  // Include 16, 32, 48 and 64 for maximum compatibility
  const ico = buildIco([
    { size: 16,  data: p16  },
    { size: 32,  data: p32  },
    { size: 48,  data: p48  },
    { size: 64,  data: p64  },
  ]);

  // The file in src/app/ takes priority in Next.js App Router
  fs.writeFileSync(path.join(APP,    "favicon.ico"), ico);
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico);
  console.log(`  src/app/favicon.ico  (${ico.length} bytes)`);
  console.log(`  public/favicon.ico   (${ico.length} bytes)`);

  console.log("\n✓ All favicon files generated.");
}

run().catch((e) => { console.error(e); process.exit(1); });
