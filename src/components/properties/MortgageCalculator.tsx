"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Calculator } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  precio: number;
}

export default function MortgageCalculator({ precio }: Props) {
  const { t } = useLanguage();
  const [entrada, setEntrada] = useState(Math.round(precio * 0.2));
  const [anos, setAnos] = useState(25);
  const [interes, setInteres] = useState(3.5);
  const [cuota, setCuota] = useState(0);

  useEffect(() => {
    const capital = precio - entrada;
    if (capital <= 0) { setCuota(0); return; }
    const r = interes / 100 / 12;
    const n = anos * 12;
    if (r === 0) { setCuota(capital / n); return; }
    const c = capital * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setCuota(c);
  }, [precio, entrada, anos, interes]);

  const entradaPct = Math.round((entrada / precio) * 100);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Calculator size={20} className="text-[#C9B99A]" />
        <h2 className="font-display text-2xl text-white">{t("mortgageTitle")}</h2>
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Entrada */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("mortgageDeposit")} ({entradaPct}%)
            </label>
            <input
              type="number"
              value={entrada}
              onChange={(e) => setEntrada(Number(e.target.value))}
              min={0}
              max={precio}
              step={1000}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
            />
            <input
              type="range"
              min={0}
              max={precio}
              step={1000}
              value={entrada}
              onChange={(e) => setEntrada(Number(e.target.value))}
              className="w-full mt-2 accent-[#C9B99A]"
            />
          </div>

          {/* Años */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("mortgageYears")}: {anos} {t("mortgageYearsUnit")}
            </label>
            <input
              type="number"
              value={anos}
              onChange={(e) => setAnos(Number(e.target.value))}
              min={5}
              max={40}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
            />
            <input
              type="range"
              min={5}
              max={40}
              value={anos}
              onChange={(e) => setAnos(Number(e.target.value))}
              className="w-full mt-2 accent-[#C9B99A]"
            />
          </div>

          {/* Interés */}
          <div>
            <label className="block text-[#888] text-xs font-body tracking-wide uppercase mb-2">
              {t("mortgageInterest")}: {interes}%
            </label>
            <input
              type="number"
              value={interes}
              onChange={(e) => setInteres(Number(e.target.value))}
              min={0.5}
              max={10}
              step={0.1}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#C9B99A]/50 transition-colors"
            />
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.1}
              value={interes}
              onChange={(e) => setInteres(Number(e.target.value))}
              className="w-full mt-2 accent-[#C9B99A]"
            />
          </div>
        </div>

        {/* Result */}
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
              {t("mortgageFinancing")}
            </p>
            <p className="text-white font-display text-xl">{formatPrice(precio - entrada)}</p>
          </div>
          <div className="text-center">
            <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
              {t("mortgageMonthly")}
            </p>
            <p className="text-[#C9B99A] font-display text-3xl">
              {cuota > 0 ? formatPrice(Math.round(cuota)) : "—"}/mes
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#888] text-xs font-body tracking-wide uppercase mb-1">
              {t("mortgageTotalCost")}
            </p>
            <p className="text-white font-display text-xl">
              {cuota > 0 ? formatPrice(Math.round(cuota * anos * 12)) : "—"}
            </p>
          </div>
        </div>

        <p className="text-[#444] text-xs mt-3">
          {t("mortgageDisclaimer")}
        </p>
      </div>
    </div>
  );
}
