'use client'

import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
      className="sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}
          >
            <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-semibold text-base tracking-tight">InfoPulse</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--accent-glow)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}
          >
            AI 精選
          </span>
        </div>

        <div style={{ color: 'var(--muted)' }} className="text-sm">
          科技 · AI · 開發者資訊
        </div>
      </div>
    </header>
  )
}
