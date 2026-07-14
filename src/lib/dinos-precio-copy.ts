import type { Lang } from "@/lib/i18n";
import { COMO_COPY } from "@/lib/como-trabajamos-copy";

/* ─────────────────────────────────────────────────────────────────────
   FUENTE ÚNICA DE COPY de la landing «Dinos tu precio» (/vender, 4 idiomas).

   Landing de captación de vendedores para la campaña de Meta cuyo gancho es
   el precio: «¿Cuánto quieres por tu casa? — La cifra que tienes en la
   cabeza. Esa.». El propietario nos dice su cifra y nosotros la contrastamos
   con ventas reales de su zona. Diseño = lenguaje visual de /como-trabajamos
   (oscuro/editorial, General Sans); mensaje = la campaña del precio.

   El idioma se resuelve en cliente (LanguageProvider: ?lang= → cookie →
   navegador). El PAYLOAD del lead viaja SIEMPRE con los valores canónicos en
   español (muni/tipo de DP_COPY.es), se rellene desde el idioma que sea.

   Pares antes/después y reseñas se reutilizan de COMO_COPY (ya traducidos y
   aprobados) para no duplicar traducciones. Aquí solo el copy de campaña.
   ───────────────────────────────────────────────────────────────────── */

export const DP_LANGS: Lang[] = ["es", "ca", "en", "fr"];

export const TIMELINE_KEYS = [
  "vender_ya",
  "venta_activa",
  "proximos_meses",
  "solo_curiosidad",
] as const;
export type TimelineKey = (typeof TIMELINE_KEYS)[number];

export const WHATSAPP = "34638359612";
export const PHONE_HUMAN = "936 061 800";

/* Zonas donde se ha vendido, para el marquee (decorativo, aria-hidden).
   Comarca primero; Tarragona y Barcelona al final. No se traduce. */
export const DP_MARQUEE = [
  "Vilanova i la Geltrú",
  "Sant Pere de Ribes",
  "Cubelles",
  "Cunit",
  "Calafell",
  "Vilafranca del Penedès",
  "Olivella",
  "Sitges",
  "Tarragona",
  "Barcelona",
];

interface Step {
  n: string;
  t: string;
  d: string;
}
interface Stat {
  value: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface DpCopy {
  meta: { title: string; description: string };
  nav: { cta: string };

  hero: {
    eyebrow: string;
    titlePre: string;
    titleMark: string;
    titlePost: string;
    sub1: string;
    sub2: string; // «Esa.» — con acento gráfico
    lead: string;
    micro: string;
    inGoogle: string;
    scrollHint: string;
  };

  form: {
    stepOf: (n: number) => string;
    q1: string;
    priceSuffix: string;
    pricePh: string;
    q2a: string;
    q2b: string;
    q2c: string;
    muni: string[];
    tipo: string[];
    time: string[];
    muniOtroL: string;
    muniOtroPh: string;
    tipoOtroL: string;
    tipoOtroPh: string;
    fname: string;
    fnamePh: string;
    fphone: string;
    fphonePh: string;
    rgpd: string;
    rgpdLink: string;
    legal: string;
    next: string;
    back: string;
    send: string;
    // errores
    e1: string;
    e2: string;
    e3a: string;
    e3b: string;
    e3c: string;
    eSend: string;
    eMuniOtro: string;
    eTipoOtro: string;
    // éxito
    okKicker: string;
    okh: string;
    oktxt: string;
    okwa: string;
    sumIn: string;
    waMsg: (precio: string, muni: string) => string;
    trust: (rating: string) => string;
  };

  marquee: { label: string };

  how: { eyebrow: string; title: string; steps: Step[] };

  proof: {
    eyebrow: string;
    title: string;
    body: string;
    hint: string;
    labelBefore: string;
    labelAfter: string;
  };

  honesty: { eyebrow: string; lines: string[]; strong: string };

  reviews: { eyebrow: string; googleLabel: string; readMore: string; readLess: string };

  stats: { eyebrow: string; items: Stat[] };

  close: { eyebrow: string; title: string; sub: string; cta: string };

  footer: { legal: string; privacy: string; cookies: string };
}

/* ── Castellano ─────────────────────────────────────────────────────── */
const es: DpCopy = {
  meta: {
    title: "¿Cuánto quieres por tu casa? — The Vila Home",
    description:
      "Dinos la cifra que tienes en la cabeza y la contrastamos con ventas reales de tu zona. 30 segundos, sin compromiso.",
  },
  nav: { cta: "Dinos tu precio" },

  hero: {
    eyebrow: "Propietarios · Vilanova y alrededores",
    titlePre: "¿Cuánto quieres por ",
    titleMark: "tu casa",
    titlePost: "?",
    sub1: "La cifra que tienes en la cabeza.",
    sub2: "Esa.",
    lead: "Dínosla y nosotros nos encargamos del resto.",
    micro: "Tardas 30 segundos. Sin compromiso.",
    inGoogle: "en Google",
    scrollHint: "Cómo funciona",
  },

  form: {
    stepOf: (n) => `Paso ${n} de 3`,
    q1: "Escribe tu precio, tal cual lo piensas",
    priceSuffix: "€",
    pricePh: "285.000",
    q2a: "¿Dónde está?",
    q2b: "¿Qué es?",
    q2c: "¿Cuándo te lo planteas?",
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
    time: ["Quiero venderla ya", "Ya está en venta", "Próximos meses", "Solo quiero saberlo"],
    muniOtroL: "¿Qué población?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "¿Qué tipo de inmueble?",
    tipoOtroPh: "Local, terreno, finca…",
    fname: "Tu nombre",
    fnamePh: "Nombre y apellidos",
    fphone: "Móvil",
    fphonePh: "600 000 000",
    rgpd: "He leído y acepto la",
    rgpdLink: "política de privacidad",
    legal:
      "Responsable: Projectes Immobiliaris Costa Daurada, S.L.U. Finalidad: responder a tu solicitud. Nada más.",
    next: "Continuar",
    back: "← Volver",
    send: "Enviar mi precio",
    e1: "Escribe una cifra para continuar.",
    e2: "Marca una opción en cada pregunta.",
    e3a: "¿Cómo te llamas?",
    e3b: "Necesitamos un móvil para llamarte.",
    e3c: "Marca la casilla de privacidad para enviar.",
    eSend: `No se ha podido enviar. Inténtalo de nuevo o llámanos al ${PHONE_HUMAN}.`,
    eMuniOtro: "Dinos la población.",
    eTipoOtro: "Dinos qué inmueble es.",
    okKicker: "Recibido",
    okh: "Hecho.",
    oktxt:
      "Le echamos un ojo con datos reales de tu zona y te llamamos en horario laboral. Una vez. Sin insistir.",
    okwa: "¿Prefieres escribirnos? WhatsApp directo",
    sumIn: "Tu cifra:",
    waMsg: (p, m) => `Hola! Vengo de la web. Mi precio: ${p} € (${m}).`,
    trust: (r) => `${r} en Google · +450 familias acompañadas`,
  },

  marquee: { label: "Vendido en" },

  how: {
    eyebrow: "Cómo funciona",
    title: "Tu cifra es el punto de partida. No una trampa.",
    steps: [
      {
        n: "01",
        t: "Nos dices tu precio",
        d: "La cifra que tienes en la cabeza, tal cual. Sin fórmulas raras ni valoraciones eternas.",
      },
      {
        n: "02",
        t: "La miramos con datos reales",
        d: "La contrastamos con lo que de verdad se está vendiendo en tu zona, calle a calle.",
      },
      {
        n: "03",
        t: "Te llamamos con una propuesta clara",
        d: "15 minutos, sin compromiso. Te decimos qué vemos y cómo lo enfocaríamos. Y tú decides.",
      },
    ],
  },

  proof: {
    eyebrow: "Y «el resto» ¿qué es?",
    title: "No cambiamos tu casa. Cambiamos cómo se ve.",
    body:
      "El comprador decide en una pantalla, en segundos. Por eso preparamos cada vivienda como se merece: fotografía, vídeo, plano 3D y tour virtual. Arrastra y compáralo tú mismo.",
    hint: "Arrastra para comparar",
    labelBefore: "Sin cuidar",
    labelAfter: "Con nosotros",
  },

  honesty: {
    eyebrow: "Sin letra pequeña",
    lines: [
      "Nada de prometerte la luna para conseguir tu firma.",
      "Una opinión honesta, un plan claro,",
    ],
    strong: "y tú decides.",
  },

  reviews: {
    eyebrow: "Lo que dicen quienes ya vendieron",
    googleLabel: "Opiniones reales en Google",
    readMore: "Leer más",
    readLess: "Leer menos",
  },

  stats: {
    eyebrow: "En números",
    items: [
      { value: 450, prefix: "+", label: "familias acompañadas" },
      { value: 15, label: "años de experiencia" },
      { value: 4.9, dec: 1, label: "valoración en Google" },
    ],
  },

  close: {
    eyebrow: "Tu turno",
    title: "¿Tienes tu cifra?",
    sub: "Dínosla y nos encargamos del resto.",
    cta: "Dinos tu precio — 30 segundos",
  },

  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
};

/* ── Català ─────────────────────────────────────────────────────────── */
const ca: DpCopy = {
  meta: {
    title: "Quant vols per casa teva? — The Vila Home",
    description:
      "Digues-nos la xifra que tens al cap i la contrastem amb vendes reals de la teva zona. 30 segons, sense compromís.",
  },
  nav: { cta: "Dinos el teu preu" },

  hero: {
    eyebrow: "Propietaris · Vilanova i rodalies",
    titlePre: "Quant vols per ",
    titleMark: "casa teva",
    titlePost: "?",
    sub1: "La xifra que tens al cap.",
    sub2: "Aquesta.",
    lead: "Digues-nos-la i nosaltres ens encarreguem de la resta.",
    micro: "Trigues 30 segons. Sense compromís.",
    inGoogle: "a Google",
    scrollHint: "Com funciona",
  },

  form: {
    stepOf: (n) => `Pas ${n} de 3`,
    q1: "Escriu el teu preu, tal com el penses",
    priceSuffix: "€",
    pricePh: "285.000",
    q2a: "On és?",
    q2b: "Què és?",
    q2c: "Quan t’ho planteges?",
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
    time: ["La vull vendre ja", "Ja està en venda", "Propers mesos", "Només ho vull saber"],
    muniOtroL: "Quina població?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "Quin tipus d’immoble?",
    tipoOtroPh: "Local, terreny, finca…",
    fname: "El teu nom",
    fnamePh: "Nom i cognoms",
    fphone: "Mòbil",
    fphonePh: "600 000 000",
    rgpd: "He llegit i accepto la",
    rgpdLink: "política de privacitat",
    legal:
      "Responsable: Projectes Immobiliaris Costa Daurada, S.L.U. Finalitat: respondre la teva sol·licitud. Res més.",
    next: "Continua",
    back: "← Torna",
    send: "Envia el meu preu",
    e1: "Escriu una xifra per continuar.",
    e2: "Marca una opció a cada pregunta.",
    e3a: "Com et dius?",
    e3b: "Necessitem un mòbil per trucar-te.",
    e3c: "Marca la casella de privacitat per enviar.",
    eSend: `No s’ha pogut enviar. Torna-ho a provar o truca’ns al ${PHONE_HUMAN}.`,
    eMuniOtro: "Digues-nos la població.",
    eTipoOtro: "Digues-nos quin immoble és.",
    okKicker: "Rebut",
    okh: "Fet.",
    oktxt:
      "Hi fem una ullada amb dades reals de la teva zona i et truquem en horari laboral. Un cop. Sense insistir.",
    okwa: "Prefereixes escriure’ns? WhatsApp directe",
    sumIn: "La teva xifra:",
    waMsg: (p, m) => `Hola! Vinc del web. El meu preu: ${p} € (${m}).`,
    trust: (r) => `${r} a Google · +450 famílies acompanyades`,
  },

  marquee: { label: "Venut a" },

  how: {
    eyebrow: "Com funciona",
    title: "La teva xifra és el punt de partida. No una trampa.",
    steps: [
      {
        n: "01",
        t: "Ens dius el teu preu",
        d: "La xifra que tens al cap, tal qual. Sense fórmules estranyes ni valoracions eternes.",
      },
      {
        n: "02",
        t: "La mirem amb dades reals",
        d: "La contrastem amb el que de veritat s’està venent a la teva zona, carrer a carrer.",
      },
      {
        n: "03",
        t: "Et truquem amb una proposta clara",
        d: "15 minuts, sense compromís. Et diem què veiem i com ho enfocaríem. I tu decideixes.",
      },
    ],
  },

  proof: {
    eyebrow: "I «la resta» què és?",
    title: "No canviem casa teva. Canviem com es veu.",
    body:
      "El comprador decideix en una pantalla, en segons. Per això preparem cada habitatge com es mereix: fotografia, vídeo, plànol 3D i tour virtual. Arrossega i compara-ho tu mateix.",
    hint: "Arrossega per comparar",
    labelBefore: "Sense cuidar",
    labelAfter: "Amb nosaltres",
  },

  honesty: {
    eyebrow: "Sense lletra petita",
    lines: [
      "Res de prometre’t la lluna per aconseguir la teva firma.",
      "Una opinió honesta, un pla clar,",
    ],
    strong: "i tu decideixes.",
  },

  reviews: {
    eyebrow: "El que diuen els qui ja han venut",
    googleLabel: "Opinions reals a Google",
    readMore: "Llegir més",
    readLess: "Llegir menys",
  },

  stats: {
    eyebrow: "En xifres",
    items: [
      { value: 450, prefix: "+", label: "famílies acompanyades" },
      { value: 15, label: "anys d’experiència" },
      { value: 4.9, dec: 1, label: "valoració a Google" },
    ],
  },

  close: {
    eyebrow: "El teu torn",
    title: "Tens la teva xifra?",
    sub: "Digues-nos-la i ens encarreguem de la resta.",
    cta: "Dinos el teu preu — 30 segons",
  },

  footer: { legal: "Avís legal", privacy: "Privacitat", cookies: "Cookies" },
};

/* ── English ────────────────────────────────────────────────────────── */
const en: DpCopy = {
  meta: {
    title: "How much do you want for your home? — The Vila Home",
    description:
      "Tell us the figure you have in mind and we’ll check it against real sales in your area. 30 seconds, no strings attached.",
  },
  nav: { cta: "Name your price" },

  hero: {
    eyebrow: "Homeowners · Vilanova & around",
    titlePre: "How much do you want for ",
    titleMark: "your home",
    titlePost: "?",
    sub1: "The figure you have in mind.",
    sub2: "That one.",
    lead: "Tell us, and we’ll take care of the rest.",
    micro: "Takes 30 seconds. No strings attached.",
    inGoogle: "on Google",
    scrollHint: "How it works",
  },

  form: {
    stepOf: (n) => `Step ${n} of 3`,
    q1: "Type your price, just as you picture it",
    priceSuffix: "€",
    pricePh: "285,000",
    q2a: "Where is it?",
    q2b: "What is it?",
    q2c: "When are you thinking of selling?",
    muni: [
      "Vilanova i la Geltrú",
      "Cunit",
      "Calafell",
      "Cubelles",
      "El Vendrell",
      "Sant Pere de Ribes",
      "Other",
    ],
    tipo: ["Flat", "House", "Other"],
    time: ["I want to sell now", "It’s already listed", "In the coming months", "Just curious"],
    muniOtroL: "Which town?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "What kind of property?",
    tipoOtroPh: "Commercial unit, plot, estate…",
    fname: "Your name",
    fnamePh: "First and last name",
    fphone: "Mobile",
    fphonePh: "600 000 000",
    rgpd: "I have read and accept the",
    rgpdLink: "privacy policy",
    legal:
      "Data controller: Projectes Immobiliaris Costa Daurada, S.L.U. Purpose: to respond to your request. Nothing else.",
    next: "Continue",
    back: "← Back",
    send: "Send my price",
    e1: "Enter a figure to continue.",
    e2: "Pick an option for each question.",
    e3a: "What’s your name?",
    e3b: "We need a mobile number to call you.",
    e3c: "Tick the privacy box to send.",
    eSend: `Couldn’t send. Please try again or call us at +34 ${PHONE_HUMAN}.`,
    eMuniOtro: "Tell us the town.",
    eTipoOtro: "Tell us what property it is.",
    okKicker: "Received",
    okh: "Done.",
    oktxt:
      "We’ll take a look with real data from your area and call you during working hours. Once. No pushing.",
    okwa: "Rather message us? Direct WhatsApp",
    sumIn: "Your figure:",
    waMsg: (p, m) => `Hi! I’m coming from your website. My price: €${p} (${m}).`,
    trust: (r) => `${r} on Google · 450+ families guided`,
  },

  marquee: { label: "Sold in" },

  how: {
    eyebrow: "How it works",
    title: "Your figure is the starting point. Not a trap.",
    steps: [
      {
        n: "01",
        t: "You tell us your price",
        d: "The figure you have in mind, as is. No odd formulas, no endless valuations.",
      },
      {
        n: "02",
        t: "We check it against real data",
        d: "We compare it with what is actually selling in your area, street by street.",
      },
      {
        n: "03",
        t: "We call you with a clear proposal",
        d: "15 minutes, no commitment. We tell you what we see and how we’d approach it. Then you decide.",
      },
    ],
  },

  proof: {
    eyebrow: "And what is “the rest”?",
    title: "We don’t change your home. We change how it looks.",
    body:
      "Buyers decide on a screen, in seconds. That’s why we prepare every home as it deserves: photography, video, 3D floor plan and a virtual tour. Drag and compare for yourself.",
    hint: "Drag to compare",
    labelBefore: "Untended",
    labelAfter: "With us",
  },

  honesty: {
    eyebrow: "No small print",
    lines: [
      "No promising you the moon just to get your signature.",
      "An honest opinion, a clear plan,",
    ],
    strong: "and you decide.",
  },

  reviews: {
    eyebrow: "What sellers say",
    googleLabel: "Real reviews on Google",
    readMore: "Read more",
    readLess: "Read less",
  },

  stats: {
    eyebrow: "In numbers",
    items: [
      { value: 450, prefix: "+", label: "families guided" },
      { value: 15, label: "years of experience" },
      { value: 4.9, dec: 1, label: "rating on Google" },
    ],
  },

  close: {
    eyebrow: "Your turn",
    title: "Got your figure?",
    sub: "Tell us, and we’ll take care of the rest.",
    cta: "Name your price — 30 seconds",
  },

  footer: { legal: "Legal notice", privacy: "Privacy", cookies: "Cookies" },
};

/* ── Français ───────────────────────────────────────────────────────── */
const fr: DpCopy = {
  meta: {
    title: "Combien voulez-vous pour votre maison ? — The Vila Home",
    description:
      "Dites-nous le chiffre que vous avez en tête et nous le comparons aux ventes réelles de votre secteur. 30 secondes, sans engagement.",
  },
  nav: { cta: "Votre prix" },

  hero: {
    eyebrow: "Propriétaires · Vilanova et alentours",
    titlePre: "Combien voulez-vous pour ",
    titleMark: "votre maison",
    titlePost: " ?",
    sub1: "Le chiffre que vous avez en tête.",
    sub2: "Celui-là.",
    lead: "Dites-le-nous et nous nous occupons du reste.",
    micro: "30 secondes. Sans engagement.",
    inGoogle: "sur Google",
    scrollHint: "Comment ça marche",
  },

  form: {
    stepOf: (n) => `Étape ${n} sur 3`,
    q1: "Écrivez votre prix, tel que vous l’imaginez",
    priceSuffix: "€",
    pricePh: "285 000",
    q2a: "Où se trouve-t-elle ?",
    q2b: "Qu’est-ce que c’est ?",
    q2c: "Quand y pensez-vous ?",
    muni: [
      "Vilanova i la Geltrú",
      "Cunit",
      "Calafell",
      "Cubelles",
      "El Vendrell",
      "Sant Pere de Ribes",
      "Autre",
    ],
    tipo: ["Appartement", "Maison", "Autre"],
    time: ["Je veux vendre maintenant", "Déjà en vente", "Dans les prochains mois", "Simple curiosité"],
    muniOtroL: "Quelle commune ?",
    muniOtroPh: "Sitges, Roquetes, Sant Pere Molanta…",
    tipoOtroL: "Quel type de bien ?",
    tipoOtroPh: "Local, terrain, propriété…",
    fname: "Votre nom",
    fnamePh: "Nom et prénom",
    fphone: "Mobile",
    fphonePh: "600 000 000",
    rgpd: "J’ai lu et j’accepte la",
    rgpdLink: "politique de confidentialité",
    legal:
      "Responsable : Projectes Immobiliaris Costa Daurada, S.L.U. Finalité : répondre à votre demande. Rien d’autre.",
    next: "Continuer",
    back: "← Retour",
    send: "Envoyer mon prix",
    e1: "Saisissez un chiffre pour continuer.",
    e2: "Choisissez une option à chaque question.",
    e3a: "Comment vous appelez-vous ?",
    e3b: "Il nous faut un mobile pour vous appeler.",
    e3c: "Cochez la case de confidentialité pour envoyer.",
    eSend: `L’envoi a échoué. Réessayez ou appelez-nous au +34 ${PHONE_HUMAN}.`,
    eMuniOtro: "Indiquez la commune.",
    eTipoOtro: "Indiquez quel bien c’est.",
    okKicker: "Reçu",
    okh: "C’est fait.",
    oktxt:
      "Nous l’étudions avec des données réelles de votre secteur et nous vous appelons aux heures ouvrables. Une fois. Sans insister.",
    okwa: "Vous préférez nous écrire ? WhatsApp direct",
    sumIn: "Votre chiffre :",
    waMsg: (p, m) => `Bonjour ! Je viens de votre site. Mon prix : ${p} € (${m}).`,
    trust: (r) => `${r} sur Google · +450 familles accompagnées`,
  },

  marquee: { label: "Vendu à" },

  how: {
    eyebrow: "Comment ça marche",
    title: "Votre chiffre est le point de départ. Pas un piège.",
    steps: [
      {
        n: "01",
        t: "Vous nous dites votre prix",
        d: "Le chiffre que vous avez en tête, tel quel. Sans formules bizarres ni estimations interminables.",
      },
      {
        n: "02",
        t: "Nous le comparons à des données réelles",
        d: "Nous le confrontons à ce qui se vend vraiment dans votre secteur, rue par rue.",
      },
      {
        n: "03",
        t: "Nous vous appelons avec une proposition claire",
        d: "15 minutes, sans engagement. Nous vous disons ce que nous voyons et comment nous l’aborderions. Et vous décidez.",
      },
    ],
  },

  proof: {
    eyebrow: "Et « le reste », c’est quoi ?",
    title: "Nous ne changeons pas votre maison. Nous changeons son image.",
    body:
      "L’acheteur décide sur un écran, en quelques secondes. C’est pourquoi nous préparons chaque bien comme il le mérite : photographie, vidéo, plan 3D et visite virtuelle. Faites glisser et comparez vous-même.",
    hint: "Faites glisser pour comparer",
    labelBefore: "Sans soin",
    labelAfter: "Avec nous",
  },

  honesty: {
    eyebrow: "Sans petits caractères",
    lines: [
      "Pas question de vous promettre la lune pour obtenir votre signature.",
      "Un avis honnête, un plan clair,",
    ],
    strong: "et vous décidez.",
  },

  reviews: {
    eyebrow: "Ce que disent ceux qui ont vendu",
    googleLabel: "Avis réels sur Google",
    readMore: "Lire plus",
    readLess: "Lire moins",
  },

  stats: {
    eyebrow: "En chiffres",
    items: [
      { value: 450, prefix: "+", label: "familles accompagnées" },
      { value: 15, label: "ans d’expérience" },
      { value: 4.9, dec: 1, label: "note sur Google" },
    ],
  },

  close: {
    eyebrow: "À vous",
    title: "Vous avez votre chiffre ?",
    sub: "Dites-le-nous et nous nous occupons du reste.",
    cta: "Votre prix — 30 secondes",
  },

  footer: { legal: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies" },
};

export const DP_COPY: Record<Lang, DpCopy> = { es, ca, en, fr };

/* Pares antes/después y reseñas: reutilizados de /como-trabajamos (ya
   traducidos y aprobados). Se accede por idioma en el componente. */
export function proofPairs(lang: Lang) {
  return COMO_COPY[lang].foto.pairs;
}
export function reviewItems(lang: Lang) {
  return COMO_COPY[lang].resenas.items;
}
/* Tour virtual (Matterport) reutilizado de /como-trabajamos: kicker, title,
   body, activate, note y la URL, ya en los 4 idiomas. */
export function tourInfo(lang: Lang) {
  return COMO_COPY[lang].tour;
}
