import type { Metadata } from "next";
import HomeWowShell from "@/components/pages/home-wow/Shell";
import { getGooglePlaceData } from "@/lib/googlePlaces";
import { getCachedPropertiesList } from "@/lib/sync";

/* PROTOTIPO — no indexar. Tercera previa de la home, junto a /home-claro
   (la actual en claro, contenida) y /home-preview (el fondo que camina).
   Esta sube la apuesta: base clara y espectáculo. No sustituye a nada.
   SIN EQUIPO: Xavi decidió que el equipo no aparece en la home — para eso
   está /quienes-somos (la foto del hero es otra cosa: es la de siempre). */
export const metadata: Metadata = {
  title: "Home wow (propuesta) — The Vila Home",
  robots: { index: false, follow: false },
};

/* ISR: la página se sirve pre-renderizada (sin streaming). Importante aquí:
   con datos lentos, el fallback de Suspense + CSP dejaba la página a medias
   en dev; pre-rendida no hay fallback que destapar. */
export const revalidate = 600;

export default async function HomeWowPage() {
  const [place, list] = await Promise.all([
    getGooglePlaceData(),
    getCachedPropertiesList({ limit: 100 }),
  ]);

  return (
    <HomeWowShell
      rating={place.rating}
      totalReviews={place.totalReviews}
      reviews={place.reviews}
      properties={list.properties}
    />
  );
}
