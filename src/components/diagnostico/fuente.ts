/**
 * Tipografía display del diagnóstico — Space Grotesk, solo para estas rutas.
 * Se aplica como variable CSS en el contenedor raíz de cada pantalla y las
 * cabeceras/números la usan vía `var(--font-dx-display)`.
 */

import { Space_Grotesk } from "next/font/google";

export const fuenteDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dx-display",
  display: "swap",
});
