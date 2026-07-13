import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { saveLead, type StoredLead } from '@/lib/leads-store'
import { buildTuPrecioTeamEmail } from '@/lib/lead-emails'
import { sendMetaLeadEvent } from '@/lib/meta-capi'
import { forwardLeadToOra } from '@/lib/ora-leads'

/**
 * Lead de la landing Meta «Tu precio» (/tu-precio · /el-teu-preu).
 *
 * Mismo pipeline que /api/vender-lead pero con el payload de esta campaña
 * (precio esperado, municipio, tipo, «cuándo»; sin email del lead):
 *   1. Email de alerta al equipo (crítico — si falla, 500)
 *   2. Persistencia en Blob con la atribución
 *   3. Reenvío a Ora (best-effort) mapeado al esquema real del módulo Leads
 *   4. Meta Conversions API con dedup por eventId (solo con consentimiento)
 *
 * Validación estricta a mano (patrón del repo; no hay Zod en el proyecto):
 * whitelist de timeline, teléfono normalizado, precio acotado, longitudes máx.
 */

const TIMELINES = ['vender_ya', 'venta_activa', 'proximos_meses', 'solo_curiosidad'] as const
type Timeline = (typeof TIMELINES)[number]

/* El módulo Leads de Ora no tiene columnas de precio/tipo/timeline y su CHECK
   de `origen` no admite valores nuevos (google|meta|referido|directo|
   captacion). Mapeo sin tocar Ora: timeline → situacion equivalente, precio y
   tipo van en `mensaje`, y la campaña queda identificada por utm_campaign +
   landing (origen lo deduce Ora: utm_source=meta → chip «Meta»). */
const TIMELINE_TO_SITUACION: Record<Timeline, string> = {
  vender_ya: 'ahora',
  venta_activa: 'en_venta',
  proximos_meses: 'meses',
  solo_curiosidad: 'explorando',
}

const TEAM_INBOX = process.env.TU_PRECIO_ALERT_TO || 'info@thevilahome.com'
// Con el buzón por defecto, Ariadna va en copia (como en /vender). Si
// TU_PRECIO_ALERT_TO está definida, esa lista manda ella sola (permite probar
// sin avisar a todo el equipo).
const TEAM_CC = process.env.TU_PRECIO_ALERT_TO ? [] : ['a.garcia@thevilahome.com']
const FROM = 'The Vila Home <noreply@thevilahome.com>'

/** Extrae y sanea un valor de texto de la atribución (viene del cliente). */
function attrStr(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const s = v.trim().slice(0, 300)
  return s || undefined
}

/**
 * RGPD: el envío de PII a Meta (Conversions API) y el uso de identificadores
 * de click (fbclid/fbp/fbc) requieren consentimiento de marketing. Se lee la
 * cookie del banner (tvh_consent) que llega con la petición.
 */
function hasMarketingConsent(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(/(?:^|;\s*)tvh_consent=([^;]+)/)
  if (!match) return false
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as { marketing?: boolean }
    return parsed?.marketing === true
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  // Rate limit: envía email → objetivo de abuso. 5 envíos / hora por IP.
  const ip = clientIp(request)
  const limit = rateLimit(`lead-tu-precio:${ip}`, 5, 60 * 60 * 1000)
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

    const nombre = String(body.nombre ?? '').trim().slice(0, 80)
    const telefono = String(body.telefono ?? '').replace(/\D/g, '').slice(0, 15)
    const municipio = String(body.municipio ?? '').trim().slice(0, 80)
    const tipo = String(body.tipo ?? '').trim().slice(0, 60)
    const timeline = String(body.timeline ?? '') as Timeline
    const idioma = body.idioma === 'ca' ? 'ca' : 'es'
    const precio = Number(body.precio_esperado)

    if (
      !nombre ||
      telefono.length < 9 ||
      !municipio ||
      !tipo ||
      !TIMELINES.includes(timeline) ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      precio > 999_999_999
    ) {
      return NextResponse.json({ error: 'invalid_fields' }, { status: 400 })
    }
    const precioInt = Math.round(precio)

    // ── Atribución (best-effort; el cliente la aporta) ───────────────────────
    const marketingOk = hasMarketingConsent(request)
    const attribution = (body.attribution ?? {}) as Record<string, unknown>
    const clickIds = marketingOk ? ((body.clickIds ?? {}) as Record<string, unknown>) : {}
    const eventId =
      attrStr(body.eventId) ?? `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const sourceUrl = attrStr(body.sourceUrl)
    const userAgent = request.headers.get('user-agent') ?? undefined

    const lead: StoredLead = {
      id: eventId,
      ts: new Date().toISOString(),
      lang: idioma,
      situation: timeline,
      name: nombre,
      phone: telefono,
      email: '', // este form no pide email a propósito
      zone: municipio,
      precio_esperado: precioInt,
      tipo,
      utm_source: attrStr(attribution.utm_source),
      utm_medium: attrStr(attribution.utm_medium),
      utm_campaign: attrStr(attribution.utm_campaign),
      utm_content: attrStr(attribution.utm_content),
      utm_term: attrStr(attribution.utm_term),
      fbclid: marketingOk ? attrStr(attribution.fbclid) : undefined,
      landing: attrStr(attribution.landing),
      referrer: attrStr(attribution.referrer),
      ip,
      userAgent,
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const team = buildTuPrecioTeamEmail(lead)

    // Lo que ve Ariadna en el módulo Leads: precio, tipo y campaña en el
    // mensaje; timeline mapeado a las situaciones existentes.
    const oraMensaje = [
      `Campaña Meta «Tu precio» (${lead.landing ?? '/tu-precio'})`,
      `Precio esperado: ${precioInt.toLocaleString('es-ES')} €`,
      `Tipo: ${tipo}`,
    ].join('\n')

    // Todo en paralelo y best-effort; el aviso al equipo es el crítico.
    const tasks: Promise<unknown>[] = [
      // 1) Aviso al equipo (crítico). OJO: el SDK de Resend NO lanza en
      //    errores de API (resuelve con {error}); lo convertimos en throw
      //    para que el allSettled de abajo lo detecte de verdad.
      resend.emails
        .send({
          from: FROM,
          to: TEAM_INBOX.split(','),
          cc: TEAM_CC,
          subject: team.subject,
          html: team.html,
        })
        .then((r) => {
          if (r.error) throw new Error(r.error.message)
          return r
        }),
      // 2) Persistir el lead con su atribución
      saveLead(lead),
      // 3) Reenviar a Ora (bandeja de leads). Best-effort.
      forwardLeadToOra({
        id: eventId,
        nombre,
        telefono,
        idioma,
        zona: municipio,
        situacion: TIMELINE_TO_SITUACION[timeline],
        mensaje: oraMensaje,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_campaign: lead.utm_campaign,
        utm_content: lead.utm_content,
        utm_term: lead.utm_term,
        fbclid: lead.fbclid,
        landing: lead.landing,
        referrer: lead.referrer,
      }),
    ]
    // 4) Conversions API server-side (dedup con el Pixel por eventId).
    //    RGPD: solo si el visitante consintió cookies de marketing.
    if (marketingOk) {
      const [firstName, ...rest] = nombre.split(/\s+/)
      tasks.push(
        sendMetaLeadEvent({
          eventId,
          eventSourceUrl: sourceUrl,
          phone: telefono,
          firstName,
          lastName: rest.join(' ') || undefined,
          clientIp: ip !== 'unknown' ? ip : undefined,
          userAgent,
          fbp: attrStr(clickIds.fbp),
          fbc: attrStr(clickIds.fbc),
          fbclid: attrStr(attribution.fbclid),
          custom: {
            content_name: 'tu_precio',
            content_category: timeline,
            lead_lang: idioma,
            precio_esperado: precioInt,
            utm_campaign: lead.utm_campaign,
            utm_source: lead.utm_source,
          },
        }),
      )
    }
    const [teamResult] = await Promise.allSettled(tasks)

    if (teamResult.status === 'rejected') {
      console.error('[lead-tu-precio] team email failed', teamResult.reason)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead-tu-precio]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
