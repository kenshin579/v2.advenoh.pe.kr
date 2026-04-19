import type { StatusSnapshot } from './status'
import type { GithubContrib } from './github'
import type { WritingItem } from './writing'

export type HeroStats = {
  servicesUp: { up: number; total: number }
  commits26w: number
  uptime90d: number
  blogPosts: number
}

/**
 * Hero 4-cell stats 집계. 서버/클라이언트 공용 순수 함수.
 * 서버(page.tsx)는 초기값 계산, 클라이언트는 useLiveStatus/Writing 적용 후 재계산.
 */
export function computeHeroStats(
  status: StatusSnapshot,
  github: GithubContrib,
  blogItems: WritingItem[]
): HeroStats {
  return {
    servicesUp: { up: status.summary.up, total: status.summary.total },
    commits26w: github.totalContributions,
    uptime90d: status.summary.uptime90d,
    blogPosts: blogItems.length,
  }
}
