'use client'

import { useEffect, useState } from 'react'

/**
 * 섹션 id 배열을 받아 현재 뷰포트 상단에 가장 가까운 섹션의 id를 반환.
 * rootMargin으로 `header offset` 보정 — TitleBar 높이 10(=40px) 감안.
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)

  useEffect(() => {
    if (sectionIds.length === 0) return

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length === 0) return
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const topMost = visible[0]
        setActiveId(topMost.target.id)
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
