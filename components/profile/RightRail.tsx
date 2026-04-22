'use client'

import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { WritingItem } from '@/lib/writing'
import { RightRailContent } from './RightRailContent'

type RightRailProps = {
  github: GithubContrib
  latestPosts: WritingItem[]
  status: StatusSnapshot
}

export function RightRail({ github, latestPosts, status }: RightRailProps) {
  return (
    <aside
      aria-label="Profile activity panel"
      className="hidden xl:flex w-[300px] shrink-0 flex-col border-l border-profile-line bg-profile-bg-2 p-4"
    >
      <RightRailContent github={github} latestPosts={latestPosts} status={status} />
    </aside>
  )
}
