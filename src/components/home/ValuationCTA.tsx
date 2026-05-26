"use client";

import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { useLanguage } from "@/context/LanguageContext";

export default function ValuationCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#C9B99A]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <AnimateIn>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("ctaLabel")}
            </span>
            <span className="h-px w-10 bg-[#C9B99A]" />
          </div>

          <h2 className="font-display text-5xl lg:text-6xl text-white font-light leading-tight mb-6">
            {t("ctaTitle1")}
            <br />
            <span className="text-[#C9B99A] italic">{t("ctaTitle2")}</span>
          </h2>

          <p className="text-[#888] text-lg font-body font-light max-w-sm mx-auto mb-10 leading-relaxed text-center text-balance">
            {t("ctaSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="px-10 py-4 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors duration-300 min-w-[180px]"
            >
              {t("ctaContact")}
            </Link>
            <Link
              href="/valoracion"
              className="px-10 py-4 border border-[#C9B99A]/50 text-[#C9B99A] font-body text-sm tracking-widest uppercase hover:border-[#C9B99A] hover:bg-[#C9B99A]/5 transition-all duration-300 min-w-[180px]"
            >
              {t("ctaValuate")}
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
