"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowLeft, Tag, Eye } from "lucide-react";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";
import { formatBlogDate } from "@/lib/utils";
import TranslatableHTML from "@/components/blog/TranslatableHTML";
import type { BlogPost } from "@/lib/blog";

// ── Related-post card (needs useAutoTranslate, so it's its own component) ───

function RelatedCard({ post }: { post: BlogPost }) {
  const translatedTitle = useAutoTranslate(post.titulo);
  return (
    <article className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/30 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#111] overflow-hidden border-b border-[#1e1e1e]">
        {post.imagen ? (
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-3xl text-[#C9B99A]/20">
              {post.titulo.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        {post.categoria && (
          <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase mb-2 block">
            {post.categoria}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-base text-white group-hover:text-[#C9B99A] transition-colors leading-snug mb-2 line-clamp-2">
            {translatedTitle}
          </h3>
        </Link>
        <p className="text-[#555] text-xs">{formatBlogDate(post.fecha)}</p>
      </div>
    </article>
  );
}

// ── Main client component ────────────────────────────────────────────────────

interface Props {
  post: BlogPost;
  related: BlogPost[];
}

export default function BlogPostClient({ post, related }: Props) {
  const { t } = useLanguage();
  const translatedTitle   = useAutoTranslate(post.titulo);
  const translatedExcerpt = useAutoTranslate(post.extracto ?? "");
  const [visitCount, setVisitCount] = useState<number | null>(null);

  // Fire-and-forget: increment visit counter and show updated count
  useEffect(() => {
    fetch("/api/blog/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.count > 0) setVisitCount(data.count); })
      .catch(() => {});
  }, [post.slug]);

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-0 py-16">
      {/* Back */}
      <Link
        href="/blog"
        className="flex items-center gap-2 text-[#666] hover:text-[#C9B99A] transition-colors text-sm mb-10"
      >
        <ArrowLeft size={14} />
        {t("blogBackToList")}
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
        {translatedTitle}
      </h1>

      {/* Meta: author + date + visits */}
      <div className="flex flex-wrap items-center gap-6 text-[#555] text-sm mb-8 pb-8 border-b border-[#1a1a1a]">
        <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
          The Vila Home
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={13} className="text-[#C9B99A]" />
          {formatBlogDate(post.fecha)}
        </span>
        {visitCount !== null && (
          <span className="flex items-center gap-1.5 text-[#444] text-xs ml-auto">
            <Eye size={12} className="text-[#C9B99A]/50" />
            {visitCount.toLocaleString("es")}
          </span>
        )}
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

      {/* Excerpt */}
      {post.extracto && (
        <p className="text-[#ccc] text-lg leading-relaxed mb-8 font-light italic border-l-2 border-[#C9B99A] pl-5">
          {translatedExcerpt}
        </p>
      )}

      {/* Content */}
      {post.contenido && (
        <TranslatableHTML
          html={post.contenido}
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
            {t("blogRelatedTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <RelatedCard key={rel.id} post={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 pt-12 border-t border-[#1a1a1a] bg-[#111] border border-[#1e1e1e] p-8">
        <h3 className="font-display text-2xl text-white mb-3">
          {t("blogCtaTitle")}
        </h3>
        <p className="text-[#888] text-sm mb-5">
          {t("blogCtaText")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:936061800"
            className="px-6 py-3 bg-[#C9B99A] text-black font-body text-sm tracking-wide hover:bg-[#DDD0BB] transition-colors text-center"
          >
            {t("blogCtaCall")}
          </a>
          <Link
            href="/contacto"
            className="px-6 py-3 border border-[#2a2a2a] text-[#aaa] font-body text-sm tracking-wide hover:border-[#C9B99A] hover:text-white transition-colors text-center"
          >
            {t("blogCtaContact")}
          </Link>
        </div>
      </div>
    </article>
  );
}
