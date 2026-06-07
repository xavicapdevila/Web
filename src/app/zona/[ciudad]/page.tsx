import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { getCachedPropertiesList } from "@/lib/sync";
import PropertyCard from "@/components/properties/PropertyCard";

const BASE_URL = "https://www.thevilahome.com";

interface ZonaConfig {
  ciudad: string;
  nombre: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  metaTitle: string;
  metaDescription: string;
  cp?: string;
  lat: number;
  lng: number;
}

const ZONAS: Record<string, ZonaConfig> = {
  "vilanova": {
    ciudad: "vilanova",
    nombre: "Vilanova i la Geltrú",
    titulo: "Inmobiliaria en Vilanova i la Geltrú",
    descripcionCorta: "Capital del Garraf. Playa, centro histórico y buen acceso a Barcelona.",
    descripcionLarga:
      "Vilanova i la Geltrú es la capital de la comarca del Garraf, con más de 68.000 habitantes y un perfil de ciudad equilibrada: playa, comercio local, servicios completos y conexión directa con Barcelona en 50 minutos por tren. El mercado inmobiliario ofrece pisos de dos y tres habitaciones, áticos con vistas al mar, casas unifamiliares y chalets en urbanizaciones tranquilas. Los precios son más accesibles que en municipios como Sitges, lo que la convierte en una opción muy valorada por compradores de primera vivienda y familias que buscan calidad de vida sin renunciar a la ciudad.",
    metaTitle: "Inmobiliaria en Vilanova i la Geltrú — Pisos y casas en venta",
    metaDescription:
      "Pisos, casas y chalets en venta en Vilanova i la Geltrú. The Vila Home es tu inmobiliaria local en el Garraf: cercanos, honestos y con presencia real en cada operación.",
    cp: "08800",
    lat: 41.2183,
    lng: 1.7266,
  },
  "sitges": {
    ciudad: "sitges",
    nombre: "Sitges",
    titulo: "Inmobiliaria en Sitges",
    descripcionCorta: "Municipio de referencia en la costa del Garraf. Lujo, internacionalidad y vida cultural.",
    descripcionLarga:
      "Sitges es uno de los destinos residenciales más codiciados de la costa catalana. Conocido por su festival de cine, sus playas, su casco histórico y su comunidad internacional, el mercado inmobiliario de Sitges mueve propiedades de alto standing: villas con piscina y vistas al mar, apartamentos en el pueblo histórico y casas en urbanizaciones exclusivas como Terramar o Vallpineda. El perfil comprador es variado: inversores, familias con alto poder adquisitivo y expatriados. El precio por metro cuadrado está entre los más altos de la comarca.",
    metaTitle: "Inmobiliaria en Sitges — Pisos, villas y casas en venta",
    metaDescription:
      "Propiedades en venta en Sitges: villas, apartamentos y casas de lujo. The Vila Home, tu agencia inmobiliaria de referencia en el Garraf.",
    cp: "08870",
    lat: 41.2371,
    lng: 1.8054,
  },
  "cubelles": {
    ciudad: "cubelles",
    nombre: "Cubelles",
    titulo: "Inmobiliaria en Cubelles",
    descripcionCorta: "Primera línea de mar tranquila. Precios accesibles y buena comunicación.",
    descripcionLarga:
      "Cubelles es un municipio costero de la comarca del Garraf que combina tranquilidad residencial con acceso directo al mar. Sus playas, su núcleo antiguo y sus urbanizaciones tranquilas lo convierten en una opción ideal para familias y personas que buscan una segunda residencia cerca de Barcelona sin el precio de Sitges. El mercado ofrece pisos con terraza, casas de planta baja y chalets en urbanizaciones con piscina comunitaria. La conexión en tren a Barcelona es directa y la oferta gastronómica y de servicios está en pleno crecimiento.",
    metaTitle: "Inmobiliaria en Cubelles — Pisos y casas en venta",
    metaDescription:
      "Pisos, casas y apartamentos en venta en Cubelles. The Vila Home, especialistas inmobiliarios en el Garraf y la costa del Penedès.",
    cp: "08880",
    lat: 41.2103,
    lng: 1.6699,
  },
  "sant-pere-de-ribes": {
    ciudad: "sant pere",
    nombre: "Sant Pere de Ribes",
    titulo: "Inmobiliaria en Sant Pere de Ribes",
    descripcionCorta: "Calma, naturaleza y urbanizaciones en el interior del Garraf.",
    descripcionLarga:
      "Sant Pere de Ribes es uno de los municipios con mayor extensión del Garraf e incluye núcleos tan conocidos como Ribes de Freser, Les Roquetes y Canyelles. Es el destino favorito para quienes buscan una casa con jardín, una urbanización tranquila o un chalet con amplio espacio exterior, sin alejarse demasiado de la costa ni de Barcelona. El mercado inmobiliario ofrece principalmente casas unifamiliares, pareadas y chalets en urbanizaciones bien comunicadas con acceso a la autopista AP-7 y la C-15.",
    metaTitle: "Inmobiliaria en Sant Pere de Ribes — Casas y chalets en venta",
    metaDescription:
      "Casas, chalets y urbanizaciones en venta en Sant Pere de Ribes. The Vila Home, tu agencia inmobiliaria local en el Garraf.",
    cp: "08810",
    lat: 41.2644,
    lng: 1.7651,
  },
};

interface Props {
  params: Promise<{ ciudad: string }>;
}

export function generateStaticParams() {
  return Object.keys(ZONAS).map((slug) => ({ ciudad: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ciudad } = await params;
  const zona = ZONAS[ciudad];
  if (!zona) return { title: "Zona no encontrada" };

  const canonicalUrl = `${BASE_URL}/zona/${ciudad}`;
  return {
    title: zona.metaTitle,
    description: zona.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "The Vila Home",
      locale: "es_ES",
      title: zona.metaTitle,
      description: zona.metaDescription,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: zona.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@thevilahome",
      title: zona.metaTitle,
      description: zona.metaDescription,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export const revalidate = 3600;

export default async function ZonaPage({ params }: Props) {
  const { ciudad } = await params;
  const zona = ZONAS[ciudad];
  if (!zona) notFound();

  const { properties, total } = await getCachedPropertiesList({
    ciudad: zona.ciudad,
    limit: 12,
    page: 1,
  });

  const canonicalUrl = `${BASE_URL}/zona/${ciudad}`;

  const schemaLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "The Vila Home",
    description: `Inmobiliaria especializada en ${zona.nombre}. Venta de pisos, casas y chalets en el Garraf y Penedès.`,
    url: BASE_URL,
    telephone: "+34936061800",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Francesc Macià 48",
      addressLocality: "Vilanova i la Geltrú",
      addressRegion: "Barcelona",
      postalCode: "08800",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: zona.lat, longitude: zona.lng },
    areaServed: { "@type": "City", name: zona.nombre },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${BASE_URL}/propiedades` },
      { "@type": "ListItem", position: 3, name: zona.nombre, item: canonicalUrl },
    ],
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-zona"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }}
      />
      <Script
        id="schema-breadcrumb-zona"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="text-[#555] text-xs font-body tracking-wide mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C9B99A] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-[#C9B99A] transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-[#888]">{zona.nombre}</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl text-white font-light mb-3">
            {zona.titulo}
          </h1>
          <p className="text-[#666] text-sm font-body max-w-xl">
            {zona.descripcionCorta}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-14">
          {/* Properties */}
          <div className="flex-1">
            {properties.length > 0 ? (
              <>
                <p className="text-[#666] text-sm font-body mb-6">
                  {total} {total === 1 ? "propiedad encontrada" : "propiedades encontradas"} en {zona.nombre}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property, i) => (
                    <PropertyCard key={property.id} property={property} priority={i < 2} />
                  ))}
                </div>
                {total > 12 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/propiedades?ciudad=${encodeURIComponent(zona.nombre)}`}
                      className="inline-block px-8 py-3 border border-[#C9B99A]/40 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
                    >
                      Ver todas las propiedades en {zona.nombre}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="font-display text-3xl text-[#444] mb-4">Sin propiedades disponibles</p>
                <p className="text-[#666] text-sm mb-8">
                  Actualmente no tenemos propiedades listadas en {zona.nombre}, pero trabajamos en esta zona.
                </p>
                <Link
                  href="/contacto"
                  className="inline-block px-8 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
                >
                  Contacta con nosotros
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar — local info */}
          <aside className="lg:w-80 shrink-0">
            <div className="border border-[#1e1e1e] p-6 mb-6">
              <h2 className="font-display text-xl text-white font-light mb-4">
                Sobre {zona.nombre}
              </h2>
              <p className="text-[#888] text-sm leading-relaxed">
                {zona.descripcionLarga}
              </p>
            </div>

            <div className="border border-[#C9B99A]/20 p-6 bg-[#0d0d0d]">
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C9B99A]/50 pointer-events-none" />
              <p className="text-[#888] text-xs font-body tracking-[0.2em] uppercase mb-3">
                ¿Buscas o vendes en {zona.nombre}?
              </p>
              <p className="text-[#ccc] text-sm mb-5 leading-relaxed">
                Cuéntanos tu situación y te damos una opinión honesta, sin compromiso.
              </p>
              <Link
                href="/contacto"
                className="block text-center px-6 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors mb-3"
              >
                Contactar
              </Link>
              <Link
                href="/valoracion"
                className="block text-center px-6 py-3 border border-[#C9B99A]/30 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
              >
                Valorar mi casa
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
