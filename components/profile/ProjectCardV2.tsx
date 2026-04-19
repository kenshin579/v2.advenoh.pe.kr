import Image from 'next/image'
import type { PortfolioItem } from '@/lib/portfolio'

type ProjectCardV2Props = {
  item: PortfolioItem
  variant?: 'featured' | 'default'
}

export function ProjectCardV2({ item, variant = 'default' }: ProjectCardV2Props) {
  const dek = item.dek ?? item.description
  const isLive = item.status?.toLowerCase().startsWith('live') ?? false
  const coverSrc = item.cover ? `/portfolio/${item.slug}/${item.cover}` : null

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-profile-line bg-profile-bg-2 transition hover:border-profile-line-2 hover:bg-profile-bg-3 ${
        variant === 'featured' ? 'md:grid md:grid-cols-[1.2fr_1fr]' : ''
      }`}
    >
      {coverSrc && (
        <div
          className={`relative overflow-hidden border-b border-profile-line bg-profile-bg-3 ${
            variant === 'featured' ? 'md:border-b-0 md:border-r md:border-profile-line' : ''
          }`}
        >
          <div
            className={`relative w-full ${
              variant === 'featured' ? 'h-[240px] md:h-full md:min-h-[260px]' : 'aspect-[16/10]'
            }`}
          >
            <Image
              src={coverSrc}
              alt={item.title}
              fill
              unoptimized
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes={variant === 'featured' ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <header className="flex items-center justify-between gap-2">
          <h3 className="font-mono text-sm">
            <span className="text-profile-fg">{item.slug}</span>
            <span className="text-profile-accent">{item.ext ?? ''}</span>
          </h3>
          {isLive && (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-profile-green"
              title={item.status}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-profile-green"
                style={{ animation: 'profile-pulse 1.6s ease-in-out infinite' }}
              />
              {item.status}
            </span>
          )}
        </header>

        <h4 className="font-display text-lg font-semibold text-profile-fg">{item.title}</h4>

        <p className="line-clamp-3 text-sm text-profile-fg-2">{dek}</p>

        {item.stack && item.stack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {item.stack.map(tech => (
              <li
                key={tech}
                className="rounded border border-profile-line-2 bg-profile-bg-3 px-1.5 py-0.5 font-mono text-[10px] text-profile-fg-2"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-auto flex items-center justify-between pt-2 font-mono text-[10px] text-profile-muted-2">
          <div className="flex gap-3">
            {item.year && <span>{item.year}</span>}
            {item.role && <span>· {item.role}</span>}
          </div>
          <a
            href={item.site}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 rounded border border-profile-line-2 bg-profile-bg-3 px-1.5 py-0.5 text-profile-fg-2 hover:border-profile-accent hover:text-profile-accent"
          >
            ↵ open ↗
          </a>
        </footer>
      </div>
    </article>
  )
}
