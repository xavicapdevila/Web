"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, LayoutGrid, RotateCcw, Play, Globe, Maximize, Minimize } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { t } = useLanguage();

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  // Track fullscreen state changes (e.g. user presses Esc)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await lightboxRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const hasPlano = images.some((img) => img.eti === "plano");
  const has360 = images.some((img) => img.eti === "360");
  const hasVideo = Boolean(video);
  const hasTour = Boolean(tour);
  const totalMedia = images.length + (hasVideo ? 1 : 0);

  const mainImage = images[currentIndex] ?? images[0];
  const ytId = video ? getYouTubeId(video) : null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setLightboxIndex(null);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));
  }, [images.length]);

  const MediaIcons = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasPlano && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const planoIdx = images.findIndex((img) => img.eti === "plano");
            if (planoIdx >= 0) openLightbox(planoIdx);
          }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
          title={t("galleryPlan")}
        >
          <LayoutGrid size={12} />
          <span className="hidden sm:inline">{t("galleryPlan")}</span>
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
          title={t("gallery360")}
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">{t("gallery360")}</span>
        </button>
      )}
      {hasVideo && ytId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowVideo(true);
          }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
          title={t("galleryVideo")}
        >
          <Play size={12} />
          <span className="hidden sm:inline">{t("galleryVideo")}</span>
        </button>
      )}
      {hasTour && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTour(true);
          }}
          className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1.5 text-xs hover:bg-[#C9B99A] hover:text-black transition-colors"
          title={t("galleryVirtualTour")}
        >
          <Globe size={12} />
          <span className="hidden sm:inline">{t("galleryVirtualTour")}</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Main gallery layout */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Primary image — carousel */}
          <div
            className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {mainImage ? (
              <Image
                key={currentIndex}
                src={mainImage.url}
                alt={`${altBase} — foto ${currentIndex + 1} de ${images.length}`}
                fill
                className="object-cover cursor-pointer"
                priority={currentIndex === 0}
                sizes="100vw"
                onClick={() => openLightbox(currentIndex)}
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[#333]">{t("cardNoImage")}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Media icons — bottom left */}
            <div className="absolute bottom-4 left-4 z-10">
              <MediaIcons />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5">
              {currentIndex + 1} / {totalMedia}
            </div>

            {/* View all button */}
            {images.length > 1 && (
              <button
                onClick={() => setShowGrid(true)}
                className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 hover:bg-[#C9B99A] hover:text-black transition-colors"
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
                  key={i}
                  onClick={() => setCurrentIndex(i)}
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div ref={lightboxRef} className="fixed inset-0 bg-black/97 z-[100] flex items-center justify-center">
          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Counter */}
            <span className="text-white text-sm font-body">
              {lightboxIndex + 1} / {totalMedia}
            </span>
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#C9B99A] transition-colors p-1"
                title={isFullscreen ? t("galleryExitFullscreen") : t("galleryFullscreen")}
              >
                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>
              <button
                onClick={closeLightbox}
                className="text-white hover:text-[#C9B99A] transition-colors p-1"
              >
                <X size={26} />
              </button>
            </div>
          </div>

          {/* Media icons in lightbox — bottom left */}
          <div className="absolute bottom-20 left-4 z-10">
            <MediaIcons />
          </div>

          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/50 p-1.5 sm:p-2 z-10"
            >
              <ChevronLeft size={24} className="sm:hidden" />
              <ChevronLeft size={32} className="hidden sm:block" />
            </button>
          )}

          <div className={`relative ${isFullscreen ? "w-screen h-screen" : "w-full max-w-5xl max-h-[85vh] aspect-video mx-2 sm:mx-8 lg:mx-16"}`}>
            <Image
              src={images[lightboxIndex].url}
              alt={`${altBase} — foto ${lightboxIndex + 1} de ${images.length}`}
              fill
              className={isFullscreen ? "object-contain" : "object-contain"}
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/50 p-1.5 sm:p-2 z-10"
            >
              <ChevronRight size={24} className="sm:hidden" />
              <ChevronRight size={32} className="hidden sm:block" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto px-4">
            {images.slice(0, 10).map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative w-16 h-12 shrink-0 overflow-hidden transition-opacity ${lightboxIndex === i ? "ring-1 ring-[#C9B99A] opacity-100" : "opacity-50 hover:opacity-80"}`}
              >
                <Image src={img.url} alt={`${altBase} — miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid view */}
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
                  key={i}
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

      {/* YouTube video modal */}
      {showVideo && ytId && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 text-white hover:text-[#C9B99A] transition-colors z-10"
          >
            <X size={28} />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-video mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Tour virtual modal */}
      {showTour && tour && (
        <div
          className="fixed inset-0 bg-black/97 z-[100] flex flex-col"
          onClick={() => setShowTour(false)}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-[#C9B99A]" />
              <span className="text-white text-sm font-body">Tour virtual — {title}</span>
            </div>
            <button
              onClick={() => setShowTour(false)}
              className="text-white hover:text-[#C9B99A] transition-colors"
            >
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
