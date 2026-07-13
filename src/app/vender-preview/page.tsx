import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import VenderRedesign from "@/components/vender/VenderRedesign";

// PROTOTIPO — no indexar. Rediseño premium de /vender.
export const metadata: Metadata = {
  title: "Prototipo · Vender con The Vila Home",
  robots: { index: false, follow: false },
};

export default function VenderPreviewPage() {
  // /vender-preview es standalone (el layout no la envuelve en providers):
  // LanguageProvider para el LeadForm y CookieConsentProvider + banner para
  // que el Pixel pueda pedir consentimiento (mismo patrón que /vender).
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <VenderRedesign />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
