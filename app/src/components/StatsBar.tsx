interface Props {
  total: number
  source?: string
  topic?: string
}

export function StatsBar({ total, source, topic }: Props) {
  const label = [topic, source ? `(${source})` : ''].filter(Boolean).join(' ')

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
          {label ? `${label} 精選` : '最新精華'}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          共 {total} 篇文章
        </p>
      </div>
    </div>
  )
}
