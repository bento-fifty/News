import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || undefined
  const topic = searchParams.get('topic') || undefined
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const skip = (page - 1) * limit

  const where = {
    ...(source ? { source } : {}),
    ...(topic ? { topic } : {}),
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ score: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
      skip,
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({ articles, total, page, limit })
}
