'use client'

import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { ExternalLink, TrendingUp, Rss, MessageCircle, Youtube } from 'lucide-react'
import type { Article } from '@prisma/client'

const SOURCE_ICONS = {
  rss: Rss,
  reddit: MessageCircle,
  youtube: Youtube,
}

const SOURCE_COLORS = {
  rss: '#ff6b35',
  reddit: '#ff4500',
  youtube: '#ff0000',
}

const TOPIC_COLORS = {
  AI: { bg: 'rgba(124,111,255,0.12)', text: '#a094ff', border: 'rgba(124,111,255,0.3)' },
  Tech: { bg: 'rgba(45,212,191,0.1)', text: '#2dd4bf', border: 'rgba(45,212,191,0.25)' },
}

interface Props {
  article: Article
}

export function ArticleCard({ article }: Props) {
  const SourceIcon = SOURCE_ICONS[article.source as keyof typeof SOURCE_ICONS] || Rss
  const sourceColor = SOURCE_COLORS[article.source as keyof typeof SOURCE_COLORS] || '#888'
  const topicColor = TOPIC_COLORS[article.topic as keyof typeof TOPIC_COLORS]

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: zhTW,
  })

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--surface)'
      }}
    >
      <div className="flex gap-3">
        {/* Image */}
        {article.imageUrl && (
          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs" style={{ color: sourceColor }}>
              <SourceIcon className="w-3 h-3" />
              {article.sourceName}
            </span>

            {topicColor && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: topicColor.bg,
                  color: topicColor.text,
                  border: `1px solid ${topicColor.border}`,
                }}
              >
                {article.topic}
              </span>
            )}

            <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-medium text-sm leading-snug mb-1.5 line-clamp-2 group-hover:opacity-90"
            style={{ color: 'var(--foreground)' }}
          >
            {article.title}
          </h3>

          {/* AI Summary */}
          {article.summary && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
              {article.summary}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            {article.score > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                <TrendingUp className="w-3 h-3" />
                {article.score.toLocaleString()}
              </span>
            )}
            <ExternalLink
              className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity"
              style={{ color: 'var(--muted)' }}
            />
          </div>
        </div>
      </div>
    </a>
  )
}
