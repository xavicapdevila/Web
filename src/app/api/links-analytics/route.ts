import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/links-analytics'

export async function GET(req: NextRequest) {
  const secret = process.env.LINKS_ANALYTICS_SECRET
  if (secret) {
    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  const data = await getAnalytics()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
