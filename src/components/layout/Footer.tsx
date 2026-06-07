"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";
import { useCookieConsent } from "@/context/CookieConsentContext";

export default function Footer() {
  const { t } = useLanguage();
  const { openPreferences } = useCookieConsent();

  const navLinks = [
    { href: "/propiedades", label: t("navProperties") },
    { href: "/quienes-somos", label: t("navAbout") },
    { href: "/valoracion", label: t("footerValuationFree") },
    { href: "/blog", label: t("navBlog") },
    { href: "/contacto", label: t("navContact") },
  ];

  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col leading-none items-start">
              <img src="/logo.svg" alt="The Vila Home" className="h-10 w-auto -ml-[9px]" />
              <span className="text-[#555] text-[10px] tracking-[0.3em] uppercase font-body mt-2">
                Human Real Estate
              </span>
            </Link>
            <p className="mt-6 text-[#666] text-sm leading-relaxed max-w-xs">
              {t("footerTagline")}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] hover:text-[#C9B99A] transition-colors"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] hover:text-[#C9B99A] transition-colors"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href={siteConfig.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] hover:text-[#C9B99A] transition-colors"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-xs font-body tracking-widest uppercase mb-5">
              {t("footerNavTitle")}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#666] hover:text-[#C9B99A] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zonas */}
          <div>
            <h3 className="text-white text-xs font-body tracking-widest uppercase mb-5">Zonas</h3>
            <ul className="space-y-3">
              {[
                { href: "/zona/vilanova",          label: "Vilanova i la Geltrú" },
                { href: "/zona/sitges",            label: "Sitges" },
                { href: "/zona/cubelles",          label: "Cubelles" },
                { href: "/zona/sant-pere-de-ribes",label: "Sant Pere de Ribes" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#666] hover:text-[#C9B99A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs font-body tracking-widest uppercase mb-5">
              {t("footerContactTitle")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-start gap-3 text-[#666] hover:text-[#C9B99A] transition-colors group"
                >
                  <Phone size={14} className="mt-0.5 shrink-0" />
                  <span className="text-sm">{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-3 text-[#666] hover:text-[#C9B99A] transition-colors"
                >
                  <Mail size={14} className="mt-0.5 shrink-0" />
                  <span className="text-sm">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[#666] hover:text-[#C9B99A] transition-colors"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">
                    Av. Francesc Macià 48
                    <br />
                    08800 Vilanova i la Geltrú
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-xs">{t("footerRights")}</p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/aviso-legal" className="text-[#444] hover:text-[#666] text-xs transition-colors">
              {t("footerLegal")}
            </Link>
            <Link href="/privacidad" className="text-[#444] hover:text-[#666] text-xs transition-colors">
              {t("footerPrivacy")}
            </Link>
            <Link href="/cookies" className="text-[#444] hover:text-[#666] text-xs transition-colors">
              {t("footerCookies")}
            </Link>
            <button
              onClick={openPreferences}
              className="text-[#444] hover:text-[#666] text-xs transition-colors"
            >
              {t("cookieManage")}
            </button>
            <a
              href={siteConfig.canalDenuncia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#444] hover:text-[#666] text-xs transition-colors"
            >
              {t("footerComplaints")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
