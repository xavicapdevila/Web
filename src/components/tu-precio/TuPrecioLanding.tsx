"use client";

/**
 * Landing de la campaña Meta «Tu precio» — port 1:1 de la preview validada
 * (landing.html, jul 2026). El idioma viene fijado por la ruta (ES /tu-precio ·
 * CA /el-teu-preu); el toggle navega entre rutas conservando los query params.
 *
 * RGPD: el píxel de Meta lo carga CookieConsentProvider solo tras aceptar
 * marketing (cookie tvh_consent, 12 meses). Sin aceptar: cero requests a
 * Facebook — ni ViewContent ni Lead.
 */

import { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { captureAttribution, getAttribution, type Attribution } from "@/lib/attribution";
import {
  TP_COPY,
  TP_MARQUEE,
  TIMELINE_KEYS,
  type TpLang,
  type TpReviews,
} from "@/lib/tu-precio-copy";
import "./tu-precio.css";

const ROUTES: Record<TpLang, string> = { es: "/tu-precio", ca: "/el-teu-preu" };
const WHATSAPP = "34638359612";

/* Iniciales en mayúscula (regla global del proyecto), respetando partículas
   («de», «la», «i»…). Copia local: LeadForm tiene la suya pero está en obras
   en otra rama de trabajo y no la exporta. */
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

/** Id único compartido entre el Pixel (navegador) y la Conversions API
    (servidor) para que Meta deduplique el evento Lead. */
function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function fbqTrack(event: string, data: Record<string, unknown>, opts?: Record<string, unknown>) {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    w.fbq?.("track", event, data, opts);
  } catch {}
}

/* Wordmark real de The Vila Home (el de la marca; no inventar logos). */
function Wordmark() {
  return (
    <svg role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327.57 104.09" fill="currentColor">
      <path d="M24.72,39h19.1v2.11H35.51V65.2H33V41.06H24.72Z" />
      <path d="M47.32,65.2V39H49.8V50.21H65.33V39h2.48V65.2H65.33V52.33H49.8V65.2Z" />
      <path d="M73.68,65.2V39H91.14v2.11h-15v9.48H89.68v2.12H76.16V63.08H91.51V65.2Z" />
      <path d="M121.27,39H127L118,65.2h-5.18L104,39h5.86l5.7,19.92Z" />
      <path d="M135.23,65.2h-5.45V39h5.45Z" />
      <path d="M140.36,39h5.48V60.48h13.1V65.2H140.36Z" />
      <path d="M170.13,39h6.2l9.29,26.24h-6l-1.73-5.4h-9.66l-1.78,5.4h-5.74Zm-.36,16.32h6.72L173.17,45Z" />
      <path d="M197.71,65.2V39h5.45V49h10.2V39h5.45V65.2h-5.45V53.49h-10.2V65.2Z" />
      <path d="M244.28,62.87q-3,3.06-8.6,3.06t-8.59-3.06c-2.66-2.51-4-6.11-4-10.83s1.33-8.41,4-10.82q3-3.06,8.59-3.06t8.6,3.06q4,3.62,4,10.82C248.25,56.76,246.93,60.36,244.28,62.87Zm-3.42-4q1.9-2.4,1.91-6.84a10.75,10.75,0,0,0-1.91-6.82,6.27,6.27,0,0,0-5.18-2.42,6.33,6.33,0,0,0-5.19,2.41c-1.3,1.6-1.94,3.88-1.94,6.83s.64,5.24,1.94,6.84a6.8,6.8,0,0,0,10.37,0Z" />
      <path d="M269.84,39h7.89V65.2h-5.11V47.45c0-.51,0-1.22,0-2.14s0-1.63,0-2.13l-5,20h-5.33l-4.94-20c0,.5,0,1.21,0,2.13s0,1.63,0,2.14V65.2h-5.11V39h8l4.78,20.63Z" />
      <path d="M302.21,43.61H288.32v5.57h12.75v4.55H288.32v6.75h14.53V65.2H283V39h19.24Z" />
    </svg>
  );
}

/* Contador animado de la línea de datos. SSR pinta «0» (como la preview) pero
   reserva el ancho final (tabular-nums + min-width) → CLS 0. */
function CountN({ n, dec = 0 }: { n: number; dec?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(n);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const t0 = performance.now();
          const dur = 900;
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            el.textContent = fmt(n * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, dec]);

  return (
    <span ref={ref} className="num" style={{ minWidth: `${fmt(n).length}ch` }}>
      0
    </span>
  );
}

/* Reseña con recorte a 3 líneas + «Leer más» para que las tarjetas cuadren
   aunque el texto sea largo. El botón solo aparece si de verdad desborda. */
function Quote({
  text,
  author,
  more,
  less,
}: {
  text: string;
  author: string;
  more: string;
  less: string;
}) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div className="qt rv">
      <p ref={pRef} className={`qtx${open ? "" : " clamp"}`}>
        «{text}»
      </p>
      {overflows && (
        <button type="button" className="rmore" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? less : more}
        </button>
      )}
      <p className="qwho">
        <span className="st">★★★★★</span>
        {author.toUpperCase()} · GOOGLE
      </p>
    </div>
  );
}

export default function TuPrecioLanding({
  lang,
  reviews,
  fontClass,
}: {
  lang: TpLang;
  reviews: TpReviews;
  fontClass: string;
}) {
  const t = TP_COPY[lang];
  const other: TpLang = lang === "es" ? "ca" : "es";
  const { consent, saveConsent } = useCookieConsent();

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const muniOtroRef = useRef<HTMLInputElement>(null);
  const tipoOtroRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  /* ── Estado del formulario ── */
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = éxito
  const [priceRaw, setPriceRaw] = useState("");
  const [muni, setMuni] = useState<number | null>(null);
  const [tipo, setTipo] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [muniOtro, setMuniOtro] = useState("");
  const [tipoOtro, setTipoOtro] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [sending, setSending] = useState(false);
  const [errAt, setErrAt] = useState<{ step: number; msg: string } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [okSum, setOkSum] = useState("");
  const [waHref, setWaHref] = useState("");
  const [drawn, setDrawn] = useState(false);

  const [hdSc, setHdSc] = useState(false);
  const [ckShow, setCkShow] = useState(false);
  const [otherHref, setOtherHref] = useState(ROUTES[other]);
  const [cardVisible, setCardVisible] = useState(true);
  const nombreId = "tp-nombre";

  const isOtroMuni = muni === t.muni.length - 1;
  const isOtroTipo = tipo === t.tipo.length - 1;

  /* ── Efectos de página ── */

  // Atribución de campaña (primer contacto) + toggle de idioma con los query
  // params actuales (decisión cerrada: el cambio de idioma los conserva).
  // El layout raíz fija <html lang="es">; en la ruta CA lo corregimos.
  useEffect(() => {
    captureAttribution();
    document.documentElement.lang = lang;
    if (window.location.search) setOtherHref(ROUTES[other] + window.location.search);
  }, [lang, other]);

  // Revelado al hacer scroll de los .rv (el hero y la tarjeta usan .rv0, CSS puro).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll(".rv").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${Math.min(i % 6, 4) * 60}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Sombra del header al hacer scroll.
  useEffect(() => {
    const on = () => setHdSc(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // CTA del header: solo cuando la tarjeta del formulario no está a la vista.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const io = new IntersectionObserver((es) => setCardVisible(es[0].isIntersecting), {
      threshold: 0,
    });
    io.observe(card);
    return () => io.disconnect();
  }, []);

  // CRO: al completar las tres respuestas del paso 2 (sin «Otro» pendiente),
  // avanzamos solos — un toque menos.
  useEffect(() => {
    if (step !== 2 || muni === null || tipo === null || time === null) return;
    if (muni === t.muni.length - 1 && !muniOtro.trim()) return;
    if (tipo === t.tipo.length - 1 && !tipoOtro.trim()) return;
    const timer = setTimeout(() => toStep(3), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muni, tipo, time, muniOtro, tipoOtro]);

  // Foco al primer campo al entrar en el paso 3 (tras la animación del paso).
  useEffect(() => {
    if (step !== 3) return;
    const timer = setTimeout(() => document.getElementById(nombreId)?.focus(), 380);
    return () => clearTimeout(timer);
  }, [step]);

  // Banner de cookies: entra a los 700 ms si aún no hay decisión guardada.
  useEffect(() => {
    const timer = setTimeout(() => setCkShow(true), 700);
    return () => clearTimeout(timer);
  }, []);

  // ViewContent tras consentir marketing (el Provider ya cargó el píxel e hizo
  // init+PageView; el setTimeout deja que ese efecto corra primero).
  const vcSent = useRef(false);
  useEffect(() => {
    if (!consent?.marketing || vcSent.current) return;
    vcSent.current = true;
    const timer = setTimeout(
      () => fbqTrack("ViewContent", { content_name: "tu_precio", content_category: lang }),
      80,
    );
    return () => clearTimeout(timer);
  }, [consent, lang]);

  /* ── Navegación de pasos ── */

  function err(step: number, msg: string) {
    setErrAt({ step, msg });
    setShaking(true);
    window.setTimeout(() => setErrAt((e) => (e?.msg === msg ? null : e)), 3200);
  }

  function scrollToCard(block: ScrollLogicalPosition = "start") {
    cardRef.current?.scrollIntoView({ block, behavior: "smooth" });
  }

  function toStep(n: 1 | 2 | 3) {
    if (n === 2 && !(Number(priceRaw) > 0)) return err(1, t.e1);
    if (n === 3) {
      if (muni === null || tipo === null || time === null) return err(2, t.e2);
      if (isOtroMuni && !muniOtro.trim()) return err(2, t.eMuniOtro);
      if (isOtroTipo && !tipoOtro.trim()) return err(2, t.eTipoOtro);
    }
    setStep(n);
    scrollToCard();
  }

  function goTop() {
    scrollToCard("center");
    window.setTimeout(() => priceRef.current?.focus(), 420);
  }

  function selectOpt(kind: "muni" | "tipo" | "time", i: number) {
    if (kind === "muni") {
      setMuni(i);
      if (i === t.muni.length - 1) requestAnimationFrame(() => muniOtroRef.current?.focus());
    } else if (kind === "tipo") {
      setTipo(i);
      if (i === t.tipo.length - 1) requestAnimationFrame(() => tipoOtroRef.current?.focus());
    } else {
      setTime(i);
    }
  }

  /* ── Envío ── */

  async function submitLead() {
    if (sending) return;
    const name = capWords(nombre.trim());
    const telDigits = tel.replace(/\D/g, "");
    if (!name) return err(3, t.e3a);
    if (telDigits.length < 9) return err(3, t.e3b);
    if (!rgpd) return err(3, t.e3c);
    if (muni === null || tipo === null || time === null) return err(3, t.e2);

    const eventId = newEventId();
    const timeline = TIMELINE_KEYS[time];

    // Valores canónicos en ES para el payload, se envíe desde la ruta que sea.
    const municipio = isOtroMuni ? capWords(muniOtro.trim()) : TP_COPY.es.muni[muni];
    const tipoVal = isOtroTipo ? tipoOtro.trim() : TP_COPY.es.tipo[tipo];

    // La URL manda: los utm de ESTA visita pisan la cookie de primer contacto
    // (es la campaña que ha traído este lead). El fbclid lo filtra el servidor
    // si no hay consentimiento de marketing.
    const attribution: Attribution = { ...getAttribution() };
    const params = new URLSearchParams(window.location.search);
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const).forEach(
      (k) => {
        const v = params.get(k);
        if (v) attribution[k] = v.slice(0, 200);
      },
    );
    const fbclid = params.get("fbclid");
    if (fbclid) attribution.fbclid = fbclid.slice(0, 300);
    attribution.landing = window.location.pathname;

    // Cookies de matching del Pixel (solo existen si se aceptó marketing).
    const readCookie = (name: string) =>
      document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${name}=`))
        ?.split("=")
        .slice(1)
        .join("=");
    const clickIds = consent?.marketing
      ? { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") }
      : {};

    // Evento Lead en el Pixel con el mismo eventId que mandará el servidor por
    // la Conversions API → Meta deduplica. Solo existe fbq si hubo aceptación.
    fbqTrack(
      "Lead",
      { content_name: "tu_precio", content_category: timeline },
      { eventID: eventId },
    );

    setSending(true);
    try {
      const res = await fetch("/api/lead-tu-precio", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          precio_esperado: Number(priceRaw),
          municipio,
          tipo: tipoVal,
          timeline,
          nombre: name,
          telefono: telDigits,
          idioma: lang,
          website: hpRef.current?.value ?? "", // honeypot
          eventId,
          attribution,
          clickIds,
          sourceUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));

      const pFmt = Number(priceRaw).toLocaleString("es-ES");
      const muniShown = isOtroMuni ? capWords(muniOtro.trim()) : t.muni[muni];
      setOkSum(`${t.sumIn} ${pFmt} € · ${muniShown}`);
      setWaHref(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.waMsg(pFmt, muniShown))}`);
      setStep(4);
      scrollToCard();
      requestAnimationFrame(() => setTimeout(() => setDrawn(true), 60));
    } catch {
      err(3, t.eSend);
    } finally {
      setSending(false);
    }
  }

  /* ── Render ── */

  const pnum = step === 4 ? "✓" : `0${step}`;
  const pfill = step === 4 ? "100%" : `${step * 33.34}%`;

  const opts = (kind: "muni" | "tipo" | "time", labels: string[], sel: number | null) => (
    <div className="opts">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`opt${sel === i ? " sel" : ""}`}
          onClick={() => selectOpt(kind, i)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const errMsg = (n: number) => (
    <p className={`errmsg${errAt?.step === n ? " show" : ""}`} role="alert">
      {errAt?.step === n ? errAt.msg : ""}
    </p>
  );

  const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

  return (
    <div ref={rootRef} className={`tp ${fontClass}`}>
      <div className="blob" />

      <header className={hdSc ? "sc" : undefined}>
        <div className="hin">
          <a className="logo" href="#" aria-label="The Vila Home">
            <Wordmark />
          </a>
          <div className="hright">
            <button
              type="button"
              className={`hcta${!cardVisible && step !== 4 ? " show" : ""}`}
              onClick={goTop}
              tabIndex={!cardVisible && step !== 4 ? 0 : -1}
            >
              {t.hcta}
            </button>
            <a className="htel" href="tel:936061800">
              936 061 800
            </a>
            <div className="lang" role="group" aria-label="Idioma">
              {lang === "es" ? (
                <button type="button" className="on" aria-current="true">
                  ES
                </button>
              ) : (
                <a href={otherHref}>ES</a>
              )}
              <i>/</i>
              {lang === "ca" ? (
                <button type="button" className="on" aria-current="true">
                  CA
                </button>
              ) : (
                <a href={otherHref}>CA</a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="hero">
          <p className="kick rv0">
            VILANOVA <i>·</i> GARRAF <i>·</i> PENEDÈS
          </p>
          <h1 className="rv0" style={rd(60)}>
            {t.h1Pre}
            <span className="mk">{t.h1Mark}</span>
            {t.h1Post}
          </h1>
          <p className="sub rv0" style={rd(120)}>
            <span>{t.sub1}</span>
            <br />
            <span className="esa mk" style={{ "--d": ".9s" } as React.CSSProperties}>
              {t.sub2}
            </span>
          </p>
        </div>

        <div
          ref={cardRef}
          className={`form rv0${shaking ? " shake" : ""}`}
          style={rd(180)}
          onAnimationEnd={(e) => {
            if (e.animationName === "tp-shake") setShaking(false);
          }}
        >
          <div className="ghost">{step === 4 ? "" : pnum}</div>
          <p className="plabel">
            <b>{pnum}</b> / 03
          </p>
          <div className="ptrack">
            <div className="pfill" style={{ width: pfill }} />
          </div>

          {/* PASO 1 */}
          <div className={`step${step === 1 ? " active" : ""}`}>
            <p className="q">{t.q1}</p>
            <div className="pricebox">
              <input
                ref={priceRef}
                id="price"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                aria-label="Precio"
                value={priceRaw ? Number(priceRaw).toLocaleString("es-ES") : ""}
                onChange={(e) => setPriceRaw(e.target.value.replace(/\D/g, "").slice(0, 9))}
                onKeyDown={(e) => e.key === "Enter" && toStep(2)}
              />
              <span className="euro">€</span>
            </div>
            <button type="button" className="btn" onClick={() => toStep(2)}>
              <span>{t.next}</span>
              <span className="ar">→</span>
            </button>
            <p className="micro">{t.micro1}</p>
            <p className="trust">
              <span className="st">★</span>{" "}
              {t.trust(
                (reviews.rating ?? 4.9).toLocaleString("es-ES", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }),
              )}
            </p>
            {errMsg(1)}
          </div>

          {/* PASO 2 */}
          <div className={`step${step === 2 ? " active" : ""}`}>
            <p className="q">{t.q2a}</p>
            {opts("muni", t.muni, muni)}
            {isOtroMuni && (
              <div className="f">
                <label htmlFor="tp-muni-otro">{t.muniOtroL}</label>
                <input
                  ref={muniOtroRef}
                  id="tp-muni-otro"
                  placeholder={t.muniOtroPh}
                  maxLength={80}
                  value={muniOtro}
                  onChange={(e) => setMuniOtro(e.target.value)}
                  onBlur={(e) => setMuniOtro(capWords(e.target.value))}
                />
              </div>
            )}
            <p className="q">{t.q2b}</p>
            {opts("tipo", t.tipo, tipo)}
            {isOtroTipo && (
              <div className="f">
                <label htmlFor="tp-tipo-otro">{t.tipoOtroL}</label>
                <input
                  ref={tipoOtroRef}
                  id="tp-tipo-otro"
                  placeholder={t.tipoOtroPh}
                  maxLength={60}
                  value={tipoOtro}
                  onChange={(e) => setTipoOtro(e.target.value)}
                />
              </div>
            )}
            <p className="q">{t.q2c}</p>
            {opts("time", t.time, time)}
            <button type="button" className="btn" onClick={() => toStep(3)}>
              <span>{t.next}</span>
              <span className="ar">→</span>
            </button>
            <button type="button" className="back" onClick={() => toStep(1)}>
              {t.back}
            </button>
            {errMsg(2)}
          </div>

          {/* PASO 3 */}
          <div className={`step${step === 3 ? " active" : ""}`}>
            <div className="f">
              <label htmlFor="tp-nombre">{t.fname}</label>
              <input
                id="tp-nombre"
                autoComplete="name"
                autoCapitalize="words"
                maxLength={80}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={(e) => setNombre(capWords(e.target.value))}
              />
            </div>
            <div className="f">
              <label htmlFor="tp-tel">{t.fphone}</label>
              <input
                id="tp-tel"
                inputMode="tel"
                type="tel"
                autoComplete="tel"
                placeholder="6XX XXX XXX"
                maxLength={20}
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitLead()}
              />
            </div>
            <label className="rgpd">
              <input type="checkbox" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} />
              <span>
                {t.rgpd}{" "}
                <a href="/privacidad" target="_blank" rel="noopener">
                  {t.rgpdlink}
                </a>
                .
              </span>
            </label>
            <p className="legal">{t.legal}</p>
            <input ref={hpRef} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="button" className="btn" onClick={submitLead} disabled={sending} aria-busy={sending}>
              <span>{t.send}</span>
              <span className="ar">→</span>
            </button>
            <button type="button" className="back" onClick={() => toStep(2)}>
              {t.back}
            </button>
            <p className="micro">{t.micro3}</p>
            {errMsg(3)}
          </div>

          {/* ÉXITO */}
          <div className={`step${step === 4 ? " active" : ""}${drawn ? " drawn" : ""}`}>
            <div className="okwrap">
              <svg className="okok" viewBox="0 0 24 24" aria-hidden="true">
                <path pathLength="1" d="M3.5 12.8l5.4 5.2L20.5 5.8" />
              </svg>
              <p className="okh">{t.okh}</p>
              <p className="oksum">{okSum}</p>
              <p className="oktxt">{t.oktxt}</p>
              <a className="wa" href={waHref} target="_blank" rel="noopener">
                {t.wa} →
              </a>
              <div className="oksoc">
                <p className="okfollow">{t.okfollow}</p>
                <div className="socrow">
                  <a
                    href="https://www.instagram.com/thevilahome"
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.4" />
                      <circle cx="12" cy="12" r="4.2" />
                      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100093001283637"
                    target="_blank"
                    rel="noopener"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13.4 21.5v-7.1h2.38l.45-2.93H13.4V9.56c0-.8.39-1.58 1.65-1.58h1.28V5.49s-1.16-.2-2.27-.2c-2.31 0-3.82 1.4-3.82 3.94v2.24H7.9v2.93h2.34v7.1a11.9 11.9 0 0 0 3.16 0Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@thevilahome"
                    target="_blank"
                    rel="noopener"
                    aria-label="TikTok"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.52 3h-3.09v12.4a2.6 2.6 0 1 1-2.59-2.72c.26 0 .52.04.77.11V9.64a5.92 5.92 0 0 0-.77-.05A5.7 5.7 0 1 0 15.53 15.3V9.86a7.3 7.3 0 0 0 4.27 1.37V8.14a4.31 4.31 0 0 1-3.2-2.32Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="statline rv">
          <span className="sti">
            <b>
              +<CountN n={450} />
            </b>{" "}
            {t.s1}
          </span>
          <span className="sti">
            <b>
              +<CountN n={15} />
            </b>{" "}
            {t.s2}
          </span>
          <span className="sti">
            <b>
              <span className="st">★</span> <CountN n={reviews.rating ?? 4.9} dec={1} />
            </b>{" "}
            <span>{t.rcShort(reviews.count)}</span>
          </span>
        </div>

        {/* Zonas donde hemos vendido (marquee decorativo) */}
        <div className="mq rv" aria-hidden="true">
          <div className="mqt">
            {[...TP_MARQUEE, ...TP_MARQUEE].map((q, i) => (
              <span key={i} className="mqi">
                {q}
              </span>
            ))}
          </div>
        </div>

        <section className="manif">
          <p className="overline rv">{t.ovHon}</p>
          <div className="manifbox rv">
            <span className="masterisk" aria-hidden="true">
              ✱
            </span>
            <p className="mbig">{t.hon1}</p>
            <p className="msub">
              {t.hon2} <span className="mks">{t.hon3}</span>
            </p>
          </div>
        </section>

        <section className="proof">
          <p className="overline rv">{t.ovProof}</p>
          <div className="qhead rv">
            <b>
              {(reviews.rating ?? 4.9).toLocaleString("es-ES", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </b>
            <span className="stars">★★★★★</span>
            <span className="rcount">{t.rcLong(reviews.count)}</span>
          </div>
          <div className="quotes">
            {reviews.quotes.map((q) => (
              <Quote
                key={q.author}
                text={q.text}
                author={q.author}
                more={t.readMore}
                less={t.readLess}
              />
            ))}
          </div>
        </section>

        <section className="how">
          <p className="overline rv">{t.ovHow}</p>
          <ol>
            <li className="rv">
              <span className="dot">01</span>
              <div className="hstep">
                <p>{t.how1}</p>
              </div>
            </li>
            <li className="rv">
              <span className="dot">02</span>
              <div className="hstep">
                <p>{t.how2}</p>
              </div>
            </li>
            <li className="rv">
              <span className="dot">03</span>
              <div className="hstep">
                <p>{t.how3}</p>
                <p className="hsub">{t.how3b}</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="cta2">
          <h3 className="rv">{t.cta2h}</h3>
          <button type="button" className="btn rv" onClick={goTop}>
            <span>{t.cta2b}</span>
            <span className="ar">→</span>
          </button>
        </section>
      </main>

      <footer>
        <div className="flogo">
          <Wordmark />
        </div>
        <p>
          Av. Francesc Macià 48 · 08800 Vilanova i la Geltrú
          <br />
          <a href="tel:936061800">936 061 800</a>
          <br />
          <a href="/aviso-legal">{t.flegal}</a> · <a href="/privacidad">{t.fpriv}</a> ·{" "}
          <a href="/cookies">{t.fcook}</a>
          <br />© 2026 The Vila Home
        </p>
      </footer>

      {/* Cookies AEPD: aceptar y rechazar, misma prominencia. El píxel solo se
          carga tras aceptar (lo hace CookieConsentProvider). */}
      <div id="ck" role="dialog" aria-label="Cookies" className={consent === null && ckShow ? "show" : undefined}>
        <div className="ckin">
          <p className="cktxt">
            {t.ckt}{" "}
            <a href="/cookies" target="_blank" rel="noopener">
              {t.ckl}
            </a>
            .
          </p>
          <div className="ckbtns">
            <button
              type="button"
              className="ckb"
              onClick={() => saveConsent({ analytics: false, marketing: false })}
            >
              {t.ckr}
            </button>
            <button
              type="button"
              className="ckb"
              onClick={() => saveConsent({ analytics: true, marketing: true })}
            >
              {t.cka}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
