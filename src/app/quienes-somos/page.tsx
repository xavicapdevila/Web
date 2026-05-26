import type { Metadata } from "next";
import QuienesSomosContent from "@/components/pages/QuienesSomosContent";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conoce al equipo de The Vila Home: Ariadna Garcia, Sofía Pascual y Xavier Capdevila. Tres profesionales que trabajan con honestidad, criterio y presencia real en cada operación inmobiliaria en Vilanova i la Geltrú.",
  alternates: { canonical: "https://www.thevilahome.com/quienes-somos" },
  openGraph: {
    title: "Quiénes somos — The Vila Home",
    description: "El equipo humano detrás de The Vila Home. Ariadna, Sofía y Xavi: cercanos, honestos y sin corporativismo.",
    url: "https://www.thevilahome.com/quienes-somos",
  },
};

export default function QuienesSomosPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <QuienesSomosContent />
    </div>
  );
}
