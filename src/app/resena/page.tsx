import type { Metadata } from "next";
import ReviewGate from "@/components/resena/ReviewGate";

export const metadata: Metadata = {
  title: "Tu opinión · The Vila Home",
  description: "Cuéntanos cómo ha sido tu experiencia con The Vila Home.",
  // Página utilitaria (QR/enlace directo): no indexar.
  robots: { index: false, follow: false },
};

export default function ResenaPage() {
  return <ReviewGate />;
}
