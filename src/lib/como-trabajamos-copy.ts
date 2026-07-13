import type { Lang } from "@/lib/i18n";

/* ─────────────────────────────────────────────────────────────────────
   FUENTE ÚNICA DE COPY de la landing /como-trabajamos (4 idiomas).
   Landing de persuasión para PROPIETARIOS: enseña la producción completa
   (fotografía, vídeo, plano 3D, tour virtual, difusión) con la que
   trabajamos cada vivienda. Todo el texto vive aquí; el componente importa
   COMO_COPY[lang]. Cada idioma tiene su propia ruta:
     es → /como-trabajamos   ·   ca → /com-treballem
     en → /how-we-work       ·   fr → /notre-methode
   Los campos NO-texto (ids de ancla, rutas de imagen, URL de Matterport,
   nombres propios, marcas de portales) son idénticos en los 4 idiomas.
   Tono TVH: editorial, frases cortas, sin clichés ni cifras inventadas.
   ───────────────────────────────────────────────────────────────────── */

const MATTERPORT = "https://my.matterport.com/show/?m=zeLdy8k2NEZ&play=1&qs=1&brand=0&mls=1";

const es = {
  nav: { cta: "Hablemos" },

  hero: {
    eyebrow: "Cómo trabajamos",
    titleLead: "Tu casa solo se vende una vez.",
    titleSub: "Por eso cuidamos cada paso, del primer detalle hasta la firma.",
    cta: "Hablemos",
    scrollHint: "Baja para verlo todo",
    inGoogle: "en Google",
  },

  indice: {
    eyebrow: "El método",
    title: "Cinco pasos. Un único objetivo: vender tu casa como se merece.",
    chapters: [
      { n: "01", id: "fotografia", label: "Fotografía", sub: "La primera impresión, cuidada al detalle", preview: "/images/vender/salon-bien-2.jpg" },
      { n: "02", id: "video", label: "Vídeo", sub: "Pensado para detener el dedo", preview: "/images/vender/jardin-2.jpg" },
      { n: "03", id: "plano", label: "Plano 3D", sub: "Tu casa, entendida de un vistazo", preview: "/images/vender/plano-3d.jpg" },
      { n: "04", id: "tour", label: "Tour virtual", sub: "Abierta 24 horas, sin visitas de más", preview: "/images/vender/comedor-bien-2.jpg" },
      { n: "05", id: "difusion", label: "Difusión", sub: "Salimos a buscar al comprador", preview: "/images/vender/vista-2.jpg" },
    ],
  },

  intro: {
    lines: ["La mayoría de anuncios se preparan en una tarde.", "El tuyo va a competir contra todos ellos."],
    strong: "Por eso, antes de publicarla, preparamos cada detalle.",
  },

  foto: {
    n: "01",
    kicker: "Fotografía",
    title: "La primera visita ocurre en una pantalla.",
    body: [
      "En unos segundos, el comprador decide si tu casa merece su atención. Antes de leer los metros. Antes de mirar el precio.",
      "Un reportaje profesional no hace que tu casa parezca otra: hace visible lo que ya tiene.",
    ],
    hint: "Arrastra para comparar",
    labelBefore: "Antes",
    labelAfter: "Después",
    pairs: [
      { room: "El comedor", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien-2.jpg" },
      { room: "El salón", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien-2.jpg" },
      { room: "El porche", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien-2.jpg" },
      { room: "La terraza", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien-2.jpg" },
    ],
  },

  video: {
    n: "02",
    kicker: "Vídeo",
    title: "Hay casas que se miran. Y casas que se recuerdan.",
    body: [
      "Hoy las casas no solo se buscan en portales: se descubren deslizando. Grabamos cada vivienda como una pieza propia, pensada para ese momento.",
      "El objetivo no es acumular visualizaciones. Es que la persona adecuada deje de pasar.",
    ],
    note: "Vídeo real de una vivienda nuestra.",
    playCta: "Ver el vídeo",
    src: "/images/vender/reel.mp4",
    poster: "/images/vender/jardin-2.jpg",
  },

  plano: {
    n: "03",
    kicker: "Plano 3D",
    title: "Nadie compra lo que no entiende.",
    body: [
      "Las fotos enseñan cómo es cada estancia. El plano las conecta: de un vistazo se entiende la distribución, por dónde se pasa y cómo encaja todo.",
      "Es la diferencia entre gustar y encajar.",
    ],
    note: "Plano 3D de distribución de una vivienda nuestra.",
    img: "/images/vender/plano-3d.jpg",
  },

  tour: {
    n: "04",
    kicker: "Tour virtual",
    title: "Tu casa, abierta 24 horas. Sin que entre nadie.",
    body: [
      "Tu casa está disponible las 24 horas, desde cualquier lugar.",
      "El comprador puede recorrerla a su ritmo, volver atrás, detenerse en cada detalle y decidir si realmente encaja con lo que está buscando.",
      "Cuando pide una visita, normalmente ya no viene a descubrirla. Viene a confirmar que es la vivienda que había imaginado.",
    ],
    note: "Tour real. Arrástralo y recórrelo tú mismo.",
    activate: "Toca para explorar",
    matterport: MATTERPORT,
  },

  difusion: {
    n: "05",
    kicker: "Difusión",
    title: "Publicar es fácil. Llegar es otra cosa.",
    body: [
      "Todo este material no se queda esperando en un portal. Lo movemos donde el comprador mira cada día: portales, campañas, redes sociales y nuestra propia base de compradores.",
      "Y no lo enseñamos a cualquiera: con campañas segmentadas, lo ponemos delante de quien de verdad puede comprar tu casa.",
      "No esperamos a que aparezca. Salimos a buscarlo.",
    ],
    channels: [
      { src: "/images/portales/idealista.svg", alt: "Idealista" },
      { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
      { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
      { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
      { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
      // Variante solo-wordmark (sin el badge oscuro): aquí los logos van en
      // blanco (brightness-0 invert) sobre fondo oscuro y con el original el
      // badge se convertía en un bloque blanco. El .svg original se conserva
      // para /vender y /vende-tu-casa (fondo claro).
      { src: "/images/portales/luxuryestate-white.svg", alt: "Luxury Estate" },
      { src: "/images/portales/properstar.svg", alt: "Properstar" },
      { src: "/images/portales/instagram.svg", alt: "Instagram" },
      { src: "/images/portales/facebook.svg", alt: "Facebook" },
      { src: "/images/portales/tiktok.svg", alt: "TikTok" },
    ],
  },

  /* Coda tras el paso 05 — NO es un sexto paso: responde «¿y después del
     anuncio?» (documentación y acompañamiento) en media pantalla. */
  coda: {
    eyebrow: "Y después del anuncio",
    title: "El anuncio es solo la mitad del trabajo.",
    items: [
      { t: "Documentación", d: "La revisamos y la dejamos al día antes de salir al mercado, para que nada frene la venta a mitad de camino." },
      { t: "Negociación", d: "Cada oferta se analiza contigo, con calma y con números. Y se defiende con criterio." },
      { t: "Hasta la firma", d: "Visitas, plazos, notaría. Te acompañamos hasta el día de entregar las llaves." },
    ],
  },

  diferencia: {
    eyebrow: "La diferencia",
    titleMuted: "Lo habitual,",
    titleRest: "y lo nuestro.",
    colHabitual: "Lo habitual",
    colNuestro: "Con nosotros",
    rows: [
      { habitual: "Fotos sin editar, subidas tal cual", nuestro: "Un reportaje editado de cada estancia" },
      { habitual: "Un texto copiado de otro anuncio", nuestro: "Un vídeo pensado para detener el dedo" },
      { habitual: "La distribución, a ojo", nuestro: "Un plano 3D con la distribución real" },
      { habitual: "«Mejor venga a verlo»", nuestro: "Un tour virtual abierto las 24 horas" },
      { habitual: "Publicar y esperar", nuestro: "Campañas y redes para salir a buscar al comprador" },
    ],
    outro: "Nada de esto es un pack especial ni una promesa de folleto. Es, simplemente, cómo trabajamos.",
  },

  resenas: {
    eyebrow: "Lo que dicen quienes ya vendieron",
    googleLabel: "Opiniones reales en Google",
    readMore: "Leer más",
    readLess: "Leer menos",
    items: [
      { quote: "Desde el primer día se notó que no son una inmobiliaria más: trato súper cercano, comunicación clara y una forma de trabajar nada común hoy día. El reportaje de la vivienda fue espectacular y marcó la diferencia.", name: "Noelia Nieto", tag: "Reseña en Google" },
      { quote: "He lidiado con varias inmobiliarias a la vez y de verdad que la diferencia es abismal. Trabajan de forma honesta, con empatía y mucha profesionalidad. Nos hemos sentido acompañados en todo momento.", name: "Yolee Seth", tag: "Reseña en Google" },
      { quote: "El trato fue muy profesional y cercano durante todo el proceso de venta de nuestro piso. Ari fue especialmente amable, siempre atenta y dispuesta a ayudarnos.", name: "Patricia Reyes", tag: "Reseña en Google" },
      { quote: "Ha sido un privilegio contar con ellos para la venta de mi piso. Son súper profesionales y facilitan todo. Recomiendo al 100%: trato cercano y transparente.", name: "Laura Cano", tag: "Reseña en Google" },
      { quote: "Ariadna es súper amable, rápida y conoce mucho todo el proceso. Me sentí súper tranquila de tener a alguien con su experiencia que me asesore. Recomiendo mucho el servicio.", name: "Carmela Castellanos", tag: "Reseña en Google" },
      { quote: "Grans professionals i millors persones. La seva gestió ha estat impecable.", name: "Jordi Pons", tag: "Reseña en Google" },
    ],
  },

  cierre: {
    title: "Ahora ya sabes cómo trabajamos.",
    sub: "Solo falta tu casa.",
    body: "Cuéntanos tu caso y te explicaremos, con total transparencia, cómo enfocaríamos la venta de tu vivienda.",
    submitLabel: "Hablemos",
  },

  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
};

export type ComoCopy = typeof es;

/* ── Català ─────────────────────────────────────────────────────────── */
const ca: ComoCopy = {
  nav: { cta: "Parlem-ne" },

  hero: {
    eyebrow: "Com treballem",
    titleLead: "La teva casa només es ven un cop.",
    titleSub: "Per això cuidem cada pas, del primer detall fins a la signatura.",
    cta: "Parlem-ne",
    scrollHint: "Baixa per veure-ho tot",
    inGoogle: "a Google",
  },

  indice: {
    eyebrow: "El mètode",
    title: "Cinc passos. Un únic objectiu: vendre la teva casa com es mereix.",
    chapters: [
      { n: "01", id: "fotografia", label: "Fotografia", sub: "La primera impressió, cuidada al detall", preview: "/images/vender/salon-bien-2.jpg" },
      { n: "02", id: "video", label: "Vídeo", sub: "Pensat per aturar el dit", preview: "/images/vender/jardin-2.jpg" },
      { n: "03", id: "plano", label: "Plànol 3D", sub: "La teva casa, entesa d'un cop d'ull", preview: "/images/vender/plano-3d.jpg" },
      { n: "04", id: "tour", label: "Tour virtual", sub: "Oberta 24 hores, sense visites de més", preview: "/images/vender/comedor-bien-2.jpg" },
      { n: "05", id: "difusion", label: "Difusió", sub: "Sortim a buscar el comprador", preview: "/images/vender/vista-2.jpg" },
    ],
  },

  intro: {
    lines: ["La majoria d'anuncis es preparen en una tarda.", "El teu competirà contra tots ells."],
    strong: "Per això, abans de publicar-la, preparem cada detall.",
  },

  foto: {
    n: "01",
    kicker: "Fotografia",
    title: "La primera visita passa en una pantalla.",
    body: [
      "En uns segons, el comprador decideix si la teva casa mereix la seva atenció. Abans de llegir els metres. Abans de mirar el preu.",
      "Un reportatge professional no fa que la teva casa sembli una altra: fa visible el que ja té.",
    ],
    hint: "Arrossega per comparar",
    labelBefore: "Abans",
    labelAfter: "Després",
    pairs: [
      { room: "El menjador", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien-2.jpg" },
      { room: "La sala d'estar", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien-2.jpg" },
      { room: "El porxo", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien-2.jpg" },
      { room: "La terrassa", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien-2.jpg" },
    ],
  },

  video: {
    n: "02",
    kicker: "Vídeo",
    title: "Hi ha cases que es miren. I cases que es recorden.",
    body: [
      "Avui les cases no només es busquen als portals: es descobreixen lliscant. Gravem cada habitatge com una peça pròpia, pensada per a aquell moment.",
      "L'objectiu no és acumular visualitzacions. És que la persona adequada deixi de passar.",
    ],
    note: "Vídeo real d'un habitatge nostre.",
    playCta: "Veure el vídeo",
    src: "/images/vender/reel.mp4",
    poster: "/images/vender/jardin-2.jpg",
  },

  plano: {
    n: "03",
    kicker: "Plànol 3D",
    title: "Ningú compra el que no entén.",
    body: [
      "Les fotos ensenyen com és cada estança. El plànol les connecta: d'un cop d'ull s'entén la distribució, per on es passa i com encaixa tot.",
      "És la diferència entre agradar i encaixar.",
    ],
    note: "Plànol 3D de distribució d'un habitatge nostre.",
    img: "/images/vender/plano-3d.jpg",
  },

  tour: {
    n: "04",
    kicker: "Tour virtual",
    title: "La teva casa, oberta 24 hores. Sense que hi entri ningú.",
    body: [
      "La teva casa està disponible les 24 hores, des de qualsevol lloc.",
      "El comprador pot recórrer-la al seu ritme, tornar enrere, aturar-se en cada detall i decidir si realment encaixa amb el que està buscant.",
      "Quan demana una visita, normalment ja no ve a descobrir-la. Ve a confirmar que és l'habitatge que havia imaginat.",
    ],
    note: "Tour real. Arrossega'l i recorre'l tu mateix.",
    activate: "Toca per explorar",
    matterport: MATTERPORT,
  },

  difusion: {
    n: "05",
    kicker: "Difusió",
    title: "Publicar és fàcil. Arribar és una altra cosa.",
    body: [
      "Tot aquest material no es queda esperant en un portal. El movem allà on el comprador mira cada dia: portals, campanyes, xarxes socials i la nostra pròpia base de compradors.",
      "I no l'ensenyem a qualsevol: amb campanyes segmentades, el posem davant de qui de debò pot comprar la teva casa.",
      "No esperem que aparegui. Sortim a buscar-lo.",
    ],
    channels: [
      { src: "/images/portales/idealista.svg", alt: "Idealista" },
      { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
      { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
      { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
      { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
      { src: "/images/portales/luxuryestate-white.svg", alt: "Luxury Estate" },
      { src: "/images/portales/properstar.svg", alt: "Properstar" },
      { src: "/images/portales/instagram.svg", alt: "Instagram" },
      { src: "/images/portales/facebook.svg", alt: "Facebook" },
      { src: "/images/portales/tiktok.svg", alt: "TikTok" },
    ],
  },

  coda: {
    eyebrow: "I després de l'anunci",
    title: "L'anunci és només la meitat de la feina.",
    items: [
      { t: "Documentació", d: "La revisem i la deixem al dia abans de sortir al mercat, perquè res no freni la venda a mig camí." },
      { t: "Negociació", d: "Cada oferta s'analitza amb tu, amb calma i amb números. I es defensa amb criteri." },
      { t: "Fins a la signatura", d: "Visites, terminis, notaria. T'acompanyem fins al dia de lliurar les claus." },
    ],
  },

  diferencia: {
    eyebrow: "La diferència",
    titleMuted: "El que és habitual,",
    titleRest: "i el que fem nosaltres.",
    colHabitual: "El que és habitual",
    colNuestro: "Amb nosaltres",
    rows: [
      { habitual: "Fotos sense editar, pujades tal qual", nuestro: "Un reportatge editat de cada estança" },
      { habitual: "Un text copiat d'un altre anunci", nuestro: "Un vídeo pensat per aturar el dit" },
      { habitual: "La distribució, a ull", nuestro: "Un plànol 3D amb la distribució real" },
      { habitual: "«Millor que vingui a veure-ho»", nuestro: "Un tour virtual obert les 24 hores" },
      { habitual: "Publicar i esperar", nuestro: "Campanyes i xarxes per sortir a buscar el comprador" },
    ],
    outro: "Res d'això és un pack especial ni una promesa de fullet. És, simplement, com treballem.",
  },

  resenas: {
    eyebrow: "El que diuen els qui ja han venut",
    googleLabel: "Opinions reals a Google",
    readMore: "Llegir més",
    readLess: "Llegir menys",
    items: [
      { quote: "Des del primer dia es va notar que no són una immobiliària més: tracte súper proper, comunicació clara i una manera de treballar gens habitual avui dia. El reportatge de l'habitatge va ser espectacular i va marcar la diferència.", name: "Noelia Nieto", tag: "Ressenya a Google" },
      { quote: "He tractat amb diverses immobiliàries alhora i de debò que la diferència és abismal. Treballen de manera honesta, amb empatia i molta professionalitat. Ens hem sentit acompanyats en tot moment.", name: "Yolee Seth", tag: "Ressenya a Google" },
      { quote: "El tracte va ser molt professional i proper durant tot el procés de venda del nostre pis. L'Ari va ser especialment amable, sempre atenta i disposada a ajudar-nos.", name: "Patricia Reyes", tag: "Ressenya a Google" },
      { quote: "Ha estat un privilegi comptar amb ells per a la venda del meu pis. Són súper professionals i ho faciliten tot. Els recomano al 100%: tracte proper i transparent.", name: "Laura Cano", tag: "Ressenya a Google" },
      { quote: "L'Ariadna és súper amable, ràpida i coneix molt tot el procés. Em vaig sentir súper tranquil·la de tenir algú amb la seva experiència que m'assessorés. Recomano molt el servei.", name: "Carmela Castellanos", tag: "Ressenya a Google" },
      { quote: "Grans professionals i millors persones. La seva gestió ha estat impecable.", name: "Jordi Pons", tag: "Ressenya a Google" },
    ],
  },

  cierre: {
    title: "Ara ja saps com treballem.",
    sub: "Només falta la teva casa.",
    body: "Explica'ns el teu cas i t'explicarem, amb total transparència, com enfocaríem la venda del teu habitatge.",
    submitLabel: "Parlem-ne",
  },

  footer: { legal: "Avís legal", privacy: "Privacitat", cookies: "Cookies" },
};

/* ── English ────────────────────────────────────────────────────────── */
const en: ComoCopy = {
  nav: { cta: "Let's talk" },

  hero: {
    eyebrow: "How we work",
    titleLead: "Your home only sells once.",
    titleSub: "That's why we care for every step, from the first detail to the signing.",
    cta: "Let's talk",
    scrollHint: "Scroll to see it all",
    inGoogle: "on Google",
  },

  indice: {
    eyebrow: "The method",
    title: "Five steps. One goal: to sell your home the way it deserves.",
    chapters: [
      { n: "01", id: "fotografia", label: "Photography", sub: "The first impression, cared for down to the detail", preview: "/images/vender/salon-bien-2.jpg" },
      { n: "02", id: "video", label: "Video", sub: "Made to stop the scroll", preview: "/images/vender/jardin-2.jpg" },
      { n: "03", id: "plano", label: "3D floor plan", sub: "Your home, understood at a glance", preview: "/images/vender/plano-3d.jpg" },
      { n: "04", id: "tour", label: "Virtual tour", sub: "Open around the clock, without the extra visits", preview: "/images/vender/comedor-bien-2.jpg" },
      { n: "05", id: "difusion", label: "Reach", sub: "We go out and find the buyer", preview: "/images/vender/vista-2.jpg" },
    ],
  },

  intro: {
    lines: ["Most listings are put together in an afternoon.", "Yours will compete against every one of them."],
    strong: "So before it goes live, we prepare every detail.",
  },

  foto: {
    n: "01",
    kicker: "Photography",
    title: "The first visit happens on a screen.",
    body: [
      "In a few seconds, the buyer decides whether your home deserves their attention. Before reading the square metres. Before looking at the price.",
      "A professional shoot doesn't make your home look like a different one: it makes visible what's already there.",
    ],
    hint: "Drag to compare",
    labelBefore: "Before",
    labelAfter: "After",
    pairs: [
      { room: "The dining room", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien-2.jpg" },
      { room: "The living room", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien-2.jpg" },
      { room: "The porch", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien-2.jpg" },
      { room: "The terrace", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien-2.jpg" },
    ],
  },

  video: {
    n: "02",
    kicker: "Video",
    title: "Some homes are looked at. Others are remembered.",
    body: [
      "Today, homes aren't only searched for on portals: they're discovered mid-scroll. We film each home as a piece of its own, made for that moment.",
      "The goal isn't to rack up views. It's for the right person to stop scrolling.",
    ],
    note: "Real video of one of our homes.",
    playCta: "Watch the video",
    src: "/images/vender/reel.mp4",
    poster: "/images/vender/jardin-2.jpg",
  },

  plano: {
    n: "03",
    kicker: "3D floor plan",
    title: "No one buys what they don't understand.",
    body: [
      "Photos show what each room looks like. The floor plan connects them: at a glance you understand the layout, how you move through it and how it all fits together.",
      "It's the difference between liking a home and knowing it fits.",
    ],
    note: "3D layout plan of one of our homes.",
    img: "/images/vender/plano-3d.jpg",
  },

  tour: {
    n: "04",
    kicker: "Virtual tour",
    title: "Your home, open around the clock. Without anyone walking in.",
    body: [
      "Your home is available 24 hours a day, from anywhere.",
      "The buyer can walk through it at their own pace, go back, pause on every detail and decide whether it really fits what they're looking for.",
      "By the time they ask to visit, they're usually not coming to discover it. They're coming to confirm it's the home they had imagined.",
    ],
    note: "A real tour. Drag it and walk through it yourself.",
    activate: "Tap to explore",
    matterport: MATTERPORT,
  },

  difusion: {
    n: "05",
    kicker: "Reach",
    title: "Publishing is easy. Reaching is another thing.",
    body: [
      "None of this material sits waiting on a portal. We move it to where the buyer looks every day: portals, campaigns, social media and our own base of buyers.",
      "And we don't show it to just anyone: with targeted campaigns, we put it in front of the people who can genuinely buy your home.",
      "We don't wait for the buyer to appear. We go out and find them.",
    ],
    channels: [
      { src: "/images/portales/idealista.svg", alt: "Idealista" },
      { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
      { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
      { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
      { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
      { src: "/images/portales/luxuryestate-white.svg", alt: "Luxury Estate" },
      { src: "/images/portales/properstar.svg", alt: "Properstar" },
      { src: "/images/portales/instagram.svg", alt: "Instagram" },
      { src: "/images/portales/facebook.svg", alt: "Facebook" },
      { src: "/images/portales/tiktok.svg", alt: "TikTok" },
    ],
  },

  coda: {
    eyebrow: "And after the listing",
    title: "The listing is only half the work.",
    items: [
      { t: "Paperwork", d: "We review it and bring it up to date before going to market, so nothing stalls the sale halfway through." },
      { t: "Negotiation", d: "Every offer is analysed with you, calmly and with the numbers in front of us. And defended with judgement." },
      { t: "All the way to signing", d: "Visits, deadlines, the notary. We're with you until the day you hand over the keys." },
    ],
  },

  diferencia: {
    eyebrow: "The difference",
    titleMuted: "The usual way,",
    titleRest: "and ours.",
    colHabitual: "The usual way",
    colNuestro: "With us",
    rows: [
      { habitual: "Unedited photos, uploaded as they are", nuestro: "An edited shoot of every room" },
      { habitual: "A text copied from another listing", nuestro: "A video made to stop the scroll" },
      { habitual: "The layout, left to guesswork", nuestro: "A 3D plan with the real layout" },
      { habitual: "“Better come and see it”", nuestro: "A virtual tour open around the clock" },
      { habitual: "Publish and wait", nuestro: "Campaigns and social media to go out and find the buyer" },
    ],
    outro: "None of this is a special package or a brochure promise. It's simply how we work.",
  },

  resenas: {
    eyebrow: "What sellers say once they've sold",
    googleLabel: "Real reviews on Google",
    readMore: "Read more",
    readLess: "Read less",
    items: [
      { quote: "From day one you could tell they're not just another agency: a genuinely warm approach, clear communication and a way of working that's rare these days. The photo shoot of the home was spectacular and made all the difference.", name: "Noelia Nieto", tag: "Google review" },
      { quote: "I've dealt with several agencies at once and the difference is honestly night and day. They work with honesty, empathy and real professionalism. We felt supported at every moment.", name: "Yolee Seth", tag: "Google review" },
      { quote: "The service was very professional and personal throughout the whole sale of our flat. Ari was especially kind, always attentive and ready to help us.", name: "Patricia Reyes", tag: "Google review" },
      { quote: "It's been a privilege to have them handle the sale of my flat. They're incredibly professional and make everything easy. I recommend them 100%: warm and transparent throughout.", name: "Laura Cano", tag: "Google review" },
      { quote: "Ariadna is wonderfully kind, quick and knows the whole process inside out. I felt completely at ease having someone with her experience to guide me. I highly recommend the service.", name: "Carmela Castellanos", tag: "Google review" },
      { quote: "Great professionals and even better people. Their handling of everything was flawless.", name: "Jordi Pons", tag: "Google review" },
    ],
  },

  cierre: {
    title: "Now you know how we work.",
    sub: "All that's missing is your home.",
    body: "Tell us about your situation and we'll explain, with total transparency, how we'd approach the sale of your home.",
    submitLabel: "Let's talk",
  },

  footer: { legal: "Legal notice", privacy: "Privacy", cookies: "Cookies" },
};

/* ── Français ───────────────────────────────────────────────────────── */
const fr: ComoCopy = {
  nav: { cta: "Parlons-en" },

  hero: {
    eyebrow: "Comment nous travaillons",
    titleLead: "Votre maison ne se vend qu'une fois.",
    titleSub: "C'est pourquoi nous soignons chaque étape, du premier détail jusqu'à la signature.",
    cta: "Parlons-en",
    scrollHint: "Descendez pour tout découvrir",
    inGoogle: "sur Google",
  },

  indice: {
    eyebrow: "La méthode",
    title: "Cinq étapes. Un seul objectif : vendre votre maison à sa juste valeur.",
    chapters: [
      { n: "01", id: "fotografia", label: "Photographie", sub: "La première impression, soignée dans le moindre détail", preview: "/images/vender/salon-bien-2.jpg" },
      { n: "02", id: "video", label: "Vidéo", sub: "Pensée pour arrêter le pouce", preview: "/images/vender/jardin-2.jpg" },
      { n: "03", id: "plano", label: "Plan 3D", sub: "Votre maison, comprise d'un coup d'œil", preview: "/images/vender/plano-3d.jpg" },
      { n: "04", id: "tour", label: "Visite virtuelle", sub: "Ouverte 24 h sur 24, sans visites superflues", preview: "/images/vender/comedor-bien-2.jpg" },
      { n: "05", id: "difusion", label: "Diffusion", sub: "Nous partons à la recherche de l'acheteur", preview: "/images/vender/vista-2.jpg" },
    ],
  },

  intro: {
    lines: ["La plupart des annonces se préparent en une après-midi.", "La vôtre va les affronter toutes."],
    strong: "C'est pourquoi, avant de la publier, nous soignons chaque détail.",
  },

  foto: {
    n: "01",
    kicker: "Photographie",
    title: "La première visite se passe sur un écran.",
    body: [
      "En quelques secondes, l'acheteur décide si votre maison mérite son attention. Avant de lire les mètres carrés. Avant de regarder le prix.",
      "Un reportage professionnel ne transforme pas votre maison : il rend visible ce qu'elle a déjà.",
    ],
    hint: "Faites glisser pour comparer",
    labelBefore: "Avant",
    labelAfter: "Après",
    pairs: [
      { room: "La salle à manger", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien-2.jpg" },
      { room: "Le salon", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien-2.jpg" },
      { room: "Le porche", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien-2.jpg" },
      { room: "La terrasse", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien-2.jpg" },
    ],
  },

  video: {
    n: "02",
    kicker: "Vidéo",
    title: "Il y a des maisons qu'on regarde. Et des maisons dont on se souvient.",
    body: [
      "Aujourd'hui, les maisons ne se cherchent pas seulement sur les portails : elles se découvrent en faisant défiler. Nous filmons chaque logement comme une pièce à part entière, pensée pour cet instant.",
      "L'objectif n'est pas d'accumuler les vues. C'est que la bonne personne s'arrête.",
    ],
    note: "Vidéo réelle d'un de nos logements.",
    playCta: "Voir la vidéo",
    src: "/images/vender/reel.mp4",
    poster: "/images/vender/jardin-2.jpg",
  },

  plano: {
    n: "03",
    kicker: "Plan 3D",
    title: "Personne n'achète ce qu'il ne comprend pas.",
    body: [
      "Les photos montrent à quoi ressemble chaque pièce. Le plan les relie : d'un coup d'œil, on saisit la distribution, les circulations et la façon dont tout s'articule.",
      "C'est toute la différence entre plaire et s'imposer.",
    ],
    note: "Plan 3D de distribution d'un de nos logements.",
    img: "/images/vender/plano-3d.jpg",
  },

  tour: {
    n: "04",
    kicker: "Visite virtuelle",
    title: "Votre maison, ouverte 24 h sur 24. Sans que personne n'entre.",
    body: [
      "Votre maison est accessible 24 heures sur 24, où que l'on soit.",
      "L'acheteur peut la parcourir à son rythme, revenir en arrière, s'attarder sur chaque détail et décider si elle correspond vraiment à ce qu'il recherche.",
      "Quand il demande une visite, il ne vient généralement plus la découvrir. Il vient confirmer que c'est bien le logement qu'il avait imaginé.",
    ],
    note: "Visite réelle. Faites-la glisser et parcourez-la vous-même.",
    activate: "Touchez pour explorer",
    matterport: MATTERPORT,
  },

  difusion: {
    n: "05",
    kicker: "Diffusion",
    title: "Publier, c'est facile. Atteindre, c'est autre chose.",
    body: [
      "Tout ce matériel ne reste pas à attendre sur un portail. Nous le diffusons là où l'acheteur regarde chaque jour : portails, campagnes, réseaux sociaux et notre propre base d'acheteurs.",
      "Et nous ne le montrons pas à n'importe qui : grâce à des campagnes ciblées, nous le plaçons devant celui qui peut vraiment acheter votre maison.",
      "Nous n'attendons pas qu'il se présente. Nous partons le chercher.",
    ],
    channels: [
      { src: "/images/portales/idealista.svg", alt: "Idealista" },
      { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
      { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
      { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
      { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
      { src: "/images/portales/luxuryestate-white.svg", alt: "Luxury Estate" },
      { src: "/images/portales/properstar.svg", alt: "Properstar" },
      { src: "/images/portales/instagram.svg", alt: "Instagram" },
      { src: "/images/portales/facebook.svg", alt: "Facebook" },
      { src: "/images/portales/tiktok.svg", alt: "TikTok" },
    ],
  },

  coda: {
    eyebrow: "Et après l'annonce",
    title: "L'annonce n'est que la moitié du travail.",
    items: [
      { t: "Documentation", d: "Nous la vérifions et la mettons à jour avant de sortir sur le marché, pour que rien ne freine la vente en cours de route." },
      { t: "Négociation", d: "Chaque offre est analysée avec vous, avec calme et avec des chiffres. Et défendue avec discernement." },
      { t: "Jusqu'à la signature", d: "Visites, délais, notaire. Nous vous accompagnons jusqu'au jour de la remise des clés." },
    ],
  },

  diferencia: {
    eyebrow: "La différence",
    titleMuted: "L'habituel,",
    titleRest: "et notre façon de faire.",
    colHabitual: "L'habituel",
    colNuestro: "Avec nous",
    rows: [
      { habitual: "Des photos non retouchées, mises en ligne telles quelles", nuestro: "Un reportage retouché de chaque pièce" },
      { habitual: "Un texte copié d'une autre annonce", nuestro: "Une vidéo pensée pour arrêter le pouce" },
      { habitual: "La distribution, à vue de nez", nuestro: "Un plan 3D avec la distribution réelle" },
      { habitual: "« Venez plutôt le voir »", nuestro: "Une visite virtuelle ouverte 24 h sur 24" },
      { habitual: "Publier et attendre", nuestro: "Campagnes et réseaux pour partir à la recherche de l'acheteur" },
    ],
    outro: "Rien de tout cela n'est une option en supplément ni une promesse de brochure. C'est, tout simplement, notre façon de travailler.",
  },

  resenas: {
    eyebrow: "Ce que disent ceux qui ont déjà vendu",
    googleLabel: "Avis réels sur Google",
    readMore: "Lire la suite",
    readLess: "Réduire",
    items: [
      { quote: "Dès le premier jour, on a senti que ce n'était pas une agence comme les autres : un contact très humain, une communication claire et une façon de travailler rare aujourd'hui. Le reportage du logement était spectaculaire et a fait toute la différence.", name: "Noelia Nieto", tag: "Avis Google" },
      { quote: "J'ai eu affaire à plusieurs agences en même temps et la différence est vraiment énorme. Ils travaillent avec honnêteté, avec empathie et beaucoup de professionnalisme. Nous nous sommes sentis accompagnés à chaque instant.", name: "Yolee Seth", tag: "Avis Google" },
      { quote: "Le contact a été très professionnel et chaleureux tout au long de la vente de notre appartement. Ari a été particulièrement aimable, toujours attentive et prête à nous aider.", name: "Patricia Reyes", tag: "Avis Google" },
      { quote: "Ce fut un privilège de pouvoir compter sur eux pour la vente de mon appartement. Ils sont très professionnels et facilitent tout. Je recommande à 100 % : un contact humain et transparent.", name: "Laura Cano", tag: "Avis Google" },
      { quote: "Ariadna est très aimable, rapide et connaît parfaitement tout le processus. Je me suis sentie très rassurée d'avoir quelqu'un de son expérience pour me conseiller. Je recommande vivement le service.", name: "Carmela Castellanos", tag: "Avis Google" },
      { quote: "De grands professionnels et des personnes encore meilleures. Leur gestion a été impeccable.", name: "Jordi Pons", tag: "Avis Google" },
    ],
  },

  cierre: {
    title: "Maintenant, vous savez comment nous travaillons.",
    sub: "Il ne manque plus que votre maison.",
    body: "Parlez-nous de votre situation et nous vous expliquerons, en toute transparence, comment nous aborderions la vente de votre logement.",
    submitLabel: "Parlons-en",
  },

  footer: { legal: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies" },
};

export const COMO_COPY: Record<Lang, ComoCopy> = { es, ca, en, fr };
