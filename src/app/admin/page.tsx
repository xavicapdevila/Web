import Link from "next/link";
import { Building2, FileText, Clock } from "lucide-react";
import { getDbRestored } from "@/lib/db";
import { getAllBlogPostsAdmin } from "@/lib/blog";
import { getAvisoVacaciones, AVISO_DEFAULT } from "@/lib/aviso-vacaciones";
import VacacionesCard from "@/components/admin/VacacionesCard";

export const metadata = { title: "Admin — The Vila Home" };
export const dynamic  = "force-dynamic";

interface SyncRow {
  synced_at:            string;
  properties_added:     number;
  properties_updated:   number;
  properties_removed:   number;
  status:               string;
  source:               string;
}

async function getStats() {
  try {
    const db = await getDbRestored();
    const q  = (sql: string) =>
      (db.prepare(sql).get() as { c: number }).c;

    // Manually hidden properties are discounted from the active/sale counters
    // and reported in their own counter.
    const notHidden = "ref NOT IN (SELECT ref FROM propiedades_ocultas)";

    return {
      total:    q(`SELECT COUNT(*) as c FROM properties WHERE estado_ficha = 1 AND ${notHidden}`),
      venta:    q(`SELECT COUNT(*) as c FROM properties WHERE operacion='venta'    AND estado_ficha=1 AND ${notHidden}`),
      alquiler: q(`SELECT COUNT(*) as c FROM properties WHERE operacion='alquiler' AND estado_ficha=1 AND ${notHidden}`),
      outlet:   q(`SELECT COUNT(*) as c FROM properties WHERE outlet=1            AND estado_ficha=1 AND ${notHidden}`),
      ocultas:  q("SELECT COUNT(*) as c FROM propiedades_ocultas"),
      lastSync: db
        .prepare("SELECT synced_at,properties_added,properties_updated,properties_removed,status,source FROM sync_log ORDER BY id DESC LIMIT 1")
        .get() as SyncRow | undefined,
      recentSyncs: db
        .prepare("SELECT synced_at,properties_added,properties_updated,status,source FROM sync_log ORDER BY id DESC LIMIT 5")
        .all() as SyncRow[],
    };
  } catch {
    return { total: 0, venta: 0, alquiler: 0, outlet: 0, ocultas: 0, lastSync: undefined, recentSyncs: [] };
  }
}

function relativeTime(raw: string) {
  const d    = new Date(raw.includes("T") ? raw : raw.replace(" ", "T") + "Z");
  const diff = (Date.now() - d.getTime()) / 60_000;
  if (diff < 1)   return "hace un momento";
  if (diff < 60)  return `hace ${Math.floor(diff)} min`;
  if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
  return `hace ${Math.floor(diff / 1440)} d`;
}

export default async function AdminPage() {
  const s = await getStats();
  let blogCount = 0;
  try { blogCount = (await getAllBlogPostsAdmin()).length; } catch {}
  let aviso = AVISO_DEFAULT;
  try { aviso = await getAvisoVacaciones(); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-white font-display text-2xl mb-1">Dashboard</h1>
      <p className="text-[#444] text-xs mb-10">The Vila Home · Panel de administración</p>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Propiedades activas", value: s.total      },
          { label: "En venta",            value: s.venta      },
          { label: "En alquiler",         value: s.alquiler   },
          { label: "Ocultas",             value: s.ocultas    },
          { label: "Artículos blog",      value: blogCount    },
        ].map(({ label, value }) => (
          <div key={label} className="border border-[#1a1a1a] bg-[#0d0d0d] px-5 py-5">
            <p className="text-[#444] text-xs tracking-widest uppercase font-body mb-2">{label}</p>
            <p className="text-white text-3xl font-display">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick links ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/admin/propiedades"
          className="border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#C9B99A]/30 hover:bg-[#0f0f0f] transition-colors px-6 py-5 flex items-center gap-4"
        >
          <Building2 size={20} className="text-[#C9B99A]" />
          <div>
            <p className="text-white text-sm font-display mb-0.5">Gestionar propiedades</p>
            <p className="text-[#444] text-xs">{s.total} activas · {s.venta} venta · {s.alquiler} alquiler</p>
          </div>
        </Link>
        <Link
          href="/admin/blog"
          className="border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#C9B99A]/30 hover:bg-[#0f0f0f] transition-colors px-6 py-5 flex items-center gap-4"
        >
          <FileText size={20} className="text-[#C9B99A]" />
          <div>
            <p className="text-white text-sm font-display mb-0.5">Gestionar blog</p>
            <p className="text-[#444] text-xs">{blogCount} artículos publicados</p>
          </div>
        </Link>
      </div>

      {/* ── Aviso de vacaciones ────────────────────────── */}
      <VacacionesCard inicial={aviso} />

      {/* ── Sync log ───────────────────────────────────── */}
      <div className="border border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#111]">
          <Clock size={13} className="text-[#444]" />
          <p className="text-[#666] text-xs tracking-widest uppercase font-body">Historial de sincronización</p>
        </div>
        {s.recentSyncs.length === 0 ? (
          <p className="text-[#333] text-xs px-6 py-5">Sin registros todavía.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#111]">
                {["Fecha", "Fuente", "Añadidas", "Actualizadas", "Eliminadas", "Estado"].map(h => (
                  <th key={h} className="text-left text-[#444] font-body tracking-wide uppercase px-5 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.recentSyncs.map((row, i) => (
                <tr key={i} className="border-b border-[#0f0f0f] hover:bg-[#111]/40">
                  <td className="px-5 py-3 text-[#666] font-mono whitespace-nowrap">
                    {relativeTime(row.synced_at)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[#555] bg-[#111] border border-[#1a1a1a] px-2 py-0.5 uppercase tracking-wide font-mono">
                      {row.source ?? "xml"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#888]">{row.properties_added}</td>
                  <td className="px-5 py-3 text-[#888]">{row.properties_updated}</td>
                  <td className="px-5 py-3 text-[#888]">{(row as unknown as { properties_removed?: number }).properties_removed ?? 0}</td>
                  <td className="px-5 py-3">
                    <span className={row.status === "ok"
                      ? "text-[#C9B99A]"
                      : "text-red-400"
                    }>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-[#282828] text-xs mt-6">
        Pulsa <span className="text-[#333]">Sync</span> en la barra superior para importar propiedades al instante desde Inmovilla.
      </p>
    </div>
  );
}
