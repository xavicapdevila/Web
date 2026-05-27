import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getBlogPostBySlug, getBlogPosts, getRelatedPosts } from "@/lib/blog";
import { formatBlogDate } from "@/lib/utils";
import { CalendarDays, ArrowLeft, Tag } from "lucide-react";

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

      <article className="max-w-3xl mx-auto px-6 lg:px-0 py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[#666] hover:text-[#C9B99A] transition-colors text-sm mb-10"
        >
          <ArrowLeft size={14} />
          Volver al blog
        </Link>

        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {post.categoria && (
            <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-3 py-1">
              {post.categoria}
            </span>
          )}
          {post.etiquetas.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[#C9B99A] text-xs font-body tracking-wide uppercase border border-[#C9B99A]/20 px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl lg:text-5xl text-white font-light leading-tight mb-6">
          {post.titulo}
        </h1>

        {/* Meta: author + date */}
        <div className="flex items-center gap-6 text-[#555] text-sm mb-8 pb-8 border-b border-[#1a1a1a]">
          <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
            The Vila Home
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={13} className="text-[#C9B99A]" />
            {formatBlogDate(post.fecha)}
          </span>
        </div>

        {/* Featured image */}
        {post.imagen && (
          <div className="relative aspect-video overflow-hidden mb-10 border border-[#1a1a1a]">
            <Image
              src={post.imagen}
              alt={post.imagenAlt || post.titulo}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Extracto */}
        {post.extracto && (
          <p className="text-[#ccc] text-lg leading-relaxed mb-8 font-light italic border-l-2 border-[#C9B99A] pl-5">
            {post.extracto}
          </p>
        )}

        {/* Content */}
        {post.contenido && (
          <div
            className="prose prose-invert prose-base max-w-none
              prose-p:text-[#aaa] prose-p:leading-relaxed
              prose-headings:text-white prose-headings:font-display prose-headings:font-light
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-strong:text-white prose-em:text-[#ccc]
              prose-ul:text-[#aaa] prose-ol:text-[#aaa]
              prose-li:marker:text-[#C9B99A]
              prose-a:text-[#C9B99A] prose-a:no-underline hover:prose-a:underline
              prose-hr:border-[#2a2a2a]"
            dangerouslySetInnerHTML={{ __html: post.contenido }}
          />
        )}

        {/* Tags footer */}
        {post.etiquetas.length > 0 && (
          <div className="flex items-center gap-3 mt-12 pt-8 border-t border-[#1a1a1a]">
            <Tag size={13} className="text-[#C9B99A] shrink-0" />
            <div className="flex flex-wrap gap-2">
              {post.etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="text-[#666] text-xs font-body border border-[#1e1e1e] px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#1a1a1a]">
            <h2 className="font-display text-2xl text-white font-light mb-8">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <article
                  key={rel.id}
                  className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Image or placeholder */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#111] overflow-hidden border-b border-[#1e1e1e]">
                    {rel.imagen ? (
                      <Image
                        src={rel.imagen}
                        alt={rel.imagenAlt || rel.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="300px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="font-display text-3xl text-[#C9B99A]/20">
                          {rel.titulo.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {rel.categoria && (
                      <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase mb-2 block">
                        {rel.categoria}
                      </span>
                    )}
                    <Link href={`/blog/${rel.slug}`}>
                      <h3 className="font-display text-base text-white group-hover:text-[#C9B99A] transition-colors leading-snug mb-2 line-clamp-2">
                        {rel.titulo}
                      </h3>
                    </Link>
                    <p className="text-[#555] text-xs">{formatBlogDate(rel.fecha)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 pt-12 border-t border-[#1a1a1a] bg-[#111] border border-[#1e1e1e] p-8">
          <h3 className="font-display text-2xl text-white mb-3">
            ¿Tienes alguna pregunta?
          </h3>
          <p className="text-[#888] text-sm mb-5">
            Nuestro equipo está disponible para resolver cualquier duda sobre el
            mercado inmobiliario en Vilanova.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:936061800"
              className="px-6 py-3 bg-[#C9B99A] text-black font-body text-sm tracking-wide hover:bg-[#DDD0BB] transition-colors text-center"
            >
              Llamar: 936 061 800
            </a>
            <Link
              href="/contacto"
              className="px-6 py-3 border border-[#2a2a2a] text-[#aaa] font-body text-sm tracking-wide hover:border-[#C9B99A] hover:text-white transition-colors text-center"
            >
              Más formas de contacto
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
