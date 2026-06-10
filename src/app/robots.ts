import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        // Block AI training crawlers that don't respect ads/commercial interest
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web", "Omgilibot"],
        disallow: "/",
      },
    ],
    sitemap: "https://www.thevilahome.com/sitemap.xml",
    host: "https://www.thevilahome.com",
  };
}
