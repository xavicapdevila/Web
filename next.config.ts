import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native Node.js addons (.node files) cannot be bundled by webpack/Turbopack.
  // Marking them as external so Vercel loads them from node_modules at runtime.
  serverExternalPackages: ["better-sqlite3", "sharp"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
