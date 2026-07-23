import type { Metadata } from "next";
import LandingDiagnostico from "@/components/diagnostico/LandingDiagnostico";

// Landing de captación para campañas de Meta Ads.
// INDEXABLE desde jul 2026 (referencias calibradas con fuentes públicas);
// /analisis y /panel siguen en noindex a propósito.
export const metadata: Metadata = {
  title: "Tu casa merece un análisis antes de un anuncio",
  description:
    "Diagnóstico gratuito en 2 minutos: nota de salida, el rango real de precios de tu zona y el plan de venta. Tu precio exacto se fija viendo la casa, gratis y sin compromiso.",
  alternates: { canonical: "https://www.thevilahome.com/antes-de-vender" },
};

export default function DiagnosticoPage() {
  return <LandingDiagnostico />;
}
