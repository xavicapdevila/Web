import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatM2(m2: number): string {
  return `${Math.round(m2)} m²`;
}

/** Format a YYYY-MM-DD date string as dd/mm/yyyy — never shows time */
export function formatBlogDate(fecha: string): string {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

export function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getEnergyColor(letra: string): string {
  const colors: Record<string, string> = {
    A: "#00a550",
    B: "#4db848",
    C: "#8dc63f",
    D: "#f7ed00",
    E: "#f7a600",
    F: "#f05a22",
    G: "#ed1c24",
  };
  return colors[letra?.toUpperCase()] ?? "#888";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Deterministic "random" base visit count derived from the slug.
 * Stable per article across all renders — looks organic (range 1 000–6 499).
 * Each slug produces a different number, new articles get theirs automatically.
 * Real visits accumulate on top with no upper cap.
 */
export function baseVisits(slug: string): number {
  // Two independent hash rounds to get more spread
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  }
  let h2 = h ^ (h >>> 16);
  h2 = Math.imul(h2, 0x45d9f3b);
  h2 = h2 ^ (h2 >>> 16);
  return 1000 + (Math.abs(h2) % 5500); // range 1 000–6 499
}
