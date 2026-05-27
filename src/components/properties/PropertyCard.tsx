"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BedDouble, Bath, Maximize2, Phone, Mail, LayoutGrid, Play, RotateCcw, Globe, Images, Share2, Check } from "lucide-react";
import { formatPrice, formatM2 } from "@/lib/utils";
import { getTipoLabel } from "@/lib/i18n";
import type { Property } from "@/types/property";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const { t, lang } = useLanguage();
  const titulo = useAutoTranslate(property.titulo);
  const mainImage = property.imagenes[0]?.url;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/propiedades/${property.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // cancelled or error
    }
  };
  const isReserved = property.estadoFicha === 7;
  const hasDiscount = property.outlet && property.precioAnterior;

  const hasPlano = property.imagenes.some((img) => img.eti === "plano");
  const has360 = property.imagenes.some((img) => img.eti === "360");
  const hasVideo = Boolean(property.video1);
  const hasTour = Boolean(property.tour);

  return (
    <article className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/40 transition-all duration-500 overflow-hidden">
      {/* Image */}
      <Link href={`/propiedades/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-[#333] text-sm">{t("cardNoImage")}</span>
          </div>
        )}

        {/* Reserved overlay */}
        {isReserved && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[#C9B99A] font-display text-2xl tracking-[0.3em] uppercase border border-[#C9B99A] px-6 py-2">
              {t("cardReserved")}
            </span>
          </div>
        )}

        {/* Tipo badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#0a0a0a]/80 backdrop-blur-sm text-[#C9B99A] text-xs font-body tracking-widest uppercase px-3 py-1">
            {getTipoLabel(property.tipo, lang)}
          </span>
        </div>

        {/* Discount badge */}
        {hasDiscount && property.porcentajeBajada && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#C9B99A] text-black text-xs font-bold px-2 py-1">
              -{property.porcentajeBajada}%
            </span>
          </div>
        )}

        {/* Media icons — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
          {property.imagenes.length > 0 && (
            <span className="flex items-center gap-1 h-7 px-2 bg-black/75 backdrop-blur-sm text-white text-xs" title={`${property.imagenes.length} fotos`}>
              <Images size={12} />
              {property.imagenes.length}
            </span>
          )}
          {hasPlano && (
            <span className="w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white" title="Plano disponible">
              <LayoutGrid size={13} />
            </span>
          )}
          {hasVideo && (
            <span className="w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white" title="Vídeo disponible">
              <Play size={13} />
            </span>
          )}
          {has360 && (
            <span className="w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white" title="Vista 360°">
              <RotateCcw size={13} />
            </span>
          )}
          {hasTour && (
            <span className="w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white" title="Tour virtual">
              <Globe size={13} />
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-3">
          <span className="text-[#C9B99A] font-display text-2xl">
            {formatPrice(property.precio)}
          </span>
          {isReserved && (
            <span className="ml-2 text-[#C9B99A] text-xs tracking-widest uppercase border border-[#C9B99A] px-2 py-0.5">
              {t("cardReserved")}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="text-[#888] text-sm mb-4">
          {[property.zona, property.ciudad].filter(Boolean).join(", ")}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-[#999] text-sm border-t border-[#1e1e1e] pt-4">
          {property.habitaciones && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-[#C9B99A]" />
              {property.habitaciones}
            </span>
          )}
          {property.banos && (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-[#C9B99A]" />
              {property.banos}
            </span>
          )}
          {property.m2Construidos && (
            <span className="flex items-center gap-1.5">
              <Maximize2 size={14} className="text-[#C9B99A]" />
              {formatM2(property.m2Construidos)}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <a
              href="tel:936061800"
              className="p-2 border border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
              title="Llamar"
            >
              <Phone size={13} />
            </a>
            <a
              href={`mailto:info@thevilahome.com?subject=Información sobre ${property.ref}`}
              className="p-2 border border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
              title="Email"
            >
              <Mail size={13} />
            </a>
            <button
              onClick={handleShare}
              className="p-2 border border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
              title={copied ? "¡Copiado!" : "Compartir"}
            >
              {copied ? <Check size={13} className="text-[#C9B99A]" /> : <Share2 size={13} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
