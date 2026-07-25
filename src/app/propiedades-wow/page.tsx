import type { Metadata } from "next";
import PropiedadesWowShell from "@/components/pages/propiedades-wow/Shell";
import { getCachedPropertiesList } from "@/lib/sync";

/* PROTOTIPO — no indexar. La parrilla del rediseño wow, navegable desde
   /home-wow, con ordenación arriba a la derecha tipo Idealista. */
export const metadata: Metadata = {
  title: "Propiedades wow (propuesta) — The Vila Home",
  robots: { index: false, follow: false },
};

/* ISR, como /home-wow: sin streaming no hay fallback que se quede pegado. */
export const revalidate = 600;

export default async function PropiedadesWowPage() {
  const list = await getCachedPropertiesList({ limit: 100 });
  return <PropiedadesWowShell properties={list.properties} />;
}
