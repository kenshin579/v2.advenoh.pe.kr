'use client'

import { useEffect, useState } from 'react'
import type { WritingItem } from '@/lib/writing'
import { writingFeeds, type WritingSource } from '@/lib/writing-feeds'
import type { Locale } from '@/lib/i18n/types'

function parseRss(xml: string, source: WritingSource): WritingItem[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) return []

  const items: WritingItem[] = []
  doc.querySelectorAll('item').forEach(node => {
    const title = node.querySelector('title')?.textContent?.trim() ?? ''
    const link = node.querySelector('link')?.textContent?.trim() ?? ''
    const pubDate = node.querySelector('pubDate')?.textContent?.trim() ?? ''
    const description = node.querySelector('description')?.textContent?.trim()
    if (!title || !link) return
    items.push({ source, title, link, pubDate, description: description || undefined })
  })
  return items
}

/**
 * 클라이언트 마운트 시 두 RSS 피드를 fetch·파싱해 initialData를 fresh로 교체.
 * 브라우저 DOMParser 사용 — 번들 의존성 0.
 * CORS 헤더는 Phase 0에서 두 블로그에 추가됨.
 */
export function useLiveWriting(
  initial: {
    it: WritingItem[]
    investment: WritingItem[]
    latest: WritingItem[]
    totals: { it: number; investment: number }
  },
  locale: Locale
) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    let cancelled = false
    const feeds = writingFeeds(locale)

    ;(async () => {
      try {
        const results = await Promise.all(
          feeds.map(async f => {
            const res = await fetch(f.url)
            if (!res.ok) return [] as WritingItem[]
            const xml = await res.text()
            return parseRss(xml, f.source)
          })
        )

        if (cancelled) return
        const [it, inv] = results
        it.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        inv.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

        const latest = [...it, ...inv]
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
          .slice(0, 10)

        setData({
          it: it.slice(0, 5),
          investment: inv.slice(0, 5),
          latest,
          totals: { it: it.length, investment: inv.length },
        })
      } catch {
        // 실패 시 initialData 유지
      }
    })()

    return () => { cancelled = true }
  }, [locale])

  return data
}
