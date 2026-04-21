'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioItem } from '@/lib/portfolio'

type ProjectModalProps = {
  items: PortfolioItem[]
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

  const openSlug = useCallback(
    (slug: string) => {
      const idx = items.findIndex(i => i.slug === slug)
      if (idx >= 0) setOpenIdx(idx)
    },
    [items]
  )

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
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openIdx, prev, next])

  const current = openIdx !== null ? items[openIdx] : null
  const coverSrc = current?.cover ? `/portfolio/${current.slug}/${current.cover}` : null
  const host = current ? hostOf(current.site) : ''
  const dekId = current ? `modal-dek-${current.slug}` : undefined
  const describedBy = current?.dek ? dekId : undefined

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
          className="fixed left-1/2 top-1/2 z-[56] grid w-[min(960px,100%)] max-h-[calc(100vh-80px)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_1fr_auto] overflow-hidden rounded-xl border border-profile-line-2 bg-profile-bg-2 shadow-2xl"
        >
          {current && (
            <>
              {/* Header .mh — dots + ~/projects/<b>slug</b> + close·ESC */}
              <div className="flex items-center gap-[14px] border-b border-profile-line bg-profile-bg-3 px-4 py-3 font-mono text-xs text-profile-muted">
                <div className="flex items-center gap-1.5">
                  <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
                  <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
                  <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 truncate text-profile-fg-2">
                  ~/projects/
                  <b className="font-medium text-profile-accent">{current.slug}</b>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-profile-muted hover:bg-profile-line hover:text-profile-fg"
                >
                  <span>close · ESC</span>
                  <X size={12} aria-hidden="true" />
                </Dialog.Close>
              </div>

              {/* Body — Hero(flush) + mcontent */}
              <div className="overflow-auto">
                {coverSrc && (
                  <div className="relative aspect-[16/9] w-full border-b border-profile-line bg-profile-bg-3">
                    <Image
                      src={coverSrc}
                      alt={current.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 960px) 960px, 100vw"
                    />
                  </div>
                )}

                <div className="px-4 py-5 sm:px-8 sm:py-6">
                  {/* Title + Dek */}
                  <Dialog.Title asChild>
                    <h3 className="m-0 mb-1.5 font-display text-[32px] font-medium leading-tight tracking-[-0.02em] text-profile-fg">
                      {current.title}
                    </h3>
                  </Dialog.Title>
                  {current.dek && (
                    <p
                      id={dekId}
                      className="mb-[22px] mt-0 max-w-[60ch] font-sans text-[15px] leading-[1.6] text-profile-fg-2"
                    >
                      {current.dek}
                    </p>
                  )}

                  {/* Meta Grid — 4-cell box */}
                  {(current.status || current.year || current.role || host) && (
                    <dl className="my-[18px] grid grid-cols-2 rounded-lg border border-profile-line py-4 sm:grid-cols-4">
                      <MetaCell label="status" value={current.status} />
                      <MetaCell label="year" value={current.year} />
                      <MetaCell label="role" value={current.role} />
                      <MetaCell label="url" value={host} isLast />
                    </dl>
                  )}

                  {/* Overview */}
                  {current.overviewHtml && (
                    <section>
                      <h4 className="mb-2 mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-profile-accent">
                        Overview
                      </h4>
                      <div
                        className="readme"
                        dangerouslySetInnerHTML={{ __html: current.overviewHtml }}
                      />
                    </section>
                  )}

                  {/* Stack */}
                  {current.stack && current.stack.length > 0 && (
                    <section>
                      <h4 className="mb-2 mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-profile-accent">
                        Stack
                      </h4>
                      <ul className="flex flex-wrap gap-1.5 font-mono text-[11px] text-profile-fg-2">
                        {current.stack.map(tech => (
                          <li
                            key={tech}
                            className="rounded-[3px] border border-profile-line-2 px-2 py-[3px]"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>

              {/* Footer .mf */}
              <footer className="flex flex-col items-stretch gap-3 border-t border-profile-line bg-profile-bg-3 px-4 py-3 font-mono text-[11px] text-profile-muted sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-1.5">
                  press{' '}
                  <kbd className="rounded border border-profile-line-2 bg-profile-bg-2 px-1.5 py-[1px] text-[10px] text-profile-fg-2">
                    ←
                  </kbd>
                  <kbd className="rounded border border-profile-line-2 bg-profile-bg-2 px-1.5 py-[1px] text-[10px] text-profile-fg-2">
                    →
                  </kbd>{' '}
                  to navigate projects
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous project"
                    aria-keyshortcuts="ArrowLeft"
                    className="flex items-center gap-1 rounded-md border border-profile-line-2 px-3 py-[7px] text-[12px] text-profile-fg transition hover:border-profile-accent hover:bg-profile-accent-soft hover:text-profile-accent"
                  >
                    <ChevronLeft size={12} aria-hidden="true" /> prev
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next project"
                    aria-keyshortcuts="ArrowRight"
                    className="flex items-center gap-1 rounded-md border border-profile-line-2 px-3 py-[7px] text-[12px] text-profile-fg transition hover:border-profile-accent hover:bg-profile-accent-soft hover:text-profile-accent"
                  >
                    next <ChevronRight size={12} aria-hidden="true" />
                  </button>
                  <a
                    href={current.site}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 rounded-md border border-profile-accent bg-profile-accent px-3 py-[7px] text-[12px] text-profile-accent-ink transition hover:brightness-110"
                  >
                    Open live <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function MetaCell({
  label,
  value,
  isLast = false,
}: {
  label: string
  value: string | undefined
  isLast?: boolean
}) {
  return (
    <div
      className={`px-4 ${
        isLast ? '' : 'sm:border-r sm:border-profile-line'
      }`}
    >
      <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-profile-muted">
        {label}
      </dt>
      <dd className="font-sans text-[13.5px] text-profile-fg">{value || '—'}</dd>
    </div>
  )
}
