import type { Metadata } from "next";
import { fuenteDisplay } from "@/components/diagnostico/fuente";
import PanelVendedor from "@/components/pages/vendedor-preview/PanelVendedor";

/* PROTOTIPO — no indexar. Panel del vendedor (perfil de su proceso de venta),
   maqueta con datos de ejemplo y conmutador claro/oscuro para decidir tema.
   Standalone: la ruta está en la lista "bare" de PublicChrome. */
export const metadata: Metadata = {
  title: "Prototipo · Panel del vendedor",
  robots: { index: false, follow: false },
};

export default function VendedorPreviewPage() {
  /* La variable de Space Grotesk se inyecta aquí (server) y el panel la
     consume vía --font-dx-display, igual que el diagnóstico */
  return (
    <div className={fuenteDisplay.variable}>
      <PanelVendedor />
    </div>
  );
}
