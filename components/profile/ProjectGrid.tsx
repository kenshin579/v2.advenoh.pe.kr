'use client'

import type { PortfolioItem } from '@/lib/portfolio'
import { ProjectCardV2 } from './ProjectCardV2'

type ProjectGridProps = {
  items: PortfolioItem[]
}

export function ProjectGrid({ items }: ProjectGridProps) {
  return (
    <section id="projects" aria-label="projects" className="space-y-4">
      <header className="mb-[18px] flex items-baseline gap-3">
        <h2 className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-profile-muted before:content-['//_'] before:text-profile-accent">
          projects
        </h2>
        <span className="font-mono text-[11px] text-profile-muted-2">#02</span>
        <div className="flex-1 border-t border-profile-line" aria-hidden="true" />
        <span className="font-mono text-[11px] text-profile-muted">
          ls ./projects · {items.length} items ·{' '}
          <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">j</kbd>{' '}
          <kbd className="rounded border border-profile-line-2 px-1 py-[1px] text-[10px] text-profile-muted">k</kbd>{' '}
          to navigate
        </span>
      </header>

      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-6">
        {items.map(item => (
          <div
            key={item.slug}
            className={item.featured ? 'md:col-span-6' : 'md:col-span-3'}
          >
            <ProjectCardV2 item={item} variant={item.featured ? 'featured' : 'default'} />
          </div>
        ))}
      </div>
    </section>
  )
}
