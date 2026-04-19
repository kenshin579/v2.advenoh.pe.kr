'use client'

import type { PortfolioItem } from '@/lib/portfolio'
import { ProjectCardV2 } from './ProjectCardV2'

type ProjectGridProps = {
  items: PortfolioItem[]
}

export function ProjectGrid({ items }: ProjectGridProps) {
  return (
    <section id="projects" aria-label="projects" className="space-y-4">
      <header className="flex items-baseline gap-3 pb-2">
        <h2 className="font-mono text-[13px] uppercase tracking-widest text-profile-fg">
          projects
        </h2>
        <span className="font-mono text-[11px] text-profile-muted-2">#02</span>
        <div className="flex-1 border-t border-profile-line-2" aria-hidden="true" />
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
