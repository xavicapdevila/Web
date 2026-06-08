"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";
import { getCookiesContent } from "./content";

export default function CookiesContent() {
  const { lang, t } = useLanguage();
  const c = getCookiesContent(lang);

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
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s2h}</h2>
            <p className="mb-6">{c.s2intro}</p>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase border border-[#C9B99A]/40 px-2 py-0.5">{c.catNecessary}</span>
                </div>
                <p className="mb-4">{c.catNecessaryDesc}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colCookie}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colProvider}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colDuration}</th>
                        <th className="text-left text-[#666] py-2 font-normal">{c.colPurpose}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_session</td>
                        <td className="py-2 pr-4">{c.ownProvider}</td>
                        <td className="py-2 pr-4">{c.session}</td>
                        <td className="py-2">{c.rowSession}</td>
                      </tr>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">cookie_consent</td>
                        <td className="py-2 pr-4">{c.ownProvider}</td>
                        <td className="py-2 pr-4">{c.months12}</td>
                        <td className="py-2">{c.rowConsent}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">PHPSESSID</td>
                        <td className="py-2 pr-4">{c.ownProvider}</td>
                        <td className="py-2 pr-4">{c.session}</td>
                        <td className="py-2">{c.rowPhp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">{c.catAnalytics}</span>
                </div>
                <p className="mb-4">{c.catAnalyticsDesc}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colCookie}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colProvider}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colDuration}</th>
                        <th className="text-left text-[#666] py-2 font-normal">{c.colPurpose}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">{c.years2}</td>
                        <td className="py-2">{c.rowGa}</td>
                      </tr>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">_ga_*</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">{c.years2}</td>
                        <td className="py-2">{c.rowGaStar}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">_gid</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">{c.hours24}</td>
                        <td className="py-2">{c.rowGid}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-[#666]">
                  {c.moreInfo}{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.googlePrivacy}</a>.
                </p>
              </div>

              {/* Third-party */}
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#888] text-xs font-body tracking-widest uppercase border border-[#444] px-2 py-0.5">{c.catThirdParty}</span>
                </div>
                <p className="mb-4">{c.catThirdPartyDesc}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colCookie}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colProvider}</th>
                        <th className="text-left text-[#666] py-2 pr-4 font-normal">{c.colDuration}</th>
                        <th className="text-left text-[#666] py-2 font-normal">{c.colPurpose}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1a1a1a]">
                        <td className="py-2 pr-4 text-[#ccc]">Google Maps (embed)</td>
                        <td className="py-2 pr-4">Google LLC</td>
                        <td className="py-2 pr-4">{c.variable}</td>
                        <td className="py-2">{c.rowMaps}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[#ccc]">Widget valoración</td>
                        <td className="py-2 pr-4">Idealista.com Networks SL</td>
                        <td className="py-2 pr-4">{c.variable}</td>
                        <td className="py-2">{c.rowWidget}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-[#666] space-y-1">
                  <p>Google LLC: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.googlePrivacy}</a></p>
                  <p>Idealista.com Networks SL: <a href="https://www.idealista.com/legal/politica-privacidad.htm" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.idealistaPrivacy}</a></p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s3h}</h2>
            <div className="space-y-5">
              {[
                { title: c.s3t1, desc: c.s3d1 },
                { title: c.s3t2, desc: c.s3d2 },
                { title: c.s3t3, desc: c.s3d3 },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <p className="text-[#ccc] mb-1">{title}</p>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s4h}</h2>
            <div className="space-y-3">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">{c.s4t1}</p>
                <p>{c.s4d1}</p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">{c.s4t2}</p>
                <p>{c.s4d2}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s5h}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-[#666] py-2 pr-6 font-normal">{c.colCategory}</th>
                    <th className="text-left text-[#666] py-2 font-normal">{c.colRetention}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: c.s5c1, period: c.s5p1 },
                    { cat: c.s5c2, period: c.s5p2 },
                    { cat: c.s5c3, period: c.s5p3 },
                    { cat: c.s5c4, period: c.s5p4 },
                  ].map(({ cat, period }) => (
                    <tr key={cat} className="border-b border-[#1a1a1a]">
                      <td className="py-2 pr-6 text-[#ccc]">{cat}</td>
                      <td className="py-2">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s6h}</h2>
            <p>{c.s6p1}{" "}<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{c.s6link1}</a>.</p>
            <p className="mt-4">{c.s6p2}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s7h}</h2>
            <p className="mb-5">{c.s7intro}</p>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">{c.s7a}</p>
                <p>{c.s7aDesc1} <strong className="text-[#C9B99A]">«{t("cookieManage")}»</strong> {c.s7aDesc2}</p>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] p-5">
                <p className="text-[#ccc] mb-2">{c.s7b}</p>
                <p className="mb-3">{c.s7bDesc}</p>
                <ul className="space-y-2 list-none">
                  {[
                    { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                    { name: "Mozilla Firefox", url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" },
                    { name: "Apple Safari", url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
                    { name: "Microsoft Edge", url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
                  ].map(({ name, url }) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#C9B99A] rounded-full shrink-0" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#C9B99A] hover:underline">{name}</a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[#666]">{c.s7disclaimer}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#666]">{c.s7note}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s8h}</h2>
            <p>{c.s8p}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-4">{c.s9h}</h2>
            <p>{c.s9p}</p>
            <div className="mt-3 bg-[#111] border border-[#1e1e1e] p-5 text-xs space-y-1">
              <p className="text-[#ccc]">{siteConfig.empresa}</p>
              <p>
                {c.fieldEmail}:{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-[#C9B99A] hover:underline">{siteConfig.email}</a>
              </p>
            </div>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6">
          <Link href="/aviso-legal" className="text-[#C9B99A] text-sm hover:underline">{c.backLegal}</Link>
          <Link href="/privacidad" className="text-[#C9B99A] text-sm hover:underline">{c.backPrivacy}</Link>
          <Link href="/" className="text-[#666] text-sm hover:text-[#aaa] transition-colors">{c.backHome}</Link>
        </div>
      </div>
    </div>
  );
}
