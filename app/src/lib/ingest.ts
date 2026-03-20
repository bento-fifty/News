import { prisma } from './db'
import { fetchRssSources, fetchRedditSources, fetchYouTubeSources } from './fetchers'
import { summarizeBatch } from './summarize'
import type { RawArticle } from '@/types'

export async function ingestAll() {
  const [rss, reddit, youtube] = await Promise.allSettled([
    fetchRssSources(),
    fetchRedditSources(),
    fetchYouTubeSources(),
  ])

  const articles: RawArticle[] = [
    ...(rss.status === 'fulfilled' ? rss.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(youtube.status === 'fulfilled' ? youtube.value : []),
  ]

  // Deduplicate by URL
  const unique = Array.from(
    new Map(articles.map((a) => [a.url, a])).values()
  )

  // Insert new articles (skip existing)
  let inserted = 0
  const toSummarize: Array<{ id: string; title: string; content: string }> = []

  for (const article of unique) {
    try {
      const created = await prisma.article.create({
        data: {
          title: article.title,
          url: article.url,
          content: article.content,
          imageUrl: article.imageUrl,
          source: article.source,
          sourceName: article.sourceName,
          topic: article.topic,
          score: article.score ?? 0,
          publishedAt: article.publishedAt,
        },
      })
      inserted++
      if (article.content || article.title) {
        toSummarize.push({
          id: created.id,
          title: article.title,
          content: article.content ?? article.title,
        })
      }
    } catch {
      // skip duplicates (unique URL constraint)
    }
  }

  // TODO: Summarization moved out of ingest to avoid Vercel timeout
  // Can be triggered separately via a dedicated /api/summarize endpoint

  await prisma.fetchLog.create({
    data: {
      source: 'all',
      status: 'success',
      count: inserted,
    },
  })

  return { total: unique.length, inserted }
}
