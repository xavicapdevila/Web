export interface PropertyImage {
  url: string;
  eti?: string;
}

export interface FloorPlanPin {
  id: string;       // unique identifier
  x: number;        // left position as % of image width (0–100)
  y: number;        // top position as % of image height (0–100)
  label: string;    // room name (e.g. "Dormitorio 1", "Salón")
  fotos: string[];  // array of image URLs assigned to this pin
}

export interface Property {
  id: string;
  ref: string;
  tipo: string;
  subtipo?: string;
  operacion: string;
  precio: number;
  precioAnterior?: number;
  outlet: boolean;
  porcentajeBajada?: number;
  estadoFicha: number; // 1=activo, 7=reservado
  titulo: string;
  descripcion: string;
  ciudad: string;
  provincia: string;
  cp?: string;
  zona?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  habitaciones?: number;
  banos?: number;
  m2Construidos?: number;
  m2Utiles?: number;
  m2Parcela?: number;
  planta?: string;
  numPlantas?: number;
  ascensor?: boolean;
  garaje?: boolean;
  garajeTipo?: "garaje" | "parking";
  trastero?: boolean;
  urbanizacion?: boolean;
  piscina?: boolean;          // legacy: OR of private+community
  piscinaPrivada?: boolean;
  piscinaComunitaria?: boolean;
  terraza?: boolean;
  jardin?: boolean;
  balcon?: boolean;
  solarium?: boolean;
  barbacoa?: boolean;
  chimenea?: boolean;
  vistasalmar?: boolean;
  amueblado?: boolean;
  armaEmpotrado?: boolean;
  calefaccion?: string;
  aireCond?: boolean;
  bombafriocalor?: boolean;
  orientacion?: string;
  antiguedad?: string;
  estado?: string;
  ibi?: number;
  gastosComun?: number;
  periodicidadComunidad?: string;
  certificadoEnergetico?: string; // letra A-G del consumo energético
  consumoEnergetico?: string;     // valor numérico kWh/m²·año
  emisionesLetra?: string;        // letra A-G de las emisiones CO₂
  emisionesEnergeticas?: string;  // valor numérico kg CO₂/m²·año
  energiaExento?: boolean;        // true si energiarecibido=3 (exento)
  imagenes: PropertyImage[];
  video1?: string;
  tour?: string;
  fecha: string;
  agente?: string;
  agenteEmail?: string;
  agenteFoto?: string;
  agenteTelefono?: string;
  slug: string;
  planoPins?: FloorPlanPin[];
  rawXml?: string;
}

export interface PropertyFilters {
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
  habitaciones?: number;
  m2Min?: number;
  m2Max?: number;
  ciudad?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProperties {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}
