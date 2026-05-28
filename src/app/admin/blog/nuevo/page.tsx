import PostForm from "../PostForm";

export const metadata = { title: "Nuevo artículo — Admin" };
export const dynamic = "force-dynamic";

export default function NuevoPostPage() {
  return <PostForm mode="nuevo" />;
}
