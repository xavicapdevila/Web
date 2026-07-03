"use client";

import { useEffect } from "react";
import Script from "next/script";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const bulletKeys = ["valorBullet1", "valorBullet2", "valorBullet3", "valorBullet4"] as const;

/**
 * Tipografía de la web dentro del widget de Idealista: inyecta una regla en su
 * shadow root (abierto) para sustituir su fuente (Bernino) por la nuestra.
 * Solo cosmético — si Idealista cambia su interior, lo peor que ocurre es que
 * vuelva su fuente; el funcionamiento no depende de esto.
 */
function useWidgetBrandFont() {
  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      const el = document.querySelector("idealista-data-valuation-common-embed-app");
      const root = el?.shadowRoot;
      if (root) {
        if (!root.querySelector("#tvh-font-override")) {
          const style = document.createElement("style");
          style.id = "tvh-font-override";
          style.textContent =
            "* { font-family: var(--font-inter), Inter, system-ui, sans-serif !important; }";
          root.appendChild(style);
        }
        clearInterval(interval);
      } else if (++tries > 100) {
        clearInterval(interval); // el widget no cargó (p. ej. bloqueado) — no insistir
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);
}

export default function ValoracionContent() {
  const { t } = useLanguage();
  useWidgetBrandFont();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C9B99A]/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-10 bg-[#C9B99A]" />
              <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
                {t("valorLabel")}
              </span>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl text-white font-light leading-[1.05] mb-6">
              {t("valorTitle1")}
              <br />
              <span className="text-[#C9B99A]">{t("valorTitle2")}</span>
            </h1>

            <div className="space-y-4 text-[#aaa] text-base leading-relaxed mb-10">
              <p>{t("valorIntro1")}</p>
              <p>{t("valorIntro2")}</p>
              <p>{t("valorIntro3")}</p>
            </div>

            <div className="space-y-3 mb-10">
              {bulletKeys.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#C9B99A] shrink-0" />
                  <span className="text-[#ccc] text-sm">{t(key)}</span>
                </div>
              ))}
            </div>

            {/* Contact alternative */}
            <div className="bg-[#111] border border-[#1e1e1e] p-5">
              <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-3">
                {t("valorPreferCall")}
              </p>
              <a
                href="tel:936061800"
                className="text-[#C9B99A] font-display text-lg hover:text-[#DDD0BB] transition-colors"
              >
                936 061 800
              </a>
              <p className="text-[#666] text-xs mt-1">{t("valorScheduleNote")}</p>
            </div>
          </div>

          {/* Right — Idealista embed */}
          <div>
            {/* Sin marco: con la máscara de marca sobre el widget, el recuadro
                dorado era un doble marco innecesario. */}
            <div>
              {/* Centrado y discreto: el widget centra su contenido (m-auto), así
                  la etiqueta alinea con él en vez de colgar del borde izquierdo */}
              <p className="text-center text-[#777] text-[10px] font-body tracking-[0.3em] uppercase mb-5">
                {t("valorWidgetLabel")}
              </p>

              {/* min-h ≈ alto real del primer paso del widget (~333px): evita el
                  salto durante la carga sin dejar un hueco negro debajo. Si el
                  widget crece en pasos posteriores, el contenedor crece con él.

                  El filtro es la «máscara» de marca: invierte el blanco del
                  widget de Idealista a oscuro y le da el tono crema de la web.
                  Es puramente óptico (no toca el shadow DOM del widget), así
                  que no depende de sus clases internas ni puede romperlo. */}
              <div className="min-h-[340px] [filter:invert(0.94)_hue-rotate(180deg)_sepia(0.18)]">
                <Script
                  type="module"
                  src="https://st1.idealista.com/data/static/embeds/valuation-agency/assets/index.js"
                  strategy="lazyOnload"
                />
                {/* @ts-expect-error - custom element */}
                <idealista-data-valuation-common-embed-app agency-id="06575b7d-3e80-4e57-81b2-cb90a16262e8" />
              </div>

              {/* RGPD notice — Idealista processes the valuation data */}
              <p className="text-[#444] text-[11px] leading-relaxed mt-4 px-1">
                {t("valorIdealistaNotice")}{" "}
                <strong className="text-[#555]">Idealista.com Networks SL</strong>{" "}
                <a
                  href="https://www.idealista.com/info/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#555] hover:text-[#C9B99A] underline underline-offset-2"
                >
                  {t("valorIdealistaPrivacy")}
                </a>
                . {t("valorIdealistaContact")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
