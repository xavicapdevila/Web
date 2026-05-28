import { getAllBlogPostsAdmin } from "@/lib/blog";
import { AdminBlogList } from "./AdminBlogClient";

export const metadata = { title: "Blog — Admin · The Vila Home" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  let posts: import("@/lib/blog").BlogPost[] = [];
  try {
    posts = await getAllBlogPostsAdmin();
  } catch {
    // store not ready
  }

  return <AdminBlogList initialPosts={posts} />;
}
