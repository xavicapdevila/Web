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
        id="schema-real-estate-agent"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
