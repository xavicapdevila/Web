import type { Metadata } from "next";
import QuienesSomosContent from "@/components/pages/QuienesSomosContent";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conoce al equipo de The Vila Home: Ariadna Garcia, Sofía Pascual y Xavier Capdevila. Tres profesionales que trabajan con honestidad, criterio y presencia real en cada operación inmobiliaria en Vilanova i la Geltrú.",
  alternates: { canonical: "https://www.thevilahome.com/quienes-somos" },
  openGraph: {
    type: "website",
    title: "Quiénes somos — The Vila Home",
    description: "El equipo humano detrás de The Vila Home. Ariadna, Sofía y Xavi: cercanos, honestos y sin corporativismo.",
    url: "https://www.thevilahome.com/quienes-somos",
    siteName: "The Vila Home",
    locale: "es_ES",
    images: [{ url: "https://www.thevilahome.com/og-image.jpg", width: 1200, height: 630, alt: "El equipo de The Vila Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiénes somos — The Vila Home",
    description: "El equipo humano detrás de The Vila Home. Ariadna, Sofía y Xavi.",
    images: ["https://www.thevilahome.com/og-image.jpg"],
  },
};

export default function QuienesSomosPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <QuienesSomosContent />
    </div>
  );
}
