import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieBanner from "@/components/layout/CookieBanner";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";

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

const BASE_URL = "https://www.thevilahome.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Vila Home | Inmobiliaria en Vilanova i la Geltrú",
    template: "%s | The Vila Home",
  },
  description:
    "Inmobiliaria en Vilanova i la Geltrú especializada en venta de pisos, casas, chalets y áticos en el Garraf y Penedès. Human Real Estate — cercanos, honestos y sin corporativismo.",
  keywords: [
    "inmobiliaria Vilanova i la Geltrú",
    "pisos en venta Vilanova",
    "casas en venta Garraf",
    "chalets Penedès",
    "comprar piso Vilanova",
    "vender casa Vilanova",
    "The Vila Home",
    "inmobiliaria Garraf",
  ],
  authors: [{ name: "The Vila Home", url: BASE_URL }],
  creator: "The Vila Home",
  publisher: "The Vila Home",
  icons: {
    icon: [
      // SVG — scalable, modern browsers (Chrome 80+, Firefox, Edge)
      { url: "/favicon.svg",        type: "image/svg+xml" },
      // PNG fallbacks — ordered smallest → largest
      { url: "/favicon-16x16.png",  type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png",  type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png",  type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png",  type: "image/png", sizes: "96x96" },
      // ICO — legacy fallback (IE, old Windows Explorer)
      { url: "/favicon.ico",        sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    // iOS home-screen icon
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    // Android / PWA icons (also referenced in site.webmanifest)
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
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
    title: "The Vila Home | Inmobiliaria en Vilanova i la Geltrú",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* GA is loaded conditionally by CookieConsentProvider once analytics consent is given */}
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f0e8] min-h-screen flex flex-col antialiased">
        {isAdmin ? (
          // Admin routes: no public chrome
          <>{children}</>
        ) : (
          <LanguageProvider>
            <CookieConsentProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
              <CookieBanner />
            </CookieConsentProvider>
          </LanguageProvider>
        )}
      </body>
    </html>
  );
}
