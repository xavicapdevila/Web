"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import AnimateIn from "@/components/ui/AnimateIn";
import type { Property } from "@/types/property";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: Props) {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-10 bg-[#C9B99A]" />
                <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
                  {t("featuredLabel")}
                </span>
              </div>
              <h2 className="font-display text-5xl lg:text-6xl text-white font-light leading-tight">
                {t("featuredTitle")}
              </h2>
            </div>
            <Link
              href="/propiedades"
              className="flex items-center gap-2 text-[#C9B99A] hover:text-[#DDD0BB] transition-colors group font-body text-sm tracking-wide"
            >
              {t("featuredSeeAll")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>

        {/* Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, i) => (
              <AnimateIn key={property.id} delay={i * 80}>
                <PropertyCard property={property} />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#555] font-display text-2xl">{t("featuredLoading")}</p>
            <p className="text-[#444] text-sm mt-2">{t("featuredLoadingDesc")}</p>
          </div>
        )}

        {/* Bottom CTA */}
        <AnimateIn className="text-center mt-16">
          <Link
            href="/propiedades"
            className="inline-block px-10 py-4 border border-[#C9B99A]/40 text-[#C9B99A] font-body text-sm tracking-widest uppercase hover:bg-[#C9B99A] hover:text-black transition-all duration-300"
          >
            {t("featuredSeeAll")} →
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
