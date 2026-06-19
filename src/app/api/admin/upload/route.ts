import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
    }

    // Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagen demasiado grande (máx. 10 MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    // Use timestamp in ms + random suffix to guarantee unique filenames
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const blobName = `blog/${uid}-${safeName}.${ext}`;

    const blob = await put(blobName, file, {
      access: "public",
      contentType: file.type,
      allowOverwrite: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
