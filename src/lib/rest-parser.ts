/**
 * Inmovilla REST API client.
 * Base URL:  https://procesos.inmovilla.com/api/v1
 * Auth:      Token header (env: INMOVILLA_API_TOKEN)
 * Rate limit: 10 req/min for /propiedades, 2 req/min for /enums
 *
 * Image pattern: https://fotos15.inmovilla.com/{numagencia}/{cod_ofer}/{fotoletra}-{N}.jpg
 */

import type { Property, PropertyImage } from "@/types/property";

const REST_BASE = "https://procesos.inmovilla.com/api/v1";
const PHOTOS_BASE = "https://fotos15.inmovilla.com";

// ── CP → City / Province fallback (when enum is unavailable) ─────────────────

const CITY_FROM_CP: Record<string, string> = {
  "08800": "Vilanova i la Geltrú",
  "08810": "Sant Pere de Ribes",
  "08811": "Calafell",
  "08813": "Calafell",
  "08820": "El Prat de Llobregat",
  "08830": "Sant Boi de Llobregat",
  "08840": "Viladecans",
  "08850": "Gavà",
  "08860": "Castelldefels",
  "08861": "Sitges",
  "08870": "Sitges",
  "08880": "Cubelles",
  "08881": "Cubelles",
  "08720": "Vilafranca del Penedès",
  "43700": "El Vendrell",
  "43760": "El Cunit",
  "43880": "Cubelles",
};

function cpToProvince(cp: string): string {
  const prefix = cp.slice(0, 2);
  const map: Record<string, string> = {
    "08": "Barcelona", "09": "Barcelona",
    "43": "Tarragona",
    "17": "Girona",
    "25": "Lleida",
  };
  return map[prefix] ?? "";
}

// ── City enum cache (module-level, persists per Lambda process) ───────────────

let _cityMap: Map<number, string> | null = null;
let _cityMapTs = 0;
const CITY_TTL = 6 * 60 * 60 * 1_000; // 6 hours

async function getCityMap(token: string): Promise<Map<number, string>> {
  if (_cityMap && Date.now() - _cityMapTs < CITY_TTL) return _cityMap;

  try {
    const res = await fetch(`${REST_BASE}/enums/?ciudades`, {
      headers: { Token: token, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`enum ${res.status}`);

    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("bad enum format");

    const map = new Map<number, string>();
    for (const item of data as Array<{ valor: number; nombre: string }>) {
      if (item.valor != null && item.nombre) map.set(Number(item.valor), String(item.nombre));
    }
    _cityMap = map;
    _cityMapTs = Date.now();
    return map;
  } catch {
    // Return stale cache or empty map — city lookup will fall back to CP
    return _cityMap ?? new Map();
  }
}

// ── Field-mapping helpers ─────────────────────────────────────────────────────

/** keyacci values that mean "alquiler" */
const ALQUILER_CODES = new Set([2, 9, 15, 16, 20]);

function mapKeyAcci(keyacci: number): string {
  return ALQUILER_CODES.has(keyacci) ? "alquiler" : "venta";
}

function mapTipo(raw: string): string {
  const t = raw.toLowerCase();
  if (
    t.includes("piso") || t.includes("apartamento") || t.includes("flat") ||
    t.includes("ático") || t.includes("atico") ||
    t.includes("planta baja") || t.startsWith("bajo") ||
    t.includes("dúplex") || t.includes("duplex") ||
    t.includes("semisótano") || t.includes("semisotano") ||
    t.includes("estudio")
  ) return "piso";
  if (
    t.includes("casa") || t.includes("house") || t.includes("chalet") ||
    t.includes("villa") || t.includes("adosado") || t.includes("pareado") ||
    t.includes("bungalow") || t.includes("masía") || t.includes("masia") ||
    t.includes("cortijo") || t.includes("torre") || t.includes("hacienda") ||
    t.includes("rústi")
  ) return "casa";
  if (t.includes("terreno") || t.includes("solar") || t.includes("parcela")) return "terreno";
  if (t.includes("local") || t.includes("comercial") || t.includes("tienda")) return "local";
  if (t.includes("oficina") || t.includes("despacho")) return "oficina";
  if (t.includes("garaje") || t.includes("parking") || t.includes("plaza gara")) return "garaje";
  if (t.includes("trastero")) return "trastero";
  if (
    t.includes("nave") || t.includes("industrial") ||
    t.includes("almacén") || t.includes("almacen") ||
    t.includes("fábrica") || t.includes("fabrica")
  ) return "nave";
  return raw.toLowerCase() || "piso";
}

function mapSubtipo(raw: string): string | undefined {
  const t = raw.toLowerCase();
  if (t.includes("ático") || t.includes("atico")) return "ático";
  if (t.includes("planta baja") || t.startsWith("bajo")) return "planta baja";
  if (t.includes("dúplex") || t.includes("duplex")) return "dúplex";
  if (t.includes("semisótano") || t.includes("semisotano")) return "semisótano";
  return undefined;
}

function buildSlug(ref: string, tipo: string, ciudad: string): string {
  const n = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return `${n(ref)}-${n(tipo)}-${n(ciudad)}`;
}

function buildImages(
  numagencia: string | number,
  codOfer: number,
  fotoletra: string | number,
  numfotos: number
): PropertyImage[] {
  const agency = String(numagencia).trim();
  const letter = String(fotoletra).trim();
  const imgs: PropertyImage[] = [];
  for (let i = 1; i <= numfotos; i++) {
    imgs.push({ url: `${PHOTOS_BASE}/${agency}/${codOfer}/${letter}-${i}.jpg` });
  }
  return imgs;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RestListItem {
  cod_ofer: number;
  ref: string;
  nodisponible: boolean | number;
  prospecto: boolean | number;
  fechaact: string;
}

export interface RestFetchResult {
  /** Properties that were new or changed since last sync */
  properties: Property[];
  /** ref → fechaact for all fetched properties (store in DB for next diff) */
  fechaacts: Map<string, string>;
  /** Refs that should be removed from DB (deactivated or deleted in Inmovilla) */
  removedRefs: string[];
  /** Number of unchanged properties that were skipped */
  unchanged: number;
}

// ── Low-level helpers ─────────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function apiFetch(path: string, token: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${REST_BASE}${path}`, {
      headers: { Token: token, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    // Rate-limit or error response
    if (data && typeof data === "object" && "error" in data) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── Property mapper ───────────────────────────────────────────────────────────

function mapDetail(
  d: Record<string, unknown>,
  cityMap: Map<number, string>
): Property | null {
  const ref = String(d.ref ?? "").trim();
  if (!ref) return null;

  const tipoRaw = String(d.tituloes ?? "").trim();
  const tipo = mapTipo(tipoRaw) || "piso";
  const subtipo = mapSubtipo(tipoRaw);

  const operacion = mapKeyAcci(Number(d.keyacci ?? 1));

  const precioinmo = Number(d.precioinmo ?? d.precio ?? 0);
  const precioalq  = Number(d.precioalq ?? 0);
  const precio     = operacion === "alquiler" ? precioalq : precioinmo;

  const outletVal      = Number(d.outlet ?? 0);
  const outlet         = outletVal > 0;
  const precioAnterior = outlet ? outletVal : undefined;
  const porcentajeBajada =
    outlet && precioAnterior && precioAnterior > precio
      ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
      : undefined;

  const estadoFicha = Number(d.estadoficha ?? 1);

  const cp      = String(d.cp ?? "").trim();
  const ciudad  = cityMap.get(Number(d.key_loca ?? 0)) ?? CITY_FROM_CP[cp] ?? "";
  const provincia = cpToProvince(cp);

  const descRaw   = String(d.descripciones ?? "").trim();
  const descripcion = descRaw
    .replace(/^~+/, "")
    .replace(/~~/g, "\n\n")
    .replace(/~+$/, "")
    .trim();

  const numfotos = Number(d.numfotos ?? 0);
  const codOfer  = Number(d.cod_ofer);
  const imagenes =
    numfotos > 0
      ? buildImages(d.numagencia as string | number, codOfer, d.fotoletra as string | number, numfotos)
      : [];

  const ascensor   = Number(d.ascensor) > 0;
  const hasGaraje  = Number(d.plaza_gara) > 0 || Number(d.garaje) > 0;
  const parkingCode = Number(d.parking ?? 0);
  const hasParking = parkingCode > 0;
  const garaje     = hasGaraje || hasParking;
  const garajeTipo: "garaje" | "parking" = hasParking && !hasGaraje ? "parking" : "garaje";

  const trastero    = Number(d.trastero) > 0;
  const piscina     = Number(d.piscina_prop) > 0 || Number(d.piscina_com) > 0;
  const terraza     = Number(d.terraza) > 0;
  const jardin      = Number(d.jardin) > 0;
  const amueblado   = Number(d.muebles) > 0;
  const aireCond    = Number(d.aire_con ?? d.airecentral ?? 0) > 0;
  const urbanizacion = Number(d.urbanizacion) > 0;

  const calefCode = Number(d.calefaccion ?? d.keycalefa ?? 0);
  const calefaccion = calefCode > 0 ? String(calefCode) : undefined;

  const energiaRecibido = Number(d.energiarecibido ?? 0);
  const energiaExento   = energiaRecibido === 3;
  const certEnergetico  = energiaRecibido >= 1 ? String(d.energialetra ?? "").trim() : "";
  const consumoEnergetico  = d.energiavalor  ? String(d.energiavalor)  : undefined;
  const emisionesLetra     = d.emisionesletra ? String(d.emisionesletra).trim() : undefined;
  const emisionesEnergeticas = d.emisionesvalor ? String(d.emisionesvalor) : undefined;

  const habitaciones  = Number(d.habitaciones ?? 0)  || undefined;
  const banos         = Number(d.banyos ?? d.aseos ?? 0) || undefined;
  const m2Construidos = Number(d.m_cons   ?? 0) || undefined;
  const m2Utiles      = Number(d.m_utiles ?? 0) || undefined;
  const m2Parcela     = Number(d.m_parcela ?? 0) || undefined;
  const planta        = d.planta !== undefined && Number(d.planta) !== 0 ? String(d.planta) : undefined;
  const numPlantas    = Number(d.numplantas ?? 0) || undefined;

  const fechaStr = String(d.fecha ?? d.fechaact ?? "");
  const fecha    = fechaStr ? fechaStr.slice(0, 10) : new Date().toISOString().slice(0, 10);

  const slug = buildSlug(ref, tipo, ciudad);
  const id   = `prop_${ref}`;

  return {
    id, ref, tipo, subtipo, operacion, precio,
    precioAnterior, outlet, porcentajeBajada, estadoFicha,
    titulo: tipoRaw || `${tipo} en ${ciudad}`,
    descripcion, ciudad, provincia,
    cp: cp || undefined,
    zona: undefined,
    direccion: d.calle
      ? `${String(d.calle)}${d.numero ? ` ${d.numero}` : ""}`
      : undefined,
    habitaciones, banos, m2Construidos, m2Utiles, m2Parcela,
    planta, numPlantas,
    ascensor, garaje, garajeTipo, trastero, urbanizacion,
    piscina, terraza, jardin, amueblado, calefaccion, aireCond,
    orientacion: undefined,
    antiguedad: d.antiguedad ? String(d.antiguedad) : undefined,
    estado:     d.conservacion ? String(d.conservacion) : undefined,
    ibi:        Number(d.ibi ?? 0)        || undefined,
    gastosComun: Number(d.gastos_com ?? 0) || undefined,
    periodicidadComunidad: d.tipomensual ? String(d.tipomensual) : undefined,
    certificadoEnergetico: certEnergetico || undefined,
    consumoEnergetico, emisionesLetra, emisionesEnergeticas,
    energiaExento: energiaExento || undefined,
    imagenes,
    // REST API does not return tour/video URLs — sync.ts will preserve existing DB values
    video1: undefined,
    tour:   undefined,
    // REST API uses keyagente (numeric) — agent details preserved from existing DB values
    agente: undefined, agenteEmail: undefined, agenteFoto: undefined, agenteTelefono: undefined,
    fecha, slug,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Fetch properties from Inmovilla REST API with differential sync.
 *
 * @param existingFechacts  Map<ref, fechaact> from the DB.
 *                          Pass an empty Map to force a full resync.
 * @param existingRefs      Set<ref> of refs currently in the DB.
 */
export async function fetchFromRestApi(
  existingFechacts: Map<string, string> = new Map(),
  existingRefs: Set<string> = new Set()
): Promise<RestFetchResult> {
  const token = process.env.INMOVILLA_API_TOKEN;
  if (!token) throw new Error("INMOVILLA_API_TOKEN is not set");

  // 1. Fetch full list (includes nodisponible entries)
  const listData = await apiFetch("/propiedades/?listado", token);
  if (!listData) throw new Error("REST list endpoint returned null");

  const list = (Array.isArray(listData) ? listData : []) as RestListItem[];

  // Partition: active vs. inactive
  const activeItems = list.filter((i) => !i.nodisponible && !i.prospecto);
  const activeRefs  = new Set(activeItems.map((i) => i.ref));
  const allRefs     = new Set(list.map((i) => i.ref));

  // Properties to remove: in our DB but now deactivated or deleted in Inmovilla
  const removedRefs = [...existingRefs].filter(
    (ref) => !activeRefs.has(ref) || !allRefs.has(ref)
  );

  // Differential: only fetch properties whose fechaact changed
  const toFetch = activeItems.filter(
    (item) => existingFechacts.get(item.ref) !== item.fechaact
  );
  const unchanged = activeItems.length - toFetch.length;

  if (toFetch.length === 0) {
    return { properties: [], fechaacts: new Map(), removedRefs, unchanged };
  }

  // 2. Fetch city enum (cached, non-blocking fallback)
  const cityMap = await getCityMap(token);

  // 3. Fetch property details — rate-limited at ~8 req/min (7.5 s between calls)
  //    Safe margin below the 10 req/min API limit.
  const RATE_DELAY = 7_500;
  const properties: Property[] = [];
  const fechaacts  = new Map<string, string>();

  for (let i = 0; i < toFetch.length; i++) {
    if (i > 0) await wait(RATE_DELAY);

    const item   = toFetch[i];
    const detail = await apiFetch(`/propiedades/?cod_ofer=${item.cod_ofer}`, token);
    if (!detail) continue;

    // Skip listings hidden from internet
    if (detail.eninternet !== undefined && Number(detail.eninternet) !== 1) continue;

    const property = mapDetail(detail, cityMap);
    if (property) {
      properties.push(property);
      fechaacts.set(item.ref, item.fechaact);
    }
  }

  return { properties, fechaacts, removedRefs, unchanged };
}
