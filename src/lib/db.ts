import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { put, list } from "@vercel/blob";

/**
 * Resolve a writable directory for the SQLite DB.
 *
 * • Local dev / Vercel build container: process.cwd()/data  (writable)
 * • Vercel serverless runtime:          /var/task            (read-only)
 *   → falls back to /tmp/thevilahome   (writable, ephemeral per container)
 *
 * The cron job (/api/sync, runs every hour) repopulates the DB on cold starts.
 */
function resolveDbPath(): string {
  const localDir = path.join(process.cwd(), "data");
  try {
    fs.mkdirSync(localDir, { recursive: true });
    // Quick write-test to confirm the directory is writable
    const probe = path.join(localDir, ".write-probe");
    fs.writeFileSync(probe, "");
    fs.unlinkSync(probe);
    return path.join(localDir, "properties.db");
  } catch {
    // Read-only filesystem (Vercel serverless) — use /tmp
    const tmpDir = path.join("/tmp", "thevilahome");
    fs.mkdirSync(tmpDir, { recursive: true });
    return path.join(tmpDir, "properties.db");
  }
}

const DB_PATH = resolveDbPath();

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      ref TEXT UNIQUE NOT NULL,
      tipo TEXT NOT NULL,
      subtipo TEXT,
      operacion TEXT NOT NULL,
      precio REAL NOT NULL,
      precio_anterior REAL,
      outlet INTEGER DEFAULT 0,
      porcentaje_bajada REAL,
      estado_ficha INTEGER DEFAULT 1,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      ciudad TEXT,
      provincia TEXT,
      cp TEXT,
      zona TEXT,
      direccion TEXT,
      habitaciones INTEGER,
      banos INTEGER,
      m2_construidos REAL,
      m2_utiles REAL,
      m2_parcela REAL,
      planta TEXT,
      num_plantas INTEGER,
      ascensor INTEGER DEFAULT 0,
      garaje INTEGER DEFAULT 0,
      garaje_tipo TEXT DEFAULT 'garaje',
      trastero INTEGER DEFAULT 0,
      urbanizacion INTEGER DEFAULT 0,
      piscina INTEGER DEFAULT 0,
      piscina_privada INTEGER DEFAULT 0,
      piscina_com INTEGER DEFAULT 0,
      terraza INTEGER DEFAULT 0,
      jardin INTEGER DEFAULT 0,
      balcon INTEGER DEFAULT 0,
      solarium INTEGER DEFAULT 0,
      barbacoa INTEGER DEFAULT 0,
      chimenea INTEGER DEFAULT 0,
      vistas_al_mar INTEGER DEFAULT 0,
      amueblado INTEGER DEFAULT 0,
      arma_empotrado INTEGER DEFAULT 0,
      calefaccion TEXT,
      aire_cond INTEGER DEFAULT 0,
      bomba_frio_calor INTEGER DEFAULT 0,
      orientacion TEXT,
      antiguedad TEXT,
      estado TEXT,
      ibi REAL,
      gastos_comun REAL,
      periodicidad_comunidad TEXT,
      certificado_energetico TEXT,
      consumo_energetico TEXT,
      emisiones_letra TEXT,
      emisiones_energeticas TEXT,
      energia_exento INTEGER DEFAULT 0,
      imagenes TEXT DEFAULT '[]',
      video1 TEXT,
      tour TEXT,
      fecha TEXT,
      agente TEXT,
      agente_email TEXT,
      agente_foto TEXT,
      agente_telefono TEXT,
      slug TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      synced_at TEXT DEFAULT (datetime('now')),
      properties_added INTEGER DEFAULT 0,
      properties_updated INTEGER DEFAULT 0,
      properties_removed INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ok',
      error TEXT
    );

    CREATE TABLE IF NOT EXISTS blog_visits (
      slug  TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blog_referrers (
      slug   TEXT NOT NULL,
      domain TEXT NOT NULL,
      count  INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (slug, domain)
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      titulo TEXT NOT NULL,
      extracto TEXT,
      contenido TEXT,
      imagen TEXT,
      autor TEXT,
      fecha TEXT,
      etiquetas TEXT DEFAULT '[]',
      publicado INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Migration: add tour column if it doesn't exist yet (SQLite workaround)
  `);
  try { db.exec(`ALTER TABLE properties ADD COLUMN tour TEXT`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN agente_telefono TEXT`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN emisiones_letra TEXT`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN energia_exento INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN garaje_tipo TEXT DEFAULT 'garaje'`); } catch {}
  // Merge all house variants into "casa"
  try { db.exec(`UPDATE properties SET tipo = 'casa' WHERE tipo IN ('chalet', 'adosado', 'pareado', 'bungalow', 'duplex', 'dúplex')`); } catch {}
  // Merge piso variants (ático, planta baja, dúplex) into "piso", preserve subtipo
  try { db.exec(`UPDATE properties SET subtipo = 'ático',      tipo = 'piso' WHERE tipo = 'ático'`); } catch {}
  try { db.exec(`UPDATE properties SET subtipo = 'planta baja', tipo = 'piso' WHERE tipo IN ('planta baja', 'bajo')`); } catch {}
  try { db.exec(`UPDATE properties SET subtipo = 'dúplex',     tipo = 'piso' WHERE tipo IN ('dúplex', 'duplex')`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN num_plantas INTEGER`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN urbanizacion INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN piscina_privada INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN piscina_com INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN balcon INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN solarium INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN barbacoa INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN chimenea INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN vistas_al_mar INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN arma_empotrado INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN bomba_frio_calor INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN periodicidad_comunidad TEXT`); } catch {}
  try { db.exec(`ALTER TABLE blog_posts ADD COLUMN categoria TEXT DEFAULT ''`); } catch {}
  try { db.exec(`ALTER TABLE blog_posts ADD COLUMN imagen_alt TEXT DEFAULT ''`); } catch {}
  try { db.exec(`ALTER TABLE blog_posts ADD COLUMN palabra_clave TEXT DEFAULT ''`); } catch {}
  // Share counter table
  try { db.exec(`CREATE TABLE IF NOT EXISTS blog_shares (
    slug  TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  )`); } catch {}
  // Pendientes — properties that left or reappeared in the Inmovilla feed
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones_pendientes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ref         TEXT NOT NULL,
    titulo      TEXT NOT NULL DEFAULT '',
    descripcion TEXT,
    tipo        TEXT NOT NULL DEFAULT 'salida_feed',
    created_at  TEXT DEFAULT (datetime('now')),
    resuelta    INTEGER DEFAULT 0,
    resuelta_at TEXT,
    accion      TEXT
  )`); } catch {}
  try { db.exec(`ALTER TABLE operaciones_pendientes ADD COLUMN tipo TEXT NOT NULL DEFAULT 'salida_feed'`); } catch {}
  // Operaciones CRM tables — migrate old schema (from reverted commit) if present
  try {
    const cols = (db.prepare(`PRAGMA table_info(operaciones)`).all() as { name: string }[]).map(c => c.name);
    if (cols.length > 0 && !cols.includes("ref")) {
      db.exec(`DROP TABLE IF EXISTS operaciones`);
    }
  } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones (
    ref                  TEXT PRIMARY KEY,
    estado               TEXT NOT NULL DEFAULT 'en_venta',
    precio_inicial       REAL,
    honorarios_tipo      TEXT DEFAULT 'porcentaje',
    honorarios_valor     REAL DEFAULT 3.0,
    honorarios_iva       INTEGER DEFAULT 0,
    propietario_nombre   TEXT,
    propietario_telefono TEXT,
    propietario_email    TEXT,
    propietario_nif      TEXT,
    propietario_notas    TEXT,
    observaciones        TEXT,
    fecha_inicio         TEXT,
    fecha_cierre         TEXT,
    created_at           TEXT DEFAULT (datetime('now')),
    updated_at           TEXT DEFAULT (datetime('now'))
  )`); } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones_seguimiento (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    ref     TEXT NOT NULL,
    fecha   TEXT NOT NULL,
    tipo    TEXT NOT NULL DEFAULT 'llamada',
    notas   TEXT,
    agente  TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`); } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones_visitas (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    ref               TEXT NOT NULL,
    fecha             TEXT NOT NULL,
    nombre_contacto   TEXT,
    telefono_contacto TEXT,
    valoracion        TEXT DEFAULT 'neutral',
    notas             TEXT,
    agente            TEXT,
    created_at        TEXT DEFAULT (datetime('now'))
  )`); } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones_documentos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ref        TEXT NOT NULL,
    nombre     TEXT NOT NULL,
    tipo       TEXT DEFAULT 'otro',
    url        TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`); } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS operaciones_historial (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ref         TEXT NOT NULL,
    evento      TEXT NOT NULL,
    descripcion TEXT,
    agente      TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  )`); } catch {}
  // fechaact: Inmovilla REST API last-modified timestamp (for differential sync)
  try { db.exec(`ALTER TABLE properties ADD COLUMN fechaact TEXT`); } catch {}
  // source column on sync_log: which data source was used ('rest' | 'xml')
  try { db.exec(`ALTER TABLE sync_log ADD COLUMN source TEXT DEFAULT 'xml'`); } catch {}
  try { db.exec(`ALTER TABLE properties ADD COLUMN eninternet INTEGER DEFAULT 1`); } catch {}
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_tipo ON properties(tipo);
    CREATE INDEX IF NOT EXISTS idx_properties_ciudad ON properties(ciudad);
    CREATE INDEX IF NOT EXISTS idx_properties_precio ON properties(precio);
    CREATE INDEX IF NOT EXISTS idx_properties_fecha ON properties(fecha DESC);
    CREATE INDEX IF NOT EXISTS idx_properties_estado ON properties(estado_ficha);
  `);
}

// ── Vercel Blob persistence ───────────────────────────────────────────────────
// On Vercel, /tmp is ephemeral per container. We back up the SQLite DB to
// Vercel Blob after every sync and restore it on cold container starts.

const BLOB_DB_PATHNAME = "db/properties.db";

/**
 * In-flight restore promise — used to deduplicate concurrent cold-start
 * requests (e.g. a Next.js prefetch racing with an actual navigation click).
 * Without this, two simultaneous calls would each download the Blob and the
 * second one would close the DB connection opened by the first, causing a
 * "database is closed" exception and returning empty results to the user.
 */
let _initDbPromise: Promise<void> | null = null;

/**
 * Restores the SQLite DB from Vercel Blob on cold container starts.
 * No-op if the DB file is already populated (warm container) or if
 * BLOB_READ_WRITE_TOKEN is not set.
 * Concurrent calls share a single in-flight promise so only one restore
 * runs at a time.
 */
export async function initDbFromBlob(): Promise<void> {
  // Fast path: DB file already present and populated (warm container)
  try {
    if (fs.statSync(DB_PATH).size > 32_768) return; // > 32 KB → already loaded
  } catch { /* file doesn't exist → cold start → fall through */ }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  // If a restore is already in progress (concurrent request), wait for it
  // instead of starting a second parallel download.
  if (!_initDbPromise) {
    _initDbPromise = _restoreFromBlob();
  }
  return _initDbPromise;
}

async function _restoreFromBlob(): Promise<void> {
  try {
    const { blobs } = await list({
      prefix: BLOB_DB_PATHNAME,
      limit: 1,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!blobs[0]) return; // No backup in Blob yet

    const res = await fetch(blobs[0].url);
    if (!res.ok) return;

    const data = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, data);

    // Reset the cached connection so next getDb() opens the restored file
    if (_db) { try { _db.close(); } catch {} _db = null; }
  } catch {
    // Non-fatal: DB will be empty until the daily cron sync runs
  } finally {
    // Clear the in-flight reference so a retry is possible if the restore
    // failed. On success, the size > 32 KB check above short-circuits anyway.
    _initDbPromise = null;
  }
}

/**
 * Uploads the current SQLite DB to Vercel Blob after a successful sync.
 * This makes the updated data available to all future serverless containers.
 */
export async function persistDbToBlob(): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    // Flush WAL log into the main DB file before reading it
    const db = getDb();
    db.pragma("wal_checkpoint(TRUNCATE)");

    const data = fs.readFileSync(DB_PATH);
    await put(BLOB_DB_PATHNAME, data, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch {
    // Non-fatal
  }
}
