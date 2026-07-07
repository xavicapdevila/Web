"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
  /** Valoración real de la ficha de Google (viene de la API de Places). */
  rating?: number;
  totalReviews?: number;
}

export default function Hero({ rating, totalReviews }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Photo background */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="The Vila Home — equipo inmobiliario en Vilanova i la Geltrú"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
          quality={75}
        />
        {/* Dark overlay — 42% so faces are clearly visible */}
        <div className="absolute inset-0 bg-black/[0.42]" />
        {/* Bottom fade into site bg */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0a]/60 to-transparent" />
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-28">
        <div className="max-w-2xl">
          {/* Antetítulo local VISIBLE — señal SEO on-page para «inmobiliaria
              Vilanova» sin texto oculto. Sustituye al antiguo sr-only. */}
          <p
            className="text-[#C9B99A] text-xs sm:text-sm font-body tracking-[0.22em] uppercase mb-5 animate-fade-up"
            style={{ animationDelay: "120ms", animationFillMode: "both" }}
          >
            {t("heroLocation")}
          </p>

          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-10 animate-fade-up"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <span className="text-white">Human</span>
            <br />
            <span className="text-[#C9B99A]">Real Estate</span>
          </h1>

          <div
            className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up"
            style={{ animationDelay: "360ms", animationFillMode: "both" }}
          >
            <Link
              href="/propiedades"
              className="px-8 py-4 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors duration-300"
            >
              {t("heroSeeProperties")}
            </Link>
            <Link
              href="/valoracion"
              className="px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-[#C9B99A] hover:text-[#C9B99A] transition-all duration-300"
            >
              {t("heroValueHome")}
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center gap-x-10 gap-y-6 sm:gap-x-12 mt-14 pt-8 border-t border-white/15 animate-fade-up"
            style={{ animationDelay: "520ms", animationFillMode: "both" }}
          >
            <div>
              <div className="font-display text-3xl text-[#C9B99A]">
                +<CountUp target={450} duration={1600} />
              </div>
              <div className="text-white/60 text-xs font-body tracking-wide mt-1">{t("heroFamilies")}</div>
            </div>
            <div>
              <div className="font-display text-3xl text-[#C9B99A]">
                <CountUp target={15} duration={1200} prefix="+" />
              </div>
              <div className="text-white/60 text-xs font-body tracking-wide mt-1">{t("heroYears")}</div>
            </div>
            {typeof rating === "number" && rating > 0 && (
              <div>
                <div className="font-display text-3xl text-[#C9B99A]">
                  <CountUp target={rating} decimals={1} duration={1400} />
                  <span className="text-2xl align-top">★</span>
                </div>
                <div className="text-white/60 text-xs font-body tracking-wide mt-1">
                  {totalReviews ? `${totalReviews} ${t("heroReviews")}` : t("heroReviews")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-[10px] tracking-widest uppercase font-body">Scroll</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
