export type SourceType = 'rss' | 'reddit' | 'youtube'

export interface RawArticle {
  title: string
  url: string
  content?: string
  imageUrl?: string
  source: SourceType
  sourceName: string
  topic: string
  score?: number
  publishedAt: Date
}

export interface FeedSource {
  name: string
  url: string
  topic: string
  type: SourceType
}
