import type { Metadata, Viewport } from "next";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import TuPrecioLanding from "@/components/tu-precio/TuPrecioLanding";
import { tpFontVars } from "@/components/tu-precio/fonts";
import { getGooglePlaceData } from "@/lib/googlePlaces";
import { buildTpReviews, TP_COPY } from "@/lib/tu-precio-copy";

/* Landing de la campaña Meta «Tu precio» (ES). Ruta standalone (PublicChrome
   no la envuelve): sin menú ni fugas, un solo objetivo. noindex A PROPÓSITO:
   es una página de campaña; el SEO de captación vive en /vender. */

// ISR 6 h: el número de reseñas se pinta en servidor y así se refresca solo.
export const revalidate = 21600;

export const viewport: Viewport = { themeColor: "#FCFCFB" };

const t = TP_COPY.es;

export const metadata: Metadata = {
  title: { absolute: t.ttl },
  description: t.metaDesc,
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/tu-precio",
    languages: {
      "es-ES": "/tu-precio",
      "ca-ES": "/el-teu-preu",
      "x-default": "/tu-precio",
    },
  },
};

export default async function TuPrecioPage() {
  const place = await getGooglePlaceData();
  return (
    <CookieConsentProvider>
      <TuPrecioLanding lang="es" reviews={buildTpReviews(place, "es")} fontClass={tpFontVars} />
    </CookieConsentProvider>
  );
}
