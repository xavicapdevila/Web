"use client";

import { useAutoTranslate } from "@/context/LanguageContext";

export function T({ children }: { children: string }) {
  return <>{useAutoTranslate(children)}</>;
}
