"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, LogOut, FileText, Home, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface SyncLog {
  synced_at: string;
  properties_added: number;
  properties_updated: number;
  properties_removed: number;
  status: string;
  source: string;
}

interface Stats {
  total: number;
  venta: number;
  alquiler: number;
  lastSync?: SyncLog;
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate.includes("T") ? isoDate : isoDate.replace(" ", "T") + "Z");
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD}d`;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    ok: boolean;
    msg: string;
    added?: number;
    updated?: number;
    unchanged?: number;
    source?: string;
  } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({
          ok: true,
          msg: "Sincronización completada",
          added: data.added,
          updated: data.updated,
          unchanged: data.unchanged,
          source: data.source,
        });
        router.refresh();
      } else {
        setSyncResult({ ok: false, msg: data.error ?? "Error desconocido" });
      }
    } catch {
      setSyncResult({ ok: false, msg: "Error de conexión" });
    } finally {
      setSyncing(false);
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
            <span className="text-[#888] text-sm">Panel</span>
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-white font-display text-2xl mb-1">Panel de administración</h1>
        <p className="text-[#555] text-sm mb-10">The Vila Home</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-6 py-5">
            <p className="text-[#555] text-xs tracking-widest uppercase font-body mb-2">Propiedades activas</p>
            <p className="text-white text-3xl font-display">{stats.total}</p>
          </div>
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-6 py-5">
            <p className="text-[#555] text-xs tracking-widest uppercase font-body mb-2">En venta</p>
            <p className="text-white text-3xl font-display">{stats.venta}</p>
          </div>
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-6 py-5">
            <p className="text-[#555] text-xs tracking-widest uppercase font-body mb-2">En alquiler</p>
            <p className="text-white text-3xl font-display">{stats.alquiler}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sync card */}
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-white text-base font-display mb-1">Sincronización</h2>
                <p className="text-[#555] text-xs leading-relaxed">
                  Importa las propiedades actualizadas desde Inmovilla al instante, sin esperar al cron horario.
                </p>
              </div>
              <RefreshCw size={18} className="text-[#333] mt-0.5 shrink-0 ml-4" />
            </div>

            {/* Last sync info */}
            {stats.lastSync && (
              <div className="flex items-center gap-2 mb-5 text-xs text-[#555]">
                <Clock size={11} />
                <span>
                  Última sync:{" "}
                  <span className="text-[#777]">
                    {formatRelativeTime(stats.lastSync.synced_at)}
                  </span>
                  {stats.lastSync.source && (
                    <span className="ml-2 px-1.5 py-0.5 bg-[#111] border border-[#222] text-[#444] uppercase tracking-wide">
                      {stats.lastSync.source}
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Result feedback */}
            {syncResult && (
              <div
                className={`flex items-start gap-2.5 mb-5 text-xs p-3 border ${
                  syncResult.ok
                    ? "border-[#C9B99A]/30 text-[#C9B99A] bg-[#C9B99A]/5"
                    : "border-red-500/30 text-red-400 bg-red-500/5"
                }`}
              >
                {syncResult.ok ? (
                  <CheckCircle size={13} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={13} className="mt-0.5 shrink-0" />
                )}
                <div>
                  <p>{syncResult.msg}</p>
                  {syncResult.ok && (
                    <p className="text-[#888] mt-0.5">
                      {syncResult.added} añadidas · {syncResult.updated} actualizadas
                      {syncResult.unchanged !== undefined && ` · ${syncResult.unchanged} sin cambios`}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full flex items-center justify-center gap-2 bg-[#C9B99A] text-black font-body text-xs tracking-widest uppercase py-3 hover:bg-[#DDD0BB] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Sincronizando..." : "Forzar sincronización"}
            </button>
          </div>

          {/* Blog card */}
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-white text-base font-display mb-1">Blog</h2>
                <p className="text-[#555] text-xs leading-relaxed">
                  Gestiona los artículos del blog: crear, editar, publicar o archivar entradas.
                </p>
              </div>
              <FileText size={18} className="text-[#333] mt-0.5 shrink-0 ml-4" />
            </div>
            <Link
              href="/admin/blog"
              className="w-full flex items-center justify-center gap-2 border border-[#2a2a2a] text-[#888] font-body text-xs tracking-widest uppercase py-3 hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
            >
              <FileText size={13} />
              Gestionar blog
            </Link>
          </div>

        </div>

        {/* Quick links */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/propiedades"
            target="_blank"
            className="flex items-center gap-1.5 text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
          >
            <Home size={12} />
            Ver propiedades públicas
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
          >
            <FileText size={12} />
            Ver blog público
          </Link>
        </div>
      </div>
    </div>
  );
}
