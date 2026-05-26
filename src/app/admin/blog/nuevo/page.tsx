import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PostForm from "../PostForm";

export const metadata = { title: "Nuevo artículo — Admin" };
export const dynamic = "force-dynamic";

export default async function NuevoPostPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("tvh_admin");
  if (session?.value !== "authenticated") {
    redirect("/admin/blog");
  }

  return <PostForm mode="nuevo" />;
}
