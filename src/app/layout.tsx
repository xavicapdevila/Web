import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
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
    "Inmobiliaria boutique en Vilanova i la Geltrú especializada en venta de pisos, casas, chalets y áticos en el Garraf y Penedès. Human Real Estate — cercanos, honestos y sin corporativismo.",
  keywords: [
    "inmobiliaria Vilanova i la Geltrú",
    "pisos en venta Vilanova",
    "casas en venta Garraf",
    "chalets Penedès",
    "comprar piso Vilanova",
    "vender casa Vilanova",
    "The Vila Home",
    "inmobiliaria boutique",
  ],
  authors: [{ name: "The Vila Home", url: BASE_URL }],
  creator: "The Vila Home",
  publisher: "The Vila Home",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "The Vila Home",
    title: "The Vila Home | Inmobiliaria en Vilanova i la Geltrú",
    description:
      "Inmobiliaria boutique en Vilanova i la Geltrú. Pisos, casas y chalets en el Garraf y Penedès. Cercanos, honestos y sin corporativismo.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Vila Home — Inmobiliaria boutique en Vilanova i la Geltrú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevilahome",
    creator: "@thevilahome",
    title: "The Vila Home | Human Real Estate",
    description: "Inmobiliaria boutique en Vilanova i la Geltrú. Garraf y Penedès.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* GA is loaded conditionally by CookieConsentProvider once analytics consent is given */}
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f0e8] min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <CookieConsentProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <CookieBanner />
          </CookieConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
