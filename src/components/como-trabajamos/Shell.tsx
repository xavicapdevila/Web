"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import ComoTrabajamos from "@/components/como-trabajamos/ComoTrabajamos";
import type { Lang } from "@/lib/i18n";

/**
 * Envoltorio cliente de la landing /como-trabajamos por idioma. Cada ruta
 * (es/ca/en/fr) fija su idioma con forceLang: el copy de la landing y el
 * formulario (LeadFormSteps, vía useLanguage) hablan el mismo idioma sin
 * detección ni cookie. Standalone: PublicChrome no envuelve estas rutas.
 */
export default function ComoTrabajamosShell({ lang }: { lang: Lang }) {
  // <html lang> del layout raíz es "es"; lo ajustamos al idioma de la ruta
  // (a11y/lectores de pantalla). Client-side para no volver dinámico el layout.
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => { document.documentElement.lang = prev; };
  }, [lang]);

  return (
    <LanguageProvider forceLang={lang}>
      <CookieConsentProvider>
        <ComoTrabajamos lang={lang} />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
