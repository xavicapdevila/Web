"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, BedDouble, Bath, Maximize2, Share2, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getTipoLabel, fillTemplate } from "@/lib/i18n";
import { useLanguage, useAutoTranslate, useAutoTranslateMulti } from "@/context/LanguageContext";
import PropertyDetails from "./PropertyDetails";
import AgentPhoto from "./AgentPhoto";
import ShareModal from "./ShareModal";
import type { Property } from "@/types/property";
import { buildAgentWhatsApp } from "@/lib/agents";

interface Props {
  property: Property;
  agentInfo: { name: string; photo: string };
  contactEmail: string;
  isReserved: boolean;
}

function TranslatedDescription({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  const translated = useAutoTranslateMulti(paragraphs);

  return (
    <div className="text-[#aaa] text-sm leading-relaxed space-y-4">
      {translated.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

const ENERGY_GRADES = [
  { g: "A", bg: "#00A651", text: "#fff" },
  { g: "B", bg: "#52B748", text: "#fff" },
  { g: "C", bg: "#B6D235", text: "#333" },
  { g: "D", bg: "#FEF101", text: "#333" },
  { g: "E", bg: "#FDB913", text: "#333" },
  { g: "F", bg: "#F37021", text: "#fff" },
  { g: "G", bg: "#EE1C25", text: "#fff" },
] as const;

const NUM_TO_GRADE: Record<string, string> = {
  "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F", "7": "G",
};

function normaliseGrade(raw?: string): string | null {
  if (!raw) return null;
  const ch = raw.trim().charAt(0).toUpperCase();
  const grade = NUM_TO_GRADE[ch] ?? ch;
  return ENERGY_GRADES.some((e) => e.g === grade) ? grade : null;
}

function EnergyRow({ grade, label, value }: { grade: string; label: string; value?: string }) {
  const active = ENERGY_GRADES.find((e) => e.g === grade)!;
  return (
    <div>
      <p className="text-[#555] text-[10px] tracking-[0.18em] uppercase mb-1.5">{label}</p>
      <div className="flex items-end gap-[2px]">
        {ENERGY_GRADES.map(({ g, bg }) => {
          const isActive = g === grade;
          return (
            <div
              key={g}
              style={{
                backgroundColor: bg,
                opacity: isActive ? 1 : 0.18,
                height: isActive ? 28 : 20,
                flex: 1,
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <div
          style={{ backgroundColor: active.bg, color: active.text, fontSize: 11, fontWeight: 700 }}
          className="w-5 h-5 flex items-center justify-center shrink-0"
        >
          {grade}
        </div>
        {value && <span className="text-[#777] text-xs">{value}</span>}
      </div>
    </div>
  );
}

function EnergyCertificate({
  letra,
  consumo,
  emisionesLetra,
  emisiones,
  exento,
  labelTitle,
  labelCO2,
}: {
  letra?: string;
  consumo?: string;
  emisionesLetra?: string;
  emisiones?: string;
  exento?: boolean;
  labelTitle: string;
  labelCO2: string;
}) {
  const gradeConsumo = normaliseGrade(letra);
  const gradeEmisiones = normaliseGrade(emisionesLetra);

  return (
    <div className="bg-[#111] border border-[#1e1e1e] p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-6 bg-[#C9B99A]" />
        <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-[#C9B99A]">
          {labelTitle}
        </h3>
      </div>

      {exento ? (
        <p className="text-[#555] text-xs tracking-wide">Exento de certificado energético</p>
      ) : (
        <div className="space-y-5">
          {gradeConsumo && (
            <EnergyRow
              grade={gradeConsumo}
              label="Consumo energético"
              value={consumo && consumo !== "0" ? `${consumo} kWh/m²·año` : undefined}
            />
          )}
          {gradeEmisiones && (
            <EnergyRow
              grade={gradeEmisiones}
              label={labelCO2}
              value={emisiones && emisiones !== "0" ? `${emisiones} kg CO₂/m²·año` : undefined}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function PropertyPageContent({ property, agentInfo, contactEmail, isReserved }: Props) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const titulo = useAutoTranslate(property.titulo);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReservedAlert, setShowReservedAlert] = useState(false);

  const handleContactAttempt = (e: React.MouseEvent) => {
    if (isReserved) {
      e.preventDefault();
      setShowReservedAlert(true);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/propiedades/${property.slug}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      if (navigator.share && isMobile) {
        await navigator.share({ title: titulo, url });
      } else {
        setShowShareModal(true);
      }
    } catch {
      // cancelled
    }
  };

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/propiedades/${property.slug}`
    : `https://www.thevilahome.com/propiedades/${property.slug}`;

  // WA share modal → no preset recipient, user chooses who to forward to
  const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(fillTemplate(t("propShareWaMsg"), { titulo, url: shareUrl }))}`;

  // WA contact button → message to the agent, prefilled in the current site language
  const waUrl = buildAgentWhatsApp(property.agenteEmail, t("propWhatsappMsg"), {
    titulo,
    ref: property.ref ?? "",
    url: shareUrl,
  });

  return (
    <>
    {showShareModal && (
      <ShareModal
        url={shareUrl}
        titulo={titulo}
        price={formatPrice(property.precio)}
        waUrl={shareWaUrl}
        onClose={() => setShowShareModal(false)}
      />
    )}
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-12">
      {/* Back to listing */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#666] hover:text-[#C9B99A] transition-colors mb-8 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="font-body text-xs tracking-widest uppercase">{t("backToListing")}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left — main info: order-2 on mobile so sidebar shows first */}
        <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase border border-[#C9B99A]/40 px-3 py-1">
                {getTipoLabel(property.tipo, lang, property.subtipo)}
              </span>
              {isReserved && (
                <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase border border-[#C9B99A] px-3 py-1 bg-[#C9B99A]/10">
                  {t("cardReserved")}
                </span>
              )}
              <span className="text-[#666] text-xs">Ref. {property.ref}</span>
            </div>

            <h1 className="sr-only">{titulo}</h1>

            <p className="text-[#888] text-sm mb-6">
              {[property.zona, property.ciudad, property.provincia].filter(Boolean).join(", ")}
            </p>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="font-display text-4xl text-[#C9B99A]">
                {formatPrice(property.precio)}
              </span>
            </div>

            {/* Quick features */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#1e1e1e]">
              {property.habitaciones && (
                <div className="flex items-center gap-2 text-white">
                  <BedDouble size={18} className="text-[#C9B99A]" />
                  <span className="font-body">
                    {property.habitaciones} {property.habitaciones !== 1 ? t("propRooms") : t("propRoom")}
                  </span>
                </div>
              )}
              {property.banos && (
                <div className="flex items-center gap-2 text-white">
                  <Bath size={18} className="text-[#C9B99A]" />
                  <span className="font-body">
                    {property.banos} {property.banos !== 1 ? t("propBaths") : t("propBath")}
                  </span>
                </div>
              )}
              {property.m2Construidos && (
                <div className="flex items-center gap-2 text-white">
                  <Maximize2 size={18} className="text-[#C9B99A]" />
                  <span className="font-body">{Math.round(property.m2Construidos)} m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.descripcion && (
            <div>
              <h2 className="font-display text-2xl text-white mb-4">{t("propDescription")}</h2>
              <TranslatedDescription text={property.descripcion} />
            </div>
          )}

          {/* All property details */}
          <PropertyDetails property={property} />

        </div>

        {/* Right — sidebar: order-1 on mobile to appear first (price+CTA visible early) */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Contact card */}
          <div className="bg-[#111] border border-[#1e1e1e] p-6">
            {/* Agent */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#1e1e1e]">
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0 relative">
                <AgentPhoto src={agentInfo.photo} name={agentInfo.name} />
              </div>
              <div>
                <p className="text-white font-display text-lg">{agentInfo.name}</p>
                <p className="text-[#666] text-xs font-body">{t("propAgent")}</p>
              </div>
            </div>

            <h3 className="font-display text-xl text-white mb-5">{t("propInterested")}</h3>

            {/* Contact options: Call → WhatsApp → Email */}
            <div className="space-y-3">
              {showReservedAlert && (
                <div className="bg-[#C9B99A]/10 border border-[#C9B99A]/40 px-4 py-3 text-center">
                  <p className="text-[#C9B99A] text-xs font-body leading-relaxed">
                    {t("propReservedAlert")}
                  </p>
                </div>
              )}
              <a
                href="tel:936061800"
                onClick={handleContactAttempt}
                className={`flex items-center gap-3 w-full px-4 py-3 font-body text-sm tracking-wide transition-colors ${
                  isReserved
                    ? "bg-[#888]/30 text-[#555] cursor-not-allowed"
                    : "bg-[#C9B99A] text-black hover:bg-[#DDD0BB]"
                }`}
              >
                <Phone size={16} />
                {t("propCall")}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactAttempt}
                className={`flex items-center gap-3 w-full px-4 py-3 border font-body text-sm tracking-wide transition-colors ${
                  isReserved
                    ? "border-[#555]/30 text-[#555] cursor-not-allowed"
                    : "border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("propWhatsapp")}
              </a>
              <a
                href={`mailto:${contactEmail}?subject=Información sobre ref. ${property.ref} - ${property.titulo}`}
                onClick={handleContactAttempt}
                className={`flex items-center gap-3 w-full px-4 py-3 border font-body text-sm tracking-wide transition-colors ${
                  isReserved
                    ? "border-[#555]/30 text-[#555] cursor-not-allowed"
                    : "border-[#C9B99A]/40 text-[#C9B99A] hover:bg-[#C9B99A]/10"
                }`}
              >
                <Mail size={16} />
                {t("propEmail")}
              </a>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full mt-2 py-2.5 border border-[#2a2a2a] text-[#888] text-sm hover:border-[#C9B99A]/40 hover:text-[#C9B99A] transition-colors"
            >
              <Share2 size={15} />
              {t("propShare")}
            </button>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
