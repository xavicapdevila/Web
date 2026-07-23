import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { forwardLeadToOra } from '@/lib/ora-leads'

/**
 * Lead del diagnóstico /antes-de-vender.
 *
 * Mismo pipeline que /api/vender-lead y /api/lead-tu-precio:
 *   1. Email de alerta al equipo (crítico — si falla, 500)
 *   2. Reenvío a Ora (módulo Leads, best-effort) mapeado al esquema real:
 *      sin `origen` nuevo (lo deduce Ora), horizonte → `situacion` existente,
 *      y el diagnóstico (nota, horquilla, vivienda, ref) va en `mensaje`.
 *
 * El desbloqueo del informe en cliente NO depende de esta ruta: el usuario ve
 * su informe aunque esto falle; lo crítico es que el equipo se entere.
 */

const HORIZONTES = ['cuanto-antes', '3-6-meses', 'este-anyo', 'explorando'] as const
type Horizonte = (typeof HORIZONTES)[number]

/* Situaciones que ya existen en Ora (ver lead-tu-precio): ahora | en_venta |
   meses | explorando. Si ya está anunciada manda «en_venta»; si no, el
   horizonte. */
function situacionOra(horizonte: Horizonte, yaAnunciada: boolean): string {
  if (yaAnunciada) return 'en_venta'
  if (horizonte === 'cuanto-antes') return 'ahora'
  if (horizonte === 'explorando') return 'explorando'
  return 'meses'
}

const TEAM_INBOX = process.env.ANTES_DE_VENDER_ALERT_TO || 'info@thevilahome.com'
// Con el buzón por defecto, Ariadna va en copia (como en el resto de leads).
const TEAM_CC = process.env.ANTES_DE_VENDER_ALERT_TO ? [] : ['a.garcia@thevilahome.com']
const FROM = 'The Vila Home <noreply@thevilahome.com>'

function campo(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max)
}

function entero(v: unknown, max: number): number | null {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0 || n > max) return null
  return Math.round(n)
}

export async function POST(request: Request) {
  // Rate limit: envía email → objetivo de abuso. 5 envíos / hora por IP.
  const ip = clientIp(request)
  const limit = rateLimit(`antes-de-vender:${ip}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    // Honeypot anti-bots (campo `website`): si viene relleno, fingimos éxito.
    if (String(body.website ?? '').trim()) return NextResponse.json({ ok: true })

    const nombre = campo(body.nombre, 80)
    const telefono = String(body.telefono ?? '').replace(/\D/g, '').slice(0, 15)
    const email = campo(body.email, 120)
    const tipo = campo(body.tipo, 40)
    const zona = campo(body.zona, 120)
    const municipio = campo(body.municipio, 80)
    const estado = campo(body.estado, 40)
    const riesgo = campo(body.riesgo, 20)
    const posicionPrecio = campo(body.posicionPrecio, 40)
    const ref = campo(body.ref, 20)
    const version = campo(body.version, 20)
    const horizonte = String(body.horizonte ?? '') as Horizonte
    const yaAnunciada = body.yaAnunciada === true
    const superficie = entero(body.superficie, 5000)
    const precioEsperado = entero(body.precioEsperado, 999_999_999)
    const horquillaInferior = entero(body.horquillaInferior, 999_999_999)
    const horquillaSuperior = entero(body.horquillaSuperior, 999_999_999)
    const nota = entero(body.nota, 100)

    if (
      !nombre ||
      telefono.length < 9 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
      !tipo ||
      !zona ||
      !municipio ||
      !HORIZONTES.includes(horizonte) ||
      superficie === null ||
      precioEsperado === null ||
      nota === null
    ) {
      return NextResponse.json({ error: 'invalid_fields' }, { status: 400 })
    }

    const eventId = `advl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const eur = (n: number) => `${n.toLocaleString('es-ES')} €`
    const horquillaTexto =
      horquillaInferior && horquillaSuperior
        ? `${eur(horquillaInferior)} — ${eur(horquillaSuperior)}`
        : '—'
    const viviendaTexto = `${tipo} · ${superficie} m² · ${zona}, ${municipio}${estado ? ` · ${estado}` : ''}`

    // ── 1) Email de alerta al equipo (crítico) ───────────────────────────────
    const fila = (etiqueta: string, valor: string) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#777;white-space:nowrap;vertical-align:top">${etiqueta}</td><td style="padding:6px 0;color:#262626;font-weight:600">${valor}</td></tr>`
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#262626">
        <div style="background:#060a09;border-radius:12px 12px 0 0;padding:18px 22px">
          <span style="color:#fff;font-size:13px;letter-spacing:3px;font-weight:700">THE VILA HOME</span>
        </div>
        <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:22px">
          <p style="margin:0 0 4px;font-size:12px;color:#14b8a6;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">Nuevo lead · Diagnóstico /antes-de-vender</p>
          <p style="margin:0 0 16px;font-size:19px;font-weight:700">${nombre} — nota ${nota}/100</p>
          <table style="border-collapse:collapse;font-size:14px">
            ${fila('Teléfono', `<a href="tel:${telefono}">${telefono}</a>`)}
            ${fila('Email', `<a href="mailto:${email}">${email}</a>`)}
            ${fila('Vivienda', viviendaTexto)}
            ${fila('Precio esperado', eur(precioEsperado))}
            ${fila('Horquilla orientativa', horquillaTexto)}
            ${fila('Riesgo', riesgo || '—')}
            ${fila('Precio vs. horquilla', posicionPrecio || '—')}
            ${fila('Situación', yaAnunciada ? 'Ya anunciada' : 'Sin anunciar')}
            ${fila('Horizonte', horizonte)}
            ${fila('Ref. diagnóstico', `${ref || '—'} · v${version || '—'}`)}
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#999">Ha aceptado ser contactado para revisar su diagnóstico. Siguiente paso: llamar y proponer visita sin compromiso.</p>
        </div>
      </div>`

    const resend = new Resend(process.env.RESEND_API_KEY)

    // ── 2) Ora (best-effort) ─────────────────────────────────────────────────
    const oraMensaje = [
      `Diagnóstico /antes-de-vender · nota ${nota}/100${riesgo ? ` · riesgo ${riesgo.toLowerCase()}` : ''}`,
      `Vivienda: ${viviendaTexto}`,
      `Precio esperado: ${eur(precioEsperado)} (${posicionPrecio.toLowerCase() || 's/d'})`,
      `Horquilla orientativa: ${horquillaTexto}`,
      `Ref: ${ref} · v${version}`,
    ].join('\n')

    const tasks: Promise<unknown>[] = [
      resend.emails
        .send({
          from: FROM,
          to: TEAM_INBOX.split(','),
          cc: TEAM_CC,
          subject: `Diagnóstico web: ${nombre} — ${tipo} en ${municipio} (${nota}/100)`,
          html,
        })
        .then((r) => {
          if (r.error) throw new Error(r.error.message)
          return r
        }),
      forwardLeadToOra({
        id: eventId,
        nombre,
        telefono,
        email,
        idioma: 'es',
        zona: `${zona}, ${municipio}`,
        situacion: situacionOra(horizonte, yaAnunciada),
        mensaje: oraMensaje,
        landing: '/antes-de-vender',
      }),
    ]

    const [teamResult] = await Promise.allSettled(tasks)
    if (teamResult.status === 'rejected') {
      console.error('[antes-de-vender-lead] team email failed', teamResult.reason)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[antes-de-vender-lead]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
