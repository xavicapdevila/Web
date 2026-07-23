import type { Metadata } from "next";
import LandingDiagnostico from "@/components/diagnostico/LandingDiagnostico";

// Landing de captación para campañas de Meta Ads (prototipo).
// noindex: entra solo tráfico de campaña, no buscadores.
export const metadata: Metadata = {
  title: "Tu casa merece un análisis antes de un anuncio",
  description:
    "Diagnóstico gratuito en 2 minutos: nota de salida, el rango real de precios de tu zona y el plan de venta. Tu precio exacto se fija viendo la casa, gratis y sin compromiso.",
  robots: { index: false, follow: false },
};

export default function DiagnosticoPage() {
  return <LandingDiagnostico />;
}
