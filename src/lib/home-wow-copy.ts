/* ─────────────────────────────────────────────────────────────────────
   COPY DE /home-wow — SOLO CASTELLANO, SOLO PROTOTIPO

   Encargo de Xavi (jul 2026): reformular los "tres puntos" de la home para
   que IMPACTEN — «que al final sea: hostia, me convences de que eres la
   mejor opción». Persuasión, no descripción.

   REGLAS QUE SE RESPETAN (tono TVH):
   - Cero cifras inventadas. La única cifra es la nota real de Google, que
     se inyecta dinámica ({rating}/{reviews}) — nunca a fuego.
   - «Ocho fotos de móvil» no es un dato: es la descripción de cómo anuncia
     la competencia, la misma imagen que ya usa el resto del rediseño.
   - Frases cortas, en seco. Sin clichés de inmobiliaria.

   MECÁNICA DE LA PERSUASIÓN (por qué cada tarjeta dice lo que dice):
   01 — aversión a la pérdida: tu casa se descarta con el pulgar.
   02 — reencuadre del activo + visualización del resultado.
   03 — prueba social con datos REALES como remate.

   Se traduce cuando el texto se congele, no antes (misma regla que
   home-claro-copy.ts).
   ───────────────────────────────────────────────────────────────────── */

export const HOME_WOW_COPY = {
  metodo: {
    label: "Por qué The Vila Home",
    titulo1: "Vender bien no es suerte.",
    titulo2: "Es método.",
    pasos: [
      {
        n: "01",
        titulo: "Tu casa se descarta en segundos.",
        cuerpo:
          "Así se mira un portal: pasando anuncios con el pulgar. Ocho fotos hechas con un móvil no detienen a nadie. Una producción de verdad, sí.",
      },
      {
        n: "02",
        titulo: "Nosotros la producimos como lo que es: tu mayor activo.",
        cuerpo:
          "Fotografía profesional, vídeo, plano 3D y tour virtual. Quien la ve desde el sofá ya quiere verla en persona — y quien pide visita, llega medio convencido.",
      },
      {
        n: "03",
        titulo: "Y no hace falta que nos creas a nosotros.",
        /* {rating} y {reviews} se rellenan con los datos vivos de Google
           Places vía fillTemplate — si la nota cambia, el texto cambia. */
        cuerpo:
          "{rating} sobre 5 en {reviews} reseñas de Google. Lee lo que cuentan los que ya han vendido con nosotros.",
      },
    ],
  },
} as const;
