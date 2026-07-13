import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";

/* Metadata + hreflang de la landing /como-trabajamos en sus 4 rutas.
   El castellano conserva su URL; el resto tiene URL propia por idioma.
   noindex (no queremos indexarla), pero con hreflang bien enlazado por si
   se decide indexar en el futuro. */

export const COMO_URLS: Record<Lang, string> = {
  es: "https://www.thevilahome.com/como-trabajamos",
  ca: "https://www.thevilahome.com/com-treballem",
  en: "https://www.thevilahome.com/how-we-work",
  fr: "https://www.thevilahome.com/notre-methode",
};

const META: Record<Lang, { title: string; description: string }> = {
  es: {
    title: "Cómo trabajamos tu casa",
    description:
      "Fotografía profesional, vídeo, plano 3D, tour virtual y difusión: así preparamos y movemos cada vivienda antes de venderla.",
  },
  ca: {
    title: "Com treballem la teva casa",
    description:
      "Fotografia professional, vídeo, plànol 3D, tour virtual i difusió: així preparem i movem cada habitatge abans de vendre'l.",
  },
  en: {
    title: "How we work on your home",
    description:
      "Professional photography, video, 3D floor plan, virtual tour and reach: how we prepare and promote every home before selling it.",
  },
  fr: {
    title: "Comment nous travaillons votre maison",
    description:
      "Photographie professionnelle, vidéo, plan 3D, visite virtuelle et diffusion : comment nous préparons et diffusons chaque logement avant de le vendre.",
  },
};

export function comoMetadata(lang: Lang): Metadata {
  const m = META[lang];
  const url = COMO_URLS[lang];
  return {
    title: m.title,
    description: m.description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: { ...COMO_URLS, "x-default": COMO_URLS.es },
    },
    openGraph: {
      title: `${m.title} — The Vila Home`,
      description: m.description,
      images: ["/images/vender/salon-bien-2.jpg"],
      type: "website",
      url,
    },
  };
}
