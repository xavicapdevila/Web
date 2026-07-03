import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/home/Hero";
import HowWeWork from "@/components/home/HowWeWork";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Testimonials from "@/components/home/Testimonials";
import ValuationCTA from "@/components/home/ValuationCTA";
import SocialSection from "@/components/home/SocialSection";
import { getFeaturedProperties, ensureDbSeeded } from "@/lib/sync";
import { getGooglePlaceData } from "@/lib/googlePlaces";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.thevilahome.com" },
};

// ISR horario: la home es estática (rápida y siempre indexable) pero los
// destacados y las reseñas de Google se refrescan cada hora.
export const revalidate = 3600;

const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.thevilahome.com/#website",
  name: "The Vila Home",
  url: "https://www.thevilahome.com",
  inLanguage: "es-ES",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.thevilahome.com/propiedades?ciudad={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const schemaRealEstateAgent = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://www.thevilahome.com/#organization",
  name: "The Vila Home",
  alternateName: "The Vila Home — Human Real Estate",
  description:
    "Inmobiliaria en Vilanova i la Geltrú especializada en venta de pisos, casas, chalets y áticos en el Garraf y Penedès.",
  url: "https://www.thevilahome.com",
  logo: "https://www.thevilahome.com/logo.svg",
  image: "https://www.thevilahome.com/og-image.jpg",
  telephone: "+34936061800",
  email: "info@thevilahome.com",
  legalName: "Projectes Immobiliaris Costa Daurada SL",
  taxID: "B13683529",
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
  hasMap: "https://www.google.com/maps/search/?api=1&query=The%20Vila%20Home&query_place_id=ChIJhciFmN6HoxIRfBIcpyI-w6Q",
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
  priceRange: "€€",
  areaServed: [
    { "@type": "City", name: "Vilanova i la Geltrú" },
    { "@type": "AdministrativeArea", name: "Garraf" },
    { "@type": "AdministrativeArea", name: "Penedès" },
    { "@type": "City", name: "Sitges" },
    { "@type": "City", name: "Sant Pere de Ribes" },
    { "@type": "City", name: "Cubelles" },
  ],
  sameAs: [
    "https://www.instagram.com/thevilahome",
    "https://www.facebook.com/profile.php?id=100093001283637",
    "https://www.tiktok.com/@thevilahome",
  ],
  // aggregateRating injected at runtime from Google Places API
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta una inmobiliaria en Vilanova i la Geltrú?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los honorarios estándar de una inmobiliaria en Vilanova i la Geltrú oscilan entre el 3% y el 5% del precio de venta. En The Vila Home trabajamos con condiciones claras y transparentes, acordadas antes de empezar. Consulta sin compromiso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo tarda en venderse un piso en Vilanova?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con una valoración correcta y buena presentación, la mayoría de propiedades se venden en 60–90 días en Vilanova i la Geltrú. Las viviendas bien ubicadas y a precio de mercado pueden cerrarse en menos de 30 días.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué zonas cubre The Vila Home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Vila Home opera principalmente en Vilanova i la Geltrú, Sitges, Cubelles, Sant Pere de Ribes, Cunit y toda la comarca del Garraf. También trabajamos en el Penedès, especialmente en Vilafranca del Penedès.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo valoro mi casa gratis en Vilanova?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes solicitar una valoración gratuita de tu propiedad en Vilanova a través del formulario de valoración de nuestra web. Respondemos en menos de 24 horas con una estimación real basada en el mercado actual.",
      },
    },
  ],
};

export default async function HomePage() {
  const [placeData] = await Promise.all([
    getGooglePlaceData(),
    ensureDbSeeded(),
  ]);

  let featured: import("@/types/property").Property[] = [];
  try {
    featured = getFeaturedProperties(6);
  } catch {
    // DB not yet seeded — first load before sync
  }

  const schema = {
    ...schemaRealEstateAgent,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(placeData.rating),
      reviewCount: String(placeData.totalReviews),
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }}
      />
      <Script
        id="schema-real-estate-agent"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
      <Hero />
      <HowWeWork />
      <Suspense fallback={<div className="h-96 bg-[#0a0a0a]" />}>
        <FeaturedProperties properties={featured} />
      </Suspense>
      <Testimonials
        reviews={placeData.reviews}
        rating={placeData.rating}
        totalReviews={placeData.totalReviews}
      />
      <ValuationCTA />
      <SocialSection />
    </>
  );
}
