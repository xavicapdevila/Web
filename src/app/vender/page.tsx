import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import VenderContent from "@/components/vender/VenderContent";
import { getGooglePlaceData } from "@/lib/googlePlaces";

export const metadata: Metadata = {
  title: "Vender tu casa con The Vila Home | Sin suerte, sabiendo cómo",
  description:
    "Vender bien no es suerte, es saber hacerlo. Precio real desde el primer día, un único asesor de principio a fin, reportaje profesional y transparencia total. Solicita tu valoración gratuita.",
  alternates: { canonical: "https://www.thevilahome.com/vender" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.thevilahome.com/vender",
    siteName: "The Vila Home",
    title: "Vender tu casa con The Vila Home | Sin suerte, sabiendo cómo",
    description:
      "Precio real desde el primer día, un único asesor de principio a fin y transparencia total. Valoración gratuita sin compromiso.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevilahome",
    title: "Vender tu casa con The Vila Home | Sin suerte, sabiendo cómo",
    description:
      "Precio real desde el primer día, un único asesor de principio a fin y transparencia total. Valoración gratuita sin compromiso.",
    images: ["/og-image.jpg"],
  },
};

export default async function VenderPage() {
  // Reseñas reales de Google. Mostramos SOLO las de 5★, pero el total (rating y
  // nº de reseñas) es el real de la ficha de Google.
  const place = await getGooglePlaceData();
  const fiveStarReviews = place.reviews.filter((r) => r.rating === 5).slice(0, 6);

  // /vender es una ruta "standalone" (el layout no la envuelve en
  // LanguageProvider), así que la envolvemos aquí para que el selector de
  // idioma de la landing funcione.
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <VenderContent
          reviews={fiveStarReviews}
          rating={place.rating}
          totalReviews={place.totalReviews}
        />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
