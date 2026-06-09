import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]) // %PDF

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name    = (formData.get('name')    as string)?.trim()
    const email   = (formData.get('email')   as string)?.trim()
    const message = (formData.get('message') as string)?.trim() ?? ''
    const cv      = formData.get('cv') as File | null

    if (!name || !email || !cv) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
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
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${message ? `<p><strong>Missatge:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:12px 0"/>
          <p style="color:#666;font-size:13px">El CV s'adjunta a aquest correu.</p>
        </div>
      `,
      attachments: [{ filename, content: buffer }],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[jobs-apply]', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
