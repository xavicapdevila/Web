"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, Home, RefreshCw, Building2 } from "lucide-react";
import type { PropRow } from "./page";

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function tipoLabel(tipo: string, subtipo: string | null) {
  const labels: Record<string, string> = {
    piso: "Piso", casa: "Casa", local: "Local", oficina: "Oficina",
    terreno: "Terreno", garaje: "Garaje", trastero: "Trastero",
  };
  const base = labels[tipo] ?? tipo;
  if (subtipo) return `${base} · ${subtipo}`;
  return base;
}

const STATUS_TABS = [
  { key: "active",   label: "Activas"    },
  { key: "archived", label: "Archivadas" },
];

const OP_TABS = [
  { key: "all",      label: "Todas"    },
  { key: "venta",    label: "Venta"    },
  { key: "alquiler", label: "Alquiler" },
];

const SOLD_LABEL: Record<string, string> = {
  tvh:    "TVH",
  others: "Otros",
};

export default function PropertiesClient({ rows }: { rows: PropRow[] }) {
  const router = useRouter();
  const [statusTab, setStatusTab] = useState("active");
  const [opTab,     setOpTab]     = useState("all");
  const [search,    setSearch]    = useState("");
  const [syncing,   setSyncing]   = useState(false);
  const [syncErr,   setSyncErr]   = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncErr("");
    try {
      const res  = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        router.refresh();
      } else {
        setSyncErr(data.error ?? "Error al sincronizar");
      }
    } catch {
      setSyncErr("Error de conexión");
    } finally {
      setSyncing(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (r.admin_status !== statusTab) return false;
      if (opTab !== "all" && r.operacion !== opTab) return false;
      if (q && !r.ref.toLowerCase().includes(q) &&
               !r.titulo.toLowerCase().includes(q) &&
               !(r.ciudad ?? "").toLowerCase().includes(q) &&
               !(r.agente ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, statusTab, opTab, search]);

  const activeCount   = rows.filter(r => r.admin_status === "active").length;
  const archivedCount = rows.filter(r => r.admin_status === "archived").length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-2xl mb-1">Propiedades</h1>
          <p className="text-[#444] text-xs">
            {activeCount} activas · {archivedCount} archivadas · sincronizadas desde Inmovilla
          </p>
        </div>
        <div className="flex items-center gap-3">
          {syncErr && <span className="text-red-400 text-xs">{syncErr}</span>}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 border border-[#222] text-[#555] hover:border-[#C9B99A]/50 hover:text-[#C9B99A] transition-colors text-xs px-3 py-1.5 disabled:opacity-40"
          >
            <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sync…" : "Sync ahora"}
          </button>
          <Link
            href="/propiedades"
            target="_blank"
            className="flex items-center gap-1.5 text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
          >
            <ExternalLink size={11} /> Web pública
          </Link>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-6 border-b border-[#1a1a1a] mb-5">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setStatusTab(t.key)}
            className={`pb-2.5 text-xs transition-colors border-b-2 -mb-px ${
              statusTab === t.key
                ? "border-[#C9B99A] text-[#C9B99A]"
                : "border-transparent text-[#555] hover:text-[#888]"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[#444]">
              {t.key === "active" ? activeCount : archivedCount}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center border border-[#1a1a1a]">
          {OP_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setOpTab(t.key)}
              className={`px-4 py-1.5 text-xs transition-colors ${
                opTab === t.key
                  ? "bg-[#C9B99A] text-black font-body"
                  : "text-[#555] hover:text-[#888] bg-[#0d0d0d]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ref, título, ciudad, agente…"
            className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white text-xs pl-8 pr-4 py-1.5 outline-none focus:border-[#C9B99A]/40 transition-colors placeholder-[#333]"
          />
        </div>

        <span className="text-[#333] text-xs ml-auto">{filtered.length} resultados</span>
      </div>

      {/* Empty states */}
      {rows.length === 0 ? (
        <div className="border border-[#1a1a1a] bg-[#0d0d0d] py-20 text-center">
          <Building2 size={20} className="text-[#333] mx-auto mb-4" />
          <p className="text-white text-sm mb-1">Base de datos vacía</p>
          <p className="text-[#555] text-xs mb-6 max-w-xs mx-auto">
            Pulsa Sync para importar las propiedades desde Inmovilla.
          </p>
          {syncErr && <p className="text-red-400 text-xs mb-4">{syncErr}</p>}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 bg-[#C9B99A] text-black font-body text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#DDD0BB] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando…" : "Sincronizar desde Inmovilla"}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] bg-[#0d0d0d] py-16 text-center">
          <Home size={18} className="text-[#222] mx-auto mb-3" />
          <p className="text-[#444] text-sm">Sin resultados para este filtro</p>
        </div>
      ) : (
        <div className="border border-[#1a1a1a] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                {["Ref", "Propiedad", "Tipo", "Op.", "Precio", "Asesor", "Hab.", "Baños", "Estado", ""].map((h, i) => (
                  <th key={i} className="text-left text-[#333] font-body tracking-wide uppercase px-4 py-2.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const isActive   = row.estado_ficha === 1;
                const isReserved = row.estado_ficha === 7;
                return (
                  <tr
                    key={row.ref}
                    className="border-b border-[#111] hover:bg-[#0d0d0d] transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/propiedades/${row.ref}`)}
                  >
                    {/* Ref */}
                    <td className="px-4 py-3">
                      <span className="text-[#C9B99A] font-mono text-xs">{row.ref}</span>
                    </td>

                    {/* Title + city */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-white leading-snug line-clamp-1">{row.titulo}</p>
                      <p className="text-[#444] mt-0.5">{row.ciudad ?? "—"}</p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-[#666] whitespace-nowrap">
                      {tipoLabel(row.tipo, row.subtipo)}
                    </td>

                    {/* Operation */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 uppercase tracking-wide font-body ${
                        row.operacion === "venta"
                          ? "text-[#C9B99A]"
                          : "text-blue-400"
                      }`}>
                        {row.operacion}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-white whitespace-nowrap font-mono">
                      {formatPrice(row.precio)}
                    </td>

                    {/* Asesor */}
                    <td className="px-4 py-3 text-[#666] max-w-[120px]">
                      <p className="line-clamp-1">{row.agente ?? "—"}</p>
                    </td>

                    {/* Habitaciones */}
                    <td className="px-4 py-3 text-[#888] text-center">
                      {row.habitaciones ?? "—"}
                    </td>

                    {/* Baños */}
                    <td className="px-4 py-3 text-[#888] text-center">
                      {row.banos ?? "—"}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.admin_status === "archived" ? (
                        <span className="text-[#666]">
                          Archivada
                          {row.sold_by && (
                            <span className="ml-1.5 text-[#444]">· {SOLD_LABEL[row.sold_by]}</span>
                          )}
                        </span>
                      ) : isActive ? (
                        <span className="text-emerald-400">● Activo</span>
                      ) : isReserved ? (
                        <span className="text-amber-400">● Reservado</span>
                      ) : (
                        <span className="text-[#444]">● Inactivo</span>
                      )}
                    </td>

                    {/* Link to public */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/propiedades/${row.slug}`}
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        className="text-[#333] hover:text-[#C9B99A] transition-colors"
                        title="Ver en la web"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
