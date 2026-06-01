"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Home, Zap, Euro, User, FileText, Tag } from "lucide-react";

interface FullRow {
  ref: string; slug: string; titulo: string; tipo: string; subtipo: string | null;
  operacion: string; precio: number; precio_anterior: number | null;
  outlet: number; porcentaje_bajada: number | null; estado_ficha: number;
  descripcion: string | null; ciudad: string | null; provincia: string | null;
  cp: string | null; zona: string | null; direccion: string | null;
  habitaciones: number | null; banos: number | null;
  m2_construidos: number | null; m2_utiles: number | null; m2_parcela: number | null;
  planta: string | null; num_plantas: number | null;
  ascensor: number; garaje: number; garaje_tipo: string | null; trastero: number;
  urbanizacion: number; piscina: number; piscina_privada: number; piscina_com: number;
  terraza: number; jardin: number; balcon: number; solarium: number;
  barbacoa: number; chimenea: number; vistas_al_mar: number;
  amueblado: number; arma_empotrado: number;
  calefaccion: string | null; aire_cond: number; bomba_frio_calor: number;
  orientacion: string | null; antiguedad: string | null; estado: string | null;
  ibi: number | null; gastos_comun: number | null; periodicidad_comunidad: string | null;
  certificado_energetico: string | null; consumo_energetico: string | null;
  emisiones_letra: string | null; emisiones_energeticas: string | null; energia_exento: number;
  agente: string | null; agente_email: string | null;
  agente_foto: string | null; agente_telefono: string | null;
  fecha: string | null; fechaact: string | null; updated_at: string | null;
  admin_status: string; sold_by: string | null; admin_notes: string | null;
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function Pill({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded-sm border ${
      active
        ? "bg-[#C9B99A]/10 text-[#C9B99A] border-[#C9B99A]/30"
        : "bg-[#111] text-[#444] border-[#1a1a1a]"
    }`}>
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-[#555] text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
        <Icon size={13} className="text-[#C9B99A]" />
        <h3 className="text-[#888] text-xs font-body tracking-widest uppercase">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

const ESTADO_FICHA: Record<number, { label: string; color: string }> = {
  1: { label: "Activo",    color: "text-emerald-400" },
  7: { label: "Reservado", color: "text-amber-400"   },
};

const SOLD_BY_OPTIONS = [
  { value: null,     label: "Sin clasificar" },
  { value: "tvh",    label: "Vendida por TVH" },
  { value: "others", label: "Vendida por otros" },
];

export default function PropertyDetail({ row }: { row: FullRow }) {
  const router = useRouter();
  const [soldBy, setSoldBy]     = useState<string | null>(row.sold_by);
  const [notes,  setNotes]      = useState(row.admin_notes ?? "");
  const [saving, setSaving]     = useState(false);
  const [saved,  setSaved]      = useState(false);

  const isArchived = row.admin_status === "archived";
  const estado = ESTADO_FICHA[row.estado_ficha] ?? { label: "Inactivo", color: "text-[#555]" };

  const fullAddress = [row.direccion, row.cp, row.ciudad, row.provincia]
    .filter(Boolean).join(", ");

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/properties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: row.ref, sold_by: soldBy, admin_notes: notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back + header */}
      <div className="mb-8">
        <Link href="/admin/propiedades" className="flex items-center gap-1.5 text-[#444] hover:text-[#888] text-xs mb-5 transition-colors">
          <ArrowLeft size={12} /> Propiedades
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[#C9B99A] text-xs border border-[#C9B99A]/30 px-2 py-0.5">
                {row.ref}
              </span>
              <span className={`text-xs ${estado.color}`}>● {estado.label}</span>
              {isArchived && (
                <span className="text-xs text-[#666] border border-[#333] px-2 py-0.5">
                  Archivada
                </span>
              )}
            </div>
            <h1 className="text-white font-display text-2xl leading-tight">{row.titulo}</h1>
            {fullAddress && (
              <p className="text-[#555] text-sm mt-1 flex items-center gap-1.5">
                <MapPin size={11} /> {fullAddress}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/propiedades/${row.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-[#444] hover:text-[#C9B99A] text-xs transition-colors"
            >
              <ExternalLink size={11} /> Ver en web
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Sold tracking — only visible when archived */}
        {isArchived && (
          <div className="border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-amber-400 text-xs font-body tracking-widest uppercase mb-4">
              Propiedad archivada — ha desaparecido del feed de Inmovilla
            </p>
            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <p className="text-[#555] text-xs mb-2">¿Cómo se vendió?</p>
                <div className="flex gap-2">
                  {SOLD_BY_OPTIONS.map(opt => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setSoldBy(opt.value)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        soldBy === opt.value
                          ? "border-[#C9B99A] text-[#C9B99A] bg-[#C9B99A]/10"
                          : "border-[#222] text-[#555] hover:border-[#444]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-1.5 text-xs bg-[#C9B99A] text-black hover:bg-[#DDD0BB] transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar"}
              </button>
            </div>
          </div>
        )}

        {/* Precio */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-5 flex items-center gap-8">
          <div>
            <p className="text-[#555] text-xs mb-1">Precio</p>
            <p className="text-white text-2xl font-mono">{fmt(row.precio)}</p>
          </div>
          {row.precio_anterior && (
            <div>
              <p className="text-[#555] text-xs mb-1">Precio anterior</p>
              <p className="text-[#555] text-sm font-mono line-through">{fmt(row.precio_anterior)}</p>
              {row.porcentaje_bajada && (
                <p className="text-emerald-400 text-xs mt-0.5">−{row.porcentaje_bajada}%</p>
              )}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <span className={`px-2 py-0.5 text-xs border uppercase font-body ${
              row.operacion === "venta"
                ? "bg-[#C9B99A]/10 text-[#C9B99A] border-[#C9B99A]/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}>
              {row.operacion}
            </span>
            {row.outlet ? (
              <span className="px-2 py-0.5 text-xs border border-emerald-500/30 text-emerald-400 uppercase font-body">
                Outlet
              </span>
            ) : null}
          </div>
        </div>

        {/* Localización */}
        <Section icon={MapPin} title="Localización">
          <Field label="Dirección completa" value={fullAddress || "—"} />
          <Field label="Zona / Barrio" value={row.zona} />
          <Field label="Ciudad" value={row.ciudad} />
          <Field label="Provincia" value={row.provincia} />
          <Field label="Código postal" value={row.cp} />
        </Section>

        {/* Detalles */}
        <Section icon={Home} title="Detalles del inmueble">
          <Field label="Tipo" value={[row.tipo, row.subtipo].filter(Boolean).join(" · ")} />
          <Field label="Planta" value={row.planta} />
          <Field label="Número de plantas" value={row.num_plantas} />
          <Field label="Habitaciones" value={row.habitaciones} />
          <Field label="Baños" value={row.banos} />
          <Field label="m² construidos" value={row.m2_construidos ? `${row.m2_construidos} m²` : null} />
          <Field label="m² útiles" value={row.m2_utiles ? `${row.m2_utiles} m²` : null} />
          <Field label="m² parcela" value={row.m2_parcela ? `${row.m2_parcela} m²` : null} />
          <Field label="Antigüedad" value={row.antiguedad} />
          <Field label="Estado de conservación" value={row.estado} />
          <Field label="Orientación" value={row.orientacion} />
          <Field label="Calefacción" value={row.calefaccion} />
        </Section>

        {/* Extras */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
            <Tag size={13} className="text-[#C9B99A]" />
            <h3 className="text-[#888] text-xs font-body tracking-widest uppercase">Extras</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill label="Ascensor"        active={!!row.ascensor} />
            <Pill label={row.garaje_tipo === "parking" ? "Parking" : "Garaje"} active={!!row.garaje} />
            <Pill label="Trastero"        active={!!row.trastero} />
            <Pill label="Urbanización"    active={!!row.urbanizacion} />
            <Pill label="Piscina priv."   active={!!row.piscina_privada} />
            <Pill label="Piscina com."    active={!!row.piscina_com} />
            <Pill label="Terraza"         active={!!row.terraza} />
            <Pill label="Jardín"          active={!!row.jardin} />
            <Pill label="Balcón"          active={!!row.balcon} />
            <Pill label="Solarium"        active={!!row.solarium} />
            <Pill label="Barbacoa"        active={!!row.barbacoa} />
            <Pill label="Chimenea"        active={!!row.chimenea} />
            <Pill label="Vistas al mar"   active={!!row.vistas_al_mar} />
            <Pill label="Amueblado"       active={!!row.amueblado} />
            <Pill label="Armario emp."    active={!!row.arma_empotrado} />
            <Pill label="Aire acondic."   active={!!row.aire_cond} />
            <Pill label="Bomba frío/calor" active={!!row.bomba_frio_calor} />
          </div>
        </div>

        {/* Costes */}
        <Section icon={Euro} title="Costes">
          <Field label="IBI" value={row.ibi ? `${row.ibi.toLocaleString("es-ES")} €/año` : null} />
          <Field
            label="Gastos de comunidad"
            value={row.gastos_comun
              ? `${row.gastos_comun.toLocaleString("es-ES")} €/${row.periodicidad_comunidad ?? "mes"}`
              : null}
          />
        </Section>

        {/* Energía */}
        <Section icon={Zap} title="Certificado energético">
          <Field label="Letra consumo" value={row.certificado_energetico} />
          <Field label="Consumo" value={row.consumo_energetico ? `${row.consumo_energetico} kWh/m²·año` : null} />
          <Field label="Letra emisiones" value={row.emisiones_letra} />
          <Field label="Emisiones CO₂" value={row.emisiones_energeticas ? `${row.emisiones_energeticas} kg CO₂/m²·año` : null} />
          {row.energia_exento ? (
            <div className="col-span-2">
              <span className="text-[#666] text-xs">Exento de certificado energético</span>
            </div>
          ) : null}
        </Section>

        {/* Agente */}
        {(row.agente || row.agente_email || row.agente_telefono) && (
          <Section icon={User} title="Asesor">
            <div className="col-span-2 flex items-center gap-4">
              {row.agente_foto && (
                <img src={row.agente_foto} alt="" className="w-10 h-10 rounded-full object-cover bg-[#1a1a1a]" />
              )}
              <div className="grid grid-cols-3 gap-6 flex-1">
                <Field label="Nombre" value={row.agente} />
                <Field label="Email" value={row.agente_email} />
                <Field label="Teléfono" value={row.agente_telefono} />
              </div>
            </div>
          </Section>
        )}

        {/* Descripción */}
        {row.descripcion && (
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
              <FileText size={13} className="text-[#C9B99A]" />
              <h3 className="text-[#888] text-xs font-body tracking-widest uppercase">Descripción</h3>
            </div>
            <p className="text-[#888] text-sm leading-relaxed whitespace-pre-line">{row.descripcion}</p>
          </div>
        )}

        {/* Notas internas (solo admin) */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-5">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <FileText size={13} className="text-[#C9B99A]" />
              <h3 className="text-[#888] text-xs font-body tracking-widest uppercase">Notas internas</h3>
              <span className="text-[#333] text-xs">(solo admin)</span>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="text-xs text-[#555] hover:text-[#C9B99A] transition-colors disabled:opacity-40"
            >
              {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar"}
            </button>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Notas privadas sobre esta propiedad…"
            className="w-full bg-[#060606] border border-[#1a1a1a] text-white text-sm p-3 outline-none focus:border-[#C9B99A]/30 resize-none placeholder-[#333] transition-colors"
          />
        </div>

        {/* Metadatos */}
        <div className="border border-[#111] bg-[#070707] p-4 grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-[#333] mb-0.5">Ref Inmovilla</p>
            <p className="text-[#666] font-mono">{row.ref}</p>
          </div>
          <div>
            <p className="text-[#333] mb-0.5">Fecha alta</p>
            <p className="text-[#666]">{row.fecha ?? "—"}</p>
          </div>
          <div>
            <p className="text-[#333] mb-0.5">Última actualización</p>
            <p className="text-[#666]">{row.fechaact ?? row.updated_at ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
