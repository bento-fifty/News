import type { RawArticle } from '@/types'

interface RedditPost {
  data: {
    title: string
    url: string
    permalink: string
    selftext: string
    score: number
    thumbnail: string
    created_utc: number
    is_self: boolean
    domain: string
  }
}

interface RedditSubreddit {
  name: string
  topic: string
}

const SUBREDDITS: RedditSubreddit[] = [
  { name: 'MachineLearning', topic: 'AI' },
  { name: 'artificial', topic: 'AI' },
  { name: 'LocalLLaMA', topic: 'AI' },
  { name: 'technology', topic: 'Tech' },
  { name: 'programming', topic: 'Tech' },
  { name: 'singularity', topic: 'AI' },
]

async function fetchSubreddit(subreddit: RedditSubreddit): Promise<RawArticle[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit.name}/hot.json?limit=10`,
    {
      headers: {
        'User-Agent': 'InfoAggregator/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    }
  )

  if (!res.ok) return []

  const json = await res.json() as { data: { children: RedditPost[] } }
  const posts = json.data.children

  return posts
    .filter((p) => !p.data.is_self || p.data.selftext.length > 50)
    .map((p) => ({
      title: p.data.title.trim(),
      url: p.data.is_self
        ? `https://reddit.com${p.data.permalink}`
        : p.data.url,
      content: p.data.selftext?.slice(0, 500) || undefined,
      imageUrl:
        p.data.thumbnail && p.data.thumbnail.startsWith('http')
          ? p.data.thumbnail
          : undefined,
      source: 'reddit' as const,
      sourceName: `r/${subreddit.name}`,
      topic: subreddit.topic,
      score: p.data.score,
      publishedAt: new Date(p.data.created_utc * 1000),
    }))
}

export async function fetchRedditSources(): Promise<RawArticle[]> {
  const results = await Promise.allSettled(SUBREDDITS.map(fetchSubreddit))
  return results
    .filter((r): r is PromiseFulfilledResult<RawArticle[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}
