'use client'

import { useEffect } from 'react'

type UseKeyboardNavOptions = {
  /** 포커스 순회 대상 카드를 고를 셀렉터. 기본은 `data-project-card` 속성. */
  selector?: string
  /** 프로젝트 카드 수가 달라지면 리스너를 다시 바인딩하기 위한 dep */
  itemCount: number
}

/**
 * j/k 키로 포커스 인덱스 이동. Enter는 각 카드가 자체 onKeyDown에서 처리.
 * 입력 요소(`input`, `textarea`, `contenteditable`) 포커스 시 모든 핸들러 skip.
 * 모달/팔레트가 열린 동안에도 skip하려면 document.body에 `data-overlay-open`을 두고 그 조건 추가 가능.
 */
export function useKeyboardNav({ selector = '[data-project-card]', itemCount }: UseKeyboardNavOptions) {
  useEffect(() => {
    const isEditing = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false
      return (
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.isContentEditable
      )
    }

    const isOverlayOpen = () => {
      // Radix Dialog / cmdk가 body에 data-state를 심으므로 대략적 감지 가능
      return document.querySelector('[role="dialog"][data-state="open"]') !== null
    }

    const getCards = () => Array.from(document.querySelectorAll<HTMLElement>(selector))

    const focusedIndex = () => {
      const cards = getCards()
      const active = document.activeElement as HTMLElement | null
      return cards.findIndex(c => c === active || c.contains(active))
    }

    const handler = (e: KeyboardEvent) => {
      if (isEditing(e.target)) return
      if (e.key !== 'j' && e.key !== 'k') return
      if (isOverlayOpen()) return

      const cards = getCards()
      if (cards.length === 0) return

      e.preventDefault()
      const idx = focusedIndex()
      const next = e.key === 'j'
        ? (idx < 0 ? 0 : Math.min(idx + 1, cards.length - 1))
        : (idx < 0 ? 0 : Math.max(idx - 1, 0))
      cards[next]?.focus()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selector, itemCount])
}
