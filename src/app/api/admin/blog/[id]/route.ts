import { NextRequest, NextResponse } from "next/server";
import { getBlogPostByIdAdmin, updateBlogPost, deleteBlogPost } from "@/lib/blog";

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("tvh_admin");
  return cookie?.value === "authenticated";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const post = getBlogPostByIdAdmin(id);
  if (!post) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const post = updateBlogPost(id, body);
    if (!post) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteBlogPost(id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
