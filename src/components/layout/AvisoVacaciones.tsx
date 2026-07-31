"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

/**
 * Barra fina de «estamos de vacaciones» dentro de la cabecera fija.
 * Se configura desde /admin (Blob vía /api/vacaciones): si no está activo o ya
 * pasó la fecha de vuelta, no renderiza nada. Se pliega al hacer scroll para
 * no comerse pantalla — las páginas compensan la navbar con pt-20 y esta barra
 * solo se superpone en el primer tramo, donde todas tienen aire de sobra.
 */

const LOCALE: Record<Lang, string> = { es: "es-ES", ca: "ca-ES", en: "en-GB", fr: "fr-FR" };

const CON_FECHA: Record<Lang, (f: string) => string> = {
  es: (f) => `Estamos de vacaciones. Volvemos el ${f} — te respondemos entonces.`,
  ca: (f) => `Estem de vacances. Tornem el ${f} — et respondrem llavors.`,
  en: (f) => `We are on holiday. Back on ${f} — we will reply then.`,
  fr: (f) => `Nous sommes en vacances. De retour le ${f} — nous vous répondrons alors.`,
};

const SIN_FECHA: Record<Lang, string> = {
  es: "Estamos de vacaciones. Te respondemos a la vuelta.",
  ca: "Estem de vacances. Et respondrem quan tornem.",
  en: "We are on holiday. We will reply when we are back.",
  fr: "Nous sommes en vacances. Nous vous répondrons à notre retour.",
};

export default function AvisoVacaciones({ scrolled }: { scrolled: boolean }) {
  const { lang } = useLanguage();
  const [vuelta, setVuelta] = useState<string | null>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let cancel = false;
    fetch("/api/vacaciones")
      .then((r) => (r.ok ? r.json() : null))
      .then((aviso) => {
        if (cancel || !aviso?.activo) return;
        setActivo(true);
        setVuelta(typeof aviso.vuelta === "string" ? aviso.vuelta : null);
      })
      .catch(() => {});
    return () => { cancel = true; };
  }, []);

  if (!activo) return null;

  let texto = SIN_FECHA[lang];
  if (vuelta) {
    // Mediodía para que la fecha no retroceda un día en ninguna zona horaria
    const fecha = new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "long" })
      .format(new Date(`${vuelta}T12:00:00`));
    texto = CON_FECHA[lang](fecha);
  }

  return (
    <div
      className={cn(
        "overflow-hidden transition-[max-height] duration-500",
        scrolled ? "max-h-0" : "max-h-16"
      )}
    >
      <p className="bg-[#C9B99A] text-black text-center text-[10px] lg:text-[11px] font-body tracking-[0.14em] uppercase px-4 py-2">
        {texto}
      </p>
    </div>
  );
}
