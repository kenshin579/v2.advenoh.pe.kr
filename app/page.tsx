import { getPortfolioItems } from '@/lib/portfolio'
import { getQuotes } from '@/lib/quotes'
import { getStatusSnapshot } from '@/lib/status'
import { getGithubContrib } from '@/lib/github'
import { getWritingSections, getLatestPosts } from '@/lib/writing'
import { getSkills } from '@/lib/skills'
import { getHeroStats } from '@/lib/stats'
import { TitleBar } from '@/components/profile/TitleBar'
import { Sidebar } from '@/components/profile/Sidebar'
import { RightRail } from '@/components/profile/RightRail'
import { StatusBar } from '@/components/profile/StatusBar'
import { LineGutter } from '@/components/profile/LineGutter'
import { Hero } from '@/components/profile/Hero'
import { ProjectGrid } from '@/components/profile/ProjectGrid'
import { WritingList } from '@/components/profile/WritingList'
import { QuoteBlock } from '@/components/profile/QuoteBlock'
import { NoiseOverlay } from '@/components/profile/NoiseOverlay'
import { TweaksPanel } from '@/components/profile/TweaksPanel'
import { CommandPalette } from '@/components/profile/CommandPalette'
import { ProjectModal } from '@/components/profile/ProjectModal'

export default async function HomePage() {
  const [portfolioItems, quotes, status, github, writingSections, latestPosts, skills, stats] =
    await Promise.all([
      Promise.resolve(getPortfolioItems()),
      Promise.resolve(getQuotes()),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(),
      getLatestPosts(6),
      getSkills(),
      getHeroStats(),
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
              <Hero stats={stats} github={github} status={status} skills={skills} />

              <ProjectGrid items={portfolioItems} />

              <WritingList id="writing" title="writing.it" items={writingSections.it} />

              <section id="writing-investment" aria-label="recent investment writing" className="space-y-3">
                <WritingList id="writing-investment-list" title="writing.inv" items={writingSections.investment} />
                <QuoteBlock quotes={quotes} />
              </section>
            </div>
          </div>
        </main>

        <RightRail github={github} latestPosts={latestPosts} status={status} />
      </div>

      <StatusBar />

      {/* Overlays */}
      <NoiseOverlay />
      <TweaksPanel />
      <CommandPalette projects={portfolioItems} latestPosts={latestPosts} />
      <ProjectModal items={portfolioItems} />
    </div>
  )
}
