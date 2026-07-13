/**
 * Tipografías de la landing «Tu precio» — Schibsted Grotesk (display) +
 * DM Sans variable (cuerpo/UI). next/font las descarga en build y las sirve
 * SELF-HOSTED desde /_next/static: cero requests a Google Fonts en runtime
 * (requisito de la landing) y preload automático solo en estas rutas.
 *
 * Se declaran aquí (no en el layout raíz) para que el resto de la web no
 * cargue ni una @font-face de más.
 */
import { Schibsted_Grotesk, DM_Sans } from "next/font/google";

/* display: "optional" a propósito: las fuentes van precargadas, así que en
   conexiones normales se pintan a la primera; si la red es lenta, el texto
   sale YA con el fallback ajustado por métricas (adjustFontFallback) en vez
   de esperar el swap — en una landing de anuncios la velocidad convierte más
   que la tipografía. OJO Lighthouse: el LCP simulado de estas rutas lo marcan
   las fuentes/CSS globales del layout raíz (LCP real ~0,2s); ver notas de la
   campaña. */
export const tpDisplay = Schibsted_Grotesk({
  subsets: ["latin"], // cubre ES y CA (acentos, ç, l·l)
  display: "optional",
  variable: "--font-tp-disp",
});

export const tpBody = DM_Sans({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-tp-body",
});

/** Clases a colgar del wrapper .tp para exponer las variables CSS. */
export const tpFontVars = `${tpDisplay.variable} ${tpBody.variable}`;
