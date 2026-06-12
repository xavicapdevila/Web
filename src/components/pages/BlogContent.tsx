"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Eye, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";
import { formatBlogDate, baseVisits } from "@/lib/utils";
import BlogCategoryNav from "@/components/blog/BlogCategoryNav";
import type { BlogPost } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
  visitCounts?: Record<string, number>;
  currentCategory?: string;
}

const PAGE_SIZE = 12;

function fmtVisits(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ post, visits }: { post: BlogPost; visits?: number }) {
  const translatedTitle   = useAutoTranslate(post.titulo);
  const translatedExcerpt = useAutoTranslate(post.extracto ?? "");

  return (
    <article className="group relative bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#C9B99A]/20 transition-all duration-300 flex flex-col">
      {/* Category badge — sticks out slightly to the left, offset from top */}
      {post.categoria && (
        <span className="absolute top-4 -left-px z-10 text-black bg-[#C9B99A] text-[10px] font-body tracking-widest uppercase px-3 py-1 shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
          {post.categoria}
        </span>
      )}

      {/* Single link wrapping the whole card */}
      <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden shrink-0">
          {post.imagen ? (
            <Image
              src={post.imagen}
              alt={post.imagenAlt || post.titulo}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
              <span className="font-display text-5xl text-[#C9B99A]/10 select-none">
                {post.titulo.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Tags */}
          {post.etiquetas.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.etiquetas.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[#C9B99A]/60 text-[10px] font-body tracking-wide uppercase border border-[#C9B99A]/15 px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="font-display text-lg leading-snug text-white group-hover:text-[#C9B99A] transition-colors duration-200 mb-3">
            {translatedTitle}
          </h2>

          {/* Full excerpt */}
          {post.extracto && (
            <p className="text-[#666] text-sm leading-relaxed flex-1">
              {translatedExcerpt}
            </p>
          )}

          {/* Date + visits footer */}
          <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-[#191919]">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={11} className="text-[#C9B99A]/50 shrink-0" />
              <span className="text-[#555] text-xs tabular-nums">
                {formatBlogDate(post.fecha)}
              </span>
            </span>
            <span className="flex items-center gap-1 text-[#444] text-[10px] tabular-nums">
              <Eye size={10} className="shrink-0" />
              {fmtVisits(baseVisits(post.slug) + (visits ?? 0))}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

// ── Main listing component ────────────────────────────────────────────────────

export default function BlogContent({ posts, visitCounts = {}, currentCategory }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let result = posts;
    if (trimmed) {
      // Search across ALL posts regardless of page
      result = result.filter(
        (p) =>
          p.titulo.toLowerCase().includes(trimmed) ||
          (p.extracto ?? "").toLowerCase().includes(trimmed) ||
          p.categoria.toLowerCase().includes(trimmed) ||
          p.etiquetas.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    }
    return [...result].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [posts, trimmed]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [trimmed]);

  const goToPage = useCallback((p: number) => {
    setCurrentPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Build the list of page tokens (numbers + ellipsis)
  const pageTokens = useMemo((): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const tokens: (number | "…")[] = [1];
    if (currentPage > 3) tokens.push("…");
    const lo = Math.max(2, currentPage - 1);
    const hi = Math.min(totalPages - 1, currentPage + 1);
    for (let i = lo; i <= hi; i++) tokens.push(i);
    if (currentPage < totalPages - 2) tokens.push("…");
    tokens.push(totalPages);
    return tokens;
  }, [currentPage, totalPages]);

  return (
    <>
      {/* ── Category tabs + search ── */}
      <div className="border-b border-[#1a1a1a] sticky top-20 z-30 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <BlogCategoryNav currentCategory={currentCategory} />

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
                onClick={() => { setQuery(""); }}
                className="mt-6 text-xs font-body tracking-widest uppercase text-[#C9B99A] hover:text-white transition-colors border border-[#222] hover:border-[#C9B99A] px-5 py-2.5"
              >
                {t("blogSeeAll")}
              </button>
            </div>
          )}

          {/* Grid */}
          {visible.length > 0 && (
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
              >
                {visible.map((post) => (
                  <ArticleCard key={post.id} post={post} visits={visitCounts[post.slug]} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="flex items-center justify-center gap-1 mt-12"
                  aria-label="Paginación"
                >
                  {/* Prev */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 text-[#555] hover:text-[#C9B99A] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {pageTokens.map((token, i) =>
                    token === "…" ? (
                      <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[#333] text-xs select-none">
                        ···
                      </span>
                    ) : (
                      <button
                        key={token}
                        onClick={() => goToPage(token)}
                        aria-current={currentPage === token ? "page" : undefined}
                        className={`w-8 h-8 text-xs font-body tracking-wide transition-all duration-150 ${
                          currentPage === token
                            ? "bg-[#C9B99A] text-black"
                            : "text-[#555] hover:text-white border border-transparent hover:border-[#2a2a2a]"
                        }`}
                      >
                        {token}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 text-[#555] hover:text-[#C9B99A] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight size={14} />
                  </button>
                </nav>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
}
