import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { getCachedPropertiesList } from "@/lib/sync";
import PropertyCard from "@/components/properties/PropertyCard";

const BASE_URL = "https://www.thevilahome.com";

interface ZonaFaq {
  q: string;
  a: string;
}

interface ZonaMercado {
  precio: string;
  tipos: string;
  perfil: string;
}

interface ZonaConfig {
  ciudad: string;
  nombre: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  metaTitle: string;
  metaDescription: string;
  cp?: string;
  lat: number;
  lng: number;
  mercado: ZonaMercado;
  faq: ZonaFaq[];
  cercanas: string[];
}

const ZONAS: Record<string, ZonaConfig> = {
  "vilanova": {
    ciudad: "vilanova",
    nombre: "Vilanova i la Geltrú",
    titulo: "Inmobiliaria en Vilanova i la Geltrú",
    descripcionCorta: "Capital del Garraf. Playa, centro histórico y buen acceso a Barcelona.",
    descripcionLarga:
      "Vilanova i la Geltrú es la capital de la comarca del Garraf, con más de 68.000 habitantes y un perfil de ciudad equilibrada: playa, comercio local, servicios completos y conexión directa con Barcelona en 50 minutos por tren. El mercado inmobiliario ofrece pisos de dos y tres habitaciones, áticos con vistas al mar, casas unifamiliares y chalets en urbanizaciones tranquilas. Los precios son más accesibles que en municipios como Sitges, lo que la convierte en una opción muy valorada por compradores de primera vivienda y familias que buscan calidad de vida sin renunciar a la ciudad.",
    metaTitle: "Inmobiliaria en Vilanova i la Geltrú — Pisos y casas en venta",
    metaDescription:
      "Pisos, casas y chalets en venta en Vilanova i la Geltrú. The Vila Home es tu inmobiliaria local en el Garraf: cercanos, honestos y con presencia real en cada operación.",
    cp: "08800",
    lat: 41.2183,
    lng: 1.7266,
    mercado: {
      precio: "2.000–2.800 €/m²",
      tipos: "Pisos, áticos, casas unifamiliares",
      perfil: "Primera vivienda, inversión local",
    },
    faq: [
      {
        q: "¿Cuánto cuesta un piso en Vilanova i la Geltrú?",
        a: "El precio medio se sitúa entre 2.000 y 2.800 €/m² según la zona y el estado del inmueble. Un piso de dos habitaciones en el centro ronda los 150.000–200.000 €, y un ático con vistas al mar puede superar los 350.000 €. Los precios son más accesibles que en Sitges, lo que convierte Vilanova en una opción muy valorada por compradores de primera vivienda.",
      },
      {
        q: "¿Cuánto tarda en venderse una casa en Vilanova?",
        a: "Con una valoración correcta y buena presentación, la mayoría de propiedades se venden en 60–90 días. Las viviendas bien ubicadas y a precio de mercado pueden cerrarse en menos de 30 días, especialmente pisos en el centro o cerca de la playa.",
      },
      {
        q: "¿Es buen momento para comprar en Vilanova i la Geltrú?",
        a: "Vilanova mantiene una demanda estable con precios más accesibles que los municipios costeros de referencia. El mercado está activo y es una opción sólida tanto para primera vivienda como para inversión, especialmente para compradores que priorizan calidad de vida, playa y buena comunicación con Barcelona.",
      },
      {
        q: "¿Cuánto cobran las inmobiliarias en Vilanova?",
        a: "Los honorarios estándar oscilan entre el 3% y el 5% del precio de venta. En The Vila Home trabajamos con condiciones claras, sin letra pequeña y con precio acordado antes de empezar. Puedes consultarnos sin ningún compromiso.",
      },
    ],
    cercanas: ["sitges", "cubelles", "sant-pere-de-ribes"],
  },

  "sitges": {
    ciudad: "sitges",
    nombre: "Sitges",
    titulo: "Inmobiliaria en Sitges",
    descripcionCorta: "Municipio de referencia en la costa del Garraf. Lujo, internacionalidad y vida cultural.",
    descripcionLarga:
      "Sitges es uno de los destinos residenciales más codiciados de la costa catalana. Conocido por su festival de cine, sus playas, su casco histórico y su comunidad internacional, el mercado inmobiliario de Sitges mueve propiedades de alto standing: villas con piscina y vistas al mar, apartamentos en el pueblo histórico y casas en urbanizaciones exclusivas como Terramar o Vallpineda. El perfil comprador es variado: inversores, familias con alto poder adquisitivo y expatriados. El precio por metro cuadrado está entre los más altos de la comarca.",
    metaTitle: "Inmobiliaria en Sitges — Pisos, villas y casas en venta",
    metaDescription:
      "Propiedades en venta en Sitges: villas, apartamentos y casas de lujo. The Vila Home, tu agencia inmobiliaria de referencia en el Garraf.",
    cp: "08870",
    lat: 41.2371,
    lng: 1.8054,
    mercado: {
      precio: "4.000–7.000 €/m²",
      tipos: "Villas, apartamentos de lujo, casas históricas",
      perfil: "Comprador internacional, alta capacidad adquisitiva",
    },
    faq: [
      {
        q: "¿Cuánto cuesta un piso en Sitges?",
        a: "Sitges es uno de los mercados inmobiliarios más caros de la provincia de Barcelona. El precio medio oscila entre 4.000 y 7.000 €/m², con villas y propiedades de lujo que superan ampliamente esta horquilla. Apartamentos en el casco histórico pueden costar entre 400.000 y 800.000 €.",
      },
      {
        q: "¿Es buen momento para comprar en Sitges?",
        a: "Sitges mantiene una demanda internacional muy sostenida, especialmente de compradores europeos. Es un mercado históricamente resistente a las bajadas y con buenas perspectivas de revalorización a largo plazo. La oferta es limitada y la demanda supera con frecuencia al stock disponible.",
      },
      {
        q: "¿Qué tipo de compradores hay en Sitges?",
        a: "El perfil es muy variado: familias españolas de alto poder adquisitivo, compradores internacionales de Reino Unido, Alemania y Países Bajos, inversores para alquiler turístico y jubilados europeos. Sitges tiene uno de los mercados de segunda residencia más activos de Cataluña.",
      },
      {
        q: "¿Cuánto cobran las inmobiliarias en Sitges?",
        a: "Los honorarios habituales están entre el 3% y el 5% del precio de venta. En The Vila Home ofrecemos condiciones transparentes y servicio personalizado, sin coste para el comprador.",
      },
    ],
    cercanas: ["vilanova", "olivella"],
  },

  "cubelles": {
    ciudad: "cubelles",
    nombre: "Cubelles",
    titulo: "Inmobiliaria en Cubelles",
    descripcionCorta: "Primera línea de mar tranquila. Precios accesibles y buena comunicación.",
    descripcionLarga:
      "Cubelles es un municipio costero de la comarca del Garraf que combina tranquilidad residencial con acceso directo al mar. Sus playas, su núcleo antiguo y sus urbanizaciones tranquilas lo convierten en una opción ideal para familias y personas que buscan una segunda residencia cerca de Barcelona sin el precio de Sitges. El mercado ofrece pisos con terraza, casas de planta baja y chalets en urbanizaciones con piscina comunitaria. La conexión en tren a Barcelona es directa y la oferta gastronómica y de servicios está en pleno crecimiento.",
    metaTitle: "Inmobiliaria en Cubelles — Pisos y casas en venta",
    metaDescription:
      "Pisos, casas y apartamentos en venta en Cubelles. The Vila Home, especialistas inmobiliarios en el Garraf y la costa del Penedès.",
    cp: "08880",
    lat: 41.2103,
    lng: 1.6699,
    mercado: {
      precio: "1.800–2.500 €/m²",
      tipos: "Apartamentos, plantas bajas, chalets",
      perfil: "Familias, segunda residencia costera",
    },
    faq: [
      {
        q: "¿Cuánto cuesta un piso en Cubelles?",
        a: "El precio medio en Cubelles ronda los 1.800–2.500 €/m², significativamente más accesible que en Sitges o Vilanova. Un apartamento de dos habitaciones puede encontrarse entre 130.000 y 200.000 €, y una casa con jardín en urbanización entre 250.000 y 450.000 €.",
      },
      {
        q: "¿Cuánto tarda en venderse una casa en Cubelles?",
        a: "La demanda es constante, especialmente en la franja costera y en primavera. Propiedades bien valoradas suelen cerrarse en 60–120 días. La temporada de mayor actividad es de marzo a junio, el mejor momento para poner una propiedad en venta.",
      },
      {
        q: "¿Qué tipo de propiedades hay en Cubelles?",
        a: "Abundan los pisos con terraza, plantas bajas con jardín y chalets en urbanizaciones tranquilas. El núcleo histórico ofrece también casas de pueblo con encanto. Es un mercado con buena variedad para primera residencia y segunda residencia.",
      },
    ],
    cercanas: ["vilanova", "cunit"],
  },

  "sant-pere-de-ribes": {
    ciudad: "sant pere",
    nombre: "Sant Pere de Ribes",
    titulo: "Inmobiliaria en Sant Pere de Ribes",
    descripcionCorta: "Calma, naturaleza y urbanizaciones en el interior del Garraf.",
    descripcionLarga:
      "Sant Pere de Ribes es uno de los municipios con mayor extensión del Garraf e incluye núcleos tan conocidos como Ribes de Freser, Les Roquetes y Canyelles. Es el destino favorito para quienes buscan una casa con jardín, una urbanización tranquila o un chalet con amplio espacio exterior, sin alejarse demasiado de la costa ni de Barcelona. El mercado inmobiliario ofrece principalmente casas unifamiliares, pareadas y chalets en urbanizaciones bien comunicadas con acceso a la autopista AP-7 y la C-15.",
    metaTitle: "Inmobiliaria en Sant Pere de Ribes — Casas y chalets en venta",
    metaDescription:
      "Casas, chalets y urbanizaciones en venta en Sant Pere de Ribes. The Vila Home, tu agencia inmobiliaria local en el Garraf.",
    cp: "08810",
    lat: 41.2644,
    lng: 1.7651,
    mercado: {
      precio: "2.000–3.500 €/m²",
      tipos: "Chalets, adosados, unifamiliares con jardín",
      perfil: "Familias con hijos, espacio exterior",
    },
    faq: [
      {
        q: "¿Cuánto cuesta una casa en Sant Pere de Ribes?",
        a: "El mercado está dominado por chalets y casas unifamiliares. Los precios varían entre 300.000 € para adosados en urbanización hasta más de 600.000 € para chalets amplios con piscina privada. El precio por metro cuadrado es habitualmente más elevado que en la costa por el tamaño de las viviendas.",
      },
      {
        q: "¿Cuáles son las mejores zonas de Sant Pere de Ribes?",
        a: "Les Roquetes, Mas Mestre y Canyelles son las más demandadas por su tranquilidad y buenas comunicaciones. Ribes de Freser es popular entre quienes buscan casa en el centro del municipio. Cada núcleo tiene su propio carácter y rango de precios.",
      },
      {
        q: "¿Es tranquilo vivir en Sant Pere de Ribes?",
        a: "Es uno de los municipios más tranquilos del Garraf. Ideal para familias que buscan espacio y naturaleza a 15 minutos de la playa y 45 minutos de Barcelona por autopista. La calidad de vida es alta y la sensación de comunidad es notable en comparación con los municipios costeros.",
      },
    ],
    cercanas: ["vilanova", "olivella", "canyelles"],
  },

  "cunit": {
    ciudad: "cunit",
    nombre: "Cunit",
    titulo: "Inmobiliaria en Cunit",
    descripcionCorta: "Costa tranquila al sur del Garraf. Playa, urbanizaciones y precios accesibles.",
    descripcionLarga:
      "Cunit es un municipio costero situado entre Cubelles y Calafell, en el límite entre el Garraf y el Baix Penedès. Sus playas de arena fina, sus urbanizaciones residenciales y su tranquilidad lo convierten en una opción cada vez más demandada por familias que buscan vivienda junto al mar a precios razonables. El municipio ha experimentado un crecimiento sostenido en los últimos años, con nuevas promociones y una oferta variada que va desde apartamentos en primera línea hasta chalets en urbanizaciones con piscina comunitaria.",
    metaTitle: "Inmobiliaria en Cunit — Pisos y casas en venta",
    metaDescription:
      "Pisos, apartamentos y chalets en venta en Cunit. The Vila Home, especialistas inmobiliarios en la costa del Garraf y el Penedès.",
    cp: "43881",
    lat: 41.1980,
    lng: 1.6385,
    mercado: {
      precio: "1.800–2.400 €/m²",
      tipos: "Apartamentos, chalets en urbanización",
      perfil: "Primera y segunda residencia costera",
    },
    faq: [
      {
        q: "¿Cuánto cuesta un piso en Cunit?",
        a: "Los precios en Cunit rondan los 1.800–2.400 €/m², muy competitivos para un municipio con acceso directo al mar. Un apartamento de dos habitaciones puede encontrarse entre 120.000 y 190.000 €, y una casa en urbanización entre 220.000 y 400.000 €.",
      },
      {
        q: "¿Qué tipo de propiedades hay en Cunit?",
        a: "La oferta se concentra en apartamentos y chalets en urbanizaciones tranquilas, muchas con acceso peatonal a la playa. También hay casas de planta baja con jardín muy demandadas por familias. Es un mercado equilibrado entre primera y segunda residencia.",
      },
      {
        q: "¿Cómo se va de Cunit a Barcelona?",
        a: "Cunit dispone de estación de Rodalies con conexión directa a Barcelona en aproximadamente 55–65 minutos. También está bien comunicada por autopista (AP-7 y C-32), lo que la hace ideal para quienes trabajan en Barcelona y buscan calidad de vida en la costa.",
      },
    ],
    cercanas: ["cubelles", "vilanova"],
  },

  "vilafranca": {
    ciudad: "vilafranca",
    nombre: "Vilafranca del Penedès",
    titulo: "Inmobiliaria en Vilafranca del Penedès",
    descripcionCorta: "Capital del Penedès. Ciudad completa, precios accesibles y excelentes comunicaciones.",
    descripcionLarga:
      "Vilafranca del Penedès es la capital de la comarca del Alt Penedès, con más de 40.000 habitantes y una oferta de servicios completa: hospitales, escuelas, universidades, comercio local y gran superficie. El mercado inmobiliario ofrece pisos en el centro histórico, casas con jardín en barrios residenciales y unifamiliares en urbanizaciones tranquilas. Los precios son claramente más accesibles que en la costa, lo que la convierte en una opción muy valorada por familias de primera vivienda. La cultura del vino y la gastronomía local añaden un valor diferencial de calidad de vida difícil de encontrar en los municipios costeros.",
    metaTitle: "Inmobiliaria en Vilafranca del Penedès — Pisos y casas en venta",
    metaDescription:
      "Pisos, casas y unifamiliares en venta en Vilafranca del Penedès. The Vila Home, tu agencia inmobiliaria en el Penedès y el Garraf.",
    cp: "08720",
    lat: 41.3434,
    lng: 1.6978,
    mercado: {
      precio: "1.400–2.000 €/m²",
      tipos: "Pisos, casas con jardín, unifamiliares",
      perfil: "Primera vivienda, presupuesto ajustado",
    },
    faq: [
      {
        q: "¿Cuánto cuesta un piso en Vilafranca del Penedès?",
        a: "Con precios medios entre 1.400 y 2.000 €/m², Vilafranca es una de las opciones más asequibles de la comarca. Un piso de tres habitaciones en el centro puede estar entre 130.000 y 220.000 €, y una casa con jardín entre 200.000 y 400.000 €.",
      },
      {
        q: "¿Qué ventajas tiene vivir en Vilafranca del Penedès?",
        a: "Ciudad completa con todos los servicios: hospitales, escuelas, comercio local y gran superficie. Muy buenas comunicaciones por tren y autopista. El Penedès ofrece una calidad de vida alta con precios claramente por debajo de la costa, ideal para primera vivienda o para familias que no necesitan vivir junto al mar.",
      },
      {
        q: "¿Cuánto tarda el tren de Vilafranca a Barcelona?",
        a: "El tren de Rodalies conecta Vilafranca con Barcelona en aproximadamente 50–60 minutos. Los trenes de la línea R4 son frecuentes y directos. Una de las mejores conexiones ferroviarias de la comarca para quienes trabajan en Barcelona.",
      },
    ],
    cercanas: ["vilanova", "sant-pere-de-ribes"],
  },

  "olivella": {
    ciudad: "olivella",
    nombre: "Olivella",
    titulo: "Inmobiliaria en Olivella",
    descripcionCorta: "Naturaleza, privacidad y chalets exclusivos en el Parque del Garraf.",
    descripcionLarga:
      "Olivella es un municipio singular en el corazón del Parque Natural del Garraf. Sin apenas núcleo urbano, el municipio se compone de masías, villas y chalets dispersos entre la vegetación mediterránea. La privacidad, el silencio y las vistas son los valores principales del mercado inmobiliario local. A solo 15 minutos de Sitges y 20 minutos de Vilanova, es el destino preferido de quienes buscan desconexión total sin alejarse de la costa ni de Barcelona. Las parcelas son amplias, la densidad es muy baja y el carácter exclusivo del entorno mantiene los precios en niveles altos.",
    metaTitle: "Inmobiliaria en Olivella — Chalets y villas en venta",
    metaDescription:
      "Chalets, villas y propiedades exclusivas en venta en Olivella. The Vila Home, especialistas en el mercado inmobiliario del Garraf.",
    cp: "08818",
    lat: 41.2867,
    lng: 1.7820,
    mercado: {
      precio: "2.500–5.000 €/m²",
      tipos: "Chalets, villas, masías con parcela",
      perfil: "Privacidad, naturaleza, alta capacidad adquisitiva",
    },
    faq: [
      {
        q: "¿Cuánto cuesta una casa en Olivella?",
        a: "Olivella es un municipio de chalets y villas con una amplia horquilla de precios. Las propiedades oscilan entre 400.000 € para casas más compactas hasta 1.200.000 € o más para grandes villas con piscina, vistas y parcelas amplias.",
      },
      {
        q: "¿Qué tiene de especial vivir en Olivella?",
        a: "Olivella ofrece tranquilidad total, naturaleza del Parque del Garraf y un nivel de privacidad difícil de encontrar en la costa, a solo 15 minutos de Sitges y 20 de Vilanova. Las propiedades suelen tener terrenos amplios y vistas despejadas. Es el destino favorito de quienes buscan desconexión real sin renunciar a la proximidad de la ciudad.",
      },
      {
        q: "¿Hay buena comunicación desde Olivella?",
        a: "Olivella no tiene estación de tren propia, por lo que el coche es imprescindible. La C-15 y la AP-7 están muy próximas, y en 15–20 minutos llegas a las estaciones de Sitges o Vilanova. Es una opción ideal para quienes trabajan en remoto o tienen flexibilidad de desplazamiento.",
      },
    ],
    cercanas: ["sitges", "sant-pere-de-ribes"],
  },

  "canyelles": {
    ciudad: "canyelles",
    nombre: "Canyelles",
    titulo: "Inmobiliaria en Canyelles",
    descripcionCorta: "Casas con jardín en el Garraf interior. Tranquilidad y buen acceso a la costa.",
    descripcionLarga:
      "Canyelles es un municipio tranquilo del interior del Garraf, muy valorado por familias que buscan casa con jardín a un precio razonable y sin renunciar a la proximidad de la costa. La oferta inmobiliaria es casi exclusivamente de casas adosadas, pareadas y chalets en urbanizaciones ordenadas y bien mantenidas. A 10 minutos de Vilanova y 20 de Sitges, y con acceso cómodo a la autopista C-15, Canyelles ofrece una relación calidad-precio difícil de igualar en la comarca del Garraf para quienes priorizan el espacio exterior y la tranquilidad.",
    metaTitle: "Inmobiliaria en Canyelles — Casas y chalets en venta",
    metaDescription:
      "Casas, adosados y chalets en venta en Canyelles. The Vila Home, tu agencia inmobiliaria local en el Garraf.",
    cp: "08811",
    lat: 41.2930,
    lng: 1.7278,
    mercado: {
      precio: "1.800–3.000 €/m²",
      tipos: "Adosados, pareados, chalets con jardín",
      perfil: "Familias que buscan espacio y jardín",
    },
    faq: [
      {
        q: "¿Cuánto cuesta una casa en Canyelles?",
        a: "El mercado de Canyelles ofrece principalmente casas adosadas y chalets entre 200.000 y 500.000 €. Es una de las opciones más asequibles del Garraf para tener casa con jardín y garaje, a solo 10 minutos de la costa.",
      },
      {
        q: "¿Qué tipo de propiedades hay en Canyelles?",
        a: "La oferta es casi exclusivamente de casas adosadas, pareadas y chalets en urbanizaciones tranquilas. Muy poca oferta de pisos, lo que atrae a familias que buscan espacio sin el precio de la primera línea de costa. Muchas propiedades tienen jardín privado y piscina comunitaria.",
      },
      {
        q: "¿Cómo se va de Canyelles a Barcelona?",
        a: "En coche, por la C-15 y la AP-7, Barcelona queda a unos 50 minutos. La estación de tren más próxima es la de Vilanova i la Geltrú, a 10 minutos en coche, con trenes de Rodalies a Barcelona en 50 minutos.",
      },
    ],
    cercanas: ["sant-pere-de-ribes", "vilanova"],
  },
};

interface Props {
  params: Promise<{ ciudad: string }>;
}

export function generateStaticParams() {
  return Object.keys(ZONAS).map((slug) => ({ ciudad: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ciudad } = await params;
  const zona = ZONAS[ciudad];
  if (!zona) return { title: "Zona no encontrada" };

  const canonicalUrl = `${BASE_URL}/zona/${ciudad}`;
  return {
    title: zona.metaTitle,
    description: zona.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "The Vila Home",
      locale: "es_ES",
      title: zona.metaTitle,
      description: zona.metaDescription,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: zona.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@thevilahome",
      title: zona.metaTitle,
      description: zona.metaDescription,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export const revalidate = 3600;

export default async function ZonaPage({ params }: Props) {
  const { ciudad } = await params;
  const zona = ZONAS[ciudad];
  if (!zona) notFound();

  const { properties, total } = await getCachedPropertiesList({
    ciudad: zona.ciudad,
    limit: 12,
    page: 1,
  });

  const canonicalUrl = `${BASE_URL}/zona/${ciudad}`;
  const waText = encodeURIComponent(
    `Hola, me gustaría que me avisaseis cuando haya propiedades disponibles en ${zona.nombre}.`
  );
  const waUrl = `https://wa.me/34638359612?text=${waText}`;

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "The Vila Home",
    description: `Inmobiliaria especializada en ${zona.nombre}. Venta de pisos, casas y chalets en el Garraf y Penedès.`,
    url: BASE_URL,
    telephone: "+34936061800",
    email: "info@thevilahome.com",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Francesc Macià 48",
      addressLocality: "Vilanova i la Geltrú",
      addressRegion: "Barcelona",
      postalCode: "08800",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.2183, longitude: 1.7266 },
    areaServed: { "@type": "City", name: zona.nombre },
    sameAs: [
      "https://www.instagram.com/thevilahome",
      "https://www.facebook.com/profile.php?id=100093001283637",
      "https://www.tiktok.com/@thevilahome",
    ],
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${BASE_URL}/propiedades` },
      { "@type": "ListItem", position: 3, name: zona.nombre, item: canonicalUrl },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: zona.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const cercanas = zona.cercanas
    .map((slug) => ({ slug, zona: ZONAS[slug] }))
    .filter((z) => z.zona != null);

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <Script
        id="schema-zona"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <Script
        id="schema-breadcrumb-zona"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <Script
        id="schema-faq-zona"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="text-[#555] text-xs font-body tracking-wide mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C9B99A] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-[#C9B99A] transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-[#888]">{zona.nombre}</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl text-white font-light mb-3">
            {zona.titulo}
          </h1>
          <p className="text-[#666] text-sm font-body max-w-xl">
            {zona.descripcionCorta}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* Left column */}
          <div className="flex-1">
            {properties.length > 0 ? (
              <>
                <p className="text-[#666] text-sm font-body mb-6">
                  {total} {total === 1 ? "propiedad encontrada" : "propiedades encontradas"} en {zona.nombre}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property, i) => (
                    <PropertyCard key={property.id} property={property} priority={i < 2} />
                  ))}
                </div>
                {total > 12 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/propiedades?ciudad=${encodeURIComponent(zona.nombre)}`}
                      className="inline-block px-8 py-3 border border-[#C9B99A]/40 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
                    >
                      Ver todas las propiedades en {zona.nombre}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Avísame block */}
                <div className="border border-[#C9B99A]/20 bg-[#0d0d0d] p-8">
                  <p className="text-[#C9B99A] text-xs font-body tracking-[0.25em] uppercase mb-3">
                    Activos en esta zona
                  </p>
                  <h2 className="font-display text-2xl text-white font-light mb-3">
                    Ahora mismo no tenemos propiedades en {zona.nombre}
                  </h2>
                  <p className="text-[#888] text-sm leading-relaxed mb-6">
                    Pero trabajamos activamente en esta zona. Tenemos compradores y vendedores buscando aquí. Si te interesa, escríbenos y te avisamos en cuanto entre algo que encaje.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-black text-xs font-body tracking-widest uppercase hover:bg-[#1fbd58] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Avisadme por WhatsApp
                    </a>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center px-6 py-3 border border-[#C9B99A]/30 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
                    >
                      Contactar
                    </Link>
                  </div>
                </div>

                {/* Market data */}
                <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6">
                  <p className="text-[#C9B99A] text-xs font-body tracking-[0.25em] uppercase mb-5">
                    Mercado local
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">Precio medio</p>
                      <p className="text-white font-display text-lg">{zona.mercado.precio}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">Tipo de vivienda</p>
                      <p className="text-[#aaa] text-sm font-body leading-relaxed">{zona.mercado.tipos}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-xs font-body uppercase tracking-wide mb-1">Perfil comprador</p>
                      <p className="text-[#aaa] text-sm font-body leading-relaxed">{zona.mercado.perfil}</p>
                    </div>
                  </div>
                </div>

                {/* Seller CTA */}
                <div className="border border-[#1e1e1e] p-6">
                  <p className="text-[#888] text-xs font-body tracking-[0.2em] uppercase mb-2">
                    ¿Tienes una propiedad en {zona.nombre}?
                  </p>
                  <p className="text-[#ccc] text-sm mb-4 leading-relaxed">
                    Valoramos tu inmueble de forma gratuita. Sin compromiso, respuesta en menos de 24 horas.
                  </p>
                  <Link
                    href="/valoracion"
                    className="inline-block px-6 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors"
                  >
                    Valorar mi propiedad
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="border border-[#1e1e1e] p-6 mb-6">
              <h2 className="font-display text-xl text-white font-light mb-4">
                Sobre {zona.nombre}
              </h2>
              <p className="text-[#888] text-sm leading-relaxed">
                {zona.descripcionLarga}
              </p>
            </div>

            <div className="relative border border-[#C9B99A]/20 p-6 bg-[#0d0d0d]">
              <p className="text-[#888] text-xs font-body tracking-[0.2em] uppercase mb-3">
                ¿Buscas o vendes en {zona.nombre}?
              </p>
              <p className="text-[#ccc] text-sm mb-5 leading-relaxed">
                Cuéntanos tu situación y te damos una opinión honesta, sin compromiso.
              </p>
              <Link
                href="/contacto"
                className="block text-center px-6 py-3 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase hover:bg-[#DDD0BB] transition-colors mb-3"
              >
                Contactar
              </Link>
              <Link
                href="/valoracion"
                className="block text-center px-6 py-3 border border-[#C9B99A]/30 text-[#C9B99A] text-xs font-body tracking-widest uppercase hover:border-[#C9B99A] transition-colors"
              >
                Valorar mi casa
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* FAQ section */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-8 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              Preguntas frecuentes
            </span>
          </div>
          <div className="max-w-3xl space-y-px">
            {zona.faq.map(({ q, a }, i) => (
              <details key={i} className="group border border-[#1e1e1e] bg-[#0d0d0d]">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-display text-lg text-white font-light group-open:text-[#C9B99A] transition-colors pr-4">
                    {q}
                  </span>
                  <span className="text-[#C9B99A] shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[#888] text-sm leading-relaxed">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby zones */}
      {cercanas.length > 0 && (
        <div className="border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-8 bg-[#C9B99A]" />
              <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
                Zonas cercanas
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cercanas.map(({ slug, zona: z }) => (
                <Link
                  key={slug}
                  href={`/zona/${slug}`}
                  className="border border-[#1e1e1e] p-6 hover:border-[#C9B99A]/30 transition-colors group"
                >
                  <p className="font-display text-xl text-white font-light mb-2 group-hover:text-[#C9B99A] transition-colors">
                    {z.nombre}
                  </p>
                  <p className="text-[#666] text-xs font-body leading-relaxed mb-3">
                    {z.descripcionCorta}
                  </p>
                  <p className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
                    Ver propiedades →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
