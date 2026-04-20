'use client'

import Image from 'next/image'
import type { PortfolioItem } from '@/lib/portfolio'

type ProjectCardV2Props = {
  item: PortfolioItem
  variant?: 'featured' | 'default'
  focused?: boolean
  onFocus?: () => void
}

function openModal(slug: string) {
  window.dispatchEvent(new CustomEvent('profile:open-project', { detail: slug }))
}

function hostOf(site: string): string {
  try {
    return new URL(site).hostname
  } catch {
    return site
  }
}

export function ProjectCardV2({
  item,
  variant = 'default',
  focused = false,
  onFocus,
}: ProjectCardV2Props) {
  const dek = item.dek ?? item.description
  const isLive = item.status?.toLowerCase().startsWith('live') ?? false
  const coverSrc = item.cover ? `/portfolio/${item.slug}/${item.cover}` : null
  const host = hostOf(item.site)

  const base = `project-card${
    focused ? ' focused' : ''
  } relative cursor-pointer rounded-[10px] border border-profile-line bg-profile-bg-2 transition hover:border-profile-accent hover:bg-[linear-gradient(180deg,var(--profile-accent-soft),var(--profile-bg-2))] focus-visible:outline focus-visible:outline-1 focus-visible:outline-profile-accent focus-visible:-outline-offset-2`

  if (variant === 'featured') {
    return (
      <article
        role="button"
        tabIndex={0}
        data-project-card={item.slug}
        aria-keyshortcuts="Enter j k"
        onClick={() => openModal(item.slug)}
        onMouseEnter={onFocus}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openModal(item.slug)
          }
        }}
        className={`${base} md:grid md:grid-cols-[1.2fr_1fr] md:items-stretch md:gap-[22px] md:p-[22px] p-[18px] flex flex-col gap-[14px]`}
      >
        <span className="featured-tag absolute top-[14px] right-[14px] rounded bg-profile-accent px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-profile-accent-ink z-10">
          featured
        </span>

        <div className="flex flex-col gap-[14px] md:col-start-1">
          <div className="row flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[32px] font-medium leading-tight tracking-[-0.02em] text-profile-fg before:content-['★_'] before:text-profile-accent">
              {item.slug}
              <span className="text-profile-accent">{item.ext ?? ''}</span>
            </h3>
            {isLive && (
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-profile-muted"
                title={item.status}
              >
                <i
                  className="h-1.5 w-1.5 rounded-full bg-profile-green"
                  style={{ boxShadow: '0 0 4px var(--profile-green)' }}
                />
                {item.status}
              </span>
            )}
          </div>

          <p className="max-w-[48ch] text-[15px] leading-[1.6] text-profile-fg-2">{dek}</p>

          {item.stack && item.stack.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 font-mono text-[10px] text-profile-muted">
              {item.stack.map(tech => (
                <li
                  key={tech}
                  className="rounded-sm border border-profile-line-2 px-[7px] py-0.5"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          <footer className="mt-auto flex justify-between pt-2 font-mono text-[10px] text-profile-muted border-t border-dashed border-profile-line">
            <span>→ {host}</span>
            <span>
              {item.year}
              {item.role ? ` · ${item.role}` : ''}
            </span>
          </footer>
        </div>

        {coverSrc && (
          <div className="relative overflow-hidden rounded-lg border border-profile-line bg-profile-bg-3 min-h-[200px] md:min-h-[240px] md:col-start-2 md:row-start-1 md:row-span-full order-first md:order-none">
            <Image
              src={coverSrc}
              alt={item.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}

        <span className="kbd absolute top-[14px] right-[14px] opacity-0 transition-opacity font-mono text-[10px] text-profile-accent">
          ↵ open
        </span>
      </article>
    )
  }

  return (
    <article
      role="button"
      tabIndex={0}
      data-project-card={item.slug}
      aria-keyshortcuts="Enter j k"
      onClick={() => openModal(item.slug)}
      onMouseEnter={onFocus}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openModal(item.slug)
        }
      }}
      className={`${base} flex flex-col gap-[10px] overflow-hidden px-[18px] pt-4 pb-[18px]`}
    >
      <div className="row flex items-baseline justify-between gap-3">
        <div className="font-mono text-sm font-medium text-profile-fg before:content-['▸_'] before:text-[10px] before:text-profile-muted">
          {item.slug}
          <span className="text-profile-accent">{item.ext ?? ''}</span>
        </div>
        {isLive && (
          <div
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-profile-muted"
            title={item.status}
          >
            <i
              className="h-1.5 w-1.5 rounded-full bg-profile-green"
              style={{ boxShadow: '0 0 4px var(--profile-green)' }}
            />
            {item.status}
          </div>
        )}
      </div>

      {coverSrc && (
        <div className="relative h-[120px] overflow-hidden rounded-md border border-profile-line bg-profile-bg-3">
          <Image
            src={coverSrc}
            alt={item.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-[400ms]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}

      <p className="font-sans text-[13px] leading-[1.55] text-profile-fg-2">{dek}</p>

      {item.stack && item.stack.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 font-mono text-[10px] text-profile-muted">
          {item.stack.map(tech => (
            <li
              key={tech}
              className="rounded-sm border border-profile-line-2 px-[7px] py-0.5"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      <footer className="flex justify-between pt-2 font-mono text-[10px] text-profile-muted border-t border-dashed border-profile-line">
        <span>→ {host}</span>
        <span>
          {item.year}
          {item.role ? ` · ${item.role}` : ''}
        </span>
      </footer>

      <span className="kbd absolute top-[14px] right-[14px] opacity-0 transition-opacity font-mono text-[10px] text-profile-accent">
        ↵ open
      </span>
    </article>
  )
}
