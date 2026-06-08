"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";
import { getPrivacidadContent } from "./content";

export default function PrivacidadContent() {
  const { lang } = useLanguage();
  const c = getPrivacidadContent(lang);

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
            <div className="bg-[#111] border border-[#1e1e1e] p-5 space-y-2">
              <p><span className="text-white">{c.fieldController}:</span> {siteConfig.empresa}</p>
              <p><span className="text-white">{c.fieldNif}:</span> {siteConfig.nif}</p>
              <p><span className="text-white">{c.fieldAddress}:</span> {siteConfig.address}</p>
              <p>
                <span className="text-white">{c.fieldContact}:</span>{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">{siteConfig.email}</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s2h}</h2>
            <p>{c.s2intro}</p>
            <ul className="mt-3 space-y-2 list-none">
              {[c.s2item1, c.s2item2, c.s2item3].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s3h}</h2>
            <div className="space-y-4">
              {[
                { title: c.s3t1, desc: c.s3d1, basis: c.s3b1 },
                { title: c.s3t2, desc: c.s3d2, basis: c.s3b2 },
                { title: c.s3t3, desc: c.s3d3, basis: c.s3b3 },
                { title: c.s3t4, desc: c.s3d4, basis: c.s3b4 },
              ].map(({ title, desc, basis }) => (
                <div key={title} className="bg-[#111] border border-[#1e1e1e] p-5">
                  <p className="text-white mb-1">{title}</p>
                  <p>{desc}</p>
                  <p className="mt-1 text-[#666]">{basis}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s4h}</h2>
            <p>{c.s4intro}</p>
            <ul className="mt-3 space-y-2 list-none">
              {[c.s4item1, c.s4item2, c.s4item3, c.s4item4].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s5h}</h2>
            <p>{c.s5intro}</p>
            <ul className="mt-3 space-y-2 list-none">
              {[c.s5item1, c.s5item2, c.s5item3].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">{c.s5outro}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s6h}</h2>
            <p>{c.s6intro}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { right: c.s6r1, desc: c.s6d1 },
                { right: c.s6r2, desc: c.s6d2 },
                { right: c.s6r3, desc: c.s6d3 },
                { right: c.s6r4, desc: c.s6d4 },
                { right: c.s6r5, desc: c.s6d5 },
                { right: c.s6r6, desc: c.s6d6 },
              ].map(({ right, desc }) => (
                <div key={right} className="bg-[#111] border border-[#1e1e1e] p-4">
                  <p className="text-white mb-1">{right}</p>
                  <p className="text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              {c.s6outro1}{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">{siteConfig.email}</a>{" "}
              {c.s6outro2} (
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">www.aepd.es</a>
              ).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s7h}</h2>
            <p>{c.s7p}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s8h}</h2>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">{c.s8t1}</p>
                <p>
                  {c.s8p1}{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.s8link1}</a>.
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">{c.s8t2}</p>
                <p>
                  {c.s8p2}{" "}
                  <a href="https://www.idealista.com/info/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.s8link2}</a>.{" "}
                  {c.s8p2b}
                </p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-white mb-1">{c.s8t3}</p>
                <p>
                  {c.s8p3}{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.s8link3}</a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s9h}</h2>
            <p>
              {c.s9p}{" "}
              <Link href="/cookies" className="text-[#C9B99A] hover:underline">{c.s9cookiesLink}</Link>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/aviso-legal" className="text-[#C9B99A] text-sm hover:underline">{c.backLegal}</Link>
          <Link href="/cookies" className="text-[#C9B99A] text-sm hover:underline">{c.backCookies}</Link>
          <Link href="/" className="text-[#666] text-sm hover:text-[#aaa] transition-colors">{c.backHome}</Link>
        </div>
      </div>
    </div>
  );
}
