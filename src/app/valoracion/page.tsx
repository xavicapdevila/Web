import type { Metadata } from "next";
import ValoracionContent from "@/components/pages/ValoracionContent";

export const metadata: Metadata = {
  title: "Valoración gratuita de tu propiedad",
  description:
    "¿Cuánto vale tu casa en Vilanova i la Geltrú? Obtén una valoración profesional y gratuita basada en datos reales del mercado local. Sin compromiso, respuesta en menos de 24 horas.",
  alternates: { canonical: "https://www.thevilahome.com/valoracion" },
  openGraph: {
    title: "Valoración gratuita — The Vila Home",
    description: "Descubre cuánto vale tu propiedad en Vilanova, Garraf o Penedès. Valoración real, gratuita y sin compromiso.",
    url: "https://www.thevilahome.com/valoracion",
  },
};

export default function ValoracionPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <ValoracionContent />
    </div>
  );
}
