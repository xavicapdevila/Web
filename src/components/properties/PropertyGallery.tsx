"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, RotateCcw, Play, Globe, ArrowLeft, MapPin, Camera, Rotate3d } from "lucide-react";
import { FloorPlanIcon } from "./icons";
import type { PropertyImage, FloorPlanPin } from "@/types/property";
import { getYouTubeId } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

// The main gallery image never renders wider than max-w-7xl (1280px), so cap the
// requested size there instead of 100vw. Avoids fetching oversized variants on
// wide screens and makes loading / paging noticeably faster.
const GALLERY_SIZES = "(min-width: 1280px) 1280px, 100vw";

interface Props {
  images: PropertyImage[];
  video?: string;
  tour?: string;
  title: string;
  ciudad?: string;
  tipo?: string;
  planoPins?: FloorPlanPin[];
}

export default function PropertyGallery({ images, video, tour, title, ciudad, tipo, planoPins = [] }: Props) {
  const altBase = [tipo, ciudad].filter(Boolean).join(" en ") || title;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showPinPlano, setShowPinPlano] = useState(false);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [pinLightboxUrl, setPinLightboxUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  // ── Main carousel: native scroll-snap track (the finger drags the photo) ──
  const trackRef = useRef<HTMLDivElement>(null);
  const trackRaf = useRef<number | null>(null);

  const goTo = useCallback((idx: number, smooth = true) => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const goPrev = useCallback(() => {
    // Wrap-around jumps instantly; adjacent steps animate
    if (currentIndex === 0) goTo(images.length - 1, false);
    else goTo(currentIndex - 1);
  }, [currentIndex, images.length, goTo]);

  const goNext = useCallback(() => {
    if (currentIndex === images.length - 1) goTo(0, false);
    else goTo(currentIndex + 1);
  }, [currentIndex, images.length, goTo]);

  const onTrackScroll = useCallback(() => {
    if (trackRaf.current !== null) return;
    trackRaf.current = requestAnimationFrame(() => {
      trackRaf.current = null;
      const el = trackRef.current;
      if (!el || !el.clientWidth) return;
      const idx = Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
      setCurrentIndex((prev) => (prev === idx ? prev : idx));
    });
  }, [images.length]);

  // ── Lightbox: same mechanism on its own track ──
  const lbTrackRef = useRef<HTMLDivElement>(null);
  const lbRaf = useRef<number | null>(null);
  const lbOpenIndex = useRef(0);

  const onLbScroll = useCallback(() => {
    if (lbRaf.current !== null) return;
    lbRaf.current = requestAnimationFrame(() => {
      lbRaf.current = null;
      const el = lbTrackRef.current;
      if (!el || !el.clientWidth) return;
      const idx = Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
      setLightboxIndex((prev) => (prev === null || prev === idx ? prev : idx));
    });
  }, [images.length]);

  const lbGoTo = useCallback((target: number) => {
    const el = lbTrackRef.current;
    if (!el || !el.clientWidth) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    el.scrollTo({ left: target * el.clientWidth, behavior: Math.abs(target - current) === 1 ? "smooth" : "auto" });
  }, []);

  useEffect(() => () => {
    if (trackRaf.current !== null) cancelAnimationFrame(trackRaf.current);
    if (lbRaf.current !== null) cancelAnimationFrame(lbRaf.current);
  }, []);

  const hasPlano = images.some((img) => img.eti === "plano");
  const hasPinPlano = planoPins.length > 0 && hasPlano;
  const has360 = images.some((img) => img.eti === "360");
  const hasVideo = Boolean(video);
  const hasTour = Boolean(tour);
  const totalMedia = images.length + (hasVideo ? 1 : 0);

  const ytId = video ? getYouTubeId(video) : null;

  const openLightbox = (index: number) => {
    lbOpenIndex.current = index;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    // Leave the main carousel on the photo the user was viewing
    const lb = lbTrackRef.current;
    const main = trackRef.current;
    if (lb && main && lb.clientWidth && main.clientWidth) {
      main.scrollLeft = Math.round(lb.scrollLeft / lb.clientWidth) * main.clientWidth;
    }
    setLightboxIndex(null);
  }, []);

  // Ref callback: positions the lightbox track on the tapped photo at mount, before paint
  const setLbTrack = useCallback((el: HTMLDivElement | null) => {
    lbTrackRef.current = el;
    if (el && el.clientWidth) el.scrollLeft = lbOpenIndex.current * el.clientWidth;
  }, []);

  const prevImage = useCallback(() => {
    const el = lbTrackRef.current;
    if (!el || !el.clientWidth) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    lbGoTo((current - 1 + images.length) % images.length);
  }, [images.length, lbGoTo]);

  const nextImage = useCallback(() => {
    const el = lbTrackRef.current;
    if (!el || !el.clientWidth) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    lbGoTo((current + 1) % images.length);
  }, [images.length, lbGoTo]);

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

  const chipClass =
    "group/chip flex items-center gap-2 h-9 pl-3 pr-3.5 rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/15 shadow-lg shadow-black/20 text-white text-xs font-body hover:bg-[#C9B99A] hover:ring-[#C9B99A] hover:text-black transition-all duration-300";
  const chipIconClass = "text-[#C9B99A] group-hover/chip:text-black transition-colors duration-300";

  const MediaIcons = () => (
    <div className="flex flex-wrap items-center gap-2">
      {hasPlano && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasPinPlano) {
              setShowPinPlano(true);
              setActivePinId(null);
              setPinLightboxUrl(null);
            } else {
              const planoIdx = images.findIndex((img) => img.eti === "plano");
              if (planoIdx >= 0) openLightbox(planoIdx);
            }
          }}
          className={chipClass}
        >
          <FloorPlanIcon size={13} className={chipIconClass} />
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
          className={chipClass}
        >
          <RotateCcw size={13} className={chipIconClass} />
          <span>{t("gallery360")}</span>
        </button>
      )}
      {hasVideo && ytId && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowVideo(true); }}
          className={chipClass}
        >
          <Play size={13} fill="currentColor" className={chipIconClass} />
          <span>{t("galleryVideo")}</span>
        </button>
      )}
      {hasTour && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowTour(true); }}
          className={chipClass}
        >
          <Rotate3d size={13} className={chipIconClass} />
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
          {/* Primary image — native swipe carousel */}
          <div className="relative aspect-[16/9] lg:aspect-[21/9] max-h-[80vh] overflow-hidden select-none">
            {images.length > 0 ? (
              <div
                ref={trackRef}
                onScroll={onTrackScroll}
                className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
              >
                {images.map((img, i) => (
                  <div key={img.url} className="relative w-full h-full flex-none snap-center">
                    <Image
                      src={img.url}
                      alt={`${altBase} — foto ${i + 1} de ${images.length}`}
                      fill
                      className="object-cover cursor-pointer"
                      priority={i === 0}
                      loading={i <= 2 || Math.abs(i - currentIndex) <= 2 ? "eager" : "lazy"}
                      sizes={GALLERY_SIZES}
                      onClick={() => openLightbox(i)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[#333]">{t("cardNoImage")}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

            {/* Arrows — desktop only; on touch you just swipe */}
            {images.length > 1 && (
              <button
                onClick={goPrev}
                className="hidden [@media(hover:hover)]:block absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {images.length > 1 && (
              <button
                onClick={goNext}
                className="hidden [@media(hover:hover)]:block absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors"
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
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/15 text-white text-xs tabular-nums">
              <Camera size={13} className="text-[#C9B99A]" />
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

        </div>
      </div>

      {/* ── Lightbox — nearly full screen ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de fotos — ${lightboxIndex + 1} de ${images.length}`}
        >

          {/* Top bar — floats over the photo in phone landscape so it can fill the screen */}
          <div className="flex items-center justify-between px-5 h-12 shrink-0 landscape-phone:absolute landscape-phone:inset-x-0 landscape-phone:top-0 landscape-phone:z-20 landscape-phone:bg-gradient-to-b landscape-phone:from-black/60 landscape-phone:to-transparent">
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

          {/* Image track — fills all remaining vertical space, fluid swipe */}
          <div className="relative flex-1 min-h-0">
            <div
              ref={setLbTrack}
              onScroll={onLbScroll}
              className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain select-none"
            >
              {images.map((img, i) => (
                <div key={img.url} className="relative w-full h-full flex-none snap-center">
                  <Image
                    src={img.url}
                    alt={`${altBase} — foto ${i + 1} de ${images.length}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    loading={Math.abs(i - lightboxIndex) <= 1 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Arrows — desktop only; on touch you just swipe */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="hidden [@media(hover:hover)]:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/40 hover:bg-black/70 p-2 z-10"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={30} />
              </button>
            )}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="hidden [@media(hover:hover)]:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C9B99A] transition-colors bg-black/40 hover:bg-black/70 p-2 z-10"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>

          {/* Bottom: media icons — hidden in phone landscape */}
          {(hasPlano || has360 || hasVideo || hasTour) && (
            <div className="shrink-0 bg-black landscape-phone:hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <MediaIcons />
              </div>
            </div>
          )}
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

      {/* ── Plano interactivo ── */}
      {showPinPlano && (() => {
        const planoImg = images.find(i => i.eti === "plano");
        const activePin = planoPins.find(p => p.id === activePinId) ?? null;
        return (
          <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-[#1e1e1e]">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} className="text-[#C9B99A]" />
                <span>{title} — Plano interactivo</span>
              </div>
              <button onClick={() => { setShowPinPlano(false); setActivePinId(null); setPinLightboxUrl(null); }}
                className="text-white hover:text-[#C9B99A] transition-colors p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Floor plan with pins */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <div className="relative inline-block" style={{ maxHeight: "calc(100vh - 100px)" }}>
                  {planoImg && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={planoImg.url}
                      alt="Plano"
                      className="max-w-full object-contain block"
                      style={{ maxHeight: "calc(100vh - 100px)" }}
                    />
                  )}
                  {planoPins.map(pin => {
                    const isActive = pin.id === activePinId;
                    return (
                      <button
                        key={pin.id}
                        onClick={() => setActivePinId(isActive ? null : pin.id)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 z-10 group"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        title={pin.label}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-2 transition-all ${
                          isActive
                            ? "bg-[#C9B99A] border-white scale-110"
                            : "bg-black/80 border-[#C9B99A] hover:scale-110 hover:bg-[#C9B99A]/20"
                        }`}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke={isActive ? "#000" : "#C9B99A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                        </div>
                        {pin.label && (
                          <span className={`text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded shadow pointer-events-none ${
                            isActive ? "bg-[#C9B99A] text-black font-semibold" : "bg-black/80 text-white"
                          }`}>
                            {pin.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right panel: photos of active pin */}
              {activePin && (
                <div className="w-72 shrink-0 border-l border-[#1e1e1e] bg-[#0d0d0d] flex flex-col">
                  <div className="px-4 py-3 border-b border-[#1a1a1a]">
                    <p className="text-white text-sm font-body">{activePin.label}</p>
                    <p className="text-[#555] text-xs">{activePin.fotos.length} fotos</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      {activePin.fotos.map((url, i) => (
                        <button
                          key={url}
                          onClick={() => setPinLightboxUrl(url)}
                          className="relative aspect-[4/3] overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`${activePin.label} — ${i + 1}`} className="w-full h-full object-cover" loading="eager" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lightbox for pin photos */}
            {pinLightboxUrl && (
              <div className="fixed inset-0 bg-black z-[110] flex flex-col" onClick={() => setPinLightboxUrl(null)}>
                <div className="flex items-center justify-end px-5 h-12 shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setPinLightboxUrl(null)} className="text-white hover:text-[#C9B99A] transition-colors p-1">
                    <X size={24} />
                  </button>
                </div>
                <div className="relative flex-1 min-h-0" onClick={e => e.stopPropagation()}>
                  <Image src={pinLightboxUrl} alt={activePin?.label ?? ""} fill className="object-contain" sizes="100vw" priority />
                </div>
                {/* Nav arrows within pin photos */}
                {activePin && activePin.fotos.length > 1 && (() => {
                  const idx = activePin.fotos.indexOf(pinLightboxUrl);
                  return (
                    <>
                      <button onClick={e => { e.stopPropagation(); setPinLightboxUrl(activePin.fotos[(idx - 1 + activePin.fotos.length) % activePin.fotos.length]); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setPinLightboxUrl(activePin.fotos[(idx + 1) % activePin.fotos.length]); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 transition-colors">
                        <ChevronRight size={24} />
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })()}

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
