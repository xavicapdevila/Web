import type { Metadata, Viewport } from "next";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import TuPrecioLanding from "@/components/tu-precio/TuPrecioLanding";
import { tpFontVars } from "@/components/tu-precio/fonts";
import { getGooglePlaceData } from "@/lib/googlePlaces";
import { buildTpReviews, TP_COPY } from "@/lib/tu-precio-copy";

/* Landing de la campaña Meta «Tu precio» (CA). Idéntica a /tu-precio pero con
   el idioma fijado por URL (decisión cerrada: sin autodetect en estas rutas). */

export const revalidate = 21600;

export const viewport: Viewport = { themeColor: "#FCFCFB" };

const t = TP_COPY.ca;

export const metadata: Metadata = {
  title: { absolute: t.ttl },
  description: t.metaDesc,
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/el-teu-preu",
    languages: {
      "es-ES": "/tu-precio",
      "ca-ES": "/el-teu-preu",
      "x-default": "/tu-precio",
    },
  },
};

export default async function ElTeuPreuPage() {
  const place = await getGooglePlaceData();
  return (
    <CookieConsentProvider>
      <TuPrecioLanding lang="ca" reviews={buildTpReviews(place, "ca")} fontClass={tpFontVars} />
    </CookieConsentProvider>
  );
}
