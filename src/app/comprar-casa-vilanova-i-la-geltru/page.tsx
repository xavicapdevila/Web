import type { Metadata } from "next";
import Script from "next/script";
import { getCachedPropertiesList } from "@/lib/sync";
import ZonaPageContent, { type ZonaConfig } from "../zona/[ciudad]/ZonaPageContent";

const BASE_URL = "https://www.thevilahome.com";
const PAGE_URL = `${BASE_URL}/comprar-casa-vilanova-i-la-geltru`;

// Página transaccional SEO ("comprar casa vilanova…"). Reutiliza el diseño de
// las páginas de zona con contenido propio orientado a compradores.
const CONFIG: ZonaConfig = {
  ciudad: "vilanova",
  nombre: "Vilanova i la Geltrú",
  titulo: "Comprar casa en Vilanova i la Geltrú",
  descripcionCorta:
    "Lo que hay en venta ahora mismo, lo que cuesta de verdad y qué gastos vienen después. Sin sorpresas a mitad de camino.",
  descripcionLarga:
    "Comprar en Vilanova i la Geltrú es comprar en la capital del Garraf: playa, centro histórico con comercio real y tren directo a Barcelona en unos 50 minutos. Aquí conviven pisos de dos y tres habitaciones en el centro, áticos con vistas al mar y casas unifamiliares en zonas tranquilas, con precios todavía por debajo de Sitges. Nuestro trabajo con compradores es el mismo que con vendedores: información completa antes de que te enamores — estado real del inmueble, gastos de comunidad, cargas y documentación revisada — y un único asesor que te acompaña desde la primera visita hasta las llaves, incluida la búsqueda de hipoteca con bróker si la necesitas.",
  metaTitle: "Comprar casa en Vilanova i la Geltrú — Propiedades y guía honesta",
  metaDescription:
    "Casas y pisos en venta en Vilanova i la Geltrú con precios reales por zona, gastos claros desde el primer día y un único asesor de la visita a las llaves.",
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
      q: "¿Qué gastos tiene comprar una casa en Vilanova i la Geltrú?",
      a: "Además del precio de compra, calcula entre un 10 % y un 12 % adicional: el impuesto de transmisiones (ITP) en vivienda de segunda mano, notaría, registro y gestoría. Si necesitas hipoteca, añade la tasación. Te damos el desglose completo de tu caso antes de firmar nada, no después.",
    },
    {
      q: "¿Me ayudáis a conseguir hipoteca?",
      a: "Sí. Trabajamos con bróker hipotecario para comparar condiciones entre varios bancos y defender tu perfil. Tú decides con qué oferta quedarte — y si tu banco de siempre mejora la propuesta, adelante con él.",
    },
    {
      q: "¿Cómo son las visitas?",
      a: "Sin guion de venta. Vas a ver la vivienda con el asesor que la lleva y que conoce sus datos reales: comunidad, derramas previstas, cargas y estado de la documentación. Preferimos que descartes una casa en la primera visita a que descubras un problema después de las arras.",
    },
    {
      q: "¿Qué zona de Vilanova me conviene?",
      a: "Depende de lo que priorices: el centro y La Geltrú para vivir a pie de comercio, la fachada marítima de Ribes Roges si quieres el mar cerca, y las zonas altas y urbanizaciones si buscas espacio y tranquilidad. Cuéntanos cómo vives y te decimos dónde encajas — también si la respuesta es un municipio vecino.",
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
    "comprar casa Vilanova i la Geltrú",
    "comprar casa en Vilanova",
    "comprar piso Vilanova i la Geltrú",
    "casas en venta Vilanova i la Geltrú",
    "comprar vivienda Vilanova",
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

export default async function ComprarCasaVilanovaPage() {
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
      "Inmobiliaria en Vilanova i la Geltrú. Acompañamos a compradores de la primera visita a las llaves: documentación revisada, gastos claros y bróker hipotecario.",
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
      { "@type": "ListItem", position: 3, name: "Comprar casa en Vilanova i la Geltrú", item: PAGE_URL },
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
        id="schema-comprar-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <Script
        id="schema-comprar-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <Script
        id="schema-comprar-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      <ZonaPageContent zona={CONFIG} properties={properties} total={total} cercanas={CERCANAS} />
    </div>
  );
}
