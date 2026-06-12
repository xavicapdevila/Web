import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getBlogPosts } from "@/lib/blog";
import BlogContent from "@/components/pages/BlogContent";
import { getAllVisitCounts } from "@/lib/visits";

const BASE_URL = "https://www.thevilahome.com";

interface CatConfig {
  nombre: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

const CATEGORIAS: Record<string, CatConfig> = {
  "mercado": {
    nombre: "Mercado",
    slug: "mercado",
    metaTitle: "Mercado inmobiliario en Vilanova i la Geltrú — Blog The Vila Home",
    metaDescription: "Análisis y tendencias del mercado inmobiliario en Vilanova, Garraf y Penedès. Precios, demanda y oportunidades de compraventa en la costa de Barcelona.",
  },
  "procesos": {
    nombre: "Procesos",
    slug: "procesos",
    metaTitle: "Procesos de compraventa inmobiliaria — Blog The Vila Home",
    metaDescription: "Guías paso a paso sobre los procesos de compra y venta de vivienda en España: desde la oferta hasta la firma en notaría.",
  },
  "documentacion": {
    nombre: "Documentación",
    slug: "documentacion",
    metaTitle: "Documentación para comprar o vender una casa — Blog The Vila Home",
    metaDescription: "Qué documentos necesitas para comprar o vender una vivienda en España. Contratos, certificados, escrituras y trámites explicados de forma clara.",
  },
  "hipotecas": {
    nombre: "Hipotecas",
    slug: "hipotecas",
    metaTitle: "Hipotecas en Vilanova i la Geltrú y el Garraf — Blog The Vila Home",
    metaDescription: "Todo sobre hipotecas: tipos de interés, requisitos, simuladores y consejos para conseguir la mejor financiación en la comarca del Garraf.",
  },
  "impuestos": {
    nombre: "Impuestos",
    slug: "impuestos",
    metaTitle: "Impuestos al comprar o vender una vivienda — Blog The Vila Home",
    metaDescription: "ITP, AJD, plusvalía municipal, IRPF y todos los impuestos que afectan a la compraventa de vivienda en Cataluña. Guía actualizada.",
  },
  "herencias": {
    nombre: "Herencias",
    slug: "herencias",
    metaTitle: "Herencias e inmuebles — Blog The Vila Home",
    metaDescription: "Qué hacer cuando heredas una vivienda: impuesto de sucesiones, aceptación de herencia, venta de inmuebles heredados y plazos en Cataluña.",
  },
  "consejos": {
    nombre: "Consejos",
    slug: "consejos",
    metaTitle: "Consejos inmobiliarios para comprar y vender — Blog The Vila Home",
    metaDescription: "Consejos prácticos para vender tu casa al mejor precio y para comprar sin errores. Recomendaciones de expertos inmobiliarios locales.",
  },
  "vivir-en": {
    nombre: "Vivir en...",
    slug: "vivir-en",
    metaTitle: "Vivir en el Garraf y Penedès — Blog The Vila Home",
    metaDescription: "Guías sobre vivir en Vilanova i la Geltrú, Sitges, Cubelles y el Garraf: barrios, servicios, transporte y calidad de vida en la costa de Barcelona.",
  },
};

const SLUG_TO_CATEGORIA: Record<string, string> = {
  "mercado": "Mercado",
  "procesos": "Procesos",
  "documentacion": "Documentación",
  "hipotecas": "Hipotecas",
  "impuestos": "Impuestos",
  "herencias": "Herencias",
  "consejos": "Consejos",
  "vivir-en": "Vivir en...",
};

interface Props {
  params: Promise<{ cat: string }>;
}

export function generateStaticParams() {
  return Object.keys(CATEGORIAS).map((cat) => ({ cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const config = CATEGORIAS[cat];
  if (!config) return { title: "Categoría no encontrada" };

  const canonicalUrl = `${BASE_URL}/blog/categoria/${cat}`;
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "The Vila Home",
      locale: "es_ES",
      title: config.metaTitle,
      description: config.metaDescription,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: config.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@thevilahome",
      title: config.metaTitle,
      description: config.metaDescription,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export const revalidate = 300;

export default async function BlogCategoriaPage({ params }: Props) {
  const { cat } = await params;
  const config = CATEGORIAS[cat];
  if (!config) notFound();

  const categoriaDB = SLUG_TO_CATEGORIA[cat];
  const canonicalUrl = `${BASE_URL}/blog/categoria/${cat}`;

  // All posts are passed down; BlogContent filters by category client-side
  // so switching tabs is instant. SSR still renders only this category.
  let posts: import("@/lib/blog").BlogPost[] = [];
  let visitCounts: Record<string, number> = {};
  try {
    const [result, counts] = await Promise.all([
      getBlogPosts(500, 0),
      getAllVisitCounts(),
    ]);
    posts = result.posts;
    visitCounts = counts;
  } catch {
    // store not ready
  }

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: config.nombre, item: canonicalUrl },
    ],
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <h1 className="sr-only">{config.metaTitle}</h1>
      <Script
        id="schema-breadcrumb-blog-cat"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      <BlogContent posts={posts} visitCounts={visitCounts} currentCategory={categoriaDB} />
    </div>
  );
}
