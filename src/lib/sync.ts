import { unstable_cache, revalidateTag } from "next/cache";
import { getDb, persistDbToBlob, initDbFromBlob } from "./db";
import { fetchAndParseXML } from "./xml-parser";
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

/** Returns a single property by slug.
 *  Primary source: Vercel Data Cache (XML feed, shared across all Lambdas).
 *  Fallback: SQLite DB (restored from Blob) — covers stale/cold-start scenarios.
 *
 *  NOTE: plano_pins is our custom data stored only in SQLite (not in the
 *  Inmovilla XML feed). When the property is found in XML, we enrich it with
 *  plano_pins from the DB before returning.
 */
export async function getCachedPropertyBySlug(slug: string): Promise<Property | null> {
  let property: Property | null = null;
  try {
    const properties = await _getCachedXmlProperties();
    property = properties.find((p) => p.slug === slug) ?? null;
  } catch { /* fall through to DB */ }

  if (property) {
    // Enrich with plano_pins from DB — not available in the XML feed.
    try {
      await initDbFromBlob();
      const db = getDb();
      const row = db
        .prepare("SELECT plano_pins FROM properties WHERE slug = ?")
        .get(slug) as { plano_pins?: string } | undefined;
      if (row?.plano_pins) {
        const pins = JSON.parse(row.plano_pins);
        if (Array.isArray(pins) && pins.length > 0) {
          property = { ...property, planoPins: pins };
        }
      }
    } catch { /* non-fatal — plano_pins enrichment is best-effort */ }
    return property;
  }

  // DB fallback: Vercel Data Cache miss or XML not yet refreshed.
  // Restore DB from Blob if this is a fresh container.
  await initDbFromBlob();
  try {
    return getPropertyBySlug(slug);
  } catch {
    return null;
  }
}

/** Returns all slugs+dates using the Vercel Data Cache (for generateStaticParams and sitemap).
 *  Falls back to SQLite/Blob when the XML cache is unavailable (e.g. build time, XML outage).
 */
export async function getCachedSlugs(): Promise<{ slug: string; fecha: string }[]> {
  try {
    const properties = await _getCachedXmlProperties();
    return properties.map((p) => ({ slug: p.slug, fecha: p.fecha }));
  } catch { /* fall through to DB */ }

  await initDbFromBlob();
  try {
    return getAllPropertySlugs();
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Listing page — same XML Data Cache as detail pages, no SQLite needed.
// Filtering + pagination applied in-memory on the cached array (~200 items).
// This means the listing page never suffers from cold-start Blob restore delays.
// ---------------------------------------------------------------------------

type ListFilters = {
  tipo?: string;
  subtipo?: string;
  precioMin?: number;
  precioMax?: number;
  habitaciones?: number;
  m2Min?: number;
  ciudad?: string;
  page?: number;
  limit?: number;
};

/**
 * Returns the filtered + paginated property list for /propiedades.
 * Source: Vercel Data Cache (XML feed) — instant even on cold containers.
 * Falls back to empty list if the XML cache is unavailable.
 */
export async function getCachedPropertiesList(
  filters: ListFilters = {}
): Promise<{ properties: Property[]; total: number }> {
  let all: Property[] = [];
  try {
    all = await _getCachedXmlProperties();
  } catch {
    return { properties: [], total: 0 };
  }

  let filtered = all;

  if (filters.tipo) {
    filtered = filtered.filter((p) => p.tipo === filters.tipo);
  }
  if (filters.subtipo) {
    const vals = filters.subtipo.split(",").map((v) => v.trim()).filter(Boolean);
    if (vals.length > 0) {
      filtered = filtered.filter((p) => vals.includes(p.subtipo ?? ""));
    }
  }
  if (filters.precioMin != null) {
    filtered = filtered.filter((p) => p.precio >= filters.precioMin!);
  }
  if (filters.precioMax != null) {
    filtered = filtered.filter((p) => p.precio <= filters.precioMax!);
  }
  if (filters.habitaciones != null) {
    filtered = filtered.filter((p) => (p.habitaciones ?? 0) >= filters.habitaciones!);
  }
  if (filters.m2Min != null) {
    filtered = filtered.filter((p) => (p.m2Construidos ?? 0) >= filters.m2Min!);
  }
  if (filters.ciudad) {
    const lc = filters.ciudad.toLowerCase();
    filtered = filtered.filter((p) => p.ciudad.toLowerCase().includes(lc));
  }

  // Replicate the DB sort: most recently added first
  filtered.sort((a, b) => b.fecha.localeCompare(a.fecha));

  const total = filtered.length;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const offset = (page - 1) * limit;

  return {
    properties: filtered.slice(offset, offset + limit),
    total,
  };
}

export interface SyncResult {
  added: number;
  updated: number;
  removed: number;
  total: number;
  source: "xml";
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
      piscina, piscina_privada, piscina_com,
      terraza, jardin, balcon, solarium, barbacoa, chimenea, vistas_al_mar,
      amueblado, arma_empotrado, calefaccion, aire_cond, bomba_frio_calor, orientacion,
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
      @piscina, @piscinaPrivada, @piscinaComunitaria,
      @terraza, @jardin, @balcon, @solarium, @barbacoa, @chimenea, @vistasalmar,
      @amueblado, @armaEmpotrado, @calefaccion, @aireCond, @bombafriocalor, @orientacion,
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
      piscina_privada = excluded.piscina_privada,
      piscina_com = excluded.piscina_com,
      terraza = excluded.terraza,
      jardin = excluded.jardin,
      balcon = excluded.balcon,
      solarium = excluded.solarium,
      barbacoa = excluded.barbacoa,
      chimenea = excluded.chimenea,
      vistas_al_mar = excluded.vistas_al_mar,
      amueblado = excluded.amueblado,
      arma_empotrado = excluded.arma_empotrado,
      calefaccion = excluded.calefaccion,
      aire_cond = excluded.aire_cond,
      bomba_frio_calor = excluded.bomba_frio_calor,
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
    piscinaPrivada: p.piscinaPrivada ? 1 : 0,
    piscinaComunitaria: p.piscinaComunitaria ? 1 : 0,
    terraza: p.terraza ? 1 : 0,
    jardin: p.jardin ? 1 : 0,
    balcon: p.balcon ? 1 : 0,
    solarium: p.solarium ? 1 : 0,
    barbacoa: p.barbacoa ? 1 : 0,
    chimenea: p.chimenea ? 1 : 0,
    vistasalmar: p.vistasalmar ? 1 : 0,
    amueblado: p.amueblado ? 1 : 0,
    armaEmpotrado: p.armaEmpotrado ? 1 : 0,
    calefaccion: p.calefaccion ?? null,
    aireCond: p.aireCond ? 1 : 0,
    bombafriocalor: p.bombafriocalor ? 1 : 0,
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
// XML sync
// ---------------------------------------------------------------------------

async function syncFromXml(): Promise<SyncResult> {
  const db = getDb();
  let added = 0, updated = 0, removed = 0;

  const properties = await fetchAndParseXML();
  const incomingRefs = new Set(properties.map((p) => p.ref));

  const existingRefs = new Set(
    (db.prepare("SELECT ref FROM properties").all() as { ref: string }[]).map((r) => r.ref)
  );

  // Properties no longer in the Inmovilla XML feed.
  // Instead of deleting silently, create a pending notification so the admin
  // can decide the final action (sold by us, sold by others, withdrawn, delete).
  // If a pending notification already exists for this ref (from a previous sync
  // cycle), skip creating another one to avoid duplicates.
  for (const ref of existingRefs) {
    if (!incomingRefs.has(ref)) {
      const alreadyPending = db.prepare(
        `SELECT 1 FROM operaciones_pendientes WHERE ref = ? AND resuelta = 0`
      ).get(ref);
      if (!alreadyPending) {
        const prop = db.prepare(`SELECT titulo FROM properties WHERE ref = ?`).get(ref) as
          | { titulo: string }
          | undefined;
        db.prepare(`
          INSERT INTO operaciones_pendientes (ref, titulo, descripcion)
          VALUES (?, ?, ?)
        `).run(
          ref,
          prop?.titulo ?? ref,
          "Esta propiedad ha desaparecido del feed de Inmovilla. Decide qué hacer con ella."
        );
      }
      // Keep the property in the DB until the admin resolves the pending action.
    }
  }

  const upsert = buildUpsertStatement(db);

  const insertMany = db.transaction((props: Property[]) => {
    for (const p of props) {
      // Detect if a closed/archived property is reappearing in the feed.
      // This can happen when an owner withdraws a property, then re-lists it.
      const closedOp = db.prepare(
        `SELECT estado FROM operaciones WHERE ref = ? AND estado IN ('archivado', 'vendido')`
      ).get(p.ref) as { estado: string } | undefined;

      if (closedOp) {
        const alreadyPending = db.prepare(
          `SELECT 1 FROM operaciones_pendientes WHERE ref = ? AND tipo = 'reaparicion' AND resuelta = 0`
        ).get(p.ref);
        if (!alreadyPending) {
          const estadoLabel = closedOp.estado === "vendido" ? "vendida" : "archivada";
          db.prepare(`
            INSERT INTO operaciones_pendientes (ref, titulo, tipo, descripcion)
            VALUES (?, ?, 'reaparicion', ?)
          `).run(
            p.ref,
            p.titulo,
            `Esta propiedad estaba ${estadoLabel} en el CRM pero ha vuelto a aparecer en el feed de Inmovilla. ¿Quieres reactivarla?`
          );
        }
      }

      upsert.run(propertyToRow(p, null));
      if (existingRefs.has(p.ref)) { updated++; } else { added++; }
    }
  });

  insertMany(properties);

  db.prepare(
    "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status, source) VALUES (?, ?, ?, 'ok', 'xml')"
  ).run(added, updated, removed);

  // Revalidate the Vercel Data Cache so detail pages pick up the new data
  try { revalidateTag("properties", "default"); } catch { /* non-fatal in local dev */ }

  // Persist DB to Blob so other containers can read the updated data
  await persistDbToBlob();

  return { added, updated, removed, total: properties.length, source: "xml" };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Seeds the DB from XML if it is empty (cold start without a Blob). */
export async function ensureDbSeeded(): Promise<void> {
  try {
    const db = getDb();
    const { c } = db.prepare("SELECT COUNT(*) as c FROM properties").get() as { c: number };
    if (c > 0) return;
    await syncFromXml();
  } catch {
    // Never block rendering
  }
}

/** Full XML sync — fetches all properties from the Inmovilla XML feed. */
export async function syncProperties(): Promise<SyncResult> {
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
    piscinaPrivada: Boolean(row.piscina_privada),
    piscinaComunitaria: Boolean(row.piscina_com),
    terraza:   Boolean(row.terraza),
    jardin:    Boolean(row.jardin),
    balcon:    Boolean(row.balcon),
    solarium:  Boolean(row.solarium),
    barbacoa:  Boolean(row.barbacoa),
    chimenea:  Boolean(row.chimenea),
    vistasalmar: Boolean(row.vistas_al_mar),
    amueblado: Boolean(row.amueblado),
    armaEmpotrado: Boolean(row.arma_empotrado),
    calefaccion: row.calefaccion ? String(row.calefaccion) : undefined,
    aireCond:  Boolean(row.aire_cond),
    bombafriocalor: Boolean(row.bomba_frio_calor),
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
    imagenes:  (() => { try { return JSON.parse(String(row.imagenes ?? "[]")); } catch { return []; } })(),
    video1:    row.video1 ? String(row.video1) : undefined,
    tour:      row.tour  ? String(row.tour)   : undefined,
    fecha:     String(row.fecha ?? ""),
    agente:    row.agente ? String(row.agente) : undefined,
    agenteEmail: row.agente_email ? String(row.agente_email) : undefined,
    agenteFoto:  row.agente_foto  ? String(row.agente_foto)  : undefined,
    agenteTelefono: row.agente_telefono ? String(row.agente_telefono) : undefined,
    slug:      String(row.slug ?? ""),
    planoPins: (() => { try { return JSON.parse(String(row.plano_pins ?? "[]")); } catch { return []; } })(),
  };
}
