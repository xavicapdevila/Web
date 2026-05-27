import type { MetadataRoute } from "next";
import { getAllPropertySlugs } from "@/lib/sync";
import { getBlogPosts } from "@/lib/blog";

const BASE_URL = "https://www.thevilahome.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), priority: 1,   changeFrequency: "weekly"  },
    { url: `${BASE_URL}/propiedades`,          lastModified: new Date(), priority: 0.9, changeFrequency: "daily"   },
    { url: `${BASE_URL}/valoracion`,           lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/blog`,                 lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/quienes-somos`,        lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contacto`,             lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
  ];

  try {
    const slugs = getAllPropertySlugs();
    for (const { slug, fecha } of slugs) {
      routes.push({
        url: `${BASE_URL}/propiedades/${slug}`,
        lastModified: new Date(fecha),
        priority: 0.8,
        changeFrequency: "weekly",
      });
    }
  } catch {
    // DB not ready
  }

  try {
    const { posts } = getBlogPosts(100, 0);
    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.fecha),
        priority: 0.7,
        changeFrequency: "weekly",
      });
    }
  } catch {
    // DB not ready
  }

  return routes;
}
