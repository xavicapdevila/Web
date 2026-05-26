import type { Metadata } from "next";
import Script from "next/script";
import ContactoContent from "@/components/pages/ContactoContent";

const BASE_URL = "https://www.thevilahome.com";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con The Vila Home en Vilanova i la Geltrú. Teléfono 936 061 800, WhatsApp, email y oficina en Av. Francesc Macià 48. Lunes a viernes 10–14h y 16:30–19:30h.",
  alternates: { canonical: `${BASE_URL}/contacto` },
  openGraph: {
    title: "Contacto — The Vila Home",
    description: "Llámanos, escríbenos o visítanos en Vilanova i la Geltrú. Estamos aquí para ayudarte sin compromiso.",
    url: `${BASE_URL}/contacto`,
  },
};

const schemaLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#organization`,
  name: "The Vila Home",
  alternateName: "The Vila Home — Human Real Estate",
  description:
    "Inmobiliaria boutique en Vilanova i la Geltrú especializada en venta de pisos, casas, chalets y áticos en el Garraf y Penedès.",
  url: BASE_URL,
  telephone: "+34936061800",
  email: "info@thevilahome.com",
  legalName: "Projectes Immobiliaris Costa Daurada SL",
  taxID: "B13683529",
  image: `${BASE_URL}/og-image.jpg`,
  logo: `${BASE_URL}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Francesc Macià 48",
    addressLocality: "Vilanova i la Geltrú",
    addressRegion: "Barcelona",
    postalCode: "08800",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.2183,
    longitude: 1.7266,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "14:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "16:30",
      closes: "19:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "14:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Vilanova i la Geltrú" },
    { "@type": "AdministrativeArea", name: "Garraf" },
    { "@type": "AdministrativeArea", name: "Penedès" },
    { "@type": "City", name: "Sitges" },
    { "@type": "City", name: "Cubelles" },
  ],
  sameAs: [
    "https://www.instagram.com/thevilahome",
    "https://www.facebook.com/profile.php?id=100093001283637",
    "https://www.tiktok.com/@thevilahome",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "106",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function ContactoPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }}
      />
      <ContactoContent />
    </div>
  );
}
