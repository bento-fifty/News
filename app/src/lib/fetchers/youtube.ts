import type { RawArticle } from '@/types'

interface YouTubeItem {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    publishedAt: string
    channelTitle: string
    thumbnails: { medium?: { url: string }; default?: { url: string } }
  }
}

interface YouTubeChannel {
  channelId: string
  name: string
  topic: string
}

const CHANNELS: YouTubeChannel[] = [
  { channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', name: 'Google for Developers', topic: 'Tech' },
  { channelId: 'UCnUYZLuoy1rq1aVMwx4aTzw', name: 'Two Minute Papers', topic: 'AI' },
  { channelId: 'UCLB7AzTwc6VFZrBsO2ucBMg', name: 'Yannic Kilcher', topic: 'AI' },
  { channelId: 'UCbmNph6atAoGfqLoCL_duAg', name: 'Sentdex', topic: 'AI' },
]

export async function fetchYouTubeSources(): Promise<RawArticle[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const results: RawArticle[] = []

  await Promise.allSettled(
    CHANNELS.map(async (channel) => {
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search')
        url.searchParams.set('part', 'snippet')
        url.searchParams.set('channelId', channel.channelId)
        url.searchParams.set('type', 'video')
        url.searchParams.set('order', 'date')
        url.searchParams.set('maxResults', '5')
        url.searchParams.set('key', apiKey)

        const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) })
        if (!res.ok) return

        const json = await res.json() as { items: YouTubeItem[] }

        for (const item of json.items) {
          results.push({
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            content: item.snippet.description,
            imageUrl:
              item.snippet.thumbnails.medium?.url ||
              item.snippet.thumbnails.default?.url,
            source: 'youtube',
            sourceName: channel.name,
            topic: channel.topic,
            publishedAt: new Date(item.snippet.publishedAt),
          })
        }
      } catch {
        // silently skip failed channels
      }
    })
  )

  return results
}
