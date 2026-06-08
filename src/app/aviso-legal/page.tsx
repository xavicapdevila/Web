import type { Metadata } from "next";
import AvisoLegalContent from "./AvisoLegalContent";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de The Vila Home · Projectes Immobiliaris Costa Daurada SL.",
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return <AvisoLegalContent />;
}
