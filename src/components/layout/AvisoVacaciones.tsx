"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { TextosAviso } from "@/lib/aviso-vacaciones";

/**
 * Barra fina de «estamos de vacaciones» dentro de la cabecera fija.
 * Se configura desde Ora (Reglas → Web) o el /admin: /api/vacaciones ya
 * devuelve el aviso filtrado por su ventana [desde, hasta) y con los textos
 * montados en los 4 idiomas — aquí solo se elige el del idioma activo.
 * Se pliega al hacer scroll para no comerse pantalla — las páginas compensan
 * la navbar con pt-20 y esta barra solo se superpone en el primer tramo,
 * donde todas tienen aire de sobra.
 */
export default function AvisoVacaciones({ scrolled }: { scrolled: boolean }) {
  const { lang } = useLanguage();
  const [textos, setTextos] = useState<TextosAviso | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/vacaciones")
      .then((r) => (r.ok ? r.json() : null))
      .then((aviso) => {
        if (cancel || !aviso?.activo || !aviso.textos) return;
        setTextos(aviso.textos);
      })
      .catch(() => {});
    return () => { cancel = true; };
  }, []);

  if (!textos) return null;

  return (
    <div
      className={cn(
        "overflow-hidden transition-[max-height] duration-500",
        scrolled ? "max-h-0" : "max-h-16"
      )}
    >
      <p className="bg-[#C9B99A] text-black text-center text-[10px] lg:text-[11px] font-body tracking-[0.14em] uppercase px-4 py-2">
        {textos[lang]}
      </p>
    </div>
  );
}
