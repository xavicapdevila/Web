"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const agents = [
  {
    name: "Ariadna Garcia",
    descKey: "aboutDesc1" as const,
    roleKey: "aboutRoleAdvisor" as const,
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

const bulletKeys = ["aboutBullet1", "aboutBullet2", "aboutBullet3", "aboutBullet4"] as const;

export default function QuienesSomosContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero — compact */}
      <section className="py-16 lg:py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#C9B99A]/4 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("aboutLabel")}
            </span>
          </div>
          <h1 className="font-display text-4xl lg:text-6xl text-white font-light leading-tight mb-10">
            {t("navAbout")}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <p className="text-[#aaa] text-base leading-relaxed">{t("aboutIntro1")}</p>
            <p className="text-[#aaa] text-base leading-relaxed">{t("aboutIntro2")}</p>
          </div>
        </div>
      </section>

      {/* Bullets */}
      <section className="py-16 bg-[#080808] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]">
            {bulletKeys.map((key, i) => (
              <div key={key} className="bg-[#080808] p-8 lg:p-10 flex flex-col gap-4">
                <span className="font-display text-4xl text-[#C9B99A]/25 leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-white text-base leading-relaxed font-body">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-14">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("aboutTeamLabel")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {agents.map((agent) => (
              <div key={agent.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-[#111]">
                  <div className="absolute inset-0 border border-[#1e1e1e] group-hover:border-[#C9B99A]/30 transition-colors duration-500 z-10 pointer-events-none" />
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-display text-xl text-white mb-0.5">{agent.name}</h3>
                <p className="text-[#C9B99A] text-xs font-body tracking-wide uppercase mb-3">
                  {t(agent.roleKey)}
                </p>
                <p className="text-[#777] text-sm leading-relaxed text-justify">
                  {t(agent.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080808] border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-white font-light mb-4">{t("aboutCTATitle")}</h2>
          <p className="text-[#888] mb-8 max-w-sm mx-auto text-balance">{t("aboutCTASubtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="px-8 py-4 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
            >
              {t("ctaContact")}
            </Link>
            <Link
              href="/valoracion"
              className="px-8 py-4 border border-[#C9B99A]/40 text-[#C9B99A] font-body text-sm tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
            >
              {t("ctaValuate")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
