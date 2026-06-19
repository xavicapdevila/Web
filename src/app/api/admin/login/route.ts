import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSession, ADMIN_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts / 15 min per IP (blunts brute force)
  const { ok, retryAfter } = rateLimit(`login:${clientIp(req)}`, 10, 15 * 60 * 1000);
  if (!ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }
  const password = (body as { password?: unknown } | null)?.password;

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Autenticación no configurada en el servidor" }, { status: 500 });
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSession(), sessionCookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
