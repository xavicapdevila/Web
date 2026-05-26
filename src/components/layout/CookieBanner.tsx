"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight, ShieldCheck } from "lucide-react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { useLanguage } from "@/context/LanguageContext";

// ── Toggle switch ──────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9B99A] ${
        checked ? "bg-[#C9B99A]" : "bg-[#2a2a2a]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

// ── Category row ───────────────────────────────────────────────────────────

function CategoryRow({
  title,
  desc,
  enabled,
  onChange,
  alwaysOn,
  alwaysOnLabel,
}: {
  title: string;
  desc: string;
  enabled: boolean;
  onChange?: (v: boolean) => void;
  alwaysOn?: boolean;
  alwaysOnLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-[#1e1e1e] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-body tracking-wide">{title}</p>
        <p className="text-[#666] text-xs leading-relaxed mt-0.5">{desc}</p>
      </div>
      {alwaysOn ? (
        <span className="text-[#C9B99A] text-[10px] font-body tracking-widest uppercase shrink-0 mt-0.5">
          {alwaysOnLabel}
        </span>
      ) : (
        <Toggle checked={enabled} onChange={onChange} />
      )}
    </div>
  );
}

// ── Main banner component ──────────────────────────────────────────────────

export default function CookieBanner() {
  const { consent, saveConsent, openPreferences, preferencesOpen } = useCookieConsent();
  const { t } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Open state: either the context triggered it (from footer) or showModal is true
  const modalOpen = showModal || preferencesOpen;

  // Nothing to show if user already made a choice and preferences not open
  if (consent !== null && !preferencesOpen) return null;

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setShowModal(false);
  };

  const handleRejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    saveConsent({ analytics, marketing });
  };

  const handleOpenModal = () => {
    // Pre-fill toggles from existing consent if available
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // If opened from preferences (no prior consent), keep banner visible
    if (consent !== null) {
      // just close; context will close preferencesOpen
      saveConsent({ analytics: consent.analytics, marketing: consent.marketing });
    }
  };

  return (
    <>
      {/* ── Compact banner (shown until user decides) ── */}
      {!modalOpen && (
        <div
          role="dialog"
          aria-label={t("cookieBannerTitle")}
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0e0e0e] border-t border-[#1e1e1e] px-4 py-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ShieldCheck size={18} className="text-[#C9B99A] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-white text-sm font-body font-medium">
                  {t("cookieBannerTitle")}
                </p>
                <p className="text-[#666] text-xs leading-relaxed mt-0.5 line-clamp-2">
                  {t("cookieBannerText")}{" "}
                  <Link
                    href="/cookies"
                    className="text-[#C9B99A] hover:underline underline-offset-2"
                  >
                    {t("cookiePolicyLink")}
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions — equal prominence for accept / reject */}
            <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 border border-[#2a2a2a] text-[#aaa] font-body text-xs tracking-wide hover:border-[#444] hover:text-white transition-colors whitespace-nowrap"
              >
                {t("cookieBannerRejectAll")}
              </button>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-1 px-4 py-2 border border-[#2a2a2a] text-[#aaa] font-body text-xs tracking-wide hover:border-[#444] hover:text-white transition-colors whitespace-nowrap"
              >
                {t("cookieBannerConfigure")}
                <ChevronRight size={12} />
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-[#C9B99A] text-black font-body text-xs tracking-wide hover:bg-[#DDD0BB] transition-colors whitespace-nowrap"
              >
                {t("cookieBannerAcceptAll")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences modal ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("cookieModalTitle")}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-lg bg-[#0e0e0e] border border-[#1e1e1e] sm:mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#C9B99A]" />
                <h2 className="font-display text-white text-lg font-light">
                  {t("cookieModalTitle")}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[#555] hover:text-white transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div className="px-6 py-2">
              <CategoryRow
                title={t("cookieModalEssentialTitle")}
                desc={t("cookieModalEssentialDesc")}
                enabled={true}
                alwaysOn
                alwaysOnLabel={t("cookieAlwaysOn")}
              />
              <CategoryRow
                title={t("cookieModalAnalyticsTitle")}
                desc={t("cookieModalAnalyticsDesc")}
                enabled={analytics}
                onChange={setAnalytics}
              />
              <CategoryRow
                title={t("cookieModalMarketingTitle")}
                desc={t("cookieModalMarketingDesc")}
                enabled={marketing}
                onChange={setMarketing}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#1e1e1e] flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2.5 border border-[#2a2a2a] text-[#aaa] font-body text-xs tracking-wide hover:border-[#C9B99A]/40 hover:text-white transition-colors"
              >
                {t("cookieModalSave")}
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2.5 bg-[#C9B99A] text-black font-body text-xs tracking-wide hover:bg-[#DDD0BB] transition-colors"
              >
                {t("cookieModalAcceptAll")}
              </button>
            </div>

            {/* Policy link */}
            <p className="px-6 pb-5 text-center">
              <Link
                href="/cookies"
                className="text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
                onClick={handleCloseModal}
              >
                {t("cookiePolicyLink")}
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
