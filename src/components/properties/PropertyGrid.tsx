"use client";

import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import PropertyCard from "./PropertyCard";
import type { Property } from "@/types/property";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export default function PropertyGrid({ properties, total, page, totalPages }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  const orden = searchParams.get("orden") ?? "";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("orden", value);
    } else {
      params.delete("orden");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-3xl text-[#444] mb-4">{t("gridNoResults")}</p>
        <p className="text-[#666] text-sm">
          {t("gridNoResultsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-[#666] text-sm font-body">
          {t("gridShowing")}{" "}
          <span className="text-white">
            {(page - 1) * 12 + 1}–{Math.min(page * 12, total)}
          </span>{" "}
          {t("gridOf")} <span className="text-white">{total}</span> {t("gridProperties")}
        </p>

        <div className="relative shrink-0">
          <select
            value={orden}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label={t("gridSort")}
            className="appearance-none bg-transparent border border-[#2a2a2a] text-[#888] text-sm font-body pl-3 pr-9 py-2 cursor-pointer transition-colors hover:border-[#C9B99A] hover:text-[#C9B99A] focus:outline-none focus:border-[#C9B99A]"
          >
            <option value="" className="bg-[#111] text-[#888]">{t("gridSort")}</option>
            <option value="recientes" className="bg-[#111] text-[#888]">{t("gridSortRecent")}</option>
            <option value="precio-asc" className="bg-[#111] text-[#888]">{t("gridSortPriceAsc")}</option>
            <option value="precio-desc" className="bg-[#111] text-[#888]">{t("gridSortPriceDesc")}</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property, i) => (
          <PropertyCard key={property.id} property={property} priority={i < 2} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="p-2 border border-[#2a2a2a] text-[#888] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
            >
              <ChevronLeft size={16} />
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`ellipsis-${i}`} className="text-[#444] px-2">
                  ...
                </span>
              ) : (
                <Link
                  key={item}
                  href={buildPageUrl(item as number)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center text-sm border transition-colors",
                    item === page
                      ? "bg-[#C9B99A] border-[#C9B99A] text-black font-medium"
                      : "border-[#2a2a2a] text-[#888] hover:border-[#C9B99A] hover:text-[#C9B99A]"
                  )}
                >
                  {item}
                </Link>
              )
            )}

          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="p-2 border border-[#2a2a2a] text-[#888] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
