"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Home, ChevronRight } from "lucide-react";
import type { OpRow } from "./page";

const TABS = [
  { key: "en_venta",  label: "En venta"   },
  { key: "reservado", label: "Reservados" },
  { key: "en_arras",  label: "En arras"   },
  { key: "vendido",   label: "Vendidos"   },
  { key: "archivado", label: "Archivados" },
];

export const ESTADO_LABEL: Record<string, string> = {
  en_venta: "En venta", reservado: "Reservado", en_arras: "En arras",
  vendido: "Vendido", archivado: "Archivado",
};

export const ESTADO_STYLE: Record<string, string> = {
  en_venta:  "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
  reservado: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
  en_arras:  "text-blue-400 bg-blue-400/10 border border-blue-400/20",
  vendido:   "text-purple-400 bg-purple-400/10 border border-purple-400/20",
  archivado: "text-[#555] bg-[#111] border border-[#222]",
};

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function firstImage(imagenes: string): string | null {
  try { return JSON.parse(imagenes)[0]?.url ?? null; } catch { return null; }
}

export default function OperacionesClient({ rows }: { rows: OpRow[] }) {
  const [tab, setTab]       = useState("en_venta");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.estado_op] = (c[r.estado_op] ?? 0) + 1;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (r.estado_op !== tab) return false;
      if (q && ![r.ref, r.titulo, r.ciudad ?? "", r.propietario_nombre ?? ""].some(v => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, tab, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-white font-display text-2xl mb-1">Operaciones</h1>
        <p className="text-[#444] text-xs">{rows.length} propiedades en cartera</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#1a1a1a] mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-xs transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-[#C9B99A] text-[#C9B99A]"
                : "border-transparent text-[#555] hover:text-[#888]"
            }`}
          >
            {t.label}
            {(counts[t.key] ?? 0) > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-sm ${
                tab === t.key ? "bg-[#C9B99A]/15 text-[#C9B99A]" : "bg-[#1a1a1a] text-[#444]"
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar ref, título, ciudad, propietario…"
          className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white text-xs pl-8 pr-4 py-2 outline-none focus:border-[#C9B99A]/40 placeholder-[#333]"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] bg-[#0d0d0d] py-20 text-center">
          <Home size={20} className="text-[#222] mx-auto mb-3" />
          <p className="text-[#444] text-sm">
            {search ? "Sin resultados" : `No hay propiedades ${ESTADO_LABEL[tab]?.toLowerCase()}`}
          </p>
        </div>
      ) : (
        <div className="border border-[#1a1a1a] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                {["", "Ref", "Propiedad", "Propietario", "Precio salida", "Precio actual", "Estado", ""].map((h, i) => (
                  <th key={i} className="text-left text-[#444] font-body tracking-wide uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const img = firstImage(row.imagenes);
                return (
                  <tr key={row.ref} className="border-b border-[#111] hover:bg-[#0d0d0d] transition-colors">
                    <td className="pl-4 pr-2 py-3 w-12">
                      {img
                        ? <img src={img} alt="" className="w-10 h-8 object-cover bg-[#111]" loading="lazy" />
                        : <div className="w-10 h-8 bg-[#111] border border-[#1a1a1a] flex items-center justify-center"><Home size={10} className="text-[#333]" /></div>
                      }
                    </td>
                    <td className="px-4 py-3"><span className="text-[#888] font-mono">{row.ref}</span></td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-white line-clamp-1">{row.titulo}</p>
                      <p className="text-[#333] mt-0.5">{row.ciudad}</p>
                    </td>
                    <td className="px-4 py-3 text-[#666]">{row.propietario_nombre ?? <span className="text-[#333]">—</span>}</td>
                    <td className="px-4 py-3 text-[#666] font-mono">
                      {row.precio_inicial ? formatPrice(row.precio_inicial) : <span className="text-[#333]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-white font-mono">{formatPrice(row.precio_actual)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs uppercase tracking-wide font-body ${ESTADO_STYLE[row.estado_op]}`}>
                        {ESTADO_LABEL[row.estado_op]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/operaciones/${row.ref}`} className="text-[#333] hover:text-[#C9B99A] transition-colors" title="Abrir ficha">
                        <ChevronRight size={13} />
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
