"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { GoogleReview } from "@/lib/googlePlaces";

function ReviewCard({ review, index, inView }: { review: GoogleReview; index: number; inView: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setOverflows(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, []);

  return (
    <div
      className="bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/30 transition-all duration-500 flex flex-col"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms, border-color 0.3s ease`,
      }}
    >
      <StarRating rating={review.rating} />
      <div className="my-4 flex-1">
        <p
          ref={textRef}
          className={`text-[#bbb] text-sm leading-relaxed${expanded ? "" : " line-clamp-5"}`}
        >
          &ldquo;{review.text}&rdquo;
        </p>
        {!expanded && overflows && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-1 text-[#C9B99A] text-xs font-body hover:text-white transition-colors cursor-pointer"
          >
            Leer más
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 border-t border-[#1e1e1e] pt-4">
        <div className="w-8 h-8 rounded-full bg-[#C9B99A]/20 flex items-center justify-center shrink-0">
          <span className="text-[#C9B99A] text-xs font-display">{review.author.charAt(0)}</span>
        </div>
        <span className="text-white text-sm font-body">{review.author}</span>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={i < rating ? "text-[#fbbc04]" : "text-[#333]"}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

interface Props {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
}

export default function Testimonials({ reviews, rating, totalReviews }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-[#C9B99A]/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className="mb-16 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("testimonialsLabel")}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl lg:text-5xl text-white font-light leading-tight mb-4">
                {t("testimonialsTitle")}
              </h2>
              <p className="text-[#888] text-base leading-relaxed">
                {t("testimonialsSubtitle")}
              </p>
            </div>

            {/* Google rating badge */}
            <div className="flex items-center gap-4 bg-[#111] border border-[#1e1e1e] px-6 py-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-white font-display text-2xl">{rating}</span>
                </div>
                <StarRating rating={5} />
              </div>
              <div className="h-10 w-px bg-[#2a2a2a]" />
              <div className="text-center">
                <div className="text-white font-display text-xl">{totalReviews}</div>
                <div className="text-[#666] text-xs font-body">{t("testimonialsReviews")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
