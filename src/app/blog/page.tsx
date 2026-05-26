import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BlogContent from "@/components/pages/BlogContent";

export const metadata: Metadata = {
  title: "Blog inmobiliario",
  description:
    "Artículos y guías sobre el mercado inmobiliario en Vilanova i la Geltrú y el Garraf: consejos para vender bien, guías para compradores, hipotecas y análisis de tendencias.",
  alternates: { canonical: "https://www.thevilahome.com/blog" },
  openGraph: {
    title: "Blog inmobiliario — The Vila Home",
    description: "Consejos, guías y análisis del mercado inmobiliario en Vilanova i la Geltrú.",
    url: "https://www.thevilahome.com/blog",
  },
};

export const dynamic = "force-dynamic";

export default function BlogPage() {
  let posts: import("@/lib/blog").BlogPost[] = [];
  try {
    const result = getBlogPosts(20, 0);
    posts = result.posts;
  } catch {
    // DB not ready
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <BlogContent posts={posts} />
    </div>
  );
}
