"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, Home } from "lucide-react";

interface PropRow {
  ref:            string;
  slug:           string;
  titulo:         string;
  tipo:           string;
  subtipo:        string | null;
  operacion:      string;
  precio:         number;
  ciudad:         string | null;
  habitaciones:   number | null;
  banos:          number | null;
  m2_construidos: number | null;
  estado_ficha:   number;
  imagenes:       string;
  fecha:          string;
  fechaact:       string | null;
}

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function firstImage(imagenes: string): string | null {
  try {
    const arr = JSON.parse(imagenes);
    return arr[0]?.url ?? null;
  } catch { return null; }
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

const TABS = [
  { key: "all",      label: "Todos"     },
  { key: "venta",    label: "Venta"     },
  { key: "alquiler", label: "Alquiler"  },
];

export default function PropertiesClient({ rows }: { rows: PropRow[] }) {
  const [tab,    setTab]    = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (tab !== "all" && r.operacion !== tab) return false;
      if (q && !r.ref.toLowerCase().includes(q) && !r.titulo.toLowerCase().includes(q) && !(r.ciudad ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, tab, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-2xl mb-1">Propiedades</h1>
          <p className="text-[#444] text-xs">{rows.length} en total · sincronizadas desde Inmovilla</p>
        </div>
        <Link
          href="/propiedades"
          target="_blank"
          className="flex items-center gap-1.5 text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
        >
          <ExternalLink size={11} />
          Ver página pública
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        {/* Tabs */}
        <div className="flex items-center border border-[#1a1a1a]">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-xs transition-colors ${
                tab === t.key
                  ? "bg-[#C9B99A] text-black font-body"
                  : "text-[#555] hover:text-[#888] bg-[#0d0d0d]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ref, título, ciudad…"
            className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white text-xs pl-8 pr-4 py-2 outline-none focus:border-[#C9B99A]/40 transition-colors placeholder-[#333]"
          />
        </div>

        <span className="text-[#333] text-xs ml-auto">{filtered.length} resultados</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] bg-[#0d0d0d] py-20 text-center">
          <Home size={20} className="text-[#222] mx-auto mb-3" />
          <p className="text-[#444] text-sm">No hay propiedades</p>
        </div>
      ) : (
        <div className="border border-[#1a1a1a] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                {["", "Ref", "Propiedad", "Tipo", "Operación", "Precio", "Ciudad", "Estado", ""].map((h, i) => (
                  <th key={i} className="text-left text-[#444] font-body tracking-wide uppercase px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const img = firstImage(row.imagenes);
                const isActive   = row.estado_ficha === 1;
                const isReserved = row.estado_ficha === 7;
                return (
                  <tr key={row.ref} className="border-b border-[#111] hover:bg-[#0d0d0d] transition-colors">
                    {/* Thumbnail */}
                    <td className="pl-4 pr-2 py-3 w-12">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="w-10 h-8 object-cover bg-[#111]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-10 h-8 bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
                          <Home size={10} className="text-[#333]" />
                        </div>
                      )}
                    </td>

                    {/* Ref */}
                    <td className="px-4 py-3">
                      <span className="text-[#888] font-mono">{row.ref}</span>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-white leading-snug line-clamp-1">{row.titulo}</p>
                      <p className="text-[#333] font-mono mt-0.5">
                        {row.habitaciones ? `${row.habitaciones} hab · ` : ""}
                        {row.m2_construidos ? `${row.m2_construidos} m²` : ""}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-[#666] whitespace-nowrap">
                      {tipoLabel(row.tipo, row.subtipo)}
                    </td>

                    {/* Operation */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs uppercase tracking-wide font-body ${
                        row.operacion === "venta"
                          ? "bg-[#C9B99A]/10 text-[#C9B99A] border border-[#C9B99A]/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {row.operacion}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-white whitespace-nowrap font-mono">
                      {formatPrice(row.precio)}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3 text-[#666]">{row.ciudad ?? "—"}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {isActive   && <span className="text-emerald-400 text-xs">● Activo</span>}
                      {isReserved && <span className="text-amber-400  text-xs">● Reservado</span>}
                      {!isActive && !isReserved && (
                        <span className="text-[#444] text-xs">● Inactivo</span>
                      )}
                    </td>

                    {/* Link */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/propiedades/${row.slug}`}
                        target="_blank"
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
