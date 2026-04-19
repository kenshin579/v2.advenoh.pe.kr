'use client'

import type { PortfolioItem } from '@/lib/portfolio'
import type { Quote } from '@/lib/quotes'
import type { StatusSnapshot } from '@/lib/status'
import type { GithubContrib } from '@/lib/github'
import type { WritingItem } from '@/lib/writing'
import type { ReadmeData } from '@/lib/profile-readme'
import { computeHeroStats } from '@/lib/stats'
import { useLiveStatus } from '@/hooks/useLiveStatus'
import { useLiveWriting } from '@/hooks/useLiveWriting'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { RightRail } from './RightRail'
import { StatusBar } from './StatusBar'
import { LineGutter } from './LineGutter'
import { Hero } from './Hero'
import { ProjectGrid } from './ProjectGrid'
import { WritingList } from './WritingList'
import { QuoteBlock } from './QuoteBlock'
import { NoiseOverlay } from './NoiseOverlay'
import { TweaksPanel } from './TweaksPanel'
import { CommandPalette } from './CommandPalette'
import { ProjectModal } from './ProjectModal'

const SPY_SECTIONS = ['readme', 'projects', 'writing', 'writing-investment'] as const

type ProfileShellProps = {
  initialStatus: StatusSnapshot
  initialWriting: {
    it: WritingItem[]
    investment: WritingItem[]
    latest: WritingItem[]
  }
  portfolioItems: PortfolioItem[]
  quotes: Quote[]
  github: GithubContrib
  stack: string[]
  readme: ReadmeData
}

export function ProfileShell({
  initialStatus,
  initialWriting,
  portfolioItems,
  quotes,
  github,
  stack,
  readme,
}: ProfileShellProps) {
  const status = useLiveStatus(initialStatus)
  const writing = useLiveWriting(initialWriting)
  const stats = computeHeroStats(status, github, writing.it)
  const activeSection = useScrollSpy(SPY_SECTIONS as unknown as string[])

  useKeyboardNav({ itemCount: portfolioItems.length })

  return (
    <div className="flex min-h-screen flex-col bg-profile-bg text-profile-fg font-sans">
      <TitleBar status={status} activeSection={activeSection} />

      <div className="flex flex-1">
        <Sidebar status={status} activeSection={activeSection} />

        <main className="relative flex-1 overflow-x-hidden">
          <div className="mx-auto flex max-w-[1100px] gap-0">
            <LineGutter />

            <div className="flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]">
              <Hero stats={stats} github={github} status={status} stack={stack} readme={readme} />

              <QuoteBlock quotes={quotes} />

              <ProjectGrid items={portfolioItems} />

              <WritingList id="writing" title="writing.it" items={writing.it} />

              <WritingList id="writing-investment" title="writing.inv" items={writing.investment} />
            </div>
          </div>
        </main>

        <RightRail github={github} latestPosts={writing.latest} status={status} />
      </div>

      <StatusBar section={activeSection ? `#${activeSection}` : '#readme'} />

      <NoiseOverlay />
      <TweaksPanel />
      <CommandPalette projects={portfolioItems} latestPosts={writing.latest} />
      <ProjectModal items={portfolioItems} />
    </div>
  )
}
