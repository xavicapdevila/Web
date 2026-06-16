"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fillTemplate } from "@/lib/i18n";

interface Props {
  url: string;
  titulo: string;
  price: string;
  waUrl: string;
  onClose: () => void;
}

export default function ShareModal({ url, titulo, price, waUrl, onClose }: Props) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — nothing to do
    }
  };

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(fillTemplate(t("propShareEmailMsg"), { titulo, price, url }))}`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-[#111] border border-[#2a2a2a] w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#1e1e1e]">
          <div>
            <h2 className="font-display text-xl text-white mb-1">{t("propShare")}</h2>
            <p className="text-[#888] text-sm leading-snug line-clamp-1">{titulo}</p>
            <p className="text-[#C9B99A] text-sm mt-0.5">{price}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors ml-4 mt-0.5 shrink-0"
            aria-label={t("shareModalClose")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* WhatsApp */}
          <div>
            <p className="text-[#555] text-[10px] font-body tracking-[0.2em] uppercase mb-3">
              {t("shareModalMessaging")}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3 border border-[#25D366]/30 text-[#25D366] text-sm hover:bg-[#25D366]/10 transition-colors"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("shareModalSendWhatsapp")}
            </a>
          </div>

          {/* Copy link */}
          <div>
            <p className="text-[#555] text-[10px] font-body tracking-[0.2em] uppercase mb-3">
              {t("shareModalCopyLink")}
            </p>
            <div className="flex items-stretch gap-0">
              <div className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] border-r-0 px-3 py-2.5 text-[#555] text-xs truncate flex items-center">
                {url}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] text-sm hover:border-[#C9B99A]/40 hover:text-[#C9B99A] transition-colors shrink-0"
              >
                {copied
                  ? <><Check size={13} className="text-[#C9B99A]" /><span className="text-[#C9B99A] text-xs">{t("shareModalCopied")}</span></>
                  : <><Copy size={13} /><span className="text-xs">{t("shareModalCopy")}</span></>
                }
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-[#555] text-[10px] font-body tracking-[0.2em] uppercase mb-3">
              {t("shareModalEmailLabel")}
            </p>
            <a
              href={mailtoUrl}
              className="flex items-center gap-3 w-full px-4 py-3 border border-[#2a2a2a] text-[#888] text-sm hover:border-[#C9B99A]/40 hover:text-[#C9B99A] transition-colors"
            >
              <Mail size={15} className="shrink-0" />
              {t("shareModalSendEmail")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
