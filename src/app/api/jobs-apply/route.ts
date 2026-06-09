import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

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
