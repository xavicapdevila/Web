import type { Metadata } from "next";
import FlujoDiagnostico from "@/components/diagnostico/FlujoDiagnostico";

export const metadata: Metadata = {
  title: "Analiza tu vivienda — diagnóstico inicial",
  robots: { index: false, follow: false },
};

export default async function AnalisisPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  return <FlujoDiagnostico abrirDemo={demo === "1"} />;
}
