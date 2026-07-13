/**
 * Copys de la landing de Meta «Tu precio» (/tu-precio ES · /el-teu-preu CA).
 *
 * Fuente de verdad: la preview validada por Xavi (landing.html del handoff,
 * jul 2026). NO reescribir literales ni "mejorar" el tono sin su OK.
 *
 * El idioma va POR URL (sin autodetect): cada ruta pasa su lang fijo.
 * El payload del lead viaja SIEMPRE con los valores canónicos en español
 * (muni/tipo de `TP_COPY.es`), se rellene desde la ruta que se rellene.
 */

import type { GoogleReview, PlaceData } from "@/lib/googlePlaces";

export type TpLang = "es" | "ca";

export const TIMELINE_KEYS = [
  "vender_ya",
  "venta_activa",
  "proximos_meses",
  "solo_curiosidad",
] as const;
export type TimelineKey = (typeof TIMELINE_KEYS)[number];

export interface TpCopy {
  ttl: string;
  metaDesc: string;
  h1Pre: string;
  h1Mark: string;
  h1Post: string;
  sub1: string;
  sub2: string;
  q1: string;
  q2a: string;
  q2b: string;
  q2c: string;
  next: string;
  back: string;
  send: string;
  micro1: string;
  micro3: string;
  fname: string;
  fphone: string;
  rgpd: string;
  rgpdlink: string;
  legal: string;
  okh: string;
  oktxt: string;
  wa: string;
  okfollow: string;
  s1: string;
  s2: string;
  ovHon: string;
  hon1: string;
  hon2: string;
  hon3: string;
  ovProof: string;
  ovHow: string;
  how1: string;
  how2: string;
  how3: string;
  cta2h: string;
  cta2b: string;
  flegal: string;
  fpriv: string;
  fcook: string;
  muni: string[];
  tipo: string[];
  time: string[];
  e1: string;
  e2: string;
  e3a: string;
  e3b: string;
  e3c: string;
  eSend: string;
  muniOtroL: string;
  muniOtroPh: string;
  tipoOtroL: string;
  tipoOtroPh: string;
  eMuniOtro: string;
  eTipoOtro: string;
  ckt: string;
  ckl: string;
  ckr: string;
  cka: string;
  rcShort: (n: number | null) => string;
  rcLong: (n: number | null) => string;
  sumIn: string;
  waMsg: (p: string, m: string) => string;
  /* CRO */
  hcta: string;
  readMore: string;
  readLess: string;
  trust: (rating: string) => string;
}

export const TP_COPY: Record<TpLang, TpCopy> = {
  es: {
    ttl: "¿Cuánto quieres por tu casa? — The Vila Home",
    metaDesc:
      "Dinos la cifra que tienes en la cabeza y la contrastamos con ventas reales de tu zona. 30 segundos, sin compromiso.",
    h1Pre: "¿Cuánto quieres por ",
    h1Mark: "tu casa",
    h1Post: "?",
    sub1: "La cifra que tienes en la cabeza.",
    sub2: "Esa.",
    q1: "Escríbela tal cual la piensas",
    q2a: "¿Dónde está?",
    q2b: "¿Qué es?",
    q2c: "¿Cuándo te lo planteas?",
    next: "Continuar",
    back: "← Volver",
    send: "Enviar mi precio",
    micro1: "30 segundos. Sin compromiso.",
    micro3: "Te llamamos nosotros. Una vez. Sin insistir.",
    fname: "Tu nombre",
    fphone: "Móvil",
    rgpd: "He leído y acepto la",
    rgpdlink: "política de privacidad",
    legal:
      "Responsable: Projectes Immobiliaris Costa Daurada, S.L.U. Finalidad: responder a tu solicitud. Nada más.",
    okh: "Hecho.",
    oktxt:
      "Le echamos un ojo con datos reales de tu zona y te llamamos en horario laboral.",
    wa: "¿Prefieres escribirnos? WhatsApp directo",
    okfollow: "Mientras tanto, mira cómo trabajamos:",
    s1: "familias acompañadas",
    s2: "años en el Garraf",
    ovHon: "SIN LETRA PEQUEÑA",
    hon1: "Nada de prometerte la luna para conseguir tu firma.",
    hon2: "Una opinión honesta, un plan claro,",
    hon3: "y tú decides.",
    ovProof: "RESEÑAS REALES · GOOGLE",
    ovHow: "CÓMO FUNCIONA",
    how1: "Nos dices tu cifra.",
    how2: "La miramos con ventas reales de tu zona.",
    how3: "Te llamamos con una propuesta clara. 15 minutos, sin compromiso.",
    cta2h: "¿Tienes tu cifra?",
    cta2b: "Empezar — 30 segundos",
    flegal: "Aviso legal",
    fpriv: "Privacidad",
    fcook: "Cookies",
    muni: [
      "Vilanova i la Geltrú",
      "Cunit",
      "Calafell",
      "Cubelles",
      "El Vendrell",
      "Sant Pere de Ribes",
      "Otro",
    ],
    tipo: ["Piso", "Casa", "Otro"],
    time: [
      "Quiero venderla ya",
      "Ya está en venta",
      "Próximos meses",
      "Solo quiero saberlo",
    ],
    e1: "Escribe una cifra para continuar.",
    e2: "Marca una opción en cada pregunta.",
    e3a: "¿Cómo te llamas?",
    e3b: "Necesitamos un móvil para llamarte.",
    e3c: "Marca la casilla de privacidad para enviar.",
    eSend: "No se ha podido enviar. Inténtalo de nuevo o llámanos al 936 061 800.",
    muniOtroL: "¿Qué población?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "¿Qué tipo de inmueble?",
    tipoOtroPh: "Local, terreno, finca…",
    eMuniOtro: "Dinos la población.",
    eTipoOtro: "Dinos qué inmueble es.",
    ckt: "Usamos cookies para medir la campaña. Nada más.",
    ckl: "Política de cookies",
    ckr: "Rechazar",
    cka: "Aceptar",
    rcShort: (n) => (n ? `· ${n} reseñas` : "· Google"),
    rcLong: (n) => (n ? `${n} reseñas en Google` : "Reseñas verificadas en Google"),
    sumIn: "Tu cifra:",
    waMsg: (p, m) => `Hola! Vengo de la web. Mi precio: ${p} € (${m}).`,
    hcta: "Empezar",
    readMore: "Leer más",
    readLess: "Leer menos",
    trust: (r) => `${r} en Google · +450 familias acompañadas`,
  },
  ca: {
    ttl: "Quant vols per casa teva? — The Vila Home",
    metaDesc:
      "Digues-nos la xifra que tens al cap i la contrastem amb vendes reals de la teva zona. 30 segons, sense compromís.",
    h1Pre: "Quant vols per ",
    h1Mark: "casa teva",
    h1Post: "?",
    sub1: "La xifra que tens al cap.",
    sub2: "Aquesta.",
    q1: "Escriu-la tal com la penses",
    q2a: "On és?",
    q2b: "Què és?",
    q2c: "Quan t’ho planteges?",
    next: "Continua",
    back: "← Torna",
    send: "Envia el meu preu",
    micro1: "30 segons. Sense compromís.",
    micro3: "Et truquem nosaltres. Un cop. Sense insistir.",
    fname: "El teu nom",
    fphone: "Mòbil",
    rgpd: "He llegit i accepto la",
    rgpdlink: "política de privacitat",
    legal:
      "Responsable: Projectes Immobiliaris Costa Daurada, S.L.U. Finalitat: respondre la teva sol·licitud. Res més.",
    okh: "Fet.",
    oktxt:
      "Hi fem una ullada amb dades reals de la teva zona i et truquem en horari laboral.",
    wa: "Prefereixes escriure’ns? WhatsApp directe",
    okfollow: "Mentrestant, mira com treballem:",
    s1: "famílies acompanyades",
    s2: "anys al Garraf",
    ovHon: "SENSE LLETRA PETITA",
    hon1: "Res de prometre’t la lluna per aconseguir la teva firma.",
    hon2: "Una opinió honesta, un pla clar,",
    hon3: "i tu decideixes.",
    ovProof: "RESSENYES REALS · GOOGLE",
    ovHow: "COM FUNCIONA",
    how1: "Ens dius la teva xifra.",
    how2: "La mirem amb vendes reals de la teva zona.",
    how3: "Et truquem amb una proposta clara. 15 minuts, sense compromís.",
    cta2h: "Tens la teva xifra?",
    cta2b: "Comença — 30 segons",
    flegal: "Avís legal",
    fpriv: "Privacitat",
    fcook: "Cookies",
    muni: [
      "Vilanova i la Geltrú",
      "Cunit",
      "Calafell",
      "Cubelles",
      "El Vendrell",
      "Sant Pere de Ribes",
      "Altre",
    ],
    tipo: ["Pis", "Casa", "Altre"],
    time: [
      "La vull vendre ja",
      "Ja està en venda",
      "Propers mesos",
      "Només ho vull saber",
    ],
    e1: "Escriu una xifra per continuar.",
    e2: "Marca una opció a cada pregunta.",
    e3a: "Com et dius?",
    e3b: "Necessitem un mòbil per trucar-te.",
    e3c: "Marca la casella de privacitat per enviar.",
    eSend: "No s’ha pogut enviar. Torna-ho a provar o truca’ns al 936 061 800.",
    muniOtroL: "Quina població?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "Quin tipus d’immoble?",
    tipoOtroPh: "Local, terreny, finca…",
    eMuniOtro: "Digues-nos la població.",
    eTipoOtro: "Digues-nos quin immoble és.",
    ckt: "Fem servir cookies per mesurar la campanya. Res més.",
    ckl: "Política de cookies",
    ckr: "Rebutja",
    cka: "Accepta",
    rcShort: (n) => (n ? `· ${n} ressenyes` : "· Google"),
    rcLong: (n) => (n ? `${n} ressenyes a Google` : "Ressenyes verificades a Google"),
    sumIn: "La teva xifra:",
    waMsg: (p, m) => `Hola! Vinc del web. El meu preu: ${p} € (${m}).`,
    hcta: "Comença",
    readMore: "Llegir més",
    readLess: "Llegir menys",
    trust: (r) => `${r} a Google · +450 famílies acompanyades`,
  },
};

/* Frases del marquee tipográfico (decorativo, aria-hidden). Extractos reales
   de reseñas de Google, fijados a propósito: el ancho del marquee no debe
   depender del feed vivo. */
export const TP_MARQUEE = [
  "«La seva gestió ha estat impecable»",
  "«Trato cercano y transparente»",
  "«Transparència des del principi»",
  "«Recomendable totalmente»",
  "«Siempre atenta y dispuesta a ayudarnos»",
  "«Honesta, eficiente»",
];

/** Datos de reseñas que recibe la landing (server → cliente). */
export interface TpReviews {
  /** Nota real de Google, o null si Places no respondió (nunca inventamos). */
  rating: number | null;
  /** Nº real de reseñas, o null → la UI dice «Reseñas verificadas en Google». */
  count: number | null;
  quotes: { author: string; text: string }[];
}

/* Heurística barata de idioma para priorizar reseñas que el visitante pueda
   leer (una reseña en inglés delante de un vendedor del Garraf no convierte). */
function langScore(text: string, lang: TpLang): number {
  const t = ` ${text.toLowerCase()} `;
  const es = [" que ", " con ", " muy ", " y ", " el ", " los ", " todo ", "ñ", " gracias"];
  const ca = [" que ", " amb ", " molt ", " i ", " el ", " els ", " tot ", "·", " gràcies"];
  const hits = (ws: string[]) => ws.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
  const e = hits(es);
  const c = hits(ca);
  return (lang === "es" ? e : c) * 2 + Math.max(e, c);
}

/**
 * Selección de citas para la sección de prueba social: solo 5★ con texto,
 * primero las legibles en el idioma de la página y, a igualdad, las más
 * cercanas a una longitud "de tarjeta" (la UI recorta a 3 líneas con
 * «Leer más», pero el criterio evita tres tochos seguidos).
 */
export function buildTpReviews(place: PlaceData, lang: TpLang): TpReviews {
  const IDEAL_LEN = 220;
  const quotes = place.reviews
    .filter((r: GoogleReview) => r.rating === 5 && r.text?.trim())
    .sort((a, b) => {
      const byLang = langScore(b.text, lang) - langScore(a.text, lang);
      if (byLang !== 0) return byLang;
      return Math.abs(a.text.length - IDEAL_LEN) - Math.abs(b.text.length - IDEAL_LEN);
    })
    .slice(0, 3)
    .map((r) => ({ author: r.author, text: r.text }));

  return {
    rating: place.live ? place.rating : null,
    count: place.live ? place.totalReviews : null,
    quotes,
  };
}
