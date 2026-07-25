"use client";

/* Menú compartido de las previas -wow. Dos modos:
   - overHero: nace transparente con texto blanco (el hero es foto a sangre)
     y al hacer scroll aterriza en cristal crema con tinta.
   - solid: cristal crema desde el principio (páginas sin hero fotográfico). */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LANGS } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

const INK = "#15140F";
const PAPER = "#F7F5EF";
const LINE = "rgba(21,20,15,0.1)";

export default function NavWow({ overHero = false }: { overHero?: boolean }) {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(!overHero);
  useEffect(() => {
    if (!overHero) return;
    const on = () => setScrolled(window.scrollY > 40);
    addEventListener("scroll", on, { passive: true });
    on();
    return () => removeEventListener("scroll", on);
  }, [overHero]);

  const claro = !scrolled; // texto blanco sobre foto

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3.5 backdrop-blur-xl border-b" : "py-6 border-b border-transparent"
      }`}
      style={{ background: scrolled ? "rgba(247,245,239,0.82)" : "transparent", borderColor: scrolled ? LINE : "transparent" }}
    >
      <nav className="mx-auto w-full max-w-[1480px] px-6 lg:px-12 flex items-center justify-between gap-6">
        <Link href="/home-wow" aria-label="The Vila Home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="The Vila Home"
            className="h-9 sm:h-10 w-auto transition-[filter] duration-500"
            style={{ filter: claro ? "none" : "brightness(0)" }}
          />
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium transition-colors duration-500" style={{ color: claro ? "#FFF" : INK }}>
          <Link href="/propiedades-wow" className="hover:opacity-60 transition-opacity">{t("navProperties")}</Link>
          <Link href="/quienes-somos" className="hover:opacity-60 transition-opacity">{t("navAbout")}</Link>
          <Link href="/valoracion" className="hover:opacity-60 transition-opacity">{t("navValuation")}</Link>
          <Link href="/blog" className="hover:opacity-60 transition-opacity">{t("navBlog")}</Link>
          <Link href="/contacto" className="hover:opacity-60 transition-opacity">{t("navContact")}</Link>
        </div>
        <div className="flex items-center gap-4 shrink-0 transition-colors duration-500" style={{ color: claro ? "#FFF" : INK }}>
          <div className="hidden sm:flex items-center gap-1 pr-4 border-r" style={{ borderColor: claro ? "rgba(255,255,255,0.3)" : LINE }}>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-[10px] tracking-widest px-1.5 py-0.5 cursor-pointer transition-opacity ${
                  lang === code ? "opacity-100 underline underline-offset-4" : "opacity-45 hover:opacity-80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <a href="tel:936061800" className="hidden md:flex items-center gap-2 text-[13px] hover:opacity-60 transition-opacity">
            <Phone size={13} />
            {siteConfig.phoneDisplay}
          </a>
          <Link
            href="/valoracion"
            className="text-[13px] font-medium rounded-full px-5 py-2.5 whitespace-nowrap transition-all duration-500 hover:opacity-85"
            style={claro ? { background: PAPER, color: INK } : { background: INK, color: PAPER }}
          >
            {t("heroValueHome")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
