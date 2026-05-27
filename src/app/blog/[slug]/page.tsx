import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getBlogPostBySlug, getBlogPosts, getRelatedPosts } from "@/lib/blog";
import BlogPostClient from "@/components/blog/BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.thevilahome.com";

export async function generateStaticParams() {
  try {
    const { posts } = await getBlogPosts(100, 0);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) return { title: "Artículo no encontrado" };
    const canonicalUrl = `${BASE_URL}/blog/${slug}`;
    const ogImage = post.imagen ?? `${BASE_URL}/og-image.jpg`;
    return {
      title: post.titulo,
      description:
        post.extracto ??
        `Artículo sobre el mercado inmobiliario en Vilanova i la Geltrú. Publicado por The Vila Home.`,
      ...(post.palabraClave || post.etiquetas.length > 0) && {
        keywords: [
          ...(post.palabraClave ? [post.palabraClave] : []),
          ...post.etiquetas,
        ].join(", "),
      },
      authors: [{ name: "The Vila Home", url: BASE_URL }],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        siteName: "The Vila Home",
        locale: "es_ES",
        title: post.titulo,
        description: post.extracto,
        publishedTime: post.fecha,
        modifiedTime: post.fecha,
        authors: ["The Vila Home"],
        tags: post.etiquetas,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.imagenAlt ?? post.titulo }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@thevilahome",
        creator: "@thevilahome",
        title: post.titulo,
        description: post.extracto,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.etiquetas, post.categoria, 3);
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const ogImage = post.imagen ?? `${BASE_URL}/og-image.jpg`;

  const wordCount = post.contenido ? post.contenido.split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  const schemaBlogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: post.titulo,
    description: post.extracto,
    url: canonicalUrl,
    datePublished: post.fecha,
    dateModified: post.fecha,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      ...(post.imagenAlt && { caption: post.imagenAlt }),
    },
    author: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "The Vila Home",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "The Vila Home",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    ...((post.palabraClave || post.etiquetas.length > 0) && {
      keywords: [
        ...(post.palabraClave ? [post.palabraClave] : []),
        ...post.etiquetas,
      ].join(", "),
    }),
    ...(post.categoria && { articleSection: post.categoria }),
    inLanguage: "es-ES",
    ...(wordCount > 0 && {
      wordCount,
      timeRequired: `PT${readingMinutes}M`,
    }),
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio",  item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog",    item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.titulo, item: canonicalUrl },
    ],
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-blog-posting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBlogPosting) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <BlogPostClient post={post} related={related} />
    </div>
  );
}
