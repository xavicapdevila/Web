import { unstable_cache } from "next/cache";

export interface GoogleReview {
  author: string;
  text: string;
  rating: number;
}

export interface PlaceData {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
}

const PLACE_ID = "ChIJhciFmN6HoxIRfBIcpyI-w6Q";

export const FALLBACK_PLACE_DATA: PlaceData = {
  rating: 4.9,
  totalReviews: 106,
  reviews: [
    {
      author: "Jordi Pons",
      text: "Grans professionals i millors persones. La seva gestió ha estat impecable",
      rating: 5,
    },
    {
      author: "Marta",
      text: "Un tracte molt professional i proper, transparència des del principi i acompanyant-nos en tot el procés. Moltes gràcies Xavier",
      rating: 5,
    },
    {
      author: "Yohel Arce",
      text: "Equipo muy profesional. Facilitadores en la tramitación y proceso inmueble. Como cliente muy satisfecho. Recomendable totalmente",
      rating: 5,
    },
    {
      author: "Patricia Reyes",
      text: "Muy buena experiencia. El trato fue muy profesional y cercano durante todo el proceso de venta. Ari fue especialmente amable, siempre atenta y dispuesta a ayudarnos",
      rating: 5,
    },
    {
      author: "Yolee Seth",
      text: "La forma en la que trabajan es honesta, eficiente, con un trato personal excelente, con empatía y sobre todo con una visión muy clara y mucha profesionalidad",
      rating: 5,
    },
    {
      author: "Laura Cano",
      text: "Ha sido un privilegio contar con ellos. Son súper profesionales y facilitan todo. Recomiendo 100%, trato cercano y transparente",
      rating: 5,
    },
  ],
};

async function fetchPlaceData(): Promise<PlaceData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return FALLBACK_PLACE_DATA;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`[Google Places] HTTP ${res.status}: ${await res.text()}`);
      return FALLBACK_PLACE_DATA;
    }

    const data = await res.json();

    // REGLA (Xavi, ago 2026): en la web no aparece NADA por debajo de 5
    // estrellas, y solo reseñas que existan en Google (esta API es la única
    // fuente; las opiniones privadas de /resena viven en Ora, nunca aquí).
    const reviews: GoogleReview[] = ((data.reviews as any[]) ?? [])
      .filter((r) => r.rating === 5 && (r.originalText?.text ?? r.text?.text)?.trim())
      .sort((a, b) => new Date(b.publishTime ?? 0).getTime() - new Date(a.publishTime ?? 0).getTime())
      .slice(0, 6)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Cliente",
        text: ((r.originalText?.text ?? r.text?.text) as string).trim(),
        rating: r.rating as number,
      }));

    return {
      reviews: reviews.length > 0 ? reviews : FALLBACK_PLACE_DATA.reviews,
      rating: data.rating ?? FALLBACK_PLACE_DATA.rating,
      totalReviews: data.userRatingCount ?? FALLBACK_PLACE_DATA.totalReviews,
    };
  } catch (err) {
    console.error("[Google Places]", err);
    return FALLBACK_PLACE_DATA;
  }
}

export const getGooglePlaceData = unstable_cache(
  fetchPlaceData,
  ["google-place-data"],
  { revalidate: 86400 }
);
