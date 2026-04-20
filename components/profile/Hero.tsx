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

      <h1 className="font-display font-medium leading-[0.9] tracking-[-0.035em] text-profile-fg text-5xl sm:text-7xl md:text-8xl">
        <span className="text-profile-muted">//</span>
        {' '}
        frank{' '}
        <span className="text-profile-accent">oh</span>
        <span className="text-profile-muted-2">;</span>
      </h1>

      {readme.body && (
        <p className="max-w-2xl text-sm leading-relaxed text-profile-fg-2 whitespace-pre-line">
          <strong className="font-semibold text-profile-fg">{headline}</strong>
          <span className="text-profile-muted-2"> — </span>
          {readme.body}
        </p>
      )}

      <dl className="mt-7 mb-3 grid grid-cols-[120px_1fr] gap-x-5 gap-y-[7px] font-mono text-[13px]">
        {kvs.map(([k, v]) => (
          v ? (
            <div key={k} className="contents">
              <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">{k}</dt>
              <dd className="text-profile-fg">{v}</dd>
            </div>
          ) : null
        ))}
      </dl>

      <StatsRow stats={stats} github={github} status={status} />
    </section>
  )
}
