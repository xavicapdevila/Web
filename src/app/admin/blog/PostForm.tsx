"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff, X, CalendarDays, Tag, Upload, Loader2 } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/utils";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const CATEGORIAS = [
  "Mercado",
  "Procesos",
  "Documentación",
  "Hipotecas",
  "Impuestos",
  "Herencias",
  "Consejos",
  "Vivir en...",
];

interface Props {
  post?: BlogPost;
  mode: "nuevo" | "editar";
}

export default function PostForm({ post, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titulo: post?.titulo ?? "",
    slug: post?.slug ?? "",
    extracto: post?.extracto ?? "",
    contenido: post?.contenido ?? "",
    imagen: post?.imagen ?? "",
    imagenAlt: post?.imagenAlt ?? "",
    palabraClave: post?.palabraClave ?? "",
    categoria: post?.categoria ?? "",
    fecha: post?.fecha ?? new Date().toISOString().split("T")[0],
    etiquetas: post?.etiquetas.join(", ") ?? "",
    publicado: post?.publicado ?? true,
  });

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    const titulo = e.target.value;
    setForm((f) => ({
      ...f,
      titulo,
      slug: slugManual ? f.slug : slugify(titulo),
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManual(true);
    setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Imagen demasiado grande (máx. 10 MB)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Compress client-side first (max 1400px wide, 80% quality)
      const compressed = await compressImage(file, 0.80);
      const fd = new FormData();
      fd.append("file", compressed, file.name);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok && data.url) {
        setForm((f) => ({ ...f, imagen: data.url }));
      } else {
        setError(data.error ?? "Error al subir la imagen");
      }
    } catch {
      setError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  function compressImage(file: File, quality: number): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 1400;
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }

          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

          canvas.toBlob(
            (blob) => resolve(new File([blob!], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })),
            "image/jpeg",
            quality
          );
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo || !form.slug) {
      setError("El título y el slug son obligatorios");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      titulo: form.titulo,
      slug: form.slug,
      extracto: form.extracto || undefined,
      contenido: form.contenido || undefined,
      imagen: form.imagen || undefined,
      imagenAlt: form.imagenAlt || undefined,
      palabraClave: form.palabraClave || undefined,
      categoria: form.categoria || undefined,
      fecha: form.fecha,
      etiquetas: form.etiquetas
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publicado: form.publicado,
    };

    try {
      const url = mode === "nuevo" ? "/api/admin/blog" : `/api/admin/blog/${post!.id}`;
      const method = mode === "nuevo" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm outline-none focus:border-[#C9B99A] transition-colors placeholder-[#444]";
  const labelClass = "block text-[#888] text-xs font-body tracking-wide uppercase mb-2";

  const parsedEtiquetas = form.etiquetas.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#444] mb-2">
                <Link href="/admin/blog" className="hover:text-[#888] transition-colors">Blog</Link>
                <span>/</span>
                <span>{mode === "nuevo" ? "Nuevo artículo" : "Editar"}</span>
              </div>
              <h1 className="text-white font-display text-2xl">
                {mode === "nuevo" ? "Nuevo artículo" : `Editar: ${post?.titulo}`}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 text-[#C9B99A] hover:text-[#DDD0BB] transition-colors text-xs border border-[#C9B99A]/30 px-3 py-1.5"
              >
                <Eye size={13} />
                Vista previa
              </button>
              <Link
                href="/admin/blog"
                className="flex items-center gap-1.5 text-[#555] hover:text-white transition-colors text-xs"
              >
                <ArrowLeft size={13} />
                Volver
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Título */}
                <div>
                  <label className={labelClass}>Título *</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={handleTituloChange}
                    placeholder="Título del artículo"
                    className={fieldClass}
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className={labelClass}>
                    Slug (URL)
                    {slugManual && (
                      <button
                        type="button"
                        onClick={() => { setSlugManual(false); setForm((f) => ({ ...f, slug: slugify(f.titulo) })); }}
                        className="ml-2 text-[#C9B99A]/60 hover:text-[#C9B99A] text-xs normal-case tracking-normal"
                      >
                        ↺ Regenerar
                      </button>
                    )}
                  </label>
                  <div className="flex items-center">
                    <span className="bg-[#0d0d0d] border border-r-0 border-[#2a2a2a] text-[#444] px-3 py-3 text-xs font-mono whitespace-nowrap">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="slug-del-articulo"
                      className={`${fieldClass} font-mono`}
                      required
                    />
                  </div>
                  <p className="text-[#3a3a3a] text-xs mt-1.5 font-mono">
                    thevilahome.com/blog/{form.slug || "slug-del-articulo"}
                  </p>
                </div>

                {/* Extracto */}
                <div>
                  <label className={labelClass}>Extracto</label>
                  <textarea
                    value={form.extracto}
                    onChange={(e) => setForm((f) => ({ ...f, extracto: e.target.value }))}
                    placeholder="Resumen breve (aparece en el listado y como meta description)"
                    rows={3}
                    className={fieldClass}
                  />
                  {form.extracto && (
                    <p className={`text-xs mt-1 ${form.extracto.length > 160 ? "text-amber-400" : "text-[#444]"}`}>
                      {form.extracto.length}/160 caracteres para SEO óptimo
                    </p>
                  )}
                </div>

                {/* Contenido */}
                <div>
                  <label className={labelClass}>Contenido</label>
                  <RichTextEditor
                    value={form.contenido}
                    onChange={(html) => setForm((f) => ({ ...f, contenido: html }))}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Estado */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Estado</label>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, publicado: !f.publicado }))}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm border transition-colors ${
                      form.publicado
                        ? "border-[#C9B99A]/40 text-[#C9B99A] bg-[#C9B99A]/5"
                        : "border-[#2a2a2a] text-[#555]"
                    }`}
                  >
                    {form.publicado ? <><Eye size={14} /> Publicado</> : <><EyeOff size={14} /> Borrador</>}
                  </button>
                </div>

                {/* Fecha */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Fecha de publicación</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                    className={fieldClass}
                  />
                  {form.fecha && (
                    <p className="text-[#444] text-xs mt-1.5">{formatBlogDate(form.fecha)}</p>
                  )}
                </div>

                {/* Autor — locked */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Autor</label>
                  <div className="px-4 py-3 text-sm border border-[#1e1e1e] text-[#C9B99A] bg-[#111]">
                    The Vila Home
                  </div>
                  <p className="text-[#3a3a3a] text-xs mt-1.5">Fijo para todos los artículos</p>
                </div>

                {/* Categoría */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                    className={`${fieldClass} appearance-none`}
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-[#3a3a3a] text-xs mt-1.5">Aparece como badge en el artículo</p>
                </div>

                {/* Imagen */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Imagen destacada</label>

                  {/* Drop zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-sm text-center py-6 px-4 cursor-pointer transition-colors mb-3 ${
                      dragOver
                        ? "border-[#C9B99A]/60 bg-[#C9B99A]/5"
                        : "border-[#2a2a2a] hover:border-[#444]"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const f = e.dataTransfer.files[0];
                      if (f) handleImageUpload(f);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={20} className="text-[#C9B99A] animate-spin" />
                        <p className="text-[#666] text-xs">Subiendo imagen...</p>
                      </div>
                    ) : form.imagen ? (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={16} className="text-[#444]" />
                        <p className="text-[#555] text-xs">Arrastra otra imagen para reemplazar</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={20} className="text-[#444]" />
                        <p className="text-[#888] text-xs font-body">Arrastra o haz clic para subir</p>
                        <p className="text-[#444] text-xs">1280 × 640 px recomendado · JPG, PNG, WEBP · máx. 10 MB</p>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {form.imagen && !uploading && (
                    <div className="relative mb-3 group">
                      <img
                        src={form.imagen}
                        alt=""
                        className="w-full aspect-video object-cover border border-[#2a2a2a]"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, imagen: "" }))}
                        className="absolute top-2 right-2 bg-[#0a0a0a]/80 text-[#888] hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* URL manual fallback */}
                  <input
                    type="url"
                    value={form.imagen}
                    onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.value }))}
                    placeholder="O pega una URL directamente..."
                    className={`${fieldClass} text-xs text-[#666] placeholder-[#333]`}
                  />
                  <p className="text-[#3a3a3a] text-xs mt-1.5 mb-4">También se usa como og:image</p>

                  {/* Alt text */}
                  <label className={labelClass}>Texto alternativo (ALT)</label>
                  <input
                    type="text"
                    value={form.imagenAlt}
                    onChange={(e) => setForm((f) => ({ ...f, imagenAlt: e.target.value }))}
                    placeholder="Ej: Vista aérea del centro de Vilanova i la Geltrú"
                    className={fieldClass}
                  />
                  <p className="text-[#3a3a3a] text-xs mt-1.5">Describe la imagen para accesibilidad y SEO</p>
                </div>

                {/* Palabra clave objetivo */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Palabra clave objetivo</label>
                  <input
                    type="text"
                    value={form.palabraClave}
                    onChange={(e) => setForm((f) => ({ ...f, palabraClave: e.target.value }))}
                    placeholder="Ej: comprar piso Vilanova"
                    className={fieldClass}
                  />
                  <p className="text-[#3a3a3a] text-xs mt-1.5">
                    Keyword principal que quieres posicionar. Se añade al meta keywords del artículo.
                  </p>
                  {form.palabraClave && (
                    <div className="mt-3 space-y-1.5 text-[11px]">
                      {[
                        { label: "En el título", ok: form.titulo.toLowerCase().includes(form.palabraClave.toLowerCase()) },
                        { label: "En el extracto", ok: form.extracto.toLowerCase().includes(form.palabraClave.toLowerCase()) },
                        { label: "En el slug", ok: form.slug.includes(form.palabraClave.toLowerCase().replace(/\s+/g, "-")) },
                      ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className={ok ? "text-green-500" : "text-[#555]"}>{ok ? "✓" : "○"}</span>
                          <span className={ok ? "text-[#aaa]" : "text-[#444]"}>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Etiquetas */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                  <label className={labelClass}>Etiquetas</label>
                  <input
                    type="text"
                    value={form.etiquetas}
                    onChange={(e) => setForm((f) => ({ ...f, etiquetas: e.target.value }))}
                    placeholder="vender, mercado, hipoteca"
                    className={fieldClass}
                  />
                  <p className="text-[#3a3a3a] text-xs mt-1.5">Separadas por comas</p>
                  {parsedEtiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {parsedEtiquetas.map((tag) => (
                        <span key={tag} className="text-[#C9B99A] text-xs border border-[#C9B99A]/20 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-[#1a1a1a]">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#C9B99A] text-black font-body text-xs tracking-widest uppercase px-7 py-3 hover:bg-[#DDD0BB] transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                {loading ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 border border-[#2a2a2a] text-[#888] font-body text-xs tracking-widest uppercase px-5 py-3 hover:border-[#C9B99A] hover:text-white transition-colors"
              >
                <Eye size={14} />
                Vista previa
              </button>
              <Link
                href="/admin/blog"
                className="text-[#555] hover:text-white transition-colors text-sm ml-auto"
              >
                Cancelar
              </Link>
            </div>
          </form>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 z-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Close */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
                Vista previa
              </span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[#555] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Simulated article */}
            <article>
              {/* Category + tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {form.categoria && (
                  <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-3 py-1">
                    {form.categoria}
                  </span>
                )}
                {parsedEtiquetas.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[#C9B99A] text-xs font-body tracking-wide uppercase border border-[#C9B99A]/20 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl text-white font-light leading-tight mb-6">
                {form.titulo || <span className="text-[#444]">Sin título</span>}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-6 text-[#555] text-sm mb-8 pb-8 border-b border-[#1a1a1a]">
                <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
                  The Vila Home
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-[#C9B99A]" />
                  {formatBlogDate(form.fecha)}
                </span>
              </div>

              {/* Featured image */}
              {form.imagen && (
                <div className="relative aspect-video overflow-hidden mb-10 border border-[#1a1a1a]">
                  <img
                    src={form.imagen}
                    alt={form.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}

              {/* Extracto */}
              {form.extracto && (
                <p className="text-[#ccc] text-lg leading-relaxed mb-8 font-light italic border-l-2 border-[#C9B99A] pl-5">
                  {form.extracto}
                </p>
              )}

              {/* Content */}
              {form.contenido ? (
                <div className="space-y-5">
                  {form.contenido
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="text-[#aaa] leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>
              ) : (
                <p className="text-[#444] italic">Sin contenido todavía…</p>
              )}

              {/* Tags */}
              {parsedEtiquetas.length > 0 && (
                <div className="flex items-center gap-3 mt-10 pt-8 border-t border-[#1a1a1a]">
                  <Tag size={13} className="text-[#C9B99A] shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {parsedEtiquetas.map((tag) => (
                      <span key={tag} className="text-[#666] text-xs font-body border border-[#1e1e1e] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      )}
    </>
  );
}
