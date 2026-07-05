"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { venderContent } from "@/lib/vender-content";
import { captureAttribution, getAttribution, getClickIds } from "@/lib/attribution";
import { useTurnstile } from "@/hooks/useTurnstile";

type Status = "idle" | "sending" | "ok" | "error";

/** Genera un id único para deduplicar el evento entre Pixel y Conversions API. */
function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LeadForm({ source = "vender" }: { source?: string }) {
  const { lang } = useLanguage();
  const c = (venderContent[lang] ?? venderContent.es).form;

  const [situation, setSituation] = useState(c.situations[0].key);
  const [status, setStatus] = useState<Status>("idle");
  const turnstile = useTurnstile();

  // Al montar la landing: persistir de qué campaña/anuncio viene el visitante.
  useEffect(() => {
    captureAttribution();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const eventId = newEventId();
    const attribution = getAttribution();
    const clickIds = getClickIds();

    // Dispara el evento Lead en el Pixel del navegador con el mismo eventId que
    // enviará el servidor por la Conversions API → Meta deduplica.
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      if (w.fbq) {
        w.fbq("track", "Lead", { content_name: source, content_category: situation }, { eventID: eventId });
      }
    } catch {}

    // Captcha invisible (no-op hasta que Turnstile esté configurado).
    const turnstileToken = await turnstile.getToken();

    const payload = {
      situation,
      turnstileToken,
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      zone: fd.get("zone"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
      lang,
      eventId,
      attribution,
      clickIds,
      sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      const res = await fetch("/api/vender-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      // Evento de conversión en GA4 (si el visitante aceptó analítica). Desde
      // Google Ads se importa «generate_lead» como conversión de las campañas.
      try {
        const w = window as unknown as { gtag?: (...a: unknown[]) => void };
        w.gtag?.("event", "generate_lead", { lead_source: source, lead_situation: situation });
      } catch {}
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border border-[#E6E7E1] rounded-2xl p-10 lg:p-12 text-center">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#E6E1D6] text-[#1C1913]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M5 12.5l4 4 10-10" />
          </svg>
        </div>
        <h3 className="font-dm-serif text-3xl text-[#1A1A18] mt-6">{c.okTitle}</h3>
        <p className="text-[#5A564E] leading-relaxed mt-3 max-w-md mx-auto text-center">{c.okText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E6E7E1] rounded-2xl p-7 sm:p-9 lg:p-10 shadow-[0_30px_70px_-40px_rgba(26,26,24,0.35)]">
      {/* Situación — tipo «lead form» */}
      <fieldset>
        <legend className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#A8A294]">
          {c.situationLegend}
        </legend>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {c.situations.map((s) => {
            const active = situation === s.key;
            return (
              <button
                type="button"
                key={s.key}
                onClick={() => setSituation(s.key)}
                aria-pressed={active}
                className={`text-left rounded-xl border p-4 transition-colors duration-200 ${
                  active
                    ? "border-[#1A1A18] bg-[#FAFAF7]"
                    : "border-[#E4E2DB] hover:border-[#1C1913]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-full border ${
                      active ? "border-[#1C1913]" : "border-[#C7BFB0]"
                    }`}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-[#1A1A18]" />}
                  </span>
                  <span className="font-medium text-[15px] text-[#1A1A18]">{s.label}</span>
                </span>
                <span className="block text-[13px] text-[#8A8578] mt-1.5 ml-[26px] text-left">{s.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Campos */}
      <div className="grid sm:grid-cols-2 gap-4 mt-7">
        <Field name="name" label={c.name} placeholder={c.namePh} required autoComplete="name" />
        <Field name="phone" label={c.phone} placeholder={c.phonePh} required type="tel" autoComplete="tel" />
        <div className="sm:col-span-2">
          <Field name="email" label={c.email} placeholder={c.emailPh} required type="email" autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <Field name="zone" label={c.zone} placeholder={c.zonePh} required autoComplete="address-level2" />
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="text-[13px] font-medium text-[#3A382F]">
              {c.message} <span className="text-[#A8A294] font-normal">{c.optional}</span>
            </span>
            <textarea
              name="message"
              rows={3}
              placeholder={c.messagePh}
              className="mt-1.5 w-full rounded-xl border border-[#E6E7E1] bg-white px-4 py-3 text-[15px] text-[#1A1A18] placeholder:text-[#B4AF9F] focus:border-[#1A1A18] focus:outline-none transition-colors resize-none"
            />
          </label>
        </div>
      </div>

      {/* Turnstile invisible (no renderiza UI; requiere claves en el entorno) */}
      <div ref={turnstile.containerRef} />

      {/* Honeypot (oculto para humanos) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      <div className="mt-7">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full sm:w-auto rounded-full bg-[#1C1913] text-white text-sm font-semibold px-8 py-4 hover:bg-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? c.sending : c.submit}
        </button>
        {status === "error" && (
          <p className="text-sm text-[#B4443A] mt-4" role="alert">
            {c.error}
            <a href="mailto:info@thevilahome.com" className="underline">info@thevilahome.com</a>.
          </p>
        )}
        <p className="text-xs text-[#A8A294] leading-relaxed mt-4">
          {c.consent}
          <a href="/privacidad" className="underline hover:text-[#1A1A18]">{c.consentLink}</a>
          {c.consentAfter}
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  optionalText,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  optionalText?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[#3A382F]">
        {label} {optionalText && <span className="text-[#A8A294] font-normal">{optionalText}</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-[#E6E7E1] bg-white px-4 py-3 text-[15px] text-[#1A1A18] placeholder:text-[#B4AF9F] focus:border-[#1A1A18] focus:outline-none transition-colors"
      />
    </label>
  );
}
