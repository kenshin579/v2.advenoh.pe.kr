'use client'

import { useEffect, useState, type RefObject } from 'react'

const LINE_HEIGHT_PX = 24
const INITIAL_LINES = 80

type LineGutterProps = {
  targetRef: RefObject<HTMLElement | null>
}

/**
 * IDE 스타일 라인 번호 gutter. 메인 콘텐츠 좌측에 상대 위치로 배치된다.
 * 실제 텍스트 라인과 일치하지 않는 장식 요소이나, 콘텐츠 높이에 맞춰
 * 라인 수를 동적으로 계산해 콘텐츠 끝까지 연속 표시한다.
 */
export function LineGutter({ targetRef }: LineGutterProps) {
  const [lines, setLines] = useState(INITIAL_LINES)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const update = () => {
      const height = el.getBoundingClientRect().height
      const needed = Math.ceil(height / LINE_HEIGHT_PX) + 2
      setLines(prev => {
        const next = Math.max(INITIAL_LINES, needed)
        return prev === next ? prev : next
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [targetRef])

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex w-10 shrink-0 select-none flex-col items-end pr-2 pt-6 font-mono text-[10px] leading-6 text-profile-muted-2"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  )
}
