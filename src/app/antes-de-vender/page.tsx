import type { Metadata } from "next";
import LandingDiagnostico from "@/components/diagnostico/LandingDiagnostico";

// Landing de captación para campañas de Meta Ads (prototipo).
// noindex: entra solo tráfico de campaña, no buscadores.
export const metadata: Metadata = {
  title: "Tu casa merece un análisis antes de un anuncio",
  description:
    "Diagnóstico gratuito en 2 minutos: nota de salida, horquilla de precio orientativa de tu zona y plan de venta. No es una valoración automática.",
  robots: { index: false, follow: false },
};

export default function DiagnosticoPage() {
  return <LandingDiagnostico />;
}
