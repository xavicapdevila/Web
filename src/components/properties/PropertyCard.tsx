"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Bath, Maximize2, Phone, Mail, Play, Video, RotateCcw, Globe, Camera, Share2, X } from "lucide-react";
import { formatPrice, formatM2, getYouTubeId } from "@/lib/utils";
import { getTipoLabel } from "@/lib/i18n";
import type { Property } from "@/types/property";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";
import ShareModal from "./ShareModal";
import { buildAgentWhatsApp } from "@/lib/agents";

interface Props {
  property: Property;
  priority?: boolean;
}

function PropertyCard({ property, priority = false }: Props) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const titulo = useAutoTranslate(property.titulo);
  const mainImage = property.imagenes[0]?.url;
  const [showShareModal,    setShowShareModal]    = useState(false);
  const [showVideo,         setShowVideo]         = useState(false);
  const [showTour,          setShowTour]          = useState(false);
  const [lightboxImg,       setLightboxImg]       = useState<string | null>(null);
  const [showGallery,       setShowGallery]       = useState(false);
  const [showReservedAlert, setShowReservedAlert] = useState(false);

  const ytId = property.video1 ? getYouTubeId(property.video1) : null;

  // Close any modal on Escape (stay on grid)
  const closeAll = useCallback(() => {
    setShowVideo(false);
    setShowTour(false);
    setLightboxImg(null);
    setShowGallery(false);
  }, []);
  // X button → close modal AND navigate to property detail page
  const closeAndNavigate = useCallback(() => {
    setShowVideo(false);
    setShowTour(false);
    setLightboxImg(null);
    setShowGallery(false);
    router.push(`/propiedades/${property.slug}`);
  }, [router, property.slug]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Si hay lightbox encima de la galería, solo cierra el lightbox
      if (lightboxImg) { setLightboxImg(null); return; }
      closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll, lightboxImg]);

  const handleShare = async () => {
    const url = `${window.location.origin}/propiedades/${property.slug}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      if (navigator.share && isMobile) {
        await navigator.share({ title: titulo, url });
      } else {
        setShowShareModal(true);
      }
    } catch {
      // cancelled
    }
  };

  const propertyUrl = `https://www.thevilahome.com/propiedades/${property.slug}`;
  // WA button in card → contact the agent (resolved from centralised agents config)
  const cardWaUrl = buildAgentWhatsApp(property.agenteEmail, property.titulo, property.ref ?? "", propertyUrl);
  // WA button in share modal → open WhatsApp without recipient so user chooses who to forward to
  const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(`Mira esta propiedad de The Vila Home:\n\n${property.titulo}\n${propertyUrl}`)}`;
  const isReserved = property.estadoFicha === 7;
  const hasDiscount = property.outlet && property.precioAnterior;

  const handleContactAttempt = (e: React.MouseEvent) => {
    if (isReserved) {
      e.preventDefault();
      setShowReservedAlert(true);
    }
  };

  const hasPlano = property.imagenes.some((img) => img.eti === "plano");
  const has360 = property.imagenes.some((img) => img.eti === "360");
  const hasVideo = Boolean(property.video1);
  const hasTour = Boolean(property.tour);

  // Media icon handlers — open inline modal, same UX as the property detail page
  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (ytId) setShowVideo(true);
  };
  const handleTourClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (property.tour) setShowTour(true);
  };
  const handlePlanoClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const img = property.imagenes.find((i) => i.eti === "plano");
    if (img) setLightboxImg(img.url);
  };
  const handle360Click = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const img = property.imagenes.find((i) => i.eti === "360");
    if (img) setLightboxImg(img.url);
  };
  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setShowGallery(true);
  };

  return (
    <>
    {showShareModal && (
      <ShareModal
        url={`${window.location.origin}/propiedades/${property.slug}`}
        titulo={titulo}
        price={formatPrice(property.precio)}
        waUrl={shareWaUrl}
        onClose={() => setShowShareModal(false)}
      />
    )}
    <article className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/40 transition-all duration-500 overflow-hidden">
      {/* Image area — outer div is the positioning root so media buttons
          can sit outside the <Link> (no nested anchors) but still overlay the image */}
      <div className="relative aspect-[4/3]">
        <Link href={`/propiedades/${property.slug}`} className="absolute inset-0 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={`${property.tipo} en ${property.ciudad} — ${titulo}`}
              fill
              priority={priority}
              loading={priority ? "eager" : "lazy"}
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
              {getTipoLabel(property.tipo, lang, property.subtipo)}
            </span>
          </div>
        </Link>

        {/* Media badges — outside Link so each has its own click action */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
          {property.imagenes.length > 0 && (
            <button
              onClick={handleGalleryClick}
              className="pointer-events-auto flex items-center gap-1 h-7 px-2 bg-black/75 backdrop-blur-sm text-white text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
              title={`Ver ${property.imagenes.length} fotos`}
            >
              <Camera size={12} />
              {property.imagenes.length}
            </button>
          )}
          {hasPlano && (
            <button
              onClick={handlePlanoClick}
              className="pointer-events-auto w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#C9B99A] hover:text-black transition-colors"
              title="Ver plano"
            >
              {/* Plano: rectángulo exterior + paredes interiores + arco de puerta */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="1"/>
                <line x1="13" y1="2" x2="13" y2="13"/>
                <line x1="2" y1="13" x2="13" y2="13"/>
                <path d="M13 13 A7 7 0 0 0 6 6"/>
              </svg>
            </button>
          )}
          {hasVideo && (
            <button
              onClick={handleVideoClick}
              className="pointer-events-auto w-7 h-7 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#C9B99A] hover:text-black transition-colors"
              title="Ver vídeo"
            >
              <Video size={13} />
            </button>
          )}
          {has360 && (
            <button
              onClick={handle360Click}
              className="pointer-events-auto h-7 px-2 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-semibold tracking-wider hover:bg-[#C9B99A] hover:text-black transition-colors"
              title="Ver 360°"
            >
              360°
            </button>
          )}
          {hasTour && (
            <button
              onClick={handleTourClick}
              className="pointer-events-auto h-7 px-2 bg-black/75 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-semibold tracking-wider hover:bg-[#C9B99A] hover:text-black transition-colors"
              title="Ver tour virtual"
            >
              3D
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title — sr-only: indexed by Google, invisible to the eye */}
        <h3 className="sr-only">{titulo}</h3>

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
              onClick={handleContactAttempt}
              className={`p-2 border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9B99A] ${
                isReserved
                  ? "border-[#2a2a2a] text-[#444] cursor-not-allowed"
                  : "border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A]"
              }`}
              aria-label="Llamar a The Vila Home"
            >
              <Phone size={13} aria-hidden="true" />
            </a>
            <a
              href={`mailto:info@thevilahome.com?subject=Información sobre ${property.ref}`}
              onClick={handleContactAttempt}
              className={`p-2 border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9B99A] ${
                isReserved
                  ? "border-[#2a2a2a] text-[#444] cursor-not-allowed"
                  : "border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A]"
              }`}
              aria-label="Enviar email sobre esta propiedad"
            >
              <Mail size={13} aria-hidden="true" />
            </a>
            <button
              onClick={handleShare}
              className="p-2 border border-[#2a2a2a] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9B99A]"
              aria-label="Compartir propiedad"
            >
              <Share2 size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Reserved alert — aparece al intentar contactar */}
        {showReservedAlert && (
          <div className="mt-3 bg-[#C9B99A]/10 border border-[#C9B99A]/40 px-3 py-2 text-center">
            <p className="text-[#C9B99A] text-xs font-body leading-relaxed">
              {t("propReservedAlert")}
            </p>
          </div>
        )}
      </div>
    </article>

    {/* ── Vídeo modal ── */}
    {showVideo && ytId && (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col" onClick={closeAll}>
        <div className="flex items-center justify-between px-5 h-12 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Play size={14} className="text-[#C9B99A]" />
            <span>{titulo}</span>
          </div>
          <button onClick={closeAndNavigate} className="text-white hover:text-[#C9B99A] transition-colors p-1">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 min-h-0" onClick={(e) => e.stopPropagation()}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    )}

    {/* ── Tour virtual modal ── */}
    {showTour && property.tour && (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col" onClick={closeAll}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-[#C9B99A]" />
            <span className="text-white text-sm font-body">Tour virtual — {titulo}</span>
          </div>
          <button onClick={closeAndNavigate} className="text-white hover:text-[#C9B99A] transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
          <iframe
            src={property.tour}
            title={`Tour virtual — ${titulo}`}
            allow="fullscreen; vr; xr"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    )}

    {/* ── Galería de fotos ── */}
    {showGallery && (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col" onClick={closeAll}>
        <div className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-[#1e1e1e]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Camera size={14} className="text-[#C9B99A]" />
            <span>{titulo} &mdash; {property.imagenes.length} fotos</span>
          </div>
          <button onClick={closeAndNavigate} className="text-white hover:text-[#C9B99A] transition-colors p-1">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {property.imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxImg(img.url)}
                className="relative aspect-[4/3] overflow-hidden group/thumb focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9B99A]"
              >
                <Image
                  src={img.url}
                  alt={`${titulo} — foto ${i + 1}`}
                  fill
                  loading="eager"
                  className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                {img.eti && (
                  <span className="absolute bottom-1 left-1 bg-black/70 text-[#C9B99A] text-[9px] uppercase tracking-wider px-1.5 py-0.5">
                    {img.eti}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* ── Plano / 360 / galería lightbox ── */}
    {lightboxImg && (
      <div
        className="fixed inset-0 bg-black z-[210] flex flex-col"
        onClick={() => showGallery ? setLightboxImg(null) : closeAll()}
      >
        <div className="flex items-center justify-end px-5 h-12 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={showGallery ? () => setLightboxImg(null) : closeAndNavigate}
            className="text-white hover:text-[#C9B99A] transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>
        <div className="relative flex-1 min-h-0" onClick={(e) => e.stopPropagation()}>
          <Image src={lightboxImg} alt={titulo} fill className="object-contain" sizes="100vw" priority />
        </div>
      </div>
    )}
    </>
  );
}

// Memoised: skips re-render when parent re-renders but this card's props haven't changed
export default memo(PropertyCard);
