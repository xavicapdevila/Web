import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/links-analytics'

export async function GET(req: NextRequest) {
  // Falla CERRADO (igual que /api/links): sin el secreto configurado no se
  // sirve nada. Antes, si faltaba LINKS_ANALYTICS_SECRET el endpoint quedaba
  // abierto y devolvía las analíticas a cualquiera.
  const secret = process.env.LINKS_ANALYTICS_SECRET
  if (!secret || req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await getAnalytics()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
