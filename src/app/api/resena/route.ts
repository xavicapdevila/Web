import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

// Opinión privada: cuando el cliente valora con MENOS de 5★, en lugar de
// publicarse en Google, el comentario llega a dirección para poder mejorar y
// contactar. Las de 5★ se envían directamente a Google desde el cliente.

const MAX = 2000;
const TEAM_INBOX = "info@thevilahome.com";
const FROM = "The Vila Home <noreply@thevilahome.com>";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`resena:${ip}`, 6, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    // Honeypot anti-bots.
    if (String(body.company ?? "").trim()) return NextResponse.json({ ok: true });

    // Captcha invisible (activo solo con TURNSTILE_SECRET_KEY configurada).
    if (!(await verifyTurnstile(body.turnstileToken, ip))) {
      return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
    }

    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim().slice(0, MAX);
    const name = String(body.name ?? "").trim().slice(0, 200);
    const contact = String(body.contact ?? "").trim().slice(0, 200);

    if (!Number.isInteger(rating) || rating < 1 || rating > 4) {
      return NextResponse.json({ error: "invalid_rating" }, { status: 400 });
    }
    if (!comment) {
      return NextResponse.json({ error: "missing_comment" }, { status: 400 });
    }

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:8px;color:#1a1a18">
        <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a8a294;margin:0 0 6px">Opinión de cliente · feedback interno</p>
        <h2 style="margin:0 0 14px;font-size:22px">Valoración: <span style="color:#C9B99A">${stars}</span> (${rating}/5)</h2>
        <div style="background:#faf9f6;border:1px solid #ececec;border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(comment)}</div>
        <p style="margin:16px 0 0;font-size:14px;color:#5a564e">
          <strong>Cliente:</strong> ${name ? esc(name) : "(anónimo)"}<br>
          <strong>Contacto:</strong> ${contact ? esc(contact) : "(no facilitado)"}
        </p>
      </div>`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const res = await resend.emails.send({
      from: FROM,
      to: TEAM_INBOX,
      replyTo: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact) ? contact : undefined,
      subject: `Opinión de cliente (${rating}★) — a mejorar`,
      html,
    });
    if (res.error) {
      console.error("[resena] email failed", res.error);
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[resena]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
