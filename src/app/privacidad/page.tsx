import type { Metadata } from "next";
import PrivacidadContent from "./PrivacidadContent";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de The Vila Home · Cómo tratamos tus datos personales.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return <PrivacidadContent />;
}
