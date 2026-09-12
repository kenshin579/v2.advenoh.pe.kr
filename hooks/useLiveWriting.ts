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
 * 클라이언트 마운트 시 locale 에 해당하는 두 RSS 피드를 fetch·파싱해 initialData를 fresh로 교체.
 * 브라우저 DOMParser 사용 — 번들 의존성 0.
 *
 * 피드 하나라도 실패하면(CORS·네트워크 예외, 혹은 4xx/5xx) 교체하지 않고 빌드 타임 데이터를 유지한다.
 * 영어 IT 피드(/en/rss.xml)의 CORS 헤더는 blog-v2 쪽 별도 PR 로 추가되며, 그 전까지는
 * 이 재조회가 조용히 실패하고 빌드 타임 영어 글이 그대로 남는다.
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
            // 빈 배열로 내려보내면 setData 가 정상 목록을 빈 화면으로 덮어쓴다.
            // 던져서 아래 catch 로 보내 initialData 를 유지한다.
            if (!res.ok) throw new Error(`${f.source} RSS ${res.status}`)
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
