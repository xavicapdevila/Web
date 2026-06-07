import type { Metadata } from "next";
import Script from "next/script";
import QuienesSomosContent from "@/components/pages/QuienesSomosContent";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conoce al equipo de The Vila Home: Ariadna Garcia, Sofía Pascual y Xavier Capdevila. Tres profesionales que trabajan con honestidad, criterio y presencia real en cada operación inmobiliaria en Vilanova i la Geltrú.",
  alternates: { canonical: "https://www.thevilahome.com/quienes-somos" },
  openGraph: {
    type: "website",
    title: "Quiénes somos — The Vila Home",
    description: "El equipo humano detrás de The Vila Home. Ariadna, Sofía y Xavi: cercanos, honestos y sin corporativismo.",
    url: "https://www.thevilahome.com/quienes-somos",
    siteName: "The Vila Home",
    locale: "es_ES",
    images: [{ url: "https://www.thevilahome.com/og-image.jpg", width: 1200, height: 630, alt: "El equipo de The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiénes somos — The Vila Home",
    description: "El equipo humano detrás de The Vila Home. Ariadna, Sofía y Xavi.",
    images: ["https://www.thevilahome.com/og-image.jpg"],
  },
};

const BASE_URL = "https://www.thevilahome.com";

const schemaPeople = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ariadna Garcia",
    jobTitle: "Responsable de equipo — Asesora inmobiliaria",
    email: "a.garcia@thevilahome.com",
    url: `${BASE_URL}/quienes-somos`,
    worksFor: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "The Vila Home" },
    knowsAbout: ["Compraventa inmobiliaria", "Vilanova i la Geltrú", "Garraf"],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sofía Pascual",
    jobTitle: "Asesora inmobiliaria",
    email: "s.pascual@thevilahome.com",
    url: `${BASE_URL}/quienes-somos`,
    worksFor: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "The Vila Home" },
    knowsAbout: ["Compraventa inmobiliaria", "Vilanova i la Geltrú", "Garraf"],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Xavier Capdevila",
    jobTitle: "Fundador — Dirección y Marketing",
    email: "x.capdevila@thevilahome.com",
    url: `${BASE_URL}/quienes-somos`,
    worksFor: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "The Vila Home" },
    knowsAbout: ["Compraventa inmobiliaria", "Marketing inmobiliario", "Vilanova i la Geltrú", "Garraf"],
  },
];

export default function QuienesSomosPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {schemaPeople.map((person, i) => (
        <Script
          key={i}
          id={`schema-person-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
      <QuienesSomosContent />
    </div>
  );
}
