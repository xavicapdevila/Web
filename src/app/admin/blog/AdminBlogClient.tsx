"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Eye, EyeOff, LogOut, ArrowLeft, RefreshCw } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

// ── Login screen ─────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="The Vila Home" className="h-8 w-auto mx-auto mb-6" />
          <p className="text-[#666] text-sm">Panel de administración</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm outline-none focus:border-[#C9B99A] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9B99A] text-black font-body text-sm tracking-widest uppercase py-3 hover:bg-[#DDD0BB] transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Admin blog list ───────────────────────────────────────────────────────────

export function AdminBlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMsg({ ok: true, text: `✓ ${data.added} añadidas · ${data.updated} actualizadas` });
      } else {
        setSyncMsg({ ok: false, text: data.error ?? "Error al sincronizar" });
      }
    } catch {
      setSyncMsg({ ok: false, text: "Error de conexión" });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 6000);
    }
  }

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar");
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleTogglePublish(post: BlogPost) {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: !post.publicado }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, publicado: !p.publicado } : p))
        );
      }
    } catch {
      alert("Error al actualizar");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Top bar */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="The Vila Home" className="h-7 w-auto" />
            <span className="text-[#444] text-xs">/</span>
            <span className="text-[#888] text-sm">Blog</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="text-[#555] hover:text-[#C9B99A] transition-colors text-xs flex items-center gap-1.5"
            >
              Ver blog público
            </Link>
            <div className="flex items-center gap-1.5">
              {syncMsg && (
                <span className={`text-xs ${syncMsg.ok ? "text-[#C9B99A]" : "text-red-400"}`}>
                  {syncMsg.text}
                </span>
              )}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-1.5 text-[#555] hover:text-[#C9B99A] transition-colors text-xs disabled:opacity-50 px-2 py-1 border border-[#1a1a1a] hover:border-[#C9B99A]/40"
                title="Sincronizar propiedades desde Inmovilla"
              >
                <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                {syncing ? "Sync..." : "Sync"}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#555] hover:text-white transition-colors p-1.5"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-display text-2xl">Artículos</h1>
            <p className="text-[#555] text-sm mt-1">{posts.length} artículos en total</p>
          </div>
          <Link
            href="/admin/blog/nuevo"
            className="flex items-center gap-2 bg-[#C9B99A] text-black font-body text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#DDD0BB] transition-colors"
          >
            <Plus size={14} />
            Nuevo artículo
          </Link>
        </div>

        {/* Table */}
        {posts.length === 0 ? (
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] py-20 text-center">
            <p className="text-[#444] text-sm mb-4">No hay artículos todavía</p>
            <Link
              href="/admin/blog/nuevo"
              className="text-[#C9B99A] text-sm hover:underline"
            >
              Crear el primero
            </Link>
          </div>
        ) : (
          <div className="border border-[#1a1a1a] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                  <th className="text-left text-[#555] font-body text-xs tracking-wide uppercase px-5 py-3">
                    Título
                  </th>
                  <th className="text-left text-[#555] font-body text-xs tracking-wide uppercase px-4 py-3 hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="text-left text-[#555] font-body text-xs tracking-wide uppercase px-4 py-3 hidden lg:table-cell">
                    Fecha
                  </th>
                  <th className="text-left text-[#555] font-body text-xs tracking-wide uppercase px-4 py-3">
                    Estado
                  </th>
                  <th className="px-4 py-3 w-28" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-[#111] hover:bg-[#0d0d0d] transition-colors ${
                      i === posts.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white leading-snug line-clamp-1">{post.titulo}</p>
                        <p className="text-[#444] text-xs mt-0.5 font-mono">/blog/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {post.categoria ? (
                        <span className="text-black bg-[#C9B99A] text-xs font-body tracking-wide uppercase px-2 py-0.5">
                          {post.categoria}
                        </span>
                      ) : (
                        <span className="text-[#333] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[#666] hidden lg:table-cell font-mono text-xs">
                      {post.fecha.split("-").reverse().join("/")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors ${
                          post.publicado
                            ? "border-[#C9B99A]/40 text-[#C9B99A] hover:bg-[#C9B99A]/10"
                            : "border-[#2a2a2a] text-[#555] hover:border-[#555]"
                        }`}
                        title={post.publicado ? "Despublicar" : "Publicar"}
                      >
                        {post.publicado ? (
                          <>
                            <Eye size={11} /> Publicado
                          </>
                        ) : (
                          <>
                            <EyeOff size={11} /> Borrador
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 text-[#555] hover:text-[#C9B99A] transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.titulo)}
                          disabled={deleting === post.id}
                          className="p-1.5 text-[#555] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
