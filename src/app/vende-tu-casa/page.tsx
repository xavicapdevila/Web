import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import VendeContent from "@/components/vende/VendeContent";
import { getGooglePlaceData } from "@/lib/googlePlaces";

/* Landing de Google Ads. noindex A PROPÓSITO: es una página de campaña y no
   debe competir en buscadores con /vender (que es la landing orgánica). */
export const metadata: Metadata = {
  title: { absolute: "Vende tu casa en Vilanova i la Geltrú | The Vila Home" },
  description:
    "Valoración gratuita con cierres reales de tu zona, un único asesor de principio a fin y reportaje completo en todas las casas: fotografía, tour virtual, vídeo y plano.",
  robots: { index: false, follow: false },
};

export default async function VendeTuCasaPage() {
  // Reseñas reales de Google: solo 5★. La de Pere va fijada la primera
  // (petición de Xavi: es muy buena aunque sea larga; la tarjeta la recorta
  // y se abre entera en un modal). El resto, por longitud media: las
  // kilométricas desequilibran las tarjetas.
  const place = await getGooglePlaceData();
  const IDEAL_LEN = 220;
  const fiveStar = place.reviews.filter((r) => r.rating === 5 && r.text?.trim());
  const pinned = fiveStar.filter((r) => /\bpere\b/i.test(r.author));
  const rest = fiveStar
    .filter((r) => !pinned.includes(r))
    .sort((a, b) => Math.abs(a.text.length - IDEAL_LEN) - Math.abs(b.text.length - IDEAL_LEN));
  const fiveStarReviews = [...pinned, ...rest].slice(0, 3);

  // Ruta standalone (PublicChrome no la envuelve): providers propios, como /vender.
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <VendeContent
          reviews={fiveStarReviews}
          rating={place.rating}
          totalReviews={place.totalReviews}
        />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
