"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/lib/i18n";

export const CATEGORY_TO_SLUG: Record<string, string> = {
  "Mercado":        "mercado",
  "Procesos":       "procesos",
  "Documentación":  "documentacion",
  "Hipotecas":      "hipotecas",
  "Impuestos":      "impuestos",
  "Herencias":      "herencias",
  "Consejos":       "consejos",
  "Vivir en...":    "vivir-en",
};

const CATEGORIES = [
  "Mercado",
  "Procesos",
  "Documentación",
  "Hipotecas",
  "Impuestos",
  "Herencias",
  "Consejos",
  "Vivir en...",
];

const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  "Mercado":        { es: "Mercado",        ca: "Mercat",        en: "Market",        fr: "Marché" },
  "Procesos":       { es: "Procesos",       ca: "Processos",     en: "Processes",     fr: "Processus" },
  "Documentación":  { es: "Documentación",  ca: "Documentació",  en: "Documentation", fr: "Documentation" },
  "Hipotecas":      { es: "Hipotecas",      ca: "Hipoteques",    en: "Mortgages",     fr: "Hypothèques" },
  "Impuestos":      { es: "Impuestos",      ca: "Impostos",      en: "Taxes",         fr: "Impôts" },
  "Herencias":      { es: "Herencias",      ca: "Herències",     en: "Inheritances",  fr: "Héritages" },
  "Consejos":       { es: "Consejos",       ca: "Consells",      en: "Tips",          fr: "Conseils" },
  "Vivir en...":    { es: "Vivir en...",    ca: "Viure a...",    en: "Living in...",  fr: "Vivre à..." },
};

interface Props {
  currentCategory?: string;
  /**
   * When provided, tab clicks are handled client-side (instant filtering)
   * instead of navigating; the parent is responsible for updating the URL.
   * Modifier-clicks (new tab) still navigate normally.
   */
  onSelect?: (category: string | undefined, href: string) => void;
}

/**
 * Horizontal scrollable category tabs shared by the blog listing,
 * category pages and individual articles. "Todos" links back to /blog.
 */
export default function BlogCategoryNav({ currentCategory, onSelect }: Props) {
  const { t, lang } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkNavScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkNavScroll();
    const el = navRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkNavScroll, { passive: true });
    window.addEventListener("resize", checkNavScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkNavScroll);
      window.removeEventListener("resize", checkNavScroll);
    };
  }, [checkNavScroll]);

  const scrollNav = useCallback((dir: "left" | "right") => {
    navRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, category: string | undefined, href: string) => {
      if (!onSelect) return;
      // Let the browser handle new-tab/window clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onSelect(category, href);
    },
    [onSelect]
  );

  return (
    <div className="relative flex-1 min-w-0">
      {/* Left fade + arrow */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
      />
      <button
        onClick={() => scrollNav("left")}
        aria-label="Categorías anteriores"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center text-[#C9B99A] hover:text-white transition-all duration-200 ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronLeft size={15} />
      </button>

      <nav
        ref={navRef}
        className="flex items-center overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ touchAction: "pan-x" }}
        aria-label="Categorías del blog"
      >
        <Link
          href="/blog"
          onClick={(e) => handleClick(e, undefined, "/blog")}
          className={`shrink-0 px-5 py-4 text-xs font-body tracking-[0.2em] uppercase transition-all duration-200 border-b-2 -mb-px ${
            !currentCategory
              ? "text-[#C9B99A] border-[#C9B99A]"
              : "text-[#555] border-transparent hover:text-[#aaa] hover:border-[#333]"
          }`}
        >
          {t("blogCategoryAll")}
        </Link>
        {CATEGORIES.map((cat) => {
          const href = `/blog/categoria/${CATEGORY_TO_SLUG[cat] ?? cat.toLowerCase()}`;
          return (
            <Link
              key={cat}
              href={href}
              onClick={(e) => handleClick(e, cat, href)}
              className={`shrink-0 px-5 py-4 text-xs font-body tracking-[0.2em] uppercase transition-all duration-200 border-b-2 -mb-px ${
                currentCategory === cat
                  ? "text-[#C9B99A] border-[#C9B99A]"
                  : "text-[#555] border-transparent hover:text-[#aaa] hover:border-[#333]"
              }`}
            >
              {CATEGORY_LABELS[cat]?.[lang] ?? cat}
            </Link>
          );
        })}
      </nav>

      {/* Right fade + arrow */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
      />
      <button
        onClick={() => scrollNav("right")}
        aria-label="Más categorías"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center text-[#C9B99A] hover:text-white transition-all duration-200 ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
