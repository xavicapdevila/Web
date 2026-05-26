import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllBlogPostsAdmin, createBlogPost } from "@/lib/blog";

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("tvh_admin");
  return cookie?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const posts = getAllBlogPostsAdmin();
    return NextResponse.json({ posts });
  } catch (e) {
    return NextResponse.json({ error: "Error al obtener posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const post = createBlogPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
