"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";

const numbers = ["01", "02", "03"];

export default function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const steps = [
    { number: numbers[0], title: t("howStep1Title"), description: t("howStep1Desc") },
    { number: numbers[1], title: t("howStep2Title"), description: t("howStep2Desc") },
    { number: numbers[2], title: t("howStep3Title"), description: t("howStep3Desc") },
  ];

  return (
    <section ref={ref} className="pt-32 pb-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className="max-w-xl mb-16 lg:mb-20 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 className="font-display text-3xl lg:text-4xl text-white font-light leading-[1.05]">
            {t("howTitle1")}
            <br />
            <span className="text-[#C9B99A]">{t("howTitle2")}</span>
          </h2>
          <p className="mt-6 text-[#888] text-base leading-relaxed text-left">
            {t("howIntro")}
          </p>
        </div>

        {/* Steps — tres columnas editoriales: filete, numeración dorada, serif y aire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 lg:gap-16">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {/* Filete superior — se enciende en dorado al pasar */}
              <div className="relative h-px bg-[#2a2a2a] mb-8 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-0 bg-[#C9B99A] transition-[width] duration-700 ease-out group-hover:w-full" />
              </div>

              <div className="font-body text-xs tracking-[0.35em] text-[#C9B99A] mb-6">
                {step.number}
              </div>

              <h3 className="font-display text-2xl lg:text-[1.7rem] text-white font-light leading-snug mb-5 md:min-h-[4.75rem]">
                {step.title}
              </h3>
              <p className="text-[#999] text-[15px] leading-[1.85] text-left">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
