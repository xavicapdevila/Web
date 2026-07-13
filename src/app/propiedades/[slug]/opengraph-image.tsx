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
  // Sin precio en la tarjeta a propósito: la vista previa al compartir no debe
  // revelar el precio, para que entren a la web a verlo (más tráfico). En su
  // lugar mostramos las características, que atraen igual sin desvelar cifra.
  const features = property
    ? [
        property.habitaciones ? `${property.habitaciones} hab` : "",
        property.banos ? `${property.banos} baños` : "",
        property.m2Construidos ? `${Math.round(property.m2Construidos)} m²` : "",
      ]
        .filter(Boolean)
        .join("  ·  ")
    : "";
  const titulo = property?.titulo ?? "The Vila Home";
  const location = [property?.zona, property?.ciudad]
    .filter(Boolean)
    .join(", ");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Property photo — left */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "660px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Gradient fade from photo to info panel */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "780px",
            height: "630px",
            background:
              "linear-gradient(to right, rgba(10,10,10,0) 30%, #0a0a0a 80%)",
            display: "flex",
          }}
        />

        {/* Info panel — right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "560px",
            height: "630px",
            backgroundColor: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
          }}
        >
          {/* Características (sin precio, a propósito) */}
          {features && (
            <div
              style={{
                color: "#C9B99A",
                fontSize: "30px",
                fontWeight: 300,
                marginBottom: "20px",
                letterSpacing: "-0.5px",
              }}
            >
              {features}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 300,
              marginBottom: "12px",
              lineHeight: 1.35,
            }}
          >
            {titulo}
          </div>

          {/* Location */}
          {location && (
            <div
              style={{
                color: "#777777",
                fontSize: "15px",
                marginBottom: "0px",
              }}
            >
              {location}
            </div>
          )}

          {/* Separator + branding at bottom */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "#C9B99A",
                marginBottom: "16px",
              }}
            />
            <div
              style={{
                color: "#C9B99A",
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              The Vila Home
            </div>
            <div
              style={{
                color: "#444444",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Human Real Estate
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
