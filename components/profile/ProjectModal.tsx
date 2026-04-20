'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioItem } from '@/lib/portfolio'

type ProjectModalProps = {
  items: PortfolioItem[]
  /**
   * 프로젝트 카드 클릭 시 window.dispatchEvent로 슬러그를 전달해 모달을 연다.
   * Event 이름: `profile:open-project` (detail: slug)
   */
}

function hostOf(site: string): string {
  try {
    return new URL(site).hostname
  } catch {
    return site
  }
}

export function ProjectModal({ items }: ProjectModalProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const openSlug = useCallback((slug: string) => {
    const idx = items.findIndex(i => i.slug === slug)
    if (idx >= 0) setOpenIdx(idx)
  }, [items])

  const close = useCallback(() => setOpenIdx(null), [])

  const prev = useCallback(() => {
    setOpenIdx(i => (i === null ? null : (i - 1 + items.length) % items.length))
  }, [items.length])

  const next = useCallback(() => {
    setOpenIdx(i => (i === null ? null : (i + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (detail) openSlug(detail)
    }
    window.addEventListener('profile:open-project', handler as EventListener)
    return () => window.removeEventListener('profile:open-project', handler as EventListener)
  }, [openSlug])

  useEffect(() => {
    if (openIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openIdx, prev, next])

  const current = openIdx !== null ? items[openIdx] : null
  const coverSrc = current?.cover ? `/portfolio/${current.slug}/${current.cover}` : null
  const isLive = current?.status?.toLowerCase().startsWith('live') ?? false
  const host = current ? hostOf(current.site) : ''
  const stackSummary =
    current?.stack && current.stack.length > 0
      ? current.stack.length > 3
        ? `${current.stack.slice(0, 3).join(' · ')} +${current.stack.length - 3}`
        : current.stack.join(' · ')
      : null
  const overviewId = current ? `modal-overview-${current.slug}` : undefined
  const dekId = current ? `modal-dek-${current.slug}` : undefined
  const describedBy = current?.overview ? overviewId : current?.dek ? dekId : undefined

  return (
    <Dialog.Root
      open={openIdx !== null}
      onOpenChange={open => {
        if (!open) close()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[55] bg-black/70 backdrop-blur" />
        <Dialog.Content
          aria-describedby={describedBy}
          className="fixed left-1/2 top-1/2 z-[56] w-[min(92vw,720px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-profile-line-2 bg-profile-bg-2 shadow-2xl"
        >
          {current && (
            <>
              {/* A. Modal Chrome — mini TitleBar */}
              <div className="flex h-[38px] items-center gap-3 border-b border-profile-line-2 bg-profile-bg-3/95 px-4 font-mono text-xs text-profile-fg-2 backdrop-blur">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="hidden truncate text-profile-muted sm:inline">
                  frank@seoul:~/projects/{current.slug}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <kbd className="rounded border border-profile-line-2 bg-profile-bg-2 px-1 py-[1px] text-[10px] text-profile-muted">
                    esc
                  </kbd>
                  <Dialog.Close
                    aria-label="Close"
                    className="rounded p-1 text-profile-muted hover:bg-profile-bg-2 hover:text-profile-fg"
                  >
                    <X size={14} />
                  </Dialog.Close>
                </div>
              </div>

              {/* B. Section Header — // project.detail #04 + j/k kbd */}
              <header className="flex items-baseline gap-3 border-b border-profile-line px-[var(--profile-space-card)] py-3">
                <h2 className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-profile-muted before:text-profile-accent before:content-['//_']">
                  project.detail
                </h2>
                <span className="font-mono text-[11px] text-profile-muted-2">#04</span>
                <div className="flex-1" aria-hidden="true" />
                <span className="font-mono text-[11px] text-profile-muted">
                  {(openIdx ?? 0) + 1}/{items.length} ·{' '}
                  <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">
                    j
                  </kbd>{' '}
                  <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">
                    k
                  </kbd>
                </span>
              </header>

              <div className="space-y-[var(--profile-space-card)] p-[var(--profile-space-card)]">
                {/* L. Cover Image — 카드와 동일한 border/radius wrapper */}
                {coverSrc && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded border border-profile-line bg-profile-bg-3">
                    <Image
                      src={coverSrc}
                      alt={current.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 768px) 720px, 92vw"
                    />
                  </div>
                )}

                {/* C. Hero slug line + title + E. live 뱃지 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm">
                      <span className="text-profile-muted">//</span>{' '}
                      <span className="text-profile-fg">{current.slug}</span>
                      <span className="text-profile-accent">{current.ext ?? ''}</span>
                      <span className="text-profile-muted-2">;</span>
                    </div>
                    {isLive && (
                      <span
                        className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-profile-muted"
                        title={current.status}
                      >
                        <i
                          className="h-1.5 w-1.5 rounded-full bg-profile-green"
                          style={{ boxShadow: '0 0 4px var(--profile-green)' }}
                        />
                        {current.status}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-2xl leading-tight tracking-[-0.02em] text-profile-fg">
                    <Dialog.Title asChild>
                      <strong className="font-medium">{current.title}</strong>
                    </Dialog.Title>
                    {current.dek && (
                      <>
                        <span className="text-profile-muted-2"> — </span>
                        <span
                          id={dekId}
                          className="font-sans text-sm font-normal text-profile-fg-2"
                        >
                          {current.dek}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* D. Meta dl — grid-cols-[120px_1fr] + · 프리픽스 / F. host */}
                {(current.role || current.year || stackSummary || host) && (
                  <dl className="grid grid-cols-1 gap-x-5 gap-y-[7px] font-mono text-[13px] sm:grid-cols-[120px_1fr]">
                    {current.role && (
                      <div className="contents">
                        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">
                          role
                        </dt>
                        <dd className="text-profile-fg-2">{current.role}</dd>
                      </div>
                    )}
                    {current.year && (
                      <div className="contents">
                        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">
                          year
                        </dt>
                        <dd className="text-profile-fg-2">{current.year}</dd>
                      </div>
                    )}
                    {stackSummary && (
                      <div className="contents">
                        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">
                          stack
                        </dt>
                        <dd className="text-profile-fg-2">{stackSummary}</dd>
                      </div>
                    )}
                    {host && (
                      <div className="contents">
                        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">
                          host
                        </dt>
                        <dd className="text-profile-fg-2">→ {host}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {/* G. Overview — // overview 서브헤더 + border-l-2 인용 블록 */}
                {current.overview && (
                  <section className="space-y-2">
                    <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-profile-muted-2 before:text-profile-accent before:content-['//_']">
                      overview
                    </h3>
                    <div
                      id={overviewId}
                      className="whitespace-pre-line border-l-2 border-profile-line-2 pl-4 text-sm leading-relaxed text-profile-fg-2"
                    >
                      {current.overview}
                    </div>
                  </section>
                )}

                {/* H. Stack tags — // stack 서브헤더 + 10px 보더만 태그 */}
                {current.stack && current.stack.length > 0 && (
                  <section className="space-y-2">
                    <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-profile-muted-2 before:text-profile-accent before:content-['//_']">
                      stack
                    </h3>
                    <ul className="flex flex-wrap gap-1.5 font-mono text-[10px] text-profile-muted">
                      {current.stack.map(tech => (
                        <li
                          key={tech}
                          className="rounded-sm border border-profile-line-2 px-[7px] py-0.5"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* I. Footer — 점선 + prev/next kbd + Open live ↗ */}
                <footer className="flex flex-col items-stretch gap-3 border-t border-dashed border-profile-line pt-4 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous project"
                      aria-keyshortcuts="k ArrowLeft"
                      className="flex items-center gap-1 rounded border border-profile-line-2 px-2 py-1 text-profile-muted hover:border-profile-accent hover:text-profile-accent"
                    >
                      <ChevronLeft size={12} /> prev
                      <kbd className="ml-1 rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted-2">
                        k
                      </kbd>
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next project"
                      aria-keyshortcuts="j ArrowRight"
                      className="flex items-center gap-1 rounded border border-profile-line-2 px-2 py-1 text-profile-muted hover:border-profile-accent hover:text-profile-accent"
                    >
                      next <ChevronRight size={12} />
                      <kbd className="ml-1 rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted-2">
                        j
                      </kbd>
                    </button>
                  </div>
                  <a
                    href={current.site}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-center gap-1 rounded border border-profile-accent bg-profile-accent-soft px-3 py-1 text-profile-accent"
                  >
                    Open live <span aria-hidden="true">↗</span>
                    <kbd className="ml-1 rounded border border-profile-accent/40 px-1 py-[1px] text-[10px]">
                      ↵
                    </kbd>
                  </a>
                </footer>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
