"use client";

import type { Property } from "@/types/property";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  property: Property;
}

// Maps XML period codes to display labels per language
const PERIOD_MAP: Record<string, Record<string, string>> = {
  MES:       { es: "Mensual",     ca: "Mensual",      en: "Monthly",    fr: "Mensuel" },
  MENSUAL:   { es: "Mensual",     ca: "Mensual",      en: "Monthly",    fr: "Mensuel" },
  AÑO:       { es: "Anual",       ca: "Anual",        en: "Annual",     fr: "Annuel"  },
  ANUAL:     { es: "Anual",       ca: "Anual",        en: "Annual",     fr: "Annuel"  },
  TRIMESTRE: { es: "Trimestral",  ca: "Trimestral",   en: "Quarterly",  fr: "Trimestriel" },
  SEMESTRE:  { es: "Semestral",   ca: "Semestral",    en: "Half-yearly", fr: "Semestriel" },
};

function localisePeriod(raw: string | undefined, lang: string): string | null {
  if (!raw) return null;
  const map = PERIOD_MAP[raw.toUpperCase()];
  return map ? (map[lang] ?? map["es"]) : raw;
}

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | number }) {
  const s = String(value).trim();
  if (!s) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <span className="text-[#888] text-sm">{label}</span>
      <span className="text-white text-sm font-body">{s}</span>
    </div>
  );
}

// "1" → "Sí", "0" → "No" — always renders (never returns null)
function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <span className="text-[#888] text-sm">{label}</span>
      <span className="text-white text-sm font-body">{value ? "Sí" : "No"}</span>
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

function EnergyRow({
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
    <div className="space-y-2">
      <p className="text-[#555] text-[10px] tracking-[0.2em] uppercase">{label}</p>

      <div className="flex gap-px">
        {ENERGY_SCALE.map(({ g, bg }) => (
          <div
            key={g}
            style={{
              flex: 1,
              height: 4,
              backgroundColor: bg,
              opacity: g === grade ? 1 : 0.15,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div
          style={{
            backgroundColor: entry.bg,
            color: entry.text,
            width: 22,
            height: 22,
            fontSize: 11,
            fontWeight: 700,
          }}
          className="flex items-center justify-center shrink-0"
        >
          {grade}
        </div>
        {value && value !== "0" && (
          <span className="text-[#666] text-xs">{value} {unit}</span>
        )}
      </div>
    </div>
  );
}

function EnergyCertificateSection({ property }: { property: Property }) {
  const { t } = useLanguage();
  const gradeConsumo = parseGrade(property.certificadoEnergetico);
  const gradeEmisiones = parseGrade(property.emisionesLetra);

  if (!gradeConsumo && !gradeEmisiones && !property.energiaExento) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-white font-light mb-4">
        {t("detailsEnergy")}
      </h2>

      <div className="bg-[#111] border border-[#1e1e1e] p-6">
        {property.energiaExento ? (
          <p className="text-[#555] text-sm">Exento de certificado energético</p>
        ) : (
          <div className="space-y-4">
            {gradeConsumo && (
              <EnergyRow
                grade={gradeConsumo}
                value={property.consumoEnergetico}
                unit="kWh/m²·año"
                label={t("detailsConsumption")}
              />
            )}
            {gradeEmisiones && (
              <EnergyRow
                grade={gradeEmisiones}
                value={property.emisionesEnergeticas}
                unit="kg CO₂/m²·año"
                label={t("detailsCO2")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyDetails({ property }: Props) {
  const { t, lang } = useLanguage();

  // ── Características ──────────────────────────────────────────────────────
  const hasCaracteristicas =
    property.m2Construidos ||
    property.m2Utiles ||
    property.m2Parcela ||
    property.habitaciones ||
    property.banos ||
    property.planta ||
    property.numPlantas ||
    property.orientacion ||
    property.antiguedad ||
    property.estado;

  // ── Equipamiento ─────────────────────────────────────────────────────────
  // Ascensor, Parking, Calefacción always shown → section always visible
  const hasEquipamiento = true;

  // ── Gastos ───────────────────────────────────────────────────────────────
  const hasCosts =
    (property.ibi && property.ibi > 0) ||
    (property.gastosComun && property.gastosComun > 0);

  const communityPeriod = localisePeriod(property.periodicidadComunidad, lang);

  return (
    <div className="space-y-8">

      {/* ── Características ── */}
      {hasCaracteristicas && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">
            {t("detailsTitle")}
          </h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
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
            {property.numPlantas && (
              <DetailRow label={t("detailsNumFloors")} value={property.numPlantas} />
            )}
            {property.orientacion && (
              <DetailRow label={t("detailsOrientation")} value={property.orientacion} />
            )}
            {property.antiguedad && (
              <DetailRow label={t("detailsAge")} value={property.antiguedad} />
            )}
            {property.estado && (
              <DetailRow label={t("detailsCondition")} value={property.estado} />
            )}
          </div>
        </div>
      )}

      {/* ── Equipamiento ── */}
      {hasEquipamiento && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">
            {t("detailsEquipment")}
          </h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {/* Always Sí / No */}
            <BoolRow label={t("detailsElevator")} value={!!property.ascensor} />
            <BoolRow label={t("detailsGarage")} value={!!property.garaje} />
            <BoolRow label={t("detailsHeating")} value={!!property.calefaccion} />
            {/* Only appear when true */}
            {property.aireCond && <DetailRow label={t("detailsAirCon")} value="Sí" />}
            {property.bombafriocalor && <DetailRow label={t("detailsHeatPump")} value="Sí" />}
            {property.piscina && <DetailRow label={t("detailsPool")} value="Sí" />}
            {property.terraza && <DetailRow label={t("detailsTerrace")} value="Sí" />}
            {property.jardin && <DetailRow label={t("detailsGarden")} value="Sí" />}
            {property.balcon && <DetailRow label={t("detailsBalcony")} value="Sí" />}
            {property.solarium && <DetailRow label={t("detailsSolarium")} value="Sí" />}
            {property.barbacoa && <DetailRow label={t("detailsBBQ")} value="Sí" />}
            {property.chimenea && <DetailRow label={t("detailsFireplace")} value="Sí" />}
            {property.vistasalmar && <DetailRow label={t("detailsSeaViews")} value="Sí" />}
            {property.trastero && <DetailRow label={t("detailsStorage")} value="Sí" />}
            {property.armaEmpotrado && <DetailRow label={t("detailsFittedWardrobes")} value="Sí" />}
            {property.amueblado && <DetailRow label={t("detailsFurnished")} value="Sí" />}
            {property.urbanizacion && <DetailRow label={t("detailsUrbanizacion")} value="Sí" />}
          </div>
        </div>
      )}

      {/* ── Certificado de Eficiencia Energética ── */}
      <EnergyCertificateSection property={property} />

      {/* ── Gastos ── */}
      {hasCosts && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">
            {t("detailsCosts")}
          </h2>
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {property.gastosComun && property.gastosComun > 0 && (
              <DetailRow label={t("detailsCommunity")} value={formatPrice(property.gastosComun)} />
            )}
            {property.gastosComun && property.gastosComun > 0 && communityPeriod && (
              <DetailRow label={t("detailsCommunityPeriod")} value={communityPeriod} />
            )}
            {property.ibi && property.ibi > 0 && (
              <DetailRow label={t("detailsIbi")} value={formatPrice(property.ibi)} />
            )}
          </div>
        </div>
      )}

      {/* ── Ubicación ── */}
      {(property.ciudad || property.zona || property.cp) && (
        <div>
          <h2 className="font-display text-2xl text-white font-light mb-4">
            {t("detailsLocation")}
          </h2>
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
