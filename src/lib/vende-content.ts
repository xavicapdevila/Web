import type { Lang } from "@/lib/i18n";

/* ─────────────────────────────────────────────────────────────────────
   Copy de la landing de Google Ads /vende-tu-casa (ES · CA · EN · FR).
   Página corta y sin fugas: un solo objetivo (el formulario del hero).
   El formulario reutiliza LeadForm y su copy de vender-content.ts.
   ───────────────────────────────────────────────────────────────────── */

export interface VendeCopy {
  headerCta: string;
  floatingCta: string;
  langLabel: string;

  hero: {
    eyebrow: string;
    titleA: string; // admite \n
    titleB: string; // línea destacada en piedra
    sub: string;
    bullets: string[];
    formTitle: string;
    formSub: string;
    ownersLabel: string; // "familias acompañadas"
    reviewsLabel: string; // "reseñas"
    inGoogle: string; // "en Google"
  };

  strip: string[]; // banda de confianza bajo el hero

  after: {
    eyebrow: string;
    title: string;
    sub: string;
    steps: { title: string; text: string }[];
  };

  honesty: {
    eyebrow: string;
    quote: string;
    points: string[];
  };

  includes: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { title: string; text: string }[];
  };

  team: {
    eyebrow: string;
    title: string;
    sub: string;
  };

  social: {
    eyebrow: string;
    title: string;
    reviewsLabel: string; // "reseñas en Google"
    reviewTag: string; // etiqueta bajo el nombre
  };

  finalCta: {
    title: string;
    sub: string;
    button: string;
    orLabel: string;
  };

  footer: { legal: string; privacy: string; cookies: string; tagline: string };
}

const es: VendeCopy = {
  headerCta: "Valoración gratuita",
  floatingCta: "¿Cuánto vale tu casa?",
  langLabel: "Idioma",
  hero: {
    eyebrow: "Inmobiliaria en Vilanova i la Geltrú · Garraf y Penedès",
    titleA: "Vender tu casa es\nuna decisión grande.",
    titleB: "Tratémosla como tal.",
    sub: "Cuéntanos dónde está y te decimos —con datos y sin compromiso— cuánto vale hoy y cómo la venderíamos. Y si no somos tu mejor opción, también te lo diremos.",
    bullets: [
      "Precio con cierres reales de tu zona, no una cifra inflada para captarte.",
      "El mismo asesor desde la primera llamada hasta la firma.",
      "Reportaje profesional incluido: fotografía, vídeo, plano y tour virtual.",
      "Sin permanencias eternas ni letra pequeña.",
    ],
    formTitle: "Cuéntanos tu caso",
    formSub: "Dos minutos. Te respondemos en menos de 24 h laborables, sin presiones y sin spam.",
    ownersLabel: "familias acompañadas",
    reviewsLabel: "reseñas",
    inGoogle: "en Google",
  },
  strip: [
    "Precio real de mercado",
    "Un único asesor",
    "Reportaje profesional incluido",
    "Sin exclusivas eternas",
    "Garraf · Penedès · donde nos llames",
  ],
  after: {
    eyebrow: "Sin sorpresas",
    title: "Qué pasa cuando envías el formulario",
    sub: "Nada de llamadas insistentes ni comerciales con guion. Esto es, literalmente, lo que va a pasar:",
    steps: [
      {
        title: "Una llamada, no un guion",
        text: "Te llamamos en menos de 24 h laborables para entender tu situación. Una conversación normal, de persona a persona: sin argumentario y sin prisas.",
      },
      {
        title: "Valoración con los datos delante",
        text: "Visitamos la casa y preparamos un rango de precio con los cierres reales de tu zona —lo que se ha pagado, no lo que se pide— y los comparables encima de la mesa.",
      },
      {
        title: "Tú decides, con todo claro",
        text: "Te explicamos cómo la venderíamos, qué incluye y cuánto cobramos. Sin compromiso: si no somos tu mejor opción, te lo decimos y tan amigos.",
      },
    ],
  },
  honesty: {
    eyebrow: "Nuestra forma de trabajar",
    quote: "Preferimos perder un encargo antes que prometerte algo que no podemos cumplir.",
    points: [
      "Te decimos el precio real, aunque no sea el que esperabas oír.",
      "Trabajamos pocas casas a la vez, para trabajarlas de verdad.",
      "Informes claros durante toda la venta: siempre sabes qué está pasando.",
      "Sin cláusulas eternas: si no estás contento, te vas.",
    ],
  },
  includes: {
    eyebrow: "Qué incluye",
    title: "Lo que ponemos encima de la mesa",
    sub: "Todo esto va incluido en el encargo. No son extras, es nuestra manera de trabajar cada casa.",
    items: [
      { title: "Precio real, no un cebo", text: "El valor de mercado con datos y comparables. Nunca una cifra inflada solo para llevarnos el encargo." },
      { title: "Un asesor, todo el proceso", text: "El mismo interlocutor de principio a fin. Ni call centers ni explicar tu caso tres veces." },
      { title: "Reportaje que vende", text: "Fotografía profesional, plano, vídeo y tour virtual cuando suma. Tu casa presentada como merece, sin coste extra." },
      { title: "Difusión con criterio", text: "En los portales y canales que mueven a tu comprador, con un anuncio escrito a mano. No spam en cuarenta sitios." },
      { title: "Solo visitas que valen la pena", text: "Cualificamos a cada interesado antes de abrir tu puerta. No pierdes tardes con curiosos." },
      { title: "Papeleo resuelto", text: "Cédula, certificados, nota simple, arras y notaría. Los papeles los perseguimos nosotros, tú no." },
    ],
  },
  team: {
    eyebrow: "Quiénes somos",
    title: "Somos tres. Nos conocerás por el nombre.",
    sub: "Cuando llames no te atenderá un departamento: te atenderemos Ariadna, Sofía o Xavier. Los mismos que valorarán tu casa, la enseñarán y estarán contigo el día de la firma.",
  },
  social: {
    eyebrow: "Lo que dicen los propietarios",
    title: "Vendidas con tranquilidad",
    reviewsLabel: "reseñas en Google",
    reviewTag: "Reseña en Google",
  },
  finalCta: {
    title: "¿Le damos una vuelta a tu caso?",
    sub: "Rellenar el formulario no te compromete a nada: es la manera de que te llamemos y te digamos, con datos, cuánto vale tu casa y cómo la venderíamos.",
    button: "Ir al formulario",
    orLabel: "¿Prefieres hablar directamente?",
  },
  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies", tagline: "Inmobiliaria en Vilanova i la Geltrú" },
};

const ca: VendeCopy = {
  headerCta: "Valoració gratuïta",
  floatingCta: "Quant val casa teva?",
  langLabel: "Idioma",
  hero: {
    eyebrow: "Immobiliària a Vilanova i la Geltrú · Garraf i Penedès",
    titleA: "Vendre casa teva és\nuna decisió gran.",
    titleB: "Tractem-la com a tal.",
    sub: "Explica'ns on és i et diem —amb dades i sense compromís— quant val avui i com la vendríem. I si no som la teva millor opció, també t'ho direm.",
    bullets: [
      "Preu amb tancaments reals de la teva zona, no una xifra inflada per captar-te.",
      "El mateix assessor des de la primera trucada fins a la signatura.",
      "Reportatge professional inclòs: fotografia, vídeo, plànol i tour virtual.",
      "Sense permanències eternes ni lletra petita.",
    ],
    formTitle: "Explica'ns el teu cas",
    formSub: "Dos minuts. Et responem en menys de 24 h laborables, sense pressions i sense spam.",
    ownersLabel: "famílies acompanyades",
    reviewsLabel: "ressenyes",
    inGoogle: "a Google",
  },
  strip: [
    "Preu real de mercat",
    "Un únic assessor",
    "Reportatge professional inclòs",
    "Sense exclusives eternes",
    "Garraf · Penedès · on ens truquis",
  ],
  after: {
    eyebrow: "Sense sorpreses",
    title: "Què passa quan envies el formulari",
    sub: "Res de trucades insistents ni comercials amb guió. Això és, literalment, el que passarà:",
    steps: [
      {
        title: "Una trucada, no un guió",
        text: "Et truquem en menys de 24 h laborables per entendre la teva situació. Una conversa normal, de persona a persona: sense argumentari i sense presses.",
      },
      {
        title: "Valoració amb les dades al davant",
        text: "Visitem la casa i preparem un rang de preu amb els tancaments reals de la teva zona —el que s'ha pagat, no el que es demana— i els comparables sobre la taula.",
      },
      {
        title: "Tu decideixes, amb tot clar",
        text: "T'expliquem com la vendríem, què inclou i quant cobrem. Sense compromís: si no som la teva millor opció, t'ho diem i tan amics.",
      },
    ],
  },
  honesty: {
    eyebrow: "La nostra manera de treballar",
    quote: "Preferim perdre un encàrrec abans que prometre't res que no puguem complir.",
    points: [
      "Et diem el preu real, encara que no sigui el que esperaves sentir.",
      "Treballem poques cases alhora, per treballar-les de veritat.",
      "Informes clars durant tota la venda: sempre saps què està passant.",
      "Sense clàusules eternes: si no estàs content, marxes.",
    ],
  },
  includes: {
    eyebrow: "Què inclou",
    title: "El que posem sobre la taula",
    sub: "Tot això va inclòs a l'encàrrec. No són extres, és la nostra manera de treballar cada casa.",
    items: [
      { title: "Preu real, no un esquer", text: "El valor de mercat amb dades i comparables. Mai una xifra inflada només per endur-nos l'encàrrec." },
      { title: "Un assessor, tot el procés", text: "El mateix interlocutor de principi a fi. Ni call centers ni explicar el teu cas tres vegades." },
      { title: "Reportatge que ven", text: "Fotografia professional, plànol, vídeo i tour virtual quan suma. Casa teva presentada com mereix, sense cost extra." },
      { title: "Difusió amb criteri", text: "Als portals i canals que mouen el teu comprador, amb un anunci escrit a mà. No spam a quaranta llocs." },
      { title: "Només visites que valen la pena", text: "Qualifiquem cada interessat abans d'obrir la teva porta. No perds tardes amb curiosos." },
      { title: "Paperassa resolta", text: "Cèdula, certificats, nota simple, arres i notaria. Els papers els perseguim nosaltres, tu no." },
    ],
  },
  team: {
    eyebrow: "Qui som",
    title: "Som tres. Ens coneixeràs pel nom.",
    sub: "Quan truquis no t'atendrà un departament: t'atendrem l'Ariadna, la Sofía o el Xavier. Els mateixos que valoraran casa teva, l'ensenyaran i seran amb tu el dia de la signatura.",
  },
  social: {
    eyebrow: "El que diuen els propietaris",
    title: "Venudes amb tranquil·litat",
    reviewsLabel: "ressenyes a Google",
    reviewTag: "Ressenya a Google",
  },
  finalCta: {
    title: "Li donem una volta al teu cas?",
    sub: "Omplir el formulari no et compromet a res: és la manera que et truquem i et diguem, amb dades, quant val casa teva i com la vendríem.",
    button: "Anar al formulari",
    orLabel: "Prefereixes parlar directament?",
  },
  footer: { legal: "Avís legal", privacy: "Privacitat", cookies: "Galetes", tagline: "Immobiliària a Vilanova i la Geltrú" },
};

const en: VendeCopy = {
  headerCta: "Free valuation",
  floatingCta: "What is your home worth?",
  langLabel: "Language",
  hero: {
    eyebrow: "Estate agency in Vilanova i la Geltrú · Garraf & Penedès",
    titleA: "Selling your home is\na big decision.",
    titleB: "Let's treat it like one.",
    sub: "Tell us where it is and we'll tell you —with data, no strings attached— what it's worth today and how we would sell it. And if we're not your best option, we'll tell you that too.",
    bullets: [
      "A price based on real closed sales in your area, not an inflated figure to win you over.",
      "The same advisor from the first call to the signing.",
      "Professional media included: photography, video, floor plan and virtual tour.",
      "No endless tie-ins, no small print.",
    ],
    formTitle: "Tell us about your case",
    formSub: "Two minutes. We reply within 24 working hours — no pressure, no spam.",
    ownersLabel: "families guided",
    reviewsLabel: "reviews",
    inGoogle: "on Google",
  },
  strip: [
    "Real market price",
    "One dedicated advisor",
    "Professional media included",
    "No endless exclusivity",
    "Garraf · Penedès · wherever you call us from",
  ],
  after: {
    eyebrow: "No surprises",
    title: "What happens after you send the form",
    sub: "No pushy calls, no salespeople reading a script. This is, quite literally, what will happen:",
    steps: [
      {
        title: "A call, not a script",
        text: "We call you within 24 working hours to understand your situation. A normal conversation, person to person: no sales pitch, no rush.",
      },
      {
        title: "A valuation with the data on the table",
        text: "We visit the property and prepare a price range based on real closed sales in your area —what was actually paid, not asking prices— with the comparables in front of you.",
      },
      {
        title: "You decide, with everything clear",
        text: "We explain how we would sell it, what's included and what we charge. No commitment: if we're not your best option, we'll say so — no hard feelings.",
      },
    ],
  },
  honesty: {
    eyebrow: "How we work",
    quote: "We would rather lose a listing than promise you something we can't deliver.",
    points: [
      "We tell you the real price, even if it's not the one you were hoping to hear.",
      "We take on few homes at a time, so we can truly work each one.",
      "Clear reports throughout the sale: you always know what's going on.",
      "No endless clauses: if you're not happy, you walk away.",
    ],
  },
  includes: {
    eyebrow: "What's included",
    title: "What we bring to the table",
    sub: "All of this comes with the listing. These aren't extras — it's how we work every home.",
    items: [
      { title: "A real price, not bait", text: "The market value backed by data and comparables. Never an inflated figure just to win the listing." },
      { title: "One advisor, the whole way", text: "The same person from start to finish. No call centers, no explaining your case three times." },
      { title: "Media that sells", text: "Professional photography, floor plan, video and virtual tour when it adds value. Your home presented as it deserves, at no extra cost." },
      { title: "Smart exposure", text: "On the portals and channels that actually reach your buyer, with a listing written by hand. No spam across forty sites." },
      { title: "Only visits worth having", text: "We qualify every prospect before opening your door. No afternoons wasted on the merely curious." },
      { title: "Paperwork handled", text: "Occupancy certificate, energy certificate, land registry, deposit contract and notary. We chase the papers, not you." },
    ],
  },
  team: {
    eyebrow: "Who we are",
    title: "We are three. You'll know us by name.",
    sub: "When you call, you won't reach a department: you'll reach Ariadna, Sofía or Xavier. The same people who will value your home, show it and be with you on signing day.",
  },
  social: {
    eyebrow: "What owners say",
    title: "Sold with peace of mind",
    reviewsLabel: "reviews on Google",
    reviewTag: "Google review",
  },
  finalCta: {
    title: "Shall we look at your case?",
    sub: "Filling in the form commits you to nothing: it's simply how we get to call you and tell you, with data, what your home is worth and how we would sell it.",
    button: "Go to the form",
    orLabel: "Prefer to talk directly?",
  },
  footer: { legal: "Legal notice", privacy: "Privacy", cookies: "Cookies", tagline: "Estate agency in Vilanova i la Geltrú" },
};

const fr: VendeCopy = {
  headerCta: "Estimation gratuite",
  floatingCta: "Combien vaut votre maison ?",
  langLabel: "Langue",
  hero: {
    eyebrow: "Agence immobilière à Vilanova i la Geltrú · Garraf & Penedès",
    titleA: "Vendre votre maison est\nune grande décision.",
    titleB: "Traitons-la comme telle.",
    sub: "Dites-nous où elle se trouve et nous vous dirons —avec des données, sans engagement— sa valeur d'aujourd'hui et comment nous la vendrions. Et si nous ne sommes pas votre meilleure option, nous vous le dirons aussi.",
    bullets: [
      "Un prix basé sur les ventes réellement conclues dans votre quartier, pas un chiffre gonflé pour vous séduire.",
      "Le même conseiller du premier appel jusqu'à la signature.",
      "Reportage professionnel inclus : photographie, vidéo, plan et visite virtuelle.",
      "Sans engagement à durée illimitée ni petites lignes.",
    ],
    formTitle: "Parlez-nous de votre cas",
    formSub: "Deux minutes. Nous répondons sous 24 h ouvrées — sans pression, sans spam.",
    ownersLabel: "familles accompagnées",
    reviewsLabel: "avis",
    inGoogle: "sur Google",
  },
  strip: [
    "Prix réel du marché",
    "Un seul conseiller",
    "Reportage professionnel inclus",
    "Sans exclusivité à rallonge",
    "Garraf · Penedès · où que vous soyez",
  ],
  after: {
    eyebrow: "Sans surprises",
    title: "Que se passe-t-il après l'envoi du formulaire",
    sub: "Pas d'appels insistants ni de commerciaux qui récitent un script. Voici, littéralement, ce qui va se passer :",
    steps: [
      {
        title: "Un appel, pas un script",
        text: "Nous vous appelons sous 24 h ouvrées pour comprendre votre situation. Une conversation normale, de personne à personne : sans argumentaire et sans précipitation.",
      },
      {
        title: "Une estimation, données à l'appui",
        text: "Nous visitons le bien et préparons une fourchette de prix basée sur les ventes réellement conclues dans votre quartier —ce qui a été payé, pas ce qui est affiché— avec les comparables sur la table.",
      },
      {
        title: "Vous décidez, en toute clarté",
        text: "Nous vous expliquons comment nous la vendrions, ce qui est inclus et nos honoraires. Sans engagement : si nous ne sommes pas votre meilleure option, nous vous le dirons, bons amis.",
      },
    ],
  },
  honesty: {
    eyebrow: "Notre façon de travailler",
    quote: "Nous préférons perdre un mandat plutôt que de vous promettre ce que nous ne pouvons pas tenir.",
    points: [
      "Nous vous disons le prix réel, même si ce n'est pas celui que vous espériez entendre.",
      "Nous prenons peu de maisons à la fois, pour les travailler vraiment.",
      "Des rapports clairs tout au long de la vente : vous savez toujours où vous en êtes.",
      "Sans clauses interminables : si vous n'êtes pas satisfait, vous partez.",
    ],
  },
  includes: {
    eyebrow: "Ce qui est inclus",
    title: "Ce que nous mettons sur la table",
    sub: "Tout cela est inclus dans le mandat. Ce ne sont pas des extras, c'est notre façon de travailler chaque maison.",
    items: [
      { title: "Un prix réel, pas un appât", text: "La valeur de marché, données et comparables à l'appui. Jamais un chiffre gonflé juste pour obtenir le mandat." },
      { title: "Un conseiller, tout le processus", text: "Le même interlocuteur du début à la fin. Ni call centers, ni votre histoire à répéter trois fois." },
      { title: "Un reportage qui vend", text: "Photographie professionnelle, plan, vidéo et visite virtuelle quand cela apporte. Votre maison présentée comme elle le mérite, sans surcoût." },
      { title: "Une diffusion réfléchie", text: "Sur les portails et canaux qui touchent vraiment votre acheteur, avec une annonce écrite à la main. Pas de spam sur quarante sites." },
      { title: "Seulement des visites utiles", text: "Nous qualifions chaque intéressé avant d'ouvrir votre porte. Pas d'après-midis perdus avec les curieux." },
      { title: "Paperasse réglée", text: "Certificats, cadastre, compromis et notaire. C'est nous qui courons après les papiers, pas vous." },
    ],
  },
  team: {
    eyebrow: "Qui sommes-nous",
    title: "Nous sommes trois. Vous nous connaîtrez par nos prénoms.",
    sub: "Quand vous appellerez, vous ne tomberez pas sur un service : vous parlerez à Ariadna, Sofía ou Xavier. Les mêmes qui estimeront votre maison, la feront visiter et seront à vos côtés le jour de la signature.",
  },
  social: {
    eyebrow: "Ce que disent les propriétaires",
    title: "Vendues en toute sérénité",
    reviewsLabel: "avis sur Google",
    reviewTag: "Avis Google",
  },
  finalCta: {
    title: "On se penche sur votre cas ?",
    sub: "Remplir le formulaire ne vous engage à rien : c'est simplement la façon de vous appeler et de vous dire, données à l'appui, combien vaut votre maison et comment nous la vendrions.",
    button: "Aller au formulaire",
    orLabel: "Vous préférez parler directement ?",
  },
  footer: { legal: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies", tagline: "Agence immobilière à Vilanova i la Geltrú" },
};

export const vendeContent: Record<Lang, VendeCopy> = { es, ca, en, fr };
