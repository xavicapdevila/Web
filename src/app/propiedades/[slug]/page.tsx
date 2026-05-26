import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getPropertyBySlug, getAllPropertySlugs } from "@/lib/sync";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyPageContent from "@/components/properties/PropertyPageContent";
import { formatPrice } from "@/lib/utils";

const BASE_URL = "https://www.thevilahome.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = getAllPropertySlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const property = getPropertyBySlug(slug);
    if (!property) return { title: "Propiedad no encontrada" };

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
    const ogImage = property.imagenes[0]?.url ?? `${BASE_URL}/og-image.jpg`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 800,
            alt: `${property.tipo} en ${property.ciudad} — Ref. ${property.ref}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Propiedad" };
  }
}

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;

  let property;
  try {
    property = getPropertyBySlug(slug);
  } catch {
    notFound();
  }

  if (!property) notFound();

  const isReserved = property.estadoFicha === 7;

  // Assign agent based on email or default
  const agents = {
    "a.garcia@thevilahome.com": { name: "Ariadna Garcia", photo: "/images/agents/ariadna.jpg" },
    "x.capdevila@thevilahome.com": { name: "Xavier Capdevila", photo: "/images/agents/xavier.jpg" },
    "s.pascual@thevilahome.com": { name: "Sofía Pascual", photo: "/images/agents/sofia.jpg" },
  };
  const agentKey = (property.agenteEmail ?? "") as keyof typeof agents;
  const agentInfo = agents[agentKey] ?? {
    name: property.agente ?? "The Vila Home",
    photo: "/images/agents/placeholder.jpg",
  };

  const contactEmail = agentKey && agents[agentKey]
    ? agentKey
    : "info@thevilahome.com";

  const agentMobiles: Record<string, string> = {
    "a.garcia@thevilahome.com": "34680526196",
    "x.capdevila@thevilahome.com": "34638359612",
    "s.pascual@thevilahome.com": "34679876331",
  };
  const waNumber = agentMobiles[agentKey] ?? "34638359612";
  const waMessage = encodeURIComponent(
    `Hola, he visto la propiedad ${property.titulo} (Ref. ${property.ref}) en vuestra web y me gustaría recibir más información.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

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

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-property"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PropertyGallery
        images={property.imagenes}
        video={property.video1}
        tour={property.tour}
        title={property.titulo}
        ciudad={property.ciudad}
        tipo={property.tipo}
      />
      <PropertyPageContent
        property={property}
        agentInfo={agentInfo}
        contactEmail={contactEmail}
        waUrl={waUrl}
        isReserved={isReserved}
      />
    </div>
  );
}
