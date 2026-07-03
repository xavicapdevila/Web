import type { Metadata } from "next";
import CookiesContent from "./CookiesContent";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Política de cookies de The Vila Home · Información sobre las cookies que utilizamos.",
  alternates: { canonical: "https://www.thevilahome.com/cookies" },
  robots: { index: false },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
