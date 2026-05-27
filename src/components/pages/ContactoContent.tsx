"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/config";

export default function ContactoContent() {
  const { t } = useLanguage();

  const schedule = [
    { day: t("contactSchDay1"), hours: t("contactSchHours1") },
    { day: t("contactSchDay2"), hours: t("contactSchHours2") },
    { day: t("contactSchDay3"), hours: t("contactSchHours3") },
  ];

  return (
    <>
      {/* Header */}
      <section className="py-14 lg:py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9B99A]/3 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("contactLabel")}
            </span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-white font-light leading-tight mb-4">
            {t("contactTitle")}
          </h1>
          <p className="text-[#aaa] text-base max-w-xl leading-relaxed">
            {t("contactSubtitle")}
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="pb-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-start gap-5 bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/40 transition-colors group"
              >
                <div className="w-12 h-12 border border-[#C9B99A]/30 flex items-center justify-center shrink-0 group-hover:bg-[#C9B99A]/5 transition-colors">
                  <Phone size={20} className="text-[#C9B99A]" />
                </div>
                <div>
                  <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
                    {t("contactPhoneLabel")}
                  </p>
                  <p className="text-white font-display text-2xl group-hover:text-[#C9B99A] transition-colors">
                    {siteConfig.phoneDisplay}
                  </p>
                  <p className="text-[#666] text-xs mt-1">{t("contactPhoneNote")}</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#25D366]/30 transition-colors group"
              >
                <div className="w-12 h-12 border border-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">WhatsApp</p>
                  <p className="text-white font-display text-2xl group-hover:text-[#25D366] transition-colors">
                    {t("contactWATitle")}
                  </p>
                  <p className="text-[#666] text-xs mt-1">{t("contactWANote")}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-5 bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/40 transition-colors group"
              >
                <div className="w-12 h-12 border border-[#C9B99A]/30 flex items-center justify-center shrink-0 group-hover:bg-[#C9B99A]/5 transition-colors">
                  <Mail size={20} className="text-[#C9B99A]" />
                </div>
                <div>
                  <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
                    {t("contactEmailLabel")}
                  </p>
                  <p className="text-white font-display text-xl group-hover:text-[#C9B99A] transition-colors">
                    {siteConfig.email}
                  </p>
                  <p className="text-[#666] text-xs mt-1">{t("contactEmailNote")}</p>
                </div>
              </a>

              {/* Address */}
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/40 transition-colors group"
              >
                <div className="w-12 h-12 border border-[#C9B99A]/30 flex items-center justify-center shrink-0 group-hover:bg-[#C9B99A]/5 transition-colors">
                  <MapPin size={20} className="text-[#C9B99A]" />
                </div>
                <div>
                  <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
                    {t("contactOfficeLabel")}
                  </p>
                  <p className="text-white font-display text-xl group-hover:text-[#C9B99A] transition-colors">
                    Av. Francesc Macià 48
                  </p>
                  <p className="text-[#aaa] text-sm mt-0.5">08800 Vilanova i la Geltrú</p>
                  <p className="text-[#C9B99A] text-xs mt-2">{t("contactMapsLink")}</p>
                </div>
              </a>

              {/* Hours */}
              <div className="bg-[#111] border border-[#1e1e1e] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Clock size={18} className="text-[#C9B99A]" />
                  <p className="text-[#888] text-xs font-body tracking-wide uppercase">
                    {t("contactScheduleLabel")}
                  </p>
                </div>
                {schedule.map((s) => (
                  <div
                    key={s.day}
                    className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0"
                  >
                    <span className="text-[#aaa] text-sm">{s.day}</span>
                    <span className="text-white text-sm font-body">{s.hours}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="bg-[#111] border border-[#1e1e1e] p-6">
                <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-5">
                  {t("socialLabel")}
                </p>
                <div className="flex items-center gap-6">
                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#aaa] hover:text-[#C9B99A] transition-colors text-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    Instagram
                  </a>
                  <a
                    href={siteConfig.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#aaa] hover:text-[#C9B99A] transition-colors text-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Facebook
                  </a>
                  <a
                    href={siteConfig.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#aaa] hover:text-[#C9B99A] transition-colors text-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                    </svg>
                    TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Map + CTA */}
            <div className="space-y-6">
              <div className="bg-[#111] border border-[#1e1e1e] overflow-hidden h-80 lg:h-[480px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.3!2d1.7266!3d41.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.%20Francesc%20Maci%C3%A0%2048%2C%2008800%20Vilanova%20i%20la%20Geltr%C3%BA!5e0!3m2!1ses!2ses!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Oficina The Vila Home"
                />
              </div>

              <div className="bg-[#111] border border-[#1e1e1e] p-6 text-center">
                <h3 className="font-display text-2xl text-white mb-3">{t("contactValuateTitle")}</h3>
                <p className="text-[#888] text-sm mb-5">{t("contactValuateDesc")}</p>
                <a
                  href="/valoracion"
                  className="inline-block px-8 py-3 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
                >
                  {t("ctaValuate")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
