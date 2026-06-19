"use client";

import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";

export default function SocialSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#050505] border-t border-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-10 bg-[#C9B99A]" />
          <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
            {t("socialLabel")}
          </span>
          <span className="h-px w-10 bg-[#C9B99A]" />
        </div>

        <h2 className="font-display text-3xl lg:text-4xl text-white font-light mb-14">{t("socialFollow")}</h2>

        <div className="flex items-center justify-center gap-10 md:gap-20">
          {/* Instagram */}
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-[#666] hover:text-[#C9B99A] transition-colors"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span className="text-xs font-body tracking-wide">Instagram</span>
          </a>

          {/* Facebook */}
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-[#666] hover:text-[#C9B99A] transition-colors"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            <span className="text-xs font-body tracking-wide">Facebook</span>
          </a>

          {/* TikTok */}
          <a
            href={siteConfig.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-[#666] hover:text-[#C9B99A] transition-colors"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
            </svg>
            <span className="text-xs font-body tracking-wide">TikTok</span>
          </a>
        </div>
      </div>
    </section>
  );
}
