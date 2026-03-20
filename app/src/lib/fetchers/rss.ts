import Parser from 'rss-parser'
import type { RawArticle, FeedSource } from '@/types'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']],
  },
})

const RSS_SOURCES: FeedSource[] = [
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', topic: 'Tech', type: 'rss' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', topic: 'Tech', type: 'rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', topic: 'Tech', type: 'rss' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', topic: 'Tech', type: 'rss' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', topic: 'AI', type: 'rss' },
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', topic: 'AI', type: 'rss' },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', topic: 'AI', type: 'rss' },
]

export async function fetchRssSources(): Promise<RawArticle[]> {
  const results: RawArticle[] = []

  await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url)
        const items = feed.items.slice(0, 10)

        for (const item of items) {
          if (!item.title || !item.link) continue

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyItem = item as any
          const imageUrl: string | undefined =
            anyItem.mediaThumbnail ||
            anyItem.mediaContent ||
            undefined

          results.push({
            title: item.title.trim(),
            url: item.link,
            content: item.contentSnippet || item.content || undefined,
            imageUrl,
            source: 'rss',
            sourceName: source.name,
            topic: source.topic,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          })
        }
      } catch {
        // silently skip failed feeds
      }
    })
  )

  return results
}
