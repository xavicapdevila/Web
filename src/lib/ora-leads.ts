/**
 * Reenvío de leads al hub Ora (módulo Leads, bandeja de gestión).
 *
 * Contrato del endpoint (ora-nueva, POST /api/leads con Bearer
 * LEADS_INGEST_SECRET): `nombre|name` obligatorio; opcionales `id|externalId`
 * (dedup idempotente), `telefono|phone`, `email`, `zona|zone`,
 * `mensaje|message`, `idioma|lang`, `situacion|situation`, `utm_*`, `fbclid`,
 * `gclid`, `landing`, `referrer`. El `origen` lo deduce Ora de los utm/click
 * ids (CHECK en BD: google|meta|referido|directo|captacion — no admite
 * valores nuevos sin migración).
 *
 * Best-effort SIEMPRE: si Ora no responde, el lead ya está a salvo por email
 * (+ Blob), así que nunca bloqueamos al usuario por esto.
 */
export async function forwardLeadToOra(payload: object): Promise<void> {
  const url = process.env.ORA_LEADS_INGEST_URL;
  const secret = process.env.LEADS_INGEST_SECRET;
  if (!url || !secret) return;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
    body: JSON.stringify(payload),
    // No queremos que un Ora lento retrase la respuesta al usuario.
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`ora ingest ${res.status}`);
}
