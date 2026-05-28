import { unstable_cache } from "next/cache";
import { getDb } from "./db";
import { fetchAndParseXML } from "./xml-parser";
import { fetchFromRestApi } from "./rest-parser";
import type { Property } from "@/types/property";

// ---------------------------------------------------------------------------
// Vercel Data Cache — fast path for property detail pages.
// Uses the XML feed (single request, includes tour/video URLs).
// The DB is used for listing pages and is kept in sync by syncProperties().
// ---------------------------------------------------------------------------

const _getCachedXmlProperties = unstable_cache(
  async (): Promise<Property[]> => {
    return fetchAndParseXML();
  },
  ["xml-properties"],
  { revalidate: 3600, tags: ["properties"] }
);

/** Returns a single property by slug using the Vercel Data Cache. */
export async function getCachedPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const properties = await _getCachedXmlProperties();
    return properties.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

/** Returns all slugs+dates using the Vercel Data Cache (for generateStaticParams). */
export async function getCachedSlugs(): Promise<{ slug: string; fecha: string }[]> {
  try {
    const properties = await _getCachedXmlProperties();
    return properties.map((p) => ({ slug: p.slug, fecha: p.fecha }));
  } catch {
    return [];
  }
}

export interface SyncResult {
  added: number;
  updated: number;
  removed: number;
  total: number;
  source: "rest" | "xml";
  unchanged?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// DB helpers — shared between REST and XML sync paths
// ---------------------------------------------------------------------------

function buildUpsertStatement(db: ReturnType<typeof getDb>) {
  return db.prepare(`
    INSERT INTO properties (
      id, ref, tipo, subtipo, operacion, precio, precio_anterior, outlet,
      porcentaje_bajada, estado_ficha, titulo, descripcion, ciudad, provincia,
      cp, zona, direccion, habitaciones, banos, m2_construidos, m2_utiles,
      m2_parcela, planta, num_plantas, ascensor, garaje, garaje_tipo, trastero, urbanizacion,
      piscina, terraza, jardin, amueblado, calefaccion, aire_cond, orientacion,
      antiguedad, estado, ibi, gastos_comun, periodicidad_comunidad,
      certificado_energetico, consumo_energetico,
      emisiones_letra, emisiones_energeticas, energia_exento,
      imagenes, video1, tour, fecha, fechaact,
      agente, agente_email, agente_foto, agente_telefono, slug, updated_at
    ) VALUES (
      @id, @ref, @tipo, @subtipo, @operacion, @precio, @precioAnterior, @outlet,
      @porcentajeBajada, @estadoFicha, @titulo, @descripcion, @ciudad, @provincia,
      @cp, @zona, @direccion, @habitaciones, @banos, @m2Construidos, @m2Utiles,
      @m2Parcela, @planta, @numPlantas, @ascensor, @garaje, @garajeTipo, @trastero, @urbanizacion,
      @piscina, @terraza, @jardin, @amueblado, @calefaccion, @aireCond, @orientacion,
      @antiguedad, @estado, @ibi, @gastosComun, @periodicidadComunidad,
      @certificadoEnergetico, @consumoEnergetico,
      @emisionesLetra, @emisionesEnergeticas, @energiaExento,
      @imagenes, @video1, @tour, @fecha, @fechaact,
      @agente, @agenteEmail, @agenteFoto, @agenteTelefono, @slug, datetime('now')
    )
    ON CONFLICT(ref) DO UPDATE SET
      tipo = excluded.tipo,
      subtipo = excluded.subtipo,
      operacion = excluded.operacion,
      precio = excluded.precio,
      precio_anterior = excluded.precio_anterior,
      outlet = excluded.outlet,
      porcentaje_bajada = excluded.porcentaje_bajada,
      estado_ficha = excluded.estado_ficha,
      titulo = excluded.titulo,
      descripcion = excluded.descripcion,
      ciudad = excluded.ciudad,
      provincia = excluded.provincia,
      cp = excluded.cp,
      zona = excluded.zona,
      direccion = excluded.direccion,
      habitaciones = excluded.habitaciones,
      banos = excluded.banos,
      m2_construidos = excluded.m2_construidos,
      m2_utiles = excluded.m2_utiles,
      m2_parcela = excluded.m2_parcela,
      planta = excluded.planta,
      num_plantas = excluded.num_plantas,
      ascensor = excluded.ascensor,
      garaje = excluded.garaje,
      garaje_tipo = excluded.garaje_tipo,
      trastero = excluded.trastero,
      urbanizacion = excluded.urbanizacion,
      piscina = excluded.piscina,
      terraza = excluded.terraza,
      jardin = excluded.jardin,
      amueblado = excluded.amueblado,
      calefaccion = excluded.calefaccion,
      aire_cond = excluded.aire_cond,
      orientacion = excluded.orientacion,
      antiguedad = excluded.antiguedad,
      estado = excluded.estado,
      ibi = excluded.ibi,
      gastos_comun = excluded.gastos_comun,
      periodicidad_comunidad = excluded.periodicidad_comunidad,
      certificado_energetico = excluded.certificado_energetico,
      consumo_energetico = excluded.consumo_energetico,
      emisiones_letra = excluded.emisiones_letra,
      emisiones_energeticas = excluded.emisiones_energeticas,
      energia_exento = excluded.energia_exento,
      imagenes = excluded.imagenes,
      -- Preserve tour/video from XML when REST sync does not provide them
      video1 = COALESCE(excluded.video1, video1),
      tour   = COALESCE(excluded.tour,   tour),
      fecha  = excluded.fecha,
      fechaact = COALESCE(excluded.fechaact, fechaact),
      -- Preserve agent data from XML when REST sync does not provide it
      agente          = COALESCE(excluded.agente,          agente),
      agente_email    = COALESCE(excluded.agente_email,    agente_email),
      agente_foto     = COALESCE(excluded.agente_foto,     agente_foto),
      agente_telefono = COALESCE(excluded.agente_telefono, agente_telefono),
      slug = excluded.slug,
      updated_at = datetime('now')
  `);
}

function propertyToRow(p: Property, fechaact?: string | null) {
  return {
    id: p.id,
    ref: p.ref,
    tipo: p.tipo,
    subtipo: p.subtipo ?? null,
    operacion: p.operacion,
    precio: p.precio,
    precioAnterior: p.precioAnterior ?? null,
    outlet: p.outlet ? 1 : 0,
    porcentajeBajada: p.porcentajeBajada ?? null,
    estadoFicha: p.estadoFicha,
    titulo: p.titulo,
    descripcion: p.descripcion,
    ciudad: p.ciudad,
    provincia: p.provincia,
    cp: p.cp ?? null,
    zona: p.zona ?? null,
    direccion: p.direccion ?? null,
    habitaciones: p.habitaciones ?? null,
    banos: p.banos ?? null,
    m2Construidos: p.m2Construidos ?? null,
    m2Utiles: p.m2Utiles ?? null,
    m2Parcela: p.m2Parcela ?? null,
    planta: p.planta ?? null,
    numPlantas: p.numPlantas ?? null,
    ascensor: p.ascensor ? 1 : 0,
    garaje: p.garaje ? 1 : 0,
    garajeTipo: p.garajeTipo ?? "garaje",
    trastero: p.trastero ? 1 : 0,
    urbanizacion: p.urbanizacion ? 1 : 0,
    piscina: p.piscina ? 1 : 0,
    terraza: p.terraza ? 1 : 0,
    jardin: p.jardin ? 1 : 0,
    amueblado: p.amueblado ? 1 : 0,
    calefaccion: p.calefaccion ?? null,
    aireCond: p.aireCond ? 1 : 0,
    orientacion: p.orientacion ?? null,
    antiguedad: p.antiguedad ?? null,
    estado: p.estado ?? null,
    ibi: p.ibi ?? null,
    gastosComun: p.gastosComun ?? null,
    periodicidadComunidad: p.periodicidadComunidad ?? null,
    certificadoEnergetico: p.certificadoEnergetico ?? null,
    consumoEnergetico: p.consumoEnergetico ?? null,
    emisionesLetra: p.emisionesLetra ?? null,
    emisionesEnergeticas: p.emisionesEnergeticas ?? null,
    energiaExento: p.energiaExento ? 1 : 0,
    imagenes: JSON.stringify(p.imagenes),
    video1: p.video1 ?? null,
    tour: p.tour ?? null,
    fecha: p.fecha,
    fechaact: fechaact ?? null,
    agente: p.agente ?? null,
    agenteEmail: p.agenteEmail ?? null,
    agenteFoto: p.agenteFoto ?? null,
    agenteTelefono: p.agenteTelefono ?? null,
    slug: p.slug,
  };
}

// ---------------------------------------------------------------------------
// REST sync
// ---------------------------------------------------------------------------

async function syncFromRest(): Promise<SyncResult> {
  const db = getDb();
  let added = 0, updated = 0, removed = 0;

  // Build existing state maps for differential sync
  const existingRows = db
    .prepare("SELECT ref, fechaact FROM properties")
    .all() as { ref: string; fechaact: string | null }[];

  const existingFechacts = new Map(existingRows.map((r) => [r.ref, r.fechaact ?? ""]));
  const existingRefs     = new Set(existingRows.map((r) => r.ref));

  const { properties, fechaacts, removedRefs, unchanged } =
    await fetchFromRestApi(existingFechacts, existingRefs);

  const upsert = buildUpsertStatement(db);

  const insertMany = db.transaction((props: Property[]) => {
    for (const p of props) {
      upsert.run(propertyToRow(p, fechaacts.get(p.ref) ?? null));
      if (existingRefs.has(p.ref)) { updated++; } else { added++; }
    }
  });

  insertMany(properties);

  // Remove deactivated / deleted properties
  for (const ref of removedRefs) {
    db.prepare("DELETE FROM properties WHERE ref = ?").run(ref);
    removed++;
  }

  const total = (existingRefs.size - removed) + added;

  db.prepare(
    "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status, source) VALUES (?, ?, ?, 'ok', 'rest')"
  ).run(added, updated, removed);

  return { added, updated, removed, total, source: "rest", unchanged };
}

// ---------------------------------------------------------------------------
// XML sync (original logic, kept as fallback)
// ---------------------------------------------------------------------------

async function syncFromXml(): Promise<SyncResult> {
  const db = getDb();
  let added = 0, updated = 0, removed = 0;

  const properties = await fetchAndParseXML();
  const incomingRefs = new Set(properties.map((p) => p.ref));

  const existingRefs = new Set(
    (db.prepare("SELECT ref FROM properties").all() as { ref: string }[]).map((r) => r.ref)
  );

  // Remove properties no longer in XML
  for (const ref of existingRefs) {
    if (!incomingRefs.has(ref)) {
      db.prepare("DELETE FROM properties WHERE ref = ?").run(ref);
      removed++;
    }
  }

  const upsert = buildUpsertStatement(db);

  const insertMany = db.transaction((props: Property[]) => {
    for (const p of props) {
      upsert.run(propertyToRow(p, null));
      if (existingRefs.has(p.ref)) { updated++; } else { added++; }
    }
  });

  insertMany(properties);

  db.prepare(
    "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status, source) VALUES (?, ?, ?, 'ok', 'xml')"
  ).run(added, updated, removed);

  return { added, updated, removed, total: properties.length, source: "xml" };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ensures the DB has properties on cold starts.
 * Always uses the XML feed — it's a single fast request, suitable for
 * rendering contexts where the REST sync (~2–3 min) would time out.
 */
export async function ensureDbSeeded(): Promise<void> {
  try {
    const db = getDb();
    const { c } = db
      .prepare("SELECT COUNT(*) as c FROM properties")
      .get() as { c: number };
    if (c === 0) await syncFromXml();
  } catch {
    // Never block rendering — log and continue with empty state
  }
}

/**
 * Full sync: tries REST API first (differential, faster on subsequent runs),
 * falls back to XML if REST is unavailable or fails.
 *
 * Called by the hourly cron job at /api/sync.
 */
export async function syncProperties(): Promise<SyncResult> {
  const hasRestToken = Boolean(process.env.INMOVILLA_API_TOKEN);

  if (hasRestToken) {
    try {
      return await syncFromRest();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[sync] REST sync failed (${errMsg}), falling back to XML`);
      // Fall through to XML sync
    }
  }

  try {
    return await syncFromXml();
  } catch (error) {
    const db = getDb();
    const errMsg = error instanceof Error ? error.message : String(error);
    db.prepare(
      "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status, error, source) VALUES (0, 0, 0, 'error', ?, 'xml')"
    ).run(errMsg);
    return { added: 0, updated: 0, removed: 0, total: 0, source: "xml", error: errMsg };
  }
}

// ---------------------------------------------------------------------------
// DB query helpers (unchanged)
// ---------------------------------------------------------------------------

export function getPropertiesFromDb(filters?: {
  tipo?: string;
  subtipo?: string;
  precioMin?: number;
  precioMax?: number;
  habitaciones?: number;
  m2Min?: number;
  ciudad?: string;
  page?: number;
  limit?: number;
}): { properties: Property[]; total: number } {
  const db = getDb();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.tipo) { conditions.push("tipo = ?"); params.push(filters.tipo); }
  if (filters?.subtipo) {
    const vals = filters.subtipo.split(",").map((v) => v.trim()).filter(Boolean);
    if (vals.length === 1) { conditions.push("subtipo = ?"); params.push(vals[0]); }
    else if (vals.length > 1) {
      conditions.push(`subtipo IN (${vals.map(() => "?").join(",")})`);
      params.push(...vals);
    }
  }
  if (filters?.precioMin) { conditions.push("precio >= ?"); params.push(filters.precioMin); }
  if (filters?.precioMax) { conditions.push("precio <= ?"); params.push(filters.precioMax); }
  if (filters?.habitaciones) { conditions.push("habitaciones >= ?"); params.push(filters.habitaciones); }
  if (filters?.m2Min) { conditions.push("m2_construidos >= ?"); params.push(filters.m2Min); }
  if (filters?.ciudad) {
    conditions.push("LOWER(ciudad) LIKE ?");
    params.push(`%${filters.ciudad.toLowerCase()}%`);
  }

  const where  = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const page   = filters?.page  ?? 1;
  const limit  = filters?.limit ?? 12;
  const offset = (page - 1) * limit;

  const countResult = db
    .prepare(`SELECT COUNT(*) as count FROM properties ${where}`)
    .get(...params) as { count: number };
  const total = countResult.count;

  const rows = db
    .prepare(`SELECT * FROM properties ${where} ORDER BY fecha DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as Record<string, unknown>[];

  return { properties: rows.map(rowToProperty), total };
}

export function getPropertyBySlug(slug: string): Property | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM properties WHERE slug = ?")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToProperty(row) : null;
}

export function getPropertyByRef(ref: string): Property | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM properties WHERE ref = ?")
    .get(ref) as Record<string, unknown> | undefined;
  return row ? rowToProperty(row) : null;
}

export function getFeaturedProperties(limit = 6): Property[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM properties WHERE estado_ficha = 1 ORDER BY fecha DESC LIMIT ?")
    .all(limit) as Record<string, unknown>[];
  return rows.map(rowToProperty);
}

export function getAllPropertySlugs(): { slug: string; fecha: string }[] {
  const db = getDb();
  return db
    .prepare("SELECT slug, fecha FROM properties ORDER BY fecha DESC")
    .all() as { slug: string; fecha: string }[];
}

function rowToProperty(row: Record<string, unknown>): Property {
  return {
    id:       String(row.id),
    ref:      String(row.ref),
    tipo:     String(row.tipo),
    subtipo:  row.subtipo ? String(row.subtipo) : undefined,
    operacion: String(row.operacion),
    precio:   Number(row.precio),
    precioAnterior: row.precio_anterior ? Number(row.precio_anterior) : undefined,
    outlet:   Boolean(row.outlet),
    porcentajeBajada: row.porcentaje_bajada ? Number(row.porcentaje_bajada) : undefined,
    estadoFicha: Number(row.estado_ficha),
    titulo:   String(row.titulo),
    descripcion: String(row.descripcion ?? ""),
    ciudad:   String(row.ciudad ?? ""),
    provincia: String(row.provincia ?? ""),
    cp:       row.cp ? String(row.cp) : undefined,
    zona:     row.zona ? String(row.zona) : undefined,
    direccion: row.direccion ? String(row.direccion) : undefined,
    habitaciones: row.habitaciones ? Number(row.habitaciones) : undefined,
    banos:    row.banos ? Number(row.banos) : undefined,
    m2Construidos: row.m2_construidos ? Number(row.m2_construidos) : undefined,
    m2Utiles:  row.m2_utiles ? Number(row.m2_utiles) : undefined,
    m2Parcela: row.m2_parcela ? Number(row.m2_parcela) : undefined,
    planta:   row.planta ? String(row.planta) : undefined,
    numPlantas: row.num_plantas ? Number(row.num_plantas) : undefined,
    ascensor:  Boolean(row.ascensor),
    garaje:    Boolean(row.garaje),
    garajeTipo: (row.garaje_tipo === "parking" ? "parking" : "garaje") as "garaje" | "parking",
    trastero:  Boolean(row.trastero),
    urbanizacion: Boolean(row.urbanizacion),
    piscina:   Boolean(row.piscina),
    terraza:   Boolean(row.terraza),
    jardin:    Boolean(row.jardin),
    amueblado: Boolean(row.amueblado),
    calefaccion: row.calefaccion ? String(row.calefaccion) : undefined,
    aireCond:  Boolean(row.aire_cond),
    orientacion: row.orientacion ? String(row.orientacion) : undefined,
    antiguedad: row.antiguedad ? String(row.antiguedad) : undefined,
    estado:    row.estado ? String(row.estado) : undefined,
    ibi:       row.ibi ? Number(row.ibi) : undefined,
    gastosComun: row.gastos_comun ? Number(row.gastos_comun) : undefined,
    periodicidadComunidad: row.periodicidad_comunidad ? String(row.periodicidad_comunidad) : undefined,
    certificadoEnergetico: row.certificado_energetico ? String(row.certificado_energetico) : undefined,
    consumoEnergetico: row.consumo_energetico ? String(row.consumo_energetico) : undefined,
    emisionesLetra: row.emisiones_letra ? String(row.emisiones_letra) : undefined,
    emisionesEnergeticas: row.emisiones_energeticas ? String(row.emisiones_energeticas) : undefined,
    energiaExento: Boolean(row.energia_exento),
    imagenes:  JSON.parse(String(row.imagenes ?? "[]")),
    video1:    row.video1 ? String(row.video1) : undefined,
    tour:      row.tour  ? String(row.tour)   : undefined,
    fecha:     String(row.fecha ?? ""),
    agente:    row.agente ? String(row.agente) : undefined,
    agenteEmail: row.agente_email ? String(row.agente_email) : undefined,
    agenteFoto:  row.agente_foto  ? String(row.agente_foto)  : undefined,
    agenteTelefono: row.agente_telefono ? String(row.agente_telefono) : undefined,
    slug:      String(row.slug ?? ""),
  };
}
