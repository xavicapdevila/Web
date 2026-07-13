"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/config";
import { venderContent } from "@/lib/vender-content";
import { captureAttribution, getAttribution, getClickIds } from "@/lib/attribution";
import { useTurnstile } from "@/hooks/useTurnstile";
import { MUNICIPIOS_CATALUNYA } from "@/lib/catalunya-municipios";

/* ─────────────────────────────────────────────────────────────────────
   Formulario de captación MULTI-PASO (3 micro-pasos):
     1) ¿Dónde está la vivienda?  → pregunta fácil, sin compromiso
     2) ¿En qué punto estás?      → un toque y avanza solo
     3) Contacto                  → nombre + teléfono + email
   Mismo circuito de envío que LeadForm (POST /api/vender-lead, Pixel
   Lead + eventId compartido con CAPI, GA4 generate_lead, atribución,
   WhatsApp tras enviar). Todos los inputs permanecen montados (ocultos
   por paso) para que FormData recoja el formulario completo.
   ───────────────────────────────────────────────────────────────────── */

type Status = "idle" | "sending" | "ok" | "error";

const MINOR_WORDS = new Set(["de", "del", "la", "las", "los", "le", "i", "y", "o", "en", "d", "da", "di"]);
function capWords(s: string): string {
  let first = true;
  return s.replace(/\p{L}+/gu, (w) => {
    const isFirst = first;
    first = false;
    if (!isFirst && MINOR_WORDS.has(w.toLocaleLowerCase("es"))) return w;
    return w.charAt(0).toLocaleUpperCase("es") + w.slice(1);
  });
}

// Comparación sin acentos ni mayúsculas para el autocompletado de población.
function normalizeZone(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es").trim();
}

// Zona de trabajo: se prioriza en las sugerencias (ya normalizada).
const LOCAL_PRIORITY = new Set([
  "vilanova i la geltru", "sant pere de ribes", "sitges", "cubelles", "canyelles",
  "olivella", "cunit", "calafell", "el vendrell", "vilafranca del penedes",
  "castelldefels", "barcelona",
]);

function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LeadFormSteps({ source = "vender", submitLabel, askPrice = false }: { source?: string; submitLabel?: string; askPrice?: boolean }) {
  const { lang } = useLanguage();
  const full = venderContent[lang] ?? venderContent.es;
  const c = full.form;
  const bullets = full.contact.bullets;

  const [step, setStep] = useState(0); // 0: zona · 1: situación · 2: contacto
  const [zone, setZone] = useState("");
  const [zoneOpen, setZoneOpen] = useState(false);
  const [situation, setSituation] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState({ name: "", phone: "" }); // para personalizar el éxito y el WhatsApp
  const turnstile = useTurnstile();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Sugerencias del catálogo de municipios de Catalunya: solo tras 2+ letras,
  // sin la coincidencia exacta ya escrita, máx. 6, priorizando prefijo y zona
  // local. El campo admite cualquier texto igualmente (texto libre).
  const nZone = normalizeZone(zone);
  const zoneMatches =
    nZone.length < 2
      ? []
      : MUNICIPIOS_CATALUNYA
          .map((m) => ({ m, n: normalizeZone(m) }))
          .filter(({ n }) => n !== nZone && n.includes(nZone))
          .sort((a, b) => {
            const ap = a.n.startsWith(nZone) ? 0 : 1;
            const bp = b.n.startsWith(nZone) ? 0 : 1;
            if (ap !== bp) return ap - bp;
            const al = LOCAL_PRIORITY.has(a.n) ? 0 : 1;
            const bl = LOCAL_PRIORITY.has(b.n) ? 0 : 1;
            if (al !== bl) return al - bl;
            return a.n.localeCompare(b.n);
          })
          .slice(0, 6)
          .map(({ m }) => m);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const eventId = newEventId();
    const attribution = getAttribution();
    const clickIds = getClickIds();

    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      if (w.fbq) w.fbq("track", "Lead", { content_name: source, content_category: situation }, { eventID: eventId });
    } catch {}

    const turnstileToken = await turnstile.getToken();

    const cleanName = capWords(String(fd.get("name") ?? ""));
    const phoneVal = String(fd.get("phone") ?? "");
    setSent({ name: cleanName, phone: phoneVal });

    const payload = {
      situation,
      turnstileToken,
      name: cleanName,
      phone: phoneVal,
      email: fd.get("email"),
      zone: capWords(zone),
      precio: askPrice ? String(fd.get("precio") ?? "").trim() : "",
      consent: fd.get("consent") === "on", // RGPD (la casilla es obligatoria)
      message: "",
      source,
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
    const firstName = sent.name.trim().split(/\s+/)[0] || "";
    // Mensaje de WhatsApp con el contacto ya escrito (incluye su teléfono).
    const waMsg =
      `Hola 👋 Soy ${sent.name || "un propietario"}. Acabo de rellenar el formulario de vuestra web para vender mi casa.` +
      (sent.phone ? ` Mi teléfono: ${sent.phone}.` : "");
    return (
      <div className="bg-white rounded-2xl p-9 sm:p-12 text-center shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#ECE9E1] text-[#16150F]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M5 12.5l4 4 10-10" /></svg>
        </div>
        <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#16150F] mt-6">{firstName ? `¡Gracias, ${firstName}!` : c.okTitle}</h3>
        <p className="text-[#5c584e] text-[15px] leading-relaxed mt-3 max-w-md mx-auto">{c.okText}</p>
        <a
          href={`${siteConfig.whatsappUrl}?text=${encodeURIComponent(waMsg)}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3.5 shadow-[0_14px_30px_-12px_rgba(37,211,102,0.6)] hover:brightness-105 transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
            <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
            <path d="M12.05 2.5A9.45 9.45 0 0 0 3.9 16.73L2.5 21.5l4.9-1.29a9.45 9.45 0 1 0 4.65-17.71Zm0 17.1a7.65 7.65 0 0 1-3.9-1.07l-.28-.16-2.9.76.77-2.83-.18-.29a7.65 7.65 0 1 1 6.49 3.59Z" />
          </svg>
          {c.whatsappCta}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-9 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]">
      {/* progreso */}
      <div className="flex items-center gap-2 mb-6" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-[#16150F]" : "bg-[#E7E4DB]"}`} />
        ))}
      </div>

      <div ref={cardRef}>
        {/* ── Paso 1: zona ─────────────────────────────────────────── */}
        <div className={step === 0 ? "" : "hidden"}>
          <div>
            <label htmlFor="tvh-zone-step" className="block text-[19px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#16150F]">{c.zonePh}</label>
            {/* Autocompletado propio (sin <datalist>, que abría la lista entera al
                enfocar). Solo sugiere tras 2+ letras y admite cualquier población
                escrita a mano — texto libre. */}
            <div className="relative mt-4">
              <input
                id="tvh-zone-step" name="zone" autoComplete="off" autoCapitalize="words"
                role="combobox" aria-expanded={zoneOpen && zoneMatches.length > 0} aria-autocomplete="list"
                value={zone}
                onChange={(e) => { setZone(e.target.value); setZoneOpen(true); }}
                onFocus={() => setZoneOpen(true)}
                onBlur={(e) => setZone(capWords(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); if (zone.trim()) { setZoneOpen(false); next(); } }
                  else if (e.key === "Escape") setZoneOpen(false);
                }}
                placeholder={c.zone}
                className="w-full rounded-xl border border-[#E7E4DB] bg-white px-4 py-3.5 text-[16px] text-[#16150F] placeholder:text-[#B4AF9F] focus:border-[#16150F] focus:outline-none transition-colors"
              />
              {zoneOpen && zoneMatches.length > 0 && (
                <ul role="listbox" className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#E7E4DB] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]">
                  {zoneMatches.map((z) => (
                    <li key={z} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // no perder el foco antes del click
                        onClick={() => { setZone(z); setZoneOpen(false); }}
                        className="block w-full text-left px-4 py-2.5 text-[15px] text-[#16150F] hover:bg-[#F4F2ED] transition-colors"
                      >
                        {z}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button type="button" disabled={!zone.trim()} onClick={next}
            className="mt-5 w-full rounded-full bg-[#16150F] text-white text-[15px] font-medium py-3.5 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>

        {/* ── Paso 2: situación ────────────────────────────────────── */}
        <div className={step === 1 ? "" : "hidden"}>
          <p className="text-[19px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#16150F]">{c.situationLegend}</p>
          <div className="grid gap-2.5 mt-4">
            {c.situations.map((s) => (
              <button type="button" key={s.key}
                onClick={() => { setSituation(s.key); next(); }}
                className={`text-left rounded-xl border p-4 transition-colors duration-200 ${situation === s.key ? "border-[#16150F] bg-[#FAFAF7]" : "border-[#E7E4DB] hover:border-[#16150F]"}`}>
                <span className="block font-medium text-[15px] text-[#16150F]">{s.label}</span>
                <span className="block text-[13px] text-[#8A8578] mt-0.5">{s.hint}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={back} className="mt-4 text-[13px] text-[#8A8578] underline underline-offset-4 hover:text-[#16150F] transition-colors">Atrás</button>
        </div>

        {/* ── Paso 3: contacto ─────────────────────────────────────── */}
        <div className={step === 2 ? "" : "hidden"}>
          <p className="text-[19px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#16150F]">{full.contact.eyebrow}</p>
          {/* Cada campo con su etiqueta encima: se ve claro qué va en cada sitio. */}
          <div className="grid gap-4 mt-4">
            {askPrice && (
              <label className="block">
                <span className="block text-[13px] font-medium text-[#16150F] mb-1.5">{c.priceLabel}</span>
                <input name="precio" inputMode="numeric" autoComplete="off" placeholder={c.pricePh}
                  className="w-full rounded-xl border border-[#E7E4DB] bg-white px-4 py-3.5 text-[16px] text-[#16150F] placeholder:text-[#B4AF9F] focus:border-[#16150F] focus:outline-none transition-colors" />
              </label>
            )}
            <label className="block">
              <span className="block text-[13px] font-medium text-[#16150F] mb-1.5">{c.name}</span>
              <input name="name" required={step === 2} placeholder={c.namePh} autoComplete="name" autoCapitalize="words"
                onBlur={(e) => { e.target.value = capWords(e.target.value); }}
                className="w-full rounded-xl border border-[#E7E4DB] bg-white px-4 py-3.5 text-[16px] text-[#16150F] placeholder:text-[#B4AF9F] focus:border-[#16150F] focus:outline-none transition-colors" />
            </label>
            <label className="block">
              <span className="block text-[13px] font-medium text-[#16150F] mb-1.5">{c.phone}</span>
              <input name="phone" required={step === 2} type="tel" placeholder={c.phonePh} autoComplete="tel"
                className="w-full rounded-xl border border-[#E7E4DB] bg-white px-4 py-3.5 text-[16px] text-[#16150F] placeholder:text-[#B4AF9F] focus:border-[#16150F] focus:outline-none transition-colors" />
            </label>
            <label className="block">
              <span className="block text-[13px] font-medium text-[#16150F] mb-1.5">{c.email}</span>
              <input name="email" required={step === 2} type="email" placeholder={c.emailPh} autoComplete="email"
                className="w-full rounded-xl border border-[#E7E4DB] bg-white px-4 py-3.5 text-[16px] text-[#16150F] placeholder:text-[#B4AF9F] focus:border-[#16150F] focus:outline-none transition-colors" />
            </label>
          </div>
          {/* RGPD: casilla de consentimiento OBLIGATORIA (required) — el
              navegador bloquea el envío si no está marcada. */}
          <label className="flex items-start gap-2.5 mt-5 cursor-pointer">
            <input type="checkbox" name="consent" required={step === 2}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#16150F] cursor-pointer" />
            <span className="text-[12px] text-[#6a665c] leading-snug">
              {c.consentCheck} <a href="/privacidad" target="_blank" rel="noopener" className="underline hover:text-[#16150F]">{c.consentLink}</a>.
            </span>
          </label>
          <button type="submit" disabled={status === "sending"}
            className="mt-4 w-full rounded-full bg-[#16150F] text-white text-[15px] font-semibold py-4 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {status === "sending" ? c.sending : (submitLabel ?? c.submit)}
          </button>
          {status === "error" && (
            <p className="text-sm text-[#B4443A] mt-3" role="alert">
              {c.error}<a href="mailto:info@thevilahome.com" className="underline">info@thevilahome.com</a>.
            </p>
          )}
          <button type="button" onClick={back} className="mt-3 text-[13px] text-[#8A8578] underline underline-offset-4 hover:text-[#16150F] transition-colors">Atrás</button>
          <p className="text-[11px] text-[#A8A294] leading-relaxed mt-4">
            {c.consentAfter.replace(/^\.\s*/, "")}
          </p>
        </div>
      </div>

      {/* Turnstile invisible + honeypot */}
      <div ref={turnstile.containerRef} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />

      {/* micro-confianza (copy ya aprobado de vender-content) */}
      <ul className="mt-6 pt-5 border-t border-[#EEEBE3] space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-[12px] text-[#8A8578]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#16150F] shrink-0"><path d="M5 12.5l4 4 10-10" /></svg>
            {b}
          </li>
        ))}
      </ul>
    </form>
  );
}
