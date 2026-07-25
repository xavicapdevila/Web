"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import PropiedadesWow from "@/components/pages/propiedades-wow/PropiedadesWow";
import type { Property } from "@/types/property";

/* Envoltorio cliente de /propiedades-wow — mismo patrón que el resto de
   previas: standalone, monta su propio consentimiento. */
export default function PropiedadesWowShell({ properties }: { properties: Property[] }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <PropiedadesWow properties={properties} />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
