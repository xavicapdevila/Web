/**
 * Verificación server-side de Cloudflare Turnstile (captcha invisible).
 *
 * Diseñado para activarse solo cuando hay claves configuradas:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY → clave pública (la usa el widget del cliente)
 *   TURNSTILE_SECRET_KEY           → clave secreta (solo servidor, esta función)
 *
 * Sin TURNSTILE_SECRET_KEY la verificación devuelve true (feature apagada), así
 * el despliegue no exige tener la cuenta de Cloudflare creada de antemano.
 */

export async function verifyTurnstile(token: unknown, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // feature apagada hasta configurar las claves

  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token.slice(0, 2048),
        ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[turnstile] siteverify non-ok", res.status);
      return true; // fallo de Cloudflare, no del visitante — no bloquear leads
    }
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[turnstile] rejected", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    // Cloudflare inaccesible: fail-open para que una caída de un tercero no
    // tire la captación de leads. El honeypot y el rate-limit siguen activos.
    console.error("[turnstile] siteverify unreachable", err);
    return true;
  }
}
