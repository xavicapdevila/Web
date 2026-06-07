"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, User, Activity, TrendingDown, TrendingUp,
  Percent, FileText, Clock, Phone, Eye, GitBranch,
  MessageSquare, Edit3, Save, X, Plus, Trash2,
  CheckCircle, XCircle, MinusCircle, Home, ExternalLink,
} from "lucide-react";
import type {
  PropertyData, OperacionData, SeguimientoEntry,
  VisitaEntry, DocumentoEntry, HistorialEntry,
} from "./page";

// ── Constants ────────────────────────────────────────────────────────────────

const AGENTS = ["Ariadna Garcia", "Xavier Capdevila", "Sofía Pascual"];

const SECTIONS = [
  { id: "propietario",    label: "Datos propietarios",        icon: User          },
  { id: "estado",         label: "Estado de operación",       icon: Activity      },
  { id: "precio_inicial", label: "Precio inicial",            icon: TrendingDown  },
  { id: "precio_actual",  label: "Precio actual",             icon: TrendingUp    },
  { id: "honorarios",     label: "Honorarios",                icon: Percent       },
  { id: "documentos",     label: "Documentación",             icon: FileText      },
  { id: "historial",      label: "Historial",                 icon: Clock         },
  { id: "seguimiento",    label: "Seguimiento",               icon: Phone         },
  { id: "visitas",        label: "Visitas realizadas",        icon: Eye           },
  { id: "timeline",       label: "Timeline de la operación",  icon: GitBranch     },
  { id: "observaciones",  label: "Observaciones internas",    icon: MessageSquare },
];

const ESTADO_LABEL: Record<string, string> = {
  en_venta: "En venta", reservado: "Reservado", en_arras: "En arras",
  vendido: "Vendido", archivado: "Archivado",
};

const ESTADO_STYLE: Record<string, string> = {
  en_venta:  "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
  reservado: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
  en_arras:  "text-blue-400 bg-blue-400/10 border border-blue-400/20",
  vendido:   "text-purple-400 bg-purple-400/10 border border-purple-400/20",
  archivado: "text-[#555] bg-[#111] border border-[#222]",
};

const SEG_TIPO_LABEL: Record<string, string> = {
  llamada: "Llamada", email: "Email", whatsapp: "WhatsApp", reunion: "Reunión", otro: "Otro",
};

const VAL_ICON: Record<string, React.ReactNode> = {
  positiva: <CheckCircle size={12} className="text-emerald-400" />,
  neutral:  <MinusCircle size={12} className="text-[#555]"      />,
  negativa: <XCircle     size={12} className="text-red-400"     />,
};

const DOC_TIPO_LABEL: Record<string, string> = {
  contrato: "Contrato", nota_simple: "Nota simple", dni: "DNI/NIE",
  escritura: "Escritura", arras: "Arras", otro: "Otro",
};

// ── Utilities ────────────────────────────────────────────────────────────────

function formatPrice(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function firstImage(imagenes: string): string | null {
  try { return JSON.parse(imagenes)[0]?.url ?? null; } catch { return null; }
}

// ── Shared UI ────────────────────────────────────────────────────────────────

const INPUT = "w-full bg-[#111] border border-[#222] text-white text-xs px-3 py-2 outline-none focus:border-[#C9B99A]/40 placeholder-[#333] transition-colors";
const SELECT = "w-full bg-[#111] border border-[#222] text-white text-xs px-3 py-2 outline-none focus:border-[#C9B99A]/40 transition-colors";
const LABEL  = "block text-[#555] text-xs mb-1";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className={LABEL}>{label}</p>{children}</div>;
}

function Val({ v }: { v: string | number | null | undefined }) {
  return v != null && v !== "" ? <span className="text-white text-xs">{v}</span> : <span className="text-[#333] text-xs">—</span>;
}

interface SectionCardProps {
  title: string; icon: React.ElementType; children: React.ReactNode;
  editing?: boolean; onEdit?: () => void; onCancel?: () => void;
  onSave?: () => void; saving?: boolean; error?: string;
}
function SectionCard({ title, icon: Icon, children, editing, onEdit, onCancel, onSave, saving, error }: SectionCardProps) {
  return (
    <div className="border border-[#1a1a1a] bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <Icon size={13} className="text-[#C9B99A]" />
          <h2 className="text-white text-sm">{title}</h2>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="text-[#444] hover:text-white transition-colors p-1"><X size={13} /></button>
            <button onClick={onSave} disabled={saving}
              className="flex items-center gap-1.5 text-xs bg-[#C9B99A] text-black px-3 py-1.5 hover:bg-[#DDD0BB] disabled:opacity-50 transition-colors font-body">
              <Save size={11} />{saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        ) : onEdit ? (
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-[#444] hover:text-[#C9B99A] transition-colors">
            <Edit3 size={11} />Editar
          </button>
        ) : null}
      </div>
      <div className="p-5 space-y-3">
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {children}
      </div>
    </div>
  );
}

// ── Section: Propietario ─────────────────────────────────────────────────────

function SectionPropietario({ op, onSave }: { op: OperacionData; onSave: (d: Partial<OperacionData>) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ propietario_nombre: "", propietario_telefono: "", propietario_email: "", propietario_nif: "", propietario_notas: "" });

  function startEdit() {
    setForm({ propietario_nombre: op.propietario_nombre ?? "", propietario_telefono: op.propietario_telefono ?? "", propietario_email: op.propietario_email ?? "", propietario_nif: op.propietario_nif ?? "", propietario_notas: op.propietario_notas ?? "" });
    setEditing(true); setError("");
  }
  async function save() {
    setSaving(true); setError("");
    try { await onSave(form); setEditing(false); } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <SectionCard title="Datos propietarios" icon={User} editing={editing} onEdit={startEdit} onCancel={() => setEditing(false)} onSave={save} saving={saving} error={error}>
      {editing ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre"><input className={INPUT} value={form.propietario_nombre} onChange={f("propietario_nombre")} placeholder="Nombre completo" /></Field>
          <Field label="Teléfono"><input className={INPUT} value={form.propietario_telefono} onChange={f("propietario_telefono")} placeholder="+34 600 000 000" /></Field>
          <Field label="Email"><input className={INPUT} type="email" value={form.propietario_email} onChange={f("propietario_email")} placeholder="email@ejemplo.com" /></Field>
          <Field label="NIF/NIE"><input className={INPUT} value={form.propietario_nif} onChange={f("propietario_nif")} placeholder="12345678A" /></Field>
          <div className="col-span-2">
            <Field label="Notas sobre el propietario">
              <textarea className={INPUT + " resize-none"} rows={3} value={form.propietario_notas} onChange={f("propietario_notas")} placeholder="Preferencias, observaciones…" />
            </Field>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div><p className={LABEL}>Nombre</p><Val v={op.propietario_nombre} /></div>
          <div><p className={LABEL}>Teléfono</p><Val v={op.propietario_telefono} /></div>
          <div><p className={LABEL}>Email</p><Val v={op.propietario_email} /></div>
          <div><p className={LABEL}>NIF/NIE</p><Val v={op.propietario_nif} /></div>
          {op.propietario_notas && <div className="col-span-2"><p className={LABEL}>Notas</p><Val v={op.propietario_notas} /></div>}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Estado ──────────────────────────────────────────────────────────

function SectionEstado({ op, onSave }: { op: OperacionData; onSave: (d: Partial<OperacionData>) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ estado: "en_venta", fecha_inicio: "", fecha_cierre: "" });

  function startEdit() {
    setForm({ estado: op.estado, fecha_inicio: op.fecha_inicio ?? "", fecha_cierre: op.fecha_cierre ?? "" });
    setEditing(true); setError("");
  }
  async function save() {
    setSaving(true); setError("");
    try { await onSave(form); setEditing(false); } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  return (
    <SectionCard title="Estado de operación" icon={Activity} editing={editing} onEdit={startEdit} onCancel={() => setEditing(false)} onSave={save} saving={saving} error={error}>
      {editing ? (
        <div className="grid grid-cols-3 gap-3">
          <Field label="Estado">
            <select className={SELECT} value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
              <option value="en_venta">En venta</option>
              <option value="reservado">Reservado</option>
              <option value="en_arras">En arras</option>
              <option value="vendido">Vendido</option>
              <option value="archivado">Archivado</option>
            </select>
          </Field>
          <Field label="Fecha inicio comercialización">
            <input type="date" className={INPUT} value={form.fecha_inicio} onChange={e => setForm(p => ({ ...p, fecha_inicio: e.target.value }))} />
          </Field>
          <Field label="Fecha cierre operación">
            <input type="date" className={INPUT} value={form.fecha_cierre} onChange={e => setForm(p => ({ ...p, fecha_cierre: e.target.value }))} />
          </Field>
        </div>
      ) : (
        <div className="flex items-start gap-8">
          <div>
            <p className={LABEL}>Estado actual</p>
            <span className={`px-2 py-0.5 text-xs uppercase tracking-wide font-body ${ESTADO_STYLE[op.estado]}`}>
              {ESTADO_LABEL[op.estado]}
            </span>
          </div>
          <div><p className={LABEL}>Inicio comercialización</p><Val v={formatDate(op.fecha_inicio)} /></div>
          <div><p className={LABEL}>Cierre operación</p><Val v={formatDate(op.fecha_cierre)} /></div>
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Precio inicial ──────────────────────────────────────────────────

function SectionPrecioInicial({ op, precioActual, onSave }: { op: OperacionData; precioActual: number; onSave: (d: Partial<OperacionData>) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [valor,   setValor]   = useState("");

  function startEdit() { setValor(op.precio_inicial != null ? String(op.precio_inicial) : ""); setEditing(true); setError(""); }
  async function save() {
    setSaving(true); setError("");
    try { await onSave({ precio_inicial: valor ? parseFloat(valor) : null }); setEditing(false); } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  const diff = op.precio_inicial && precioActual
    ? ((precioActual - op.precio_inicial) / op.precio_inicial * 100).toFixed(1)
    : null;

  return (
    <SectionCard title="Precio inicial" icon={TrendingDown} editing={editing} onEdit={startEdit} onCancel={() => setEditing(false)} onSave={save} saving={saving} error={error}>
      {editing ? (
        <Field label="Precio de salida (€)">
          <input type="number" className={INPUT + " max-w-xs"} value={valor} onChange={e => setValor(e.target.value)} placeholder="250000" />
        </Field>
      ) : (
        <div className="flex items-start gap-8">
          <div><p className={LABEL}>Precio de salida</p><Val v={formatPrice(op.precio_inicial)} /></div>
          {diff !== null && (
            <div>
              <p className={LABEL}>Variación vs. actual</p>
              <span className={`text-xs font-mono ${parseFloat(diff) < 0 ? "text-red-400" : parseFloat(diff) > 0 ? "text-emerald-400" : "text-[#555]"}`}>
                {parseFloat(diff) > 0 ? "+" : ""}{diff}%
              </span>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Precio actual ───────────────────────────────────────────────────

function SectionPrecioActual({ precio, operacion }: { precio: number; operacion: string }) {
  return (
    <SectionCard title="Precio actual" icon={TrendingUp}>
      <div className="flex items-start gap-8">
        <div>
          <p className={LABEL}>Precio actual de venta</p>
          <span className="text-white font-mono text-lg">{formatPrice(precio)}</span>
        </div>
        <div>
          <p className={LABEL}>Tipo de operación</p>
          <span className="text-[#888] text-xs capitalize">{operacion}</span>
        </div>
        <div>
          <p className={LABEL}>Fuente</p>
          <span className="text-[#444] text-xs">Sincronizado desde Inmovilla</span>
        </div>
      </div>
    </SectionCard>
  );
}

// ── Section: Honorarios ──────────────────────────────────────────────────────

function SectionHonorarios({ op, precioActual, onSave }: { op: OperacionData; precioActual: number; onSave: (d: Partial<OperacionData>) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ honorarios_tipo: "porcentaje", honorarios_valor: "", honorarios_iva: false });

  function startEdit() {
    setForm({ honorarios_tipo: op.honorarios_tipo ?? "porcentaje", honorarios_valor: op.honorarios_valor != null ? String(op.honorarios_valor) : "", honorarios_iva: op.honorarios_iva === 1 });
    setEditing(true); setError("");
  }
  async function save() {
    setSaving(true); setError("");
    try {
      await onSave({ honorarios_tipo: form.honorarios_tipo, honorarios_valor: form.honorarios_valor ? parseFloat(form.honorarios_valor) : null, honorarios_iva: form.honorarios_iva ? 1 : 0 });
      setEditing(false);
    } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  const base = (() => {
    if (!op.honorarios_valor) return null;
    if (op.honorarios_tipo === "porcentaje") return precioActual * op.honorarios_valor / 100;
    return op.honorarios_valor;
  })();
  const conIva = base != null ? base * 1.21 : null;

  return (
    <SectionCard title="Honorarios" icon={Percent} editing={editing} onEdit={startEdit} onCancel={() => setEditing(false)} onSave={save} saving={saving} error={error}>
      {editing ? (
        <div className="flex items-end gap-3 flex-wrap">
          <Field label="Tipo">
            <select className={SELECT + " w-40"} value={form.honorarios_tipo} onChange={e => setForm(p => ({ ...p, honorarios_tipo: e.target.value }))}>
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="fijo">Importe fijo (€)</option>
            </select>
          </Field>
          <Field label={form.honorarios_tipo === "porcentaje" ? "Porcentaje" : "Importe (€)"}>
            <input type="number" step="0.1" className={INPUT + " w-32"} value={form.honorarios_valor} onChange={e => setForm(p => ({ ...p, honorarios_valor: e.target.value }))} placeholder={form.honorarios_tipo === "porcentaje" ? "3" : "9000"} />
          </Field>
          <label className="flex items-center gap-2 text-xs text-[#888] pb-2 cursor-pointer">
            <input type="checkbox" checked={form.honorarios_iva} onChange={e => setForm(p => ({ ...p, honorarios_iva: e.target.checked }))} className="accent-[#C9B99A]" />
            IVA incluido
          </label>
        </div>
      ) : (
        <div className="flex items-start gap-8 flex-wrap">
          <div>
            <p className={LABEL}>Tipo</p>
            <Val v={op.honorarios_tipo === "porcentaje" ? `${op.honorarios_valor ?? "—"}%` : "Importe fijo"} />
          </div>
          {op.honorarios_tipo === "fijo" && <div><p className={LABEL}>Importe</p><Val v={formatPrice(op.honorarios_valor)} /></div>}
          <div><p className={LABEL}>IVA</p><Val v={op.honorarios_iva ? "Incluido" : "No incluido"} /></div>
          {base != null && (
            <>
              <div><p className={LABEL}>Honorarios netos</p><span className="text-white text-xs font-mono">{formatPrice(base)}</span></div>
              {!op.honorarios_iva && conIva != null && <div><p className={LABEL}>Con IVA (21%)</p><span className="text-[#C9B99A] text-xs font-mono">{formatPrice(conIva)}</span></div>}
            </>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Documentos ──────────────────────────────────────────────────────

function SectionDocumentos({ docs, ref, onAdd, onDelete }: {
  docs: DocumentoEntry[]; ref: string;
  onAdd: (d: DocumentoEntry) => void; onDelete: (id: number) => void;
}) {
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ nombre: "", tipo: "otro", url: "" });

  async function handleAdd() {
    if (!form.nombre.trim()) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/operaciones/${ref}/documentos`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, tipo: form.tipo, url: form.url || null }),
      });
      if (!res.ok) throw new Error();
      const { entry } = await res.json();
      onAdd(entry); setAdding(false); setForm({ nombre: "", tipo: "otro", url: "" });
    } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este documento?")) return;
    await fetch(`/api/admin/operaciones/${ref}/documentos?id=${id}`, { method: "DELETE" });
    onDelete(id);
  }

  return (
    <SectionCard title="Documentación" icon={FileText}>
      <button onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 text-xs text-[#C9B99A] hover:text-[#DDD0BB] transition-colors mb-3">
        <Plus size={12} />Añadir documento
      </button>
      {adding && (
        <div className="border border-[#222] bg-[#111] p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre del documento"><input className={INPUT} value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Contrato de exclusividad" /></Field>
            <Field label="Tipo">
              <select className={SELECT} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                {Object.entries(DOC_TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="URL (opcional)"><input className={INPUT} value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://drive.google.com/…" /></Field>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="text-xs bg-[#C9B99A] text-black px-3 py-1.5 hover:bg-[#DDD0BB] disabled:opacity-50 font-body">{saving ? "Guardando…" : "Guardar"}</button>
            <button onClick={() => setAdding(false)} className="text-xs text-[#444] hover:text-white px-3 py-1.5">Cancelar</button>
          </div>
        </div>
      )}
      {docs.length === 0 ? (
        <p className="text-[#333] text-xs">Sin documentos</p>
      ) : (
        <div className="space-y-2">
          {docs.map(d => (
            <div key={d.id} className="flex items-center gap-3 border border-[#1a1a1a] px-3 py-2.5 group">
              <FileText size={12} className="text-[#444] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs">{d.nombre}</p>
                <p className="text-[#444] text-xs">{DOC_TIPO_LABEL[d.tipo] ?? d.tipo} · {formatDate(d.created_at)}</p>
              </div>
              {d.url && <a href={d.url} target="_blank" rel="noopener" className="text-[#444] hover:text-[#C9B99A] transition-colors"><ExternalLink size={12} /></a>}
              <button onClick={() => handleDelete(d.id)} className="text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Historial ───────────────────────────────────────────────────────

function SectionHistorial({ historial }: { historial: HistorialEntry[] }) {
  return (
    <SectionCard title="Historial" icon={Clock}>
      {historial.length === 0 ? (
        <p className="text-[#333] text-xs">Sin entradas en el historial</p>
      ) : (
        <div className="space-y-3">
          {historial.map(h => (
            <div key={h.id} className="flex gap-3 border-b border-[#111] pb-3 last:border-0 last:pb-0">
              <div className="w-1 h-1 rounded-full bg-[#C9B99A] mt-1.5 shrink-0" />
              <div>
                <p className="text-white text-xs">{h.evento}</p>
                {h.descripcion && <p className="text-[#555] text-xs">{h.descripcion}</p>}
                <p className="text-[#333] text-xs mt-0.5">{formatDate(h.created_at)}{h.agente ? ` · ${h.agente}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Seguimiento ─────────────────────────────────────────────────────

function SectionSeguimiento({ seg, ref, onAdd, onDelete }: {
  seg: SeguimientoEntry[]; ref: string;
  onAdd: (e: SeguimientoEntry) => void; onDelete: (id: number) => void;
}) {
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ fecha: today, tipo: "llamada", agente: "", notas: "" });

  async function handleAdd() {
    if (!form.fecha || !form.tipo) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/operaciones/${ref}/seguimiento`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: form.fecha, tipo: form.tipo, agente: form.agente || null, notas: form.notas || null }),
      });
      if (!res.ok) throw new Error();
      const { entry } = await res.json();
      onAdd(entry); setAdding(false); setForm({ fecha: today, tipo: "llamada", agente: "", notas: "" });
    } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/operaciones/${ref}/seguimiento?id=${id}`, { method: "DELETE" });
    onDelete(id);
  }

  return (
    <SectionCard title="Seguimiento" icon={Phone}>
      <button onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 text-xs text-[#C9B99A] hover:text-[#DDD0BB] transition-colors mb-3">
        <Plus size={12} />Añadir entrada
      </button>
      {adding && (
        <div className="border border-[#222] bg-[#111] p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Fecha"><input type="date" className={INPUT} value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
            <Field label="Tipo">
              <select className={SELECT} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                <option value="llamada">Llamada</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="reunion">Reunión</option>
                <option value="otro">Otro</option>
              </select>
            </Field>
            <Field label="Agente">
              <select className={SELECT} value={form.agente} onChange={e => setForm(p => ({ ...p, agente: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notas">
            <textarea className={INPUT + " resize-none"} rows={2} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Descripción del contacto…" />
          </Field>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="text-xs bg-[#C9B99A] text-black px-3 py-1.5 hover:bg-[#DDD0BB] disabled:opacity-50 font-body">{saving ? "Guardando…" : "Guardar"}</button>
            <button onClick={() => setAdding(false)} className="text-xs text-[#444] hover:text-white px-3 py-1.5">Cancelar</button>
          </div>
        </div>
      )}
      {seg.length === 0 ? (
        <p className="text-[#333] text-xs">Sin entradas de seguimiento</p>
      ) : (
        <div className="space-y-2">
          {seg.map(s => (
            <div key={s.id} className="flex gap-3 items-start border border-[#1a1a1a] px-3 py-2.5 group">
              <Phone size={11} className="text-[#444] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#C9B99A] text-xs font-body">{SEG_TIPO_LABEL[s.tipo] ?? s.tipo}</span>
                  <span className="text-[#333] text-xs">{formatDate(s.fecha)}</span>
                  {s.agente && <span className="text-[#444] text-xs">· {s.agente}</span>}
                </div>
                {s.notas && <p className="text-[#888] text-xs mt-0.5">{s.notas}</p>}
              </div>
              <button onClick={() => handleDelete(s.id)} className="text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Visitas ─────────────────────────────────────────────────────────

function SectionVisitas({ vis, ref, onAdd, onDelete }: {
  vis: VisitaEntry[]; ref: string;
  onAdd: (v: VisitaEntry) => void; onDelete: (id: number) => void;
}) {
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ fecha: today, nombre_contacto: "", telefono_contacto: "", valoracion: "neutral", agente: "", notas: "" });

  async function handleAdd() {
    if (!form.fecha) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/operaciones/${ref}/visitas`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: form.fecha, nombre_contacto: form.nombre_contacto || null, telefono_contacto: form.telefono_contacto || null, valoracion: form.valoracion, agente: form.agente || null, notas: form.notas || null }),
      });
      if (!res.ok) throw new Error();
      const { entry } = await res.json();
      onAdd(entry); setAdding(false); setForm({ fecha: today, nombre_contacto: "", telefono_contacto: "", valoracion: "neutral", agente: "", notas: "" });
    } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/operaciones/${ref}/visitas?id=${id}`, { method: "DELETE" });
    onDelete(id);
  }

  return (
    <SectionCard title="Visitas realizadas" icon={Eye}>
      <button onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 text-xs text-[#C9B99A] hover:text-[#DDD0BB] transition-colors mb-3">
        <Plus size={12} />Registrar visita
      </button>
      {adding && (
        <div className="border border-[#222] bg-[#111] p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha"><input type="date" className={INPUT} value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
            <Field label="Valoración">
              <select className={SELECT} value={form.valoracion} onChange={e => setForm(p => ({ ...p, valoracion: e.target.value }))}>
                <option value="positiva">Positiva</option>
                <option value="neutral">Neutral</option>
                <option value="negativa">Negativa</option>
              </select>
            </Field>
            <Field label="Nombre del contacto"><input className={INPUT} value={form.nombre_contacto} onChange={e => setForm(p => ({ ...p, nombre_contacto: e.target.value }))} placeholder="Nombre y apellidos" /></Field>
            <Field label="Teléfono"><input className={INPUT} value={form.telefono_contacto} onChange={e => setForm(p => ({ ...p, telefono_contacto: e.target.value }))} placeholder="+34 600 000 000" /></Field>
            <Field label="Agente responsable">
              <select className={SELECT} value={form.agente} onChange={e => setForm(p => ({ ...p, agente: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notas de la visita">
            <textarea className={INPUT + " resize-none"} rows={2} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Impresiones, comentarios del contacto…" />
          </Field>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="text-xs bg-[#C9B99A] text-black px-3 py-1.5 hover:bg-[#DDD0BB] disabled:opacity-50 font-body">{saving ? "Guardando…" : "Guardar"}</button>
            <button onClick={() => setAdding(false)} className="text-xs text-[#444] hover:text-white px-3 py-1.5">Cancelar</button>
          </div>
        </div>
      )}
      {vis.length === 0 ? (
        <p className="text-[#333] text-xs">Sin visitas registradas</p>
      ) : (
        <div className="space-y-2">
          {vis.map(v => (
            <div key={v.id} className="flex gap-3 items-start border border-[#1a1a1a] px-3 py-2.5 group">
              <span className="shrink-0 mt-0.5">{VAL_ICON[v.valoracion]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-xs">{v.nombre_contacto ?? "Contacto anónimo"}</span>
                  {v.telefono_contacto && <span className="text-[#444] text-xs">{v.telefono_contacto}</span>}
                  <span className="text-[#333] text-xs">{formatDate(v.fecha)}</span>
                  {v.agente && <span className="text-[#444] text-xs">· {v.agente}</span>}
                </div>
                {v.notas && <p className="text-[#888] text-xs mt-0.5">{v.notas}</p>}
              </div>
              <button onClick={() => handleDelete(v.id)} className="text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Timeline ────────────────────────────────────────────────────────

type TimelineItem = { date: string; label: string; detail: string; type: "historial" | "seguimiento" | "visita" };

function SectionTimeline({ historial, seguimiento, visitas }: { historial: HistorialEntry[]; seguimiento: SeguimientoEntry[]; visitas: VisitaEntry[] }) {
  const items: TimelineItem[] = [
    ...historial.map(h => ({ date: h.created_at, label: h.evento, detail: [h.descripcion, h.agente].filter(Boolean).join(" · "), type: "historial" as const })),
    ...seguimiento.map(s => ({ date: s.created_at, label: `${SEG_TIPO_LABEL[s.tipo] ?? s.tipo}`, detail: [s.notas, s.agente].filter(Boolean).join(" · "), type: "seguimiento" as const })),
    ...visitas.map(v => ({ date: v.created_at, label: `Visita: ${v.nombre_contacto ?? "contacto anónimo"}`, detail: [v.notas, v.agente].filter(Boolean).join(" · "), type: "visita" as const })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const TYPE_COLOR: Record<string, string> = { historial: "bg-[#C9B99A]", seguimiento: "bg-blue-400", visita: "bg-emerald-400" };

  return (
    <SectionCard title="Timeline de la operación" icon={GitBranch}>
      {items.length === 0 ? (
        <p className="text-[#333] text-xs">Sin actividad registrada</p>
      ) : (
        <div className="relative">
          <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[#1a1a1a]" />
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className={`w-5 h-5 rounded-full ${TYPE_COLOR[item.type]} shrink-0 flex items-center justify-center z-10`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-white text-xs">{item.label}</p>
                  {item.detail && <p className="text-[#555] text-xs">{item.detail}</p>}
                  <p className="text-[#333] text-xs mt-0.5">{formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

// ── Section: Observaciones ───────────────────────────────────────────────────

function SectionObservaciones({ op, onSave }: { op: OperacionData; onSave: (d: Partial<OperacionData>) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [text,    setText]    = useState("");

  function startEdit() { setText(op.observaciones ?? ""); setEditing(true); setError(""); }
  async function save() {
    setSaving(true); setError("");
    try { await onSave({ observaciones: text || null }); setEditing(false); } catch { setError("Error al guardar"); } finally { setSaving(false); }
  }

  return (
    <SectionCard title="Observaciones internas" icon={MessageSquare} editing={editing} onEdit={startEdit} onCancel={() => setEditing(false)} onSave={save} saving={saving} error={error}>
      {editing ? (
        <textarea className={INPUT + " resize-none w-full"} rows={6} value={text} onChange={e => setText(e.target.value)} placeholder="Notas internas sobre la operación…" />
      ) : op.observaciones ? (
        <p className="text-white text-xs whitespace-pre-wrap">{op.observaciones}</p>
      ) : (
        <p className="text-[#333] text-xs">Sin observaciones</p>
      )}
    </SectionCard>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  property: PropertyData; operacion: OperacionData;
  seguimiento: SeguimientoEntry[]; visitas: VisitaEntry[];
  documentos: DocumentoEntry[]; historial: HistorialEntry[];
}

export default function OperacionDetail({ property, operacion: initOp, seguimiento: initSeg, visitas: initVis, documentos: initDocs, historial: initHist }: Props) {
  const [activeSection, setActiveSection] = useState("propietario");
  const [op,   setOp]   = useState<OperacionData>(initOp);
  const [seg,  setSeg]  = useState<SeguimientoEntry[]>(initSeg);
  const [vis,  setVis]  = useState<VisitaEntry[]>(initVis);
  const [docs, setDocs] = useState<DocumentoEntry[]>(initDocs);
  const [hist, setHist] = useState<HistorialEntry[]>(initHist);

  async function patch(data: Partial<OperacionData>) {
    const res = await fetch(`/api/admin/operaciones/${property.ref}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al guardar");
    const json = await res.json();
    if (json.operacion) setOp(json.operacion);
    if (json.historial)  setHist(json.historial);
  }

  const img = firstImage(property.imagenes);

  function renderSection() {
    switch (activeSection) {
      case "propietario":    return <SectionPropietario op={op} onSave={patch} />;
      case "estado":         return <SectionEstado op={op} onSave={patch} />;
      case "precio_inicial": return <SectionPrecioInicial op={op} precioActual={property.precio} onSave={patch} />;
      case "precio_actual":  return <SectionPrecioActual precio={property.precio} operacion={property.operacion} />;
      case "honorarios":     return <SectionHonorarios op={op} precioActual={property.precio} onSave={patch} />;
      case "documentos":     return <SectionDocumentos docs={docs} ref={property.ref} onAdd={d => setDocs(p => [d, ...p])} onDelete={id => setDocs(p => p.filter(x => x.id !== id))} />;
      case "historial":      return <SectionHistorial historial={hist} />;
      case "seguimiento":    return <SectionSeguimiento seg={seg} ref={property.ref} onAdd={e => setSeg(p => [e, ...p])} onDelete={id => setSeg(p => p.filter(x => x.id !== id))} />;
      case "visitas":        return <SectionVisitas vis={vis} ref={property.ref} onAdd={v => setVis(p => [v, ...p])} onDelete={id => setVis(p => p.filter(x => x.id !== id))} />;
      case "timeline":       return <SectionTimeline historial={hist} seguimiento={seg} visitas={vis} />;
      case "observaciones":  return <SectionObservaciones op={op} onSave={patch} />;
      default: return null;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link href="/admin/operaciones" className="text-[#444] hover:text-white transition-colors mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex gap-4 flex-1 min-w-0">
          {img
            ? <img src={img} alt="" className="w-20 h-14 object-cover shrink-0 bg-[#111]" />
            : <div className="w-20 h-14 bg-[#111] border border-[#1a1a1a] flex items-center justify-center shrink-0"><Home size={16} className="text-[#333]" /></div>
          }
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-white font-display text-xl leading-tight">{property.titulo}</h1>
              <span className="text-[#444] font-mono text-xs">REF {property.ref}</span>
              <span className={`px-2 py-0.5 text-xs uppercase tracking-wide font-body ${ESTADO_STYLE[op.estado]}`}>
                {ESTADO_LABEL[op.estado]}
              </span>
            </div>
            <p className="text-[#444] text-xs mt-1">
              {[property.ciudad, property.tipo, property.habitaciones ? `${property.habitaciones} hab.` : null, property.m2_construidos ? `${property.m2_construidos} m²` : null].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <Link href={`/propiedades/${property.slug}`} target="_blank" className="text-[#333] hover:text-[#C9B99A] transition-colors shrink-0" title="Ver en la web">
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Main layout */}
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <nav className="sticky top-20 space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors rounded-sm ${
                  activeSection === s.id
                    ? "text-[#C9B99A] bg-[#C9B99A]/8"
                    : "text-[#444] hover:text-[#888] hover:bg-[#111]"
                }`}
              >
                <s.icon size={12} className="shrink-0" />
                <span className="leading-tight">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
