'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Rss, MessageCircle, Youtube, Globe } from 'lucide-react'

const SOURCES = [
  { value: '', label: '全部', icon: Globe },
  { value: 'rss', label: 'News', icon: Rss },
  { value: 'reddit', label: 'Reddit', icon: MessageCircle },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
]

const TOPICS = [
  { value: '', label: '所有主題' },
  { value: 'AI', label: 'AI' },
  { value: 'Tech', label: '科技' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSource = searchParams.get('source') ?? ''
  const currentTopic = searchParams.get('topic') ?? ''

  function navigate(source: string, topic: string) {
    const params = new URLSearchParams()
    if (source) params.set('source', source)
    if (topic) params.set('topic', topic)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div
      className="sticky top-[53px] z-40 py-3 px-4"
      style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto flex gap-6 items-center flex-wrap">
        {/* Source filter */}
        <div className="flex gap-1">
          {SOURCES.map(({ value, label, icon: Icon }) => {
            const active = currentSource === value
            return (
              <button
                key={value}
                onClick={() => navigate(value, currentTopic)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--accent-glow)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${active ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>

        <div style={{ color: 'var(--border)' }}>|</div>

        {/* Topic filter */}
        <div className="flex gap-1">
          {TOPICS.map(({ value, label }) => {
            const active = currentTopic === value
            return (
              <button
                key={value}
                onClick={() => navigate(currentSource, value)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--surface-2)' : 'transparent',
                  color: active ? 'var(--foreground)' : 'var(--muted)',
                  border: `1px solid ${active ? 'var(--border)' : 'transparent'}`,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
