import type { MetadataRoute } from "next";
import { getCachedSlugs } from "@/lib/sync";
import { getBlogPosts } from "@/lib/blog";

// Revalidate every 6 hours so the sitemap reflects new content without a full redeploy
export const revalidate = 21600;

const BASE_URL = "https://www.thevilahome.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                        lastModified: new Date(), priority: 1,   changeFrequency: "weekly"  },
    { url: `${BASE_URL}/propiedades`,                       lastModified: new Date(), priority: 0.9, changeFrequency: "daily"   },
    { url: `${BASE_URL}/valoracion`,                        lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/vender`,                            lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/blog`,                              lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/quienes-somos`,                     lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contacto`,                          lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/zona/vilanova`,                     lastModified: new Date(), priority: 0.8, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/sitges`,                       lastModified: new Date(), priority: 0.8, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/cubelles`,                     lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/sant-pere-de-ribes`,           lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/cunit`,                        lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/vilafranca`,                   lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/olivella`,                     lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/canyelles`,                    lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/calafell`,                     lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/el-vendrell`,                  lastModified: new Date(), priority: 0.7, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/zona/sant-sadurni-d-anoia`,         lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/comprar-casa-vilanova-i-la-geltru`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/pisos-en-venta-vilanova-i-la-geltru`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog/categoria/mercado`,            lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/hipotecas`,          lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/procesos`,           lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/documentacion`,      lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/impuestos`,          lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/herencias`,          lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/consejos`,           lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/blog/categoria/vivir-en`,           lastModified: new Date(), priority: 0.6, changeFrequency: "weekly"  },
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
        priority: 0.9,
        changeFrequency: "weekly",
      });
    }
  } catch (err) {
    // XML cache not ready — log it: a silent failure here hides property URLs from Google
    console.error("[sitemap] property slugs unavailable:", err);
  }

  try {
    const { posts } = await getBlogPosts(1000, 0);
    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: safeDate(post.fecha),
        priority: 0.7,
        changeFrequency: "weekly",
      });
    }
  } catch (err) {
    // DB not ready — log it: a silent failure here hides blog URLs from Google
    console.error("[sitemap] blog posts unavailable:", err);
  }

  return routes;
}
