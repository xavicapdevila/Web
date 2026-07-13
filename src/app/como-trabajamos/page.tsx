import type { Metadata } from "next";
import ComoTrabajamosShell from "@/components/como-trabajamos/Shell";
import { comoMetadata } from "@/components/como-trabajamos/meta";

// Landing de persuasión para propietarios (castellano). El método (foto,
// vídeo, plano, tour, difusión) en 5 capítulos. Idioma fijo por ruta:
// ca → /com-treballem · en → /how-we-work · fr → /notre-methode.
export const metadata: Metadata = comoMetadata("es");

export default function ComoTrabajamosPage() {
  return <ComoTrabajamosShell lang="es" />;
}
