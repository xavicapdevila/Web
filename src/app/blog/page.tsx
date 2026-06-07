import type { Metadata } from "next";
import Script from "next/script";
import { getBlogPosts } from "@/lib/blog";
import { getAllVisitCounts } from "@/lib/visits";
import BlogContent from "@/components/pages/BlogContent";

const BASE_URL = "https://www.thevilahome.com";

export const metadata: Metadata = {
  title: "Blog inmobiliario",
  description:
    "Artículos y guías sobre el mercado inmobiliario en Vilanova i la Geltrú y el Garraf: consejos para vender bien, guías para compradores, hipotecas y análisis de tendencias.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    type: "website",
    title: "Blog inmobiliario — The Vila Home",
    description: "Consejos, guías y análisis del mercado inmobiliario en Vilanova i la Geltrú.",
    url: `${BASE_URL}/blog`,
    siteName: "The Vila Home",
    locale: "es_ES",
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Blog inmobiliario — The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog inmobiliario — The Vila Home",
    description: "Consejos, guías y análisis del mercado inmobiliario en Vilanova i la Geltrú.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

export const revalidate = 300;

export default async function BlogPage() {
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

  const schemaBlog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/blog`,
    name: "Blog inmobiliario — The Vila Home",
    description:
      "Consejos para vender bien, guías para compradores y análisis del mercado inmobiliario en Vilanova i la Geltrú y el Garraf.",
    url: `${BASE_URL}/blog`,
    inLanguage: "es-ES",
    publisher: {
      "@type": "Organization",
      name: "The Vila Home",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
    },
    ...(posts.length > 0 && {
      blogPost: posts.slice(0, 5).map((p: import("@/lib/blog").BlogPost) => ({
        "@type": "BlogPosting",
        "@id": `${BASE_URL}/blog/${p.slug}`,
        headline: p.titulo,
        url: `${BASE_URL}/blog/${p.slug}`,
        datePublished: p.fecha,
        ...(p.extracto && { description: p.extracto }),
        ...(p.categoria && { articleSection: p.categoria }),
      })),
    }),
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <h1 className="sr-only">
        Blog inmobiliario — Consejos, guías y mercado inmobiliario en Vilanova i la Geltrú
      </h1>
      <Script
        id="schema-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBlog) }}
      />
      <BlogContent posts={posts} visitCounts={visitCounts} />
    </div>
  );
}
