import type { Lang } from "@/lib/i18n";

/* ─────────────────────────────────────────────────────────────────────
   Copy de la landing /vender en los 4 idiomas (ES · CA · EN · FR).
   Se mantiene aquí (fuera de i18n.ts) porque es contenido estructurado
   propio de la landing (arrays, objetos), no claves sueltas de UI.
   Los iconos SVG viven en el componente y se enlazan por índice.
   ───────────────────────────────────────────────────────────────────── */

export interface VenderCopy {
  navCta: string;
  floatingCta: string;
  langLabel: string;

  trust: {
    google: string; // "en Google"
    reviews: string; // "reseñas"
    price: string;
    advisor: string;
    report: string;
    noStrings: string;
    zones: string; // lista de comarcas
    ownersPrefix: string; // "Más de 200 propietarios acompañados desde "
  };

  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string; // resaltado en cursiva/dorado
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    teamLabel: string;
    inGoogle: string; // "en Google"
    ownersLabel: string; // "propietarios acompañados"
    since: string; // "desde"
    reach: string; // "Del Garraf al Baix Empordà, allá donde nos llames"
  };

  antiCliche: {
    eyebrow: string;
    title: string;
    sub: string;
    oldTitle: string;
    ourTitle: string;
    oldWay: string[];
    ourWay: string[];
  };

  method: {
    eyebrow: string;
    title: string;
    sub: string;
    doLabel: string;
    youLabel: string;
    steps: { title: string; do_: string; you: string }[];
  };

  marketing: {
    eyebrow: string;
    title: string;
    sub: string;
    showcase: { title: string; text: string }[];
    channelsLabel: string;
    channels: string[];
    badge: string;
    mockCaption: string;
    tags: string[];
    reelViews: string; // "visualizaciones"
    reelComments: string; // "comentarios"
    reelCaption: string; // texto bajo el reel
  };

  tour: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    note: string;
  };

  includes: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
  };

  team: {
    eyebrow: string;
    title: string;
    sub: string;
    roles: string[]; // Ariadna, Sofía, Xavier
    rolesShort: string[]; // etiqueta corta bajo el retrato del hero
    moreText: string;
    moreLink: string;
  };

  honesty: {
    eyebrow: string;
    quote: string;
    points: string[];
  };

  social: {
    eyebrow: string;
    title: string;
    reviewsLabel: string; // "reseñas en Google"
    reviewTag: string; // etiqueta bajo el nombre en cada reseña real
    testimonials: { quote: string; name: string; initials: string; tag: string }[];
  };

  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    bullets: string[];
    otherLabel: string;
    valoracion: string;
  };

  form: {
    situationLegend: string;
    situations: { key: string; label: string; hint: string }[];
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    email: string;
    emailPh: string;
    zone: string;
    zonePh: string;
    priceLabel: string; // pregunta de precio (formulario «pon tu precio»)
    pricePh: string;
    message: string;
    messagePh: string;
    optional: string;
    submit: string;
    sending: string;
    next: string; // botón «Siguiente» (formulario multi-paso)
    back: string; // botón «Atrás»
    thanks: string; // título de éxito personalizado, con {name}
    waContact: string; // mensaje de WhatsApp con {name} y {phone}
    consent: string; // texto antes del enlace
    consentLink: string; // "política de privacidad"
    consentAfter: string; // texto después del enlace
    consentCheck: string; // etiqueta de la casilla obligatoria de RGPD
    error: string;
    okTitle: string;
    okText: string;
    whatsappCta: string; // botón que aparece tras enviar
    whatsappText: string; // mensaje pre-escrito de WhatsApp
  };

  footer: {
    legal: string;
    privacy: string;
    cookies: string;
  };
}

const es: VenderCopy = {
  navCta: "Valoración gratuita",
  floatingCta: "¿Cuánto vale tu casa?",
  langLabel: "Idioma",
  trust: {
    google: "en Google",
    reviews: "reseñas",
    price: "Precio real de mercado, no estimaciones para captarte",
    advisor: "Un único asesor, de la valoración a la firma",
    report: "Reportaje profesional incluido",
    noStrings: "Sin exclusivas eternas ni letra pequeña",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… donde nos llames",
    ownersPrefix: "Más de 450 familias acompañadas",
  },
  hero: {
    eyebrow: "Vender con The Vila Home",
    titleA: "Vender tu casa bien\nno es suerte.",
    titleB: "Es saber hacerlo.",
    sub: "No trabajamos con promesas imposibles ni con valoraciones infladas para conseguir una firma. Preferimos explicar las cosas como son, ayudarte a tomar buenas decisiones y acompañarte hasta el día de la escritura.",
    ctaPrimary: "Solicitar valoración gratuita",
    ctaSecondary: "Hablar con un asesor",
    teamLabel: "Tu equipo en The Vila Home",
    inGoogle: "en Google",
    ownersLabel: "familias acompañadas",
    since: "desde",
    reach: "Del Garraf al Baix Empordà, allá donde nos llames",
  },
  antiCliche: {
    eyebrow: "Seamos claros",
    title: "Quizá no somos tu inmobiliaria.",
    sub: "Trabajamos de una manera muy concreta, y lo decimos claro desde el principio: no le encaja a todo el mundo. Pero si buscas esto, somos tu equipo.",
    oldTitle: "La venta de siempre",
    ourTitle: "Cómo lo hacemos nosotros",
    oldWay: [
      "Tu casa en cuarenta portales a la vez, con la primera foto que salga.",
      "El cartel de otras tres agencias colgando del mismo balcón.",
      "Un precio inflado para captarte y, semanas después, «toca bajar».",
      "Un teléfono distinto cada vez que llamas para preguntar.",
      "Visitas de cualquiera, sin filtrar, tú vaciando la casa cada tarde.",
      "Y tú persiguiendo una información que nadie te termina de dar.",
    ],
    ourWay: [
      "Una casa cada vez, trabajada como si fuera la única.",
      "Reportaje profesional y un anuncio escrito a mano, no copiado.",
      "Un precio real desde el primer día, con datos y comparables.",
      "El mismo asesor de principio a fin. Siempre sabes con quién hablas.",
      "Compradores cualificados antes de abrir tu puerta.",
      "Informes claros: en todo momento sabes en qué punto está tu venta.",
    ],
  },
  method: {
    eyebrow: "Cómo trabajamos",
    title: "Así trabajamos, paso a paso",
    sub: "No escondemos el proceso, lo enseñamos. Seis fases, un mismo asesor, y en cada una: lo que hacemos nosotros y lo que ganas tú.",
    doLabel: "Qué hacemos",
    youLabel: "Qué ganas tú",
    steps: [
      {
        title: "Valoración honesta",
        do_: "Estudiamos tu vivienda y los cierres reales de tu zona —no los precios de anuncio— y te damos un rango con datos y comparables encima de la mesa.",
        you: "Sales a mercado con un precio que se sostiene. Ni inflado para captarte, ni bajo para vender rápido a tu costa.",
      },
      {
        title: "Preparación y puesta a punto",
        do_: "Revisamos la documentación (nota simple, cédula, certificado energético) y preparamos la casa para que se enseñe en su mejor versión.",
        you: "Llegas a las visitas con todo en regla y una casa que enamora, no que ahuyenta.",
      },
      {
        title: "Reportaje profesional",
        do_: "Fotografía, plano y —cuando suma— vídeo y tour virtual. Tu casa se presenta como un producto, no como un clasificado más.",
        you: "Destacas entre cientos de anuncios grises. La primera impresión decide si hay visita.",
      },
      {
        title: "Difusión selectiva",
        do_: "Publicamos en los portales y redes que de verdad mueven a tu comprador, con un anuncio cuidado y una campaña pensada.",
        you: "Llega el comprador adecuado, no mil curiosos. Menos ruido y mejores visitas.",
      },
      {
        title: "Filtrado, visitas y negociación",
        do_: "Cualificamos a cada interesado antes de abrir tu puerta, gestionamos las visitas y negociamos cada oferta a tu favor.",
        you: "No pierdes tardes con quien no puede comprar. Y cierras en las mejores condiciones, no solo en las más rápidas.",
      },
      {
        title: "Arras, notaría y entrega",
        do_: "Preparamos las arras, coordinamos con notaría y banca y te acompañamos hasta la entrega de llaves.",
        you: "Llegas a la firma sin sorpresas ni papeles pendientes. De principio a fin, la misma persona.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Cómo mostramos tu casa al mundo",
    sub: "Vender no es publicar y esperar. Es presentar tu casa como un producto y ponerla delante de quien la está buscando de verdad. Esto es lo que hacemos con cada vivienda:",
    showcase: [
      { title: "Fotografía profesional", text: "Con luz, encuadre y edición de verdad. La imagen que decide si hay clic." },
      { title: "Vídeo y tour virtual 360º", text: "Tu casa se recorre desde el sofá. Menos visitas frías, más visitas útiles." },
      { title: "Plano acotado", text: "El comprador entiende la distribución de un vistazo y proyecta su vida dentro." },
      { title: "Home staging y puesta a punto", text: "Preparamos los espacios para que se enseñen en su mejor versión." },
      { title: "Anuncio escrito a mano", text: "Un texto que cuenta la casa, no cuatro datos copiados y pegados." },
      { title: "Fotografía aérea con dron", text: "Cuando el entorno suma —mar, montaña, parcela—, lo enseñamos desde el aire." },
    ],
    channelsLabel: "Y la difundimos donde está tu comprador",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Web propia", "Instagram", "TikTok", "Base de compradores", "Email a interesados"],
    badge: "En exclusiva",
    mockCaption: "Tu casa, contada con cariño",
    tags: ["Foto pro", "Plano", "Tour 360º"],
    reelViews: "visualizaciones",
    reelComments: "comentarios",
    reelCaption: "Y en redes, tu casa se mueve de verdad.",
  },
  tour: {
    eyebrow: "Tecnología",
    title: "Recorre la casa en 3D, como si estuvieras dentro",
    sub: "Cada propiedad con tour virtual navegable y plano en 3D: el comprador la visita entera desde el sofá, a cualquier hora, y llega a la visita ya convencido. Menos visitas frías, más ofertas reales.",
    cta: "Mueve el ratón para explorar",
    note: "Tour de ejemplo — pronto, los de vuestros inmuebles.",
  },
  includes: {
    eyebrow: "Qué incluye",
    title: "Todo lo que ponemos de nuestra parte",
    items: [
      { title: "Precio real, no un cebo", text: "El valor de mercado con datos y comparables. Nunca un precio inflado solo para llevarnos el encargo." },
      { title: "Un asesor, todo el proceso", text: "El mismo interlocutor desde la valoración hasta la firma. Ni call centers, ni explicar tu caso una y otra vez." },
      { title: "Reportaje que vende", text: "Fotografía profesional, plano y vídeo cuando suma. Tu casa presentada como merece, sin coste extra." },
      { title: "Difusión con criterio", text: "En los canales que mueven a tu comprador, con un anuncio cuidado. No spam en cuarenta portales." },
      { title: "Cuentas claras", text: "Informes de visitas e interés real, sin tecnicismos. Sabes qué pasa con tu casa en cada momento." },
      { title: "Papeleo resuelto", text: "Cédula, certificados, notas simples, arras y notaría. Nosotros perseguimos los papeles, tú no." },
    ],
  },
  team: {
    eyebrow: "Quiénes lo hacemos",
    title: "Personas, no un número de expediente",
    sub: "Cuando vendes con nosotros no hablas con un call center. Somos tres, nos conoces por tu nombre y respondemos por tu casa de principio a fin.",
    roles: ["Responsable de equipo · Asesora inmobiliaria", "Asesora inmobiliaria", "Fundador · Dirección & Marketing"],
    rolesShort: ["Responsable de equipo", "Asesora inmobiliaria", "Fundador"],
    moreText: "¿Quieres saber más de nosotros?",
    moreLink: "Conoce al equipo",
  },
  honesty: {
    eyebrow: "Nuestra forma de trabajar",
    quote: "Preferimos perder un encargo antes que prometerte algo que no podemos cumplir.",
    points: [
      "Te decimos el precio real, aunque no sea el que esperabas oír.",
      "Si no somos la mejor opción para tu caso, te lo decimos.",
      "Trabajamos preferentemente en exclusiva —para volcarnos en tu casa—, pero sin atarte a cláusulas eternas.",
      "Informes claros de principio a fin: siempre sabes en qué punto está tu venta.",
    ],
  },
  social: {
    eyebrow: "Lo que dicen los propietarios",
    title: "Vendidas con tranquilidad",
    reviewsLabel: "reseñas en Google",
    reviewTag: "Reseña en Google",
    testimonials: [
      { quote: "Nos dijeron desde el primer día el precio real. Vendimos sin bajar de nuestras expectativas.", name: "Marta R.", initials: "MR", tag: "Vendió su piso en Vilanova" },
      { quote: "Lo que más valoro es que siempre hablé con la misma persona. Nada de explicar tu caso una y otra vez.", name: "Jordi & Anna", initials: "JA", tag: "Vendieron su casa en Cunit" },
      { quote: "Transparencia total con la documentación y en la negociación. Me sentí acompañada hasta la firma.", name: "Carmen P.", initials: "CP", tag: "Vendió su ático en Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Hablemos",
    title: "Cuéntanos tu caso y te decimos cómo te ayudaríamos",
    sub: "Tanto si quieres vender ya como si solo le das vueltas, esto no te compromete a nada. Dejas tus datos, entendemos tu situación y te contamos —con honestidad— qué haríamos con tu casa.",
    bullets: [
      "Respuesta en menos de 24 h laborables.",
      "Un asesor real, no un formulario que se pierde.",
      "Sin compromiso, sin presiones y sin spam.",
    ],
    otherLabel: "¿Prefieres otra vía?",
    valoracion: "Valoración online al instante",
  },
  form: {
    situationLegend: "¿En qué punto estás?",
    situations: [
      { key: "ahora", label: "Quiero vender ahora", hint: "Estoy listo para salir al mercado" },
      { key: "meses", label: "En los próximos meses", hint: "Me lo estoy planteando a corto plazo" },
      { key: "explorando", label: "Solo estoy explorando", hint: "Aún no lo tengo decidido" },
      { key: "en_venta", label: "Ya está a la venta", hint: "Con otra agencia o por mi cuenta" },
    ],
    name: "Nombre",
    namePh: "¿Cómo te llamas?",
    phone: "Teléfono",
    phonePh: "¿Dónde podemos llamarte?",
    email: "Correo electrónico",
    emailPh: "nombre@correo.com",
    zone: "Población",
    zonePh: "¿Dónde se encuentra la vivienda?",
    priceLabel: "¿Qué precio tienes pensado?",
    pricePh: "Ej.: 350.000 € (opcional)",
    message: "Mensaje",
    messagePh: "Cuéntanos un poco sobre tu vivienda o en qué podemos ayudarte.",
    optional: "(opcional)",
    submit: "Quiero que me contactéis",
    sending: "Enviando…",
    next: "Siguiente",
    back: "Atrás",
    thanks: "¡Gracias, {name}!",
    waContact: "Hola 👋 Soy {name}. Acabo de rellenar el formulario de vuestra web para vender mi casa. Mi teléfono: {phone}.",
    consent: "Al enviar aceptas nuestra ",
    consentLink: "política de privacidad",
    consentAfter: ". No compartimos tus datos ni te llenamos el buzón de spam.",
    consentCheck: "He leído y acepto la",
    error: "No se ha podido enviar. Inténtalo de nuevo o escríbenos a ",
    okTitle: "Recibido. Gracias.",
    okText: "Uno de nosotros —una persona, no un robot— te llamará en menos de 24 h laborables para conocer tu caso. Si lo prefieres, escríbenos ahora mismo por WhatsApp.",
    whatsappCta: "Avísanos por WhatsApp",
    whatsappText: "Hola 👋 Acabo de rellenar el formulario de vuestra web para vender mi casa. Os dejo mi contacto por aquí también.",
  },
  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
};

const ca: VenderCopy = {
  navCta: "Valoració gratuïta",
  floatingCta: "Quant val casa teva?",
  langLabel: "Idioma",
  trust: {
    google: "a Google",
    reviews: "ressenyes",
    price: "Preu real de mercat, no estimacions per captar-te",
    advisor: "Un únic assessor, de la valoració a la firma",
    report: "Reportatge professional inclòs",
    noStrings: "Sense exclusives eternes ni lletra petita",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… on ens cridis",
    ownersPrefix: "Més de 450 famílies acompanyades",
  },
  hero: {
    eyebrow: "Vendre amb The Vila Home",
    titleA: "Vendre bé casa teva\nno és sort.",
    titleB: "És saber-ho fer.",
    sub: "No treballem amb promeses impossibles ni amb valoracions inflades per aconseguir una signatura. Preferim explicar les coses com són, ajudar-te a prendre bones decisions i acompanyar-te fins al dia de l'escriptura.",
    ctaPrimary: "Demanar valoració gratuïta",
    ctaSecondary: "Parlar amb un assessor",
    teamLabel: "El teu equip a The Vila Home",
    inGoogle: "a Google",
    ownersLabel: "famílies acompanyades",
    since: "des del",
    reach: "Del Garraf al Baix Empordà, allà on ens cridis",
  },
  antiCliche: {
    eyebrow: "Parlem clar",
    title: "Potser no som la teva immobiliària.",
    sub: "Treballem d'una manera molt concreta, i ho diem clar des del principi: no li encaixa a tothom. Però si busques això, som el teu equip.",
    oldTitle: "La venda de sempre",
    ourTitle: "Com ho fem nosaltres",
    oldWay: [
      "Casa teva a quaranta portals alhora, amb la primera foto que surti.",
      "El cartell d'altres tres agències penjant del mateix balcó.",
      "Un preu inflat per captar-te i, setmanes després, «toca abaixar».",
      "Un telèfon diferent cada cop que truques per preguntar.",
      "Visites de qualsevol, sense filtrar, tu buidant la casa cada tarda.",
      "I tu perseguint una informació que ningú t'acaba de donar.",
    ],
    ourWay: [
      "Una casa cada cop, treballada com si fos l'única.",
      "Reportatge professional i un anunci escrit a mà, no copiat.",
      "Un preu real des del primer dia, amb dades i comparables.",
      "El mateix assessor de principi a fi. Sempre saps amb qui parles.",
      "Compradors qualificats abans d'obrir la teva porta.",
      "Informes clars: en tot moment saps en quin punt està la teva venda.",
    ],
  },
  method: {
    eyebrow: "Com treballem",
    title: "Així treballem, pas a pas",
    sub: "No amaguem el procés, l'ensenyem. Sis fases, un mateix assessor, i a cada una: el que fem nosaltres i el que hi guanyes tu.",
    doLabel: "Què fem",
    youLabel: "Què hi guanyes",
    steps: [
      {
        title: "Valoració honesta",
        do_: "Estudiem el teu habitatge i els tancaments reals de la teva zona —no els preus d'anunci— i et donem una forquilla amb dades i comparables sobre la taula.",
        you: "Surts al mercat amb un preu que se sosté. Ni inflat per captar-te, ni baix per vendre ràpid a costa teva.",
      },
      {
        title: "Preparació i posada a punt",
        do_: "Revisem la documentació (nota simple, cèdula, certificat energètic) i preparem la casa perquè es mostri en la seva millor versió.",
        you: "Arribes a les visites amb tot en regla i una casa que enamora, no que espanta.",
      },
      {
        title: "Reportatge professional",
        do_: "Fotografia, plànol i —quan suma— vídeo i tour virtual. Casa teva es presenta com un producte, no com un classificat més.",
        you: "Destaques entre centenars d'anuncis grisos. La primera impressió decideix si hi ha visita.",
      },
      {
        title: "Difusió selectiva",
        do_: "Publiquem als portals i xarxes que de debò mouen el teu comprador, amb un anunci cuidat i una campanya pensada.",
        you: "Arriba el comprador adequat, no mil curiosos. Menys soroll i millors visites.",
      },
      {
        title: "Filtratge, visites i negociació",
        do_: "Qualifiquem cada interessat abans d'obrir la teva porta, gestionem les visites i negociem cada oferta a favor teu.",
        you: "No perds tardes amb qui no pot comprar. I tanques en les millors condicions, no només en les més ràpides.",
      },
      {
        title: "Arres, notaria i lliurament",
        do_: "Preparem les arres, coordinem amb notaria i banca i t'acompanyem fins al lliurament de claus.",
        you: "Arribes a la firma sense sorpreses ni papers pendents. De principi a fi, la mateixa persona.",
      },
    ],
  },
  marketing: {
    eyebrow: "Màrqueting",
    title: "Com mostrem casa teva al món",
    sub: "Vendre no és publicar i esperar. És presentar casa teva com un producte i posar-la davant de qui la busca de debò. Això és el que fem amb cada habitatge:",
    showcase: [
      { title: "Fotografia professional", text: "Amb llum, enquadrament i edició de veritat. La imatge que decideix si hi ha clic." },
      { title: "Vídeo i tour virtual 360º", text: "Casa teva es recorre des del sofà. Menys visites fredes, més visites útils." },
      { title: "Plànol acotat", text: "El comprador entén la distribució d'un cop d'ull i projecta la seva vida a dins." },
      { title: "Home staging i posada a punt", text: "Preparem els espais perquè es mostrin en la seva millor versió." },
      { title: "Anunci escrit a mà", text: "Un text que explica la casa, no quatre dades copiades i enganxades." },
      { title: "Fotografia aèria amb dron", text: "Quan l'entorn suma —mar, muntanya, parcel·la—, ho ensenyem des de l'aire." },
    ],
    channelsLabel: "I la difonem on és el teu comprador",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Web pròpia", "Instagram", "TikTok", "Base de compradors", "Email a interessats"],
    badge: "En exclusiva",
    mockCaption: "Casa teva, explicada amb estima",
    tags: ["Foto pro", "Plànol", "Tour 360º"],
    reelViews: "visualitzacions",
    reelComments: "comentaris",
    reelCaption: "I a les xarxes, casa teva es mou de veritat.",
  },
  tour: {
    eyebrow: "Tecnologia",
    title: "Recorre la casa en 3D, com si hi fossis a dins",
    sub: "Cada propietat amb tour virtual navegable i plànol en 3D: el comprador la visita sencera des del sofà, a qualsevol hora, i arriba a la visita ja convençut. Menys visites fredes, més ofertes reals.",
    cta: "Mou el ratolí per explorar",
    note: "Tour d'exemple — aviat, els dels vostres immobles.",
  },
  includes: {
    eyebrow: "Què inclou",
    title: "Tot el que hi posem de la nostra part",
    items: [
      { title: "Preu real, no un esquer", text: "El valor de mercat amb dades i comparables. Mai un preu inflat només per endur-nos l'encàrrec." },
      { title: "Un assessor, tot el procés", text: "El mateix interlocutor des de la valoració fins a la firma. Ni call centers, ni explicar el teu cas un cop i un altre." },
      { title: "Reportatge que ven", text: "Fotografia professional, plànol i vídeo quan suma. Casa teva presentada com es mereix, sense cost extra." },
      { title: "Difusió amb criteri", text: "Als canals que mouen el teu comprador, amb un anunci cuidat. No spam a quaranta portals." },
      { title: "Comptes clars", text: "Informes de visites i interès real, sense tecnicismes. Saps què passa amb casa teva en cada moment." },
      { title: "Paperassa resolta", text: "Cèdula, certificats, notes simples, arres i notaria. Nosaltres perseguim els papers, tu no." },
    ],
  },
  team: {
    eyebrow: "Qui ho fem",
    title: "Persones, no un número d'expedient",
    sub: "Quan vens amb nosaltres no parles amb un call center. Som tres, ens coneixes pel teu nom i responem per casa teva de principi a fi.",
    roles: ["Responsable d'equip · Assessora immobiliària", "Assessora immobiliària", "Fundador · Direcció & Màrqueting"],
    rolesShort: ["Responsable d'equip", "Assessora immobiliària", "Fundador"],
    moreText: "Vols saber-ne més, de nosaltres?",
    moreLink: "Coneix l'equip",
  },
  honesty: {
    eyebrow: "La nostra manera de treballar",
    quote: "Preferim perdre un encàrrec abans que prometre't una cosa que no podem complir.",
    points: [
      "Et diem el preu real, encara que no sigui el que esperaves sentir.",
      "Si no som la millor opció per al teu cas, t'ho diem.",
      "Treballem preferentment en exclusiva —per bolcar-nos en casa teva—, però sense lligar-te a clàusules eternes.",
      "Informes clars de principi a fi: sempre saps en quin punt està la teva venda.",
    ],
  },
  social: {
    eyebrow: "El que diuen els propietaris",
    title: "Venudes amb tranquil·litat",
    reviewsLabel: "ressenyes a Google",
    reviewTag: "Ressenya a Google",
    testimonials: [
      { quote: "Ens van dir des del primer dia el preu real. Vam vendre sense abaixar de les nostres expectatives.", name: "Marta R.", initials: "MR", tag: "Va vendre el seu pis a Vilanova" },
      { quote: "El que més valoro és que sempre vaig parlar amb la mateixa persona. Res d'explicar el teu cas un cop i un altre.", name: "Jordi & Anna", initials: "JA", tag: "Van vendre la casa a Cunit" },
      { quote: "Transparència total amb la documentació i en la negociació. Em vaig sentir acompanyada fins a la firma.", name: "Carmen P.", initials: "CP", tag: "Va vendre el seu àtic a Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Parlem-ne",
    title: "Explica'ns el teu cas i et diem com t'ajudaríem",
    sub: "Tant si vols vendre ja com si només hi dónes voltes, això no et compromet a res. Deixes les teves dades, entenem la teva situació i t'expliquem —amb honestedat— què faríem amb casa teva.",
    bullets: [
      "Resposta en menys de 24 h laborables.",
      "Un assessor real, no un formulari que es perd.",
      "Sense compromís, sense pressions i sense spam.",
    ],
    otherLabel: "Prefereixes una altra via?",
    valoracion: "Valoració online a l'instant",
  },
  form: {
    situationLegend: "En quin punt estàs?",
    situations: [
      { key: "ahora", label: "Vull vendre ara", hint: "Estic a punt per sortir al mercat" },
      { key: "meses", label: "En els pròxims mesos", hint: "M'ho estic plantejant a curt termini" },
      { key: "explorando", label: "Només estic explorant", hint: "Encara no ho tinc decidit" },
      { key: "en_venta", label: "Ja està a la venda", hint: "Amb una altra agència o pel meu compte" },
    ],
    name: "Nom",
    namePh: "Com et dius?",
    phone: "Telèfon",
    phonePh: "On et podem trucar?",
    email: "Correu electrònic",
    emailPh: "Només l'utilitzarem per contactar amb tu. Res de publi.",
    zone: "Població",
    zonePh: "On es troba l'habitatge?",
    priceLabel: "Quin preu tens pensat?",
    pricePh: "Ex.: 350.000 € (opcional)",
    message: "Missatge",
    messagePh: "Explica'ns una mica sobre el teu habitatge o en què et podem ajudar.",
    optional: "(opcional)",
    submit: "Vull que em contacteu",
    sending: "Enviant…",
    next: "Següent",
    back: "Enrere",
    thanks: "Gràcies, {name}!",
    waContact: "Hola 👋 Sóc {name}. Acabo d'omplir el formulari del vostre web per vendre casa meva. El meu telèfon: {phone}.",
    consent: "En enviar acceptes la nostra ",
    consentLink: "política de privacitat",
    consentAfter: ". No compartim les teves dades ni t'omplim la bústia de spam.",
    consentCheck: "He llegit i accepto la",
    error: "No s'ha pogut enviar. Torna-ho a provar o escriu-nos a ",
    okTitle: "Rebut. Gràcies.",
    okText: "Un de nosaltres —una persona, no un robot— et trucarà en menys de 24 h laborables per conèixer el teu cas. Si ho prefereixes, escriu-nos ara mateix per WhatsApp.",
    whatsappCta: "Avisa'ns per WhatsApp",
    whatsappText: "Hola 👋 Acabo d'omplir el formulari de la vostra web per vendre casa meva. Us deixo el meu contacte per aquí també.",
  },
  footer: { legal: "Avís legal", privacy: "Privacitat", cookies: "Cookies" },
};

const en: VenderCopy = {
  navCta: "Free valuation",
  floatingCta: "What's your home worth?",
  langLabel: "Language",
  trust: {
    google: "on Google",
    reviews: "reviews",
    price: "Real market price, not estimates to win your listing",
    advisor: "One advisor, from valuation to signing",
    report: "Professional photo shoot included",
    noStrings: "No endless exclusives, no fine print",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… wherever you call us",
    ownersPrefix: "Over 450 families guided",
  },
  hero: {
    eyebrow: "Selling with The Vila Home",
    titleA: "Selling your home well\nisn't luck.",
    titleB: "It's knowing how.",
    sub: "We don't work with impossible promises or inflated valuations to win a signature. We prefer to explain things as they are, help you make good decisions, and stand by you until the day of the deed.",
    ctaPrimary: "Request a free valuation",
    ctaSecondary: "Talk to an advisor",
    teamLabel: "Your team at The Vila Home",
    inGoogle: "on Google",
    ownersLabel: "families guided",
    since: "since",
    reach: "From the Garraf to the Baix Empordà — wherever you call us",
  },
  antiCliche: {
    eyebrow: "Let's be clear",
    title: "Maybe we're not your agency.",
    sub: "We work in a very particular way, and we say it plainly from the start: it's not for everyone. But if this is what you're looking for, we're your team.",
    oldTitle: "The usual way to sell",
    ourTitle: "How we do it",
    oldWay: [
      "Your home on forty portals at once, with the first photo that comes out.",
      "Three other agencies' signs hanging off the same balcony.",
      "A price inflated to win your listing and, weeks later, “time to drop it”.",
      "A different phone number every time you call to ask.",
      "Viewings for anyone, unfiltered, you clearing the house every afternoon.",
      "And you chasing information no one quite gives you.",
    ],
    ourWay: [
      "One home at a time, handled as if it were the only one.",
      "A professional shoot and a listing written by hand, not copy-pasted.",
      "A real price from day one, with data and comparables.",
      "The same advisor from start to finish. You always know who you're talking to.",
      "Qualified buyers before we open your door.",
      "Clear reports: you always know where your sale stands.",
    ],
  },
  method: {
    eyebrow: "How we work",
    title: "How we work, step by step",
    sub: "We don't hide the process, we show it. Six phases, one advisor, and in each one: what we do and what you gain.",
    doLabel: "What we do",
    youLabel: "What you gain",
    steps: [
      {
        title: "Honest valuation",
        do_: "We study your home and the real closing prices in your area — not listing prices — and give you a range with data and comparables on the table.",
        you: "You go to market with a price that holds up. Not inflated to win you over, not low to sell fast at your expense.",
      },
      {
        title: "Preparation and staging",
        do_: "We review the paperwork (land registry note, occupancy licence, energy certificate) and get the home ready to show at its best.",
        you: "You reach the viewings with everything in order and a home that wins people over, not one that scares them off.",
      },
      {
        title: "Professional shoot",
        do_: "Photography, floor plan and — when it adds value — video and virtual tour. Your home is presented as a product, not just another classified ad.",
        you: "You stand out among hundreds of grey listings. The first impression decides whether there's a viewing.",
      },
      {
        title: "Selective marketing",
        do_: "We publish on the portals and social channels that actually move your buyer, with a polished listing and a thought-out campaign.",
        you: "The right buyer shows up, not a thousand curious clickers. Less noise and better viewings.",
      },
      {
        title: "Screening, viewings and negotiation",
        do_: "We qualify every enquiry before we open your door, manage the viewings and negotiate every offer in your favour.",
        you: "You don't waste afternoons on people who can't buy. And you close on the best terms, not just the fastest.",
      },
      {
        title: "Deposit, notary and handover",
        do_: "We prepare the deposit contract, coordinate with the notary and the bank and stay with you through to the handover of keys.",
        you: "You reach the signing with no surprises and no loose ends. From start to finish, the same person.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "How we show your home to the world",
    sub: "Selling isn't posting and waiting. It's presenting your home as a product and putting it in front of the people actually looking for it. Here's what we do with every home:",
    showcase: [
      { title: "Professional photography", text: "Real light, framing and editing. The image that decides whether there's a click." },
      { title: "Video and 360º virtual tour", text: "Your home is toured from the sofa. Fewer cold viewings, more useful ones." },
      { title: "Measured floor plan", text: "The buyer grasps the layout at a glance and pictures their life inside." },
      { title: "Home staging and prep", text: "We prepare the spaces so they show at their very best." },
      { title: "Listing written by hand", text: "Copy that tells the story of the home, not four facts copied and pasted." },
      { title: "Aerial drone photography", text: "When the surroundings add value — sea, mountains, plot — we show it from the air." },
    ],
    channelsLabel: "And we spread it where your buyer is",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Our website", "Instagram", "TikTok", "Buyer database", "Email to leads"],
    badge: "Exclusive",
    mockCaption: "Your home, told with care",
    tags: ["Pro photo", "Floor plan", "360º tour"],
    reelViews: "views",
    reelComments: "comments",
    reelCaption: "And on social, your home really moves.",
  },
  tour: {
    eyebrow: "Technology",
    title: "Walk through the home in 3D, as if you were inside",
    sub: "Every property with a navigable virtual tour and 3D floor plan: buyers explore it fully from the sofa, any time, and arrive at the viewing already convinced. Fewer cold viewings, more real offers.",
    cta: "Move your mouse to explore",
    note: "Sample tour — your properties' tours coming soon.",
  },
  includes: {
    eyebrow: "What's included",
    title: "Everything we bring to the table",
    items: [
      { title: "A real price, not bait", text: "Market value with data and comparables. Never a price inflated just to win the listing." },
      { title: "One advisor, the whole way", text: "The same person from valuation to signing. No call centres, no explaining your case again and again." },
      { title: "A shoot that sells", text: "Professional photography, floor plan and video when it adds value. Your home presented as it deserves, at no extra cost." },
      { title: "Marketing with judgement", text: "On the channels that move your buyer, with a polished listing. No spamming forty portals." },
      { title: "Clear accounts", text: "Reports on viewings and real interest, no jargon. You know what's happening with your home at every moment." },
      { title: "Paperwork handled", text: "Occupancy licence, certificates, registry notes, deposit and notary. We chase the paperwork, you don't." },
    ],
  },
  team: {
    eyebrow: "Who does it",
    title: "People, not a case number",
    sub: "When you sell with us you don't talk to a call centre. There are three of us, we know you by name and we answer for your home from start to finish.",
    roles: ["Team lead · Real estate advisor", "Real estate advisor", "Founder · Management & Marketing"],
    rolesShort: ["Team lead", "Real estate advisor", "Founder"],
    moreText: "Want to know more about us?",
    moreLink: "Meet the team",
  },
  honesty: {
    eyebrow: "The way we work",
    quote: "We'd rather lose a listing than promise you something we can't deliver.",
    points: [
      "We tell you the real price, even when it's not what you hoped to hear.",
      "If we're not the best option for your case, we'll say so.",
      "We work mainly on an exclusive basis — to give your home our all — but without tying you to endless clauses.",
      "Clear reports from start to finish: you always know where your sale stands.",
    ],
  },
  social: {
    eyebrow: "What owners say",
    title: "Sold with peace of mind",
    reviewsLabel: "reviews on Google",
    reviewTag: "Google review",
    testimonials: [
      { quote: "They told us the real price from day one. We sold without dropping below our expectations.", name: "Marta R.", initials: "MR", tag: "Sold her flat in Vilanova" },
      { quote: "What I value most is that I always spoke to the same person. No explaining your case over and over.", name: "Jordi & Anna", initials: "JA", tag: "Sold their house in Cunit" },
      { quote: "Total transparency with the paperwork and the negotiation. I felt supported all the way to signing.", name: "Carmen P.", initials: "CP", tag: "Sold her penthouse in Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Let's talk",
    title: "Tell us your case and we'll tell you how we'd help",
    sub: "Whether you want to sell now or you're just weighing it up, this commits you to nothing. You leave your details, we understand your situation and we tell you — honestly — what we'd do with your home.",
    bullets: [
      "A reply within 24 working hours.",
      "A real advisor, not a form that gets lost.",
      "No commitment, no pressure and no spam.",
    ],
    otherLabel: "Prefer another way?",
    valoracion: "Instant online valuation",
  },
  form: {
    situationLegend: "Where are you right now?",
    situations: [
      { key: "ahora", label: "I want to sell now", hint: "I'm ready to go to market" },
      { key: "meses", label: "In the coming months", hint: "I'm considering it short-term" },
      { key: "explorando", label: "Just exploring", hint: "I haven't decided yet" },
      { key: "en_venta", label: "It's already listed", hint: "With another agency or on my own" },
    ],
    name: "Name",
    namePh: "What's your name?",
    phone: "Phone",
    phonePh: "Where can we call you?",
    email: "Email",
    emailPh: "We'll only use it to get in touch. No spam.",
    zone: "Town",
    zonePh: "Where's the property located?",
    priceLabel: "What price do you have in mind?",
    pricePh: "E.g. €350,000 (optional)",
    message: "Message",
    messagePh: "Tell us a bit about your home or how we can help.",
    optional: "(optional)",
    submit: "I'd like you to contact me",
    sending: "Sending…",
    next: "Next",
    back: "Back",
    thanks: "Thanks, {name}!",
    waContact: "Hi 👋 I'm {name}. I've just filled in the form on your website to sell my home. My phone: {phone}.",
    consent: "By submitting you accept our ",
    consentLink: "privacy policy",
    consentAfter: ". We don't share your data or fill your inbox with spam.",
    consentCheck: "I have read and accept the",
    error: "Couldn't send. Try again or email us at ",
    okTitle: "Received. Thank you.",
    okText: "One of us —a real person, not a bot— will call you within 24 working hours to learn about your case. If you prefer, message us right now on WhatsApp.",
    whatsappCta: "Ping us on WhatsApp",
    whatsappText: "Hi 👋 I've just filled in the form on your website to sell my home. Here's my contact via WhatsApp too.",
  },
  footer: { legal: "Legal notice", privacy: "Privacy", cookies: "Cookies" },
};

const fr: VenderCopy = {
  navCta: "Estimation gratuite",
  floatingCta: "Combien vaut votre maison ?",
  langLabel: "Langue",
  trust: {
    google: "sur Google",
    reviews: "avis",
    price: "Prix réel du marché, pas des estimations pour vous capter",
    advisor: "Un seul conseiller, de l'estimation à la signature",
    report: "Reportage photo professionnel inclus",
    noStrings: "Sans exclusivités éternelles ni petites lignes",
    zones: "Garraf, Penedès, Baix Llobregat, Barcelonès, Baix Empordà, Tarragonès… partout où vous nous appelez",
    ownersPrefix: "Plus de 450 familles accompagnées",
  },
  hero: {
    eyebrow: "Vendre avec The Vila Home",
    titleA: "Bien vendre votre maison,\nce n'est pas de la chance.",
    titleB: "C'est le savoir-faire.",
    sub: "Nous ne travaillons pas avec des promesses impossibles ni des estimations gonflées pour décrocher une signature. Nous préférons expliquer les choses telles qu'elles sont, vous aider à prendre de bonnes décisions et vous accompagner jusqu'au jour de l'acte.",
    ctaPrimary: "Demander une estimation gratuite",
    ctaSecondary: "Parler à un conseiller",
    teamLabel: "Votre équipe chez The Vila Home",
    inGoogle: "sur Google",
    ownersLabel: "familles accompagnées",
    since: "depuis",
    reach: "Du Garraf au Baix Empordà — partout où vous nous appelez",
  },
  antiCliche: {
    eyebrow: "Soyons clairs",
    title: "Nous ne sommes peut-être pas votre agence.",
    sub: "Nous travaillons d'une manière bien précise, et nous le disons clairement dès le départ : ça ne convient pas à tout le monde. Mais si c'est ce que vous cherchez, nous sommes votre équipe.",
    oldTitle: "La vente comme d'habitude",
    ourTitle: "Comment nous le faisons",
    oldWay: [
      "Votre maison sur quarante portails à la fois, avec la première photo venue.",
      "Le panneau de trois autres agences accroché au même balcon.",
      "Un prix gonflé pour vous capter et, des semaines plus tard, « il faut baisser ».",
      "Un numéro différent chaque fois que vous appelez pour demander.",
      "Des visites de n'importe qui, sans filtre, vous vidant la maison chaque après-midi.",
      "Et vous, à courir après une information que personne ne vous donne vraiment.",
    ],
    ourWay: [
      "Une maison à la fois, traitée comme si c'était la seule.",
      "Un reportage professionnel et une annonce écrite à la main, pas copiée.",
      "Un prix réel dès le premier jour, avec données et comparables.",
      "Le même conseiller du début à la fin. Vous savez toujours à qui vous parlez.",
      "Des acheteurs qualifiés avant d'ouvrir votre porte.",
      "Des rapports clairs : vous savez à tout moment où en est votre vente.",
    ],
  },
  method: {
    eyebrow: "Comment nous travaillons",
    title: "Notre façon de faire, étape par étape",
    sub: "Nous ne cachons pas le processus, nous le montrons. Six phases, un seul conseiller, et à chacune : ce que nous faisons et ce que vous y gagnez.",
    doLabel: "Ce que nous faisons",
    youLabel: "Ce que vous y gagnez",
    steps: [
      {
        title: "Estimation honnête",
        do_: "Nous étudions votre bien et les ventes réelles de votre secteur — pas les prix d'annonce — et vous donnons une fourchette avec données et comparables sur la table.",
        you: "Vous arrivez sur le marché avec un prix qui tient. Ni gonflé pour vous capter, ni bas pour vendre vite à vos dépens.",
      },
      {
        title: "Préparation et mise en valeur",
        do_: "Nous vérifions les documents (note simple, certificat d'habitabilité, DPE) et préparons la maison pour qu'elle se montre sous son meilleur jour.",
        you: "Vous abordez les visites avec tout en règle et une maison qui séduit, au lieu de faire fuir.",
      },
      {
        title: "Reportage professionnel",
        do_: "Photographie, plan et — quand cela ajoute de la valeur — vidéo et visite virtuelle. Votre maison est présentée comme un produit, pas comme une petite annonce de plus.",
        you: "Vous vous démarquez parmi des centaines d'annonces grises. La première impression décide s'il y a visite.",
      },
      {
        title: "Diffusion sélective",
        do_: "Nous publions sur les portails et réseaux qui font vraiment bouger votre acheteur, avec une annonce soignée et une campagne réfléchie.",
        you: "Le bon acheteur se présente, pas mille curieux. Moins de bruit et de meilleures visites.",
      },
      {
        title: "Filtrage, visites et négociation",
        do_: "Nous qualifions chaque intéressé avant d'ouvrir votre porte, gérons les visites et négocions chaque offre en votre faveur.",
        you: "Vous ne perdez pas d'après-midis avec ceux qui ne peuvent pas acheter. Et vous concluez aux meilleures conditions, pas seulement les plus rapides.",
      },
      {
        title: "Compromis, notaire et remise",
        do_: "Nous préparons le compromis, coordonnons avec le notaire et la banque et vous accompagnons jusqu'à la remise des clés.",
        you: "Vous arrivez à la signature sans surprises ni papiers en suspens. Du début à la fin, la même personne.",
      },
    ],
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Comment nous montrons votre maison au monde",
    sub: "Vendre, ce n'est pas publier et attendre. C'est présenter votre maison comme un produit et la mettre devant ceux qui la cherchent vraiment. Voici ce que nous faisons pour chaque bien :",
    showcase: [
      { title: "Photographie professionnelle", text: "Vraie lumière, cadrage et retouche. L'image qui décide s'il y a un clic." },
      { title: "Vidéo et visite virtuelle 360º", text: "Votre maison se visite depuis le canapé. Moins de visites froides, plus de visites utiles." },
      { title: "Plan coté", text: "L'acheteur comprend la distribution d'un coup d'œil et s'y projette." },
      { title: "Home staging et mise au point", text: "Nous préparons les espaces pour qu'ils se montrent sous leur meilleur jour." },
      { title: "Annonce écrite à la main", text: "Un texte qui raconte la maison, pas quatre données copiées-collées." },
      { title: "Photographie aérienne par drone", text: "Quand l'environnement ajoute de la valeur — mer, montagne, terrain —, nous le montrons du ciel." },
    ],
    channelsLabel: "Et nous la diffusons là où est votre acheteur",
    channels: ["Idealista", "Fotocasa", "Habitaclia", "Site web", "Instagram", "TikTok", "Base d'acheteurs", "Email aux intéressés"],
    badge: "En exclusivité",
    mockCaption: "Votre maison, racontée avec soin",
    tags: ["Photo pro", "Plan", "Visite 360º"],
    reelViews: "vues",
    reelComments: "commentaires",
    reelCaption: "Et sur les réseaux, votre maison bouge vraiment.",
  },
  tour: {
    eyebrow: "Technologie",
    title: "Parcourez la maison en 3D, comme si vous y étiez",
    sub: "Chaque bien avec une visite virtuelle navigable et un plan en 3D : l'acheteur la parcourt entièrement depuis le canapé, à toute heure, et arrive à la visite déjà convaincu. Moins de visites froides, plus d'offres réelles.",
    cta: "Bougez la souris pour explorer",
    note: "Visite d'exemple — bientôt, celles de vos biens.",
  },
  includes: {
    eyebrow: "Ce qui est inclus",
    title: "Tout ce que nous mettons de notre côté",
    items: [
      { title: "Un prix réel, pas un appât", text: "La valeur de marché avec données et comparables. Jamais un prix gonflé juste pour décrocher le mandat." },
      { title: "Un conseiller, tout le parcours", text: "La même personne de l'estimation à la signature. Ni call centers, ni répéter votre cas encore et encore." },
      { title: "Un reportage qui vend", text: "Photographie professionnelle, plan et vidéo quand cela ajoute de la valeur. Votre maison présentée comme elle le mérite, sans coût supplémentaire." },
      { title: "Une diffusion réfléchie", text: "Sur les canaux qui font bouger votre acheteur, avec une annonce soignée. Pas de spam sur quarante portails." },
      { title: "Des comptes clairs", text: "Rapports de visites et d'intérêt réel, sans jargon. Vous savez ce qui se passe avec votre maison à chaque instant." },
      { title: "Paperasse réglée", text: "Certificat d'habitabilité, diagnostics, notes simples, compromis et notaire. C'est nous qui courons après les papiers, pas vous." },
    ],
  },
  team: {
    eyebrow: "Qui le fait",
    title: "Des personnes, pas un numéro de dossier",
    sub: "Quand vous vendez avec nous, vous ne parlez pas à un call center. Nous sommes trois, nous vous connaissons par votre nom et nous répondons de votre maison du début à la fin.",
    roles: ["Responsable d'équipe · Conseillère immobilière", "Conseillère immobilière", "Fondateur · Direction & Marketing"],
    rolesShort: ["Responsable d'équipe", "Conseillère immobilière", "Fondateur"],
    moreText: "Envie d'en savoir plus sur nous ?",
    moreLink: "Rencontrer l'équipe",
  },
  honesty: {
    eyebrow: "Notre façon de travailler",
    quote: "Nous préférons perdre un mandat plutôt que de vous promettre ce que nous ne pouvons pas tenir.",
    points: [
      "Nous vous disons le prix réel, même quand ce n'est pas ce que vous espériez entendre.",
      "Si nous ne sommes pas la meilleure option pour votre cas, nous vous le disons.",
      "Nous travaillons surtout en exclusivité — pour nous investir pleinement dans votre maison —, mais sans vous lier à des clauses éternelles.",
      "Des rapports clairs du début à la fin : vous savez toujours où en est votre vente.",
    ],
  },
  social: {
    eyebrow: "Ce que disent les propriétaires",
    title: "Vendues en toute tranquillité",
    reviewsLabel: "avis sur Google",
    reviewTag: "Avis Google",
    testimonials: [
      { quote: "Ils nous ont dit le prix réel dès le premier jour. Nous avons vendu sans descendre sous nos attentes.", name: "Marta R.", initials: "MR", tag: "A vendu son appartement à Vilanova" },
      { quote: "Ce que j'apprécie le plus, c'est d'avoir toujours parlé à la même personne. Pas besoin de répéter mon cas encore et encore.", name: "Jordi & Anna", initials: "JA", tag: "Ont vendu leur maison à Cunit" },
      { quote: "Transparence totale sur les documents et la négociation. Je me suis sentie accompagnée jusqu'à la signature.", name: "Carmen P.", initials: "CP", tag: "A vendu son attique à Cubelles" },
    ],
  },
  contact: {
    eyebrow: "Parlons-en",
    title: "Racontez-nous votre cas et nous vous dirons comment nous aiderions",
    sub: "Que vous vouliez vendre maintenant ou que vous y réfléchissiez encore, cela ne vous engage à rien. Vous laissez vos coordonnées, nous comprenons votre situation et nous vous disons — en toute honnêteté — ce que nous ferions de votre maison.",
    bullets: [
      "Une réponse en moins de 24 h ouvrées.",
      "Un vrai conseiller, pas un formulaire qui se perd.",
      "Sans engagement, sans pression et sans spam.",
    ],
    otherLabel: "Vous préférez une autre voie ?",
    valoracion: "Estimation en ligne instantanée",
  },
  form: {
    situationLegend: "Où en êtes-vous ?",
    situations: [
      { key: "ahora", label: "Je veux vendre maintenant", hint: "Je suis prêt à aller sur le marché" },
      { key: "meses", label: "Dans les prochains mois", hint: "J'y pense à court terme" },
      { key: "explorando", label: "Je me renseigne seulement", hint: "Je n'ai pas encore décidé" },
      { key: "en_venta", label: "C'est déjà en vente", hint: "Avec une autre agence ou par moi-même" },
    ],
    name: "Nom",
    namePh: "Comment vous appelez-vous ?",
    phone: "Téléphone",
    phonePh: "Où pouvons-nous vous appeler ?",
    email: "E-mail",
    emailPh: "Uniquement pour vous contacter. Aucune pub.",
    zone: "Ville",
    zonePh: "Où se trouve le bien ?",
    priceLabel: "Quel prix avez-vous en tête ?",
    pricePh: "Ex. : 350 000 € (facultatif)",
    message: "Message",
    messagePh: "Parlez-nous un peu de votre bien ou de ce dont vous avez besoin.",
    optional: "(facultatif)",
    submit: "Je souhaite être contacté",
    sending: "Envoi…",
    next: "Suivant",
    back: "Retour",
    thanks: "Merci, {name} !",
    waContact: "Bonjour 👋 Je suis {name}. Je viens de remplir le formulaire de votre site pour vendre mon logement. Mon téléphone : {phone}.",
    consent: "En envoyant, vous acceptez notre ",
    consentLink: "politique de confidentialité",
    consentAfter: ". Nous ne partageons pas vos données et n'inondons pas votre boîte de spam.",
    consentCheck: "J'ai lu et j'accepte la",
    error: "Envoi impossible. Réessayez ou écrivez-nous à ",
    okTitle: "Bien reçu. Merci.",
    okText: "L'un de nous —une personne, pas un robot— vous appellera sous 24 heures ouvrées pour comprendre votre situation. Si vous préférez, écrivez-nous maintenant sur WhatsApp.",
    whatsappCta: "Prévenez-nous sur WhatsApp",
    whatsappText: "Bonjour 👋 Je viens de remplir le formulaire sur votre site pour vendre ma maison. Voici aussi mon contact par WhatsApp.",
  },
  footer: { legal: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies" },
};

export const venderContent: Record<Lang, VenderCopy> = { es, ca, en, fr };
