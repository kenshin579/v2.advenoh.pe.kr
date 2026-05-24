'use client'

import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { WritingItem } from '@/lib/writing'
import type { Dict } from '@/lib/i18n/types'
import { RightRailContent } from './RightRailContent'

type RightRailProps = {
  github: GithubContrib
  latestPosts: WritingItem[]
  status: StatusSnapshot
  t: Dict
}

export function RightRail({ github, latestPosts, status, t }: RightRailProps) {
  return (
    <aside
      aria-label={t.a11y.activityPanel}
      className="hidden xl:flex w-[300px] shrink-0 flex-col border-l border-profile-line bg-profile-bg-2 p-4"
    >
      <RightRailContent github={github} latestPosts={latestPosts} status={status} t={t} />
    </aside>
  )
}
