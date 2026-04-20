'use client'

import { useEffect, useState } from 'react'
import {
  fetchTodayQuote,
  quoteDetailUrl,
  FALLBACK_QUOTE,
  type TodayQuote,
} from '@/lib/quotes-client'

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; quote: TodayQuote }
  | { kind: 'error'; quote: TodayQuote }

const LS_KEY = (date: string, lang: string) => `quote:today:${date}:${lang}`

function kstDate(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())
}

export function QuoteBlock() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    const lang = 'ko'
    const dateKey = kstDate()

    const cached = typeof window !== 'undefined'
      ? window.localStorage.getItem(LS_KEY(dateKey, lang))
      : null
    if (cached) {
      try {
        setState({ kind: 'ready', quote: JSON.parse(cached) as TodayQuote })
        return
      } catch {
        /* fall through to fetch */
      }
    }

    fetchTodayQuote(lang).then(quote => {
      if (cancelled) return
      if (quote) {
        setState({ kind: 'ready', quote })
        try {
          window.localStorage.setItem(LS_KEY(dateKey, lang), JSON.stringify(quote))
        } catch {
          /* ignore quota errors */
        }
      } else {
        setState({ kind: 'error', quote: FALLBACK_QUOTE })
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-lg border border-profile-line bg-profile-bg-3 p-4 font-mono text-xs min-h-[104px]">
      <div className="flex items-center justify-between">
        <span className="text-profile-muted-2">$ quote-of-the-day</span>
      </div>
      {state.kind === 'loading' ? (
        <div className="mt-3 space-y-2" aria-hidden>
          <div className="h-4 w-5/6 rounded bg-profile-line-2/40 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-profile-line-2/40 animate-pulse" />
        </div>
      ) : (
        <QuoteBody quote={state.quote} disabled={state.kind === 'error'} />
      )}
    </div>
  )
}

function QuoteBody({ quote, disabled }: { quote: TodayQuote; disabled: boolean }) {
  const body = (
    <blockquote className="mt-3 space-y-2">
      <p className="text-sm text-profile-fg-2 leading-relaxed">“{quote.content}”</p>
      <footer className="text-[11px] text-profile-muted">— {quote.author}</footer>
    </blockquote>
  )

  if (disabled || !quote.id) return body

  return (
    <a
      href={quoteDetailUrl(quote.id)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="inspire-me에서 이 명언 자세히 보기"
      className="block transition-colors hover:text-profile-accent focus-visible:text-profile-accent focus-visible:outline-none"
    >
      {body}
    </a>
  )
}
