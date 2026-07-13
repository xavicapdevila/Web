import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import ComoTrabajamos from "@/components/como-trabajamos/ComoTrabajamos";

// Landing de persuasión para propietarios: el método (foto, vídeo, plano,
// tour, difusión) en 5 capítulos. Se comparte en directo con vendedores;
// noindex para no canibalizar /vender en Google (cambiar si se decide indexar).
export const metadata: Metadata = {
  title: "Cómo trabajamos tu casa",
  description:
    "Fotografía profesional, vídeo, plano 3D, tour virtual y difusión: así preparamos y movemos cada vivienda antes de venderla.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.thevilahome.com/como-trabajamos" },
  openGraph: {
    title: "Cómo trabajamos tu casa — The Vila Home",
    description:
      "Fotografía profesional, vídeo, plano 3D, tour virtual y difusión: así preparamos y movemos cada vivienda antes de venderla.",
    images: ["/images/vender/salon-bien-2.jpg"],
    type: "website",
  },
};

export default function ComoTrabajamosPage() {
  // Standalone (PublicChrome no la envuelve en providers): LanguageProvider
  // para LeadFormSteps y CookieConsentProvider + banner para que el Pixel
  // pueda pedir consentimiento (mismo patrón que /vender).
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <ComoTrabajamos />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
