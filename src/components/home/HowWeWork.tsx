"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { Ear, Camera, PhoneCall } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [Ear, Camera, PhoneCall];
const numbers = ["01", "02", "03"];

export default function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const steps = [
    { icon: icons[0], number: numbers[0], title: t("howStep1Title"), description: t("howStep1Desc") },
    { icon: icons[1], number: numbers[1], title: t("howStep2Title"), description: t("howStep2Desc") },
    { icon: icons[2], number: numbers[2], title: t("howStep3Title"), description: t("howStep3Desc") },
  ];

  return (
    <section ref={ref} className="pt-32 pb-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className="max-w-xl mb-20 transition-all duration-700"
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
          <p className="mt-6 text-[#888] text-base leading-relaxed">
            {t("howIntro")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative group transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {/* Number */}
              <div className="font-display text-7xl text-[#1a1a1a] font-light mb-6 leading-none group-hover:text-[#C9B99A]/10 transition-colors duration-500">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 border border-[#C9B99A]/30 flex items-center justify-center mb-6 group-hover:border-[#C9B99A] group-hover:bg-[#C9B99A]/5 transition-all duration-300">
                <step.icon size={20} className="text-[#C9B99A]" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl text-white mb-4">{step.title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{step.description}</p>

              {/* Separator line (not last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-6 h-px w-12 bg-[#2a2a2a]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
