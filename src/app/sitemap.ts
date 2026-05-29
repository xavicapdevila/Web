import type { MetadataRoute } from "next";
import { getCachedSlugs } from "@/lib/sync";
import { getBlogPosts } from "@/lib/blog";

// Force dynamic so sitemap reflects new blog posts and properties without a redeploy
export const dynamic = "force-dynamic";

const BASE_URL = "https://www.thevilahome.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), priority: 1,   changeFrequency: "weekly"  },
    { url: `${BASE_URL}/propiedades`,          lastModified: new Date(), priority: 0.9, changeFrequency: "daily"   },
    { url: `${BASE_URL}/valoracion`,           lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/blog`,                 lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/quienes-somos`,        lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contacto`,             lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
  ];

  const safeDate = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  try {
    const slugs = await getCachedSlugs();
    for (const { slug, fecha } of slugs) {
      routes.push({
        url: `${BASE_URL}/propiedades/${slug}`,
        lastModified: safeDate(fecha),
        priority: 0.8,
        changeFrequency: "weekly",
      });
    }
  } catch {
    // XML cache not ready
  }

  try {
    const { posts } = await getBlogPosts(100, 0);
    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: safeDate(post.fecha),
        priority: 0.7,
        changeFrequency: "weekly",
      });
    }
  } catch {
    // DB not ready
  }

  return routes;
}
