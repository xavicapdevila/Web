"use client";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  total: number;
}

export default function PropiedadesHeader({ total }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-5 lg:py-7">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="font-display text-3xl lg:text-4xl text-white font-light">
          {t("propPageTitle")}
          <span className="sr-only"> en Vilanova i la Geltrú, Sitges, Cubelles y el Garraf</span>
        </h1>
        {total > 0 && (
          <p className="text-[#666] text-sm mt-1.5 font-body">
            {total} {total === 1 ? t("propPageFoundOne") : t("propPageFoundMany")}
          </p>
        )}
      </div>
    </div>
  );
}
