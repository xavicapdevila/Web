import type { Metadata } from "next";
import ComoTrabajamosShell from "@/components/como-trabajamos/Shell";
import { comoMetadata } from "@/components/como-trabajamos/meta";

// /como-trabajamos landing in ENGLISH (its own per-language URL).
export const metadata: Metadata = comoMetadata("en");

export default function HowWeWorkPage() {
  return <ComoTrabajamosShell lang="en" />;
}
