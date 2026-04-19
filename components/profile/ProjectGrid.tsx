'use client'

import type { PortfolioItem } from '@/lib/portfolio'
import { ProjectCardV2 } from './ProjectCardV2'

type ProjectGridProps = {
  items: PortfolioItem[]
}

export function ProjectGrid({ items }: ProjectGridProps) {
  const featured = items.find(i => i.featured)
  const others = items.filter(i => !i.featured)

  return (
    <section id="projects" aria-label="projects" className="space-y-4">
      <header className="flex items-baseline justify-between border-b border-profile-line-2 pb-2">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-profile-muted">
          projects/
        </h2>
        <span className="font-mono text-[11px] text-profile-muted-2">
          {String(items.length).padStart(2, '0')} items
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {featured && (
          <div className="md:col-span-2">
            <ProjectCardV2 item={featured} variant="featured" />
          </div>
        )}
        {others.map(item => (
          <ProjectCardV2 key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}
