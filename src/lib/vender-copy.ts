/* ─────────────────────────────────────────────────────────────────────
   FUENTE ÚNICA DE COPY de la landing /vender.
   Todo el texto de la landing vive AQUÍ, copiado literal de la versión
   trabajada sección a sección. Ni el rediseño ni ninguna otra vista deben
   escribir texto a mano: importan de este archivo. Así es imposible que
   una palabra cambie por accidente.
   ⚠️ El copy es INTOCABLE — no reescribir, resumir ni añadir.
   ───────────────────────────────────────────────────────────────────── */

export const VENDER_COPY = {
  nav: { cta: "Hablemos" },

  hero: {
    eyebrow: "Human Real Estate",
    titleLead: "No necesitas una inmobiliaria.",
    titleSub: "Necesitas a alguien en quien confiar cuando todo está en juego.",
    body: "Vender una vivienda no consiste en publicar un anuncio. Consiste en gestionar dudas, negociar con criterio, evitar errores y acompañarte en una decisión que probablemente solo tomarás unas pocas veces en la vida.",
    bodyStrong: "Nosotros no intentamos convencerte.",
    bodyRest: "Nos dedicamos a que, cuando llegue el día de firmar, tengas la tranquilidad de saber que cada decisión ha sido la correcta.",
    cta: "Cuéntanos tu caso",
    statFamilies: "familias acompañadas",
    statGoogle: "en Google",
    families: 450,
  },

  antes: {
    eyebrow: "Antes de hablar de tu casa",
    title: "La parte difícil nunca ha sido vender una vivienda.",
    lines: [
      "La parte difícil es decidir si aceptar una oferta.",
      "Saber si ese es realmente su valor.",
      "Confiar en que no estás dejando dinero encima de la mesa.",
      "Tener la tranquilidad de que quien tienes delante piensa en tus intereses antes que en cerrar una operación.",
    ],
    outroLead: "Porque una vivienda puede venderse en unas semanas.",
    outroSub: "Pero la decisión que tomes te acompañará durante muchos años.",
  },

  presentacion: {
    eyebrow: "La presentación",
    titleMuted: "No cambia la vivienda.",
    titleRest: "Cambia lo que transmite.",
    lines: [
      "Las personas no visitan una casa por sus metros cuadrados.",
      "La visitan porque, al verla, imaginan su vida dentro.",
      "Por eso cuidamos cada fotografía, cada encuadre y cada detalle.",
      "Porque la primera visita siempre ocurre a través de una pantalla.",
    ],
    pairs: [
      { room: "El comedor", mal: "/images/vender/comedor-mal.png", bien: "/images/vender/comedor-bien-2.jpg" },
      { room: "El salón", mal: "/images/vender/salon-mal.png", bien: "/images/vender/salon-bien-2.jpg" },
      { room: "El porche", mal: "/images/vender/porche-mal.png", bien: "/images/vender/porche-bien-2.jpg" },
      { room: "La terraza", mal: "/images/vender/terraza-mal.png", bien: "/images/vender/terraza-bien-2.jpg" },
    ],
    labelBefore: "Antes",
    labelAfter: "Después",
    pairCaption: "Antes, sin cuidar · Después, con nosotros",
  },

  tour: {
    eyebrow: "Tour virtual 3D",
    title: "El primer paso ya no es una visita.",
    body: [
      "Cuando alguien llama para visitar tu casa, la decisión ya está medio tomada.",
      "Hoy los compradores no recorren una vivienda por primera vez al abrir la puerta. Lo hacen desde el sofá, comparando decenas de casas y decidiendo cuáles merecen una visita.",
    ],
    bodyStrong: "Por eso no utilizamos un tour virtual para impresionar.",
    bodyRest: "Lo utilizamos para que quien venga a verla ya sepa que puede ser su próxima casa.",
    note: "Tour real de una vivienda nuestra. Arrástrala y recórrela tú mismo.",
    matterport: "https://my.matterport.com/show/?m=zeLdy8k2NEZ&play=1&qs=1",
  },

  movemos: {
    eyebrow: "Cómo encontramos al comprador adecuado",
    titleMuted: "La visibilidad no vende una casa.",
    titleRest: "La atención sí.",
    body: [
      "Hoy cualquier inmobiliaria puede publicar una vivienda en los mismos portales. La diferencia no está en dónde aparece.",
      "Está en conseguir que alguien deje de pasar anuncios y piense:",
    ],
    quote: "«Quiero vivir aquí.»",
    outro: "Ese momento dura apenas unos segundos. Y es ahí donde empieza realmente una buena venta.",
    steps: [
      {
        n: "01",
        lead: "Primero conseguimos que destaque.",
        body: [
          "Una vivienda solo tiene una oportunidad para causar una primera impresión.",
          "Por eso cuidamos cada fotografía, cada vídeo y cada detalle para que, entre decenas de anuncios, la tuya sea la que alguien decida abrir.",
        ],
      },
      {
        n: "02",
        lead: "Después hacemos que llegue más lejos.",
        body: [
          "No esperamos a que el comprador aparezca. Movemos tu vivienda allí donde las personas descubren oportunidades antes incluso de empezar a buscarlas.",
          "Porque las mejores ventas no siempre nacen de una búsqueda. Muchas empiezan despertando interés.",
        ],
      },
      {
        n: "03",
        lead: "Y la ponemos delante de quien puede comprarla.",
        body: [
          "Portales inmobiliarios, campañas, redes sociales y nuestra propia base de compradores.",
          "No buscamos miles de personas. Buscamos a la persona adecuada.",
          "Porque cuando una vivienda llega a quien realmente la estaba esperando… las decisiones llegan mucho antes.",
        ],
      },
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
    showcase: [
      "/images/vender/vista-2.jpg",
      "/images/vender/entrada-2.jpg",
      "/images/vender/jardin-2.jpg",
      "/images/vender/salon-bien-2.jpg",
      "/images/vender/comedor-bien-2.jpg",
      "/images/vender/terraza-bien-2.jpg",
    ],
  },

  redes: {
    eyebrow: "En redes",
    title: "No competimos solo con otras viviendas.",
    titleAccent: "Competimos por la atención de las personas.",
    intro: "Cada día alguien hace cientos de gestos automáticos con el dedo.",
    words: ["Desliza.", "Pasa.", "Olvida."],
    body: "Nuestro trabajo consiste en conseguir que, durante unos segundos, deje de hacerlo.",
    bodyStrong: "Porque cuando una vivienda consigue llamar la atención…",
    bodyRest: "todo lo demás empieza a ocurrir.",
    instagramUrl: "https://www.instagram.com/p/DV0sxvdDHur/",
    instagramCta: "Ver en Instagram →",
    reel: "/images/vender/reel.mp4",
  },

  resenas: {
    eyebrow: "Lo que dicen quienes ya han pasado por esto",
    titleMuted: "No hace falta que nos creas a nosotros.",
    titleRest: "Preferimos que les leas a ellos.",
    body: [
      "Podríamos hablarte de nuestro trabajo, de cómo acompañamos a cada propietario o de la importancia que damos a cada detalle.",
      "Pero creemos que quien mejor puede explicarlo es quien ya ha vendido su casa con nosotros.",
    ],
    googleLabel: "Opiniones reales en Google",
    items: [
      { quote: "Desde el primer día se notó que no son una inmobiliaria más: trato súper cercano, comunicación clara y una forma de trabajar nada común hoy día. El reportaje de la vivienda fue espectacular y marcó la diferencia.", name: "Noelia Nieto", initials: "N", tag: "Reseña en Google" },
      { quote: "He lidiado con varias inmobiliarias a la vez y de verdad que la diferencia es abismal. Trabajan de forma honesta, con empatía y mucha profesionalidad. Nos hemos sentido acompañados en todo momento.", name: "Yolee Seth", initials: "Y", tag: "Reseña en Google" },
      { quote: "El trato fue muy profesional y cercano durante todo el proceso de venta de nuestro piso. Ari fue especialmente amable, siempre atenta y dispuesta a ayudarnos.", name: "Patricia Reyes", initials: "P", tag: "Reseña en Google" },
      { quote: "Ha sido un privilegio contar con ellos para la venta de mi piso. Son súper profesionales y facilitan todo. Recomiendo al 100%: trato cercano y transparente.", name: "Laura Cano", initials: "L", tag: "Reseña en Google" },
      { quote: "Ariadna es súper amable, rápida y conoce mucho todo el proceso. Me sentí súper tranquila de tener a alguien con su experiencia que me asesore. Recomiendo mucho el servicio.", name: "Carmela Castellanos", initials: "C", tag: "Reseña en Google" },
      { quote: "Grans professionals i millors persones. La seva gestió ha estat impecable.", name: "Jordi Pons", initials: "J", tag: "Reseña en Google" },
    ],
  },

  eligen: {
    eyebrow: "Por qué nos eligen",
    title: "La confianza no se gana diciendo que sí a todo.",
    introLead: "Hay muchas formas de vender una casa.",
    introStrong: "Nosotros solo conocemos una.",
    introLines: [
      "La que prioriza tus intereses antes que cerrar una operación.",
      "La que dice la verdad, incluso cuando es incómoda.",
      "La que entiende que la confianza tarda meses en construirse y segundos en perderse.",
    ],
    introOutro: "Por eso trabajamos así.",
    points: [
      {
        lead: "Te diremos el precio que creemos.",
        body: ["No el que necesitas escuchar para firmar un encargo.", "Porque una expectativa irreal no vende una vivienda. Solo hace perder tiempo."],
      },
      {
        lead: "Si creemos que no somos la mejor opción, te lo diremos.",
        body: ["No queremos vender todas las casas.", "Queremos vender muy bien aquellas en las que realmente podemos aportar valor."],
      },
      {
        lead: "Estar informado no debería ser un favor.",
        body: ["Debería ser lo normal.", "Por eso sabrás qué está ocurriendo con tu vivienda en cada momento."],
      },
      {
        lead: "Preferimos una conversación incómoda hoy… que una decepción dentro de tres meses.",
        body: ["Porque nuestra obligación no es darte siempre la razón.", "Es ayudarte a tomar la mejor decisión."],
      },
    ],
  },

  cierre: {
    title: "Todo empieza con una conversación.",
    sub: "No con un contrato. Ni con promesas.",
    body: "Solo con una conversación para entender tu situación y explicarte, con total transparencia, cómo enfocaríamos la venta de tu vivienda.",
    perfectoLead: "Si después decides que somos la mejor opción para acompañarte, perfecto.",
    perfectoStrong: "Y si no, también.",
    confianzaStrong: "Porque la confianza nunca debería pedirse.",
    confianzaRest: "Debería ganarse.",
    submitLabel: "Hablemos de tu casa",
    closerLead: "Ahora la decisión sigue siendo tuya.",
    closerSub: "Si decides confiar en alguien, nos encantará que sea en nosotros.",
  },

  footer: { legal: "Aviso legal", privacy: "Privacidad", cookies: "Cookies" },
} as const;

export type VenderCopy = typeof VENDER_COPY;
