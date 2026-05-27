import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("tvh_admin");
  if (session?.value !== "authenticated") {
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

    const timestamp = new Date().toISOString().slice(0, 10);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

    const blobName = `blog/${timestamp}-${safeName}.${ext}`;

    const blob = await put(blobName, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
