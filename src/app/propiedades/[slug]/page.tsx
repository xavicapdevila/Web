import type { Metadata } from "next";
import Script from "next/script";
import { getCachedPropertyBySlug, getCachedSlugs, getCachedPropertiesList } from "@/lib/sync";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
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
  // Inmueble desactivado (vendido/retirado): estas fichas acumulan visitas desde
  // Google, así que en vez de un 404 seco se sirve una página útil («ya no está
  // disponible» + propiedades similares) con NOINDEX: el visitante se queda y
  // Google la retira del índice. Un error transitorio del feed NO debe marcar
  // noindex (se desindexarían fichas válidas): solo cuando el dato dice null.
  let property;
  try {
    property = await getCachedPropertyBySlug(slug);
  } catch {
    return { title: "Propiedad" };
  }
  if (!property) {
    return {
      title: "Este inmueble ya no está disponible · The Vila Home",
      robots: { index: false, follow: true },
    };
  }
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

    // Vista previa al compartir (WhatsApp/Telegram/redes): SIN precio, para que
    // tengan que entrar a la web a verlo y así generamos tráfico. El precio sí
    // se mantiene en el <title> HTML y la description (Google/SEO), que no son
    // lo que renderiza el enlace compartido.
    const socialTitle = `${property.tipo} en ${property.ciudad}${property.zona ? ` — ${property.zona}` : ""}`;
    const socialDescription = [
      `${property.tipo} en venta en ${property.ciudad}${property.zona ? ` (${property.zona})` : ""}.`,
      features.length ? features.join(", ") + "." : "",
      property.descripcion
        ? property.descripcion.replace(/\n/g, " ").slice(0, 120) + "…"
        : "Descubre el precio y todos los detalles en la ficha.",
    ]
      .filter(Boolean)
      .join(" ");

    const canonicalUrl = `${BASE_URL}/propiedades/${slug}`;

    // Imagen de la vista previa: /propiedades/<slug>/og.jpg (route handler con
    // sharp) — la foto recortada a 1200×630 (1.91:1, WhatsApp la muestra GRANDE)
    // en JPEG de ~100-250 KB, SIN precio. No usar ImageResponse/opengraph-image
    // aquí: solo emite PNG y una foto así pesaba ~1,5 MB, por encima del límite
    // (~600 KB) a partir del cual WhatsApp descarta la imagen del enlace.
    const ogImageUrl = `${BASE_URL}/propiedades/${slug}/og.jpg`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: "The Vila Home",
        locale: "es_ES",
        title: socialTitle,
        description: socialDescription,
        images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/jpeg" }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@thevilahome",
        title: socialTitle,
        description: socialDescription,
        images: [ogImageUrl],
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

// Ficha desactivada: mensaje claro + propiedades activas para aprovechar la
// visita (estas URLs siguen recibiendo tráfico desde Google una temporada).
async function InmuebleNoDisponible() {
  const { properties } = await getCachedPropertiesList({});
  const similares = properties.slice(0, 3);
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">The Vila Home</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-light text-white">
          Este inmueble ya no está disponible
        </h1>
        <p className="mt-4 max-w-xl text-white/60 leading-relaxed">
          Lo más probable es que ya se haya vendido. Pero seguimos teniendo propiedades que podrían
          encajarte — y si buscas algo concreto, cuéntanoslo y te avisamos cuando entre en cartera.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/propiedades"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            Ver propiedades disponibles
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Cuéntanos qué buscas
          </Link>
        </div>

        {similares.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-lg font-light text-white/80">Ahora mismo en venta</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similares.map((p) => (
                <PropertyCard key={p.ref} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getCachedPropertyBySlug(slug);
  if (!property) return <InmuebleNoDisponible />;

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
