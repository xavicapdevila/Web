/**
 * Reenvío a Ora de las opiniones privadas de /resena (valoraciones 1–4★ del
 * formulario de mejora), para que queden consultables en app.thevilahome.com
 * /resenas y no solo en el correo de info@.
 *
 * Contrato del endpoint (ora-nueva, POST /api/resenas con el MISMO Bearer del
 * canal de leads, LEADS_INGEST_SECRET): `rating` 1–4 obligatorio,
 * `comment|comentario` obligatorio; opcionales `name|nombre`,
 * `contact|contacto`.
 *
 * Best-effort SIEMPRE: el correo a info@ es la vía crítica; si Ora no
 * responde, no bloqueamos al cliente.
 */
export async function forwardResenaOpinionToOra(payload: {
  rating: number;
  comment: string;
  name?: string;
  contact?: string;
}): Promise<void> {
  const url = process.env.ORA_RESENAS_INGEST_URL;
  const secret = process.env.LEADS_INGEST_SECRET;
  if (!url || !secret) return;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
    body: JSON.stringify(payload),
    // No queremos que un Ora lento retrase la respuesta al cliente.
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`ora resenas ingest ${res.status}`);
}
