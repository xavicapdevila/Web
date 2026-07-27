import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, DM_Serif_Display, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// General Sans (Fontshare) — tipografía de la landing /vender rediseñada.
const generalSans = localFont({
  src: "../../public/fonts/general-sans/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});
import PublicChrome from "@/components/layout/PublicChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

// Tipografías de la landing /vender — DM Serif Display (titulares) + DM Sans (cuerpo/UI)
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://www.thevilahome.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  // Keyword primero (como la competencia que rankea nº1): esto SOLO se ve en
  // Google y en la pestaña del navegador — no cambia nada del diseño de la web.
  title: {
    default: "Inmobiliaria en Vilanova i la Geltrú — The Vila Home",
    template: "%s | The Vila Home",
  },
  description:
    "Inmobiliaria en Vilanova i la Geltrú especializada en venta de pisos, casas, chalets y áticos en el Garraf y Penedès. Human Real Estate — cercanos, honestos y sin corporativismo.",
  keywords: [
    "inmobiliaria Vilanova i la Geltrú",
    "inmobiliaria en Vilanova",
    "inmobiliarias en Vilanova i la Geltrú",
    "agencia inmobiliaria Vilanova i la Geltrú",
    "agencias inmobiliarias en Vilanova",
    "mejores inmobiliarias Vilanova i la Geltrú",
    "pisos en venta Vilanova",
    "casas en venta Garraf",
    "chalets Penedès",
    "comprar piso Vilanova",
    "vender casa Vilanova",
    "vender piso Vilanova i la Geltrú",
    "The Vila Home",
    "inmobiliaria Garraf",
    "agencias inmobiliarias Garraf",
    "inmobiliaria Sitges",
    "inmobiliaria Cubelles",
    "inmobiliaria Cunit",
    "inmobiliaria Sant Pere de Ribes",
    "inmobiliaria Vilafranca del Penedès",
  ],
  authors: [{ name: "The Vila Home", url: BASE_URL }],
  creator: "The Vila Home",
  publisher: "The Vila Home",
  icons: {
    icon: [
      // SVG — scalable, modern browsers (Chrome 80+, Firefox, Edge)
      { url: "/favicon.svg?v=6",        type: "image/svg+xml" },
      // PNG fallbacks — ordered smallest → largest
      { url: "/favicon-16x16.png?v=6",  type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png?v=6",  type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png?v=6",  type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png?v=6",  type: "image/png", sizes: "96x96" },
      // ICO — legacy fallback (IE, old Windows Explorer)
      { url: "/favicon.ico",        sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    // iOS home-screen icon
    apple: [{ url: "/apple-touch-icon.png?v=6", sizes: "180x180", type: "image/png" }],
    // Android / PWA icons (also referenced in site.webmanifest)
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png?v=6", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png?v=6", sizes: "512x512", type: "image/png" },
    ],
  },
  // PWA manifest
  manifest: "/site.webmanifest",
  // Windows tile color + mobile browser theme
  other: {
    "msapplication-TileColor":  "#0a0a0a",
    "msapplication-TileImage":  "/mstile-150x150.png",
    "msapplication-config":     "/browserconfig.xml",
    "theme-color":              "#C9B99A",
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "The Vila Home",
    title: "Inmobiliaria en Vilanova i la Geltrú — The Vila Home",
    description:
      "Inmobiliaria en Vilanova i la Geltrú. Pisos, casas y chalets en el Garraf y Penedès. Cercanos, honestos y sin corporativismo.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Vila Home — Inmobiliaria en Vilanova i la Geltrú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevilahome",
    creator: "@thevilahome",
    title: "The Vila Home | Human Real Estate",
    description: "Inmobiliaria en Vilanova i la Geltrú. Garraf y Penedès.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// OJO: este layout no debe leer headers()/cookies(). Hacerlo convierte TODA la
// web en render dinámico (adiós estático/ISR y adiós 404 reales). La decisión
// de mostrar u ocultar el chrome público vive en <PublicChrome> (cliente).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${dmSerif.variable} ${dmSans.variable} ${generalSans.variable}`}
    >
      <head>
        {/* next/font self-aloja las fuentes: no hace falta preconnect a Google Fonts */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* SOLO fuera de Vercel (dev y `next start` locales). El runtime de
            streaming de React 19.2 difiere el reveal de los boundaries de
            Suspense ($RC→$RV) y el retry de hidratación a requestAnimationFrame,
            que NO se dispara con la pestaña oculta/ocluida (panel embebido,
            Chrome tapado por otra ventana…). Resultado: en rutas standalone
            (todo el body dentro del boundary de loading.tsx) la página se ve
            pero no hidrata hasta que la pestaña vuelve a ser visible — parecía
            un bug local y era la visibilidad. Con el documento oculto, rAF cae
            a setTimeout para que reveal+hidratación avancen igual. En Vercel
            no se emite: producción queda byte a byte como estaba. */}
        {process.env.VERCEL !== "1" && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){var r=window.requestAnimationFrame.bind(window),c=window.cancelAnimationFrame.bind(window),O=1e9;window.requestAnimationFrame=function(f){return document.visibilityState==='hidden'?O+setTimeout(function(){f(performance.now())},32):r(f)};window.cancelAnimationFrame=function(i){i>=O?clearTimeout(i-O):c(i)}})();",
            }}
          />
        )}
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f0e8] min-h-screen flex flex-col antialiased">
        {/* Splash de arranque universal (iOS/Android/escritorio): se pinta con el
            primer byte de HTML (antes de hidratar, antes de descargar JS) y se
            desvanece al terminar de parsear el documento. Evita la pantalla
            negra "muerta" al abrir la web en móvil. Estilos en globals.css. */}
        {/* suppressHydrationWarning: el script inline le añade la clase
            app-splash-done ANTES de que React hidrate; sin esto React se queja
            del atributo class distinto. El nodo NUNCA se elimina del DOM
            (solo visibility:hidden) para no romper la hidratación en móviles
            lentos donde React llega después del DOMContentLoaded. */}
        <div id="app-splash" aria-hidden="true" suppressHydrationWarning>
          {/* img nativo a propósito: next/image necesita JS/hidratación y aquí
              queremos pintar YA. El SVG pesa ~2KB y queda cacheado. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={180} height={57} decoding="async" />
          <div className="app-splash-spinner" />
        </div>
        <script
          // Oculta el splash en cuanto el HTML está parseado (DOMContentLoaded),
          // que en streaming SSR ≈ contenido ya visible. Inline a propósito:
          // next/script se difiere y llegaría tarde. Si JS está bloqueado, el
          // fallback CSS (animación con delay) lo retira igualmente.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function h(){var e=document.getElementById('app-splash');if(e)e.classList.add('app-splash-done')}if(document.readyState!=='loading'){h()}else{document.addEventListener('DOMContentLoaded',h)}})();",
          }}
        />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
