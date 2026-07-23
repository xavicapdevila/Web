import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackClick } from '@/lib/links-analytics'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Público y de escritura: acotar ritmo por IP (un visitante real del
    // bio-link genera un puñado de eventos, no cientos).
    const limit = rateLimit(`links-track:${clientIp(req)}`, 120, 60 * 60 * 1000)
    if (!limit.ok) return NextResponse.json({ ok: true }, { status: 429 })

    const { type, key } = await req.json()
    if (type === 'pageview') {
      trackPageView().catch(() => {})
    } else if (type === 'click' && typeof key === 'string' && /^[\w-]{1,64}$/.test(key)) {
      // key = id del enlace (slug o UUID). Acotar formato/longitud: el endpoint
      // es público, así que sin esto entraría cualquier cadena en las analíticas.
      trackClick(key).catch(() => {})
    }
  } catch {}
  return NextResponse.json({ ok: true })
}
