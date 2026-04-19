import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { HeroStats } from '@/lib/stats'
import { pickHeroStack, type Skills } from '@/lib/skills'
import { TypewriterPrompt } from './TypewriterPrompt'
import { StatsRow } from './StatsRow'

type ReadmeData = {
  role?: string
  focus?: string
  based?: string
  xp?: string
  body: string
}

function loadReadme(): ReadmeData {
  try {
    const p = path.join(process.cwd(), 'contents/profile/readme.md')
    const raw = fs.readFileSync(p, 'utf8')
    const { data, content } = matter(raw)
    return {
      role: typeof data.role === 'string' ? data.role : undefined,
      focus: typeof data.focus === 'string' ? data.focus : undefined,
      based: typeof data.based === 'string' ? data.based : undefined,
      xp: typeof data.xp === 'string' ? data.xp : undefined,
      body: content.trim(),
    }
  } catch {
    return { body: '' }
  }
}

type HeroProps = {
  stats: HeroStats
  github: GithubContrib
  status: StatusSnapshot
  skills: Skills
}

export function Hero({ stats, github, status, skills }: HeroProps) {
  const readme = loadReadme()
  const stack = pickHeroStack(skills)

  const kvs: Array<[string, string | undefined]> = [
    ['role', readme.role],
    ['focus', readme.focus],
    ['stack', stack.join(' · ')],
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
