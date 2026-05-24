import { getPortfolioItems } from '@/lib/portfolio'
import { getStatusSnapshot } from '@/lib/status'
import { getGithubContrib } from '@/lib/github'
import { getWritingSections, getLatestPosts } from '@/lib/writing'
import { loadReadme } from '@/lib/profile-readme'
import type { Locale } from '@/lib/i18n/types'

export async function loadHomeData(locale: Locale) {
  const [portfolioItems, status, github, writingSections, latestPosts] =
    await Promise.all([
      Promise.resolve(getPortfolioItems(locale)),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(),
      getLatestPosts(10),
    ])

  const readme = loadReadme(locale)

  return {
    portfolioItems,
    status,
    github,
    writing: {
      it: writingSections.it,
      investment: writingSections.investment,
      latest: latestPosts,
    },
    readme,
  }
}
