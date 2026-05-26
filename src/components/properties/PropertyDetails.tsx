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

const energyColors: Record<string, string> = {
  A: "#00a550",
  B: "#4db848",
  C: "#8dc63f",
  D: "#f7ed00",
  E: "#f7a600",
  F: "#f05a22",
  G: "#ed1c24",
};

function EnergyCertificateVisual({
  letra,
  consumo,
  emisiones,
  labelEnergy,
  labelCO2,
}: {
  letra: string;
  consumo?: string;
  emisiones?: string;
  labelEnergy: string;
  labelCO2: string;
}) {
  const upper = letra.toUpperCase();
  const grades = ["A", "B", "C", "D", "E", "F", "G"];

  return (
    <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
      <h3 className="text-[#888] text-xs font-body tracking-widest uppercase mb-4">
        {labelEnergy}
      </h3>
      <div className="space-y-1.5">
        {grades.map((g, i) => (
          <div key={g} className="flex items-center gap-2">
            <div
              className="h-7 flex items-center justify-end pr-2 text-xs font-bold text-black shrink-0"
              style={{
                backgroundColor: energyColors[g],
                width: `${20 + i * 8}%`,
                opacity: g === upper ? 1 : 0.35,
              }}
            >
              {g}
            </div>
            {g === upper && (
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">◄</span>
                {consumo && (
                  <span className="text-[#888] text-xs">{consumo} kWh/m²·año</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {emisiones && (
        <p className="text-[#666] text-xs mt-3">{labelCO2}: {emisiones} kg/m²·año</p>
      )}
    </div>
  );
}

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

  const hasEnergy = Boolean(property.certificadoEnergetico);

  return (
    <div className="space-y-8">
      {/* Unified characteristics + equipment */}
      {(hasAnyDetail || hasFeatures || hasEnergy) && (
        <div>
          <h2 className="font-display text-2xl text-white mb-4">{t("detailsTitle")}</h2>
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

            {/* Equipment */}
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

            {/* Energy certificate visual */}
            {hasEnergy && property.certificadoEnergetico && (
              <EnergyCertificateVisual
                letra={property.certificadoEnergetico}
                consumo={property.consumoEnergetico}
                emisiones={property.emisionesEnergeticas}
                labelEnergy={t("detailsEnergy")}
                labelCO2={t("detailsCO2")}
              />
            )}
          </div>
        </div>
      )}

      {/* Costs */}
      {hasCosts && (
        <div>
          <h2 className="font-display text-2xl text-white mb-4">{t("detailsCosts")}</h2>
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

      {/* Location */}
      {(property.ciudad || property.zona || property.cp) && (
        <div>
          <h2 className="font-display text-2xl text-white mb-4">{t("detailsLocation")}</h2>
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
