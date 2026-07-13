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
    titleSub: "Esto es exactamente lo que haremos para que salga bien.",
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
    strong: "Por eso, antes de publicar tu casa, la producimos entera.",
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
      "Las fotos enseñan cómo es tu casa. El plano explica cómo se vive en ella: la distribución real, cada estancia en su sitio, lo que se podría cambiar.",
      "Es la diferencia entre gustar y encajar.",
    ],
    note: "Plano 3D real de una vivienda nuestra.",
    img: "/images/vender/plano-3d.jpg",
  },

  tour: {
    n: "04",
    kicker: "Tour virtual",
    title: "Tu casa, abierta 24 horas. Sin que entre nadie.",
    body: [
      "Con el tour virtual, el comprador recorre la vivienda entera desde donde esté: cada habitación, a su ritmo, las veces que quiera.",
      "Quien pide visita después de recorrerla no viene a curiosear. Viene a confirmar.",
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
      "No esperamos a que aparezca. Salimos a buscarlo.",
    ],
    channels: [
      { src: "/images/portales/idealista.svg", alt: "Idealista" },
      { src: "/images/portales/fotocasa.svg", alt: "Fotocasa" },
      { src: "/images/portales/habitaclia.svg", alt: "Habitaclia" },
      { src: "/images/portales/pisos.svg", alt: "Pisos.com" },
      { src: "/images/portales/jamesedition.svg", alt: "James Edition" },
      { src: "/images/portales/luxuryestate.svg", alt: "Luxury Estate" },
      { src: "/images/portales/properstar.svg", alt: "Properstar" },
      { src: "/images/portales/instagram.svg", alt: "Instagram" },
      { src: "/images/portales/tiktok.svg", alt: "TikTok" },
    ],
  },

  diferencia: {
    eyebrow: "La diferencia",
    titleMuted: "Lo habitual,",
    titleRest: "y lo nuestro.",
    colHabitual: "Lo habitual",
    colNuestro: "Con nosotros",
    rows: [
      { habitual: "Diez fotos hechas con un móvil", nuestro: "Un reportaje profesional de cada estancia" },
      { habitual: "Un texto copiado de otro anuncio", nuestro: "Un vídeo pensado para detener el dedo" },
      { habitual: "Los metros, a ojo", nuestro: "Un plano 3D con la distribución real" },
      { habitual: "«Mejor venga a verlo»", nuestro: "Un tour virtual abierto las 24 horas" },
      { habitual: "Publicar y esperar", nuestro: "Campañas y redes para salir a buscar al comprador" },
    ],
    outro: "Nada de esto es un pack especial ni una promesa de folleto. Es, simplemente, cómo trabajamos.",
  },

  resenas: {
    eyebrow: "Lo que dicen quienes ya vendieron",
    googleLabel: "Opiniones reales en Google",
    items: [
      { quote: "Desde el primer día se notó que no son una inmobiliaria más: trato súper cercano, comunicación clara y una forma de trabajar nada común hoy día. El reportaje de la vivienda fue espectacular y marcó la diferencia.", name: "Noelia Nieto", tag: "Reseña en Google" },
      { quote: "He lidiado con varias inmobiliarias a la vez y de verdad que la diferencia es abismal. Trabajan de forma honesta, con empatía y mucha profesionalidad. Nos hemos sentido acompañados en todo momento.", name: "Yolee Seth", tag: "Reseña en Google" },
    ],
  },

  cierre: {
    title: "Ahora ya sabes cómo trabajamos.",
    sub: "Solo falta tu casa.",
    body: "Cuéntanos tu caso y te explicaremos, con total transparencia, cómo enfocaríamos la venta de tu vivienda.",
    submitLabel: "Hablemos de tu casa",
  },

  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
} as const;

export type ComoCopy = typeof COMO_COPY;
