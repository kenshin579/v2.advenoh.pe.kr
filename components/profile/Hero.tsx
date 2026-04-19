'use client'

import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { HeroStats } from '@/lib/stats'
import type { ReadmeData } from '@/lib/profile-readme'
import { siteConfig } from '@/lib/site-config'
import { TypewriterPrompt } from './TypewriterPrompt'
import { StatsRow } from './StatsRow'

type HeroProps = {
  stats: HeroStats
  github: GithubContrib
  status: StatusSnapshot
  readme: ReadmeData
}

export function Hero({ stats, github, status, readme }: HeroProps) {
  const headline = readme.headline ?? siteConfig.author.jobTitle

  const kvs: Array<[string, string | undefined]> = [
    ['role', readme.role],
    ['focus', readme.focus],
    ['stack', readme.stack?.length ? readme.stack.join(' · ') : undefined],
    ['db', readme.db?.length ? readme.db.join(' · ') : undefined],
    ['cloud', readme.cloud?.length ? readme.cloud.join(' · ') : undefined],
    ['ci/cd', readme.cicd?.length ? readme.cicd.join(' · ') : undefined],
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
          <strong className="font-semibold text-profile-fg">{headline}</strong>
          <span className="text-profile-muted-2"> — </span>
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
