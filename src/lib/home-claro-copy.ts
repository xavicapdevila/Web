/* ─────────────────────────────────────────────────────────────────────
   COPY DE LA PREVIA /home-claro — SOLO CASTELLANO, SOLO PROTOTIPO

   POR QUÉ ESTE FICHERO EXISTE Y NO ESTÁ EN i18n.ts:
   i18n.ts es la web PUBLICADA. Tocar ahí las claves howIntro, howStep y cta
   cambiaría la home real en los 4 idiomas en el momento en que se
   despliegue — y el encargo es no tocar producción hasta decidir. Aquí el
   texto nuevo vive aparte y la web real sigue intacta.

   CONSECUENCIA, QUE HAY QUE TENER PRESENTE: estas frases van solo en
   castellano. Si en la previa se pulsa CA/EN/FR, el resto de la página
   cambia de idioma y estas no. Es deliberado: se traduce cuando el texto
   esté CONGELADO, no antes — traducir borradores es pagar el peaje ×4 por
   cada cambio de idea.

   AUTORÍA: el copy es de Xavi. Aquí no se inventa voz: la v1 de estos
   prototipos escribía frases propias y sonaba "de barrio". Donde hubo que
   elegir entre sus alternativas, la razón queda anotada al lado.
   ───────────────────────────────────────────────────────────────────── */

export const HOME_CLARO_COPY = {
  /* Sustituye a howIntro. La frase actual — "Comprar o vender una casa pasa
     una o dos veces en la vida, y nadie nace sabiendo" — está bien escrita
     pero es un lugar común del sector: se ha leído cien veces.

     Xavi dio tres alternativas. Esta es la única que JUSTIFICA "Human Real
     Estate" en vez de adornarlo: nombra la idea (la casa es una
     transacción, la persona es un proceso) que da nombre a la marca.
     Las otras dos, por si se quiere volver:
       · "Lo difícil no es vender una casa. Lo difícil es todo lo que viene
          alrededor."
       · "Hay decisiones que necesitan algo más que una firma." */
  intro: "Las casas cambian de dueño. Las personas viven un proceso.",

  /* MÉTODO: sacar a la superficie lo que ya estaba enterrado.

     El copy actual de la web tiene las imágenes buenas — "la casa donde
     crecieron tus hijos, la de tu madre, la que se te quedó pequeña", "la
     oferta que no llega, la duda a las diez de la noche" — pero sepultadas
     en párrafos de cuatro líneas que empiezan explicando el proceso.
     Aquí no se inventa voz nueva: se corta el relleno y se deja la imagen
     concreta, que es lo que se recuerda. Frases cortas, en seco.

     Todo esto es material de Xavi (howStep1Desc / howStep3Desc de i18n).
     Los titulares son suyos, de esta conversación. */
  pasos: [
    {
      n: "01",
      titulo: "Antes de hablar de precio, hablamos de ti.",
      /* De howStep1Desc. Se conservan las tres casas — son lo único
         concreto del párrafo original — y se tira lo demás ("empezamos
         sentándonos contigo, sin prisa"), que es proceso, no imagen. */
      cuerpo: "La casa donde crecieron tus hijos. La de tu madre. La que se te quedó pequeña. No todas se venden igual.",
    },
    {
      n: "02",
      /* De las dos alternativas de Xavi se elige esta: "No se trata de
         anunciar más" decía lo mismo que el cuerpo y se pisaban. */
      titulo: "Que la vea quien la tiene que ver.",
      cuerpo: "Fotografía, vídeo, plano y tour. Y un precio con los pies en el suelo.",
    },
    {
      n: "03",
      titulo: "Cuando llegan las dudas, seguimos aquí.",
      /* De howStep3Desc: se queda "las semanas de nervios" y "la oferta que
         no llega" — la parte que nadie más cuenta — y se tira la lista de
         trámites (visitas, ofertas, papeles, notaría), que promete cualquiera.

         FUERA "la duda a las diez de la noche", y no por estilo: en el texto
         original DESCRIBE lo que siente el cliente; comprimida y puesta bajo
         "seguimos aquí" pasaba a PROMETER que cogemos el teléfono a las diez
         de la noche. Y no lo hacemos. Una promesa que no se cumple es peor
         que no prometer nada — más aún cuando el activo de la casa son 114
         reseñas a 4,9.
         OJO: la frase sigue viva en i18n (howStep3Desc) y por tanto en la
         home publicada, seguida de "y estaremos". Menos explícito, mismo
         riesgo. Revisarlo cuando se toque el copy real. */
      cuerpo: "Las semanas de nervios. La oferta que no llega. Ahí es donde se nota.",
    },
  ],

  /* Sustituye a ctaTitle1/ctaTitle2 ("Cuando lo necesites, aquí estamos") y
     a ctaSubtitle. Una palabra: el titular más corto de toda la web y el
     más directo.
     El subtítulo es la frase que Xavi señaló como su favorita, y tiene un
     motivo de negocio, no estético: la mayoría de propietarios llega sin
     tenerlo decidido, y esa frase les quita el peso de tener que llegar con
     una decisión tomada.
     Alternativa que también propuso: "Cuéntanos qué necesitas. Sin presión.
     Sin compromiso." */
  cta: {
    titulo: "Hablemos.",
    subtitulo: "No hace falta tenerlo claro para empezar.",
  },
} as const;
