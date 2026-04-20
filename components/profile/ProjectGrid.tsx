'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PortfolioItem } from '@/lib/portfolio'
import { ProjectCardV2 } from './ProjectCardV2'

type ProjectGridProps = {
  items: PortfolioItem[]
}

export function ProjectGrid({ items }: ProjectGridProps) {
  const [focusIdx, setFocusIdx] = useState(0)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const moveFocus = useCallback(
    (delta: number) => {
      setFocusIdx(prev => {
        const next = Math.max(0, Math.min(items.length - 1, prev + delta))
        cardRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        return next
      })
    },
    [items.length]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? ''
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (document.querySelector('[role="dialog"][data-state="open"]')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocus(+1)
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus(-1)
      } else if (e.key === 'Enter') {
        const target = items[focusIdx]
        if (target) {
          e.preventDefault()
          window.dispatchEvent(
            new CustomEvent('profile:open-project', { detail: target.slug })
          )
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focusIdx, items, moveFocus])

  return (
    <section id="projects" aria-label="projects" className="space-y-4">
      <header className="mb-[18px] flex items-baseline gap-3">
        <h2 className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-profile-muted before:text-profile-accent before:content-['//_']">
          projects
        </h2>
        <span className="font-mono text-[11px] text-profile-muted-2">#02</span>
        <div className="flex-1 border-t border-profile-line" aria-hidden="true" />
        <span className="font-mono text-[11px] text-profile-muted">
          ls ./projects · {items.length} items ·{' '}
          <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">
            j
          </kbd>{' '}
          <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">
            k
          </kbd>{' '}
          to navigate
        </span>
      </header>

      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-6">
        {items.map((item, idx) => (
          <div
            key={item.slug}
            ref={el => {
              cardRefs.current[idx] = el
            }}
            className={item.featured ? 'md:col-span-6' : 'md:col-span-3'}
          >
            <ProjectCardV2
              item={item}
              variant={item.featured ? 'featured' : 'default'}
              focused={idx === focusIdx}
              onFocus={() => setFocusIdx(idx)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
