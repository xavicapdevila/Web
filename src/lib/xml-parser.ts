import { parseStringPromise } from "xml2js";
import type { Property, PropertyImage } from "@/types/property";

const XML_URL = "https://procesos.apinmo.com/xml/v2/Le2l3OHN/10720-web.xml";

function safeText(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return safeText(val[0]);
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("_" in obj) return String(obj["_"]).trim();
  }
  return String(val).trim();
}

function safeNum(val: unknown): number {
  const s = safeText(val).replace(",", ".").replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function safeInt(val: unknown): number {
  return Math.round(safeNum(val));
}

function safeBool(val: unknown): boolean {
  const s = safeText(val).toLowerCase();
  return s === "1" || s === "si" || s === "sí" || s === "yes" || s === "true";
}

function buildSlug(ref: string, tipo: string, ciudad: string): string {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return `${normalize(ref)}-${normalize(tipo)}-${normalize(ciudad)}`;
}

function mapSubtipo(tipoRaw: string): string | undefined {
  const t = tipoRaw.toLowerCase();
  if (t.includes("ático") || t.includes("atico")) return "ático";
  if (t.includes("planta baja") || t.startsWith("bajo")) return "planta baja";
  if (t.includes("dúplex") || t.includes("duplex")) return "dúplex";
  if (t.includes("semisótano") || t.includes("semisotan") || t.includes("semisotano")) return "semisótano";
  return undefined;
}

function mapTipo(tipo: string): string {
  const t = tipo.toLowerCase();
  if (
    t.includes("piso") || t.includes("apartamento") || t.includes("flat") ||
    t.includes("ático") || t.includes("atico") ||
    t.includes("planta baja") || t.startsWith("bajo") ||
    t.includes("dúplex") || t.includes("duplex") ||
    t.includes("semisótano") || t.includes("semisotan") || t.includes("semisotano")
  ) return "piso";
  if (
    t.includes("casa") || t.includes("house") ||
    t.includes("chalet") || t.includes("villa") ||
    t.includes("adosado") || t.includes("pareado") ||
    t.includes("bungalow") || t.includes("duplex") || t.includes("dúplex")
  ) return "casa";
  if (t.includes("terreno") || t.includes("solar") || t.includes("parcela")) return "terreno";
  if (t.includes("local") || t.includes("comercial")) return "local";
  if (t.includes("oficina")) return "oficina";
  if (t.includes("garaje") || t.includes("parking")) return "garaje";
  if (t.includes("trastero")) return "trastero";
  if (t.includes("nave") || t.includes("industrial")) return "nave";
  return tipo.toLowerCase();
}

function mapOperacion(op: string): string {
  const o = op.toLowerCase();
  if (o.includes("vend") || o.includes("venta") || o.includes("sell")) return "venta";
  if (o.includes("alquil") || o.includes("rent")) return "alquiler";
  return "venta";
}

// Parse foto elements which have eti as attribute: <foto1 eti="fachada">url</foto1>
// xml2js with mergeAttrs:true converts this to item.foto1 = { _: "url", eti: "fachada" }
function parseImages(item: Record<string, unknown>): PropertyImage[] {
  const images: PropertyImage[] = [];

  for (let i = 1; i <= 60; i++) {
    const fotoKey = `foto${i}`;
    const fotoVal = item[fotoKey];
    if (!fotoVal) continue;

    let url = "";
    let eti: string | undefined;

    if (typeof fotoVal === "string") {
      url = fotoVal.trim();
    } else if (typeof fotoVal === "object" && fotoVal !== null) {
      const fObj = fotoVal as Record<string, unknown>;
      url = safeText(fObj["_"] ?? fObj["$text"] ?? "");
      eti = fObj["eti"] ? safeText(fObj["eti"]) : undefined;
    }

    if (url && url.startsWith("http")) {
      images.push({ url, eti: eti || undefined });
    }
  }

  return images;
}

export async function fetchAndParseXML(): Promise<Property[]> {
  const res = await fetch(XML_URL, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch XML: ${res.status} ${res.statusText}`);
  }

  const xmlText = await res.text();
  const parsed = await parseStringPromise(xmlText, {
    explicitArray: false,
    mergeAttrs: true,
    trim: true,
    charkey: "_",
  });

  // Root is <propiedades><propiedad>
  const root =
    parsed?.propiedades?.propiedad ??
    parsed?.inmuebles?.inmueble ??
    parsed?.root?.propiedad ??
    [];
  const items: Record<string, unknown>[] = Array.isArray(root) ? root : [root];

  const properties: Property[] = [];

  for (const item of items) {
    try {
      const ref = safeText(item["ref"]);
      if (!ref) continue;

      // Type — field is tipo_ofer in Inmovilla
      const tipoRaw = safeText(item["tipo_ofer"] ?? item["tipovivienda"] ?? item["tipo"] ?? "");
      const tipo = mapTipo(tipoRaw);
      const subtipo = mapSubtipo(tipoRaw);

      // Operation — field is accion in Inmovilla
      const operacionRaw = safeText(item["accion"] ?? item["operacion"] ?? "Vender");
      const operacion = mapOperacion(operacionRaw);

      // Price — precioinmo for sale, precioalq for rent
      const precio =
        operacion === "alquiler"
          ? safeNum(item["precioalq"] ?? item["precio"])
          : safeNum(item["precioinmo"] ?? item["precio"]);

      // Outlet: if outlet > 0, it's the previous price, current price is precioinmo
      const outletVal = safeNum(item["outlet"] ?? 0);
      const outlet = outletVal > 0;
      const precioAnterior = outlet ? outletVal : undefined;
      const porcentajeBajada =
        outlet && precioAnterior && precioAnterior > precio
          ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
          : undefined;

      const estadoFicha = safeInt(item["estadoficha"] ?? 1);

      const ciudad = safeText(item["ciudad"] ?? "");
      const provincia = safeText(item["provincia"] ?? "");
      const cp = safeText(item["cp"] ?? "");
      const zona = safeText(item["zona"] ?? "");
      const direccion = safeText(item["direccion"] ?? "");

      // Title: titulo1 (CDATA)
      const titulo = safeText(
        item["titulo1"] ??
          item["titulo"] ??
          `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} en ${ciudad}`
      );

      // Description: descrip1 (CDATA) with ~~ → \n\n
      const descripcionRaw = safeText(item["descrip1"] ?? item["descripcion"] ?? "");
      const descripcion = descripcionRaw.replace(/~~/g, "\n\n").replace(/~$/g, "").trim();

      // Images from foto1..fotoN attributes
      const imagenes = parseImages(item);

      // Video — nested in <videos><video1>
      let video1: string | undefined;
      let tour: string | undefined;
      const videosNode = item["videos"] as Record<string, unknown> | undefined;
      if (videosNode && typeof videosNode === "object") {
        const v1 = safeText(videosNode["video1"]);
        if (v1) video1 = v1;
        const t1 = safeText(videosNode["tour"] ?? videosNode["video360"] ?? "");
        if (t1) tour = t1;
      }
      // Also check top-level tour field
      if (!tour) {
        const tourTop = safeText(item["tour"] ?? item["video360"] ?? item["tour_virtual"] ?? "");
        if (tourTop) tour = tourTop;
      }

      const fecha = safeText(item["fecha"] ?? new Date().toISOString().slice(0, 10));

      // Dimensions — m_cons, m_uties, m_parcela
      const habitaciones = safeInt(item["habitaciones"] ?? 0);
      const banos = safeInt(item["banyos"] ?? item["banos"] ?? item["aseos"] ?? 0);
      const m2Construidos = safeNum(item["m_cons"] ?? item["m2construidos"] ?? 0);
      const m2Utiles = safeNum(item["m_uties"] ?? item["m2utiles"] ?? 0);
      const m2Parcela = safeNum(item["m_parcela"] ?? item["m2parcela"] ?? 0);
      const planta = safeText(item["planta"] ?? "");
      const numPlantasRaw = safeInt(item["numplanta"] ?? 0);
      const numPlantas = numPlantasRaw > 0 ? numPlantasRaw : undefined;

      const ascensor = safeBool(item["ascensor"]);
      const hasGaraje  = safeBool(item["plaza_gara"]) || safeBool(item["garaje"]);
      const hasParking = safeBool(item["parking"]);
      const garaje     = hasGaraje || hasParking;
      const garajeTipo = hasParking ? "parking" : "garaje";
      const trastero = safeBool(item["trastero"]);
      const piscina = safeBool(item["piscina_prop"] ?? item["piscina_com"] ?? item["piscina"]);
      const terraza = safeBool(item["terraza"]);
      const jardin = safeBool(item["jardin"]);
      const amueblado = safeBool(item["muebles"]);
      const aireCond = safeBool(item["aire_con"] ?? item["airecentral"]);
      const urbanizacion = safeBool(item["urbanizacion"]);

      // Calefaccion: field is 0 or name
      const calefaccionRaw = safeText(item["calefaccion"] ?? "");
      const calefaccion = calefaccionRaw === "0" ? "" : calefaccionRaw;

      const orientacion = safeText(item["orientacion"] ?? "");
      const antiguedad = safeText(item["antiguedad"] ?? "");
      const estadoInmueble = safeText(item["conservacion"] ?? item["estado"] ?? "");

      const ibi = safeNum(item["ibi"] ?? 0);
      const gastosComun = safeNum(item["gastos_com"] ?? 0);
      const periodicidadComunidad = safeText(item["tipomensual"] ?? "");

      // Energy certificate — apinmo feed uses energialetra / energiavalor / emisionesletra / emisionesvalor
      // energiarecibido = 1 means the certificate has been received/is valid
      // energiarecibido: 1=recibido, 2=en trámite, 3=exento
      const energiaRecibido = safeInt(item["energiarecibido"] ?? 0);
      const energiaExento = energiaRecibido === 3;
      const certEnergetico = energiaRecibido === 1
        ? safeText(item["energialetra"] ?? item["califica_e"] ?? item["certificadoenergetico"] ?? "")
        : safeText(item["califica_e"] ?? item["certificadoenergetico"] ?? "");
      const consumoEnergetico = safeText(item["energiavalor"] ?? item["consum_e"] ?? "");
      const emisionesLetra = safeText(item["emisionesletra"] ?? "");
      const emisionesEnergeticas = safeText(item["emisionesvalor"] ?? item["emision_e"] ?? "");

      const agente = safeText(item["agente"] ?? "");
      const agenteEmail = safeText(item["email_agente"] ?? "");
      const agenteFoto = safeText(item["foto_agente"] ?? "");
      const prefijo = safeText(item["prefijo_tlf_agente"] ?? "34").replace(/\D/g, "") || "34";
      const tlfAgente = safeText(item["tlf_agente"] ?? "").replace(/\D/g, "");
      const agenteTelefono = tlfAgente ? `${prefijo}${tlfAgente}` : undefined;

      const slug = buildSlug(ref, tipo, ciudad);
      const id = `prop_${ref}`;

      properties.push({
        id,
        ref,
        tipo,
        subtipo,
        operacion,
        precio,
        precioAnterior,
        outlet,
        porcentajeBajada,
        estadoFicha,
        titulo,
        descripcion,
        ciudad,
        provincia,
        cp: cp || undefined,
        zona: zona || undefined,
        direccion: direccion || undefined,
        habitaciones: habitaciones || undefined,
        banos: banos || undefined,
        m2Construidos: m2Construidos || undefined,
        m2Utiles: m2Utiles > 0 ? m2Utiles : undefined,
        m2Parcela: m2Parcela > 0 ? m2Parcela : undefined,
        planta: (planta && planta !== "0") ? planta : undefined,
        numPlantas,
        ascensor,
        garaje,
        garajeTipo,
        trastero,
        urbanizacion,
        piscina,
        terraza,
        jardin,
        amueblado,
        calefaccion: calefaccion || undefined,
        aireCond,
        orientacion: orientacion || undefined,
        antiguedad: antiguedad || undefined,
        estado: estadoInmueble || undefined,
        ibi: ibi > 0 ? ibi : undefined,
        gastosComun: gastosComun > 0 ? gastosComun : undefined,
        periodicidadComunidad: periodicidadComunidad || undefined,
        certificadoEnergetico: certEnergetico || undefined,
        consumoEnergetico: consumoEnergetico || undefined,
        emisionesLetra: emisionesLetra || undefined,
        emisionesEnergeticas: emisionesEnergeticas || undefined,
        energiaExento: energiaExento || undefined,
        imagenes,
        video1,
        tour,
        fecha,
        agente: agente || undefined,
        agenteEmail: agenteEmail || undefined,
        agenteFoto: agenteFoto || undefined,
        agenteTelefono,
        slug,
      });
    } catch (err) {
      console.error("Error parsing property:", err);
    }
  }

  return properties;
}
