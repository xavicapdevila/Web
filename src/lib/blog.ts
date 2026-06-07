import { getDb } from "./db";

export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto?: string;
  contenido?: string;
  imagen?: string;
  imagenAlt?: string;
  palabraClave?: string;
  autor: string;
  categoria: string;
  fecha: string;
  etiquetas: string[];
  publicado: boolean;
}

export interface BlogPostInput {
  titulo: string;
  slug: string;
  extracto?: string;
  contenido?: string;
  imagen?: string;
  imagenAlt?: string;
  palabraClave?: string;
  categoria?: string;
  fecha: string;
  etiquetas?: string[];
  publicado?: boolean;
}

// ── SQLite row mapper (local dev) ─────────────────────────────────────────────

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    titulo: String(row.titulo),
    extracto: row.extracto ? String(row.extracto) : undefined,
    contenido: row.contenido ? String(row.contenido) : undefined,
    imagen: row.imagen ? String(row.imagen) : undefined,
    imagenAlt: row.imagen_alt ? String(row.imagen_alt) : undefined,
    palabraClave: row.palabra_clave ? String(row.palabra_clave) : undefined,
    autor: "The Vila Home",
    categoria: row.categoria ? String(row.categoria) : "",
    fecha: String(row.fecha),
    etiquetas: JSON.parse(String(row.etiquetas ?? "[]")),
    publicado: Boolean(row.publicado),
  };
}

// ── Vercel Blob persistence (production) ──────────────────────────────────────
//
// Vercel serverless runs each request in an isolated Lambda container.
// The /tmp filesystem is NOT shared between containers, so SQLite data
// written by the admin would not be visible to containers serving the public blog.
//
// Solution: use Vercel Blob as a shared JSON store. All writes go to Blob;
// all reads fetch from Blob. SQLite is used only in local development.

const USE_BLOB = process.env.VERCEL === "1";
const BLOB_KEY = "blog-posts.json";

async function readBlobPosts(): Promise<BlogPost[]> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];

    // Most recently uploaded wins (del+put cycle may leave brief overlap)
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

async function writeBlobPosts(posts: BlogPost[]): Promise<void> {
  const { put, list, del } = await import("@vercel/blob");

  // Delete existing blobs at this key before writing the new one
  const { blobs } = await list({ prefix: BLOB_KEY });
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url));
  }

  await put(BLOB_KEY, JSON.stringify(posts), {
    access: "public",
    contentType: "application/json",
  });
}

// ── Public read functions ─────────────────────────────────────────────────────

export async function getBlogPosts(
  limit = 10,
  offset = 0,
  categoria?: string
): Promise<{ posts: BlogPost[]; total: number }> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    const published = all
      .filter((p) => p.publicado && (!categoria || p.categoria === categoria))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return { posts: published.slice(offset, offset + limit), total: published.length };
  }

  // Local dev — SQLite
  const db = getDb();
  const catClause = categoria ? "AND categoria = ?" : "";
  const countArgs = categoria ? [categoria] : [];
  const total = (
    db.prepare(`SELECT COUNT(*) as c FROM blog_posts WHERE publicado = 1 ${catClause}`).get(...countArgs) as { c: number }
  ).c;
  const rows = db
    .prepare(`SELECT * FROM blog_posts WHERE publicado = 1 ${catClause} ORDER BY fecha DESC LIMIT ? OFFSET ?`)
    .all(...countArgs, limit, offset) as Record<string, unknown>[];
  return { posts: rows.map(rowToPost), total };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    return all.find((p) => p.slug === slug && p.publicado) ?? null;
  }

  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND publicado = 1")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToPost(row) : null;
}

export async function getRelatedPosts(
  currentSlug: string,
  etiquetas: string[],
  categoria: string,
  limit = 3
): Promise<BlogPost[]> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    return all
      .filter((p) => p.publicado && p.slug !== currentSlug)
      .sort((a, b) => {
        const scoreDiff = (b.categoria === categoria ? 1 : 0) - (a.categoria === categoria ? 1 : 0);
        return scoreDiff !== 0
          ? scoreDiff
          : new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      })
      .slice(0, limit);
  }

  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM blog_posts WHERE publicado = 1 AND slug != ? ORDER BY CASE WHEN categoria = ? THEN 0 ELSE 1 END, fecha DESC LIMIT ?"
    )
    .all(currentSlug, categoria || "__none__", limit) as Record<string, unknown>[];
  return rows.map(rowToPost);
}

// ── Admin CRUD functions ──────────────────────────────────────────────────────

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    return [...all].sort(
      (a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime() || b.id.localeCompare(a.id)
    );
  }

  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM blog_posts ORDER BY fecha DESC, created_at DESC")
    .all() as Record<string, unknown>[];
  return rows.map(rowToPost);
}

export async function getBlogPostByIdAdmin(id: string): Promise<BlogPost | null> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    return all.find((p) => p.id === id) ?? null;
  }

  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToPost(row) : null;
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const id = `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const newPost: BlogPost = {
    id,
    slug: input.slug,
    titulo: input.titulo,
    extracto: input.extracto,
    contenido: input.contenido,
    imagen: input.imagen,
    imagenAlt: input.imagenAlt,
    palabraClave: input.palabraClave,
    autor: "The Vila Home",
    categoria: input.categoria ?? "",
    fecha: input.fecha,
    etiquetas: input.etiquetas ?? [],
    publicado: input.publicado ?? true,
  };

  if (USE_BLOB) {
    const all = await readBlobPosts();
    all.push(newPost);
    await writeBlobPosts(all);
    return newPost;
  }

  // Local dev — SQLite
  const db = getDb();
  db.prepare(`
    INSERT INTO blog_posts (id, slug, titulo, extracto, contenido, imagen, imagen_alt, palabra_clave, autor, categoria, fecha, etiquetas, publicado)
    VALUES (@id, @slug, @titulo, @extracto, @contenido, @imagen, @imagen_alt, @palabra_clave, @autor, @categoria, @fecha, @etiquetas, @publicado)
  `).run({
    id,
    slug: input.slug,
    titulo: input.titulo,
    extracto: input.extracto ?? null,
    contenido: input.contenido ?? null,
    imagen: input.imagen ?? null,
    imagen_alt: input.imagenAlt ?? null,
    palabra_clave: input.palabraClave ?? null,
    autor: "The Vila Home",
    categoria: input.categoria ?? "",
    fecha: input.fecha,
    etiquetas: JSON.stringify(input.etiquetas ?? []),
    publicado: (input.publicado ?? true) ? 1 : 0,
  });
  return newPost;
}

export async function updateBlogPost(
  id: string,
  input: Partial<BlogPostInput>
): Promise<BlogPost | null> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const existing = all[idx];
    const updated: BlogPost = {
      ...existing,
      slug: input.slug ?? existing.slug,
      titulo: input.titulo ?? existing.titulo,
      extracto: input.extracto !== undefined ? input.extracto : existing.extracto,
      contenido: input.contenido !== undefined ? input.contenido : existing.contenido,
      imagen: input.imagen !== undefined ? input.imagen : existing.imagen,
      imagenAlt: input.imagenAlt !== undefined ? input.imagenAlt : existing.imagenAlt,
      palabraClave: input.palabraClave !== undefined ? input.palabraClave : existing.palabraClave,
      categoria: input.categoria ?? existing.categoria,
      fecha: input.fecha ?? existing.fecha,
      etiquetas: input.etiquetas ?? existing.etiquetas,
      publicado: input.publicado !== undefined ? input.publicado : existing.publicado,
    };

    all[idx] = updated;
    await writeBlobPosts(all);
    return updated;
  }

  // Local dev — SQLite
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;

  const existing = rowToPost(row);
  db.prepare(`
    UPDATE blog_posts SET
      slug = @slug, titulo = @titulo, extracto = @extracto, contenido = @contenido,
      imagen = @imagen, imagen_alt = @imagen_alt, palabra_clave = @palabra_clave,
      autor = @autor, categoria = @categoria, fecha = @fecha,
      etiquetas = @etiquetas, publicado = @publicado
    WHERE id = @id
  `).run({
    id,
    slug: input.slug ?? existing.slug,
    titulo: input.titulo ?? existing.titulo,
    extracto: input.extracto ?? existing.extracto ?? null,
    contenido: input.contenido ?? existing.contenido ?? null,
    imagen: input.imagen ?? existing.imagen ?? null,
    imagen_alt: input.imagenAlt ?? existing.imagenAlt ?? null,
    palabra_clave: input.palabraClave ?? existing.palabraClave ?? null,
    autor: "The Vila Home",
    categoria: input.categoria ?? existing.categoria ?? "",
    fecha: input.fecha ?? existing.fecha,
    etiquetas: JSON.stringify(input.etiquetas ?? existing.etiquetas),
    publicado: (input.publicado !== undefined ? input.publicado : existing.publicado) ? 1 : 0,
  });
  return getBlogPostByIdAdmin(id);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (USE_BLOB) {
    const all = await readBlobPosts();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await writeBlobPosts(all);
    return true;
  }

  const db = getDb();
  const result = db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  return result.changes > 0;
}
