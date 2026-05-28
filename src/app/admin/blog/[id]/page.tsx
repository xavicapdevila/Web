import { notFound } from "next/navigation";
import { getBlogPostByIdAdmin } from "@/lib/blog";
import PostForm from "../PostForm";

export const metadata = { title: "Editar artículo — Admin" };
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarPostPage({ params }: Props) {
  const { id } = await params;
  let post;
  try {
    post = await getBlogPostByIdAdmin(id);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return <PostForm mode="editar" post={post} />;
}
