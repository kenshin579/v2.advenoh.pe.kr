'use client'

import { useEffect, useState } from 'react'
import type { WritingItem, WritingSource } from '@/lib/writing'
import { siteConfig } from '@/lib/site-config'

type Source = { source: WritingSource; url: string }

const SOURCES: Source[] = [
  { source: 'IT', url: siteConfig.external.rss.blog },
  { source: 'INV', url: siteConfig.external.rss.investment },
]

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
export function useLiveWriting(initial: {
  it: WritingItem[]
  investment: WritingItem[]
  latest: WritingItem[]
}) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const results = await Promise.all(
          SOURCES.map(async s => {
            const res = await fetch(s.url)
            if (!res.ok) return [] as WritingItem[]
            const xml = await res.text()
            return parseRss(xml, s.source)
          })
        )

        if (cancelled) return
        const [it, inv] = results
        it.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        inv.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

        const latest = [...it, ...inv]
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
          .slice(0, 6)

        setData({
          it: it.slice(0, 5),
          investment: inv.slice(0, 5),
          latest,
        })
      } catch {
        // 실패 시 initialData 유지
      }
    })()

    return () => { cancelled = true }
  }, [])

  return data
}
