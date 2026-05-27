import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

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
      ascensor INTEGER DEFAULT 0,
      garaje INTEGER DEFAULT 0,
      trastero INTEGER DEFAULT 0,
      piscina INTEGER DEFAULT 0,
      terraza INTEGER DEFAULT 0,
      jardin INTEGER DEFAULT 0,
      amueblado INTEGER DEFAULT 0,
      calefaccion TEXT,
      aire_cond INTEGER DEFAULT 0,
      orientacion TEXT,
      antiguedad TEXT,
      estado TEXT,
      ibi REAL,
      gastos_comun REAL,
      certificado_energetico TEXT,
      consumo_energetico TEXT,
      emisiones_letra TEXT,
      emisiones_energeticas TEXT,
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
  try { db.exec(`ALTER TABLE blog_posts ADD COLUMN categoria TEXT DEFAULT ''`); } catch {}
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_tipo ON properties(tipo);
    CREATE INDEX IF NOT EXISTS idx_properties_ciudad ON properties(ciudad);
    CREATE INDEX IF NOT EXISTS idx_properties_precio ON properties(precio);
    CREATE INDEX IF NOT EXISTS idx_properties_fecha ON properties(fecha DESC);
    CREATE INDEX IF NOT EXISTS idx_properties_estado ON properties(estado_ficha);
  `);
}
