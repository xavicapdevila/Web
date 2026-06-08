"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";
import { getAvisoContent } from "./content";

export default function AvisoLegalContent() {
  const { lang } = useLanguage();
  const c = getAvisoContent(lang);

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">Legal</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl text-white font-light mb-4">{c.title}</h1>
          <p className="text-[#666] text-sm">{c.updated}</p>
        </div>

        <div className="space-y-10 text-[#aaa] text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s1h}</h2>
            <p>{c.s1p}</p>
            <div className="mt-4 bg-[#111] border border-[#1e1e1e] p-5 space-y-2">
              <p><span className="text-white">{c.fieldCompany}:</span> {siteConfig.empresa}</p>
              <p><span className="text-white">{c.fieldNif}:</span> {siteConfig.nif}</p>
              <p><span className="text-white">{c.fieldAddress}:</span> {siteConfig.address}</p>
              <p><span className="text-white">{c.fieldPhone}:</span> {siteConfig.phoneDisplay}</p>
              <p><span className="text-white">{c.fieldEmail}:</span> {siteConfig.email}</p>
              <p><span className="text-white">{c.fieldWebsite}:</span> thevilahome.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s2h}</h2>
            <p>{c.s2p}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s3h}</h2>
            <p>{c.s3p1}</p>
            <p className="mt-3">{c.s3p2}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s4h}</h2>
            <p>{c.s4p1}</p>
            <p className="mt-3">{c.s4p2}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s5h}</h2>
            <p>{c.s5p1}</p>
            <p className="mt-3">{c.s5p2}</p>
            <p className="mt-3">{c.s5p3}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s6h}</h2>
            <p>
              {c.s6pre}{" "}
              <Link href="/privacidad" className="text-[#C9B99A] hover:underline">{c.s6privLink}</Link>{" "}
              {c.s6mid}{" "}
              <Link href="/cookies" className="text-[#C9B99A] hover:underline">{c.s6cookLink}</Link>
              {c.s6post}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s7h}</h2>
            <p>{c.s7p}</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/privacidad" className="text-[#C9B99A] text-sm hover:underline">{c.backPrivacy}</Link>
          <Link href="/cookies" className="text-[#C9B99A] text-sm hover:underline">{c.backCookies}</Link>
          <Link href="/" className="text-[#666] text-sm hover:text-[#aaa] transition-colors">{c.backHome}</Link>
        </div>
      </div>
    </div>
  );
}
