'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { PortfolioItem } from '@/lib/portfolio'

type ProjectModalProps = {
  items: PortfolioItem[]
  /**
   * 프로젝트 카드 클릭 시 window.dispatchEvent로 슬러그를 전달해 모달을 연다.
   * 별도 state 라이브러리 없이도 card(server component) → modal(client) 브리지 역할.
   * Event 이름: `profile:open-project` (detail: slug)
   */
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
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openIdx, prev, next])

  const current = openIdx !== null ? items[openIdx] : null
  const coverSrc = current?.cover ? `/portfolio/${current.slug}/${current.cover}` : null

  return (
    <Dialog.Root
      open={openIdx !== null}
      onOpenChange={open => { if (!open) close() }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[55] bg-black/70 backdrop-blur" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[56] w-[min(92vw,720px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-profile-line-2 bg-profile-bg-2 shadow-2xl"
        >
          {current && (
            <>
              {coverSrc && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-profile-bg-3">
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

              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-profile-accent">
                      {current.slug}{current.ext ?? ''}
                    </div>
                    <Dialog.Title className="mt-1 font-display text-2xl font-semibold text-profile-fg">
                      {current.title}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close
                    aria-label="Close"
                    className="rounded p-1 text-profile-muted hover:bg-profile-bg-3 hover:text-profile-fg"
                  >
                    <X size={16} />
                  </Dialog.Close>
                </div>

                {current.dek && (
                  <p className="text-sm text-profile-fg-2">{current.dek}</p>
                )}

                <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-xs sm:grid-cols-4">
                  {current.status && (
                    <div>
                      <dt className="text-profile-muted-2">status</dt>
                      <dd className="text-profile-fg-2">{current.status}</dd>
                    </div>
                  )}
                  {current.year && (
                    <div>
                      <dt className="text-profile-muted-2">year</dt>
                      <dd className="text-profile-fg-2">{current.year}</dd>
                    </div>
                  )}
                  {current.role && (
                    <div>
                      <dt className="text-profile-muted-2">role</dt>
                      <dd className="text-profile-fg-2">{current.role}</dd>
                    </div>
                  )}
                  <div className="col-span-2">
                    <dt className="text-profile-muted-2">url</dt>
                    <dd className="truncate text-profile-fg-2">{current.site}</dd>
                  </div>
                </dl>

                {current.overview && (
                  <div className="rounded border border-profile-line bg-profile-bg-3 p-4 text-sm leading-relaxed text-profile-fg-2 whitespace-pre-line">
                    {current.overview}
                  </div>
                )}

                {current.stack && current.stack.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {current.stack.map(tech => (
                      <li
                        key={tech}
                        className="rounded border border-profile-line-2 bg-profile-bg-3 px-2 py-0.5 font-mono text-[11px] text-profile-fg-2"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                <footer className="flex items-center justify-between border-t border-profile-line-2 pt-4 font-mono text-xs">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous project"
                      className="flex items-center gap-1 rounded border border-profile-line-2 px-2 py-1 text-profile-muted hover:border-profile-accent hover:text-profile-accent"
                    >
                      <ChevronLeft size={12} /> prev
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next project"
                      className="flex items-center gap-1 rounded border border-profile-line-2 px-2 py-1 text-profile-muted hover:border-profile-accent hover:text-profile-accent"
                    >
                      next <ChevronRight size={12} />
                    </button>
                  </div>
                  <a
                    href={current.site}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 rounded border border-profile-accent bg-profile-accent-soft px-3 py-1 text-profile-accent"
                  >
                    Open live <ExternalLink size={12} />
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
