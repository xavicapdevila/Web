import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPostsAdmin, createBlogPost } from "@/lib/blog";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

function isAuthenticated(req: NextRequest): boolean {
  return verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const posts = await getAllBlogPostsAdmin();
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
    const post = await createBlogPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
