"use client";

import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { useLanguage, useAutoTranslate, useAutoTranslateMulti } from "@/context/LanguageContext";
import { fillTemplate } from "@/lib/i18n";
import type { Property } from "@/types/property";

export interface ZonaFaq {
  q: string;
  a: string;
}

export interface ZonaMercado {
  precio: string;
  tipos: string;
  perfil: string;
}

export interface ZonaConfig {
  ciudad: string;
  nombre: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  metaTitle: string;
  metaDescription: string;
  cp?: string;
  lat: number;
  lng: number;
  mercado: ZonaMercado;
  faq: ZonaFaq[];
  cercanas: string[];
}

interface Props {
  zona: ZonaConfig;
  properties: Property[];
  total: number;
  cercanas: { slug: string; nombre: string; descripcionCorta: string }[];
}

export default function ZonaPageContent({ zona, properties, total, cercanas }: Props) {
  const { t } = useLanguage();

  // WA "notify me" button → message prefilled in the current site language
  const waUrl = `https://wa.me/34638359612?text=${encodeURIComponent(
    fillTemplate(t("zonaNotifyMsg"), { zona: zona.nombre })
  )}`;

  // Auto-translated prose (ES → current language) — same mechanism as property descriptions.
  // Long description is split into sentences so each chunk stays within the translation API limit.
  const titulo = useAutoTranslate(zona.titulo);
  const descripcionCorta = useAutoTranslate(zona.descripcionCorta);
  const mercadoTipos = useAutoTranslate(zona.mercado.tipos);
  const mercadoPerfil = useAutoTranslate(zona.mercado.perfil);
  const descripcionLarga = useAutoTranslateMulti(
    zona.descripcionLarga.split(/(?<=[.!?])\s+/)
  ).join(" ");
  const faqQ = useAutoTranslateMulti(zona.faq.map((f) => f.q));
  const faqA = useAutoTranslateMulti(zona.faq.map((f) => f.a));
  const cercanasDesc = useAutoTranslateMulti(cercanas.map((c) => c.descripcionCorta));

  return (
    <>
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="text-[#555] text-xs font-body tracking-wide mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C9B99A] transition-colors">{t("zonaHome")}</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-[#C9B99A] transition-colors">{t("navProperties")}</Link>
            <span>/</span>
            <span className="text-[#888]">{zona.nombre}</span>
          </nav>
          <h1 className="font-display text-3xl lg:text-4xl text-white font-light mb-3">
            {titulo}
          </h1>
          <p className="text-[#666] text-sm font-body max-w-xl">
            {descripcionCorta}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* Left column */}
          <div className="flex-1">
            {properties.length > 0 ? (
              <>
                <p className="text-[#666] text-sm font-body mb-6">
                  {total} {total === 1 ? t("propPageFoundOne") : t("propPageFoundMany")} {t("zonaIn")} {zona.nombre}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property, i) => (
                    <PropertyCard key={property.id} property={property} priority={i < 2} />
                  ))}
                </div>
                {total > 12 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/propiedades?ciudad=${encodeURIComponent(zona.nombre)}`}
                      className="inline-block px-8 py-3 border border-[#C9B99A]/40 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
                    >
                      {t("featuredSeeAll")} {t("zonaIn")} {zona.nombre}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Avísame block */}
                <div className="border border-[#C9B99A]/20 bg-[#0d0d0d] p-8">
                  <p className="text-[#C9B99A] text-xs font-body tracking-[0.25em] uppercase mb-3">
                    {t("zonaActiveLabel")}
                  </p>
                  <h2 className="font-display text-2xl text-white font-light mb-3">
                    {t("zonaNoPropsPrefix")} {zona.nombre}
                  </h2>
                  <p className="text-[#888] text-sm leading-relaxed mb-6">
                    {t("zonaNoPropsDesc")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-black text-xs font-body tracking-widest uppercase hover:bg-[#1fbd58] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {t("zonaNotifyWhatsapp")}
                    </a>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center px-6 py-3 border border-[#C9B99A]/30 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
                    >
                      {t("ctaContact")}
                    </Link>
                  </div>
                </div>

                {/* Market data */}
                <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6">
                  <p className="text-[#C9B99A] text-xs font-body tracking-[0.25em] uppercase mb-5">
                    {t("zonaMarketLabel")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">{t("zonaAvgPrice")}</p>
                      <p className="text-white font-display text-lg">{zona.mercado.precio}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">{t("zonaPropertyType")}</p>
                      <p className="text-[#aaa] text-sm font-body leading-relaxed">{mercadoTipos}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">{t("zonaBuyerProfile")}</p>
                      <p className="text-[#aaa] text-sm font-body leading-relaxed">{mercadoPerfil}</p>
                    </div>
                  </div>
                </div>

                {/* Seller CTA */}
                <div className="border border-[#1e1e1e] p-6">
                  <p className="text-[#888] text-xs font-body tracking-[0.2em] uppercase mb-2">
                    {t("zonaSellerPrefix")} {zona.nombre}?
                  </p>
                  <p className="text-[#ccc] text-sm mb-4 leading-relaxed">
                    {t("zonaSellerDesc")}
                  </p>
                  <Link
                    href="/valoracion"
                    className="inline-block px-6 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
                  >
                    {t("zonaValuateProperty")}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="border border-[#1e1e1e] p-6 mb-6">
              <h2 className="font-display text-xl text-white font-light mb-4">
                {t("zonaAboutPrefix")} {zona.nombre}
              </h2>
              <p className="text-[#888] text-sm leading-relaxed">
                {descripcionLarga}
              </p>
            </div>

            <div className="relative border border-[#C9B99A]/20 p-6 bg-[#0d0d0d]">
              <p className="text-[#888] text-xs font-body tracking-[0.2em] uppercase mb-3">
                {t("zonaSidebarPrefix")} {zona.nombre}?
              </p>
              <p className="text-[#ccc] text-sm mb-5 leading-relaxed">
                {t("zonaSidebarDesc")}
              </p>
              <Link
                href="/contacto"
                className="block text-center px-6 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors mb-3"
              >
                {t("ctaContact")}
              </Link>
              <Link
                href="/valoracion"
                className="block text-center px-6 py-3 border border-[#C9B99A]/30 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
              >
                {t("ctaValuate")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* FAQ section */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-8 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("zonaFaqLabel")}
            </span>
          </div>
          <div className="max-w-3xl space-y-px">
            {zona.faq.map((_, i) => (
              <details key={i} className="group border border-[#1e1e1e] bg-[#0d0d0d]">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-display text-lg text-white font-light group-open:text-[#C9B99A] transition-colors pr-4">
                    {faqQ[i]}
                  </span>
                  <span className="text-[#C9B99A] shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[#888] text-sm leading-relaxed">
                  {faqA[i]}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby zones */}
      {cercanas.length > 0 && (
        <div className="border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-8 bg-[#C9B99A]" />
              <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
                {t("zonaNearbyLabel")}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cercanas.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/zona/${c.slug}`}
                  className="border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/30 transition-colors group"
                >
                  <p className="font-display text-xl text-white font-light mb-2 group-hover:text-[#C9B99A] transition-colors">
                    {c.nombre}
                  </p>
                  <p className="text-[#666] text-xs font-body leading-relaxed mb-3">
                    {cercanasDesc[i]}
                  </p>
                  <p className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
                    {t("zonaSeeProperties")} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
