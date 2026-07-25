"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieBanner from "@/components/layout/CookieBanner";
import HomeWow from "@/components/pages/home-wow/HomeWow";
import type { Property } from "@/types/property";
import type { GoogleReview } from "@/lib/googlePlaces";

/* Envoltorio cliente de /home-wow — mismo patrón que /home-claro:
   standalone (sin PublicChrome), monta su propio consentimiento. */
export default function HomeWowShell(props: {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  properties: Property[];
}) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <HomeWow {...props} />
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
