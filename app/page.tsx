import { getPortfolioItems } from '@/lib/portfolio'
import { getStatusSnapshot } from '@/lib/status'
import { getGithubContrib } from '@/lib/github'
import { getWritingSections, getLatestPosts } from '@/lib/writing'
import { getSkills } from '@/lib/skills'
import { TitleBar } from '@/components/profile/TitleBar'
import { Sidebar } from '@/components/profile/Sidebar'
import { RightRail } from '@/components/profile/RightRail'
import { StatusBar } from '@/components/profile/StatusBar'
import { LineGutter } from '@/components/profile/LineGutter'

export default async function HomePage() {
  const [portfolioItems, status, github, writingSections, latestPosts, skills] =
    await Promise.all([
      Promise.resolve(getPortfolioItems()),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(),
      getLatestPosts(6),
      getSkills(),
    ])

  return (
    <div className="flex min-h-screen flex-col bg-profile-bg text-profile-fg font-sans">
      <TitleBar status={status} />

      <div className="flex flex-1">
        <Sidebar status={status} />

        <main className="relative flex-1 overflow-x-hidden">
          <div className="mx-auto flex max-w-[1100px] gap-0">
            <LineGutter />

            <div className="flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]">
              {/* 3B: Hero */}
              <section id="readme" aria-label="readme">
                <div className="rounded-lg border border-profile-line bg-profile-bg-2 p-6 text-profile-muted">
                  {/* TODO: Hero · TypewriterPrompt · StatsRow · Sparkline */}
                  <div className="font-mono text-sm">
                    frank@seoul:~/profile (main)${' '}
                    <span className="text-profile-fg">cat README.md</span>
                  </div>
                  <h1 className="mt-4 font-display text-5xl font-bold text-profile-fg sm:text-7xl">
                    // frank oh;
                  </h1>
                  <p className="mt-6 max-w-xl text-sm text-profile-fg-2">
                    Hero · KV list · Stats 영역 — Phase 3B에서 구현
                  </p>
                  <p className="mt-2 font-mono text-xs text-profile-muted-2">
                    detected skills: {skills.flat.slice(0, 5).join(', ')}…
                  </p>
                </div>
              </section>

              {/* 3C: Projects */}
              <section id="projects" aria-label="projects">
                <header className="mb-3 flex items-baseline justify-between border-b border-profile-line-2 pb-2">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-profile-muted">
                    projects/
                  </h2>
                  <span className="font-mono text-[11px] text-profile-muted-2">
                    {String(portfolioItems.length).padStart(2, '0')} items
                  </span>
                </header>
                <ul className="grid gap-3">
                  {portfolioItems.map(item => (
                    <li
                      key={item.slug}
                      className="rounded border border-profile-line bg-profile-bg-2 p-3 font-mono text-xs"
                    >
                      <span className="text-profile-accent">
                        {item.slug}
                        {item.ext ?? ''}
                      </span>{' '}
                      — <span className="text-profile-fg-2">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 3C: Writing IT */}
              <section id="writing" aria-label="recent IT writing">
                <header className="mb-3 border-b border-profile-line-2 pb-2">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-profile-muted">
                    writing.it
                  </h2>
                </header>
                <ul className="flex flex-col gap-1 font-mono text-xs">
                  {writingSections.it.length === 0 && (
                    <li className="text-profile-muted-2">no recent posts</li>
                  )}
                  {writingSections.it.map(item => (
                    <li key={item.link} className="flex gap-2">
                      <span className="inline-flex h-4 shrink-0 items-center rounded bg-profile-accent-soft px-1 text-[9px] font-semibold text-profile-accent">
                        IT
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="truncate text-profile-fg-2 hover:text-profile-fg"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 3C: Writing Investment + Quote */}
              <section id="writing-investment" aria-label="recent investment writing">
                <header className="mb-3 border-b border-profile-line-2 pb-2">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-profile-muted">
                    writing.inv
                  </h2>
                </header>
                <ul className="flex flex-col gap-1 font-mono text-xs">
                  {writingSections.investment.length === 0 && (
                    <li className="text-profile-muted-2">no recent posts</li>
                  )}
                  {writingSections.investment.map(item => (
                    <li key={item.link} className="flex gap-2">
                      <span className="inline-flex h-4 shrink-0 items-center rounded bg-profile-line-2 px-1 text-[9px] font-semibold text-profile-fg-2">
                        INV
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="truncate text-profile-fg-2 hover:text-profile-fg"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {/* TODO: QuoteBlock */}
              </section>
            </div>
          </div>
        </main>

        <RightRail github={github} latestPosts={latestPosts} status={status} />
      </div>

      <StatusBar />

      {/* TODO: CommandPalette · ProjectModal · TweaksPanel · NoiseOverlay */}
    </div>
  )
}
