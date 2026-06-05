import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 serverExternalPackages: ["better-sqlite3", "sharp"],

 images: {
   formats: ["image/avif", "image/webp"],
   minimumCacheTTL: 86400,
   remotePatterns: [
     { protocol: "https", hostname: "**" },
     { protocol: "http",  hostname: "**" },
   ],
 },

 compress: true,

 async redirects() {
   return [
     {
       source: "/:path*",
       has: [{ type: "host", value: "thevilahome.com" }],
       destination: "https://www.thevilahome.com/:path*",
       permanent: true,
     },
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
