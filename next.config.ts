import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native Node.js addons (.node files) cannot be bundled by webpack/Turbopack.
  // Marking them as external so Vercel loads them from node_modules at runtime.
  serverExternalPackages: ["better-sqlite3", "sharp"],

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // Cache optimised images for 24 h on CDN
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },

  // Compress responses
  compress: true,

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "https://www.thevilahome.com" }],
      },
    ];
  },
};

export default nextConfig;
