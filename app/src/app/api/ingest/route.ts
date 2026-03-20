import { NextRequest, NextResponse } from 'next/server'
import { ingestAll } from '@/lib/ingest'

// Allow up to 60s for ingestion (requires Vercel Pro; Hobby plan max is 10s)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  // Simple secret key check to prevent unauthorized triggers
  const authHeader = request.headers.get('authorization')
  const secret = process.env.INGEST_SECRET

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await ingestAll()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json(
      { error: 'Ingest failed', message: String(error) },
      { status: 500 }
    )
  }
}
