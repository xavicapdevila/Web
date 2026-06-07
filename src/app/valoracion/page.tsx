import type { Metadata } from "next";
import Script from "next/script";
import ValoracionContent from "@/components/pages/ValoracionContent";

export const metadata: Metadata = {
  title: "Valoración gratuita de tu propiedad",
  description:
    "¿Cuánto vale tu casa en Vilanova i la Geltrú? Obtén una valoración profesional y gratuita basada en datos reales del mercado local. Sin compromiso, respuesta en menos de 24 horas.",
  alternates: { canonical: "https://www.thevilahome.com/valoracion" },
  openGraph: {
    type: "website",
    title: "Valoración gratuita — The Vila Home",
    description: "Descubre cuánto vale tu propiedad en Vilanova, Garraf o Penedès. Valoración real, gratuita y sin compromiso.",
    url: "https://www.thevilahome.com/valoracion",
    siteName: "The Vila Home",
    locale: "es_ES",
    images: [{ url: "https://www.thevilahome.com/og-image.jpg", width: 1200, height: 630, alt: "Valoración gratuita de tu propiedad — The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valoración gratuita — The Vila Home",
    description: "¿Cuánto vale tu casa? Valoración real, gratuita y sin compromiso en Vilanova y el Garraf.",
    images: ["https://www.thevilahome.com/og-image.jpg"],
  },
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto vale mi casa en Vilanova i la Geltrú?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El precio depende de la zona, los metros cuadrados, el estado de conservación y la demanda actual del mercado. En The Vila Home hacemos una valoración gratuita basada en ventas reales realizadas y propiedades activas en tu zona. Contacta con nosotros y te respondemos en menos de 24 horas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es gratuita la valoración de mi propiedad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, la valoración es completamente gratuita y sin compromiso de venta. Puedes solicitar una estimación orientativa online ahora mismo, y si quieres una valoración ajustada a la realidad, uno de nuestros agentes visitará la vivienda sin ningún coste.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda en llegar la valoración?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La estimación orientativa es inmediata. Si solicitas una valoración personalizada, un agente de The Vila Home se pondrá en contacto contigo en menos de 24 horas para acordar una visita.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué documentación necesito para valorar mi piso o casa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para la valoración orientativa no necesitas ningún documento. Para la valoración completa y personalizada, es útil tener la referencia catastral, la superficie en m², el año de construcción y cualquier reforma reciente. Nuestros agentes te guiarán en todo momento.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué zonas realizáis valoraciones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Realizamos valoraciones en Vilanova i la Geltrú, Sitges, Cubelles, Sant Pere de Ribes y en general en toda la comarca del Garraf y el Penedès. Somos especialistas en el mercado local de esta zona.",
      },
    },
  ],
};

export default function ValoracionPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-faq-valoracion"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
      <ValoracionContent />
    </div>
  );
}
