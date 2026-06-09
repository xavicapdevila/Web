"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, Check, MapPin, X } from "lucide-react";
import type { FloorPlanPin, PropertyImage } from "@/types/property";

interface Props {
  ref_: string;
  titulo: string;
  planoUrl: string;
  imagenes: PropertyImage[];
  initialPins: FloorPlanPin[];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function PlanoEditor({ ref_, titulo, planoUrl, imagenes, initialPins }: Props) {
  const router = useRouter();
  const [pins, setPins] = useState<FloorPlanPin[]>(initialPins);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const activePin = pins.find(p => p.id === activePinId) ?? null;

  // All unique eti values from imagenes (excluding "plano" and "360")
  const allEtis = Array.from(
    new Set(imagenes.map(i => i.eti).filter((e): e is string => Boolean(e) && e !== "plano" && e !== "360"))
  ).sort();

  // URLs already assigned to any pin
  const assignedUrls = new Set(pins.flatMap(p => p.fotos));

  // Etis where NOT all images are assigned yet
  const pendingEtis = allEtis.filter(eti =>
    imagenes.filter(i => i.eti === eti).some(i => !assignedUrls.has(i.url))
  );

  // Click on "Añadir pin" → create new pin at center of floor plan, select it
  const addPinAtCenter = useCallback(() => {
    const newPin: FloorPlanPin = { id: uid(), x: 50, y: 50, label: "", fotos: [] };
    setPins(prev => [...prev, newPin]);
    setActivePinId(newPin.id);
  }, []);

  // Handle click on floor plan — moves the active pin to the clicked position
  const handlePlanoClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!activePinId) return;
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPins(prev => prev.map(p => p.id === activePinId ? { ...p, x, y } : p));
  }, [activePinId]);

  const updateActiveLabel = (label: string) => {
    if (!activePinId) return;
    setPins(prev => prev.map(p => p.id === activePinId ? { ...p, label } : p));
  };

  const toggleFoto = (url: string) => {
    if (!activePinId) return;
    setPins(prev => prev.map(p => {
      if (p.id !== activePinId) return p;
      const has = p.fotos.includes(url);
      return { ...p, fotos: has ? p.fotos.filter(f => f !== url) : [...p.fotos, url] };
    }));
  };

  const deleteActive = () => {
    if (!activePinId) return;
    setPins(prev => prev.filter(p => p.id !== activePinId));
    setActivePinId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/properties/${ref_}/plano-pins`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pins }),
      });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  // Images to show in the selector panel (all images of selected eti)
  const panelEti    = activePin?.label ?? "";
  const panelImages = panelEti
    ? imagenes.filter(i => i.eti === panelEti)
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/propiedades")}
            className="text-[#555] hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-white text-sm font-body">{titulo}</p>
            <p className="text-[#555] text-xs">{ref_} — Editor de plano interactivo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#444] text-xs">{pins.length} pins · {pendingEtis.length} etiquetas pendientes</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#C9B99A] text-black text-xs font-body tracking-widest uppercase px-5 py-2.5 hover:bg-[#DDD0BB] transition-colors disabled:opacity-50"
          >
            {savedOk ? <Check size={13} /> : <Save size={13} />}
            {savedOk ? "Guardado" : saving ? "Guardando…" : "Guardar fotoplano"}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel ── */}
        <div className="w-80 shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0d0d0d]">
          {/* Add pin button */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <button
              onClick={addPinAtCenter}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-body tracking-widest uppercase border border-[#2a2a2a] text-[#888] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
            >
              <Plus size={13} />
              Añadir pin
            </button>
          </div>

          {activePin ? (
            <div className="flex-1 overflow-y-auto">
              {/* Pin label selector */}
              <div className="p-4 border-b border-[#1a1a1a]">
                <p className="text-[#555] text-[10px] uppercase tracking-widest mb-2">Etiqueta del pin</p>
                <select
                  value={activePin.label}
                  onChange={e => updateActiveLabel(e.target.value)}
                  className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 outline-none focus:border-[#C9B99A]/50 transition-colors"
                >
                  <option value="">— Selecciona estancia —</option>
                  {allEtis.map(eti => {
                    const isPending = pendingEtis.includes(eti);
                    return (
                      <option key={eti} value={eti} disabled={!isPending && activePin.label !== eti}>
                        {eti}{!isPending && activePin.label !== eti ? " ✓" : ""}
                      </option>
                    );
                  })}
                </select>
                {activePin.label && (
                  <p className="text-[#555] text-[10px] mt-1.5">
                    {imagenes.filter(i => i.eti === activePin.label).length} fotos en total
                  </p>
                )}
              </div>

              {/* Photo selector */}
              {panelImages.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#555] text-[10px] uppercase tracking-widest">Selecciona fotos</p>
                    <button
                      onClick={() => {
                        if (!activePinId) return;
                        const allSelected = panelImages.every(i => activePin.fotos.includes(i.url));
                        setPins(prev => prev.map(p => {
                          if (p.id !== activePinId) return p;
                          return {
                            ...p,
                            fotos: allSelected
                              ? p.fotos.filter(f => !panelImages.some(i => i.url === f))
                              : [...new Set([...p.fotos, ...panelImages.map(i => i.url)])],
                          };
                        }));
                      }}
                      className="text-[#555] hover:text-[#C9B99A] text-[10px] transition-colors"
                    >
                      {panelImages.every(i => activePin.fotos.includes(i.url)) ? "Deseleccionar todo" : "Seleccionar todo"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {panelImages.map(img => {
                      const selected = activePin.fotos.includes(img.url);
                      const inOtherPin = !selected && assignedUrls.has(img.url);
                      return (
                        <button
                          key={img.url}
                          onClick={() => toggleFoto(img.url)}
                          className={`relative aspect-[4/3] overflow-hidden transition-all ${
                            selected
                              ? "ring-2 ring-[#C9B99A] opacity-100"
                              : inOtherPin
                                ? "opacity-30 cursor-default"
                                : "opacity-60 hover:opacity-90"
                          }`}
                          title={inOtherPin ? "Asignada a otro pin" : ""}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          {selected && (
                            <div className="absolute top-1 right-1 bg-[#C9B99A] rounded-full p-0.5">
                              <Check size={8} className="text-black" />
                            </div>
                          )}
                          {inOtherPin && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <MapPin size={12} className="text-[#C9B99A]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MapPin size={24} className="text-[#222] mb-3" />
              <p className="text-[#555] text-xs">
                {pins.length === 0
                  ? "Haz click en \"Añadir pin\" para crear el primer pin en el centro del plano."
                  : "Haz click en un pin del plano para editarlo, o añade uno nuevo."}
              </p>
            </div>
          )}

          {/* Delete active pin */}
          {activePin && (
            <div className="p-4 border-t border-[#1a1a1a]">
              <button
                onClick={deleteActive}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#666] hover:text-red-400 border border-[#1a1a1a] hover:border-red-400/30 transition-colors"
              >
                <Trash2 size={12} />
                Eliminar pin
              </button>
            </div>
          )}
        </div>

        {/* ── Floor plan ── */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div
            ref={imgRef}
            onClick={handlePlanoClick}
            className={`relative inline-block max-w-full max-h-full ${
              activePinId ? "cursor-move" : "cursor-default"
            }`}
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={planoUrl}
              alt="Plano"
              className="max-w-full max-h-full object-contain block"
              style={{ maxHeight: "calc(100vh - 120px)" }}
              draggable={false}
            />

            {/* Pins overlay */}
            {pins.map(pin => {
              const isActive = pin.id === activePinId;
              return (
                <div
                  key={pin.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
                    isActive ? "z-20" : "z-10 hover:z-20"
                  }`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  {/* × delete button — visible on hover or when active */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPins(prev => prev.filter(p => p.id !== pin.id));
                      if (activePinId === pin.id) setActivePinId(null);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#444] hover:bg-red-500 rounded-full flex items-center justify-center text-white z-30 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar pin"
                  >
                    <X size={8} />
                  </button>

                  {/* Pin circle + label */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePinId(isActive ? null : pin.id);
                    }}
                    className="flex flex-col items-center gap-0.5 transition-all"
                    title={pin.label || "Sin etiqueta"}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                      isActive
                        ? "bg-[#C9B99A] border-white scale-125"
                        : "bg-[#1a1a1a]/90 border-[#C9B99A] group-hover:scale-110"
                    }`}>
                      {/* Camera icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#000" : "#C9B99A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    {pin.label && (
                      <span className={`text-[10px] font-body whitespace-nowrap px-1.5 py-0.5 rounded shadow ${
                        isActive ? "bg-[#C9B99A] text-black" : "bg-black/80 text-white"
                      }`}>
                        {pin.label} ({pin.fotos.length})
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
