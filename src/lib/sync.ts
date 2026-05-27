import { getDb } from "./db";
import { fetchAndParseXML } from "./xml-parser";
import type { Property } from "@/types/property";

export interface SyncResult {
  added: number;
  updated: number;
  removed: number;
  total: number;
  error?: string;
}

/**
 * Ensures the DB has properties. Called on every server render that needs data.
 * On Vercel, each Lambda instance has its own empty /tmp — this auto-seeds it.
 */
export async function ensureDbSeeded(): Promise<void> {
  try {
    const db = getDb();
    const { c } = db
      .prepare("SELECT COUNT(*) as c FROM properties")
      .get() as { c: number };
    if (c === 0) {
      await syncProperties();
    }
  } catch {
    // Never block rendering — just log and continue with empty state
  }
}

export async function syncProperties(): Promise<SyncResult> {
  const db = getDb();
  let added = 0;
  let updated = 0;
  let removed = 0;

  try {
    const properties = await fetchAndParseXML();
    const incomingRefs = new Set(properties.map((p) => p.ref));

    // Get existing refs
    const existingRefs = new Set(
      (db.prepare("SELECT ref FROM properties").all() as { ref: string }[]).map(
        (r) => r.ref
      )
    );

    // Remove properties no longer in XML
    for (const ref of existingRefs) {
      if (!incomingRefs.has(ref)) {
        db.prepare("DELETE FROM properties WHERE ref = ?").run(ref);
        removed++;
      }
    }

    // Upsert properties
    const upsert = db.prepare(`
      INSERT INTO properties (
        id, ref, tipo, subtipo, operacion, precio, precio_anterior, outlet,
        porcentaje_bajada, estado_ficha, titulo, descripcion, ciudad, provincia,
        cp, zona, direccion, habitaciones, banos, m2_construidos, m2_utiles,
        m2_parcela, planta, ascensor, garaje, trastero, piscina, terraza,
        jardin, amueblado, calefaccion, aire_cond, orientacion, antiguedad,
        estado, ibi, gastos_comun, certificado_energetico, consumo_energetico,
        emisiones_letra, emisiones_energeticas, imagenes, video1, tour, fecha, agente, agente_email,
        agente_foto, agente_telefono, slug, updated_at
      ) VALUES (
        @id, @ref, @tipo, @subtipo, @operacion, @precio, @precioAnterior, @outlet,
        @porcentajeBajada, @estadoFicha, @titulo, @descripcion, @ciudad, @provincia,
        @cp, @zona, @direccion, @habitaciones, @banos, @m2Construidos, @m2Utiles,
        @m2Parcela, @planta, @ascensor, @garaje, @trastero, @piscina, @terraza,
        @jardin, @amueblado, @calefaccion, @aireCond, @orientacion, @antiguedad,
        @estado, @ibi, @gastosComun, @certificadoEnergetico, @consumoEnergetico,
        @emisionesLetra, @emisionesEnergeticas, @imagenes, @video1, @tour, @fecha, @agente, @agenteEmail,
        @agenteFoto, @agenteTelefono, @slug, datetime('now')
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
        ascensor = excluded.ascensor,
        garaje = excluded.garaje,
        trastero = excluded.trastero,
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
        certificado_energetico = excluded.certificado_energetico,
        consumo_energetico = excluded.consumo_energetico,
        emisiones_letra = excluded.emisiones_letra,
        emisiones_energeticas = excluded.emisiones_energeticas,
        imagenes = excluded.imagenes,
        video1 = excluded.video1,
        tour = excluded.tour,
        fecha = excluded.fecha,
        agente = excluded.agente,
        agente_email = excluded.agente_email,
        agente_foto = excluded.agente_foto,
        agente_telefono = excluded.agente_telefono,
        slug = excluded.slug,
        updated_at = datetime('now')
    `);

    const insertMany = db.transaction((props: Property[]) => {
      for (const p of props) {
        const result = upsert.run({
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
          ascensor: p.ascensor ? 1 : 0,
          garaje: p.garaje ? 1 : 0,
          trastero: p.trastero ? 1 : 0,
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
          certificadoEnergetico: p.certificadoEnergetico ?? null,
          consumoEnergetico: p.consumoEnergetico ?? null,
          emisionesLetra: p.emisionesLetra ?? null,
          emisionesEnergeticas: p.emisionesEnergeticas ?? null,
          imagenes: JSON.stringify(p.imagenes),
          video1: p.video1 ?? null,
          tour: p.tour ?? null,
          fecha: p.fecha,
          agente: p.agente ?? null,
          agenteEmail: p.agenteEmail ?? null,
          agenteFoto: p.agenteFoto ?? null,
          agenteTelefono: p.agenteTelefono ?? null,
          slug: p.slug,
        });

        if (existingRefs.has(p.ref)) {
          updated++;
        } else {
          added++;
        }
      }
    });

    insertMany(properties);

    // Log sync
    db.prepare(
      "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status) VALUES (?, ?, ?, 'ok')"
    ).run(added, updated, removed);

    return { added, updated, removed, total: properties.length };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    db.prepare(
      "INSERT INTO sync_log (properties_added, properties_updated, properties_removed, status, error) VALUES (0, 0, 0, 'error', ?)"
    ).run(errMsg);
    return { added: 0, updated: 0, removed: 0, total: 0, error: errMsg };
  }
}

export function getPropertiesFromDb(filters?: {
  tipo?: string;
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

  if (filters?.tipo) {
    conditions.push("tipo = ?");
    params.push(filters.tipo);
  }
  if (filters?.precioMin) {
    conditions.push("precio >= ?");
    params.push(filters.precioMin);
  }
  if (filters?.precioMax) {
    conditions.push("precio <= ?");
    params.push(filters.precioMax);
  }
  if (filters?.habitaciones) {
    conditions.push("habitaciones >= ?");
    params.push(filters.habitaciones);
  }
  if (filters?.m2Min) {
    conditions.push("m2_construidos >= ?");
    params.push(filters.m2Min);
  }
  if (filters?.ciudad) {
    conditions.push("LOWER(ciudad) LIKE ?");
    params.push(`%${filters.ciudad.toLowerCase()}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const offset = (page - 1) * limit;

  const countResult = db
    .prepare(`SELECT COUNT(*) as count FROM properties ${where}`)
    .get(...params) as { count: number };
  const total = countResult.count;

  const rows = db
    .prepare(
      `SELECT * FROM properties ${where} ORDER BY fecha DESC LIMIT ? OFFSET ?`
    )
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
    id: String(row.id),
    ref: String(row.ref),
    tipo: String(row.tipo),
    subtipo: row.subtipo ? String(row.subtipo) : undefined,
    operacion: String(row.operacion),
    precio: Number(row.precio),
    precioAnterior: row.precio_anterior ? Number(row.precio_anterior) : undefined,
    outlet: Boolean(row.outlet),
    porcentajeBajada: row.porcentaje_bajada ? Number(row.porcentaje_bajada) : undefined,
    estadoFicha: Number(row.estado_ficha),
    titulo: String(row.titulo),
    descripcion: String(row.descripcion ?? ""),
    ciudad: String(row.ciudad ?? ""),
    provincia: String(row.provincia ?? ""),
    cp: row.cp ? String(row.cp) : undefined,
    zona: row.zona ? String(row.zona) : undefined,
    direccion: row.direccion ? String(row.direccion) : undefined,
    habitaciones: row.habitaciones ? Number(row.habitaciones) : undefined,
    banos: row.banos ? Number(row.banos) : undefined,
    m2Construidos: row.m2_construidos ? Number(row.m2_construidos) : undefined,
    m2Utiles: row.m2_utiles ? Number(row.m2_utiles) : undefined,
    m2Parcela: row.m2_parcela ? Number(row.m2_parcela) : undefined,
    planta: row.planta ? String(row.planta) : undefined,
    ascensor: Boolean(row.ascensor),
    garaje: Boolean(row.garaje),
    trastero: Boolean(row.trastero),
    piscina: Boolean(row.piscina),
    terraza: Boolean(row.terraza),
    jardin: Boolean(row.jardin),
    amueblado: Boolean(row.amueblado),
    calefaccion: row.calefaccion ? String(row.calefaccion) : undefined,
    aireCond: Boolean(row.aire_cond),
    orientacion: row.orientacion ? String(row.orientacion) : undefined,
    antiguedad: row.antiguedad ? String(row.antiguedad) : undefined,
    estado: row.estado ? String(row.estado) : undefined,
    ibi: row.ibi ? Number(row.ibi) : undefined,
    gastosComun: row.gastos_comun ? Number(row.gastos_comun) : undefined,
    certificadoEnergetico: row.certificado_energetico
      ? String(row.certificado_energetico)
      : undefined,
    consumoEnergetico: row.consumo_energetico
      ? String(row.consumo_energetico)
      : undefined,
    emisionesLetra: row.emisiones_letra
      ? String(row.emisiones_letra)
      : undefined,
    emisionesEnergeticas: row.emisiones_energeticas
      ? String(row.emisiones_energeticas)
      : undefined,
    imagenes: JSON.parse(String(row.imagenes ?? "[]")),
    video1: row.video1 ? String(row.video1) : undefined,
    tour: row.tour ? String(row.tour) : undefined,
    fecha: String(row.fecha ?? ""),
    agente: row.agente ? String(row.agente) : undefined,
    agenteEmail: row.agente_email ? String(row.agente_email) : undefined,
    agenteFoto: row.agente_foto ? String(row.agente_foto) : undefined,
    agenteTelefono: row.agente_telefono ? String(row.agente_telefono) : undefined,
    slug: String(row.slug ?? ""),
  };
}
