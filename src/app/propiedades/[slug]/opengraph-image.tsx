import { ImageResponse } from "next/og";
import { getCachedPropertyBySlug } from "@/lib/sync";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  // Mismo fetch cacheado del feed que usa la página: getPropertyBySlug (síncrono
  // sobre la DB en memoria) devolvía null aquí y la tarjeta salía vacía.
  let property;
  try {
    property = await getCachedPropertyBySlug(slug);
  } catch {
    property = null;
  }

  const imageUrl = property?.imagenes[0]?.url ?? null;

  // Solo la foto, a pantalla completa (1200×630), sin panel lateral, sin marca,
  // sin precio ni etiquetas: es la vista previa al compartir por WhatsApp. El
  // formato 1.91:1 hace que WhatsApp la muestre GRANDE (la foto cruda 4:3 salía
  // como miniatura). El precio se ve al entrar en la web → más tráfico.
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: "#0a0a0a",
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            style={{
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
