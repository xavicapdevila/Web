"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTurnstile } from "@/hooks/useTurnstile";

const GOOGLE_REVIEW_URL = "https://g.page/r/CXwSHKciPsOkEBM/review";

type Step = "rating" | "thanks5" | "feedback" | "sent";

function Star({ filled, dim }: { filled: boolean; dim: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-full w-full transition-all duration-200 ${
        filled ? "scale-110" : dim ? "scale-100 opacity-40" : "scale-100 opacity-70"
      }`}
      fill={filled ? "#C9B99A" : "none"}
      stroke={filled ? "#C9B99A" : "#6b6a63"}
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.6z" />
    </svg>
  );
}

export default function ReviewGate() {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const turnstile = useTurnstile();

  // Al puntuar 5★, se abre Google (y se autolleva tras un instante).
  useEffect(() => {
    if (step !== "thanks5") return;
    const t = setTimeout(() => {
      window.location.href = GOOGLE_REVIEW_URL;
    }, 2200);
    return () => clearTimeout(t);
  }, [step]);

  function pick(n: number) {
    setRating(n);
    setStep(n === 5 ? "thanks5" : "feedback");
  }

  async function submitFeedback(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      // Captcha invisible (no-op hasta que Turnstile esté configurado).
      const turnstileToken = await turnstile.getToken();
      const res = await fetch("/api/resena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: data.get("comment"),
          name: data.get("name"),
          contact: data.get("contact"),
          company: data.get("company"),
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error();
      setStep("sent");
    } catch {
      setStatus("error");
    }
  }

  const active = hover || rating;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <img src="/logo.svg" alt="The Vila Home" className="mx-auto mb-12 h-10 w-auto opacity-95 sm:h-11" />

        {step === "rating" && (
          <div className="animate-[fadeIn_.5s_ease]">
            <h1 className="font-dm-serif text-[28px] leading-tight text-[#f5f0e8] sm:text-[32px]">
              ¿Cómo ha sido tu experiencia?
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#9a968c]">
              Tu opinión nos ayuda muchísimo. Cuéntanos con una valoración.
            </p>

            <div
              className="mt-10 flex justify-center gap-3"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrellas`}
                  onMouseEnter={() => setHover(n)}
                  onFocus={() => setHover(n)}
                  onClick={() => pick(n)}
                  className="h-11 w-11 cursor-pointer transition-transform duration-150 hover:-translate-y-1 sm:h-12 sm:w-12"
                >
                  <Star filled={n <= active} dim={active > 0 && n > active} />
                </button>
              ))}
            </div>
            <p className="mt-6 h-4 text-sm text-[#C9B99A]">
              {active === 5 ? "¡Excelente!" : active >= 3 ? "Gracias" : active > 0 ? "Lo sentimos" : ""}
            </p>
          </div>
        )}

        {step === "thanks5" && (
          <div className="animate-[fadeIn_.5s_ease]">
            <div className="mb-6 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-7 w-7">
                  <Star filled dim={false} />
                </div>
              ))}
            </div>
            <h1 className="font-dm-serif text-[28px] leading-tight text-[#f5f0e8]">
              ¡Nos alegra un montón!
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#9a968c]">
              ¿Nos ayudas compartiéndolo en Google? Te llevamos en un segundo…
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C9B99A] px-8 py-4 text-sm font-semibold text-[#1a1a18] transition-colors duration-300 hover:bg-[#DDD0BB]"
            >
              Escribir mi reseña en Google
            </a>
          </div>
        )}

        {step === "feedback" && (
          <div className="animate-[fadeIn_.5s_ease] text-left">
            <h1 className="text-center font-dm-serif text-[26px] leading-tight text-[#f5f0e8]">
              Gracias por tu sinceridad
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-[#9a968c]">
              Cuéntanos qué no fue como esperabas. Lo <strong className="text-[#c8c4ba]">leemos personalmente</strong> y nos ayuda a mejorar.
            </p>

            <form onSubmit={submitFeedback} className="mt-8 space-y-3">
              <textarea
                name="comment"
                required
                rows={4}
                placeholder="¿Qué podríamos haber hecho mejor?"
                className="w-full resize-none rounded-2xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-[15px] text-[#f5f0e8] placeholder:text-[#6b6a63] focus:border-[#C9B99A] focus:outline-none"
              />
              <input
                name="name"
                placeholder="Tu nombre (opcional)"
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-[15px] text-[#f5f0e8] placeholder:text-[#6b6a63] focus:border-[#C9B99A] focus:outline-none"
              />
              <input
                name="contact"
                placeholder="Email o teléfono (opcional)"
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#141414] px-4 py-3 text-[15px] text-[#f5f0e8] placeholder:text-[#6b6a63] focus:border-[#C9B99A] focus:outline-none"
              />
              {/* Honeypot */}
              <input name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-px w-px opacity-0" aria-hidden />
              {/* Turnstile invisible (no renderiza UI) */}
              <div ref={turnstile.containerRef} />

              {status === "error" && (
                <p className="text-sm text-[#d98a86]">No se pudo enviar. Inténtalo de nuevo.</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-[#C9B99A] px-8 py-4 text-sm font-semibold text-[#1a1a18] transition-colors duration-300 hover:bg-[#DDD0BB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Enviando…" : "Enviar a dirección"}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-[#6b6a63]">
                Tu comentario llega solo a dirección y se trata según nuestra{" "}
                <a href="/privacidad" className="underline transition-colors hover:text-[#9a968c]">política de privacidad</a>.
              </p>
            </form>
          </div>
        )}

        {step === "sent" && (
          <div className="animate-[fadeIn_.5s_ease]">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9B99A]/15 text-[#C9B99A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-dm-serif text-[28px] leading-tight text-[#f5f0e8]">
              Gracias de corazón
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#9a968c]">
              Lo tendremos muy en cuenta. Nos pondremos a trabajar en ello.
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </main>
  );
}
