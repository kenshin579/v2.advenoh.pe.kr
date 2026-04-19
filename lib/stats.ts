import { getStatusSnapshot } from './status'
import { getGithubContrib } from './github'
import { getWritingBlog } from './writing'

export type HeroStats = {
  servicesUp: { up: number; total: number }
  commits26w: number
  uptime90d: number
  blogPosts: number
}

/**
 * Hero 4-cell stats 집계.
 * 각 소스는 개별 캐시/폴백이 있으므로 하나가 실패해도 다른 값은 살아 있음.
 */
export async function getHeroStats(): Promise<HeroStats> {
  const [status, github, blog] = await Promise.all([
    getStatusSnapshot(),
    getGithubContrib(),
    getWritingBlog(),
  ])

  return {
    servicesUp: { up: status.summary.up, total: status.summary.total },
    commits26w: github.totalContributions,
    uptime90d: status.summary.uptime90d,
    blogPosts: blog.items.length,
  }
}
