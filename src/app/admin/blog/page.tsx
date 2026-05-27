import { cookies } from "next/headers";
import { getAllBlogPostsAdmin } from "@/lib/blog";
import { LoginForm, AdminBlogList } from "./AdminBlogClient";

export const metadata = { title: "Admin · Blog — The Vila Home" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("tvh_admin");
  const isAuth = session?.value === "authenticated";

  if (!isAuth) {
    return <LoginForm />;
  }

  let posts: import("@/lib/blog").BlogPost[] = [];
  try {
    posts = await getAllBlogPostsAdmin();
  } catch {
    // store not ready
  }

  return <AdminBlogList initialPosts={posts} />;
}
