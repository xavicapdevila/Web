"use client";

import { useState, useMemo } from "react";
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

const CATEGORIES = ["Mercado", "Procesos", "Documentación", "Consejos", "Vivir en..."];

// Category display labels per language (filtering still uses the Spanish key)
const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  "Mercado":        { es: "Mercado",        ca: "Mercat",        en: "Market",        fr: "Marché" },
  "Procesos":       { es: "Procesos",       ca: "Processos",     en: "Processes",     fr: "Processus" },
  "Documentación":  { es: "Documentación",  ca: "Documentació",  en: "Documentation", fr: "Documentation" },
  "Consejos":       { es: "Consejos",       ca: "Consells",      en: "Tips",          fr: "Conseils" },
  "Vivir en...":    { es: "Vivir en...",    ca: "Viure a...",    en: "Living in...",  fr: "Vivre à..." },
};

// ── Hero card (uses useAutoTranslate — needs its own component) ──────────────

function HeroCard({ post }: { post: BlogPost }) {
  const translatedTitle   = useAutoTranslate(post.titulo);
  const translatedExcerpt = useAutoTranslate(post.extracto ?? "");

  return (
    <article className="group mb-10 lg:mb-14">
      <Link
        href={`/blog/${post.slug}`}
        className="block relative overflow-hidden bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/20 transition-colors duration-500"
        style={{ aspectRatio: "21/8" }}
      >
        {/* Image */}
        {post.imagen ? (
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
            <span className="font-display text-[12rem] text-[#C9B99A]/8 leading-none select-none">
              {post.titulo.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">
          {post.categoria && (
            <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-2.5 py-0.5 mb-4 self-start">
              {post.categoria}
            </span>
          )}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-5xl text-white font-light leading-tight mb-3 max-w-3xl group-hover:text-[#C9B99A] transition-colors duration-300">
            {translatedTitle}
          </h2>
          {post.extracto && (
            <p className="hidden sm:block text-[#ccc] text-sm lg:text-base leading-relaxed mb-5 max-w-2xl line-clamp-2">
              {translatedExcerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#C9B99A]/80 font-body tracking-widest uppercase">
              The Vila Home
            </span>
            <span className="flex items-center gap-1.5 text-[#aaa]">
              <CalendarDays size={11} />
              {formatBlogDate(post.fecha)}
            </span>
            {post.etiquetas.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="hidden lg:inline text-[#C9B99A]/60 border border-[#C9B99A]/20 px-2 py-0.5 font-body tracking-wide uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

// ── Grid card (same reason — own component for useAutoTranslate) ─────────────

function PostCard({ post }: { post: BlogPost }) {
  const translatedTitle   = useAutoTranslate(post.titulo);
  const translatedExcerpt = useAutoTranslate(post.extracto ?? "");

  return (
    <article className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/30 transition-all duration-300 overflow-hidden flex flex-col">
      <Link
        href={`/blog/${post.slug}`}
        className="block relative h-52 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#111] border-b border-[#1e1e1e]"
      >
        {post.imagen ? (
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-5xl text-[#C9B99A]/15">
              {post.titulo.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.categoria && (
            <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-2.5 py-0.5">
              {post.categoria}
            </span>
          )}
          {post.etiquetas.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[#C9B99A] text-xs font-body tracking-wide uppercase border border-[#C9B99A]/20 px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h2 className="font-display text-xl text-white group-hover:text-[#C9B99A] transition-colors leading-snug mb-3">
            {translatedTitle}
          </h2>
        </Link>

        {post.extracto && (
          <p className="text-[#888] text-sm leading-relaxed mb-5 line-clamp-2">
            {translatedExcerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-[#555] text-xs pt-4 border-t border-[#1a1a1a] mt-auto">
          <span className="text-[#C9B99A]/70 font-body tracking-wide">
            The Vila Home
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} />
            {formatBlogDate(post.fecha)}
          </span>
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

  const hero = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <>
      {/* Category tabs + search bar */}
      <div className="border-b border-[#1a1a1a] sticky top-20 z-30 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Row 1: tabs */}
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

            {/* Search — desktop only */}
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
                className="w-48 lg:w-64 bg-transparent border border-[#222] focus:border-[#C9B99A]/30 text-white placeholder-[#444] text-xs font-body py-2 pl-8 pr-7 outline-none transition-colors"
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

          {/* Row 2: search — mobile only */}
          <div className="sm:hidden border-t border-[#111] px-4 py-2">
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
                className="w-full bg-transparent border border-[#222] focus:border-[#C9B99A]/30 text-white placeholder-[#444] text-xs font-body py-2 pl-8 pr-7 outline-none transition-colors"
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

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Empty: no posts at all */}
          {posts.length === 0 && (
            <p className="text-[#555] text-center py-24 font-display text-2xl">
              {t("blogComingSoon")}
            </p>
          )}

          {/* Empty: filter/search yielded nothing */}
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
                className="mt-6 text-xs font-body tracking-widest uppercase text-[#C9B99A] hover:text-white transition-colors border border-[#2a2a2a] hover:border-[#C9B99A] px-5 py-2.5"
              >
                {t("blogSeeAll")}
              </button>
            </div>
          )}

          {/* Results */}
          {filtered.length > 0 && (
            <>
              {/* Hero article */}
              {hero && <HeroCard post={hero} />}

              {/* Grid of remaining articles */}
              {rest.length > 0 && (
                <>
                  {hero && (
                    <div className="flex items-center gap-4 mb-8">
                      <span className="h-px flex-1 bg-[#1a1a1a]" />
                      <span className="text-[#444] text-xs font-body tracking-widest uppercase">
                        {rest.length}{" "}
                        {rest.length === 1
                          ? t("blogMoreArticlesOne")
                          : t("blogMoreArticlesMany")}
                      </span>
                      <span className="h-px flex-1 bg-[#1a1a1a]" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {rest.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
}
