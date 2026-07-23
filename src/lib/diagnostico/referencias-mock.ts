/**
 * Referencias de mercado SIMULADAS (mock data) por municipio, zona y tipología.
 *
 * ⚠️ DATOS DEMOSTRATIVOS. Los €/m² y niveles de demanda de este archivo son
 * inventados para el prototipo: son plausibles para el Garraf pero NO
 * proceden de ninguna fuente real y NUNCA deben mostrarse como dato de
 * mercado al usuario. La interfaz solo los usa de forma indirecta (bandas,
 * comparaciones relativas), jamás como cifra.
 */

import type { RespuestasDiagnostico, TipoVivienda } from "./tipos";

export interface ZonaRef {
  id: string;
  nombre: string;
  /** Nivel de demanda simulado 0–100 */
  demanda: number;
  /** €/m² base simulado para un piso en buen estado */
  precioM2Base: number;
}

export interface MunicipioRef {
  id: string;
  nombre: string;
  /** Multiplicador de demanda por tipología (1 = neutro) */
  demandaTipo: Record<TipoVivienda, number>;
  zonas: ZonaRef[];
}

/**
 * Las zonas replican la división oficial de Idealista por municipio
 * (consultada en idealista.com, jul 2026), para que el propietario reconozca
 * su zona con los mismos nombres que ve en los portales — pero escritas en
 * catalán (Idealista las sirve con castellanismos: "Centro Pueblo",
 * "San Sebastian", "Urbanización"…). La demanda y el €/m² de cada zona
 * siguen siendo SIMULADOS.
 */
export const MUNICIPIOS: MunicipioRef[] = [
  {
    id: "vilanova",
    nombre: "Vilanova i la Geltrú",
    demandaTipo: { piso: 1.0, atico: 1.08, "planta-baja": 0.94, casa: 1.02, adosada: 1.04 },
    zonas: [
      { id: "barri-de-mar", nombre: "Barri de Mar", demanda: 92, precioM2Base: 2850 },
      { id: "centre-vila-la-geltru", nombre: "Centre Vila - La Geltrú", demanda: 88, precioM2Base: 2450 },
      { id: "fondo-somella", nombre: "Fondo Somella", demanda: 70, precioM2Base: 2250 },
      { id: "aragai-prat-de-vilanova", nombre: "L'Aragai - Prat de Vilanova", demanda: 90, precioM2Base: 2900 },
      { id: "la-collada-sis-camins", nombre: "La Collada - Sis Camins", demanda: 68, precioM2Base: 2100 },
      { id: "les-casernes-sant-jordi", nombre: "Les Casernes - Sant Jordi", demanda: 76, precioM2Base: 2350 },
      { id: "masia-nova-solicrup", nombre: "Masia Nova - Solicrup", demanda: 72, precioM2Base: 2400 },
      { id: "nord", nombre: "Nord", demanda: 66, precioM2Base: 2050 },
      { id: "ribes-roges", nombre: "Ribes Roges", demanda: 95, precioM2Base: 2950 },
      { id: "sant-joan-aiguacuit", nombre: "Sant Joan - L'Aiguacuit", demanda: 82, precioM2Base: 2400 },
      { id: "santa-maria", nombre: "Santa Maria", demanda: 74, precioM2Base: 2600 },
    ],
  },
  {
    id: "sant-pere-de-ribes",
    nombre: "Sant Pere de Ribes",
    demandaTipo: { piso: 0.96, atico: 1.0, "planta-baja": 0.94, casa: 1.06, adosada: 1.08 },
    zonas: [
      { id: "centro-pueblo", nombre: "Centre Poble", demanda: 78, precioM2Base: 2300 },
      { id: "les-roquetes", nombre: "Les Roquetes", demanda: 70, precioM2Base: 2050 },
      { id: "mas-alba-can-lloses", nombre: "Mas Alba-Can Lloses", demanda: 62, precioM2Base: 2150 },
      { id: "mas-den-serra-els-cards", nombre: "Mas d'en Serra-Els Cards", demanda: 68, precioM2Base: 2350 },
      { id: "puigmolto-can-macia", nombre: "Puigmoltó-Can Macià", demanda: 60, precioM2Base: 2250 },
      { id: "vallpineda-rocamar", nombre: "Vallpineda-Rocamar", demanda: 72, precioM2Base: 2700 },
    ],
  },
  {
    id: "sitges",
    nombre: "Sitges",
    demandaTipo: { piso: 1.05, atico: 1.1, "planta-baja": 0.96, casa: 1.04, adosada: 1.02 },
    zonas: [
      { id: "ametllers-poble-sec", nombre: "Els Ametllers-Poble Sec-Ca l'Antoniet", demanda: 84, precioM2Base: 3600 },
      { id: "sitges-centre", nombre: "Centre", demanda: 95, precioM2Base: 4400 },
      { id: "els-molins-observatorio-pins-vens", nombre: "Els Molins-Observatori-Pins Vens", demanda: 86, precioM2Base: 3900 },
      { id: "garraf", nombre: "Garraf", demanda: 76, precioM2Base: 3800 },
      { id: "la-plana", nombre: "La Plana", demanda: 82, precioM2Base: 3400 },
      { id: "les-botigues", nombre: "Les Botigues de Sitges", demanda: 70, precioM2Base: 3300 },
      { id: "levantina-montgavina-quintmar", nombre: "Llevantina-Montgavina-Quintmar", demanda: 80, precioM2Base: 3600 },
      { id: "san-sebastian-aiguadolc", nombre: "Sant Sebastià-Aiguadolç", demanda: 94, precioM2Base: 4600 },
      { id: "vallpineda-santa-barbara", nombre: "Vallpineda-Santa Bàrbara", demanda: 78, precioM2Base: 3500 },
      { id: "vinyet-terramar", nombre: "Vinyet-Terramar-Can Pei-Can Girona", demanda: 90, precioM2Base: 5000 },
    ],
  },
  {
    id: "cubelles",
    nombre: "Cubelles",
    demandaTipo: { piso: 0.94, atico: 0.98, "planta-baja": 0.92, casa: 1.04, adosada: 1.05 },
    zonas: [
      { id: "bardaji-moli-de-baix", nombre: "Bardají-Molí de Baix", demanda: 66, precioM2Base: 1950 },
      { id: "castell-de-cubelles", nombre: "El Castell de Cubelles", demanda: 70, precioM2Base: 2000 },
      { id: "maritim", nombre: "Marítim", demanda: 76, precioM2Base: 2250 },
      { id: "mas-trader-corrals", nombre: "Mas Trader-Corral d'en Tort-Corral d'en Cona", demanda: 60, precioM2Base: 1850 },
      { id: "pla-de-sant-pere-les-salines", nombre: "Pla de Sant Pere-Les Salines", demanda: 68, precioM2Base: 2000 },
      { id: "santa-maria-eixample-sud-sumella", nombre: "Santa Maria-Eixample-Sud Sumella", demanda: 72, precioM2Base: 2050 },
    ],
  },
  {
    id: "cunit",
    nombre: "Cunit",
    demandaTipo: { piso: 0.95, atico: 1.0, "planta-baja": 0.92, casa: 1.05, adosada: 1.06 },
    zonas: [
      { id: "can-nicolau-les-sorres-valparaiso", nombre: "Can Nicolau - Les Sorres - Valparaiso", demanda: 62, precioM2Base: 1850 },
      { id: "can-toni", nombre: "Can Toni", demanda: 64, precioM2Base: 1900 },
      { id: "costa-cunit-els-jardins-els-rosers", nombre: "Costa Cunit - Els Jardins - Els Rosers", demanda: 70, precioM2Base: 2050 },
      { id: "cunidor", nombre: "Cunidor", demanda: 60, precioM2Base: 1800 },
      { id: "cunit-diagonal", nombre: "Cunit Diagonal", demanda: 66, precioM2Base: 1950 },
      { id: "nucli-antic", nombre: "Nucli Antic", demanda: 68, precioM2Base: 1900 },
      { id: "prat-de-cunit", nombre: "Prat de Cunit", demanda: 72, precioM2Base: 2100 },
      { id: "residencial", nombre: "Residencial", demanda: 58, precioM2Base: 1800 },
    ],
  },
  {
    // Idealista no subdivide Canyelles en zonas
    id: "canyelles",
    nombre: "Canyelles",
    demandaTipo: { piso: 0.9, atico: 0.92, "planta-baja": 0.9, casa: 1.06, adosada: 1.04 },
    zonas: [
      { id: "canyelles", nombre: "Tot el municipi", demanda: 56, precioM2Base: 1750 },
    ],
  },
  {
    id: "olivella",
    nombre: "Olivella",
    demandaTipo: { piso: 0.88, atico: 0.9, "planta-baja": 0.88, casa: 1.08, adosada: 1.05 },
    zonas: [
      { id: "les-colines-cal-suria", nombre: "Les Colines-Cal Surià", demanda: 54, precioM2Base: 1750 },
      { id: "mas-mestre", nombre: "Mas Mestre", demanda: 58, precioM2Base: 1850 },
      { id: "mas-mila", nombre: "Mas Milà", demanda: 56, precioM2Base: 1800 },
      { id: "olivella-nucli", nombre: "Olivella", demanda: 60, precioM2Base: 1900 },
    ],
  },
  {
    id: "calafell",
    nombre: "Calafell",
    demandaTipo: { piso: 0.96, atico: 1.02, "planta-baja": 0.9, casa: 1.04, adosada: 1.05 },
    zonas: [
      { id: "alorda-park", nombre: "Alorda Park", demanda: 66, precioM2Base: 2000 },
      { id: "bellamar", nombre: "Bellamar", demanda: 68, precioM2Base: 2100 },
      { id: "bonanova", nombre: "Bonanova", demanda: 62, precioM2Base: 1900 },
      { id: "calafell-park", nombre: "Calafell Park", demanda: 60, precioM2Base: 1850 },
      { id: "calafell-pueblo", nombre: "Calafell Poble", demanda: 68, precioM2Base: 1950 },
      { id: "calafell-residencial", nombre: "Calafell Residencial", demanda: 64, precioM2Base: 2000 },
      { id: "mas-mel-bellamar", nombre: "Mas Mel - Bellamar", demanda: 65, precioM2Base: 1950 },
      { id: "mas-romeu", nombre: "Mas Romeu", demanda: 60, precioM2Base: 1900 },
      { id: "platja-calafell", nombre: "Platja de Calafell", demanda: 76, precioM2Base: 2350 },
      { id: "segur-de-calafell", nombre: "Segur de Calafell", demanda: 66, precioM2Base: 1850 },
    ],
  },
  {
    id: "el-vendrell",
    nombre: "El Vendrell",
    demandaTipo: { piso: 0.94, atico: 0.98, "planta-baja": 0.9, casa: 1.05, adosada: 1.04 },
    zonas: [
      { id: "bonavista", nombre: "Bonavista", demanda: 56, precioM2Base: 1550 },
      { id: "vendrell-centre", nombre: "Centre", demanda: 64, precioM2Base: 1700 },
      { id: "coma-ruga", nombre: "Coma-ruga", demanda: 72, precioM2Base: 2100 },
      { id: "el-puig", nombre: "El Puig", demanda: 60, precioM2Base: 1650 },
      { id: "el-tancat-mas-den-gual", nombre: "El Tancat - Mas d'en Gual", demanda: 62, precioM2Base: 1750 },
      { id: "els-masos", nombre: "Els Masos", demanda: 58, precioM2Base: 1600 },
      { id: "la-muntanyeta", nombre: "La Muntanyeta", demanda: 60, precioM2Base: 1700 },
      { id: "mas-borras", nombre: "Mas Borràs", demanda: 56, precioM2Base: 1600 },
      { id: "nou-vendrell", nombre: "Nou Vendrell", demanda: 66, precioM2Base: 1800 },
      { id: "oasis-park-la-franquesa", nombre: "Oasis Park - La Franquesa", demanda: 54, precioM2Base: 1500 },
      { id: "sant-salvador", nombre: "Sant Salvador", demanda: 70, precioM2Base: 2050 },
      { id: "urbanizacion-torreblanca", nombre: "Urbanització Torreblanca", demanda: 57, precioM2Base: 1600 },
    ],
  },
  {
    id: "vilafranca",
    nombre: "Vilafranca del Penedès",
    demandaTipo: { piso: 1.0, atico: 1.02, "planta-baja": 0.94, casa: 1.0, adosada: 1.02 },
    zonas: [
      { id: "barceloneta-moli-den-rovira", nombre: "La Barceloneta - Molí d'en Rovira", demanda: 66, precioM2Base: 1800 },
      { id: "vilafranca-centre", nombre: "Centre Vila", demanda: 70, precioM2Base: 1850 },
      { id: "espirall", nombre: "L'Espirall", demanda: 60, precioM2Base: 1600 },
      { id: "la-girada", nombre: "La Girada", demanda: 72, precioM2Base: 1950 },
      { id: "les-clotes", nombre: "Les Clotes", demanda: 62, precioM2Base: 1650 },
      { id: "poble-nou", nombre: "Poble Nou", demanda: 64, precioM2Base: 1700 },
      { id: "pol-ind-domenys", nombre: "Pol. Ind. Domenys", demanda: 40, precioM2Base: 1300 },
      { id: "sant-julia", nombre: "Sant Julià", demanda: 62, precioM2Base: 1650 },
    ],
  },
];

/**
 * Identificador reservado para "Otra población": el propietario escribe el
 * nombre a mano (municipioOtro) y el motor usa valores prudentes de comarca
 * (no tenemos referencia afinada y el informe lo dice tal cual).
 */
export const OTRO_MUNICIPIO = "otro";

/** Nombres legibles de municipio y zona, cubriendo el caso "otra población" */
export function nombresUbicacion(r: {
  municipio: string;
  municipioOtro: string | null;
  zona: string;
}): { municipio: string; zona: string } {
  if (r.municipio === OTRO_MUNICIPIO) {
    const nombre = r.municipioOtro?.trim() || "Otra población";
    return { municipio: nombre, zona: nombre };
  }
  return {
    municipio: buscarMunicipio(r.municipio)?.nombre ?? r.municipio,
    zona: buscarZona(r.municipio, r.zona)?.nombre ?? r.zona,
  };
}

export function buscarMunicipio(id: string): MunicipioRef | null {
  return MUNICIPIOS.find((m) => m.id === id) ?? null;
}

export function buscarZona(municipioId: string, zonaId: string): ZonaRef | null {
  const municipio = buscarMunicipio(municipioId);
  return municipio?.zonas.find((z) => z.id === zonaId) ?? null;
}

/**
 * Casos de ejemplo para Vilanova i la Geltrú (mock). Alimentan el modo demo,
 * los datos de prueba del panel y los tests del motor.
 */
export interface CasoEjemplo {
  id: string;
  nombre: string;
  descripcion: string;
  respuestas: RespuestasDiagnostico;
}

export const CASOS_EJEMPLO: CasoEjemplo[] = [
  {
    id: "piso-con-ascensor",
    nombre: "Piso con ascensor",
    descripcion: "Piso de 3 habitaciones en buen estado en Centre Vila, con balcón y ascensor.",
    respuestas: {
      municipio: "vilanova",
      municipioOtro: null,
      zona: "centre-vila-la-geltru",
      tipo: "piso",
      superficie: 92,
      habitaciones: 3,
      banos: 2,
      ascensor: "si",
      caracteristicas: ["balcon"],
      estado: "buen-estado",
      precioEsperado: 235000,
      yaAnunciado: "no",
      tiempoAnunciado: null,
      horizonte: "3-6-meses",
    },
  },
  {
    id: "piso-sin-ascensor",
    nombre: "Piso sin ascensor",
    descripcion: "Tercero sin ascensor en La Geltrú, para actualizar, ya anunciado hace meses.",
    respuestas: {
      municipio: "vilanova",
      municipioOtro: null,
      zona: "centre-vila-la-geltru",
      tipo: "piso",
      superficie: 78,
      habitaciones: 3,
      banos: 1,
      ascensor: "no",
      caracteristicas: [],
      estado: "actualizar",
      precioEsperado: 189000,
      yaAnunciado: "si",
      tiempoAnunciado: "3-6-meses",
      horizonte: "cuanto-antes",
    },
  },
  {
    id: "atico-con-terraza",
    nombre: "Ático con terraza",
    descripcion: "Ático reformado con terraza y vistas junto a Ribes Roges.",
    respuestas: {
      municipio: "vilanova",
      municipioOtro: null,
      zona: "ribes-roges",
      tipo: "atico",
      superficie: 105,
      habitaciones: 3,
      banos: 2,
      ascensor: "si",
      caracteristicas: ["terraza", "vistas", "parking"],
      estado: "reformado",
      precioEsperado: 420000,
      yaAnunciado: "no",
      tiempoAnunciado: null,
      horizonte: "este-anyo",
    },
  },
  {
    id: "casa-adosada",
    nombre: "Casa adosada",
    descripcion: "Adosada de 4 habitaciones con jardín y parking en La Collada.",
    respuestas: {
      municipio: "vilanova",
      municipioOtro: null,
      zona: "la-collada-sis-camins",
      tipo: "adosada",
      superficie: 180,
      habitaciones: 4,
      banos: 2,
      ascensor: "no",
      caracteristicas: ["jardin", "parking", "terraza"],
      estado: "buen-estado",
      precioEsperado: 398000,
      yaAnunciado: "no",
      tiempoAnunciado: null,
      horizonte: "explorando",
    },
  },
  {
    id: "vivienda-para-reformar",
    nombre: "Vivienda para reformar",
    descripcion: "Piso a reformar en Sant Joan, anunciado desde hace más de medio año con precio ambicioso.",
    respuestas: {
      municipio: "vilanova",
      municipioOtro: null,
      zona: "sant-joan-aiguacuit",
      tipo: "piso",
      superficie: 85,
      habitaciones: 4,
      banos: 1,
      ascensor: "no",
      caracteristicas: ["balcon"],
      estado: "reformar",
      precioEsperado: 210000,
      yaAnunciado: "si",
      tiempoAnunciado: "mas-6-meses",
      horizonte: "cuanto-antes",
    },
  },
];
