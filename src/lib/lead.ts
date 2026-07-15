/**
 * El lead de captación tal y como lo reciben los formularios de la web
 * (/vender, /como-trabajamos y la landing «Dinos tu precio»).
 *
 * La web no persiste leads: cada uno sale por email al equipo (crítico) y se
 * reenvía al módulo Leads de Ora, que es la bandeja de gestión y la fuente de
 * verdad. Este tipo solo viaja en memoria durante la petición.
 */

import type { Lang } from "@/lib/i18n";

export interface Lead {
  id: string; // = eventId (permite cruzar con Meta)
  ts: string; // ISO
  lang: Lang | string;
  situation: string; // clave (ahora | meses | explorando | en_venta)
  name: string;
  phone: string;
  email: string;
  zone: string;
  precio?: string; // precio pensado por el vendedor (formulario «pon tu precio»)
  message?: string;
  source?: string; // formulario de origen (vender | como-trabajamos | …)
  // Solo leads de la landing «Dinos tu precio» (campaña de precio). Ese
  // formulario no pide email (a propósito) y el precio es un número.
  precio_esperado?: number;
  tipo?: string;
  // Atribución
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  landing?: string;
  referrer?: string;
}
