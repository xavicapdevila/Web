import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getCachedPropertyBySlug, getCachedSlugs } from "@/lib/sync";
import { getAgentInfo } from "@/lib/agents";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyPageContent from "@/components/properties/PropertyPageContent";
import { formatPrice } from "@/lib/utils";

const BASE_URL = "https://www.thevilahome.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCachedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // notFound() aquí (y no solo en la página): con streaming (loading.tsx) la
  // respuesta ya ha salido con 200 cuando la página lanza el 404 → Google lo
  // ve como soft-404 y deja de indexar bien /propiedades. generateMetadata se
  // resuelve ANTES de transmitir, así el inmueble vendido/retirado devuelve un
  // 404 real. Un error transitorio del feed NO debe dar 404 (se desindexarían
  // fichas válidas): solo se lanza cuando el dato responde "no existe" (null).
  let property;
  try {
    property = await getCachedPropertyBySlug(slug);
  } catch {
    return { title: "Propiedad" };
  }
  if (!property) notFound();
  try {
    const features: string[] = [];
    if (property.habitaciones) features.push(`${property.habitaciones} hab.`);
    if (property.banos) features.push(`${property.banos} baños`);
    if (property.m2Construidos) features.push(`${Math.round(property.m2Construidos)} m²`);

    const title = `${property.tipo} en ${property.ciudad}${property.zona ? ` — ${property.zona}` : ""} · ${formatPrice(property.precio)}`;
    const description = [
      `${property.tipo} en venta en ${property.ciudad}${property.zona ? ` (${property.zona})` : ""}.`,
      features.length ? features.join(", ") + "." : "",
      `Precio: ${formatPrice(property.precio)}.`,
      property.descripcion
        ? property.descripcion.replace(/\n/g, " ").slice(0, 120) + "…"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const canonicalUrl = `${BASE_URL}/propiedades/${slug}`;
    // Use the first property photo directly — most reliable for WhatsApp/Telegram scrapers
    const ogImage = property.imagenes[0]?.url ?? `${BASE_URL}/og-image.jpg`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: "The Vila Home",
        locale: "es_ES",
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${property.tipo} en ${property.ciudad} — Ref. ${property.ref}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@thevilahome",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Propiedad" };
  }
}

// ISR: revalidate every hour so price/status changes propagate quickly
export const revalidate = 3600;
// Allow on-demand generation for slugs not in generateStaticParams
export const dynamicParams = true;

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getCachedPropertyBySlug(slug);
  if (!property) notFound();

  const isReserved = property.estadoFicha === 7;

  // Resolve agent from centralised config (src/lib/agents.ts)
  const { name: agentName, photo: agentPhoto, contactEmail } = getAgentInfo(property.agenteEmail);
  const agentInfo = { name: agentName, photo: agentPhoto };

  const canonicalUrl = `${BASE_URL}/propiedades/${slug}`;

  // JSON-LD RealEstateListing
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": canonicalUrl,
    name: property.titulo,
    description: property.descripcion
      ? property.descripcion.replace(/\n/g, " ").slice(0, 300)
      : `${property.tipo} en venta en ${property.ciudad}`,
    url: canonicalUrl,
    datePosted: property.fecha,
    price: property.precio,
    priceCurrency: "EUR",
    image: property.imagenes.slice(0, 5).map((img) => img.url),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.ciudad,
      addressRegion: property.provincia ?? "Barcelona",
      postalCode: property.cp ?? "08800",
      addressCountry: "ES",
      ...(property.zona ? { streetAddress: property.zona } : {}),
    },
    offeredBy: {
      "@type": "RealEstateAgent",
      "@id": `${BASE_URL}/#organization`,
      name: "The Vila Home",
      url: BASE_URL,
      telephone: "+34936061800",
    },
  };

  if (property.habitaciones) schema.numberOfRooms = property.habitaciones;
  if (property.banos) schema.numberOfBathroomsTotal = property.banos;
  if (property.m2Construidos) {
    schema.floorSize = {
      "@type": "QuantitativeValue",
      value: Math.round(property.m2Construidos),
      unitCode: "MTK",
      unitText: "m²",
    };
  }
  if (property.m2Parcela) {
    schema.lotSize = {
      "@type": "QuantitativeValue",
      value: Math.round(property.m2Parcela),
      unitCode: "MTK",
      unitText: "m²",
    };
  }

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio",      item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${BASE_URL}/propiedades` },
      { "@type": "ListItem", position: 3, name: property.titulo, item: canonicalUrl },
    ],
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-property"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <PropertyGallery
        images={property.imagenes}
        video={property.video1}
        tour={property.tour}
        title={property.titulo}
        ciudad={property.ciudad}
        tipo={property.tipo}
        planoPins={property.planoPins}
      />
      <PropertyPageContent
        property={property}
        agentInfo={agentInfo}
        contactEmail={contactEmail}
        isReserved={isReserved}
      />
    </div>
  );
}
