"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LANGS } from "@/lib/i18n";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: "/propiedades", label: t("navProperties") },
    { href: "/quienes-somos", label: t("navAbout") },
    { href: "/valoracion", label: t("navValuation") },
    { href: "/blog", label: t("navBlog") },
    { href: "/contacto", label: t("navContact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
          scrolled || !isHome
            ? "bg-[#0a0a0a]/95 border-b border-[#2a2a2a]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo — siempre un enlace a Home; estando en Home solo sube arriba */}
          <Link
            href="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center leading-none group cursor-pointer"
            aria-label={isHome ? "Volver arriba" : "Inicio"}
          >
            <img src="/logo.svg" alt="The Vila Home" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide font-body transition-colors duration-300 relative group",
                  pathname.startsWith(link.href)
                    ? "text-[#C9B99A]"
                    : "text-[#aaa] hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-[#C9B99A] transition-[width] duration-300",
                    pathname.startsWith(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right: CTA + lang switcher */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border-r border-[#2a2a2a] pr-4 mr-0">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cn(
                    "text-[10px] font-body tracking-widest px-1.5 py-0.5 transition-colors cursor-pointer",
                    lang === code
                      ? "text-[#C9B99A]"
                      : "text-[#555] hover:text-[#aaa]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <a
              href="tel:936061800"
              className="flex items-center gap-2 text-sm text-[#C9B99A] hover:text-[#DDD0BB] transition-colors"
            >
              <Phone size={14} />
              <span className="font-body tracking-wide">936 061 800</span>
            </a>
            <Link
              href="/valoracion"
              className="px-5 py-2.5 text-xs font-body tracking-widest uppercase border border-[#C9B99A] text-[#C9B99A] hover:bg-[#C9B99A] hover:text-black transition-colors duration-300"
            >
              {t("navValueHome")}
            </Link>
          </div>

          {/* Mobile: click-to-call siempre visible (en móvil es donde se llama) */}
          <div className="lg:hidden flex items-center gap-1">
            <a
              href="tel:936061800"
              className="text-[#C9B99A] hover:text-[#DDD0BB] transition-colors p-2"
              aria-label="Llamar a The Vila Home — 936 061 800"
            >
              <Phone size={19} />
            </a>
            <button
              className="text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center px-10 transition-opacity duration-500",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-display text-3xl transition-colors",
                pathname.startsWith(link.href) ? "text-[#C9B99A]" : "text-white hover:text-[#C9B99A]"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <a href="tel:936061800" className="text-[#C9B99A] text-xl font-display">
              936 061 800
            </a>
            <p className="text-[#888] text-sm mt-1">info@thevilahome.com</p>
          </div>
          {/* Language switcher — mobile */}
          <div className="flex items-center gap-3 pt-2">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "text-sm font-body tracking-widest px-2 py-1 border transition-colors cursor-pointer",
                  lang === code
                    ? "border-[#C9B99A] text-[#C9B99A]"
                    : "border-[#2a2a2a] text-[#555] hover:text-[#aaa] hover:border-[#444]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
