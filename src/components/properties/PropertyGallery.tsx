"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, LayoutGrid, RotateCcw, Play, Globe, ArrowLeft } from "lucide-react";
import type { PropertyImage } from "@/types/property";
import { getYouTubeId } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  images: PropertyImage[];
  video?: string;
  tour?: string;
  title: string;
  ciudad?: string;
  tipo?: string;
}

export default function PropertyGallery({ images, video, tour, title, ciudad, tipo }: Props) {
  const altBase = [tipo, ciudad].filter(Boolean).join(" en ") || title;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { t } = useLanguage();

  // Cross-fade state: keep old image in bg while new image fades in
  const [prevSrc, setPrevSrc] = useState<string | null>(null);
  const [crossfading, setCrossfading] = useState(false);
  const crossfadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((newIdx: number) => {
    if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);
    const oldSrc = images[currentIndex]?.url ?? null;
    setPrevSrc(oldSrc);
    setCrossfading(false);
    setCurrentIndex(newIdx);
    // Two rAFs: first renders new src at opacity-0, second starts the CSS transition
    requestAnimationFrame(() => requestAnimationFrame(() => setCrossfading(true)));
    crossfadeTimer.current = setTimeout(() => {
      setPrevSrc(null);
      setCrossfading(false);
    }, 320);
  }, [currentIndex, images]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, goTo]);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  const hasPlano = images.some((img) => img.eti === "plano");
  const has360 = images.some((img) => img.eti === "360");
  const hasVideo = Boolean(video);
  const hasTour = Boolean(tour);
  const totalMedia = images.length + (hasVideo ? 1 : 0);

  const mainImage = images[currentIndex] ?? images[0];
  const ytId = video ? getYouTubeId(video) : null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  const MediaIcons = () => (
    <div className="flex items-center gap-2">
      {hasPlano && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const planoIdx = images.findIndex((img) => img.eti === "plano");
            if (planoIdx >= 0) openLightbox(planoIdx);
          }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
        >
          <LayoutGrid size={12} />
          <span>{t("galleryPlan")}</span>
        </button>
      )}
      {has360 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const idx360 = images.findIndex((img) => img.eti === "360");
            if (idx360 >= 0) openLightbox(idx360);
          }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
        >
          <RotateCcw size={12} />
          <span>{t("gallery360")}</span>
        </button>
      )}
      {hasVideo && ytId && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowVideo(true); }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
        >
          <Play size={12} />
          <span>{t("galleryVideo")}</span>
        </button>
      )}
      {hasTour && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowTour(true); }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
        >
          <Globe size={12} />
          <span>{t("galleryVirtualTour")}</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Main gallery ── */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Primary image — carousel */}
          <div
            className="relative aspect-[16/9] lg:aspect-[21/9] max-h-[80vh] overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* ── Cross-fade image layers ── */}
            {/* Layer 0: preload next image (invisible, warms browser cache) */}
            {images.length > 1 && (
              <div className="absolute inset-0 pointer-events-none opacity-0" style={{ zIndex: 0 }} aria-hidden="true">
                <Image
                  src={images[(currentIndex + 1) % images.length].url}
                  alt=""
                  fill
                  sizes="100vw"
                  priority
                />
              </div>
            )}

            {/* Layer 1: previous image (bg, fades out) */}
            {prevSrc && (
              <div
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${crossfading ? "opacity-0" : "opacity-100"}`}
                style={{ zIndex: 1 }}
                aria-hidden="true"
              >
                <Image src={prevSrc} alt="" fill className="object-cover" sizes="100vw" priority />
              </div>
            )}

            {/* Layer 2: current image (fg, fades in) */}
            {mainImage ? (
              <div
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${crossfading || !prevSrc ? "opacity-100" : "opacity-0"}`}
                style={{ zIndex: 2 }}
              >
                <Image
                  src={mainImage.url}
                  alt={`${altBase} — foto ${currentIndex + 1} de ${images.length}`}
                  fill
                  className="object-cover cursor-pointer"
                  priority
                  sizes="100vw"
                  onClick={() => openLightbox(currentIndex)}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center" style={{ zIndex: 2 }}>
                <span className="text-[#333]">{t("cardNoImage")}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

            {images.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {images.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Media icons — bottom left */}
            <div className="absolute bottom-4 left-4 z-20">
              <MediaIcons />
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 z-20 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5">
              {currentIndex + 1} / {totalMedia}
            </div>

            {/* Back to listing — top left */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 hover:bg-[#C9B99A] hover:text-black transition-colors group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-body tracking-widest uppercase hidden sm:inline">{t("backToListing")}</span>
            </button>

            {/* View all — top right */}
            {images.length > 1 && (
              <button
                onClick={() => setShowGrid(true)}
                className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 hover:bg-[#C9B99A] hover:text-black transition-colors"
              >
                {t("galleryAllPhotos")} ({images.length})
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="hidden lg:flex gap-1 p-1 bg-black">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => goTo(i)}
                  className={`relative flex-1 aspect-[4/3] overflow-hidden transition-opacity ${currentIndex === i ? "ring-2 ring-[#C9B99A] opacity-100" : "opacity-60 hover:opacity-90"}`}
                >
                  <Image src={img.url} alt={`${altBase} — foto ${i + 1}`} fill className="object-cover" sizes="200px" />
                  {i === 5 && images.length > 6 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-sm font-body">+{images.length - 6}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox — nearly full screen ── */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 h-12 shrink-0">
            <span className="text-white/50 text-sm tabular-nums">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              onClick={closeLightbox}
              className="text-white hover:text-[#C9B99A] transition-colors p-1"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image — fills all remaining vertical space */}
          <div className="relative flex-1 min-h-0">
            <Image
              src={images[lightboxIndex].url}
              alt={`${altBase} — foto ${lightboxIndex + 1} de ${images.length}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/40 hover:bg-black/70 p-2 z-10"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={30} />
              </button>
            )}

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/40 hover:bg-black/70 p-2 z-10"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>

          {/* Bottom: media icons + thumbnails */}
          <div className="shrink-0 bg-black">
            {/* Media icons */}
            {(hasPlano || has360 || hasVideo || hasTour) && (
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <MediaIcons />
              </div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-1 px-3 py-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setLightboxIndex(i)}
                    className={`relative w-16 h-11 shrink-0 overflow-hidden transition-opacity ${lightboxIndex === i ? "ring-1 ring-[#C9B99A] opacity-100" : "opacity-45 hover:opacity-80"}`}
                  >
                    <Image src={img.url} alt={`${altBase} — miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Grid view ── */}
      {showGrid && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[100] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-white">{t("galleryAllPhotos")} — {images.length}</h2>
              <button onClick={() => setShowGrid(false)} className="text-white hover:text-[#C9B99A] transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => { setShowGrid(false); openLightbox(i); }}
                  className="relative aspect-[4/3] overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <Image src={img.url} alt={`${altBase} — foto ${i + 1}`} fill className="object-cover" sizes="400px" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── YouTube video modal ── */}
      {showVideo && ytId && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 h-12 shrink-0">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Play size={14} className="text-[#C9B99A]" />
              <span>{title}</span>
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="text-white hover:text-[#C9B99A] transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
          {/* Video fills remaining space */}
          <div className="flex-1 min-h-0 flex items-center justify-center px-0 pb-0">
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Tour virtual modal ── */}
      {showTour && tour && (
        <div
          className="fixed inset-0 bg-black z-[100] flex flex-col"
          onClick={() => setShowTour(false)}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-[#C9B99A]" />
              <span className="text-white text-sm font-body">Tour virtual — {title}</span>
            </div>
            <button onClick={() => setShowTour(false)} className="text-white hover:text-[#C9B99A] transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={tour}
              title={`Tour virtual — ${title}`}
              allow="fullscreen; vr; xr"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
