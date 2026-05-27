"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const bulletKeys = ["aboutBullet1", "aboutBullet2", "aboutBullet3", "aboutBullet4"] as const;

const agents = [
  {
    name: "Ariadna Garcia",
    descKey: "aboutDesc1" as const,
    roleKey: "aboutRoleManager" as const,
    photo: "/images/agents/ariadna.jpg",
  },
  {
    name: "Sofía Pascual",
    descKey: "aboutDesc2" as const,
    roleKey: "aboutRoleAdvisor" as const,
    photo: "/images/agents/sofia.jpg",
  },
  {
    name: "Xavier Capdevila",
    descKey: "aboutDesc3" as const,
    roleKey: "aboutRoleFounder" as const,
    photo: "/images/agents/xavier.jpg",
  },
];

export default function QuienesSomosContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Intro */}
      <section className="py-10 lg:py-14 border-b border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-8 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("aboutLabel")}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Paragraphs */}
            <div className="flex flex-col gap-4">
              <p className="text-[#999] text-sm leading-relaxed">{t("aboutIntro1")}</p>
              <p className="text-[#999] text-sm leading-relaxed">{t("aboutIntro2")}</p>
            </div>
            {/* Bullets */}
            <ul className="flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-[#1e1e1e] pt-6 lg:pt-0 lg:pl-10">
              {bulletKeys.map((key, i) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="shrink-0 font-display text-[#C9B99A]/40 text-xs leading-relaxed tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[#888] text-sm leading-relaxed">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="py-14 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-8 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("aboutTeamLabel")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {agents.map((agent) => (
              <div key={agent.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#111]">
                  <div className="absolute inset-0 border border-[#1e1e1e] group-hover:border-[#C9B99A]/30 transition-colors duration-500 z-10 pointer-events-none" />
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-display text-lg text-white mb-0.5">{agent.name}</h3>
                <p className="text-[#C9B99A] text-xs font-body tracking-wide uppercase mb-2">
                  {t(agent.roleKey)}
                </p>
                <p className="text-[#777] text-sm leading-relaxed">
                  {t(agent.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#080808] border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl text-white font-light mb-3">{t("aboutCTATitle")}</h2>
          <p className="text-[#888] mb-6 text-sm">{t("aboutCTASubtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contacto"
              className="px-7 py-3 bg-[#C9B99A] text-black font-body text-xs tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
            >
              {t("ctaContact")}
            </Link>
            <Link
              href="/valoracion"
              className="px-7 py-3 border border-[#C9B99A]/40 text-[#C9B99A] font-body text-xs tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
            >
              {t("ctaValuate")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
