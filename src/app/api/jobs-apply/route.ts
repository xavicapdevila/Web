import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { buildJobsReplyEmail } from '@/lib/lead-emails'
import type { Lang } from '@/lib/i18n'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]) // %PDF

/** Idioma del formulario; cae a español si viene raro o no viene. */
function langOf(v: FormDataEntryValue | null): Lang {
  return v === 'ca' || v === 'es' || v === 'en' || v === 'fr' ? v : 'es'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  // Rate limit: 5 applications / hour per IP. This endpoint calls Claude and
  // sends email, so it's a cost/abuse target if left open.
  const ip = clientIp(request)
  const limit = rateLimit(`jobs:${ip}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  try {
    const formData = await request.formData()

    // Honeypot anti-bots (campo `website`): si viene relleno, fingimos éxito.
    if (((formData.get('website') as string) ?? '').trim()) {
      return NextResponse.json({ ok: true })
    }

    const name    = (formData.get('name')    as string)?.trim()
    const email   = (formData.get('email')   as string)?.trim()
    const message = (formData.get('message') as string)?.trim() ?? ''
    const cv      = formData.get('cv') as File | null

    if (!name || !email || !cv) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    // Captcha invisible (activo solo con TURNSTILE_SECRET_KEY configurada).
    if (!(await verifyTurnstile(formData.get('turnstileToken'), ip))) {
      return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
    }
    if (cv.type !== 'application/pdf') {
      return NextResponse.json({ error: 'pdf_only' }, { status: 400 })
    }
    if (cv.size > MAX_SIZE) {
      return NextResponse.json({ error: 'too_large' }, { status: 400 })
    }

    const buffer   = Buffer.from(await cv.arrayBuffer())
    const filename = cv.name || `cv-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`

    // ── 1. Magic bytes — verify it's a real PDF ──────────────────────────────
    const magic = buffer.slice(0, 4)
    if (!magic.equals(PDF_MAGIC)) {
      return NextResponse.json({ error: 'invalid_pdf' }, { status: 400 })
    }

    // ── 2. CV validation with Claude (only if API key is configured) ─────────
    if (process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const base64    = buffer.toString('base64')

      const response = await anthropic.messages.create({
        model:      'claude-haiku-4-5',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: [
            {
              type:   'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            },
            {
              type: 'text',
              text: 'Does this document look like a CV or resume? Reply with only YES or NO.',
            },
          ],
        }],
      })

      const answer = response.content[0].type === 'text'
        ? response.content[0].text.trim().toUpperCase()
        : ''

      if (!answer.includes('YES')) {
        return NextResponse.json({ error: 'not_a_cv' }, { status: 400 })
      }
    }

    // ── 3. Send email with CV attached ───────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from:    'The Vila Home <noreply@thevilahome.com>',
      to:      'info@thevilahome.com',
      replyTo: email,
      subject: `Nova candidatura: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;color:#222">
          <h2 style="margin-bottom:4px">Nova candidatura rebuda</h2>
          <hr style="border:none;border-top:1px solid #eee;margin:12px 0"/>
          <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          ${message ? `<p><strong>Missatge:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:12px 0"/>
          <p style="color:#666;font-size:13px">El CV s'adjunta a aquest correu.</p>
        </div>
      `,
      attachments: [{ filename, content: buffer }],
    })

    // ── 4. Acuse de recibo al candidato ──────────────────────────────────────
    // Best-effort y DESPUÉS del aviso interno: lo que no puede fallar es que
    // nos llegue el CV. Si el acuse peta, la candidatura ya está recibida y
    // devolver error haría que la persona lo reenviara por duplicado.
    try {
      const { subject, html } = buildJobsReplyEmail(name, langOf(formData.get('lang')))
      await resend.emails.send({
        from: 'The Vila Home <noreply@thevilahome.com>',
        to: email,
        replyTo: 'info@thevilahome.com', // si responde, que llegue a una persona
        subject,
        html,
      })
    } catch (err) {
      console.error('[jobs-apply] acuse de recibo', err)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[jobs-apply]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
