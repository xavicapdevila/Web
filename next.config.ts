import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 poweredByHeader: false,
 reactStrictMode: true,

 serverExternalPackages: ["better-sqlite3", "sharp"],

 experimental: {
   optimizePackageImports: ["lucide-react", "framer-motion"],
 },

 images: {
   formats: ["image/avif", "image/webp"],
   minimumCacheTTL: 604800, // 7 days — property images rarely change
   // Restricted to the hosts we actually load images from. A wildcard ("**")
   // turns /_next/image into an open proxy → SSRF + bandwidth/quota abuse.
   remotePatterns: [
     { protocol: "https", hostname: "**.apinmo.com" },                    // property photos (XML feed)
     { protocol: "https", hostname: "**.public.blob.vercel-storage.com" }, // blog images (admin uploads)
   ],
 },

 compress: true,

 async redirects() {
   return [
     // www redirect
     {
       source: "/:path*",
       has: [{ type: "host", value: "thevilahome.com" }],
       destination: "https://www.thevilahome.com/:path*",
       permanent: true,
     },

     // --- Redirecciones web antigua (WordPress) ---

     // Assets WordPress → inicio
     { source: "/wp-content/:path*", destination: "/", permanent: true },
     { source: "/wp-includes/:path*", destination: "/", permanent: true },
     { source: "/wp-admin/:path*", destination: "/", permanent: true },
     { source: "/wp-login.php", destination: "/", permanent: true },
     { source: "/feed/:path*", destination: "/", permanent: true },
     { source: "/xmlrpc.php", destination: "/", permanent: true },

     // Páginas principales
     { source: "/home{/}?", destination: "/", permanent: true },
     { source: "/venta{/}?", destination: "/propiedades/", permanent: true },
     { source: "/inmuebles{/}?", destination: "/propiedades/", permanent: true },
     { source: "/valora-tu-vivienda{/}?", destination: "/valoracion/", permanent: true },

     // Blog posts antiguos (root level) → artículo / zona equivalente cuando existe
     { source: "/inmobiliaria-en-vilanova-i-la-geltru{/}?", destination: "/blog/elegir-inmobiliaria-vender-piso", permanent: true },
     { source: "/mejor-zona-para-vivir-en-vilanova-i-la-geltru{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/por-que-mi-inmueble-no-recibe-visitas{/}?", destination: "/blog/anuncios-inmobiliarios-reciben-mas-visitas", permanent: true },
     { source: "/hoja-de-firmas-en-visitas-inmobiliarias{/}?", destination: "/blog/hoja-visitas-inmobiliaria-que-es-como-protege", permanent: true },
     { source: "/vivir-en-vilanova-i-la-geltru{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/beneficios-broker-hipotecario{/}?", destination: "/blog/categoria/hipotecas", permanent: true },
     { source: "/descripciones-inmobiliarias{/}?", destination: "/blog/anuncios-inmobiliarios-reciben-mas-visitas", permanent: true },
     { source: "/como-preparar-tu-casa-para-la-venta{/}?", destination: "/blog/home-staging-vender-vivienda-mas-rapido", permanent: true },
     { source: "/vender-casa-con-hipoteca-en-catalunya{/}?", destination: "/blog/vender-casa-hipoteca-pendiente-catalunya", permanent: true },
     { source: "/cuanto-cuesta-vender{/}?", destination: "/blog/gastos-vender-vivienda-catalunya", permanent: true },
     { source: "/paso-previo-a-las-arras{/}?", destination: "/blog/contrato-de-arras", permanent: true },
     { source: "/como-elegir-mejor-zona-para-vivir-en-vilanova-geltru{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/elegir-mejor-zona-vilanova-geltru{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/mejor-zona-vivir-vilanova{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/noticias{/}?", destination: "/blog/", permanent: true },

     // Demo sobrante del theme WordPress (Houzez) — sin equivalente
     { source: "/about-this-demo{/}?", destination: "/", permanent: true },

     // Corrección de slug con typo (faltaba la "d" inicial de "documentacion")
     {
       source: "/blog/ocumentacion-necesaria-vender-vivienda-catalunya{/}?",
       destination: "/blog/documentacion-necesaria-vender-vivienda-catalunya",
       permanent: true,
     },

     // Páginas de propiedades (URL antigua /propiedad/ → nueva /propiedades/)
     { source: "/propiedad/:slug{/}?", destination: "/propiedades/", permanent: true },
     { source: "/propiedad{/}?", destination: "/propiedades/", permanent: true },

     // Valoración (URLs alternativas antiguas)
     { source: "/valoracion-inmuebles{/}?", destination: "/valoracion/", permanent: true },
     { source: "/valoracion-inmueble{/}?", destination: "/valoracion/", permanent: true },

     // Servicios y empresa
     { source: "/servicios/home-staging{/}?", destination: "/blog/home-staging-vender-vivienda-mas-rapido", permanent: true },
     { source: "/servicios/:slug{/}?", destination: "/quienes-somos/", permanent: true },
     { source: "/servicios{/}?", destination: "/quienes-somos/", permanent: true },
     { source: "/empresa{/}?", destination: "/quienes-somos/", permanent: true },

     // Paginación y taxonomías WordPress
     { source: "/page/:num{/}?", destination: "/propiedades/", permanent: true },
     { source: "/category/:path*", destination: "/blog/", permanent: true },
     { source: "/tag/:path*", destination: "/blog/", permanent: true },
     { source: "/author/:slug{/}?", destination: "/", permanent: true },

     // Permalinks WordPress con fecha (/AAAA/MM/slug). El guard \d evita
     // colisionar con rutas reales como /blog/categoria/* o /zona/*.
     { source: "/:year(\\d{4})/:month(\\d{2})/:slug{/}?", destination: "/blog/", permanent: true },
     { source: "/:year(\\d{4})/:month(\\d{2}){/}?", destination: "/blog/", permanent: true },
   ];
 },

 async headers() {
   // Applied to every response. frame-ancestors / X-Frame-Options stop the site
   // being embedded in a third-party iframe (clickjacking / "secuestro").
   const securityHeaders = [
     { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
     { key: "X-Frame-Options", value: "SAMEORIGIN" },
     { key: "X-Content-Type-Options", value: "nosniff" },
     { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
     { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
     { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
   ];
   return [
     { source: "/(.*)", headers: securityHeaders },
     {
       source: "/api/:path*",
       headers: [{ key: "Access-Control-Allow-Origin", value: "https://www.thevilahome.com" }],
     },
     {
       source: "/(favicon.ico|favicon.svg|favicon-:size.png|apple-touch-icon.png|android-chrome-:size.png)",
       headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
     },
   ];
 },
};

export default nextConfig;
