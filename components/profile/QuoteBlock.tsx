'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Quote } from '@/lib/quotes'

type QuoteBlockProps = {
  quotes: Quote[]
  intervalMs?: number
}

export function QuoteBlock({ quotes, intervalMs = 12_000 }: QuoteBlockProps) {
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => {
    setIdx(i => (i + 1) % Math.max(quotes.length, 1))
  }, [quotes.length])

  useEffect(() => {
    if (quotes.length <= 1) return
    const id = setInterval(next, intervalMs)
    return () => clearInterval(id)
  }, [quotes.length, intervalMs, next])

  if (quotes.length === 0) return null
  const current = quotes[idx]

  return (
    <div className="rounded-lg border border-profile-line bg-profile-bg-3 p-4 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="text-profile-muted-2">$ fortune</span>
        <button
          type="button"
          onClick={next}
          aria-label="Next quote"
          className="rounded border border-profile-line-2 px-1.5 py-0.5 text-[10px] text-profile-muted hover:border-profile-accent hover:text-profile-accent"
        >
          ↻ rotate
        </button>
      </div>
      <blockquote className="mt-3 space-y-2">
        <p className="text-sm text-profile-fg-2 leading-relaxed">“{current.quote}”</p>
        <footer className="text-[11px] text-profile-muted">— {current.author}</footer>
      </blockquote>
    </div>
  )
}
