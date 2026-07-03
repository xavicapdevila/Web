import type { Metadata } from "next";
import Script from "next/script";
import { getCachedPropertiesList } from "@/lib/sync";
import ZonaPageContent, { type ZonaConfig } from "../zona/[ciudad]/ZonaPageContent";

const BASE_URL = "https://www.thevilahome.com";
const PAGE_URL = `${BASE_URL}/pisos-en-venta-vilanova-i-la-geltru`;

// Página transaccional SEO ("pisos en venta vilanova…"). Reutiliza el diseño
// de las páginas de zona con contenido propio orientado a esta búsqueda.
const CONFIG: ZonaConfig = {
  ciudad: "vilanova",
  nombre: "Vilanova i la Geltrú",
  titulo: "Pisos en venta en Vilanova i la Geltrú",
  descripcionCorta:
    "Catálogo sincronizado cada hora con nuestra base: si lo ves publicado, está disponible.",
  descripcionLarga:
    "El mercado de pisos de Vilanova i la Geltrú se mueve entre los 2.000 y los 2.800 €/m² según zona y estado: del casco histórico y La Geltrú a la fachada marítima de Ribes Roges, pasando por los barrios de ensanche. Publicamos cada vivienda con lo que necesitas para decidir desde casa — fotos profesionales y, en muchas fichas, vídeo o tour virtual — y retiramos los anuncios en cuanto la operación avanza: no dejamos pisos vendidos publicados para pescar llamadas, una práctica demasiado habitual en los portales. Lo que ves es lo que hay.",
  metaTitle: "Pisos en venta en Vilanova i la Geltrú — Catálogo al día",
  metaDescription:
    "Pisos en venta en Vilanova i la Geltrú con el catálogo actualizado cada hora y precios reales por zona. Si está publicado, está disponible.",
  cp: "08800",
  lat: 41.2183,
  lng: 1.7266,
  mercado: {
    precio: "2.000–2.800 €/m²",
    tipos: "Pisos, áticos, casas unifamiliares",
    perfil: "Primera vivienda, inversión local",
  },
  faq: [
    {
      q: "¿Cada cuánto se actualiza este catálogo?",
      a: "Cada hora, directamente desde nuestra base de datos. Cuando un piso queda reservado lo marcamos, y cuando se vende desaparece. Si está publicado, puedes visitarlo.",
    },
    {
      q: "¿Puedo ver un piso sin desplazarme a Vilanova?",
      a: "En muchas fichas encontrarás vídeo o tour virtual para hacer una primera criba desde casa. Y si vienes de lejos, agrupamos varias visitas en un mismo día para que el viaje valga la pena.",
    },
    {
      q: "¿Y si no encuentro nada que encaje?",
      a: "Dínoslo. Sabemos qué va a salir al mercado antes de que se publique, y si nos cuentas qué buscas te avisamos cuando entre algo que encaje — por WhatsApp, sin darte de alta en nada.",
    },
    {
      q: "¿Piso o casa?",
      a: "En Vilanova el salto de piso a casa unifamiliar es más asequible que en otros municipios de costa. Si dudas, ven a ver ambos formatos en un mismo día y compara con datos: precio por metro, gastos de comunidad, IBI y mantenimiento real.",
    },
  ],
  cercanas: ["sitges", "cubelles", "sant-pere-de-ribes"],
};

const CERCANAS = [
  { slug: "sitges", nombre: "Sitges", descripcionCorta: "Municipio de referencia en la costa del Garraf. Lujo, internacionalidad y vida cultural." },
  { slug: "cubelles", nombre: "Cubelles", descripcionCorta: "Primera línea de mar tranquila. Precios accesibles y buena comunicación." },
  { slug: "sant-pere-de-ribes", nombre: "Sant Pere de Ribes", descripcionCorta: "Calma, naturaleza y urbanizaciones en el interior del Garraf." },
];

export const metadata: Metadata = {
  title: CONFIG.metaTitle,
  description: CONFIG.metaDescription,
  keywords: [
    "pisos en venta Vilanova i la Geltrú",
    "pisos en venta en Vilanova",
    "piso en venta Vilanova i la Geltrú",
    "áticos en venta Vilanova",
    "comprar piso Vilanova i la Geltrú",
    "inmobiliaria Vilanova i la Geltrú",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "The Vila Home",
    locale: "es_ES",
    title: CONFIG.metaTitle,
    description: CONFIG.metaDescription,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: CONFIG.metaTitle }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevilahome",
    title: CONFIG.metaTitle,
    description: CONFIG.metaDescription,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

export const revalidate = 3600;

export default async function PisosEnVentaVilanovaPage() {
  const { properties, total } = await getCachedPropertiesList({
    ciudad: CONFIG.ciudad,
    limit: 12,
    page: 1,
  });

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "The Vila Home",
    description:
      "Inmobiliaria en Vilanova i la Geltrú. Pisos en venta con catálogo actualizado cada hora, fotos profesionales y tours virtuales.",
    url: BASE_URL,
    telephone: "+34936061800",
    email: "info@thevilahome.com",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Francesc Macià 48",
      addressLocality: "Vilanova i la Geltrú",
      addressRegion: "Barcelona",
      postalCode: "08800",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: CONFIG.lat, longitude: CONFIG.lng },
    areaServed: { "@type": "City", name: "Vilanova i la Geltrú" },
    sameAs: [
      "https://www.instagram.com/thevilahome",
      "https://www.facebook.com/profile.php?id=100093001283637",
      "https://www.tiktok.com/@thevilahome",
    ],
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${BASE_URL}/propiedades` },
      { "@type": "ListItem", position: 3, name: "Pisos en venta en Vilanova i la Geltrú", item: PAGE_URL },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONFIG.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-pisos-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <Script
        id="schema-pisos-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <Script
        id="schema-pisos-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      <ZonaPageContent zona={CONFIG} properties={properties} total={total} cercanas={CERCANAS} />
    </div>
  );
}
