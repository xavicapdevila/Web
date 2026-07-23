import type { Metadata } from "next";
import PanelDiagnostico from "@/components/diagnostico/PanelDiagnostico";

// Ruta privada de demostración: no está enlazada desde ninguna página
// pública y lleva noindex. Si el prototipo pasa a producción, debe ir
// detrás de la autenticación de /admin.
export const metadata: Metadata = {
  title: "Panel de diagnósticos — demo interna",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return <PanelDiagnostico />;
}
