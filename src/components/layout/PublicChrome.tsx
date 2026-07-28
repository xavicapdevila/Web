"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieBanner from "@/components/layout/CookieBanner";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";

/**
 * Envuelve las páginas públicas con Navbar/Footer/banner; las rutas "a pelo"
 * (admin y landings standalone) se renderizan sin chrome.
 *
 * Vive en un componente cliente con usePathname() A PROPÓSITO: la versión
 * anterior leía headers() (x-pathname) en el layout raíz, y eso convertía TODA
 * la web en render dinámico — sin páginas estáticas/ISR y sin 404 reales
 * (el streaming ya había enviado el 200 cuando saltaba el notFound()).
 * No mover esta lógica de vuelta al servidor sin tener eso en cuenta.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/links") ||
    pathname.startsWith("/trabaja") ||
    pathname.startsWith("/vender") ||
    pathname.startsWith("/vendedor-preview") ||
    pathname.startsWith("/home-preview") ||
    pathname.startsWith("/home-claro") ||
    pathname.startsWith("/propiedades-claro") ||
    pathname.startsWith("/como-trabajamos") ||
    pathname.startsWith("/com-treballem") ||
    pathname.startsWith("/how-we-work") ||
    pathname.startsWith("/notre-methode") ||
    pathname.startsWith("/vende-tu-casa") ||
    pathname.startsWith("/antes-de-vender") ||
    pathname.startsWith("/diagnostico") ||
    pathname.startsWith("/resena");

  if (bare) return <>{children}</>;

  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
