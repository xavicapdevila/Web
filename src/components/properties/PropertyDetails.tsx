"use client";

import type { Property } from "@/types/property";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  property: Property;
}

function displayVal(val: string | number | undefined): string {
  if (val === undefined || val === null) return "";
  const s = String(val);
  if (s === "1") return "Sí";
  if (s === "0") return "No";
  return s;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  const displayed = displayVal(value);
  if (!displayed) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <span className="text-[#888] text-sm">{label}</span>
      <span className="text-white text-sm font-body">{displayed}</span>
    </div>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#ccc] py-1.5">
      <Check size={14} className="text-[#C9B99A] shrink-0" />
      {label}
    </div>
  );
}

// ─── Energy certificate ───────────────────────────────────────────────────────

const ENERGY_SCALE = [
  { g: "A", bg: "#00A651", text: "#fff" },
  { g: "B", bg: "#52B748", text: "#fff" },
  { g: "C", bg: "#B6D235", text: "#333" },
  { g: "D", bg: "#FEF101", text: "#333" },
  { g: "E", bg: "#FDB913", text: "#333" },
  { g: "F", bg: "#F37021", text: "#fff" },
  { g: "G", bg: "#EE1C25", text: "#fff" },
] as const;

const NUM_MAP: Record<string, string> = {
  "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F", "7": "G",
};

function parseGrade(raw?: string): string | null {
  if (!raw) return null;
  const ch = raw.trim().charAt(0).toUpperCase();
  const g = NUM_MAP[ch] ?? ch;
  return ENERGY_SCALE.some((e) => e.g === g) ? g : null;
}

function EnergyPanel({
  grade,
  value,
  unit,
  label,
}: {
  grade: string;
  value?: string;
  unit: string;
  label: string;
}) {
  const entry = ENERGY_SCALE.find((e) => e.g === grade)!;

  return (
    <div className="flex flex-col">
      {/* Label */}
      <p className="text-[#555] text-[10px] tracking-[0.22em] uppercase mb-4">{label}</p>

      {/* Letter + value row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Big letter badge */}
        <div
          style={{ backgroundColor: entry.bg, color: entry.text }}
          className="w-16 h-16 flex items-center justify-center text-3xl font-bold shrink-0"
        >
          {grade}
        </div>

        {/* Value */}
        {value && value !== "0" && (
          <div>
            <p className="text-white text-xl font-display font-light leading-tight">
              {value}
            </p>
            <p className="text-[#555] text-xs mt-0.5">{unit}</p>
          </div>
        )}
      </div>

      {/* Scale strip — chevron bars */}
      <div className="flex items-end gap-[2px]">
        {ENERGY_SCALE.map(({ g, bg }) => {
          const isActive = g === grade;
          return (
            <div
              key={g}
              style={{
                backgroundColor: bg,
                opacity: isActive ? 1 : 0.15,
                height: isActive ? 10 : 6,
                flex: 1,
                transition: "height 0.2s, opacity 0.2s",
              }}
            />
          );
        })}
      </div>

      {/* Scale labels */}
      <div className="flex gap-[2px] mt-1">
        {ENERGY_SCALE.map(({ g }) => (
          <div
            key={g}
            className="flex-1 text-center"
            style={{
              fontSize: 9,
              color: g === grade ? "#fff" : "#333",
              fontWeight: g === grade ? 700 : 400,
            }}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  );
}

function EnergyCertificateSection({ property }: { property: Property }) {
  const { t } = useLanguage();
  const gradeConsumo = parseGrade(property.certificadoEnergetico);
  const gradeEmisiones = parseGrade(property.emisionesLetra);
  const hasData = gradeConsumo || gradeEmisiones;

  if (!hasData && !property.energiaExento) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-white font-light mb-4">
        {t("detailsEnergy")}
      </h2>

      <div className="bg-[#111] border border-[#1e1e1e] p-6">
        {property.energiaExento ? (
          <p className="text-[#555] text-sm tracking-wide">
            Exento de certificado energético
          </p>
        ) : (
          <div className={`grid gap-8 ${gradeConsumo && gradeEmisiones ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-xs"}`}>
            {gradeConsumo && (
              <EnergyPanel
                grade={gradeConsumo}
                value={property.consumoEnergetico}
                unit="kWh/m²·año"
                label="Consumo energético"
              />
            )}
            {gradeEmisiones && (
              <>
                {gradeConsumo && (
                  <div className="hidden sm:block w-px bg-[#1e1e1e] self-stretch" />
                )}
                <EnergyPanel
                  grade={gradeEmisiones}
                  value={property.emisionesEnergeticas}
                  unit="kg CO₂/m²·año"
                  label={t("detailsCO2")}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyDetails({ property }: Props) {
  const { t } = useLanguage();

  const hasAnyDetail =
    property.m2Construidos ||
    property.m2Utiles ||
    property.m2Parcela ||
    property.planta ||
    property.habitaciones ||
    property.banos ||
    property.antiguedad ||
    property.estado ||
    property.orientacion ||
    property.calefaccion;

  const hasFeatures =
    property.ascensor ||
    property.garaje ||
    property.trastero ||
    property.piscina ||
    property.terraza ||
    property.jardin ||
    property.amueblado ||
    property.aireCond;

  const hasCosts =
    (property.ibi && property.ibi > 0) ||
    (property.gastosComun && property.gastosComun > 0);

  return (
    <div className="space-y-8">
      {/* Características */}
      {(hasAnyDetail || hasFeatures) && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">{t("detailsTitle")}</h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {hasAnyDetail && (
              <>
                {property.m2Construidos && (
                  <DetailRow label={t("detailsBuilt")} value={`${Math.round(property.m2Construidos)} m²`} />
                )}
                {property.m2Utiles && (
                  <DetailRow label={t("detailsUsable")} value={`${Math.round(property.m2Utiles)} m²`} />
                )}
                {property.m2Parcela && (
                  <DetailRow label={t("detailsPlot")} value={`${Math.round(property.m2Parcela)} m²`} />
                )}
                {property.habitaciones && (
                  <DetailRow label={t("detailsRooms")} value={property.habitaciones} />
                )}
                {property.banos && (
                  <DetailRow label={t("detailsBaths")} value={property.banos} />
                )}
                {property.planta && (
                  <DetailRow label={t("detailsFloor")} value={property.planta} />
                )}
                {property.orientacion && (
                  <DetailRow label={t("detailsOrientation")} value={property.orientacion} />
                )}
                {property.calefaccion && (
                  <DetailRow label={t("detailsHeating")} value={property.calefaccion} />
                )}
                {property.antiguedad && (
                  <DetailRow label={t("detailsAge")} value={property.antiguedad} />
                )}
                {property.estado && (
                  <DetailRow label={t("detailsCondition")} value={property.estado} />
                )}
              </>
            )}

            {hasFeatures && (
              <div className={hasAnyDetail ? "mt-5 pt-5 border-t border-[#1a1a1a]" : ""}>
                <p className="text-[#888] text-xs font-body tracking-widest uppercase mb-3">
                  {t("detailsEquipment")}
                </p>
                <div className="grid grid-cols-2 gap-x-4">
                  {property.ascensor && <FeatureBadge label={t("detailsElevator")} />}
                  {property.garaje && <FeatureBadge label={t("detailsGarage")} />}
                  {property.trastero && <FeatureBadge label={t("detailsStorage")} />}
                  {property.piscina && <FeatureBadge label={t("detailsPool")} />}
                  {property.terraza && <FeatureBadge label={t("detailsTerrace")} />}
                  {property.jardin && <FeatureBadge label={t("detailsGarden")} />}
                  {property.amueblado && <FeatureBadge label={t("detailsFurnished")} />}
                  {property.aireCond && <FeatureBadge label={t("detailsAirCon")} />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificado de Eficiencia Energética — standalone */}
      <EnergyCertificateSection property={property} />

      {/* Gastos */}
      {hasCosts && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">{t("detailsCosts")}</h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {property.ibi && property.ibi > 0 && (
              <DetailRow label={t("detailsIbi")} value={formatPrice(property.ibi)} />
            )}
            {property.gastosComun && property.gastosComun > 0 && (
              <DetailRow label={t("detailsCommunity")} value={formatPrice(property.gastosComun)} />
            )}
          </div>
        </div>
      )}

      {/* Ubicación */}
      {(property.ciudad || property.zona || property.cp) && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">{t("detailsLocation")}</h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {property.ciudad && (
              <DetailRow label={t("detailsCity")} value={property.ciudad} />
            )}
            {property.zona && (
              <DetailRow label={t("detailsZone")} value={property.zona} />
            )}
            {property.provincia && (
              <DetailRow label={t("detailsProvince")} value={property.provincia} />
            )}
            {property.cp && (
              <DetailRow label={t("detailsPostal")} value={property.cp} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
