import type { Metadata } from "next";
import ComoTrabajamosShell from "@/components/como-trabajamos/Shell";
import { comoMetadata } from "@/components/como-trabajamos/meta";

// Landing /como-trabajamos en CATALÀ (URL pròpia per idioma).
export const metadata: Metadata = comoMetadata("ca");

export default function ComTreballemPage() {
  return <ComoTrabajamosShell lang="ca" />;
}
