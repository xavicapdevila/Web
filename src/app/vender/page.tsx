import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import DinosPrecio from "@/components/vender/DinosPrecio";
import { DP_COPY } from "@/lib/dinos-precio-copy";

/* /vender = landing «Dinos tu precio» (campaña de precio de Meta). Diseño
   editorial de /como-trabajamos; el gancho de los anuncios (el precio)
   aterriza aquí. Ruta standalone (PublicChrome no la envuelve): sin menú ni
   fugas. 4 idiomas por LanguageProvider (?lang= → cookie → navegador). */

const t = DP_COPY.es;

export const metadata: Metadata = {
  title: { absolute: t.meta.title },
  description: t.meta.description,
  alternates: { canonical: "https://www.thevilahome.com/vender" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.thevilahome.com/vender",
    siteName: "The Vila Home",
    title: t.meta.title,
    description: t.meta.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevilahome",
    title: t.meta.title,
    description: t.meta.description,
    images: ["/og-image.jpg"],
  },
};

export default function VenderPage() {
  // /vender es "standalone" (el layout no la envuelve en LanguageProvider),
  // así que lo hacemos aquí para el selector de idioma y el copy 4 idiomas.
  return (
    <LanguageProvider urlOnly>
      <CookieConsentProvider>
        <DinosPrecio />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
