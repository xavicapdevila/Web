"use client";

/**
 * Pantalla de procesamiento: una pausa honesta mientras "se prepara" el
 * diagnóstico. Los mensajes describen lo que el motor hace de verdad — nada
 * de "analizando miles de variables". El cálculo real es instantáneo; la
 * espera solo da ritmo a la experiencia.
 */

import { useEffect, useState } from "react";

const MENSAJES = [
  "Revisando las características de la vivienda.",
  "Comparando el precio indicado.",
  "Analizando su preparación para salir al mercado.",
  "Preparando el diagnóstico inicial.",
];

const MS_POR_MENSAJE = 1050;

export default function Procesando({ onTerminar }: { onTerminar: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible < MENSAJES.length - 1) {
      const t = setTimeout(() => setVisible((v) => v + 1), MS_POR_MENSAJE);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onTerminar, MS_POR_MENSAJE);
    return () => clearTimeout(t);
  }, [visible, onTerminar]);

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 sm:px-6"
      role="status"
      aria-live="polite"
    >
      {/* Anillo cónico esmeralda: gira sobre sí mismo, quieto en su sitio */}
      <span
        aria-hidden
        className="h-14 w-14 animate-spin rounded-full motion-reduce:animate-none"
        style={{
          animationDuration: "1.2s",
          background: "conic-gradient(from 0deg, transparent 15%, #34D399 60%, #14B8A6 100%)",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 4px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 4px))",
          filter: "drop-shadow(0 0 14px rgba(52,211,153,0.45))",
        }}
      />
      {/* Altura fija para los 4 mensajes: al aparecer texto no se recoloca nada */}
      <ol className="mt-12 h-44 space-y-3.5 text-center">
        {MENSAJES.slice(0, visible + 1).map((mensaje, i) => (
          <li
            key={mensaje}
            className={`text-[15px] tracking-[-0.01em] transition-colors duration-500 motion-safe:animate-[dx-fade-up_0.5s_ease-out_both] ${
              i === visible ? "text-[#EDF2EF]" : "text-[#5C6B65]"
            }`}
          >
            {mensaje}
          </li>
        ))}
      </ol>
    </div>
  );
}
