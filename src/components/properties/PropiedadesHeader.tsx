"use client";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  total: number;
}

export default function PropiedadesHeader({ total }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="font-display text-4xl lg:text-5xl text-white font-light">
          {t("propPageTitle")}
        </h1>
        {total > 0 && (
          <p className="text-[#666] text-sm mt-2 font-body">
            {total} {total === 1 ? t("propPageFoundOne") : t("propPageFoundMany")}
          </p>
        )}
      </div>
    </div>
  );
}
