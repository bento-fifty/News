import { Zap } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="p-4 rounded-2xl mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <Zap className="w-8 h-8" style={{ color: 'var(--accent)' }} />
      </div>
      <h3 className="font-semibold text-base mb-2">還沒有文章</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        呼叫 /api/ingest 端點來開始抓取最新資訊
      </p>
      <code
        className="text-xs px-3 py-2 rounded-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}
      >
        POST /api/ingest
      </code>
    </div>
  )
}
