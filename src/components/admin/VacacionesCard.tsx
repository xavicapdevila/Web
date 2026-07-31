"use client";

import { useState } from "react";
import { Plane } from "lucide-react";
import { textosAviso, type AvisoVacaciones } from "@/lib/aviso-vacaciones";

/**
 * Tarjeta del dashboard para el aviso de vacaciones de la web pública.
 * Guarda en Blob vía PUT /api/admin/vacaciones; la barra solo se ve dentro de
 * la ventana [desde, hasta] (hora de Madrid) y se retira sola al terminar.
 * Normalmente se maneja desde Ora (Reglas → Web); esta tarjeta es el mando
 * de reserva dentro de la propia web.
 */
export default function VacacionesCard({ inicial }: { inicial: AvisoVacaciones }) {
  const [activo, setActivo] = useState(inicial.activo);
  const [desde, setDesde] = useState(inicial.desde ?? "");
  const [hasta, setHasta] = useState(inicial.hasta ?? "");
  const [estado, setEstado] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function guardar() {
    setEstado("saving");
    try {
      const res = await fetch("/api/admin/vacaciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo, desde: desde || null, hasta: hasta || null }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setEstado("saved");
      setTimeout(() => setEstado("idle"), 2500);
    } catch {
      setEstado("error");
    }
  }

  const textos = textosAviso(hasta || null);

  return (
    <div className="border border-[#1a1a1a] bg-[#0d0d0d] mb-10">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#111]">
        <Plane size={13} className="text-[#444]" />
        <p className="text-[#666] text-xs tracking-widest uppercase font-body">Aviso de vacaciones</p>
      </div>
      <div className="px-6 py-5 flex flex-wrap items-end gap-6">
        <label className="flex items-center gap-3 cursor-pointer select-none pb-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="accent-[#C9B99A] w-4 h-4"
          />
          <span className="text-white text-sm">Mostrar el aviso en la web</span>
        </label>

        <div>
          <p className="text-[#444] text-xs tracking-widest uppercase font-body mb-2">Empieza (opcional)</p>
          <input
            type="datetime-local"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-[#111] border border-[#1a1a1a] text-white text-sm px-3 py-2 [color-scheme:dark] focus:border-[#C9B99A]/50 outline-none"
          />
        </div>

        <div>
          <p className="text-[#444] text-xs tracking-widest uppercase font-body mb-2">Día de vuelta (opcional)</p>
          <input
            type="datetime-local"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-[#111] border border-[#1a1a1a] text-white text-sm px-3 py-2 [color-scheme:dark] focus:border-[#C9B99A]/50 outline-none"
          />
        </div>

        <button
          onClick={guardar}
          disabled={estado === "saving"}
          className="px-6 py-2.5 text-xs font-body tracking-widest uppercase border border-[#C9B99A] text-[#C9B99A] hover:bg-[#C9B99A] hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
        >
          {estado === "saving" ? "Guardando…" : estado === "saved" ? "Guardado ✓" : "Guardar"}
        </button>

        {estado === "error" && (
          <p className="text-red-400 text-xs pb-2">No se pudo guardar. Prueba otra vez.</p>
        )}
      </div>

      {/* Vista previa: lo que pone la barra (la fecha de vuelta = el día del fin) */}
      <div className="px-6 pb-5">
        <p className="bg-[#C9B99A] text-black text-center text-[11px] font-body tracking-[0.14em] uppercase px-4 py-2">
          {textos.es}
        </p>
        <p className="text-[#444] text-xs mt-2">
          {textos.ca} · {textos.en} · {textos.fr}
        </p>
        <p className="text-[#444] text-xs mt-2">
          La barra sale en toda la web pública en el idioma de cada visitante. Dice «volvemos el» con el día
          de vuelta y se retira sola ese día a la hora puesta (hora de Madrid). Sin fechas, se ve mientras esté activada.
        </p>
      </div>
    </div>
  );
}
