import type { Property } from "@/types/property";

/* ─────────────────────────────────────────────────────────────────────
   EL RECORRIDO DE LA TARJETA

   Cada foto del XML viene etiquetada con su estancia (`eti`). Toda la
   cartera lo tiene. Eso permite que una tarjeta de la parrilla RECORRA la
   casa al pasar el ratón, en el orden en que se enseña una vivienda, con
   el nombre de la estancia.

   Por qué esto no lo puede copiar el mercado: no es código, es MATERIAL.
   TVH produce 22–57 fotos etiquetadas por vivienda. Quien sube ocho fotos
   de móvil no tiene con qué hacerlo. Es la única pieza de todo el
   rediseño que no se puede clonar.

   (Existe `planoPins` en el tipo Property —plano con chinchetas por
   estancia— y sería aún mejor: hoy está VACÍO en las 19 propiedades. La
   función está construida y nadie la ha usado. Si algún día se colocan las
   chinchetas, este recorrido puede ir sobre el plano.)
   ───────────────────────────────────────────────────────────────────── */

/* El orden en que se enseña una casa. `plano` y `360` quedan fuera a
   propósito: no son estancias, son documentos — romperían el paseo. */
const ORDEN = [
  "fachada",
  "vestibulo",
  "pasillo",
  "comedor",
  "cocina",
  "dormitorio",
  "bano",
  "aseo",
  "balcon",
  "terraza",
  "porche",
  "solarium",
  "jardin",
  "piscina",
  "zonas_comunes",
  "buhardilla",
  "garaje",
  "trastero",
  "lavadero",
  "parcela",
  "vistas",
] as const;

const NOMBRE: Record<string, string> = {
  fachada: "Fachada",
  vestibulo: "Entrada",
  pasillo: "Pasillo",
  comedor: "Salón",
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  bano: "Baño",
  aseo: "Aseo",
  balcon: "Balcón",
  terraza: "Terraza",
  porche: "Porche",
  solarium: "Solárium",
  jardin: "Jardín",
  piscina: "Piscina",
  zonas_comunes: "Piscina",
  buhardilla: "Buhardilla",
  garaje: "Garaje",
  trastero: "Trastero",
  lavadero: "Lavadero",
  parcela: "Parcela",
  vistas: "Vistas",
};

export type Parada = { src: string; estancia: string };

/**
 * Una parada por estancia, en orden de visita. `max` corta: pasado un
 * puñado de fotos el visitante ya ha decidido si le interesa, y cada foto
 * extra es peso que se descarga.
 */
export function recorridoDeTarjeta(p: Property, max = 6): Parada[] {
  const porEtiqueta = new Map<string, string>();
  for (const im of p.imagenes ?? []) {
    /* La primera de cada estancia: en el XML la primera suele ser la
       general y las siguientes, detalles. Para un recorrido mandan las
       generales. */
    if (im.eti && !porEtiqueta.has(im.eti)) porEtiqueta.set(im.eti, im.url);
  }

  const paradas: Parada[] = [];
  const vistos = new Set<string>();
  for (const eti of ORDEN) {
    const src = porEtiqueta.get(eti);
    if (!src) continue;
    const estancia = NOMBRE[eti] ?? eti;
    /* balcon+terraza, o piscina+zonas_comunes, son la misma parada: sin
       esto salen dos "Terraza" seguidas y parece que no avanza. */
    if (vistos.has(estancia)) continue;
    vistos.add(estancia);
    paradas.push({ src, estancia });
  }

  /* Sin etiquetas utilizables no hay recorrido: se cae a la portada. Mejor
     una foto quieta que un pase de diapositivas sin sentido. */
  if (paradas.length < 2) {
    const portada = p.imagenes?.[0]?.url;
    return portada ? [{ src: portada, estancia: "" }] : [];
  }

  /* LA PRIMERA PARADA ES LA PORTADA (decisión de Xavi, jul 2026): la foto
     en reposo de la tarjeta tiene que ser la misma portada que hoy enseña
     la web publicada — el recorrido empieza a partir de ella. Si la portada
     ya era una de las paradas, se quita de su sitio para no repetirla. */
  const portada = p.imagenes?.[0];
  if (portada && paradas[0]?.src !== portada.url) {
    const sinPortada = paradas.filter((x) => x.src !== portada.url);
    const eti = portada.eti ? NOMBRE[portada.eti] ?? "" : "";
    sinPortada.unshift({ src: portada.url, estancia: eti });
    return sinPortada.slice(0, max);
  }

  return paradas.slice(0, max);
}
