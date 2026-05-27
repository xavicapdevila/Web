import { getDb } from "./db";

export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto?: string;
  contenido?: string;
  imagen?: string;
  imagenAlt?: string;
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
  categoria?: string;
  fecha: string;
  etiquetas?: string[];
  publicado?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    titulo: String(row.titulo),
    extracto: row.extracto ? String(row.extracto) : undefined,
    contenido: row.contenido ? String(row.contenido) : undefined,
    imagen: row.imagen ? String(row.imagen) : undefined,
    imagenAlt: row.imagen_alt ? String(row.imagen_alt) : undefined,
    autor: "The Vila Home", // always fixed
    categoria: row.categoria ? String(row.categoria) : "",
    fecha: String(row.fecha),
    etiquetas: JSON.parse(String(row.etiquetas ?? "[]")),
    publicado: Boolean(row.publicado),
  };
}

// ── Public read functions ──────────────────────────────────────────────────

export function getBlogPosts(limit = 10, offset = 0): { posts: BlogPost[]; total: number } {
  const db = getDb();

  const total = (
    db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE publicado = 1").get() as { c: number }
  ).c;

  const rows = db
    .prepare("SELECT * FROM blog_posts WHERE publicado = 1 ORDER BY fecha DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];

  return { posts: rows.map(rowToPost), total };
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND publicado = 1")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToPost(row) : null;
}

/** Returns up to `limit` published posts related by categoria or etiquetas, excluding current slug */
export function getRelatedPosts(currentSlug: string, etiquetas: string[], categoria: string, limit = 3): BlogPost[] {
  const db = getDb();

  // Prefer posts from same category, then posts sharing tags
  const rows = db
    .prepare(
      "SELECT * FROM blog_posts WHERE publicado = 1 AND slug != ? ORDER BY CASE WHEN categoria = ? THEN 0 ELSE 1 END, fecha DESC LIMIT ?"
    )
    .all(currentSlug, categoria || "__none__", limit) as Record<string, unknown>[];

  return rows.map(rowToPost);
}

// ── Admin CRUD functions ───────────────────────────────────────────────────

export function getAllBlogPostsAdmin(): BlogPost[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM blog_posts ORDER BY fecha DESC, created_at DESC")
    .all() as Record<string, unknown>[];
  return rows.map(rowToPost);
}

export function getBlogPostByIdAdmin(id: string): BlogPost | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToPost(row) : null;
}

export function createBlogPost(input: BlogPostInput): BlogPost {
  const db = getDb();
  const id = `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  db.prepare(`
    INSERT INTO blog_posts (id, slug, titulo, extracto, contenido, imagen, imagen_alt, autor, categoria, fecha, etiquetas, publicado)
    VALUES (@id, @slug, @titulo, @extracto, @contenido, @imagen, @imagen_alt, @autor, @categoria, @fecha, @etiquetas, @publicado)
  `).run({
    id,
    slug: input.slug,
    titulo: input.titulo,
    extracto: input.extracto ?? null,
    contenido: input.contenido ?? null,
    imagen: input.imagen ?? null,
    imagen_alt: input.imagenAlt ?? null,
    autor: "The Vila Home",
    categoria: input.categoria ?? "",
    fecha: input.fecha,
    etiquetas: JSON.stringify(input.etiquetas ?? []),
    publicado: (input.publicado ?? true) ? 1 : 0,
  });
  return getBlogPostByIdAdmin(id)!;
}

export function updateBlogPost(id: string, input: Partial<BlogPostInput>): BlogPost | null {
  const db = getDb();
  const existing = getBlogPostByIdAdmin(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE blog_posts SET
      slug = @slug,
      titulo = @titulo,
      extracto = @extracto,
      contenido = @contenido,
      imagen = @imagen,
      imagen_alt = @imagen_alt,
      autor = @autor,
      categoria = @categoria,
      fecha = @fecha,
      etiquetas = @etiquetas,
      publicado = @publicado
    WHERE id = @id
  `).run({
    id,
    slug: input.slug ?? existing.slug,
    titulo: input.titulo ?? existing.titulo,
    extracto: input.extracto ?? existing.extracto ?? null,
    contenido: input.contenido ?? existing.contenido ?? null,
    imagen: input.imagen ?? existing.imagen ?? null,
    imagen_alt: input.imagenAlt ?? existing.imagenAlt ?? null,
    autor: "The Vila Home",
    categoria: input.categoria ?? existing.categoria ?? "",
    fecha: input.fecha ?? existing.fecha,
    etiquetas: JSON.stringify(input.etiquetas ?? existing.etiquetas),
    publicado: ((input.publicado !== undefined ? input.publicado : existing.publicado)) ? 1 : 0,
  });
  return getBlogPostByIdAdmin(id);
}

export function deleteBlogPost(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  return result.changes > 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function seedSamplePosts(_db: ReturnType<typeof getDb>) {
  // Sample posts removed — create real content via /admin/blog
}
