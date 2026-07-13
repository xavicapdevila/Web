import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 poweredByHeader: false,
 reactStrictMode: true,

 // Solo tooling local: permite a una segunda sesión (otro chat/preview) arrancar
 // su propio `next dev` con un distDir separado (Next 16 bloquea dos dev servers
 // sobre el mismo .next). Sin la variable — Vercel incluido — no cambia nada.
 ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),

 serverExternalPackages: ["better-sqlite3", "sharp"],

 experimental: {
   optimizePackageImports: ["lucide-react"],
 },

 images: {
   formats: ["image/avif", "image/webp"],
   // Next 16 exige declarar toda calidad no estándar que se use en <Image quality>.
   // 65 = miniaturas de tarjeta (PropertyCard); 75 = resto (por defecto).
   qualities: [65, 75],
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
     // Canonicalización de host: sin www y dominios propios antiguos → dominio
     // canónico. Vive AQUÍ (capa de routing de Vercel, gratis) y no en un
     // middleware: un middleware con matcher global corre en CADA asset de CADA
     // visita y dispara el consumo de invocaciones.
     {
       source: "/:path*",
       has: [{ type: "host", value: "thevilahome.com" }],
       destination: "https://www.thevilahome.com/:path*",
       permanent: true,
     },
     ...["thevilahome.es", "www.thevilahome.es", "thevilahomebcn.com", "www.thevilahomebcn.com"].map(
       (host) => ({
         source: "/:path*" as const,
         has: [{ type: "host" as const, value: host }],
         destination: "https://www.thevilahome.com/:path*",
         permanent: true,
       }),
     ),

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
     { source: "/venta{/}?", destination: "/propiedades", permanent: true },
     { source: "/inmuebles{/}?", destination: "/propiedades", permanent: true },
     { source: "/valora-tu-vivienda{/}?", destination: "/valoracion", permanent: true },

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
     { source: "/noticias{/}?", destination: "/blog", permanent: true },

     // Demo sobrante del theme WordPress (Houzez) — sin equivalente
     { source: "/about-this-demo{/}?", destination: "/", permanent: true },

     // Corrección de slug con typo (faltaba la "d" inicial de "documentacion")
     {
       source: "/blog/ocumentacion-necesaria-vender-vivienda-catalunya{/}?",
       destination: "/blog/documentacion-necesaria-vender-vivienda-catalunya",
       permanent: true,
     },

     // Páginas de propiedades (URL antigua /propiedad/ → nueva /propiedades/)
     { source: "/propiedad/:slug{/}?", destination: "/propiedades", permanent: true },
     { source: "/propiedad{/}?", destination: "/propiedades", permanent: true },

     // Valoración (URLs alternativas antiguas)
     { source: "/valoracion-inmuebles{/}?", destination: "/valoracion", permanent: true },
     { source: "/valoracion-inmueble{/}?", destination: "/valoracion", permanent: true },

     // Servicios y empresa
     { source: "/servicios/home-staging{/}?", destination: "/blog/home-staging-vender-vivienda-mas-rapido", permanent: true },
     { source: "/servicios/:slug{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/servicios{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/empresa{/}?", destination: "/quienes-somos", permanent: true },

     // Fichas de propiedad del theme antiguo (Houzez) — /properties y /property/slug
     // siguen INDEXADAS en buscadores y daban 404 (detectado jul 2026).
     { source: "/properties/:path*", destination: "/propiedades", permanent: true },
     { source: "/properties{/}?", destination: "/propiedades", permanent: true },
     { source: "/property/:path*", destination: "/propiedades", permanent: true },
     { source: "/property{/}?", destination: "/propiedades", permanent: true },
     { source: "/listing/:path*", destination: "/propiedades", permanent: true },
     { source: "/comprar{/}?", destination: "/propiedades", permanent: true },

     // Más páginas de la web antigua sin equivalente directo
     { source: "/vender-piso{/}?", destination: "/vender", permanent: true },
     { source: "/equipo{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/nosotros{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/politica-privacidad{/}?", destination: "/privacidad", permanent: true },
     { source: "/politica-de-privacidad{/}?", destination: "/privacidad", permanent: true },
     { source: "/faq{/}?", destination: "/", permanent: true },
     { source: "/faqs{/}?", destination: "/", permanent: true },
     { source: "/preguntas-frecuentes{/}?", destination: "/", permanent: true },
     { source: "/en/:path*", destination: "/", permanent: true },
     { source: "/es/:path*", destination: "/", permanent: true },
     { source: "/search", destination: "/propiedades", permanent: true },

     // Fichas del theme antiguo (Houzez): /properties y /property/slug siguen
     // INDEXADAS en buscadores y daban 404 (detectado jul 2026).
     { source: "/properties/:path*", destination: "/propiedades", permanent: true },
     { source: "/properties{/}?", destination: "/propiedades", permanent: true },
     { source: "/property/:path*", destination: "/propiedades", permanent: true },
     { source: "/property{/}?", destination: "/propiedades", permanent: true },
     { source: "/listing/:path*", destination: "/propiedades", permanent: true },
     { source: "/comprar{/}?", destination: "/propiedades", permanent: true },

     // Más páginas de la web antigua sin equivalente directo
     { source: "/vender-piso{/}?", destination: "/vender", permanent: true },
     { source: "/equipo{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/nosotros{/}?", destination: "/quienes-somos", permanent: true },
     { source: "/politica-privacidad{/}?", destination: "/privacidad", permanent: true },
     { source: "/politica-de-privacidad{/}?", destination: "/privacidad", permanent: true },
     { source: "/faq{/}?", destination: "/", permanent: true },
     { source: "/faqs{/}?", destination: "/", permanent: true },
     { source: "/preguntas-frecuentes{/}?", destination: "/", permanent: true },
     { source: "/en/:path*", destination: "/", permanent: true },
     { source: "/es/:path*", destination: "/", permanent: true },
     { source: "/search", destination: "/propiedades", permanent: true },

     // Contacto de la web antigua (sale como sitelink en Google y daba 404)
     { source: "/hablemos{/}?", destination: "/contacto", permanent: true },

     // Paginación y taxonomías WordPress. La categoría «agencias inmobiliarias»
     // tiene destino PROPIO antes de la regla genérica: como sitelink duplicaba
     // el de /blog; el contenido afín es el artículo de elegir inmobiliaria.
     { source: "/category/agencias-inmobiliarias{/}?", destination: "/blog/elegir-inmobiliaria-vender-piso", permanent: true },
     { source: "/tag/agencias-inmobiliarias{/}?", destination: "/blog/elegir-inmobiliaria-vender-piso", permanent: true },
     { source: "/page/:num{/}?", destination: "/propiedades", permanent: true },
     { source: "/category/:path*", destination: "/blog", permanent: true },
     { source: "/tag/:path*", destination: "/blog", permanent: true },
     { source: "/author/:slug{/}?", destination: "/", permanent: true },

     // Permalinks WordPress con fecha (/AAAA/MM/slug). El guard \d evita
     // colisionar con rutas reales como /blog/categoria/* o /zona/*.
     { source: "/:year(\\d{4})/:month(\\d{2})/:slug{/}?", destination: "/blog", permanent: true },
     { source: "/:year(\\d{4})/:month(\\d{2}){/}?", destination: "/blog", permanent: true },
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
     // CSP en modo bloqueo. Validada primero en Report-Only (jul 2026) contra
     // home+GA+Meta, fichas, /vender, blog y traductor sin ninguna violación.
     // Si se añade un servicio externo nuevo (script/fetch/iframe), hay que
     // añadir su dominio aquí o el navegador lo bloqueará en silencio.
     {
       key: "Content-Security-Policy",
       value: [
         "default-src 'self'",
         // *.idealista.com: widget de valoración de /valoracion (script + API + estilos + fuentes).
         // El widget usa por dentro Google Maps (dirección) y reCAPTCHA (envío final):
         // www.google.com + www.gstatic.com + maps.googleapis.com son IMPRESCINDIBLES
         // o el botón «valorar» se queda colgado.
         "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://challenges.cloudflare.com https://idealista.com https://*.idealista.com https://www.google.com https://www.gstatic.com https://maps.googleapis.com",
         "style-src 'self' 'unsafe-inline' https://*.idealista.com https://fonts.googleapis.com",
         "img-src 'self' data: blob: https:",
         "font-src 'self' data: https://*.idealista.com https://fonts.gstatic.com",
         // Incluye los endpoints de conversión de Google Ads (googleadservices,
         // doubleclick, google.com) — sin ellos las campañas no medirían.
         "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://stats.g.doubleclick.net https://googleads.g.doubleclick.net https://*.googleadservices.com https://www.google.com https://www.gstatic.com https://maps.googleapis.com https://www.facebook.com https://api.mymemory.translated.net https://challenges.cloudflare.com https://idealista.com https://*.idealista.com",
         // blob: para posibles web workers de librerías embebidas (mapas, captcha)
         "worker-src 'self' blob:",
         "frame-src https:",
         "media-src 'self' https:",
         "object-src 'none'",
         "base-uri 'self'",
         "form-action 'self'",
         "frame-ancestors 'self'",
       ].join("; "),
     },
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
     // Vídeos estáticos (p.ej. el reel de /como-trabajamos): por defecto Next
     // los sirve con max-age=0, así que se re-descargan en CADA reproducción.
     // Se cachean 30 días (URL estable; si se cambia el vídeo, renómbralo).
     {
       source: "/:path*.mp4",
       headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
     },
   ];
 },
};

export default nextConfig;
