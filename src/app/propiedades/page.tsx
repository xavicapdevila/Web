import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropiedadesHeader from "@/components/properties/PropiedadesHeader";
import { getCachedPropertiesList } from "@/lib/sync";
import { formatPrice } from "@/lib/utils";

const BASE_URL = "https://www.thevilahome.com";

export const metadata: Metadata = {
  title: "Propiedades en venta en Vilanova i la Geltrú y el Garraf",
  description:
    "Explora el catálogo completo de propiedades en venta de The Vila Home: pisos, casas, chalets, áticos y terrenos en Vilanova i la Geltrú, Sitges, Cubelles, Garraf y Penedès.",
  alternates: { canonical: "https://www.thevilahome.com/propiedades" },
  openGraph: {
    type: "website",
    title: "Propiedades en venta — The Vila Home",
    description: "Pisos, casas, chalets y áticos en el Garraf y Penedès. Catálogo actualizado con las últimas propiedades.",
    url: "https://www.thevilahome.com/propiedades",
    siteName: "The Vila Home",
    locale: "es_ES",
    images: [{ url: "https://www.thevilahome.com/og-image.jpg", width: 1200, height: 630, alt: "Propiedades en venta — The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propiedades en venta — The Vila Home",
    description: "Pisos, casas, chalets y áticos en el Garraf y Penedès.",
    images: ["https://www.thevilahome.com/og-image.jpg"],
  },
};

// Keep force-dynamic so filters (searchParams) are always respected.
// Data now comes from the Vercel Data Cache (XML), not from SQLite,
// so cold-container delays are eliminated.
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    tipo?: string;
    subtipo?: string;
    precioMin?: string;
    precioMax?: string;
    habitaciones?: string;
    m2Min?: string;
    ciudad?: string;
    page?: string;
  }>;
}

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 12;

  // getCachedPropertiesList reads from the Vercel Data Cache (XML feed).
  // It is shared across ALL Lambda instances, so cold containers return
  // cached data immediately — no Blob restore or SQLite needed.
  const { properties, total } = await getCachedPropertiesList({
    tipo:        params.tipo,
    subtipo:     params.subtipo,
    precioMin:   params.precioMin   ? Number(params.precioMin)   : undefined,
    precioMax:   params.precioMax   ? Number(params.precioMax)   : undefined,
    habitaciones:params.habitaciones ? Number(params.habitaciones): undefined,
    m2Min:       params.m2Min       ? Number(params.m2Min)       : undefined,
    ciudad:      params.ciudad,
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades en venta", item: `${BASE_URL}/propiedades` },
    ],
  };

  const schemaItemList = properties.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Propiedades en venta — The Vila Home",
    url: `${BASE_URL}/propiedades`,
    numberOfItems: total,
    itemListElement: properties.map((p, i) => ({
      "@type": "ListItem",
      position: (page - 1) * 12 + i + 1,
      name: `${p.tipo} en ${p.ciudad}${p.zona ? ` — ${p.zona}` : ""}`,
      url: `${BASE_URL}/propiedades/${p.slug}`,
      description: `${p.tipo} en venta en ${p.ciudad}. ${formatPrice(p.precio)}.`,
    })),
  } : null;

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-breadcrumb-propiedades"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      {schemaItemList && (
        <Script
          id="schema-item-list"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }}
        />
      )}
      {/* Page header */}
      <PropiedadesHeader total={total} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters sidebar */}
          <Suspense fallback={<div className="w-72 h-96 bg-[#111] animate-pulse" />}>
            <PropertyFilters />
          </Suspense>

          {/* Property grid — Suspense required by Next.js for components using useSearchParams() */}
          <div className="flex-1">
            <Suspense fallback={<div className="flex-1 h-96 bg-[#111] animate-pulse" />}>
              <PropertyGrid
                properties={properties}
                total={total}
                page={page}
                totalPages={totalPages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
