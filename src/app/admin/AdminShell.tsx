"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, FileText, RefreshCw,
  LogOut, Briefcase, Bell, X, AlertTriangle, RefreshCcw,
} from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true  },
  { href: "/admin/propiedades",  label: "Propiedades",  icon: Building2,       exact: false },
  { href: "/admin/operaciones",  label: "Operaciones",  icon: Briefcase,       exact: false },
  { href: "/admin/blog",         label: "Blog",         icon: FileText,        exact: false },
];

interface Pendiente {
  id: number;
  ref: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  created_at: string;
  op_estado: string | null;
}

const ACCIONES_SALIDA = [
  { key: "vendida_nosotros", label: "Vendida por nosotros",  desc: "Cerrar como vendida a través de The Vila Home.", color: "bg-emerald-600 hover:bg-emerald-500 text-white" },
  { key: "vendida_otros",    label: "Vendida por terceros",  desc: "La vendió otra agencia o el propietario directamente.", color: "bg-[#1a1a1a] hover:bg-[#222] text-[#888] border border-[#333]" },
  { key: "retirada",         label: "Retirada del mercado",  desc: "El propietario ha decidido no vender por ahora.", color: "bg-[#1a1a1a] hover:bg-[#222] text-[#888] border border-[#333]" },
  { key: "eliminar",         label: "Eliminar del sistema",  desc: "Borrar todos los datos permanentemente.", color: "bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-900/50" },
];

const ACCIONES_REAPARICION = [
  { key: "reactivar",       label: "Sí, reactivar → En venta", desc: "Actualizar el estado del CRM a En venta y empezar de nuevo.", color: "bg-emerald-600 hover:bg-emerald-500 text-white" },
  { key: "mantener_cerrada", label: "No, mantener cerrada",     desc: "Ignorar la reaparición y mantener el estado actual en el CRM.", color: "bg-[#1a1a1a] hover:bg-[#222] text-[#888] border border-[#333]" },
];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [syncing,  setSyncing]  = useState(false);
  const [syncMsg,  setSyncMsg]  = useState<{ ok: boolean; text: string } | null>(null);

  // ── Pendientes ───────────────────────────────────────────────────────────
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [showModal,  setShowModal]  = useState(false);
  const [resolving,  setResolving]  = useState<number | null>(null); // id being resolved
  const [activeCard, setActiveCard] = useState<number | null>(null); // which card is expanded
  const [resolveErr, setResolveErr] = useState<string | null>(null);

  const fetchPendientes = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/pendientes");
      const data = await res.json();
      if (res.ok) setPendientes(data.pendientes ?? []);
    } catch { /* non-fatal */ }
  }, []);

  // Load on mount and after sync
  useEffect(() => { fetchPendientes(); }, [fetchPendientes]);

  async function handleResolve(id: number, accion: string) {
    setResolving(id);
    setResolveErr(null);
    try {
      const res = await fetch(`/api/admin/pendientes/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ accion }),
      });
      if (res.ok) {
        setPendientes(prev => prev.filter(p => p.id !== id));
        setActiveCard(null);
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setResolveErr(data?.error ?? `Error al guardar (${res.status}). Inténtalo de nuevo.`);
      }
    } catch {
      setResolveErr("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setResolving(null);
    }
  }

  // ── Sync ─────────────────────────────────────────────────────────────────
  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res  = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMsg({ ok: true, text: `✓ ${data.added} añadidas · ${data.updated} actualizadas` });
        router.refresh();
        fetchPendientes(); // check for new alerts after sync
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

  const count = pendientes.length;

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

            {/* Notification bell */}
            <button
              onClick={() => setShowModal(true)}
              className="relative text-[#444] hover:text-white transition-colors p-1.5"
              title={count > 0 ? `${count} propiedades pendientes de revisión` : "Sin alertas"}
            >
              <Bell size={14} className={count > 0 ? "text-amber-400" : ""} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

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

      {/* ── Pendientes modal ─────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setActiveCard(null); } }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Panel */}
          <div className="relative bg-[#0a0a0a] border-l border-[#1a1a1a] h-full w-full max-w-lg flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-amber-400" />
                <div>
                  <h2 className="text-white text-sm">Propiedades pendientes de revisión</h2>
                  <p className="text-[#444] text-xs mt-0.5">
                    {count === 0
                      ? "Todo al día"
                      : `${count} propiedad${count === 1 ? "" : "es"} han salido del feed de Inmovilla`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); setActiveCard(null); }}
                className="text-[#444] hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <Bell size={24} className="text-[#222] mb-4" />
                  <p className="text-[#555] text-sm">Sin alertas pendientes</p>
                  <p className="text-[#333] text-xs mt-1">Cuando una propiedad desaparezca del feed de Inmovilla, aparecerá aquí para que decidas qué hacer.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#111]">
                  {pendientes.map(p => (
                    <div key={p.id} className="px-6 py-5">
                      {/* Property info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 ${
                          p.tipo === "reaparicion"
                            ? "bg-blue-400/10 border border-blue-400/20"
                            : "bg-amber-400/10 border border-amber-400/20"
                        }`}>
                          {p.tipo === "reaparicion"
                            ? <RefreshCcw size={14} className="text-blue-400" />
                            : <AlertTriangle size={14} className="text-amber-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm leading-tight">{p.titulo}</p>
                          <p className="text-[#555] text-xs mt-0.5 font-mono">REF {p.ref}</p>
                          <p className="text-[#333] text-xs mt-1">Detectado el {formatDate(p.created_at)}</p>
                        </div>
                        <Link
                          href={`/admin/operaciones/${p.ref}`}
                          className="text-[#333] hover:text-[#C9B99A] transition-colors text-xs shrink-0"
                          onClick={() => setShowModal(false)}
                          title="Ver ficha"
                        >
                          Ver ficha →
                        </Link>
                      </div>

                      {/* Action selector */}
                      {activeCard === p.id ? (
                        <div className="space-y-2">
                          {resolveErr && (
                            <p className="text-red-400 text-xs bg-red-900/20 border border-red-900/40 px-3 py-2">
                              {resolveErr}
                            </p>
                          )}
                          <p className="text-[#555] text-xs mb-3">
                            {p.tipo === "reaparicion"
                              ? "¿Quieres reactivar esta propiedad en el CRM?"
                              : "¿Qué ha pasado con esta propiedad?"}
                          </p>
                          {(p.tipo === "reaparicion" ? ACCIONES_REAPARICION : ACCIONES_SALIDA).map(a => (
                            <button
                              key={a.key}
                              onClick={() => handleResolve(p.id, a.key)}
                              disabled={resolving === p.id}
                              className={`w-full text-left px-3 py-2.5 text-xs transition-colors disabled:opacity-40 ${a.color}`}
                            >
                              <span className="font-medium block">{a.label}</span>
                              <span className="text-xs opacity-70">{a.desc}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => setActiveCard(null)}
                            className="text-[#333] hover:text-white text-xs transition-colors mt-1"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveCard(p.id)}
                          className={`w-full text-xs px-4 py-2.5 transition-colors text-left border ${
                            p.tipo === "reaparicion"
                              ? "bg-blue-400/10 hover:bg-blue-400/15 border-blue-400/20 text-blue-400"
                              : "bg-amber-400/10 hover:bg-amber-400/15 border-amber-400/20 text-amber-400"
                          }`}
                        >
                          {p.tipo === "reaparicion" ? "¿Reactivar en el CRM? →" : "Decidir qué hacer →"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ─────────────────────────────────────── */}
      {children}
    </div>
  );
}
