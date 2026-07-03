import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // GEO: los bots de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
      // están PERMITIDOS a propósito — queremos que ChatGPT/Claude/Perplexity/
      // Gemini lean y citen la web cuando alguien pregunte por inmobiliarias en
      // Vilanova i la Geltrú. No volver a bloquearlos sin decisión consciente.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://www.thevilahome.com/sitemap.xml",
    host: "https://www.thevilahome.com",
  };
}
