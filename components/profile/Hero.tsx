'use client'

import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { HeroStats } from '@/lib/stats'
import type { ReadmeData } from '@/lib/profile-readme'
import { TypewriterPrompt } from './TypewriterPrompt'
import { StatsRow } from './StatsRow'

type HeroProps = {
  stats: HeroStats
  github: GithubContrib
  status: StatusSnapshot
  stack: string[]
  readme: ReadmeData
}

export function Hero({ stats, github, status, stack, readme }: HeroProps) {
  const kvs: Array<[string, string | undefined]> = [
    ['role', readme.role],
    ['focus', readme.focus],
    ['stack', stack.length > 0 ? stack.join(' · ') : undefined],
    ['based', readme.based],
    ['xp', readme.xp],
  ]

  return (
    <section
      id="readme"
      aria-label="readme"
      className="rounded-lg border border-profile-line bg-profile-bg-2 p-6 sm:p-8 space-y-6"
    >
      <TypewriterPrompt />

      <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-profile-fg sm:text-7xl md:text-8xl">
        <span className="text-profile-accent">//</span> frank oh<span className="text-profile-muted-2">;</span>
      </h1>

      {readme.body && (
        <p className="max-w-2xl text-sm leading-relaxed text-profile-fg-2 whitespace-pre-line">
          {readme.body}
        </p>
      )}

      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-xs sm:text-sm">
        {kvs.map(([k, v]) => (
          v ? (
            <div key={k} className="contents">
              <dt className="text-profile-muted-2">{k}</dt>
              <dd className="text-profile-fg-2">{v}</dd>
            </div>
          ) : null
        ))}
      </dl>

      <StatsRow stats={stats} github={github} status={status} />
    </section>
  )
}
