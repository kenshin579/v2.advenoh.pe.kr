'use client'

import { useRef, useEffect } from 'react'
import type { PortfolioItem } from '@/lib/portfolio'
import type { StatusSnapshot } from '@/lib/status'
import type { GithubContrib } from '@/lib/github'
import type { WritingItem } from '@/lib/writing'
import type { ReadmeData } from '@/lib/profile-readme'
import type { Dict, Locale } from '@/lib/i18n/types'
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
import { CommandPalette } from './CommandPalette'
import { ProjectModal } from './ProjectModal'
import { MobileSidebarDrawer } from './MobileSidebarDrawer'
import { MobileRightRailDrawer } from './MobileRightRailDrawer'

const SPY_SECTIONS = ['readme', 'projects', 'writing', 'writing-investment'] as const

type ProfileShellProps = {
  locale: Locale
  t: Dict
  initialStatus: StatusSnapshot
  initialWriting: {
    it: WritingItem[]
    investment: WritingItem[]
    latest: WritingItem[]
    totals: { it: number; investment: number }
  }
  portfolioItems: PortfolioItem[]
  github: GithubContrib
  readme: ReadmeData
}

export function ProfileShell({
  locale,
  t,
  initialStatus,
  initialWriting,
  portfolioItems,
  github,
  readme,
}: ProfileShellProps) {
  const status = useLiveStatus(initialStatus)
  const writing = useLiveWriting(initialWriting)
  const stats = computeHeroStats(status, github, writing.totals.it + writing.totals.investment)
  const activeSection = useScrollSpy(SPY_SECTIONS as unknown as string[])

  useKeyboardNav({ itemCount: portfolioItems.length })

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex min-h-screen flex-col bg-profile-bg text-profile-fg font-sans">
      <TitleBar status={status} activeSection={activeSection} t={t} />

      <div className="flex flex-1">
        <Sidebar status={status} activeSection={activeSection} t={t} />

        <main className="relative flex-1 overflow-x-hidden">
          <div className="mx-auto flex max-w-[1100px] gap-0 items-start">
            <LineGutter targetRef={contentRef} />

            <div
              ref={contentRef}
              className="min-w-0 flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]"
            >
              <Hero stats={stats} github={github} status={status} readme={readme} t={t} />

              <QuoteBlock t={t} />

              <ProjectGrid items={portfolioItems} t={t} />

              <WritingList id="writing" title="writing.it" hash="#03" items={writing.it} t={t} />

              <WritingList id="writing-investment" title="writing.inv" hash="#04" items={writing.investment} t={t} />
            </div>
          </div>
        </main>

        <RightRail github={github} latestPosts={writing.latest} status={status} t={t} />
      </div>

      <StatusBar section={activeSection ? `#${activeSection}` : '#readme'} t={t} />

      <NoiseOverlay />
      <CommandPalette projects={portfolioItems} latestPosts={writing.latest} t={t} />
      <ProjectModal items={portfolioItems} t={t} />
      <MobileSidebarDrawer status={status} activeSection={activeSection} t={t} />
      <MobileRightRailDrawer
        github={github}
        latestPosts={writing.latest}
        status={status}
        t={t}
      />
    </div>
  )
}
