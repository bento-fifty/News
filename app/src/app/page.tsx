import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { Header } from '@/components/Header'
import { FilterBar } from '@/components/FilterBar'
import { ArticleCard } from '@/components/ArticleCard'
import { StatsBar } from '@/components/StatsBar'
import { EmptyState } from '@/components/EmptyState'
import { RefreshButton } from '@/components/RefreshButton'

interface PageProps {
  searchParams: Promise<{ source?: string; topic?: string; page?: string }>
}

async function ArticleFeed({ source, topic, page }: { source?: string; topic?: string; page: number }) {
  const limit = 24
  const skip = (page - 1) * limit
  const where = {
    ...(source ? { source } : {}),
    ...(topic ? { topic } : {}),
  }

  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = []
  let total = 0

  try {
    ;[articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ score: 'desc' }, { publishedAt: 'desc' }],
        take: limit,
        skip,
      }),
      prisma.article.count({ where }),
    ])
  } catch (error) {
    console.error('Database query failed:', error)
    return <EmptyState />
  }

  if (articles.length === 0) return <EmptyState />

  return (
    <>
      <StatsBar total={total} source={source} topic={topic} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-3 mt-8">
          {page > 1 && (
            <a
              href={`/?${new URLSearchParams({ ...(source ? { source } : {}), ...(topic ? { topic } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              上一頁
            </a>
          )}
          <span className="px-4 py-2 text-sm" style={{ color: 'var(--muted)' }}>
            第 {page} / {Math.ceil(total / limit)} 頁
          </span>
          {page < Math.ceil(total / limit) && (
            <a
              href={`/?${new URLSearchParams({ ...(source ? { source } : {}), ...(topic ? { topic } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              下一頁
            </a>
          )}
        </div>
      )}
    </>
  )
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const source = params.source
  const topic = params.topic
  const page = parseInt(params.page ?? '1')

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--background)' }}>
      <Header />

      <Suspense>
        <FilterBar />
      </Suspense>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Action bar */}
        <div className="flex justify-end mb-6">
          <RefreshButton />
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl animate-pulse"
                  style={{ background: 'var(--surface)' }}
                />
              ))}
            </div>
          }
        >
          <ArticleFeed source={source} topic={topic} page={page} />
        </Suspense>
      </main>

      <footer className="py-6 text-center text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        InfoPulse — 由 AI 驅動的科技資訊精華聚合
      </footer>
    </div>
  )
}
