'use client'

import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { WritingItem } from '@/lib/writing'
import { CommitGraph } from './CommitGraph'

type RightRailContentProps = {
  github: GithubContrib
  latestPosts: WritingItem[]
  status: StatusSnapshot
}

export function RightRailContent({ github, latestPosts, status }: RightRailContentProps) {
  return (
    <div className="flex flex-col gap-6 font-mono text-xs">
      <div>
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-profile-muted-2">
          <span>Commits · 26w</span>
          <span>{github.totalContributions}</span>
        </div>
        <CommitGraph data={github} size="sm" />
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          Latest posts
        </div>
        <ul className="flex flex-col gap-1.5">
          {latestPosts.length === 0 && (
            <li className="text-profile-muted-2">no recent posts</li>
          )}
          {latestPosts.map(item => (
            <li key={item.link} className="flex gap-2">
              <span
                className={`mt-0.5 inline-flex h-4 shrink-0 items-center rounded px-1 text-[9px] font-semibold ${
                  item.source === 'IT'
                    ? 'bg-profile-accent-soft text-profile-accent'
                    : 'bg-profile-line-2 text-profile-fg-2'
                }`}
              >
                {item.source}
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer noopener"
                className="line-clamp-2 text-profile-fg-2 hover:text-profile-fg"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          System
        </div>
        <dl className="flex flex-col gap-1 text-profile-muted">
          <div className="flex justify-between">
            <dt>services</dt>
            <dd className="text-profile-fg-2">
              {status.summary.up}/{status.summary.total}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>uptime · 90d</dt>
            <dd className="text-profile-fg-2">{status.summary.uptime90d.toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt>region</dt>
            <dd className="text-profile-fg-2">seoul</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
