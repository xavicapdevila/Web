"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Search, X } from "lucide-react";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";
import { formatBlogDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog";
import type { Lang } from "@/lib/i18n";

interface Props {
  posts: BlogPost[];
}

const PAGE_SIZE = 12;

const CATEGORIES = ["Mercado", "Procesos", "Documentación", "Consejos", "Vivir en..."];

const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  "Mercado":        { es: "Mercado",        ca: "Mercat",        en: "Market",        fr: "Marché" },
  "Procesos":       { es: "Procesos",       ca: "Processos",     en: "Processes",     fr: "Processus" },
  "Documentación":  { es: "Documentación",  ca: "Documentació",  en: "Documentation", fr: "Documentation" },
  "Consejos":       { es: "Consejos",       ca: "Consells",      en: "Tips",          fr: "Conseils" },
  "Vivir en...":    { es: "Vivir en...",    ca: "Viure a...",    en: "Living in...",  fr: "Vivre à..." },
};

// ── Article card — compact, uniform ──────────────────────────────────────────
function ArticleCard({ post }: { post: BlogPost }) {
  const translatedTitle = useAutoTranslate(post.titulo);

  return (
    <article className="group bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#C9B99A]/20 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="block relative h-36 overflow-hidden shrink-0">
        {post.imagen ? (
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
            <span className="font-display text-4xl text-[#C9B99A]/10 select-none">
              {post.titulo.charAt(0)}
            </span>
          </div>
        )}
        {/* Category badge */}
        {post.categoria && (
          <span className="absolute top-2.5 left-2.5 text-black bg-[#C9B99A] text-[9px] font-body tracking-[0.14em] uppercase px-2 py-0.5 leading-tight">
            {post.categoria}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h2 className="font-display text-[14px] leading-snug text-[#ddd] group-hover:text-[#C9B99A] transition-colors duration-200 line-clamp-2">
            {translatedTitle}
          </h2>
        </Link>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#191919]">
          <CalendarDays size={9} className="text-[#444] shrink-0" />
          <span className="text-[#444] text-[10px] tabular-nums">
            {formatBlogDate(post.fecha)}
          </span>
          {post.etiquetas[0] && (
            <>
              <span className="text-[#2e2e2e]">·</span>
              <span className="text-[#3a3a3a] text-[10px] font-body tracking-wide uppercase truncate">
                {post.etiquetas[0]}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Main listing component ────────────────────────────────────────────────────

export default function BlogContent({ posts }: Props) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const trimmed = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory) {
      result = result.filter((p) => p.categoria === activeCategory);
    }
    if (trimmed) {
      result = result.filter(
        (p) =>
          p.titulo.toLowerCase().includes(trimmed) ||
          (p.extracto ?? "").toLowerCase().includes(trimmed) ||
          p.categoria.toLowerCase().includes(trimmed) ||
          p.etiquetas.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    }
    return result;
  }, [posts, activeCategory, trimmed]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, trimmed]);

  const visible  = filtered.slice(0, page * PAGE_SIZE);
  const hasMore  = filtered.length > page * PAGE_SIZE;

  return (
    <>
      {/* ── Category tabs + search ── */}
      <div className="border-b border-[#1a1a1a] sticky top-20 z-30 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <nav
              className="flex items-center overflow-x-auto overflow-y-hidden scrollbar-hide"
              style={{ touchAction: "pan-x" }}
              aria-label="Categorías del blog"
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-5 py-4 text-xs font-body tracking-[0.2em] uppercase transition-all duration-200 border-b-2 -mb-px ${
                  !activeCategory
                    ? "text-[#C9B99A] border-[#C9B99A]"
                    : "text-[#555] border-transparent hover:text-[#aaa] hover:border-[#333]"
                }`}
              >
                {t("blogCategoryAll")}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`shrink-0 px-5 py-4 text-xs font-body tracking-[0.2em] uppercase transition-all duration-200 border-b-2 -mb-px ${
                    activeCategory === cat
                      ? "text-[#C9B99A] border-[#C9B99A]"
                      : "text-[#555] border-transparent hover:text-[#aaa] hover:border-[#333]"
                  }`}
                >
                  {CATEGORY_LABELS[cat]?.[lang] ?? cat}
                </button>
              ))}
            </nav>

            {/* Search — desktop */}
            <div className="relative shrink-0 hidden sm:block">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blogSearchPlaceholder")}
                className="w-48 lg:w-60 bg-transparent border border-[#1e1e1e] focus:border-[#C9B99A]/30 text-white placeholder-[#3a3a3a] text-xs font-body py-2 pl-8 pr-7 outline-none transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#C9B99A] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Search — mobile */}
          <div className="sm:hidden border-t border-[#111] py-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blogSearchPlaceholder")}
                className="w-full bg-transparent border border-[#1e1e1e] focus:border-[#C9B99A]/30 text-white placeholder-[#3a3a3a] text-xs font-body py-2 pl-8 pr-7 outline-none transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#C9B99A] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* No posts at all */}
          {posts.length === 0 && (
            <p className="text-[#555] text-center py-24 font-display text-2xl">
              {t("blogComingSoon")}
            </p>
          )}

          {/* Filter/search empty */}
          {posts.length > 0 && filtered.length === 0 && (
            <div className="text-center py-24">
              {trimmed ? (
                <p className="text-[#555] font-display text-xl">
                  {t("blogSearchNoResults")}{" "}
                  <span className="text-[#C9B99A]/60">&ldquo;{query.trim()}&rdquo;</span>
                </p>
              ) : (
                <p className="text-[#555] font-display text-xl">
                  {t("blogCategoryEmpty")}
                </p>
              )}
              <button
                onClick={() => { setQuery(""); setActiveCategory(null); }}
                className="mt-6 text-xs font-body tracking-widest uppercase text-[#C9B99A] hover:text-white transition-colors border border-[#222] hover:border-[#C9B99A] px-5 py-2.5"
              >
                {t("blogSeeAll")}
              </button>
            </div>
          )}

          {/* Grid */}
          {visible.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                {visible.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>

              {/* Article count + load more */}
              <div className="flex flex-col items-center gap-4 mt-10">
                <p className="text-[#333] text-xs font-body tracking-widest uppercase">
                  {visible.length} / {filtered.length}
                </p>
                {hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs font-body tracking-[0.2em] uppercase text-[#C9B99A] hover:text-white transition-colors border border-[#1e1e1e] hover:border-[#C9B99A]/40 px-8 py-3"
                  >
                    {t("blogLoadMore")}
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
}
