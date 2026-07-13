import type { Metadata } from "next";
import ComoTrabajamosShell from "@/components/como-trabajamos/Shell";
import { comoMetadata } from "@/components/como-trabajamos/meta";

// Landing /como-trabajamos en FRANÇAIS (URL propre par langue).
export const metadata: Metadata = comoMetadata("fr");

export default function NotreMethodePage() {
  return <ComoTrabajamosShell lang="fr" />;
}
