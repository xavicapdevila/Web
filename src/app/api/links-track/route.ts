import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackClick } from '@/lib/links-analytics'

export async function POST(req: NextRequest) {
  try {
    const { type, key } = await req.json()
    if (type === 'pageview') {
      trackPageView().catch(() => {})
    } else if (type === 'click' && typeof key === 'string') {
      trackClick(key).catch(() => {})
    }
  } catch {}
  return NextResponse.json({ ok: true })
}
