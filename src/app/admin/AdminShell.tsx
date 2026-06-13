"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, FileText, RefreshCw, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true  },
  { href: "/admin/propiedades",  label: "Propiedades",  icon: Building2,       exact: false },
  { href: "/admin/blog",         label: "Blog",         icon: FileText,        exact: false },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res  = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMsg({ ok: true, text: `✓ ${data.added} añadidas · ${data.updated} actualizadas` });
        router.refresh();
      } else {
        setSyncMsg({ ok: false, text: data.error ?? "Error" });
      }
    } catch {
      setSyncMsg({ ok: false, text: "Error de conexión" });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 8000);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-5">
          {/* Logo */}
          <Link href="/admin" className="shrink-0">
            <img src="/logo.svg" alt="The Vila Home" className="h-7 w-auto" />
          </Link>

          <span className="text-[#222] shrink-0">|</span>

          {/* Nav links */}
          <nav className="flex items-center gap-0.5 flex-1">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors rounded-sm ${
                    active
                      ? "text-[#C9B99A] bg-[#C9B99A]/8"
                      : "text-[#555] hover:text-[#888] hover:bg-[#111]"
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3 shrink-0">
            {syncMsg && (
              <span className={`text-xs ${syncMsg.ok ? "text-[#C9B99A]" : "text-red-400"}`}>
                {syncMsg.text}
              </span>
            )}

            <button
              onClick={handleSync}
              disabled={syncing}
              title="Importar propiedades desde Inmovilla ahora"
              className="flex items-center gap-1.5 border border-[#222] text-[#555] hover:border-[#C9B99A]/50 hover:text-[#C9B99A] transition-colors text-xs px-3 py-1.5 disabled:opacity-40"
            >
              <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Sync…" : "Sync"}
            </button>

            <button
              onClick={handleLogout}
              className="text-[#444] hover:text-white transition-colors p-1.5"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────── */}
      {children}
    </div>
  );
}
