"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const TIPO_VALUES = ["", "piso", "casa", "ático", "terreno", "local"];
const TIPO_LABELS_ES = ["Todos los tipos", "Piso", "Casa", "Ático", "Terreno", "Local"];
const HAB_VALUES = ["", "1", "2", "3", "4"];
const HAB_LABELS = ["—", "1+", "2+", "3+", "4+"];

export default function PropertyFilters() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tipo, setTipo] = useState(searchParams.get("tipo") ?? "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");
  const [habitaciones, setHabitaciones] = useState(searchParams.get("habitaciones") ?? "");
  const [m2Min, setM2Min] = useState(searchParams.get("m2Min") ?? "");
  const [ciudad, setCiudad] = useState(searchParams.get("ciudad") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (tipo) params.set("tipo", tipo);
    if (precioMin) params.set("precioMin", precioMin);
    if (precioMax) params.set("precioMax", precioMax);
    if (habitaciones) params.set("habitaciones", habitaciones);
    if (m2Min) params.set("m2Min", m2Min);
    if (ciudad) params.set("ciudad", ciudad);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [tipo, precioMin, precioMax, habitaciones, m2Min, ciudad, router, pathname]);

  const clearFilters = () => {
    setTipo(""); setPrecioMin(""); setPrecioMax("");
    setHabitaciones(""); setM2Min(""); setCiudad("");
    router.push(pathname);
  };

  const hasFilters = tipo || precioMin || precioMax || habitaciones || m2Min || ciudad;
  const activeCount = [tipo, precioMin, precioMax, habitaciones, m2Min, ciudad].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-[#111] border border-[#1e1e1e] px-5 py-3.5 mb-2"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
      >
        <span className="flex items-center gap-2 text-white text-sm font-body">
          <SlidersHorizontal size={15} className="text-[#C9B99A]" />
          {t("filtersTitle")}
          {activeCount > 0 && (
            <span className="bg-[#C9B99A] text-black text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={15}
          className={cn("text-[#555] transition-transform duration-300", mobileOpen && "rotate-180")}
        />
      </button>

      <div className={cn(
        "bg-[#111] border border-[#1e1e1e] p-6 lg:sticky lg:top-24",
        "lg:block",
        mobileOpen ? "block" : "hidden"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-white hidden lg:block">{t("filtersTitle")}</h2>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[#666] hover:text-[#C9B99A] text-xs transition-colors ml-auto"
            >
              <X size={12} />
              {t("filtersClear")}
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Ciudad */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("filtersCity")}
            </label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder={t("filtersCityPlaceholder")}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm pl-9 pr-4 py-2.5 placeholder-[#444] focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("filtersType")}
            </label>
            <div className="relative">
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-2.5 appearance-none focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
              >
                {TIPO_VALUES.map((val, i) => (
                  <option key={val} value={val}>
                    {val === "" ? t("filtersAllTypes") : TIPO_LABELS_ES[i]}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("filtersPrice")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                placeholder={t("filtersMin")}
                className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2.5 placeholder-[#444] focus:outline-none focus:border-[#C9B99A]/50 transition-colors w-full"
              />
              <input
                type="number"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                placeholder={t("filtersMax")}
                className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-3 py-2.5 placeholder-[#444] focus:outline-none focus:border-[#C9B99A]/50 transition-colors w-full"
              />
            </div>
          </div>

          {/* Habitaciones */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("filtersRooms")}
            </label>
            <div className="flex gap-1">
              {HAB_VALUES.map((val, i) => (
                <button
                  key={val}
                  onClick={() => setHabitaciones(val)}
                  className={cn(
                    "flex-1 text-xs py-2 border transition-colors",
                    habitaciones === val
                      ? "bg-[#C9B99A] border-[#C9B99A] text-black font-medium"
                      : "border-[#2a2a2a] text-[#888] hover:border-[#C9B99A]/50 hover:text-white"
                  )}
                >
                  {val === "" ? t("filtersAnyRooms") : HAB_LABELS[i]}
                </button>
              ))}
            </div>
          </div>

          {/* m² mínimos */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("filtersArea")}
            </label>
            <input
              type="number"
              value={m2Min}
              onChange={(e) => setM2Min(e.target.value)}
              placeholder={t("filtersAreaPlaceholder")}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-2.5 placeholder-[#444] focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
            />
          </div>

          {/* Apply button */}
          <button
            onClick={() => { applyFilters(); setMobileOpen(false); }}
            className="w-full py-3 bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
          >
            {t("filtersApply")}
          </button>
        </div>
      </div>
    </aside>
  );
}
