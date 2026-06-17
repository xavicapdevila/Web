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
   remotePatterns: [
     { protocol: "https", hostname: "**" },
     { protocol: "http",  hostname: "**" },
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

     // Blog posts antiguos (root level → /blog/)
     { source: "/inmobiliaria-en-vilanova-i-la-geltru{/}?", destination: "/blog/elegir-inmobiliaria-vender-piso", permanent: true },
     { source: "/mejor-zona-para-vivir-en-vilanova-i-la-geltru{/}?", destination: "/blog/", permanent: true },
     { source: "/por-que-mi-inmueble-no-recibe-visitas{/}?", destination: "/blog/", permanent: true },
     { source: "/hoja-de-firmas-en-visitas-inmobiliarias{/}?", destination: "/blog/", permanent: true },
     { source: "/vivir-en-vilanova-i-la-geltru{/}?", destination: "/zona/vilanova", permanent: true },
     { source: "/beneficios-broker-hipotecario{/}?", destination: "/blog/", permanent: true },
     { source: "/descripciones-inmobiliarias{/}?", destination: "/blog/", permanent: true },
     { source: "/como-preparar-tu-casa-para-la-venta{/}?", destination: "/blog/", permanent: true },
     { source: "/vender-casa-con-hipoteca-en-catalunya{/}?", destination: "/blog/", permanent: true },
     { source: "/cuanto-cuesta-vender{/}?", destination: "/blog/", permanent: true },
     { source: "/como-elegir-mejor-zona-para-vivir-en-vilanova-geltru{/}?", destination: "/blog/", permanent: true },
     { source: "/elegir-mejor-zona-vilanova-geltru{/}?", destination: "/blog/", permanent: true },
     { source: "/mejor-zona-vivir-vilanova{/}?", destination: "/blog/", permanent: true },
     { source: "/noticias{/}?", destination: "/blog/", permanent: true },

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
     { source: "/servicios/:slug{/}?", destination: "/quienes-somos/", permanent: true },
     { source: "/servicios{/}?", destination: "/quienes-somos/", permanent: true },
     { source: "/empresa{/}?", destination: "/quienes-somos/", permanent: true },

     // Paginación y taxonomías WordPress
     { source: "/page/:num{/}?", destination: "/propiedades/", permanent: true },
     { source: "/category/:slug{/}?", destination: "/blog/", permanent: true },
     { source: "/tag/:slug{/}?", destination: "/blog/", permanent: true },
     { source: "/author/:slug{/}?", destination: "/", permanent: true },

     // Permalinks WordPress con fecha (/AAAA/MM/slug). El guard \d evita
     // colisionar con rutas reales como /blog/categoria/* o /zona/*.
     { source: "/:year(\\d{4})/:month(\\d{2})/:slug{/}?", destination: "/blog/", permanent: true },
     { source: "/:year(\\d{4})/:month(\\d{2}){/}?", destination: "/blog/", permanent: true },
   ];
 },

 async headers() {
   return [
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
