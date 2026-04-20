import { getPortfolioItems } from '@/lib/portfolio'
import { getStatusSnapshot } from '@/lib/status'
import { getGithubContrib } from '@/lib/github'
import { getWritingSections, getLatestPosts } from '@/lib/writing'
import { loadReadme } from '@/lib/profile-readme'
import { getProjectsItemListStructuredData } from '@/lib/structured-data'
import { ProfileShell } from '@/components/profile/ProfileShell'

export default async function HomePage() {
  const [portfolioItems, status, github, writingSections, latestPosts] =
    await Promise.all([
      Promise.resolve(getPortfolioItems()),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(),
      getLatestPosts(6),
    ])

  const readme = loadReadme()
  const itemList = getProjectsItemListStructuredData(portfolioItems)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <ProfileShell
        initialStatus={status}
        initialWriting={{
          it: writingSections.it,
          investment: writingSections.investment,
          latest: latestPosts,
        }}
        portfolioItems={portfolioItems}
        github={github}
        readme={readme}
      />
    </>
  )
}
