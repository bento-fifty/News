'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  async function handleRefresh() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ingest', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setResult(`新增 ${data.inserted} 篇文章`)
        router.refresh()
      } else {
        setResult('抓取失敗')
      }
    } catch {
      setResult('網路錯誤')
    } finally {
      setLoading(false)
      setTimeout(() => setResult(null), 4000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className="text-xs" style={{ color: 'var(--accent)' }}>
          {result}
        </span>
      )}
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
        style={{
          background: 'var(--accent-glow)',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
        }}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? '抓取中...' : '更新資訊'}
      </button>
    </div>
  )
}
