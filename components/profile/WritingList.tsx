'use client'

import type { WritingItem } from '@/lib/writing'

type WritingListProps = {
  id: string
  title: string
  hash?: string
  items: WritingItem[]
}

function formatDate(pubDate: string): string {
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function WritingList({ id, title, hash, items }: WritingListProps) {
  const source = items[0]?.source

  return (
    <section id={id} aria-label={title} className="space-y-3">
      <header className="mb-[18px] flex items-baseline gap-3">
        <h2 className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-profile-muted before:content-['//_'] before:text-profile-accent">
          {title}
        </h2>
        {hash && (
          <span className="font-mono text-[11px] text-profile-muted-2">{hash}</span>
        )}
        <div className="flex-1 border-t border-profile-line" aria-hidden="true" />
        <span className="font-mono text-[11px] text-profile-muted">
          {items.length} / recent
        </span>
      </header>

      {items.length === 0 ? (
        <p className="font-mono text-xs text-profile-muted-2">no recent posts</p>
      ) : (
        <ul className="flex flex-col gap-1.5 font-mono text-xs">
          {items.map(item => (
            <li
              key={item.link}
              className="flex items-start gap-2 rounded px-2 py-1 hover:bg-profile-bg-3"
            >
              <span
                className={`mt-0.5 inline-flex h-4 shrink-0 items-center rounded px-1 text-[9px] font-semibold ${
                  (item.source ?? source) === 'IT'
                    ? 'bg-profile-accent-soft text-profile-accent'
                    : 'bg-profile-line-2 text-profile-fg-2'
                }`}
              >
                {item.source ?? source}
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 truncate text-profile-fg-2 hover:text-profile-fg"
              >
                {item.title}
              </a>
              <time className="hidden shrink-0 text-profile-muted-2 sm:inline">
                {formatDate(item.pubDate)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
