/* ─────────────────────────────────────────────────────────────────────
   FUENTE ÚNICA DE COPY de la landing /como-trabajamos.
   Landing de persuasión para PROPIETARIOS: enseña la producción completa
   (fotografía, vídeo, plano 3D, tour virtual, difusión) con la que
   trabajamos cada vivienda. Mismo patrón que vender-copy.ts: todo el
   texto vive aquí; el componente solo importa.
   Tono TVH: editorial, frases cortas, sin clichés ni cifras inventadas.
   ───────────────────────────────────────────────────────────────────── */

export const COMO_COPY = {
  nav: { cta: "Hablemos" },

  hero: {
    eyebrow: "Cómo trabajamos",
    titleLead: "Tu casa solo se vende una vez.",
    titleSub: "Por eso cuidamos cada paso, del primer detalle hasta la firma.",
    cta: "Hablemos",
    scrollHint: "Baja para verlo todo",
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
    /* brand=0 + mls=1: sin enlaces de marca de Matterport dentro del visor
       (menos puertas de salida de la landing, sobre todo en móvil) */
    matterport: "https://my.matterport.com/show/?m=zeLdy8k2NEZ&play=1&qs=1&brand=0&mls=1",
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
} as const;

export type ComoCopy = typeof COMO_COPY;
