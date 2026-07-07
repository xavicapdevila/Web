import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import type { Lang } from '@/lib/i18n'
import { saveLead, type StoredLead } from '@/lib/leads-store'
import { buildAutoReplyEmail, buildTeamEmail } from '@/lib/lead-emails'
import { sendMetaLeadEvent } from '@/lib/meta-capi'
import { verifyTurnstile } from '@/lib/turnstile'

const MAX = 2000 // límite defensivo por campo
const TEAM_INBOX = 'info@thevilahome.com'
const TEAM_CC = ['a.garcia@thevilahome.com'] // Ariadna recibe copia de cada lead
const FROM = 'The Vila Home <noreply@thevilahome.com>'
const VALID_LANGS: Lang[] = ['es', 'ca', 'en', 'fr']

/** Extrae y sanea un valor de texto de la atribución (viene del cliente). */
function attrStr(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const s = v.trim().slice(0, 300)
  return s || undefined
}

/**
 * RGPD: el envío de PII a Meta (Conversions API) y el uso de identificadores
 * de click (fbclid/gclid/fbp/fbc) requieren consentimiento de marketing.
 * Se lee la cookie del banner (tvh_consent) que llega con la petición.
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
  const limit = rateLimit(`vender-lead:${ip}`, 5, 60 * 60 * 1000)
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

    const name = String(body.name ?? '').trim().slice(0, MAX)
    const phone = String(body.phone ?? '').trim().slice(0, MAX)
    const email = String(body.email ?? '').trim().slice(0, MAX)
    const zone = String(body.zone ?? '').trim().slice(0, MAX)
    const message = String(body.message ?? '').trim().slice(0, MAX)
    const situationKey = String(body.situation ?? '').trim().slice(0, 40)
    const lang: Lang = VALID_LANGS.includes(body.lang) ? body.lang : 'es'
    // Honeypot anti-bots: si viene relleno, fingimos éxito y descartamos.
    const honeypot = String(body.company ?? '').trim()

    if (honeypot) return NextResponse.json({ ok: true })

    if (!name || !phone || !email || !zone) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    // Captcha invisible (activo solo con TURNSTILE_SECRET_KEY configurada).
    if (!(await verifyTurnstile(body.turnstileToken, ip))) {
      return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
    }

    // ── Atribución (best-effort; el cliente la aporta desde la cookie) ──────────
    const marketingOk = hasMarketingConsent(request)
    const attribution = (body.attribution ?? {}) as Record<string, unknown>
    // Identificadores de click (rastreo entre plataformas): solo con consentimiento.
    const clickIds = marketingOk ? ((body.clickIds ?? {}) as Record<string, unknown>) : {}
    const eventId =
      attrStr(body.eventId) ?? `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const sourceUrl = attrStr(body.sourceUrl)
    const userAgent = request.headers.get('user-agent') ?? undefined

    const lead: StoredLead = {
      id: eventId,
      ts: new Date().toISOString(),
      lang,
      situation: situationKey || 'no_especificada',
      name,
      phone,
      email,
      zone,
      message: message || undefined,
      utm_source: attrStr(attribution.utm_source),
      utm_medium: attrStr(attribution.utm_medium),
      utm_campaign: attrStr(attribution.utm_campaign),
      utm_content: attrStr(attribution.utm_content),
      utm_term: attrStr(attribution.utm_term),
      fbclid: marketingOk ? attrStr(attribution.fbclid) : undefined,
      gclid: marketingOk ? attrStr(attribution.gclid) : undefined,
      landing: attrStr(attribution.landing),
      referrer: attrStr(attribution.referrer),
      ip,
      userAgent,
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const team = buildTeamEmail(lead)
    const auto = buildAutoReplyEmail(name, lang)
    const [firstName, ...rest] = name.split(/\s+/)

    // Todo en paralelo y best-effort: si algo falla, no bloqueamos al usuario.
    // El aviso al equipo es el crítico; si ese falla, devolvemos error.
    const tasks: Promise<unknown>[] = [
      // 1) Aviso al equipo (crítico)
      resend.emails.send({
        from: FROM,
        to: TEAM_INBOX,
        cc: TEAM_CC,
        replyTo: email,
        subject: team.subject,
        html: team.html,
      }),
      // 2) Autorespuesta al vendedor
      resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TEAM_INBOX,
        subject: auto.subject,
        html: auto.html,
      }),
      // 3) Persistir el lead con su atribución
      saveLead(lead),
    ]
    // 4) Conversions API server-side (dedup con el Pixel por eventId).
    //    RGPD: solo si el visitante consintió cookies de marketing.
    if (marketingOk) {
      tasks.push(
        sendMetaLeadEvent({
          eventId,
          eventSourceUrl: sourceUrl,
          email,
          phone,
          firstName,
          lastName: rest.join(' ') || undefined,
          clientIp: ip !== 'unknown' ? ip : undefined,
          userAgent,
          fbp: attrStr(clickIds.fbp),
          fbc: attrStr(clickIds.fbc),
          fbclid: attrStr(attribution.fbclid),
          custom: {
            content_name: 'vender',
            content_category: lead.situation,
            lead_lang: lang,
            utm_campaign: lead.utm_campaign,
            utm_source: lead.utm_source,
          },
        }),
      )
    }
    const [teamResult] = await Promise.allSettled(tasks)

    if (teamResult.status === 'rejected') {
      console.error('[vender-lead] team email failed', teamResult.reason)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[vender-lead]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
