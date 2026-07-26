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
    /* v3 (26 jul): cada tarjeta gana su IMAGEN — la prueba visual hace el
       trabajo que antes hacía el adjetivo. Los assets son los pares
       mal/bien de /vender: EL MISMO SALÓN con móvil y producido. */
    pasos: [
      {
        n: "01",
        titulo: "Así anuncia tu casa la mayoría.",
        cuerpo:
          "Fotos de móvil, a contraluz, en vertical. El comprador pasa el pulgar, tu casa desaparece — y no vuelve a pasar por ella.",
        chip: "Así se ve en el portal",
      },
      {
        n: "02",
        titulo: "El mismo salón, producido.",
        cuerpo:
          "Arrastra y compara: esta es la diferencia entre anunciar y producir. Fotografía profesional, vídeo, plano 3D y tour virtual — para que quien mira desde el sofá llegue a la visita medio convencido.",
        chip: "Arrastra para comparar",
      },
      {
        n: "03",
        titulo: "No nos creas a nosotros.",
        /* {rating} y {reviews} se rellenan con los datos vivos de Google
           Places vía fillTemplate — si la nota cambia, el texto cambia. */
        cuerpo:
          "{rating} sobre 5 en {reviews} reseñas de Google — vendedores que ya pasaron por esto. Léelas antes de decidir con quién vas.",
        chip: "Reseñas verificadas de Google",
      },
    ],
  },
} as const;
